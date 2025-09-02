import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-24  bg-gradient-hero">
      <div className="container mx-auto px-4 text-center">
        <div className=" mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Ready to Build Amazing Forms with{" "}
            <span className="brand-bg bg-clip-text text-transparent">AI</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of teams already using AI FormBuilder to create better forms faster. 
            Start creating your forms today and experience the future of form creation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create-form">
              <Button variant="hero" size="lg" className="group">
                Create Your First Form
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>AI-powered form generation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Unlimited forms</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Response analytics</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;