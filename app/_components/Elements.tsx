import { Separator } from "@/components/ui/separator";
import { FileText, Hash, Building2, Package, Calendar, FileCheck } from "lucide-react"

const elements = [
  {
    title: "Business logo",
    icon: FileText,
    desc: "A business logo is a unique symbol that represents an organization. Adding a business logo to your invoices not only reinforces your brand's identity among your customers but also projects your business as a legitimate one.",
  },
  {
    title: "Invoice number",
    icon: Hash,
    desc: "Businesses might send out huge volumes of invoices. In such cases, tracking each invoice becomes a tedious task. This is where an invoice number comes in handy. An Invoice number is a sequential number that uniquely identifies each invoice. Sequentially numbering each invoice helps businesses track a specific transaction.",
  },
  {
    title: "Business name",
    icon: Building2,
    desc: "This is the name that your organization goes by. Having your business name and address on your invoice not only makes it easy for your customers to communicate with you but also reassures them that they are dealing with a credible business.",
  },
  {
    title: "Product description",
    icon: Package,
    desc: "A product description is a compelling marketing copy that showcases all the information of the product. This may include details like the product's size, dimensions, color, and other information. Describing the product in your invoices gives your customers a clear idea of what they are buying.",
  },
  {
    title: "Invoice date",
    icon: Calendar,
    desc: "The invoice date is when the invoice is issued. It also includes the due date by which the customer should complete payment.",
  },
  {
    title: "Terms and conditions",
    icon: FileCheck,
    desc: "Terms and conditions define rules for both buyer and seller, including payment terms, late fees, and return/refund policies.",
  },
]

export default function InvoiceElements() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <h2 className="text-left text-2xl md:text-3xl border-b pb-5 mb-12">
          What elements should an invoice include?
        </h2>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-10">
          {elements.map((item, index) => {
            const Icon = item.icon
            const diff = elements.length - index + 1;
            return (
              <div
                key={index}
                className={`flex gap-4 pb-6 ${diff>3 && "border-b"}`}
              >
                {/* Icon */}
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-blue-600 text-white shrink-0">
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-bold text-lg mb-1">
                    {item.title}
                  </h3>
                  <p className="text-foreground/80 text-md leading-[1.6]">
                    {item.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
          <Separator />
      </div>
    </section>
  )
}