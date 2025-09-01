import Footer from '@/components/header/Footer'
import Header from '@/components/header/Navbar'
import Navbar from '@/components/navigation/Navbar'
import { PropsLayout } from '@/types'
import React from 'react'

const Layout = ({children}:PropsLayout) => {
  return (
    <>
    <Header/>
      {children}
      <Footer/>
    </>
  )
}

export default Layout
