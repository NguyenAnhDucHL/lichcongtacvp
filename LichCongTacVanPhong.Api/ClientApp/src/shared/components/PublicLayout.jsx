import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export default function PublicLayout() {
  const location = useLocation()
  const currentPath = location.pathname
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (href) => {
    return currentPath === href || currentPath === href + '/'
  }

  const navItems = [
    { label: 'TRANG CHỦ', href: '/campha/' },
    { label: 'QUẢN TRỊ', href: '/campha/manager/login' },
  ]

  const activeClass = 'bg-[#325b1f] md:border-b-2 border-white text-white'
  const baseClass =
    'px-6 py-3 border-t border-[#3f7328] md:border-none text-white text-[13px] md:text-xs font-bold uppercase hover:bg-[#3f7328] transition-colors w-full md:w-auto text-left md:text-center block md:inline-block'

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="bg-white">
        <div className="max-w-[1000px] mx-auto relative flex flex-col justify-center min-h-[90px] overflow-hidden">
          <div className="absolute inset-0 z-0 flex justify-start">
            <img
              src="/assets/header-banner.jpg"
              alt="Lịch Công Tác"
              className="h-full w-auto max-h-[90px] object-contain"
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          </div>
          <div className="relative z-10 pl-4 md:pl-8 py-2 pr-2">
            <h1 className="text-[18px] sm:text-[20px] md:text-[26px] font-bold text-[#1d5792] uppercase m-0 leading-tight tracking-wide">
              LỊCH CÔNG TÁC
            </h1>
            <h1 className="text-[13px] sm:text-[15px] md:text-[18px] font-bold text-[#c8102e] uppercase m-0 leading-tight mt-1">
              VĂN PHÒNG PHƯỜNG CẨM PHẢ
            </h1>
          </div>
        </div>
      </div>

      <nav className="bg-[#4d8b31] relative z-50">
        <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row md:items-center">
          <div
            className="md:hidden flex justify-between items-center px-4 py-3 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="text-white font-serif font-bold uppercase text-base tracking-wide">
              MENU
            </span>
            <Menu className="text-white w-7 h-7" />
          </div>

          <div
            className={`${isMobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row w-full`}
          >
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${baseClass} h-full flex items-center ${isActive(item.href) ? activeClass : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full bg-transparent p-0 mt-4">
        <div className="max-w-[1000px] mx-auto min-h-[500px] px-2 sm:px-4 md:px-0">
          <Outlet />
        </div>
      </main>

      <footer className="mt-8 bg-white border-t border-gray-200">
        <div className="max-w-[1000px] mx-auto py-6 px-4 md:px-0 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} - UBND Phường Cẩm Phả
        </div>
      </footer>
    </div>
  )
}
