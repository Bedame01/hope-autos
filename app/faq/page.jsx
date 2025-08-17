import { Card, CardContent } from "@/components/ui/card"

const faqData = [
    { id: '01', question: "What types of vehicles do you offer at Hope Autos?", answer: "Hope Autos offers a diverse selection of vehicles, including [Electric Vehicles]" },
    
]

const page = () => {
  return (
    <main className="min-h-screen px-4 sm:px-7">
        <div className="faq-wrapper">
          <div className="faq-head mb-10">
              <p className="text-blue-600">FAQ</p>
              <h1 className="text-3xl md:text-4xl text-[var(--foreground)]">Got Questions?</h1>
          </div>

          {faqData.map((faq) => (
            <Card key={faq.id} className="p-6">
              <div className="faq-head w-full flex items-center justify-between gap-2">
                <div className="faq-head-text flex items-center gap-3">
                  <p className="text-[var(--text-color)]">{faq.id}/</p>
                  <p className="text-[var(--foreground)]">{faq.question}</p>
                </div>

                <div className="faq-head-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" focusable="false" color="var(--token-8303387e-d4c2-4989-af33-54d2c870c7ac, rgb(47, 47, 47))">
                    <g color="var(--token-8303387e-d4c2-4989-af33-54d2c870c7ac, rgb(47, 47, 47))" weight="regular">
                      <path d="M224,128a8,8,0,0,1-8,8H136v80a8,8,0,0,1-16,0V136H40a8,8,0,0,1,0-16h80V40a8,8,0,0,1,16,0v80h80A8,8,0,0,1,224,128Z"></path>
                    </g>
                  </svg>
                </div>
              </div>
            </Card>
          ))}
          

        </div>
    </main>
  )
}

export default page

// Frequently Asked Questions (FAQ)

// **Q1: What types of vehicles do you offer at Hope Autos?**
// A1: Hope Autos offers a diverse selection of vehicles, including [Electric Vehicles]

// **Q2: Can you provide an example of an electric vehicle currently in your inventory?**
// A2: Yes, we currently have a **2024 Tesla Model 3** available. It's a black carbon sedan with automatic transmission and has 20,000 miles on it, priced at $110,000. You can view more details on its [product page](http://localhost:3000/cars).

// **Q3: What gasoline vehicles are available?**
// A3: An example of a gasoline vehicle in our inventory is the **2025 Toyota Camry**. This brand new model has 15,000 miles, an automatic transmission, and is silver in color, priced at $2,500. More information can be found on its [details page]

// **Q4: Do you have any diesel vehicles in stock?**
// A4: Absolutely. We have a **2025 Mercedes-Benz GLC GLC220d 4matic Avantgarde**. This clean and neat diesel vehicle has 7,000 miles, an automatic transmission, and comes in Polar White, priced at $68,070. You can check its full details [here]

// **Q5: How can I inquire about a specific vehicle or start the purchasing process?**
// A5: For each vehicle listed in our inventory, you will find "View Details" and "Contact" options. You can click on "View Details" for more information about the car, or "Contact" to get in touch with our team directly about purchasing or any other inquiries.


{/* <svg width="16" height="16" data-view-component="true">        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16" data-view-component="true" class="octicon color-fg-default">
  <g clip-path="url(#clip0_643_9687)">
    <path d="M8.00018 3.16667C9.18018 3.16667 10.2368 3.57333 11.0702 4.36667L13.3535 2.08333C11.9668 0.793333 10.1568 0 8.00018 0C4.87352 0 2.17018 1.79333 0.853516 4.40667L3.51352 6.47C4.14352 4.57333 5.91352 3.16667 8.00018 3.16667Z" fill="#EA4335"></path>
    <path d="M15.66 8.18335C15.66 7.66002 15.61 7.15335 15.5333 6.66669H8V9.67335H12.3133C12.12 10.66 11.56 11.5 10.72 12.0667L13.2967 14.0667C14.8 12.6734 15.66 10.6134 15.66 8.18335Z" fill="#4285F4"></path>
    <path d="M3.51 9.53001C3.35 9.04668 3.25667 8.53334 3.25667 8.00001C3.25667 7.46668 3.34667 6.95334 3.51 6.47001L0.85 4.40668C0.306667 5.48668 0 6.70668 0 8.00001C0 9.29334 0.306667 10.5133 0.853333 11.5933L3.51 9.53001Z" fill="#FBBC05"></path>
    <path d="M8.0001 16C10.1601 16 11.9768 15.29 13.2968 14.0633L10.7201 12.0633C10.0034 12.5467 9.0801 12.83 8.0001 12.83C5.91343 12.83 4.14343 11.4233 3.5101 9.52667L0.850098 11.59C2.1701 14.2067 4.87343 16 8.0001 16Z" fill="#34A853"></path>
  </g>
  <defs>
    <clipPath id="clip0_643_9687">
      <rect width="16" height="16" fill="white"></rect>
    </clipPath>
  </defs>
</svg>
</svg> */}