import CreateFormAI from '@/components/home/module/CreateFormAI'
import { Metadata } from 'next'
import React from 'react'

const page = () => {
  return (
<div className="flex justify-center items-center min-h-screen py-20">
       <CreateFormAI />
    </div>
  )
}

export default page

export const metadata: Metadata = {
  title: "Create Form | Formora AI",
  description: "Easily create and customize forms with Formora AI. Use AI-powered tools to design smarter, user-friendly forms in just a few clicks.",
};
