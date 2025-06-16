
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import WhoWeServe from '../components/WhoWeServe';
import Security from '../components/Security';
import Reviews from '../components/Reviews';
import Faq from '../components/Faq';
import Cta from '../components/Cta';
import Footer from '../components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <WhoWeServe />
      <Reviews />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
};

export default Index;
