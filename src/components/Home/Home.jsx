import React from "react";
import Layout from "../General/Layout";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import TestimonialSection from "./TestimonialSection";

function Home() {
  return (
    <Layout>
      <HeroSection />
      <FeatureSection />
      <TestimonialSection />
    </Layout>
  );
}

export default Home;
