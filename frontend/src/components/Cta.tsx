import React from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { ArrowRight, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Cta = () => {
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

  const onContact = () => {
    navigate("/contact");
  }

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white relative overflow-hidden">
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
          whileInView="visible"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-vote-blue to-vote-teal rounded-3xl p-1">
            <div className="absolute inset-0 bg-gradient-to-br from-vote-blue/20 to-vote-teal/20 rounded-3xl blur-2xl" />
          </div>
          
          <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl px-8 py-16 md:py-20 text-center border border-gray-100/50 shadow-xl">
            <motion.div variants={itemVariants} className="mb-6">
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-vote-blue/10 to-vote-teal/10 text-vote-blue text-sm font-semibold tracking-wide">
                Get Started
              </span>
            </motion.div>

            <motion.h2 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
            >
              Ready to Transform <span className="bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">Voting</span> For Your Organization?
            </motion.h2>

            <motion.p 
              variants={itemVariants}
              className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Whether you're running a national election, corporate voting, or university elections, 
              Şeffaf Katılım provides the security and transparency you need.
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  className="text-lg px-8 py-6 rounded-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 shadow-lg hover:shadow-xl hover:shadow-vote-blue/25 transition-all duration-300"
                >
                  <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-6 rounded-full border-2 hover:border-vote-blue hover:bg-vote-blue/5 transition-all duration-300"
                  onClick={onContact}
                >
                Contact us
                  <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              </motion.div>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-12 text-sm text-gray-500"
            >
              No credit card required • free trial •  anytime • anywhere
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Cta;
