import React from 'react';
import { Shield, Users, Lock, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';

const featureData = [
  {
    icon: Shield,
    title: 'Tamper-Proof Security',
    description: "Leverage blockchain's immutability to create a voting system that is virtually impossible to hack or manipulate.",
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Full Transparency',
    description: 'All votes are verifiable on the public blockchain, allowing for transparency while maintaining voter privacy.',
    color: 'from-vote-blue to-vote-teal'
  },
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'Advanced cryptographic techniques ensure your vote remains secure and private from submission to counting.',
    color: 'from-indigo-500 to-vote-blue'
  },
  {
    icon: Calendar,
    title: 'Instant Results',
    description: 'Eliminate waiting periods with smart contracts vote counting, providing immediate and accurate election results.',
    color: 'from-vote-teal to-emerald-500'
  }
];

const Features = () => {

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

  const onLearnMore = () => {
    navigate("/Dashboard");
  }

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-gray-50/50">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-20"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-vote-blue/10 to-vote-teal/10 text-vote-blue text-sm font-semibold tracking-wide">
              Features
            </span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            Features for <span className="bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">Blockchain Voting</span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Our blockchain voting system combines cutting-edge technology with user-friendly design to redefine electoral processes.
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {featureData.map((feature, index) => (
            <motion.div
              key={index} 
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-vote-blue/5 to-vote-teal/5 rounded-2xl transform transition-transform group-hover:scale-105" />
              <div className="relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100/50">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <Button 
                  variant="ghost" 
                  className="group-hover:text-vote-blue p-0 h-auto font-medium"
                  onClick={onLearnMore}
                >
                  Learn more
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
            </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-20 text-center"
        >
          <Button 
            size="lg"
            className="rounded-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 shadow-lg hover:shadow-xl hover:shadow-vote-blue/25 transition-all duration-300 px-8 py-6"
            onClick={onLearnMore}
          >
            Explore All Features
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
