import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Zap, Shield, Palette, BarChart3, Globe } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Intelligence",
    description: "Our advanced AI understands your requirements and automatically generates the perfect form structure and validation rules."
  },
  {
    icon: Zap,
    title: "Lightning Fast Creation",
    description: "Go from idea to live form in under 60 seconds. Our AI does the heavy lifting while you focus on what matters."
  },
  {
    icon: Palette,
    title: "Beautiful Designs",
    description: "Every form is professionally designed with modern UI components that look stunning on any device."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and GDPR compliance ensure your data and your users' data is always protected."
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Get deep insights into form performance, conversion rates, and user behavior with our analytics dashboard."
  },
  {
    icon: Globe,
    title: "Global Ready",
    description: "Multi-language support, timezone handling, and localization features built-in for worldwide deployment."
  }
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Powerful Features Built for{" "}
            <span className="brand-bg bg-clip-text text-transparent">Modern Teams</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create, deploy, and manage intelligent forms that convert better and provide superior user experience.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-0 hover:shadow-purple-500 transition-all duration-300 hover:-translate-y-1 bg-card"
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 rounded-lg brand-bg flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;