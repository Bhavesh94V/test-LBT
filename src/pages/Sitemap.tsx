import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const sitemapSections = [
  {
    title: 'Main Pages',
    links: [
      { name: 'Home', href: '/' },
      { name: 'Properties', href: '/properties' },
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact Us', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { name: 'FAQs', href: '/faqs' },
      { name: 'Blogs & Articles', href: '/blogs' },
      { name: 'Corporate Buying', href: '/corporate-buying' },
    ],
  },
  {
    title: 'User Account',
    links: [
      { name: 'Your Groups', href: '/your-groups' },
      { name: 'Your Payments', href: '/your-payments' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Privacy Policy', href: '/privacy' },
    ],
  },
];

const Sitemap: React.FC = () => {
  return (
    <>
      <section className="bg-surface-offwhite py-16 md:py-24">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="heading-hero text-foreground mb-6">Sitemap</h1>
            <p className="body-large text-muted-foreground">
              Find everything you need on Let's Buy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {sitemapSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h2 className="font-display font-semibold text-foreground text-lg mb-6">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Sitemap;
