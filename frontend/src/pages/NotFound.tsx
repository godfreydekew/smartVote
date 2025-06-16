import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2
            }}
            className="mb-8"
          >
            <h1 className="text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-vote-blue to-vote-teal">
              404
            </h1>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Page Not Found
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 mb-8"
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-vote-blue to-vote-teal hover:from-vote-blue/90 hover:to-vote-teal/90 text-white font-semibold rounded-full px-8 py-6 transition-all duration-300 hover:shadow-lg hover:shadow-vote-blue/25 hover:-translate-y-0.5"
              onClick={() => window.location.href = "/"}
            >
              <Home className="mr-2 h-5 w-5" />
          Return to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
