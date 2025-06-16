import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showLogin?: boolean;
  showSignup?: boolean;
}

const MobileMenu = ({ isOpen, setIsOpen, showLogin = true, showSignup = true }: MobileMenuProps) => {
  return (
    <div className="md:hidden">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-600 hover:text-vote-blue focus:outline-none p-2 rounded-lg hover:bg-gray-100/50 transition-all duration-200"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg border-t border-gray-100"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {showLogin && (
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full font-semibold text-sm tracking-wide rounded-full py-3 border-2 border-gray-200 hover:border-vote-blue hover:bg-vote-blue/5 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                )}
                {showSignup && (
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 font-semibold text-sm tracking-wide rounded-full py-3 transition-all duration-300 hover:shadow-lg hover:shadow-vote-blue/25">
                      Get Started
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileMenu; 