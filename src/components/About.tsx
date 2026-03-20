import { Leaf, Award, Users, Wheat, Sprout, Sun } from "lucide-react";

const About = () => {
  const values = [
    {
      icon: Award,
      title: "Quality Excellence",
      description: "Every grain passes through rigorous quality checks — from paddy selection to final packaging — ensuring purity, taste, and nutrition."
    },
    {
      icon: Sprout,
      title: "Sustainable Farming",
      description: "We partner with local farmers who follow eco-friendly practices, preserving the soil and nurturing healthy, natural crops."
    },
    {
      icon: Users,
      title: "Farm-to-Family Trust",
      description: "Reliable delivery and customized solutions — whether you're a household, restaurant, or wholesale buyer."
    }
  ];

  return (
    <section className="py-20 bg-background relative grain-texture">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Wheat className="w-5 h-5 text-primary" />
            <span className="text-primary font-semibold tracking-wider uppercase text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Why Choose Us
            </span>
            <Wheat className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Rooted in Tradition, Driven by Quality
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            For generations, SLN Rice Mill has been the trusted name for premium rice — from the paddy fields to your plate
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {values.map((value, index) => (
            <div 
              key={index}
              className="bg-card p-8 rounded-lg shadow-soft hover-lift border border-border animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-card-foreground mb-4">
                {value.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12 animate-slide-in-right hover-glow border border-border overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
            <Sun className="w-full h-full text-primary" />
          </div>
          <div className="max-w-3xl relative z-10">
            <h3 className="text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Leaf className="w-7 h-7 text-secondary" />
              Our Heritage
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              At SLN Rice Mill, we source premium paddy directly from trusted farmers in fertile 
              farmlands. Each batch is carefully processed through state-of-the-art machinery and 
              packaged with care to lock in freshness and flavor.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              Our modern milling facility blends generations of traditional expertise with advanced 
              technology — ensuring every grain of rice meets the highest standards. Whether you need 
              raw rice, boiled rice, or customized bulk orders, we deliver quality you can trust.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
