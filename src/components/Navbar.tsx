'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Cart from './Cart'
import Notifications from './Notifications'
import Image from 'next/image'
import { Menu, Search, ShoppingCart, Bell } from 'lucide-react'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  const categories = [
    {
      name: 'Animais',
      subcategories: [
        { name: 'Abelhas', count: 26 },
        { name: 'Asininos', count: 7 },
        { name: 'Aves', count: 691 },
        { name: 'Búfalo', count: 33 },
        { name: 'Cães', count: 631 },
        { name: 'Caprinos', count: 56 },
        { name: 'Cavalos', count: 363 },
        { name: 'Gado de Corte', count: 595 },
        { name: 'Gado de Leite', count: 355 },
      ]
    },
    { name: 'Equipamentos', href: '/equipamentos' },
    { name: 'Quem Somos', href: '/sobre' },
    { name: 'Depoimentos', href: '/depoimentos' },
    { name: 'Lojas Oficiais', href: '/lojas' },
  ]

  return (
    <nav className="bg-white shadow-md">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-green-600">AgroMarket</h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="O que você procura?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href="/notifications" className="text-gray-600 hover:text-gray-900">
                  <Bell className="h-6 w-6" />
                </Link>
                <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                  <ShoppingCart className="h-6 w-6" />
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
                >
                  <Image
                    src={session.user?.image || '/placeholder.png'}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="ml-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  href="/cadastro"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Cadastro
                </Link>
              </>
            )}
            <button
              className="text-gray-600 hover:text-gray-900 lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Categories Bar */}
      <div className="border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                {category.subcategories ? (
                  <button className="text-gray-600 hover:text-gray-900 flex items-center">
                    {category.name}
                    <svg className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                ) : (
                  <Link
                    href={category.href || '#'}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {category.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {category.subcategories && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-1" role="menu">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={`/categorias/${sub.name.toLowerCase()}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {sub.name} ({sub.count})
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {categories.map((category) => (
              <div key={category.name}>
                {category.subcategories ? (
                  <>
                    <button className="block px-3 py-2 text-base font-medium text-gray-700 w-full text-left">
                      {category.name}
                    </button>
                    <div className="pl-4">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          href={`/categorias/${sub.name.toLowerCase()}`}
                          className="block px-3 py-2 text-base font-medium text-gray-500"
                        >
                          {sub.name} ({sub.count})
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={category.href || '#'}
                    className="block px-3 py-2 text-base font-medium text-gray-700"
                  >
                    {category.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 