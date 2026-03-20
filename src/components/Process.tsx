import { Sprout, Cog, Shield, Package } from "lucide-react";
import millMachinery from "@/assets/mill-machinery.jpeg";
import millBuilding from "@/assets/mill-building.jpeg";

const Process = () => {
  const steps = [
    {
      icon: Sprout,
      title: "Premium Sourcing",
      description: "We partner with trusted farmers to source the finest quality paddy directly from the fields."
    },
    {
      icon: Cog,
      title: "Advanced Processing",
      description: "State-of-the-art machinery ensures optimal milling while preserving nutritional value."
    },
    {
      icon: Shield,
      title: "Quality Control",
      description: "Rigorous testing at every stage guarantees purity, taste, and safety standards."
    },
    {
      icon: Package,
      title: "Fresh Packaging",
      description: "Careful packaging preserves freshness and delivers the best quality to your table."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Quality Process
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From farm to family: Experience the journey of excellence
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-6 flex items-center justify-center shadow-medium">
                <step.icon className="w-10 h-10 text-primary-foreground" />
              </div>
              <div className="relative">
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-6xl font-bold text-primary/10">
                  {index + 1}
                </span>
                <h3 className="text-xl font-bold text-foreground mb-3 relative z-10">
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Image Gallery */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="rounded-2xl overflow-hidden shadow-medium">
            <img 
              src={millBuilding} 
              alt="SLN Rice Mill facility exterior"
              className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="bg-card p-6">
              <h4 className="text-xl font-bold text-card-foreground mb-2">
                Trusted Farmer Partnerships
              </h4>
              <p className="text-muted-foreground">
                Direct sourcing from dedicated farmers ensures the highest quality paddy
              </p>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-medium">
            <img 
              src={millMachinery} 
              alt="Modern rice processing machinery inside SLN Rice Mill"
              className="w-full h-80 object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="bg-card p-6">
              <h4 className="text-xl font-bold text-card-foreground mb-2">
                State-of-the-Art Facility
              </h4>
              <p className="text-muted-foreground">
                Advanced technology meets traditional expertise in our modern mill
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
