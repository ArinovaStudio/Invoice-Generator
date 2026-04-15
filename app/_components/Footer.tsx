export default function Footer() {
  const links = [
    "Contact",
    "Security",
    "Compliance",
    "IPR Complaints",
    "Anti-spam Policy",
    "Terms of Service",
    "Privacy Policy",
    "Trademark Policy",
    "Cookie Policy",
    "GDPR Compliance",
    "Abuse Policy",
  ]

  return (
    <footer className="w-full px-4 py-6">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-4 text-center">
        
        {/* Links */}
        <div className="flex flex-wrap justify-center text-xs text-muted-foreground">
          {links.map((link, index) => (
            <span key={link} className="flex items-center">
              <a
                href="#"
                className="text-foreground transition-colors px-2"
              >
                {link}
              </a>
              {index !== links.length - 1 && (
                <span className="text-foreground">|</span>
              )}
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className="text-xs text-foreground">
          © 2026, Zoho Corporation Pvt. Ltd. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}