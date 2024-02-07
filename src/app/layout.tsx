import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@fortawesome/fontawesome-svg-core/styles.css'
import aerial from "../../public/aerial_UW_17-35mm11_6873-1.jpg"
import Image from "next/image";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'UW Events',
  description: 'Alternate frontend for today.wisc.edu ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Image src={aerial} alt="" className="fixed inset-0 -z-10 h-full w-full object-cover opacity-50" />
        {children}
      </body>
    </html>
  )
}
