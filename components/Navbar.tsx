'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          chat with Bro
        </Link>

        {/* Auth Buttons */}
        <div className="flex gap-3">
          <Link href="/sign-up">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
