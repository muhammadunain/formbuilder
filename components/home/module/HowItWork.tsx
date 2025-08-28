import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Wand2, Rocket } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    title: "Describe Your Form",
    description: "Simply tell our AI what kind of form you need. Use natural language to describe your requirements, fields, and validation rules."
  },
  {
    icon: Wand2,
    title: "AI Works Its Magic",
    description: "Our intelligent system analyzes your requirements and automatically generates a professional form with optimal field types and user experience."
  },
  {
    icon: Rocket,
    title: "Deploy & Collect",
    description: "Your form is ready to deploy instantly. Share it anywhere, embed it on your website, or use our hosted solution to start collecting responses."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create professional forms in three simple steps. No coding required, no design skills needed.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="border-0 shadow-elegant bg-background hover:shadow-glow transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center">
                  <div className="mx-auto w-16 h-16 rounded-full brand-bg flex items-center justify-center mb-4 relative">
                    <step.icon className="h-8 w-8 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 brand-bg rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-muted-foreground leading-relaxed">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 brand-bg transform -translate-y-1/2"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;