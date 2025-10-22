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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4 heading-text">Frequently Asked Questions</h1>
          <p className="text-lg md:text-xl text-muted-foreground">Find answers to common questions about Hope Autos</p>
        </div>

        {/* Search */}
        <div className="mb-8 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            onClick={() => setActiveCategory(null)}
            className={activeCategory === null ? "bg-blue-600" : "bg-transparent"}
          >
            All Categories
          </Button>
          {faqs.map((category) => (
            <Button
              key={category.category}
              variant={activeCategory === category.category ? "default" : "outline"}
              onClick={() => setActiveCategory(category.category)}
              className={activeCategory === category.category ? "bg-blue-600" : "bg-transparent"}
            >
              {category.category}
            </Button>
          ))}
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {visibleFaqs.map((category) => (
            <div key={category.category}>
              {category.questions.length > 0 && (
                <>
                  {activeCategory === null && (
                    <h2 className="text-2xl font-bold text-foreground mb-4 mt-10">{category.category}</h2>
                  )}
                  <div className="space-y-3">
                    {category.questions.map((item, index) => {
                      const id = `${category.category}-${index}`
                      const isExpanded = expandedQuestion === id

                      return (
                        <Card key={id} className="overflow-hidden py-0">
                          <button
                            onClick={() => setExpandedQuestion(isExpanded ? null : id)}
                            className="w-full text-left p-6 hover:bg-muted transition-colors flex items-center justify-between"
                          >
                            <h3 className="font-semibold text-foreground text-lg pr-4">{item.q}</h3>
                            <ChevronDown
                              className={`h-5 w-5 text-blue-600 flex-shrink-0 transition-transform ${
                                isExpanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                          {isExpanded && (
                            <div className="px-6 pb-6 pt-0 border-t">
                              <p className="text-muted-foreground leading-relaxed">{item.a}</p>
                            </div>
                          )}
                        </Card>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          ))}

          {visibleFaqs.every((cat) => cat.questions.length === 0) && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground text-lg">No FAQs found matching your search.</p>
                <p className="text-muted-foreground mt-2">Try different keywords or browse all categories.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Contact Section */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-foreground">Still have questions?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Can't find the answer you're looking for? Our support team is here to help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue-600 hover:bg-blue-500" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@hopeautos.com">Email Support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}