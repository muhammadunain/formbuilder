import {Footer} from '@/components/header/Footer'
import Header from '@/components/header/Navbar'
import Navbar from '@/components/navigation/Navbar'
import { HeroHeader } from '@/components/navigation/QuickNav'
import { PropsLayout } from '@/types'
import React from 'react'

const Layout = ({children}:PropsLayout) => {
  return (
    <>
    <HeroHeader/>
      {children}
      <Footer/>
    </>
  )
}

export default Layout
