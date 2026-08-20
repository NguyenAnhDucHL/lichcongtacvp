/* global DOMParser */
import { useState, useEffect } from 'react'
import { useAppSignalR } from '../contexts/SignalRContext'
import { scheduleService } from '../services/schedule.service'
import { PublicLayout } from '../shared/components/PublicLayout'
import { Calendar } from 'lucide-react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { vi } from 'date-fns/locale'

registerLocale('vi', vi)


const DAYS = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

const extractText = (html) => {
  if (!html) return ''
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (doc.body.textContent || '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const formatDateDisplay = (dateString) => {
  if (!dateString) return { dayName: '', date: '' }
  try {
    const parts = dateString.split('T')[0].split('-')
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
    return {
      dayName: DAYS[d.getDay()],
      date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
    }
  } catch {
    return { dayName: '', date: dateString }
  }
}

export default function SearchSchedule() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  const [results, setResults] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [todayHoliday, setTodayHoliday] = useState(null)
  const { lastHolidayUpdate } = useAppSignalR()

  useEffect(() => {
    scheduleService
      .getTodayHoliday()
      .then((data) => setTodayHoliday(data?.content ? data : data?.data || null))
      .catch(() => { })
  }, [lastHolidayUpdate])

  const fetchResults = async (page = 1, size = pageSize) => {
    setLoading(true)
    try {
      const params = { page, pageSize: size }
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate
      if (keyword.trim()) params.keyword = keyword.trim()

      const raw = await scheduleService.searchPublicSchedules(params)
      const items = raw?.items || []
      const count = raw?.totalCount || 0

      setResults(items)
      setTotalCount(count)
      setSearched(true)
    } catch {
      setResults([])
      setTotalCount(0)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (currentPage === 1) {
      fetchResults(1, pageSize)
    } else {
      setCurrentPage(1)
    }
  }

  useEffect(() => {
    if (searched) {
      fetchResults(currentPage, pageSize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const paginated = results
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
    .reduce((acc, p, idx, arr) => {
      if (idx > 0 && p - arr[idx - 1] > 1) acc.push('...')
      acc.push(p)
      return acc
    }, [])

  return (
    <PublicLayout activeHref="/campha/search" todayHoliday={todayHoliday}>
      <main className="max-w-6xl mx-auto px-4 py-6 text-[16px]">
        {/* Search box */}
        <div className="bg-transparent p-0 mb-6 mt-2">
          <h2 className="text-gray-800 font-normal text-xl mb-6 pb-2 border-b border-[#d6e9f8]">
            Tìm kiếm
          </h2>
          <form onSubmit={handleSearch} className="flex flex-col gap-4 w-full max-w-[550px]">
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <label className="text-gray-700 font-medium md:w-[160px] shrink-0">
                Thời gian bắt đầu
              </label>
              <div className="relative w-full md:w-[200px] group flex items-center">
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date) => {
                    if (date) {
                      const yyyy = date.getFullYear()
                      const mm = String(date.getMonth() + 1).padStart(2, '0')
                      const dd = String(date.getDate()).padStart(2, '0')
                      setStartDate(`${yyyy}-${mm}-${dd}`)
                    } else {
                      setStartDate('')
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale="vi"
                  placeholderText="Ngày/Tháng/Năm"
                  wrapperClassName="w-full"
                  className="border border-gray-300 px-3 py-1.5 rounded min-w-0 w-full outline-none focus:border-[#1d5792] focus:ring-1 focus:ring-[#1d5792] bg-white pr-10"
                  withPortal={isMobile}
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: 'preventOverflow',
                      options: { boundary: 'viewport', altAxis: true, padding: 8 },
                    },
                    {
                      name: 'flip',
                      options: { fallbackPlacements: ['top-start', 'bottom-start'] },
                    },
                  ]}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
              <label className="text-gray-700 font-medium md:w-[160px] shrink-0">
                Thời gian kết thúc
              </label>
              <div className="relative w-full md:w-[200px] group flex items-center">
                <DatePicker
                  selected={endDate ? new Date(endDate) : null}
                  onChange={(date) => {
                    if (date) {
                      const yyyy = date.getFullYear()
                      const mm = String(date.getMonth() + 1).padStart(2, '0')
                      const dd = String(date.getDate()).padStart(2, '0')
                      setEndDate(`${yyyy}-${mm}-${dd}`)
                    } else {
                      setEndDate('')
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  locale="vi"
                  placeholderText="Ngày/Tháng/Năm"
                  wrapperClassName="w-full"
                  className="border border-gray-300 px-3 py-1.5 rounded min-w-0 w-full outline-none focus:border-[#1d5792] focus:ring-1 focus:ring-[#1d5792] bg-white pr-10"
                  withPortal={isMobile}
                  popperPlacement="bottom-start"
                  popperModifiers={[
                    {
                      name: 'preventOverflow',
                      options: { boundary: 'viewport', altAxis: true, padding: 8 },
                    },
                    {
                      name: 'flip',
                      options: { fallbackPlacements: ['top-start', 'bottom-start'] },
                    },
                  ]}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-1 md:gap-4">
              <label className="text-gray-700 font-medium md:w-[160px] shrink-0 pt-1">
                Nội dung
              </label>
              <textarea
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                rows={3}
                className="border border-gray-300 px-3 py-2 rounded text-gray-700 w-full md:w-[300px] outline-none focus:border-[#1d5792] resize-y"
              />
            </div>
            <div className="flex md:gap-4">
              <div className="hidden md:block md:w-[160px] shrink-0" />
              <button
                type="submit"
                disabled={loading}
                className="bg-[#5cb85c] hover:bg-[#4cae4c] text-white px-8 py-2 rounded font-medium transition-colors disabled:opacity-50 shadow-sm"
              >
                {loading ? 'Đang tìm...' : 'Tìm kiếm'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <>
            <div className="flex items-center justify-between mb-2 gap-4">
              <span className="text-gray-500 text-[14px]">
                Danh sách lịch làm việc {totalCount > 0 ? `(${totalCount} kết quả)` : ''}
              </span>
              <div className="flex items-center gap-3">
                <select
                  value={pageSize}
                  onChange={(e) => {
                    const newSize = Number(e.target.value)
                    setPageSize(newSize)
                    setCurrentPage(1)
                    fetchResults(1, newSize)
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-[#005f6b] bg-white"
                >
                  <option value={10}>10 dòng</option>
                  <option value={20}>20 dòng</option>
                  <option value={50}>50 dòng</option>
                </select>
              </div>
            </div>
            <div className="w-full">
              <table className="w-full border-collapse border-t border-gray-300 text-[15px] block md:table">
                <thead className="hidden md:table-header-group">
                  <tr className="bg-[#fce8d5]">
                    <th className="border border-gray-300 py-2 px-3 font-bold w-12 text-center">
                      STT
                    </th>
                    <th className="border border-gray-300 py-2 px-3 font-bold w-28 text-center">
                      Ngày
                    </th>
                    <th className="border border-gray-300 py-2 px-3 font-bold text-center">
                      Nội dung
                    </th>
                    <th className="border border-gray-300 py-2 px-3 font-bold w-28 text-center">
                      Phòng, ban
                    </th>
                  </tr>
                </thead>
                <tbody className="block md:table-row-group">
                  {paginated.length > 0 ? (
                    paginated.map((item, index) => {
                      const di = formatDateDisplay(item.date)
                      return (
                        <tr key={item.id} className="block md:table-row border border-gray-300 mb-4 md:mb-0 hover:bg-gray-50 bg-white">
                          <td className="block md:table-cell border-b md:border-gray-300 py-2.5 px-3 text-left md:text-center">
                            <span className="inline-block w-24 font-bold md:hidden text-gray-600">STT:</span>
                            <span className="font-bold">{(currentPage - 1) * pageSize + index + 1}</span>
                          </td>
                          <td className="block md:table-cell border-b md:border-gray-300 py-2.5 px-3 text-left md:text-center leading-tight">
                            <span className="inline-block w-24 font-bold md:hidden text-gray-600">Ngày:</span>
                            <span className="inline-block md:block">{di.dayName}</span>
                            <span className="inline-block md:block text-[#1d5792] font-bold ml-1 md:ml-0">{di.date}</span>
                          </td>
                          <td className="block md:table-cell border-b md:border-gray-300 py-2.5 px-3">
                            <span className="inline-block w-24 font-bold md:hidden text-gray-600 align-top">Nội dung:</span>
                            <div className="inline-block w-full md:w-auto">
                            {item.startTime?.trim() && (
                              <span className="text-[#c8102e] font-bold mr-2">
                                {item.startTime.trim()}:
                              </span>
                            )}
                            {item.invitationNumber && (
                              <span className="text-[#005f6b] font-bold mr-1">
                                {item.invitationNumber}
                              </span>
                            )}
                            {item.location && (
                              <span className="text-[#005f6b] font-bold mr-1">
                                (Tại {extractText(item.location)})
                              </span>
                            )}
                            {item.content && (
                              <span className="text-gray-900">{extractText(item.content)}</span>
                            )}
                            </div>
                          </td>
                          <td className="block md:table-cell py-2.5 px-3 text-left md:text-center">
                            <span className="inline-block w-24 font-bold md:hidden text-gray-600">Phòng ban:</span>
                            {extractText(item.preparingUnit) || 'CƠ QUAN'}
                          </td>
                        </tr>
                      )
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="border border-gray-300 py-6 text-center text-gray-500 italic"
                      >
                        Không tìm thấy lịch công tác phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            {totalCount > pageSize && (
              <div className="flex items-center justify-center gap-0.5 mt-4 text-xs flex-wrap">
                {currentPage > 1 && (
                  <button
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="px-1.5 text-[#1d5792] hover:underline"
                  >
                    Previous
                  </button>
                )}
                {pageNumbers.map((p, idx) =>
                  p === '...' ? (
                    <span key={`e-${idx}`} className="px-1 text-gray-500">
                      |
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-1.5 ${currentPage === p ? 'font-bold text-gray-800' : 'text-[#1d5792] hover:underline'}`}
                    >
                      {p}
                    </button>
                  )
                )}
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="px-1.5 text-[#1d5792] hover:underline"
                  >
                    Next
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </PublicLayout>
  )
}
