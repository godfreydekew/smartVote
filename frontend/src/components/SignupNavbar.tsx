import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const SignupNavbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-white/70 backdrop-blur-lg shadow-sm"
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
        </div>
      </div>
    </motion.nav>
  );
};

export default SignupNavbar; 