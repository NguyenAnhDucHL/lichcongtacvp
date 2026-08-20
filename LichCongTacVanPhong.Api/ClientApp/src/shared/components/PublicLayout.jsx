/* Shared public-facing Header + Nav used by WorkSchedule and SearchSchedule */
import { useState } from 'react'
import { Menu } from 'lucide-react'

const PUBLIC_NAV = [
  { label: 'TRANG CHỦ', href: '/campha/' },
  {
    label: 'QUẢN LÝ VĂN BẢN ĐIỀU HÀNH',
    href: 'https://congchuc.quangninh.gov.vn/sso/Login.aspx',
    target: '_blank',
  },
  {
    label: 'CỔNG THÔNG TIN',
    href: 'https://quangninh.gov.vn/Trang/Default.aspx',
    target: '_blank',
  },
  {
    label: 'THƯ ĐIỆN TỬ',
    href: 'https://mail.quangninh.gov.vn/owa/auth/logon.aspx?replaceCurrent=1&url=https%3a%2f%2fmail.quangninh.gov.vn%2fowa%2f',
    target: '_blank',
  },
  { label: 'TÌM KIẾM', href: '/campha/search' },
  { label: 'QUẢN TRỊ', href: '/campha/manager/login' },
]

export function PublicLayout({ children, activeHref, todayHoliday }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const activeClass = 'bg-[#325b1f] md:border-b-2 border-white text-white'
  const baseClass =
    'px-6 py-3 border-t border-[#3f7328] md:border-none text-white text-[13px] md:text-xs font-bold uppercase hover:bg-[#3f7328] transition-colors w-full md:w-auto text-left md:text-center block md:inline-block'

  return (
    <div className="min-h-screen font-sans text-sm text-gray-800 flex flex-col max-w-[1000px] mx-auto shadow-sm">
      {/* Header Image */}
      <div className="bg-white relative flex flex-col justify-center min-h-[90px] overflow-hidden">
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
        <div className="relative z-10 pl-[90px] md:pl-[130px] py-2 pr-2">
          <h1 className="text-[18px] sm:text-[20px] md:text-[24px] font-bold text-[#1d5792] uppercase m-0 leading-tight tracking-wide">
            LỊCH CÔNG TÁC
          </h1>
          <h1 className="text-[13px] sm:text-[15px] md:text-[18px] font-bold text-[#c8102e] uppercase m-0 leading-tight tracking-wide mt-1">
            VĂN PHÒNG PHƯỜNG CẨM PHẢ
          </h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#4d8b31] relative z-20">
        <div className="flex flex-col md:flex-row md:items-center">
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
            {PUBLIC_NAV.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                target={item.target || '_self'}
                rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                className={`${baseClass} ${activeHref === item.href ? activeClass : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Holiday Marquee */}
      {
        todayHoliday && (
          <div className="bg-[#fcf8e3] border-b border-[#faebcc]">
            <div className="text-[#c8102e] py-1.5 overflow-hidden whitespace-nowrap relative">
              <marquee scrollamount="6" className="text-[13px] font-semibold tracking-wide">
                ⚛ {todayHoliday.content} ⚛
              </marquee>
            </div>
          </div>
        )
      }

      {/* Main Content */}
      <div className="flex-grow">
        {children}
      </div>

      {/* Footer */}
      <footer className="bg-[#4d8b31] text-white text-center py-3 text-xs mt-auto">
        <div>
          Bản quyền thuộc về UBND phường Cẩm Phả
        </div>
      </footer>
    </div >
  )
}
