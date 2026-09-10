import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import Hero from "./sections/Hero";
import HowItWorks from "./sections/HowItWorks";
import Features from "./sections/Features";
import ForDoctorsPatients from "./sections/ForDoctorsPatients";
import AboutSection from "./sections/AboutSection";
import CTA from "./sections/CTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <ForDoctorsPatients />
        <AboutSection />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
