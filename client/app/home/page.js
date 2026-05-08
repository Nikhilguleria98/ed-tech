import React from 'react'
import HeroSection from '../components/home/Hero'
import CourseSection from '../components/home/CodeBlock'
import SkillsSection from '../components/home/SkillsSection'
import InstructorSection from '../components/home/InstructorSection'

const Home = () => {

  const heroData = [
    {
      subHead:"The Digital Ivy League of Tech",
      mainHead:"Elite Technical Mentorship for the",
      mainHead2:"Next Gen",
      para:"Master high-impact skills with industry titans. Lumina Premiere offers an curated educational experience designed for ambitious engineers and leaders.",
      btn1:"Start Learning",
      btn2:"Explore Courses",
      img:"/hero.png"

    }
  ]


  return (
    <div>
     <HeroSection heroData={heroData}/>
     <CourseSection/>
     <SkillsSection/>
     <InstructorSection/>
    </div>
  )
}

export default Home
