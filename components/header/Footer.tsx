import Logo from './Logo'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Logo */}
        <Logo />

        {/* Main Links */}
        {/* <nav>
          <ul className="flex space-x-6 text-gray-400 text-sm">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/create-form" className="hover:text-white transition-colors">
                Create Form
              </Link>
            </li>
            <li>
              <Link href="/signin" className="hover:text-white transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/signup" className="hover:text-white transition-colors">
                Sign Up
              </Link>
            </li>
          </ul>
        </nav> */}

        {/* Copyright */}
        <div className="text-gray-500 text-xs">
          © 2025 Formora AI. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
