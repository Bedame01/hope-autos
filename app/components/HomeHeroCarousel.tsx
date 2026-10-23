"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from "lucide-react"
import type { Car } from "@/lib/types"
import { useCurrency } from "@/app/contexts/CurrencyContext"

interface HomeHeroCarouselProps {
  cars: Car[]
}

export default function HomeHeroCarousel({ cars }: HomeHeroCarouselProps) {
  const slides = cars.length > 0 ? cars.slice(0, 4) : [null]
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const { formatPrice } = useCurrency()
  const activeCar = slides[activeIndex]

  useEffect(() => {
    if (slides.length < 2 || isPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [isPaused, slides.length])

  const showPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length)
  const showNext = () => setActiveIndex((index) => (index + 1) % slides.length)

  return (
    <section
      id="hope-home-hero"
      aria-label="Featured vehicles"
      aria-roledescription="carousel"
      className="relative isolate mx-3 mt-3 min-h-[650px] overflow-hidden rounded-[2rem] bg-[#171717] sm:mx-5 sm:mt-5 sm:min-h-[680px] lg:min-h-[min(760px,calc(100svh-6rem))]"
      style={{ color: "#fff" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsPaused(false)
      }}
    >
      {slides.map((car, index) => (
        <div
          key={car?.id ?? "showroom"}
          className={`absolute inset-0 -z-10 transition-opacity duration-1000 ${index === activeIndex ? "opacity-100" : "opacity-0"}`}
          aria-hidden="true"
        >
          <Image
            src={car?.images?.[0] || "/image/herocar5.jpg"}
            alt=""
            fill
            priority={index === 0}
            sizes="100vw"
            unoptimized
            className={`object-cover transition-transform duration-[7000ms] ease-out ${index === activeIndex ? "scale-100" : "scale-105"}`}
          />
        </div>
      ))}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/15" />

      <div className="relative mx-auto flex min-h-[650px] max-w-[1440px] flex-col justify-between px-6 pb-7 pt-9 sm:min-h-[680px] sm:px-10 sm:pb-9 sm:pt-12 lg:min-h-[min(760px,calc(100svh-6rem))] lg:px-16 lg:pb-12 lg:pt-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] opacity-80">
            <span className="h-px w-8 bg-white/70" />
            Hope Autos Limited
          </div>
          <span className="hidden rounded-full border border-white/25 bg-black/15 px-4 py-2 text-xs opacity-80 backdrop-blur sm:inline-flex">
            Quality cars. Thoughtfully chosen.
          </span>
        </div>

        <div className="max-w-3xl pb-4 pt-20 sm:pb-8 sm:pt-24">
          <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] opacity-75">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {activeCar ? "In the spotlight" : "Find your next drive"}
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
            {activeCar ? (
              <>
                Meet your next{" "}
                <span className="mt-2 block opacity-70">{activeCar.make} {activeCar.model}.</span>
              </>
            ) : (
              <>A better drive starts here.</>
            )}
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-6 opacity-75 sm:text-base sm:leading-7">
            {activeCar
              ? `${activeCar.year} ${activeCar.make} ${activeCar.model} — explore the details, see if it feels right, and make it yours.`
              : "Discover quality vehicles and a more considered way to find the one that feels right."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href={activeCar ? `/cars/${activeCar.id}` : "/cars"}
              style={{ color: "#171717" }}
              className="inline-flex bg-blue-500 h-12 items-center rounded-full px-6 text-sm font-semibold transition hover:opacity-90"
            >
              {activeCar ? "Discover this car" : "Browse inventory"}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/cars"
              style={{ borderColor: "rgba(255,255,255,.3)" }}
              className="inline-flex h-12 items-center rounded-full border bg-white/5 px-6 text-sm font-medium backdrop-blur transition hover:bg-white/15"
            >
              Explore all cars
            </Link>
          </div>

          {activeCar && (
            <div className="mt-10 flex flex-wrap items-end gap-x-8 gap-y-3 border-t border-white/20 pt-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">Featured vehicle</p>
                <p className="mt-1 text-sm font-medium">{activeCar.year} · {activeCar.bodyType} · {activeCar.transmission}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] opacity-60">Asking price</p>
                <p className="mt-1 text-lg font-semibold">{formatPrice(activeCar.price)}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-2" aria-label="Choose featured vehicle">
            {slides.map((car, index) => (
              <button
                key={car?.id ?? "showroom"}
                type="button"
                aria-label={`Show slide ${index + 1}${car ? `: ${car.year} ${car.make} ${car.model}` : ""}`}
                aria-current={index === activeIndex}
                onClick={() => setActiveIndex(index)}
                style={{ backgroundColor: index === activeIndex ? "#c7ec7b" : "rgba(255,255,255,.4)" }}
                className={`h-1.5 rounded-full transition-all duration-300 ${index === activeIndex ? "w-10" : "w-5 hover:opacity-80"}`}
              />
            ))}
            <span className="ml-2 text-xs tabular-nums opacity-70">
              {String(activeIndex + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Previous featured vehicle"
              style={{ borderColor: "rgba(255,255,255,.25)" }}
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-black/15 backdrop-blur transition hover:bg-white/15"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next featured vehicle"
              style={{ borderColor: "rgba(255,255,255,.25)" }}
              className="flex h-10 w-10 items-center justify-center rounded-full border bg-black/15 backdrop-blur transition hover:bg-white/15"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={isPaused ? "Resume carousel" : "Pause carousel"}
              style={{ borderColor: "rgba(255,255,255,.25)" }}
              className="hidden h-10 w-10 items-center justify-center rounded-full border bg-black/15 backdrop-blur transition hover:bg-white/15 sm:flex"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      <Link href="/cars" aria-label="Scroll to vehicle collection" className="absolute bottom-24 right-7 hidden items-center gap-2 text-xs opacity-65 lg:flex">
        Find your car <ArrowDown className="h-3.5 w-3.5" />
      </Link>
    </section>
  )
}
