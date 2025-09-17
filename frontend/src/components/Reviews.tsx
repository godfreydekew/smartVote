import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const reviewsData = [
  {
    key: 'sarah',
    rating: 5,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'michael',
    rating: 5,
    color: 'from-vote-blue to-vote-teal',
  },
  {
    key: 'emily',
    rating: 5,
    color: 'from-indigo-500 to-vote-blue',
  },
];

const Reviews = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section id="reviews" className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-vote-blue/10 to-vote-teal/10 text-vote-blue text-sm font-semibold tracking-wide">
              {t('reviews.badge')}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            {t('reviews.title')}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('reviews.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {reviewsData.map((review, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -10 }} className="group">
              <div className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50">
                <div
                  className={`absolute top-0 right-0 p-4 rounded-bl-2xl bg-gradient-to-r ${review.color} opacity-10`}
                >
                  <Quote className="h-8 w-8 text-white" />
                </div>

                <div className="flex items-center space-x-1 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={20} className="fill-vote-blue text-vote-blue" />
                  ))}
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">{t(`reviews.reviews.${review.key}.content`)}</p>

                <div className="border-t border-gray-100 pt-6">
                  <h4 className="font-semibold text-gray-900">{t(`reviews.reviews.${review.key}.name`)}</h4>
                  <p className="text-sm text-gray-500">{t(`reviews.reviews.${review.key}.role`)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Reviews;
