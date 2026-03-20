import { Button } from "@/components/ui/button";
import { ArrowRight, Wheat } from "lucide-react";
import millFields from "@/assets/mill-fields.jpeg";
import millInterior from "@/assets/mill-interior.jpeg";
import millProcessing from "@/assets/mill-processing.jpeg";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const Hero = () => {
  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const slides = [
    {
      image: millFields,
      title: "From Golden Fields to Your Table",
      description: "SLN Rice Mill brings you the finest paddy, harvested with care and milled with precision — nourishing families across the region.",
    },
    {
      image: millInterior,
      title: "Rooted in Sustainable Farming",
      description: "We work hand-in-hand with local farmers who nurture the land using time-honored, eco-friendly practices for the purest grain.",
    },
    {
      image: millProcessing,
      title: "Milled with Modern Mastery",
      description: "Our state-of-the-art facility preserves every grain's natural goodness — from paddy to polished perfection.",
    },
  ];

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <Carousel
        opts={{ align: "start", loop: true }}
        plugins={[plugin.current]}
        className="w-full h-full absolute inset-0"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="relative h-screen">
              <div 
                className="absolute inset-0 z-0 transition-transform duration-700"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0" style={{ background: 'var(--gradient-hero)', opacity: 0.7 }} />
              </div>

              <div className="container relative z-10 mx-auto px-4 py-20 h-screen flex items-center">
                <div className="max-w-3xl animate-fade-in">
                  <div className="flex items-center gap-2 mb-4">
                    <Wheat className="w-6 h-6 text-primary animate-sway" />
                    <span className="text-primary font-semibold tracking-wider uppercase text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                      Premium Paddy & Rice
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-primary-foreground/85 mb-8 leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                    {slide.description}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      size="lg" 
                      className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-medium transition-all duration-300 hover:scale-105"
                      onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Explore Our Rice
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="text-lg px-8 py-6 border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 transition-all duration-300 hover:scale-105"
                      onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      Get in Touch
                    </Button>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-background/60 to-transparent z-10" />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 h-12 w-12 border-2 border-primary-foreground/40 bg-accent/60 hover:bg-accent/90 text-primary-foreground" />
        <CarouselNext className="right-4 h-12 w-12 border-2 border-primary-foreground/40 bg-accent/60 hover:bg-accent/90 text-primary-foreground" />
      </Carousel>
    </section>
  );
};

export default Hero;
