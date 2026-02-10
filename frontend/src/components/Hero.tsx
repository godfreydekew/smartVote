import React from 'react';
import { Button } from './ui/button';
import { Shield, Check, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center py-20 md:py-32 overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-white/80 backdrop-blur-sm" />
      
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-vote-blue/20 via-transparent to-transparent animate-pulse" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-vote-blue/10 to-vote-teal/10 text-vote-blue text-sm font-semibold tracking-wide">
              Your Vote Counts!
            </span>
          </motion.div>

          <motion.h1 
            variants={itemVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            Voting <span className="bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">using Blockchain</span> Technology
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Transform electoral systems with decentralized security and transparency. 
            Our blockchain technology ensures tamper-proof voting that's accessible to everyone.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
          >
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 shadow-lg hover:shadow-xl hover:shadow-vote-blue/25 transition-all duration-300"
                onClick={() => navigate('/signup')}
              >
              Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
            </motion.div>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Shield, text: "Tamper-proof", delay: 0.1 },
              { icon: Check, text: "Transparent", delay: 0.2 },
              { icon: Lock, text: "End-to-end encrypted", delay: 0.3 }
            ].map((item, index) => (
              <motion.div
                key={item.text}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
                transition={{ delay: item.delay }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="flex items-center justify-center space-x-3 p-4 bg-white/80 rounded-2xl backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300"
          >
                <div className="p-2 rounded-full bg-gradient-to-r from-vote-blue/10 to-vote-teal/10">
                  <item.icon size={24} className="text-vote-blue" />
            </div>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;