import { Separator } from '@/components/ui/separator'
import { Brain, Twitter, Linkedin, Github } from 'lucide-react'
import Logo from './Logo'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Logo and description */}
          <div className="md:col-span-1">
           <Logo/>
            <p className="text-gray-400 leading-relaxed mb-6">
              The future of form building is here. Create intelligent, adaptive forms powered by AI.
            </p>
            <div className="flex space-x-4">
              <div className="p-3 bg-gray-800 rounded-lg hover:bg-[#6e40f7] transition-colors cursor-pointer">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="p-3 bg-gray-800 rounded-lg hover:bg-[#6e40f7] transition-colors cursor-pointer">
                <Linkedin className="h-5 w-5" />
              </div>
              <div className="p-3 bg-gray-800 rounded-lg hover:bg-[#6e40f7] transition-colors cursor-pointer">
                <Github className="h-5 w-5" />
              </div>
            </div>
          </div>
          
          {/* Product links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Product</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Features</li>
              <li className="hover:text-white transition-colors cursor-pointer">Pricing</li>
              <li className="hover:text-white transition-colors cursor-pointer">Templates</li>
              <li className="hover:text-white transition-colors cursor-pointer">Integrations</li>
              <li className="hover:text-white transition-colors cursor-pointer">API</li>
            </ul>
          </div>
          
          {/* Company links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Company</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
              <li className="hover:text-white transition-colors cursor-pointer">Blog</li>
              <li className="hover:text-white transition-colors cursor-pointer">Careers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
              <li className="hover:text-white transition-colors cursor-pointer">Press</li>
            </ul>
          </div>
          
          {/* Support links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-4 text-gray-400">
              <li className="hover:text-white transition-colors cursor-pointer">Help Center</li>
              <li className="hover:text-white transition-colors cursor-pointer">Documentation</li>
              <li className="hover:text-white transition-colors cursor-pointer">Community</li>
              <li className="hover:text-white transition-colors cursor-pointer">Status</li>
              <li className="hover:text-white transition-colors cursor-pointer">Security</li>
            </ul>
          </div>
        </div>
        
        <Separator className="bg-gray-800 mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <div className="mb-4 md:mb-0">
            © 2025 Formora AI. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-white transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}