import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const faqData = [
  {
    key: 'blockchain',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    key: 'security',
    color: 'from-vote-blue to-vote-teal',
  },
  {
    key: 'privacy',
    color: 'from-indigo-500 to-vote-blue',
  },
  {
    key: 'verification',
    color: 'from-vote-teal to-emerald-500',
  },
  {
    key: 'technical',
    color: 'from-vote-blue to-cyan-500',
  },
  {
    key: 'accessibility',
    color: 'from-vote-teal to-emerald-500',
  },
];

const Faq = () => {
  const navigate = useNavigate();
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

  const onStillHaveQuestions = () => {
    navigate('/contact');
  };

  return (
    <section id="faq" className="py-24 bg-gradient-to-b from-white to-gray-50/50">
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
              {t('faq.badge')}
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            {t('faq.title')}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {t('faq.subtitle')}
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="bg-white rounded-2xl shadow-lg border border-gray-100/50">
            {faqData.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 last:border-0">
                <AccordionTrigger className="px-8 py-6 hover:no-underline group">
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-r ${faq.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                    >
                      <HelpCircle className="h-5 w-5 text-vote-blue" />
                    </div>
                    <span className="text-left font-medium text-gray-900 group-hover:text-vote-blue transition-colors">
                      {t(`faq.questions.${faq.key}.question`)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-600 leading-relaxed">
                  {t(`faq.questions.${faq.key}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Button
            size="lg"
            className="rounded-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 shadow-lg hover:shadow-xl hover:shadow-vote-blue/25 transition-all duration-300 px-8 py-6"
            onClick={onStillHaveQuestions}
          >
            {t('faq.stillHaveQuestions')}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
