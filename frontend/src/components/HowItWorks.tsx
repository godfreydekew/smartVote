import React, { useEffect, useRef } from 'react';
import { Users, ShieldCheck, Vote, Lock, Check, ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const steps = [
  {
    icon: Users,
    key: 'signup',
    color: 'from-vote-blue to-cyan-500',
  },
  {
    icon: ShieldCheck,
    key: 'authentication',
    color: 'from-vote-teal to-emerald-500',
  },
  {
    icon: Vote,
    key: 'voting',
    color: 'from-indigo-500 to-vote-blue',
  },
  {
    icon: Lock,
    key: 'recording',
    color: 'from-vote-blue to-vote-teal',
  },
  {
    icon: Check,
    key: 'verification',
    color: 'from-vote-teal to-emerald-500',
  },
];

const HowItWorks = () => {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-vote-blue/10 to-vote-teal/10 text-vote-blue text-sm font-semibold tracking-wide">
              {t('howItWorks.badge')}
            </span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
            {t('howItWorks.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">{t('howItWorks.subtitle')}</p>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* Progress Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform -translate-x-1/2">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-vote-blue to-vote-teal"
              style={{ height: progressWidth }}
            />
          </div>

          <div className="space-y-8 relative">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ delay: index * 0.2 }}
                className="flex flex-col md:flex-row items-center"
              >
                <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:order-last md:pl-12'}`}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50"
                  >
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">
                      {t(`howItWorks.steps.${step.key}.title`)}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{t(`howItWorks.steps.${step.key}.description`)}</p>
                  </motion.div>
                </div>

                <div className="relative z-10 my-4 md:my-0">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`p-4 rounded-2xl bg-gradient-to-r ${step.color} shadow-lg`}
                  >
                    <step.icon className="h-8 w-8 text-white" />
                  </motion.div>
                  {index < steps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                      className="hidden md:block absolute left-1/2 -bottom-8 transform -translate-x-1/2"
                    >
                      <ArrowRight className="h-6 w-6 text-gray-300 rotate-90" />
                    </motion.div>
                  )}
                </div>

                <div className={`md:w-1/2 ${index % 2 !== 0 ? 'md:pr-12 md:text-right' : 'md:order-last md:pl-12'}`}>
                  {index % 2 !== 0 ? (
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50 md:hidden"
                    >
                      <h3 className="text-xl font-semibold mb-3 text-gray-900">
                        {t(`howItWorks.steps.${step.key}.title`)}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">{t(`howItWorks.steps.${step.key}.description`)}</p>
                    </motion.div>
                  ) : (
                    <div className="hidden md:block"></div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
