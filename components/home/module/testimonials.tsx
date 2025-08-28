import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager at TechCorp",
    content: "AI FormBuilder completely transformed our data collection process. What used to take hours now takes minutes, and the forms look incredibly professional.",
    rating: 5
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Director at GrowthCo",
    content: "The AI understands exactly what we need. It's like having a form expert on our team 24/7. Our conversion rates increased by 40% after switching.",
    rating: 5
  },
  {
    name: "Emily Johnson",
    role: "Startup Founder",
    content: "As a non-technical founder, this tool is a lifesaver. I can create complex forms with validation rules without writing a single line of code.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Loved by{" "}
            <span className="brand-bg bg-clip-text text-transparent">Thousands</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of satisfied customers who have revolutionized their form creation process.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-0 shadow-elegant hover:shadow-glow transition-all duration-300 bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  <div className="pt-4 border-t">
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;