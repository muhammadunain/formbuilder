import { PropsLayout } from '@/types'
import React from 'react'

const Layout = ({children}:PropsLayout) => {
  return (
     <div className="grid min-h-svh lg:grid-cols-2  ">
     
      <div className="bg-muted relative hidden lg:block">
        <img
          src="https://cdn.midjourney.com/299f94f9-ecb9-4b26-bead-010b8d8b01d9/0_0.webp?w=800&q=80"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover "
        />
      </div>
       <div className="flex flex-col gap-4 p-6 md:p-10">
       
        <div className="flex flex-1 items-center justify-center ">
          <div className="w-full max-w-xs">
           {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout