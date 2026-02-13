import { createTransporter } from '../config/gmail.js';

class EmailService {
  async sendEmail(to, subject, htmlContent) {
    try {
      const transporter = await createTransporter();

      const mailOptions = {
        from: process.env.GMAIL_FROM_EMAIL,
        to: to,
        subject: subject,
        html: htmlContent,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendInquiryNotification(inquiryData) {
    try {
      const htmlContent = `
        <h2>New Property Inquiry</h2>
        <p><strong>Name:</strong> ${inquiryData.fullName}</p>
        <p><strong>Email:</strong> ${inquiryData.email}</p>
        <p><strong>Phone:</strong> ${inquiryData.phone}</p>
        <p><strong>Property:</strong> ${inquiryData.propertyName}</p>
        <p><strong>Configuration:</strong> ${inquiryData.configurationInterested}</p>
        <p><strong>Timeline:</strong> ${inquiryData.timeline}</p>
        <p><strong>Message:</strong> ${inquiryData.comments || 'N/A'}</p>
      `;

      return await this.sendEmail(
        process.env.GMAIL_FROM_EMAIL,
        'New Property Inquiry',
        htmlContent
      );
    } catch (error) {
      console.error('Error sending inquiry notification:', error);
      throw error;
    }
  }

  async sendPaymentLink(email, paymentLink, propertyName, amount) {
    try {
      const htmlContent = `
        <h2>Payment Link for ${propertyName}</h2>
        <p>Amount: ₹${amount}</p>
        <p><a href="${paymentLink}">Click here to make payment</a></p>
        <p>If the link doesn't work, copy and paste this URL in your browser:</p>
        <p>${paymentLink}</p>
      `;

      return await this.sendEmail(
        email,
        `Payment Link - ${propertyName}`,
        htmlContent
      );
    } catch (error) {
      console.error('Error sending payment link:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email, fullName) {
    try {
      const htmlContent = `
        <h2>Welcome to Let's Buy!</h2>
        <p>Hi ${fullName},</p>
        <p>Thank you for joining Let's Buy. We're excited to help you find your dream property.</p>
        <p>Best regards,<br>Let's Buy Team</p>
      `;

      return await this.sendEmail(email, 'Welcome to Let\'s Buy!', htmlContent);
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }

  async sendBulkEmails(recipients, subject, htmlContent) {
    try {
      const results = [];

      for (const recipient of recipients) {
        try {
          const result = await this.sendEmail(recipient, subject, htmlContent);
          results.push({ recipient, success: true, ...result });
        } catch (error) {
          results.push({
            recipient,
            success: false,
            error: error.message,
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      throw error;
    }
  }
}

export default new EmailService();
