import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import CreateFormAI from './CreateFormAI'
const AlertBoxForm = () => {
  return (
    <AlertDialog>
  <AlertDialogTrigger asChild>
    <button className="px-6 py-3 rounded-2xl cursor-pointer bg-[#9f7ef2] text-white font-medium shadow-md hover:bg-[#cabcef] transition">
        Start Building
      </button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
    <CreateFormAI />
      
    </AlertDialogHeader>
   
  </AlertDialogContent>
</AlertDialog>
  )
}

export default AlertBoxForm
