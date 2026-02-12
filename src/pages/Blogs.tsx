import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const blogPosts = [
  {
    id: 1,
    title: 'How Group Buying is Changing Real Estate in India',
    excerpt: 'Discover how collective purchasing power is helping homebuyers save lakhs on their dream homes. The concept of group buying has revolutionized various industries, and now it\'s making waves in the real estate sector.',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    date: 'Jan 15, 2026',
    readTime: '5 min read',
    category: 'Industry Insights',
  },
  {
    id: 2,
    title: '5 Things to Check Before Joining a Buyer Group',
    excerpt: 'Expert tips to ensure you make informed decisions when participating in group buying. From verifying the platform to understanding the terms, here\'s your complete checklist.',
    image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=800&q=80',
    date: 'Jan 10, 2026',
    readTime: '4 min read',
    category: 'Buying Tips',
  },
  {
    id: 3,
    title: 'Understanding Home Loan Eligibility in 2026',
    excerpt: 'A comprehensive guide to home loan eligibility criteria and how to maximize your borrowing capacity. Learn about income requirements, credit scores, and documentation needed.',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    date: 'Jan 05, 2026',
    readTime: '6 min read',
    category: 'Finance',
  },
  {
    id: 4,
    title: 'Top 5 Emerging Localities in Ahmedabad for 2026',
    excerpt: 'Looking to invest in Ahmedabad? Here are the top emerging localities that promise great returns and excellent living conditions for homebuyers.',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
    date: 'Dec 28, 2025',
    readTime: '5 min read',
    category: 'Market Trends',
  },
  {
    id: 5,
    title: 'First-Time Homebuyer? Here\'s What You Need to Know',
    excerpt: 'A beginner\'s guide to navigating the home buying process. From budgeting to documentation, we cover everything first-time buyers need to consider.',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80',
    date: 'Dec 20, 2025',
    readTime: '7 min read',
    category: 'Buying Tips',
  },
  {
    id: 6,
    title: 'The Psychology of Home Buying: Making the Right Decision',
    excerpt: 'Understanding the emotional and practical aspects of buying a home. How to balance wants vs needs and make a decision you won\'t regret.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80',
    date: 'Dec 15, 2025',
    readTime: '5 min read',
    category: 'Lifestyle',
  },
];

const categories = ['All', 'Industry Insights', 'Buying Tips', 'Finance', 'Market Trends', 'Lifestyle'];

const Blogs: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('All');

  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

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
            <h1 className="heading-hero text-foreground mb-6">
              Blogs & <span className="text-primary">Articles</span>
            </h1>
            <p className="body-large text-muted-foreground">
              Insights, tips, and market trends to help you make smarter home buying decisions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 bg-background border-b border-border sticky top-16 md:top-20 z-40">
        <div className="container-section">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding bg-background">
        <div className="container-section">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-property group cursor-pointer"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </div>
                  </div>
                  <h2 className="font-display font-semibold text-lg text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </div>
                    <span className="text-primary font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground mb-4">No articles found in this category.</p>
              <Button onClick={() => setSelectedCategory('All')} variant="outline">
                View All Articles
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="section-padding bg-surface-offwhite">
        <div className="container-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="heading-card text-foreground mb-4">Stay Updated</h2>
            <p className="body-base text-muted-foreground mb-6">
              Get the latest articles and market insights delivered to your inbox.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 h-12 px-4 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="btn-primary h-12 px-6">Subscribe</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default Blogs;
