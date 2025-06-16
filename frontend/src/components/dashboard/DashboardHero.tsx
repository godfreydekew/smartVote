import React from 'react';
import { Calendar, Users, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const DashboardHero = () => {
  const isMobile = useIsMobile();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const features = [
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      text: "Secure & Transparent Voting"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: "Real-time Results"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Community Driven"
    }
  ];
  
  return (
    <section className="bg-gradient-to-r from-vote-blue to-vote-teal text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 relative">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center mb-6"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Welcome to SmartVote
            </h1>
            <p className="text-white/90 text-sm md:text-base max-w-2xl mx-auto mb-6">
              Your voice matters. Participate in active elections and shape decisions that impact our community.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-3 mb-6"
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm"
              >
                {feature.icon}
                <span>{feature.text}</span>
              </div>
            ))}
          </motion.div>


        </motion.div>

        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6"
        >
        </motion.div>
      </div>
    </section>
  );
};
