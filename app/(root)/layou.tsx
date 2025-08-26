import NavbarMain from '@/components/header/Navbar'
import { PropsLayout } from '@/types'
import React from 'react'

const Layout = ({children}:PropsLayout) => {
  return (
    <>
    <NavbarMain/>
      {children}
    </>
  )
}

export default Layout
