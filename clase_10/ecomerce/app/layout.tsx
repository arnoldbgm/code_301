import Navbar from "@/components/Navbar"

import './globals.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        <main>{children}</main>
        <footer>
          Derechos reservados 2026
        </footer>
      </body>
    </html>
  )
}