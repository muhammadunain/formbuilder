import { PropsLayout } from '@/types';
import { Metadata } from 'next';
import React from 'react'

const Layout = ({children}:PropsLayout) => {
  return (
    <>
      {children}
    </>
  )
}

export default Layout
export const metadata: Metadata = {
  title: "Dashboard | Formora AI",
  description: "Manage your forms, track submissions, and customize your form experience from the Formora AI dashboard.",
};