'use client'
import React from 'react'

const NavbarMain = () => {
  return (
     <header className="w-full relative z-10">
          <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-8">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-full bg-white" />
              <span className="text-lg font-semibold tracking-tight">MoraAI</span>
            </div>

            <nav className="hidden items-center gap-8 text-sm/6 text-white/80 md:flex">
              {['Product','Docs','Customers','Resources','Partners','Pricing'].map((i)=>(
                <a key={i} className="hover:text-white" href="#">{i}</a>
              ))}
            </nav>

            <div className="hidden items-center gap-3 md:flex">
              <button className="rounded-full px-4 py-2 text-sm text-white/80 hover:text-white">Sign in</button>
              <button className="rounded-full bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-white/90">Request Demo</button>
            </div>

            <button className="md:hidden rounded-full bg-white/10 px-3 py-2 text-sm">Menu</button>
          </div>
        </header>


  )
}

export default NavbarMain
