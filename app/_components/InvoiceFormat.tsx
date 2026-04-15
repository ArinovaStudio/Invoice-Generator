import Image from "next/image";
import { Radio } from "lucide-react";
export default function InvoiceFormat() {
  return (
    <section className="w-full py-20 bg-[#fafafa] px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl mb-3">Invoice format</h2>
        <p className="text-muted-foreground mb-12">
          A usual business invoice contains the following components:
        </p>

        {/* Main Layout */}
        <div className="relative flex items-center justify-center">
          {/* LEFT SIDE */}
          <div className="hidden md:flex flex-col gap-16 absolute left-0 text-right w-1/3">
            <div className="relative flex flex-col items-end">
              <svg
                width="260"
                className="absolute -right-6 -top-5 z-11"
                height="56"
                viewBox="0 0 260 56"
                fill="none"
              >
                <path
                  d="M247.795 48.8877H192.56c-5.523 0-10-4.4771-10-10V10.5c0-5.52284-4.477-10-10-10H0"
                  stroke="#C7C7C7"
                />

                <path
                  d="M247.795 48.8877H192.56c-5.523 0-10-4.4771-10-10V10.5c0-5.52284-4.477-10-10-10H0"
                  strokeWidth="2"
                  stroke="transparent"
                  style={{
                    strokeDasharray: 287.603,
                    strokeDashoffset: 287.603,
                  }}
                />

                <ellipse
                  cx="253.45"
                  cy="49.0272"
                  rx="3.27498"
                  ry="3.2363"
                  fill="#000"
                />

                <path
                  d="M259.625 49.0274C259.625 52.3907 256.864 55.1247 253.45 55.1247S247.275 52.3907 247.275 49.0274c0-3.3632 2.761-6.0973 6.175-6.0973S259.625 45.6642 259.625 49.0274z"
                  stroke="#000"
                  strokeWidth="0.75"
                />
              </svg>
              <p className="max-w-50 mr-15 text-center">
                The business's logo, name, and address; and the customer's
                contact information.
              </p>
            </div>

            <div className="relative">
              <svg
                width="260"
                className="absolute z-11 -right-6 -top-5"
                height="14"
                viewBox="0 0 260 14"
                fill="none"
              >
                <path d="M246.945 7H0" stroke="#C7C7C7" />

                <path
                  d="M246.945 7H0"
                  strokeWidth="2"
                  stroke="transparent"
                  style={{
                    strokeDasharray: 246.945,
                    strokeDashoffset: 246.945,
                  }}
                />

                <ellipse
                  cx="253.472"
                  cy="6.55512"
                  rx="3.26375"
                  ry="3.27766"
                  fill="#000"
                />

                <path
                  d="M259.625 6.55531C259.625 9.96993 256.869 12.7353 253.473 12.7353 250.076 12.7353 247.32 9.96993 247.32 6.55531 247.32 3.1407 250.076 0.375332 253.473 0.375332 256.869 0.375332 259.625 3.1407 259.625 6.55531z"
                  stroke="#000"
                  strokeWidth="0.75"
                />
              </svg>
              <p>The item names, descriptions, quantities, and rates.</p>
            </div>

            <div className="relative">
              <svg
                width="260"
                className="absolute z-11 -right-6 -top-5"
                height="14"
                viewBox="0 0 260 14"
                fill="none"
              >
                <path d="M246.945 7H0" stroke="#C7C7C7" />

                <path
                  d="M246.945 7H0"
                  strokeWidth="2"
                  stroke="transparent"
                  style={{
                    strokeDasharray: 246.945,
                    strokeDashoffset: 246.945,
                  }}
                />

                <ellipse
                  cx="253.472"
                  cy="6.55512"
                  rx="3.26375"
                  ry="3.27766"
                  fill="#000"
                />

                <path
                  d="M259.625 6.55531C259.625 9.96993 256.869 12.7353 253.473 12.7353 250.076 12.7353 247.32 9.96993 247.32 6.55531 247.32 3.1407 250.076 0.375332 253.473 0.375332 256.869 0.375332 259.625 3.1407 259.625 6.55531z"
                  stroke="#000"
                  strokeWidth="0.75"
                />
              </svg>
              <p>The notes and terms and conditions section.</p>
            </div>
          </div>

          {/* CENTER CARD */}
          <div className="w-[320px] md:w-[400px] h-[500px] relative rounded-2xl z-10">
            <Image src={"/invoice-template.png"} alt={"Loading..."} fill />
          </div>

          {/* RIGHT SIDE */}
          <div className="hidden md:flex flex-col gap-16 absolute right-0 text-left w-1/3 pl-6">
            <div className="relative flex flex-col items-start">
              <svg
                className="absolute z-11 -left-10 -top-6"
                width="261"
                height="57"
                viewBox="0 0 261 57"
                fill="none"
              >
                <path
                  d="M13 50H52c5.5228 0 10-4.4772 10-10V11C62 5.47715 66.4772 1 72 1H261"
                  stroke="#C7C7C7"
                />

                <path
                  d="M13 50H52c5.5228 0 10-4.4772 10-10V11C62 5.47715 66.4772 1 72 1H261"
                  strokeWidth="2"
                  stroke="transparent"
                  style={{
                    strokeDasharray: 288.42,
                    strokeDashoffset: 288.42,
                  }}
                />

                <ellipse
                  cx="6.55528"
                  cy="49.5551"
                  rx="3.2777"
                  ry="3.27766"
                  fill="#000"
                />

                <path
                  d="M12.7355 49.5553c0 3.4131-2.76695 6.18-6.18011 6.18-3.41315 0-6.180058-2.7669-6.180058-6.18s2.766908-6.18 6.180058-6.18c3.41316 0 6.18011 2.7669 6.18011 6.18z"
                  stroke="#000"
                  strokeWidth="0.75"
                />
              </svg>
              <p className="max-w-50 ml-10 text-center">
                The invoice number, invoice date, and the due date
              </p>
            </div>

            <div className="relative  flex flex-col items-start">
              <svg
                className="absolute z-11 -left-10 -top-6"
                width="261"
                height="57"
                viewBox="0 0 261 57"
                fill="none"
              >
                <path
                  d="M13 50H52c5.5228 0 10-4.4772 10-10V11C62 5.47715 66.4772 1 72 1H261"
                  stroke="#C7C7C7"
                />

                <path
                  d="M13 50H52c5.5228 0 10-4.4772 10-10V11C62 5.47715 66.4772 1 72 1H261"
                  strokeWidth="2"
                  stroke="transparent"
                  style={{
                    strokeDasharray: 288.42,
                    strokeDashoffset: 288.42,
                  }}
                />

                <ellipse
                  cx="6.55528"
                  cy="49.5551"
                  rx="3.2777"
                  ry="3.27766"
                  fill="#000"
                />

                <path
                  d="M12.7355 49.5553c0 3.4131-2.76695 6.18-6.18011 6.18-3.41315 0-6.180058-2.7669-6.180058-6.18s2.766908-6.18 6.180058-6.18c3.41316 0 6.18011 2.7669 6.18011 6.18z"
                  stroke="#000"
                  strokeWidth="0.75"
                />
              </svg>
              <p className="max-w-50 ml-10 text-center">
                The subtotal, taxes, and total amount that needs to be paid.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
