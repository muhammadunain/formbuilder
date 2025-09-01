'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton, useUser, SignInButton } from '@clerk/nextjs'
import { FileText, LayoutDashboard, Plus, Home } from 'lucide-react'

const Navbar = () => {
  const { isSignedIn, isLoaded } = useUser()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">FormBuilder AI</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-4">
            {/* <Link href="/">
              <Button variant="ghost" className="flex items-center gap-2">
                <Home size={16} />
                Home
              </Button>
            </Link> */}
            {isLoaded && isSignedIn && (
            <><Link href="/create-form">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Plus size={16} />
                  Create Form
                </Button>
              </Link><Link href="/dashboard">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <LayoutDashboard size={16} />
                    Dashboard
                  </Button>
                </Link></>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isLoaded ? (
              isSignedIn ? (
                <UserButton 
                 
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8"
                    }
                  }}
                />
              ) : (
                <SignInButton >
                  <Link href={'/sign-in'}>
                  <Button>Sign In</Button>
                  </Link>
                </SignInButton>
              )
            ) : (
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2">
                <Home size={16} />
                Home
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="ghost" className="w-full justify-start flex items-center gap-2">
                <Plus size={16} />
                Create Form
              </Button>
            </Link>
            {isLoaded && isSignedIn && (
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start flex items-center gap-2">
                  <LayoutDashboard size={16} />
                  Dashboard
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar