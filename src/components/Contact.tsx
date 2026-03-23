import { useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('queries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            message: formData.message,
          }
        ]);

      if (error) throw error;

      toast.success("Thank you! We'll contact you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error: any) {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleVisit = () => {
    const phone = "+919876543210";
    const message = "Hi, I would like to schedule a visit to SLN Rice Mill.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary/10 via-secondary/5 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground">
              Ready to experience premium quality rice? Contact us today
            </p>
          </div>

          <div className="bg-card rounded-2xl shadow-medium p-8 md:p-12">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">Phone</h3>
                <p className="text-muted-foreground">+91 7569166607</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">Email</h3>
                <p className="text-muted-foreground">info@slnricemill.com</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-card-foreground mb-2">Location</h3>
                <p className="text-muted-foreground">SLN Rice Mill, Dimialada, Nandigam, Andhra Pradesh</p>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mb-8 rounded-xl overflow-hidden border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.8422801028505!2d84.2841980746546!3d18.626162465941285!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3dab63fcccebdf%3A0xd534396296ef3a2a!2sSri%20Lakshmi%20Narasimha%20Agro%20Industries!5e0!3m2!1sen!2sin!4v1773984457151!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SLN Rice Mill Location"
              />
              <div className="p-3 bg-muted/30 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">📍 SLN Rice Mill Location</span>
                <a
                  href="https://maps.app.goo.gl/NzcUYrtc7gxeKqGt8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="text-2xl font-bold text-card-foreground mb-4 text-center">
                Request Information or Place an Order
              </h3>
              <p className="text-center text-muted-foreground mb-6">
                Whether you need raw rice, boiled rice, or bulk orders, we're here to help
              </p>
              <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1" disabled={loading}>
                    {loading ? "Submitting..." : "Request Quote"}
                  </Button>
                  <Button 
                    type="button"
                    size="lg" 
                    variant="outline"
                    className="flex-1"
                    onClick={handleScheduleVisit}
                  >
                    Schedule Visit via WhatsApp
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
