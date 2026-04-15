"use client"

import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gray-100 pt-30 py-24 px-6">
      <div className="mx-auto max-w-5xl text-center">
        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-800">
          <span className="text-blue-600">
            Create invoices
          </span>{" "}
          that
          <br />
          make you look good
        </h1>

        {/* Subtext */}
        <p className="mt-6 font-semibold text-foreground/60 text-center text-md max-w-2xl mx-auto leading-relaxed">
          Create professional yet personalized invoices online using Zoho Invoice's free invoice generator tool. Just add all the information to the invoice and download or print it to send it to your customers.
        </p>
      </div>

      <div className="absolute -left-5 -bottom-33">
        <div className="w-70 h-70 relative">
          <Image src={"/hero-left.svg"} alt={"Loading..."} fill/>
        </div>
      </div>

      <div className="absolute right-0 top-40">
        <div className="w-20 h-40 relative">
          <Image src={"/hero-right.svg"} alt={"Loading..."} fill/>
        </div>
      </div>
    </section>
  )
}