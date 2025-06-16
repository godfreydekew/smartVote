import React from 'react';
import { Shield, ShieldCheck, ShieldX, Key, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const securityFeatures = [
  {
    icon: Shield,
    title: "Cryptographic Protection",
    description: "Every vote is secured with 256-bit encryption and zero-knowledge proofs, making it mathematically impossible to compromise.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: ShieldCheck,
    title: "Distributed Ledger",
    description: "Our decentralized network eliminates single points of failure and ensures that no individual or entity can manipulate results.",
    color: "from-vote-blue to-vote-teal"
  },
  {
    icon: Key,
    title: "Immutable Audit Trail",
    description: "Every transaction is permanently recorded on the blockchain, providing a tamper-proof audit trail for complete transparency.",
    color: "from-indigo-500 to-vote-blue"
  }
];

const comparisonFeatures = [
  { name: "Tamper Resistance", traditional: false, smartVote: true },
  { name: "Real-time Verification", traditional: false, smartVote: true },
  { name: "Distributed Security", traditional: false, smartVote: true },
  { name: "Immutable Record", traditional: false, smartVote: true },
  { name: "Voter Privacy", traditional: true, smartVote: true }
];

const Security = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <section id="security" className="py-24 bg-gradient-to-b from-white to-gray-50/50">
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
              Advanced Security
            </span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            <span className="bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">Security</span> For Your Vote
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
              Our blockchain technology implements security standards to protect 
              the integrity of every election and the privacy of every voter.
          </motion.p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="space-y-8">
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                  className="flex group"
                >
                  <div className="mr-6">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-12"
            >
              <Button 
                size="lg"
                className="rounded-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 shadow-lg hover:shadow-xl hover:shadow-vote-blue/25 transition-all duration-300 px-8 py-6"
              >
                View Security Whitepaper
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="md:w-1/2"
          >
            <div className="relative bg-gradient-to-br from-vote-blue to-vote-teal p-1 rounded-2xl shadow-xl">
              <div className="bg-white rounded-xl p-8">
                <motion.h3 
                  variants={itemVariants}
                  className="text-2xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-vote-blue to-vote-teal"
                >
                  Security Comparison
                </motion.h3>
                
                <div className="space-y-6">
                  <motion.div 
                    variants={itemVariants}
                    className="flex justify-between items-center pb-4 border-b border-gray-100"
                  >
                    <div className="font-medium text-gray-900">Feature</div>
                    <div className="font-medium text-center text-gray-900">Traditional Voting</div>
                    <div className="font-medium text-center text-gray-900">SmartVote</div>
                  </motion.div>
                  
                  {comparisonFeatures.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="flex justify-between items-center pb-4 border-b border-gray-100 last:border-0"
                    >
                      <div className="text-gray-700">{feature.name}</div>
                    <div className="text-center">
                        {feature.traditional ? (
                      <ShieldCheck className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                      <ShieldX className="h-5 w-5 text-red-500 mx-auto" />
                        )}
                    </div>
                    <div className="text-center">
                      <ShieldCheck className="h-5 w-5 text-green-500 mx-auto" />
                    </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Security;
