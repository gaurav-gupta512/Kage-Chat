'use client'

import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const user: User = session?.user as User

  const toggleMenu = () => setIsOpen(prev => !prev)

  const NavLinks = () => (
    <>
      {/* <Link href="/" className="hover:text-purple-400 transition">Home</Link> */}
    </>
  )

  return (
    <nav className="bg-black text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="text-xl font-bold text-purple-400">
          <Link href="/">KageChat</Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <NavLinks />
          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-sm">
                Welcome,&nbsp;
                <strong>{user?.name || user?.email}</strong>
              </span>
              <Button onClick={() => signOut()} variant="secondary">
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in" className="hover:text-purple-400 transition">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button onClick={toggleMenu} aria-label="Toggle Menu">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 py-4 space-y-3 bg-black border-t border-gray-700">
          <NavLinks />
          {session ? (
            <div className="flex flex-col gap-2 pt-2">
              <span>
                Welcome, <strong>{user?.name || user?.email}</strong>
              </span>
              <Button onClick={() => signOut()} variant="secondary">
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/sign-in" className="hover:text-purple-400 transition block">
              Sign in
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
