import { Card, CardContent } from '@/components/ui/card'
import { 
  Brain, 
  Zap, 
  Palette, 
  Shield, 
  BarChart3, 
  Smartphone,
  MessageSquare,
  Settings
} from 'lucide-react'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Intelligence',
    description: 'Our AI analyzes user behavior and automatically optimizes your forms for maximum conversion rates.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Creation',
    description: 'Build complex forms in seconds with our intelligent form builder that understands your needs.'
  },
  {
    icon: Palette,
    title: 'Smart Design System',
    description: 'AI-generated designs that match your brand and follow best practices for user experience.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level encryption and compliance with GDPR, HIPAA, and other industry standards.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights and AI-powered recommendations to improve form performance.'
  },
  {
    icon: Smartphone,
    title: 'Mobile-First Design',
    description: 'Every form is automatically optimized for mobile devices and tablets.'
  },
  {
    icon: MessageSquare,
    title: 'Conversational Forms',
    description: 'Create engaging, chat-like forms that feel natural and increase completion rates.'
  },
  {
    icon: Settings,
    title: 'Advanced Integrations',
    description: 'Connect with 1000+ tools and services through our intelligent integration system.'
  }
]

export function Features() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Features Driven by
            <span className="bg-gradient-to-r from-[#6e40f7] to-purple-600 bg-clip-text text-transparent"> AI</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience the future of form building with intelligent features that adapt to your needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group transition-all duration-300 hover:-translate-y-1 border border-gray-100 hover:border-[#6e40f7]/20"
            >
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-[#6e40f7]/10 rounded-xl mb-6 group-hover:bg-[#6e40f7]/20 transition-colors duration-300">
                  <feature.icon className="h-8 w-8 text-[#6e40f7]" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}