import { Card, CardContent } from '@/components/ui/card'
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  Lightbulb
} from 'lucide-react'

const benefits = [
  {
    icon: Clock,
    title: '10x Faster',
    stat: '95% time saved',
    description: 'Create forms in minutes instead of hours with AI assistance'
  },
  {
    icon: TrendingUp,
    title: 'Higher Conversions',
    stat: '40% increase',
    description: 'AI-optimized forms perform significantly better than traditional ones'
  },
  {
    icon: Users,
    title: 'Better UX',
    stat: '85% satisfaction',
    description: 'Users love our intelligent, adaptive form experiences'
  },
  {
    icon: Target,
    title: 'Smart Targeting',
    stat: '60% more leads',
    description: 'AI personalizes forms based on user behavior and preferences'
  }
]

export function Benefits() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#6e40f7] to-purple-600 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Why Choose Formora AI?
          </h2>
          <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of businesses that have transformed their form experience with AI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="bg-white/10 border-white/20 text-white hover:bg-white/15 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="inline-flex p-4 bg-white/20 rounded-xl mb-6">
                  <benefit.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold mb-2">{benefit.title}</div>
                <div className="text-purple-200 text-lg mb-4">{benefit.stat}</div>
                <p className="text-purple-100 leading-relaxed">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Additional benefits */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-semibold mb-2">No-Code Solution</h4>
                <p className="text-purple-100">Build professional forms without any technical knowledge</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-semibold mb-2">Real-time Analytics</h4>
                <p className="text-purple-100">Monitor performance and get AI-powered insights instantly</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-semibold mb-2">Unlimited Forms</h4>
                <p className="text-purple-100">Create as many forms as you need with no restrictions</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <CheckCircle className="h-6 w-6 text-green-400 flex-shrink-0 mt-1" />
              <div>
                <h4 className="text-xl font-semibold mb-2">24/7 AI Support</h4>
                <p className="text-purple-100">Get intelligent help whenever you need it</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}