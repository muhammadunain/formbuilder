import CreateFormAI from '@/components/home/module/CreateFormAI'
import CTA from '@/components/home/module/CTA'
import {Features} from '@/components/home/module/Featured'
import Hero from '@/components/home/module/Hero'
import DarkVeil from '@/components/home/module/HeroSection'
import HowItWorks from '@/components/home/module/HowItWork'
import Testimonials from '@/components/home/module/testimonials'
import React from 'react'
import FormBuilderHero from '../../components/home/module/MainHero'
import AIFormBuilderHero from '@/components/home/module/TestHero'
import { Benefits } from '@/components/home/module/Benifits'

const Home = () => {
  return (
<>
   {/* <div className=' h-[700px] relative'>
  <DarkVeil />
</div> */}
{/* <Hero/> */}
<AIFormBuilderHero/>

<Features/>
<HowItWorks/>
<Benefits/>
<Testimonials/>
<CTA/>
</>
  )
}

export default Home