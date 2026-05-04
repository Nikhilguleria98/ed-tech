import React from 'react'
import HeroSection from '../components/home/Hero'
import CourseSection from '../components/home/CodeBlock'
import SkillsSection from '../components/home/SkillsSection'
import InstructorSection from '../components/home/InstructorSection'

const Home = () => {
  return (
    <div>
     <HeroSection/>
     <CourseSection/>
     <SkillsSection/>
     <InstructorSection/>
    </div>
  )
}

export default Home
