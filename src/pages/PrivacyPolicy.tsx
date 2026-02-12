import React from 'react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <section className="bg-surface-offwhite py-16 md:py-24">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="heading-hero text-foreground mb-6">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as your name, email address, phone number, and property preferences when you register for an account or express interest in properties.
            </p>

            <h2>2. How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Facilitate group buying activities</li>
              <li>Communicate with you about properties and groups</li>
              <li>Improve our services and user experience</li>
              <li>Send you relevant updates and notifications</li>
            </ul>

            <h2>3. Information Sharing</h2>
            <p>
              We may share your information with developers and other group members to facilitate group buying. We do not sell your personal information to third parties.
            </p>

            <h2>4. Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.
            </p>

            <h2>5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar technologies to enhance your experience on our platform, analyze usage patterns, and improve our services.
            </p>

            <h2>6. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal information. You may also opt out of marketing communications at any time.
            </p>

            <h2>7. Data Retention</h2>
            <p>
              We retain your information for as long as necessary to provide our services and comply with legal obligations.
            </p>

            <h2>8. Changes to This Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please contact us at privacy@letsbuy.in.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
