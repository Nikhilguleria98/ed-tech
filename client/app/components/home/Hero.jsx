


import React from 'react'

const Hero = ({heroData}) => {
  return (
    <div className='bg-[#F7F9FB] '>
    <div className='responsivewidth py-20 md:py-32 '>
      <div className='flex flex-col lg:flex-row gap-10 '>
        {/* left */}
        <div className='  w-full lg:w-1/2'>
        <h2 className='py-2 px-4 border-2 bg-[#d9f1f8] inline-block border-[#53CBF3] text-[#53CBF3] rounded-full'>{heroData.subHead}</h2>
        <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold mt-4'>{heroData.mainHead}</h1>
        <h3 className='text-4xl sm:text-5xl md:text-6xl font-bold text-[#53CBF3]'>{heroData.mainHead2}</h3>
        <p className='mt-4 text-gray-600 text-xl'>{heroData.para}</p>
      </div>

      {/* right */}
     <div className='w-full lg:w-1/2 flex justify-center '>
  <img src={heroData.img} alt="" className='w-full object-contain max-w-[500px]'/>
</div>
      </div>
      
    </div>

    </div>
  )
}

export default Hero
