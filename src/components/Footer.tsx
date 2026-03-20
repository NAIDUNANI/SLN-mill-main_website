import { Wheat } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-accent text-accent-foreground py-10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Wheat className="w-5 h-5 text-primary" />
              <span className="text-primary">SLN</span> Rice Mill
            </h3>
            <p className="text-accent-foreground/80 leading-relaxed" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              From golden paddy fields to your family table — delivering premium quality rice 
              with a deep commitment to farming traditions and sustainability.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-accent-foreground/80" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#products" className="hover:text-primary transition-colors">Products</a></li>
              <li><a href="#process" className="hover:text-primary transition-colors">Our Process</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Our Rice</h4>
            <ul className="space-y-2 text-accent-foreground/80" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <li>Premium Raw Rice</li>
              <li>Boiled Rice (Ponni)</li>
              <li>Sona Masoori</li>
              <li>Bulk & Custom Orders</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-accent-foreground/20 pt-6 text-center text-accent-foreground/60" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          <p>&copy; {new Date().getFullYear()} SLN Rice Mill. All rights reserved. | Proudly rooted in Indian farming.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
