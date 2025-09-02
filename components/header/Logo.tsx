import React from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
const Logo = () => {
  return (
     <Link
  href="/"
  aria-label="home"
  className="flex items-center gap-2"
>
  {/* Icon */}
  <div className="flex items-center justify-center h-9 w-9 text-white rounded-lg bg-[#6e40f7]">
   <Sparkles/>
  </div>

  {/* Text */}
  <span className="text-xl font-bold ">
    Formora <span >AI</span>
  </span>
</Link>
  )
}

export default Logo
