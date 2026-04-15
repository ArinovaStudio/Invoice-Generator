import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What are the different types of invoices?",
    answer: (
      <div className="space-y-3">
        <p>The different types of invoices are:</p>
        <p><strong>Proforma invoices:</strong> A document that states the commitment of the seller to deliver goods and services to the buyer for an agreed price.</p>
        <p><strong>Commercial invoice:</strong> A document used for customs in the sale of goods that exported across the international borders.</p>
        <p><strong>Credit notes:</strong> A document issued to the buyer in case of goods returned due to damage or any mistakes made.</p>
        <p><strong>Timesheet invoice:</strong> Invoice created for work done on hourly basis.</p>
        <p><strong>Recurring invoices:</strong> Invoices created and sent to customers on a regular interval.</p>
      </div>
    ),
  },
  {
    question: "Why is it important to add due date on the invoice?",
    answer:
      "Adding the due date in your invoice will encourage your customers to make the payment within a certain period, ensuring you get paid on time.",
  },
  {
    question: "Can I customize this blank invoice?",
    answer:
      "With the Free Invoice Generator, you do not have the option to customize the blank invoices. However, Zoho Invoice templates are fully customizable.",
  },
  {
    question: "What is a proforma invoice?",
    answer:
      "A proforma invoice is an estimated invoice sent by the seller to the buyer to inform the buyer about the sale of goods and their prices.",
  },
  {
    question: "Can I edit my invoices?",
    answer:
      "Yes, Zoho Invoice lets you edit the invoices. You can download, print, or send a copy after editing.",
  },
  {
    question: "I need to change the date format for my invoices. Can I do it?",
    answer:
      "No, the free invoice creator doesn’t support it. However, Zoho Invoice app allows changing date format.",
  },
  {
    question: "Do I have the option to add discounts to my invoices?",
    answer:
      "Not in this generator. But Zoho Invoice allows adding discounts after signup.",
  },
  {
    question: "I need to add an additional field to my invoice. How can I do that?",
    answer:
      "Zoho Invoice supports custom fields, allowing you to add additional information.",
  },
  {
    question: "I need to create recurring invoices. What is the solution?",
    answer:
      "Zoho Invoice lets you create recurring invoices for regular transactions.",
  },
  {
    question: "Can I create invoices in different languages?",
    answer:
      "Zoho Invoice supports 17+ languages for sending invoices.",
  },
  {
    question: "Can I add a salesperson when I create an invoice?",
    answer:
      "Yes, you can add a salesperson to your invoices.",
  },
  {
    question: "Is there a way I can do my invoicing on the go?",
    answer:
      "Zoho Invoice mobile apps let you manage invoicing anytime, anywhere.",
  },
]

export default function FaqSection() {
  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Heading */}
        <h2 className="text-center text-3xl md:text-4xl mb-10">
          <span className="text-blue-600">Frequently</span> Asked Questions
        </h2>

        {/* Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg py-3 hover:no-underline font-bold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-foreground text-md py-3">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}