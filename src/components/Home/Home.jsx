import React from "react";
import Header from "../General/Header";
import HeroSection from "./HeroSection";
import FeatureSection from "./FeatureSection";
import TestimonialSection from "./TestimonialSection";
import Footer from "../General/Footer";

function Home() {
  return (
    <div>
      <Header />
      <div className="pt-16">
        {" "}
        {/* Add padding top to account for fixed header */}
        <HeroSection />
        <FeatureSection />
        <TestimonialSection />
        <Footer />
      </div>
    </div>
  );
}

export default Home;
