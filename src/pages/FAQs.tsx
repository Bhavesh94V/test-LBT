import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'About Let\'s Buy',
    faqs: [
      {
        question: 'What is Let\'s Buy?',
        answer: 'Let\'s Buy is a group buying platform that helps verified home buyers come together to access better pricing through collective demand. We connect serious homebuyers with similar requirements to form buyer groups and negotiate better deals with developers.',
      },
      {
        question: 'Is Let\'s Buy a broker?',
        answer: 'No. Let\'s Buy does not act as a traditional broker and does not charge brokerage from buyers. We are a platform that facilitates group buying and structured pricing discussions.',
      },
      {
        question: 'Who can use Let\'s Buy?',
        answer: 'Let\'s Buy is designed for serious end-user home buyers who are actively planning to purchase a property. We verify buyer intent to ensure only genuine homebuyers are part of our groups.',
      },
    ],
  },
  {
    title: 'Fees, Discounts & Payments',
    faqs: [
      {
        question: 'How is estimated benefit calculated?',
        answer: 'The estimated benefit is indicative and based on buyer interest, project discussions, our negotiating power, and market context. Final terms are shared only after buyer alignment and actual pricing discussions with developers.',
      },
      {
        question: 'Do I have to pay brokerage?',
        answer: 'No. Let\'s Buy does not charge brokerage from buyers. Only a group joining fee may apply to confirm your participation in a buyer group.',
      },
      {
        question: 'What is the group joining fee?',
        answer: 'The group joining fee confirms buyer seriousness and allows us to formally include you in a buyer group. This fee helps us maintain quality groups with committed buyers.',
      },
      {
        question: 'Is the Joining Fee Refundable?',
        answer: 'Yes. The joining fee is fully refundable within the first 10 days from joining the group. After 10 days, the fee becomes non-refundable as Let\'s Buy has committed the buyer group to the developer. Buyer exits can directly affect negotiated terms for the entire group.',
      },
      {
        question: 'Are there any hidden charges?',
        answer: 'No. There are no hidden costs, brokerage fees, or extra commissions. All fees and terms are communicated clearly upfront.',
      },
    ],
  },
  {
    title: 'Buying Process & Timelines',
    faqs: [
      {
        question: 'How long does the group buying process take?',
        answer: 'Timelines vary by project. Real estate decisions often take weeks, and Let\'s Buy allows adequate time for buyers to decide. We work to form groups efficiently while ensuring all buyers are comfortable with the process.',
      },
      {
        question: 'Can I exit the process after joining?',
        answer: 'You may exit within the 10-day refund period with a full refund of your joining fee. After that, participation is considered a confirmed commitment as we have already begun discussions with developers on behalf of the group.',
      },
      {
        question: 'How does booking work?',
        answer: 'Each buyer completes booking individually and directly with the developer after group pricing is finalized. You own your property individually - Let\'s Buy only facilitates the group negotiation process.',
      },
      {
        question: 'What happens if the group doesn\'t form?',
        answer: 'If a group doesn\'t reach the required size or if pricing discussions don\'t result in acceptable terms, all joining fees are fully refunded to participants.',
      },
      {
        question: 'Can I choose my specific unit/apartment?',
        answer: 'Yes. While we negotiate group-level pricing with developers, each buyer selects their own unit and makes individual booking decisions. Your choice of apartment remains completely yours.',
      },
    ],
  },
];

const FAQs: React.FC = () => {
  return (
    <>
      {/* Hero */}
      <section className="bg-surface-offwhite py-16 md:py-24">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 mx-auto rounded-2xl gradient-brand flex items-center justify-center mb-6">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="heading-hero text-foreground mb-6">
              Frequently Asked <span className="text-primary">Questions</span>
            </h1>
            <p className="body-large text-muted-foreground">
              Everything you need to know about Let's Buy and how group buying works.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <h2 className="heading-card text-foreground mb-6">{category.title}</h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${categoryIndex}-${index}`}
                      className="bg-surface-offwhite rounded-xl border border-border px-6 data-[state=open]:shadow-md transition-shadow"
                    >
                      <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-surface-offwhite">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="heading-card text-foreground mb-4">Still Have Questions?</h2>
            <p className="body-base text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg btn-primary"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default FAQs;
