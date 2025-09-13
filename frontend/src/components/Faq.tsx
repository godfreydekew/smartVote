import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const faqData = [
  {
    question: "What is blockchain voting?",
    answer: "Blockchain voting uses distributed ledger technology to create a secure, transparent, and immutable record of votes. Each vote is encrypted and added to a Ethereum blockchain, making it virtually impossible to alter or delete votes once they've been cast.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    question: "Is blockchain voting secure?",
    answer: "Yes, blockchain voting is extremely secure. It uses cryptographic techniques to protect votes, distributes the voting record across multiple nodes to prevent tampering, and provides end-to-end encryption for voter privacy. Our system also undergoes regular security audits and penetration testing.",
    color: "from-vote-blue to-vote-teal"
  },
  {
    question: "How does Şeffaf Katılım ensure voter privacy?",
    answer: "Şeffaf Katılım uses advanced cryptographic techniques including zero-knowledge proofs that allow voters to verify their vote was counted correctly without revealing who they voted for. The system separates voter identity verification from the actual voting process to ensure complete anonymity.",
    color: "from-indigo-500 to-vote-blue"
  },
  {
    question: "Can voters verify their votes were counted correctly?",
    answer: "Yes, each voter receives a unique, anonymous receipt with a cryptographic key that allows them to verify their vote was recorded correctly on the blockchain without revealing their identity or how they voted.",
    color: "from-vote-teal to-emerald-500"
  },
  {
    question: "What happens if there's a technical issue during voting?",
    answer: "Our system has multiple redundancies built in. If a voter experiences a technical issue, they can restart the voting process, and the system ensures no duplicate votes are counted. We also provide 24/7 technical support during election periods.",
    color: "from-vote-blue to-cyan-500"
  },
  {
    question: "Is Şeffaf Katılım accessible to all voters?",
    answer: "Yes, Şeffaf Katılım is designed with accessibility as a priority. The platform complies with WCAG 2.1 AA standards, supports screen readers, offers keyboard navigation, and provides interfaces in multiple languages. For voters without internet access, we work with election authorities to provide voting kiosks at traditional polling locations.",
    color: "from-vote-teal to-emerald-500"
  }
];

const Faq = () => {
  const navigate = useNavigate();

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

  const onStillHaveQuestions = () => {
    navigate("/contact")
  }

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
              FAQ
            </span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            Frequently Asked <span className="bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">Questions</span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Everything you need to know about our blockchain voting system
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
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border-b border-gray-100 last:border-0"
              >
                <AccordionTrigger 
                  className="px-8 py-6 hover:no-underline group"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${faq.color} opacity-10 group-hover:opacity-20 transition-opacity`}>
                      <HelpCircle className="h-5 w-5 text-vote-blue" />
                    </div>
                    <span className="text-left font-medium text-gray-900 group-hover:text-vote-blue transition-colors">
                  {faq.question}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-8 pb-6 text-gray-600 leading-relaxed">
                  {faq.answer}
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
            Still Have Questions?
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Faq;
