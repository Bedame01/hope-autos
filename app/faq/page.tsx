"use client"

import { useState } from "react"
import { ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    category: "Buying",
    questions: [
      {
        q: "How do I search for vehicles?",
        a: "Use the search bar on our inventory page to filter by make, model, year, price range, and other specifications. You can save your search for future reference.",
      },
      {
        q: "Can I get financing for a vehicle?",
        a: "Yes, we offer flexible financing options. Contact our sales team for details on current rates and terms.",
      },
      {
        q: "What payment methods do you accept?",
        a: "We accept cash, cashier's checks, bank transfers, and credit cards. Financing options are also available.",
      },
      {
        q: "Do you offer trade-in services?",
        a: "Yes! We accept trade-ins. Get a free appraisal by visiting our dealership or contacting us online.",
      },
      {
        q: "What's your warranty policy?",
        a: "All our vehicles come with a comprehensive warranty. Details vary by vehicle age and mileage.",
      },
    ],
  },
  {
    category: "Account",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click 'Sign Up' in the top menu and fill in your information. You'll receive a welcome email to confirm your account.",
      },
      {
        q: "How do I reset my password?",
        a: "Click 'Forgot Password' on the sign-in page. Enter your email and follow the link in the reset email.",
      },
      {
        q: "Can I save my favorite vehicles?",
        a: "Yes! Click the heart icon on any vehicle to add it to your favorites. Access them from your dashboard.",
      },
      {
        q: "How do I update my profile?",
        a: "Go to Settings from your account menu. You can update your name, email, and notification preferences.",
      },
      {
        q: "Is my personal information secure?",
        a: "Absolutely. We use industry-standard encryption to protect your data. See our Privacy Policy for details.",
      },
    ],
  },
  {
    category: "Vehicles",
    questions: [
      {
        q: "How often is your inventory updated?",
        a: "We add new vehicles regularly. Enable notifications in your settings to be alerted about new arrivals.",
      },
      {
        q: "Can I schedule a test drive?",
        a: "Yes, click 'Schedule Test Drive' on any vehicle listing. You can choose your preferred date and time.",
      },
      {
        q: "Are vehicle histories available?",
        a: "Yes, we provide detailed vehicle history reports including accident records and maintenance history.",
      },
      {
        q: "What does your inspection process include?",
        a: "All vehicles undergo a multi-point inspection covering mechanical, electrical, and cosmetic aspects.",
      },
      {
        q: "Can I get a vehicle inspection before purchase?",
        a: "Of course! We encourage pre-purchase inspections. Our team is happy to provide one.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        q: "How do I contact customer support?",
        a: "You can reach us via email, phone, or visit our contact page. We typically respond within 24 hours.",
      },
      {
        q: "What are your business hours?",
        a: "Monday - Friday: 9 AM - 6 PM, Saturday: 10 AM - 4 PM, Sunday: Closed.",
      },
      {
        q: "Do you offer delivery or shipping?",
        a: "Yes, we can arrange vehicle delivery to your location. Contact our sales team for pricing.",
      },
      {
        q: "What if I have issues after purchase?",
        a: "Our after-sales support team is here to help. Contact us at support@hopeautos.com.",
      },
      {
        q: "Can I return a vehicle?",
        a: "We offer a 7-day return policy on all vehicles. See our Return Policy for complete details.",
      },
    ],
  },
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (item) =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }))

  const visibleFaqs =
    activeCategory === null ? filteredFaqs : filteredFaqs.filter((cat) => cat.category === activeCategory)

  return (
    <div className="min-h-screen bg-muted/20 px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-600">Here to help</p>
          <h1 className="mb-4 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl heading-text">
            Frequently asked questions
          </h1>
          <p className="mx-auto max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Find clear answers about buying, your account, our vehicles, and getting in touch.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 rounded-2xl border border-border bg-card p-2 shadow-sm sm:mb-8">
          <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-12 rounded-xl border-0 bg-transparent pl-12 text-base shadow-none focus-visible:ring-0"
          />
        </div>

        {/* Category Filter */}
        <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full px-5 ${activeCategory === null ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-card"}`}
          >
            All Categories
          </Button>
          {faqs.map((category) => (
            <Button
              key={category.category}
              variant={activeCategory === category.category ? "default" : "outline"}
              onClick={() => setActiveCategory(category.category)}
              className={`shrink-0 rounded-full px-5 ${activeCategory === category.category ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-card"}`}
            >
              {category.category}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-7 sm:space-y-9">
          {visibleFaqs.map((category) => (
            <div key={category.category}>
              {category.questions.length > 0 && (
                <>
                  {activeCategory === null && (
                    <h2 className="mb-3 text-xl font-semibold tracking-tight text-foreground sm:mb-4 sm:text-2xl">{category.category}</h2>
                  )}
                  <div className="space-y-3">
                    {category.questions.map((item) => {
                      const id = `${category.category}-${item.q.replaceAll(" ", "-")}`
                      const isExpanded = expandedQuestion === id

                      return (
                        <Card key={id} className="overflow-hidden rounded-2xl border-border/80 py-0 shadow-sm">
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={`${id}-answer`}
                            onClick={() => setExpandedQuestion(isExpanded ? null : id)}
                            className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/50 sm:px-6"
                          >
                            <h3 className="pr-2 text-base font-semibold leading-6 text-foreground sm:text-lg">{item.q}</h3>
                            <ChevronDown
                              className={`h-5 w-5 shrink-0 text-blue-600 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          <div
                            id={`${id}-answer`}
                            hidden={!isExpanded}
                            className="border-t border-border px-5 pb-5 pt-4 sm:px-6 sm:pb-6"
                          >
                            <p className="text-sm leading-7 text-muted-foreground sm:text-base">{item.a}</p>
                          </div>
                        </Card>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          ))}

          {visibleFaqs.every((cat) => cat.questions.length === 0) && (
            <Card className="rounded-3xl border-dashed shadow-none">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground text-lg">No FAQs found matching your search.</p>
                <p className="text-muted-foreground mt-2">Try different keywords or browse all categories.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-10 overflow-hidden rounded-3xl border-blue-200 bg-blue-50/70 shadow-sm dark:border-blue-900 dark:bg-blue-950/20 sm:mt-14">
          <CardHeader>
            <CardTitle className="text-foreground">Still have questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="rounded-full bg-blue-600 px-6 text-white hover:bg-blue-700" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button variant="outline" className="rounded-full px-6" asChild>
                <a href="mailto:support@hopeautos.com">Email Support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}