import Link from "next/link"
import { ArrowRight, BadgeCheck, CarFront, Headset, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import CarCard from "./components/CarCard"
import HomeHeroCarousel from "./components/HomeHeroCarousel"
import Footer from "./components/Footer"
import { getFeaturedCars } from "@/lib/db"
import NewsletterSignup from "./components/NewsletterSignup"

const reasons = [
  {
    icon: ShieldCheck,
    title: "Quality you can trust",
    description: "Every vehicle is carefully selected and inspected before it reaches our showroom.",
  },
  {
    icon: BadgeCheck,
    title: "Straightforward buying",
    description: "Clear vehicle details, transparent pricing, and a team ready to guide you.",
  },
  {
    icon: Headset,
    title: "Here for the whole journey",
    description: "From your first question to your first drive, our team is here to help.",
  },
]

export default async function HomePage() {
  const featuredCars = await getFeaturedCars()

  return (
    <div className="min-h-screen bg-background">
      <HomeHeroCarousel cars={featuredCars} />

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">A few good choices</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Featured vehicles</h2>
            <p className="mt-3 max-w-xl text-base text-muted-foreground">
              Well-kept cars, thoughtfully selected for your next move.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full px-5">
            <Link href="/cars">
              Explore all cars <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCars.slice(0, 3).map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card px-6 py-14 text-center">
            <CarFront className="mx-auto mb-4 h-9 w-9 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">New arrivals are on the way</h3>
            <p className="mt-2 text-sm text-muted-foreground">Check back soon or get in touch and we’ll help you find a car.</p>
            <Button asChild className="mt-6 rounded-full">
              <Link href="/contact">Talk to our team</Link>
            </Button>
          </div>
        )}

        <div id="hope-home-cta" className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-8 overflow-hidden rounded-xl px-3 py-10 sm:px-12 sm:py-14 lg:flex-row lg:items-center" style={{ color: "#fff" }}>
          <div className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-500 opacity-60">Your next drive is closer</p>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-foreground">Let’s find the right car for you.</h2>
            <p className="mt-4 max-w-xl text-sm leading-6 opacity-65 sm:text-base text-muted-foreground">
              Browse the collection or talk with our team about what you’re looking for.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button asChild style={{ backgroundColor: "#71aa00", color: "#171717" }} className="rounded-full px-6 hover:opacity-90">
              <Link href="/cars">Browse inventory <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild variant="outline" style={{ borderColor: "rgba(255,255,255,.25)" }} className="rounded-full bg-transparent text-foreground px-6 hover:bg-white/10">
              <Link href="/contact">Contact us</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600">
              <Sparkles className="h-5 w-5" />
            </div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">The Hope Autos difference</p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">A more considered way to buy</h2>
            <p className="mt-3 text-base text-muted-foreground">
              Great service should feel as good as finding the right car.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {reasons.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="rounded-3xl border border-border bg-card p-7 shadow-sm">
                <span className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100/20 text-blue-500">
                  <Icon className="size-8" />
                </span>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  0{index + 1} / Built around you
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-20">
        <NewsletterSignup />
      </section>

      <Footer />
    </div>
  )
}
