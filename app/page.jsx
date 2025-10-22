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
            <Card>
              <CardContent className="p-6 text-center">
                {/* <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Beenhere-Fill--Streamline-Outlined-Fill-Material" height="24" width="24" className="size-13 fill-blue-600 mx-auto mb-4">
                  <path fill="inherit" d="M12 23 4.6 17.45c-0.183335 -0.13335 -0.329165 -0.30835 -0.4375 -0.525C4.054165 16.70835 4 16.48335 4 16.25V3.5c0 -0.4 0.15 -0.75 0.45 -1.05 0.3 -0.3 0.65 -0.45 1.05 -0.45h13c0.4 0 0.75 0.15 1.05 0.45 0.3 0.3 0.45 0.65 0.45 1.05v12.75c0 0.23335 -0.05415 0.45835 -0.1625 0.675 -0.10835 0.21665 -0.25415 0.39165 -0.4375 0.525L12 23Zm-1.05 -8 5.65 -5.65 -1.075 -1.05 -4.6 4.6 -2.475 -2.475 -1.05 1.05L10.95 15Z" stroke-width="0.5"></path>
                </svg>
                <h3 className="text-lg font-semibold mb-2">Quality Guarantee</h3>
                <p className="text-[var(--text-color)]">Every vehicle undergoes thorough inspection</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                {/* <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Tag-Dollar--Streamline-Ultimate" height="24" width="24" className="size-11 fill-blue-600 mx-auto mb-4">
                  <path d="M22.5 0H14a2.89 2.89 0 0 0 -2.06 0.85L0.5 12.29a1.71 1.71 0 0 0 0 2.42l8.79 8.79a1.71 1.71 0 0 0 2.42 0l11.44 -11.44A2.89 2.89 0 0 0 24 10V1.5A1.5 1.5 0 0 0 22.5 0Zm-8.31 10.71c0.56 2.09 1.09 4.07 0 5.2a2.83 2.83 0 0 1 -4.06 0 0.24 0.24 0 0 0 -0.35 0l-0.78 0.78a1 1 0 0 1 -0.71 0.29 1 1 0 0 1 -0.71 -1.7l0.79 -0.79a0.24 0.24 0 0 0 0 -0.35L7 12.79a1 1 0 0 1 1.41 -1.41l3.12 3.12a0.86 0.86 0 0 0 1.24 0c0.32 -0.32 -0.24 -2.39 -0.47 -3.27 -0.56 -2.09 -1.09 -4.06 0 -5.19a2.72 2.72 0 0 1 4.07 0 0.24 0.24 0 0 0 0.35 0l0.78 -0.78a1 1 0 0 1 1.42 0 1 1 0 0 1 0 1.41l-0.78 0.78a0.24 0.24 0 0 0 0 0.36l1.33 1.34a1 1 0 0 1 0 1.41 1 1 0 0 1 -1.41 0L15 7.45a0.76 0.76 0 0 0 -1.24 0c-0.36 0.32 0.24 2.38 0.43 3.26Z" fill="inherit" stroke-width="1"></path>
                </svg>
                <h3 className="text-lg font-semibold mb-2">Best Prices</h3>
                <p className="text-[var(--text-color)]">Competitive pricing with no hidden fees</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                {/* <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Multiple-Neutral-2--Streamline-Ultimate" height="24" width="24" className="size-12 fill-blue-600 mx-auto mb-4">
                  <g id="Multiple-Neutral-2--Streamline-Ultimate.svg">
                    <path d="M18 14.5a5.86 5.86 0 0 0 -2.61 0.61 0.49 0.49 0 0 0 -0.27 0.31 0.56 0.56 0 0 0 0.06 0.4 8.89 8.89 0 0 1 1.32 4.68 0.51 0.51 0 0 0 0.5 0.5h6.5a0.5 0.5 0 0 0 0.5 -0.5 6 6 0 0 0 -6 -6Z" fill="inherit" stroke-width="1"></path>
                    <path d="M14.19 10.25a3.75 3.75 0 1 0 7.5 0 3.75 3.75 0 1 0 -7.5 0" fill="inherit" stroke-width="1"></path>
                    <path d="M2.75 7.75a4.75 4.75 0 1 0 9.5 0 4.75 4.75 0 1 0 -9.5 0" fill="inherit" stroke-width="1"></path>
                    <path d="M15 20.5a7.5 7.5 0 0 0 -15 0 0.5 0.5 0 0 0 0.5 0.5h14a0.5 0.5 0 0 0 0.5 -0.5Z" fill="inherit" stroke-width="1"></path>
                  </g>
                </svg>
                <h3 className="text-lg font-semibold mb-2">Expert Team</h3>
                <p className="text-[var(--text-color)]">Knowledgeable staff to help you choose</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                {/* <Wrench className="h-12 w-12 text-blue-600 mx-auto mb-4" /> */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" id="Cog-Hand-Give-1--Streamline-Ultimate" height="24" width="24" className="size-12 fill-blue-600 mx-auto mb-4">
                  <g id="Cog-Hand-Give-1--Streamline-Ultimate.svg">
                    <path d="M15.6259 7.2388c0 1.1583 1.2539 1.8823 2.257 1.3031 0.4655 -0.2688 0.7523 -0.7655 0.7523 -1.3031 0 -1.1583 -1.2539 -1.8822 -2.257 -1.303 -0.4655 0.2687 -0.7523 0.7655 -0.7523 1.303" fill="inherit" stroke-width="1"></path>
                    <path d="M21.9254 7.5498c-0.1607 -0.1762 -0.1607 -0.4458 0 -0.6219l1.0031 -1.0734c0.5617 -0.5821 0.6529 -1.4728 0.2207 -2.1566 -0.383 -0.6836 -1.1747 -1.0282 -1.936 -0.8426l-1.4144 0.331c-0.2339 0.0529 -0.4693 -0.0823 -0.5417 -0.311l-0.4213 -1.3542c-0.3805 -1.3127 -2.0395 -1.7212 -2.986 -0.7352 -0.1989 0.2071 -0.3446 0.4594 -0.4245 0.7352l-0.4213 1.3944c-0.0723 0.2286 -0.3078 0.3638 -0.5417 0.3109l-1.4144 -0.331c-0.752 -0.1928 -1.5409 0.1342 -1.936 0.8025 -0.4085 0.6769 -0.3141 1.5435 0.2307 2.1165l1.0031 1.0734c0.1607 0.1761 0.1607 0.4457 0 0.6219L11.3426 8.583c-0.9385 1.0042 -0.438 2.6478 0.9009 2.9585 0.2646 0.0614 0.5397 0.0616 0.8044 0.0007l1.4144 -0.321c0.2347 -0.0582 0.4735 0.0789 0.5417 0.3109l0.4213 1.3944c0.4074 1.3127 2.0831 1.6921 3.0163 0.6829 0.1806 -0.1954 0.3153 -0.4288 0.3942 -0.6829l0.4213 -1.3944c0.0682 -0.232 0.307 -0.3691 0.5417 -0.3109l1.4144 0.321c1.3394 0.3085 2.5106 -0.9486 2.1081 -2.2629 -0.0796 -0.2597 -0.2173 -0.4978 -0.4028 -0.6963Zm-4.7948 2.6984c-2.3166 0 -3.7645 -2.5078 -2.6062 -4.514s4.054 -2.0062 5.2123 0c0.2641 0.4574 0.4032 0.9764 0.4032 1.5046 0 1.662 -1.3473 3.0094 -3.0093 3.0094Z" fill="inherit" stroke-width="1"></path>
                    <path d="M1.5824 14.4813c-0.554 -0.0001 -1.0031 0.4491 -1.0031 1.0031v7.2725c0.0024 0.7722 0.8399 1.2522 1.5074 0.864 0.3078 -0.1791 0.4977 -0.5079 0.4988 -0.864v-7.2725c0 -0.554 -0.4491 -1.0031 -1.0031 -1.0031Z" fill="inherit" stroke-width="1"></path>
                    <path d="M16.1275 19.246H6.9791c-0.4826 0.0612 -0.8505 -0.423 -0.6622 -0.8715 0.1099 -0.2617 0.3807 -0.4181 0.6622 -0.3824h2.5278c0.718 -0.0005 1.2029 -0.7332 0.9229 -1.3943 -0.3514 -0.8292 -1.1658 -1.3669 -2.0664 -1.3642H4.0902c-0.277 0 -0.5016 0.2245 -0.5016 0.5015v6.5202c0 0.277 0.2246 0.5016 0.5016 0.5016h10.7934c1.241 0 2.247 -1.006 2.247 -2.247v-0.2608c0 -0.554 -0.4492 -1.0031 -1.0032 -1.0031Z" fill="inherit" stroke-width="1"></path>
                  </g>
                </svg>
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
          <p className="text-lg md:text-xl mb-8">Contact us today for a personalized consultation and test drive</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" variant="secondary" className="bg-[#000] text-[#fff] hover:bg-[#252525] cursor-pointer px-15 py-7">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button
              size="lg"
              // variant="outline"
              className="bg-[#fff] text-[#000] hover:bg-[#e0e0e0] px-16 py-7 cursor-pointer"
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
