"use client";
import Slider from "react-slick";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Image from "next/image";

const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 3.4,
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1024,
      settings: { slidesToShow: 2 },
    },
    {
      breakpoint: 640,
      settings: { slidesToShow: 1 },
    },
  ],
};
const templates = [
  "Proforma Invoice Template",
  "Excel Invoice Template",
  "Word Invoice Template",
  "Freelance Invoice Template",
];
export default function ShowcaseSection() {
  return (
    <section className="w-full bg-[#1a1919] text-white py-20 px-6">
      <div className="mx-auto max-w-4xl space-y-16">
        {/* TOP SECTION */}
        <div className="flex gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-5 flex-1 w-full">
            <h2 className="text-3xl md:text-4xl whitespace-nowrap font-thin leading-tight">
              Invoicing made easy with Zoho Invoice
            </h2>

            <p className="text-gray-400 leading-relaxed max-w-2xl">
              Creating invoices is a hassle. So is chasing payments, tracking
              expenses, and doing taxes. Zoho Invoice makes all that boring
              stuff easy. Send invoices and quotes, track time, monitor
              expenses, and much more for free.
            </p>
          </div>

          {/* Right CTA */}
          <div className="flex md:justify-end">
            <Button className="bg-blue-600 p-6 hover:bg-blue-700 text-white">
              Try Zoho Invoice Now
            </Button>
          </div>
        </div>

        {/* IMAGE PREVIEW */}
        <div className="relative rounded-xl overflow-hidden bg-gray-800 h-[300px] md:h-[370px] flex items-center justify-center">
          <Image src={"/showcase.png"} alt={"Loading..."} fill />
        </div>

        {/* TEMPLATES SECTION */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <h3 className="text-2xl md:text-3xl">
              Invoice templates: Simple, stylish, and surprisingly effortless
            </h3>

            <Button className="bg-blue-600 p-7 hover:bg-blue-700">
              Explore more templates
            </Button>
          </div>

          {/* Horizontal Scroll Cards */}
          <div className="relative">
            <Slider {...sliderSettings}>
              {templates.map((title, i) => (
                <div key={i} className="px-2">
                  <Card className="bg-white text-black rounded-lg overflow-hidden">
                    <div className="h-40 bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                      Preview
                    </div>

                    <div className="p-3 text-sm flex justify-between items-center">
                      <span>{title}</span>
                      <span>↗</span>
                    </div>
                  </Card>
                </div>
              ))}
            </Slider>
            <div className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#1a1919] to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
