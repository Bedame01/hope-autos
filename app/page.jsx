import Link from "next/link"
// import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CarCard from "./components/CarCard"
import { getFeaturedCars } from "@/lib/db"
import { Shield, Award, Users, Wrench } from "lucide-react"
import Footer from "./components/Footer"
import CustomButton from "@/components/ui/CustomButton"
import InfiniteScroll from "@/components/ui/InfiniteScroll"
import Hero from "@/components/ui/Hero/Hero"

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <Hero />
      {/* <section className="hero relative flex flex-nowrap flex-col items-center gap-[56px] z-5 w-full min-h-[93vh] overflow-hidden bg-[var(--background)] rounded-bl-4xl rounded-br-4xl ">
        <div className="absolute inset-0 z-0">
          <Image 
            src={heroCount === 0 ? bg1 : heroCount === 1 ? bg2 : heroCount === 2 ? bg3 : bg1}
            src={bg1}
            alt="Latest Album Artwork" 
            className="object-cover size-full" 
            width={10} 
            height={50} 
            loading="lazy" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 dark:via-background/60 to-background/90"></div>
        </div>
      </section> */}

      <InfiniteScroll />

      {/* Features Section */}
      <section className="py-16 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose <span className="heading-text">Hope Autos?</span> </h2>
            <p className="text-lg text-[var(--text-color)]">We're committed to providing the best car buying experience</p>
          </div>
 
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card data-aos="fade-up" data-aos-duration="1500">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-[var(--text-color)]">Every vehicle undergoes thorough inspection</p>
              </CardContent>
            </Card>

            <Card data-aos="fade-up" data-aos-duration="1500">
              <CardContent className="p-6 text-center">
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
                <p className="text-[var(--text-color)]">Competitive pricing with no hidden fees</p>
              </CardContent>
            </Card>

            <Card data-aos="fade-up" data-aos-duration="1500">
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Expert Team</h3>
                <p className="text-[var(--text-color)]">Knowledgeable staff to help you choose</p>
              </CardContent>
            </Card>

            <Card data-aos="fade-up" data-aos-duration="1500">
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
      <section className="py-16 mb-10 bg-gradient-to-br from-background via-background to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured <span className="heading-text">Vehicles</span></h2>
            <p className="text-lg text-[var(--text-color)]">Check out our handpicked selection of premium vehicles</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCars.map((car) => (
              <CarCard data-aos="zoom-in-down" data-aos-duration="1500" key={car.id} car={car} />
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
      <section className="py-18 bg-[var(--color-blue-600)] text-[var(--background)]">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Next Car?</h2>
          <p className="text-xl mb-8">Contact us today for a personalized consultation and test drive</p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary" className="bg-[#000] text-[#fff] hover:bg-[#252525] cursor-pointer">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              size="lg"
              // variant="outline"
              className="bg-[#fff] text-[#000] hover:bg-[#e0e0e0] px-7 cursor-pointer"
            >
              <Link href="tel:+2348133531046">Call Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
