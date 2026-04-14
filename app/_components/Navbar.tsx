import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-background px-4 py-3 flex items-center justify-between">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-md hover:bg-muted">
          <Menu className="h-5 w-5" />
        </button>

        <div className="flex flex-col leading-tight">
          <span className="text-base font-semibold">
            Free Invoice Generator
          </span>
          <span className="text-xs text-muted-foreground">
            by Zoho Invoice
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-3">
        <Button className="bg-black text-white hover:bg-black/90">
          Checkout Zoho Invoice
        </Button>

        <Button variant="outline">
          Sign up. It's Free!
        </Button>
      </div>
    </nav>
  )
}