import React from 'react';
import { motion } from 'framer-motion';
import { Building, Users, Hospital, Film, Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

const servicesData = [
  {
    title: "Corporate Organizations",
    description: "Streamline board meetings, shareholder voting, and corporate governance with secure digital balloting.",
    icon: Building,
    image: "/organizations/c7e4de6a-e088-4235-88ad-878842033225.png",
    color: "from-blue-500 to-cyan-500"
  },
  {
    title: "Entertainment Industry",
    description: "Manage award voting, content selection, and member polling with complete integrity and transparency.",
    icon: Film,
    image: "/organizations/1cbb65a1-23bb-4f1c-aa8b-390a16b54bf7.png",
    color: "from-vote-blue to-vote-teal"
  },
  {
    title: "Healthcare Organizations",
    description: "Enable secure voting for medical boards, hospital committees, and healthcare governance decisions.",
    icon: Hospital,
    image: "/organizations/3add6a70-ff62-4e4f-8c5e-303a0c62d28d.png",
    color: "from-indigo-500 to-vote-blue"
  },
  {
    title: "Unions & Associations",
    description: "Facilitate fair and transparent union elections and member voting processes with verifiable results.",
    icon: Users,
    image: "/organizations/1fe10f78-6f4f-412c-b6d7-96f41833896c.png",
    color: "from-vote-teal to-emerald-500"
  },
  {
    title: "Business Partnerships",
    description: "Make critical business decisions with a secure and transparent voting platform built for collaboration.",
    icon: Briefcase,
    image: "/organizations/9a88b15b-14a4-4e2a-bca3-6f26f3413261.png",
    color: "from-vote-blue to-cyan-500"
  },
  {
    title: "Educational Institutions",
    description: "Streamline student government elections, faculty decisions, and administrative voting processes.",
    icon: GraduationCap,
    image: "/organizations/c694b0bf-933a-4ece-81ff-45c448155f22.png",
    color: "from-vote-teal to-emerald-500"
  }
];

const WhoWeServe = () => {
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
    <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
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
              Our Clients
            </span>
          </motion.div>

          <motion.h2 
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700"
          >
            Who We <span className="bg-gradient-to-r from-vote-blue to-vote-teal bg-clip-text text-transparent">Serve</span>
          </motion.h2>

          <motion.p 
            variants={itemVariants}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Empowering organizations across sectors with secure and transparent voting solutions
          </motion.p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {servicesData.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Card className="relative h-[320px] overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ 
                    backgroundImage: `url('${service.image}')`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />
                <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${service.color} w-fit mb-4 shadow-lg`}>
                    <service.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-white/80 mb-6 leading-relaxed">{service.description}</p>
                  <Button 
                    variant="ghost" 
                    className="group-hover:text-white p-0 h-auto font-medium text-white/80 hover:text-white"
                  >
                    Learn more
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WhoWeServe;
