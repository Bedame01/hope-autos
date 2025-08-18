'use client'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CarCard from "./components/CarCard"
import { getFeaturedCars } from "@/lib/db"
import { Shield, Award, Users, Wrench } from "lucide-react"
import CustomButton from "@/components/ui/CustomButton"
// import HeroSlider from '@/components/ui/hero-slider'
import InfiniteScroll from "@/components/ui/InfiniteScroll"

import BlurText from '@/Reactbits/BlurText/BlurText'
// import Hero_bg from '@/public/image/White SUV in Desert Landscape.png'
import hero_bgline from '@/public/elements/hero-line.avif'
import hero_slider from "@/public/image/slider51.png"
import Footer from "./components/Footer"

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()

  return (
    <div className="min-h-screen"> 
      {/* Hero Section */}
      <section className="hero relative flex flex-nowrap flex-col items-center gap-[56px] z-5 w-full h-[780px] overflow-hidden bg-[var(--background)]">
        {/* <div className="absolute inset-0 z-0">
          <Image src={Hero_bg} alt="hero-bg" className="object-cover size-full" width={10} height={50} loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/90"></div>
        </div> */}

        {/* HERO TITLE WRAP */}
        <div className="title-wrap mt-12 md:mt-16">
          <div className="max-sm:text-[7.6vw]/11 sm:text-[46px]/12 md:text-[50px]/13 lg:text-[58px]/16 font-bold hero-heading flex flex-col justify-center items-center text-center tracking-[-1px]">
            <BlurText
              text="Buy.Sell.Swap."
              delay={120}
              animateBy="letters"
              direction="top"
              onAnimationComplete={()=> {}}
              className="text-[var(--foreground)]"
            />
            <BlurText
              text="Find your perfect car"
              delay={120}
              animateBy="letters"
              direction="top"
              onAnimationComplete={()=> {}}
              className="text-blue-600"
            />
          </div>
          <div className="title text-center">
            <div className="title-heading">
              {/* <h1 className="text-5xl/14 md:text-6xl/16 font-bold mb-4 text-center">Find your perfect <br className="hidden md:block"/> Car. Buy</h1> */}
              <p className="text-lg/6 md:text-xl/8 mb-5 text-color text-center">Your trusted partner in finding the perfect vehicle. We offer quality cars, exceptional service, and competitive prices.</p>
            </div>
          </div>

          <div className="hero-btn flex items-center justify-center max-sm:flex-col gap-4 md:gap-6">
            <CustomButton 
              containerStyle="btn1 bg-[var(--primary)] text-white text-sm hover:bg-emerald-600 py-3.5 px-6.5 text-nowrap"
              contentText="Browse Inventory"
              onClick=''
              href='/cars'
            />
            <CustomButton 
              containerStyle="btn2 text-black border-white hover:bg-black hover:text-white bg-transparent text-sm py-3.5 px-12 text-nowrap"
              contentText="Get Quote"
              onClick=''
              href='/contact'
            />
            {/* <Button size="lg" asChild>
              <Link href="/cars">Browse Inventory</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-900 bg-transparent"
            >
              <Link href="/contact">Get Quote</Link>
            </Button> */}
          </div>
        </div>

        <div className="hero-display w-full md:w-[80%] lg:w-[70%] absolute z-50 bottom-20 lg:bottom-15">
          <Image 
            src={hero_slider}
            alt="hero-display"
            className="w-full"
            width={50}
            height={50}
          />
        </div>

        {/* HERO IMAGE SLIDER */}
        {/* <HeroSlider /> */}

        <div className="absolute hero-background">
          <div className="background-top"></div>
          <div className="hero-bgline absolute bottom-[24px] h-[22%] left-0 overflow-hidden w-full">
            <div className="absolute inset-0 rounded-[inherit] top-0 right-0 bottom-0 left-0">
              <Image 
                src={hero_bgline}
                alt="Hero Background Line"
                className="shape-line"
                width={2406}
                height={442}
                sizes="100vw"
              />
            </div>
          </div>
        </div>
      </section>

      <InfiniteScroll />

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose <span className="heading-text">Hope Autos?</span> </h2>
            <p className="text-lg text-[var(--text-color)]">We're committed to providing the best car buying experience</p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-[var(--text-color)]">Every vehicle undergoes thorough inspection</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
                <p className="text-[var(--text-color)]">Competitive pricing with no hidden fees</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Expert Team</h3>
                <p className="text-[var(--text-color)]">Knowledgeable staff to help you choose</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Wrench className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Full Service</h3>
                <p className="text-[var(--text-color)]">Complete automotive services available</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Cars Section */}
      <section className="py-16 mb-10 bg-[var(--background-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Vehicles</h2>
            <p className="text-lg text-[var(--text-color)]">Check out our handpicked selection of premium vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center mt-12 mx-auto">
            <CustomButton 
              containerStyle="btn2 text-black border-[var(--border-line)] bg-transparent text-sm py-4 px-12 text-nowrap"
              contentText="View All Cars"
              onClick=''
              href='/cars'
            />
          </div> 
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-[var(--color-blue-600)] text-[var(--background)]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Car?</h2>
          <p className="text-xl mb-8">Contact us today for a personalized consultation and test drive</p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" className="bg-[#000] text-[#fff] hover:bg-[#252525] cursor-pointer">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#fff] text-[#000] hover:bg-[#e0e0e0] px-7 cursor-pointer"
            >
              <Link href="tel:5551234567">Call Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
