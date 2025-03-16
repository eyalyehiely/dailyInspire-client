import React from "react";
import Layout from "../General/Layout";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import TestimonialSection from "./TestimonialSection";
import ContactForm from "./ContactForm";

function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
      <ContactForm />
    </Layout>
  );
}

export default Home;
