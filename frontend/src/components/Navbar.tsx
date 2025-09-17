import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/70 backdrop-blur-lg shadow-sm' 
          : 'bg-white/50 backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center group">
            <motion.span 
              className="text-2xl font-bold tracking-tight text-vote-blue transition-all duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05 }}
            >
              Şeffaf<span className="text-vote-teal">Katılım</span>
            </motion.span>
            <motion.span 
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-r from-vote-blue to-vote-teal text-white text-xs font-semibold px-3 py-1 rounded-full ml-3 shadow-sm"
            >
              Beta
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {['Privacy', 'Contact'].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Link 
                  to={item === 'How It Works' ? '#how-it-works' : 
                      item === 'Security' ? '#security' : 
                      `/${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-vote-blue transition-all duration-300 font-medium text-sm tracking-wide relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-vote-blue to-vote-teal transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </motion.div>
            ))}
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="font-semibold text-sm tracking-wide rounded-full px-6 py-2.5 border-2 border-gray-200 hover:border-vote-blue hover:bg-vote-blue/5 transition-all duration-300 hover:shadow-md group-hover:shadow-lg group-hover:shadow-vote-blue/10"
                >
                  Login
                </Button>
              </Link>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 font-semibold text-sm tracking-wide rounded-full px-6 py-2.5 transition-all duration-300 hover:shadow-lg hover:shadow-vote-blue/25 hover:-translate-y-0.5">
                  Get Started
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button */}
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
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-gray-100">
                {['How It Works', 'Security', 'Privacy', 'Contact'].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={item === 'How It Works' ? '#how-it-works' : 
                          item === 'Security' ? '#security' : 
                          `/${item.toLowerCase()}`}
                      className="block py-3 text-gray-700 hover:text-vote-blue font-medium text-sm tracking-wide hover:bg-gray-50/50 px-4 rounded-lg transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {item}
                    </Link>
                  </motion.div>
                ))}
                
                <motion.div 
                  className="mt-6 flex flex-col space-y-3 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full font-semibold text-sm tracking-wide rounded-full py-3 border-2 border-gray-200 hover:border-vote-blue hover:bg-vote-blue/5 transition-all duration-300"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 font-semibold text-sm tracking-wide rounded-full py-3 transition-all duration-300 hover:shadow-lg hover:shadow-vote-blue/25">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;