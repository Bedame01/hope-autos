'use client'

import Image from "next/image"
import { useState } from "react"

import slider1 from '@/public/image/car1.avif'
import slider2 from '@/public/image/car2.png'
import slider3 from '@/public/image/car4.png'

const HeroSlider = () => {
    const [heroCount, setHeroCount] = useState(0)

    return (
        <div className="hero-slider flex items-center flex-col relative max-w-[1024px] min-w-[280px] mt-6">
            <div className="hero-slider-container">
                <div className="hero-slider-wrapper absolute rounded-[inherit] inset-0">
                    <Image 
                        src={heroCount === 0 ? slider1 : heroCount === 1 ? slider2 : heroCount === 2 ? slider3 : slider1}
                        alt="Hero Slider"
                        className="block size-full object-cover object-center"
                        width="1617"
                        height="695"
                        sizes="min(max(min(max(100vw, 280px), 1024px) * 0.82, 190px), 500px)"
                    />
                </div>
            </div>

            {/* // HERO SWIPE DOTS */}
            <div className="hero-swipe-dots absolute -bottom-0 left-1/2 transform -translate-x-1/2 z-40">
                <div className='flex items-center gap-4'>
                    <div onClick={ () => setHeroCount(0)} className={heroCount === 0 ? 'dot active' : 'dot'}></div>
                    <div onClick={ () => setHeroCount(1)} className={heroCount === 1 ? 'dot active' : 'dot'}></div>
                    <div onClick={ () => setHeroCount(2)} className={heroCount === 2 ? 'dot active' : 'dot'}></div>
                </div>
            </div>
        </div>
    )
}

export default HeroSlider