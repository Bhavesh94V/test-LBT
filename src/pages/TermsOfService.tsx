import React from 'react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  return (
    <>
      <section className="bg-surface-offwhite py-16 md:py-24">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="heading-hero text-foreground mb-6">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 1, 2026</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="max-w-3xl mx-auto prose prose-lg">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing and using Let's Buy ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              Let's Buy is a group buying platform that connects verified home buyers to facilitate collective purchasing of residential properties. We do not act as a real estate broker and do not charge brokerage fees from buyers.
            </p>

            <h2>3. User Eligibility</h2>
            <p>
              Our services are intended for serious end-user home buyers who are actively planning to purchase property. You must be at least 18 years old and legally capable of entering into binding contracts.
            </p>

            <h2>4. Registration and Account</h2>
            <p>
              To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information and to update such information to keep it accurate, current, and complete.
            </p>

            <h2>5. Group Joining Fee</h2>
            <p>
              A group joining fee may be required to participate in buyer groups. This fee is fully refundable within 10 days of joining. After 10 days, the fee becomes non-refundable as Let's Buy commits the buyer group to the developer.
            </p>

            <h2>6. No Brokerage</h2>
            <p>
              Let's Buy does not charge brokerage from buyers. The group joining fee is the only fee applicable, and there are no hidden charges or commissions.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              Let's Buy facilitates group buying but does not guarantee any specific discounts or pricing. All property transactions are between the buyer and the developer directly.
            </p>

            <h2>8. Modifications to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the Platform after such modifications constitutes acceptance of the new terms.
            </p>

            <h2>9. Contact Information</h2>
            <p>
              For any questions regarding these terms, please contact us at legal@letsbuy.in.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfService;
