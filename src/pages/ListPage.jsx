import React, { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import VehicleCard from '@/components/VehicleCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Calendar, Camera, Phone, User, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const ListPage = () => {
  const [lostCars, setLostCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;

  // Fetch lost cars data from Supabase with pagination
  const fetchLostCars = async (page = 1, search = '', status = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from('lost_cars').select('*', { count: 'exact' });
      
      // Apply search filter
      if (search.trim()) {
        query = query.or(`license_plate.ilike.%${search}%,brand.ilike.%${search}%,model.ilike.%${search}%,color.ilike.%${search}%,owner_name.ilike.%${search}%,location_lost.ilike.%${search}%`);
      }
      
      // Apply status filter
      if (status !== 'all') {
        const statusValue = status === 'active' ? 'lost' : 'found';
        query = query.eq('status', statusValue);
      }
      
      // Apply pagination
      const from = (page - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      
      query = query
        .order('created_at', { ascending: false })
        .range(from, to);

      const { data, error: supabaseError, count } = await query;

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      setLostCars(data || []);
      setTotalCount(count || 0);
      setTotalPages(Math.ceil((count || 0) / itemsPerPage));
      
    } catch (err) {
      console.error('Error fetching lost cars:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLostCars(1, searchTerm, filterStatus);
    setCurrentPage(1);
  }, []);

  // Handle search and filter changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchLostCars(1, searchTerm, filterStatus);
      setCurrentPage(1);
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus]);

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      fetchLostCars(newPage, searchTerm, filterStatus);
      // Scroll to top when page changes
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Format date to Thai format
  const formatThaiDate = (dateString) => {
    if (!dateString) return 'ไม่ระบุ';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    } catch (error) {
      return 'วันที่ไม่ถูกต้อง';
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading && currentPage === 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-lg text-gray-600">กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">เกิดข้อผิดพลาด</h2>
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => fetchLostCars(currentPage, searchTerm, filterStatus)} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            ลองใหม่อีกครั้ง
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          รายการรถที่ถูกแจ้งหาย
        </h1>
        <p className="text-lg text-gray-600">
          พบรถหาย {totalCount.toLocaleString()} คัน | หน้า {currentPage} จาก {totalPages} หน้า
        </p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              type="text"
              placeholder="ค้นหาจากป้ายทะเบียน, ยี่ห้อ, รุ่น, สี, ชื่อเจ้าของ, สถานที่หาย..."
              className="pl-10 h-12 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status Filter */}
          <div className="md:w-48">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-md text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">ทั้งหมด</option>
              <option value="active">ยังไม่พบ</option>
              <option value="found">พบแล้ว</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {lostCars.length > 0 ? (
        <>
          {/* Results Info */}
          <div className="mb-6 text-center text-gray-600">
            <p>
              แสดงรายการที่ {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalCount)} 
              จากทั้งหมด {totalCount.toLocaleString()} รายการ
            </p>
          </div>

          {/* Loading overlay for pagination */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">กำลังโหลด...</span>
              </div>
            )}

            {/* Cars Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {lostCars.map(car => (
                <div key={car.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  {/* Car Image Section */}
                  <div className="relative">
                    {car.image_url ? (
                      <div className="h-48 bg-gray-200 overflow-hidden">
                        <img 
                          src={car.image_url} 
                          alt={`${car.brand} ${car.model} - ${car.license_plate}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.parentElement.innerHTML = `
                              <div class="h-48 bg-gray-100 flex items-center justify-center">
                                <div class="text-center text-gray-500">
                                  <svg class="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                                  </svg>
                                  <p class="text-xs">ไม่สามารถโหลดรูปภาพได้</p>
                                </div>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <Camera className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xs">ไม่มีรูปภาพ</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium shadow-lg ${
                        car.status === 'found' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}>
                        {car.status === 'found' ? '✓ พบแล้ว' : '⚠ ยังไม่พบ'}
                      </span>
                    </div>

                    {/* ID Badge */}
                    <div className="absolute top-2 left-2">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-mono">
                        {/* #{car.id} */}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    {/* Car Details */}
                    <div className="mb-3">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        {car.license_plate || 'ไม่ระบุป้ายทะเบียน'}
                      </h3>
                      <p className="text-sm text-gray-700 mb-1">
                        {car.brand || 'ไม่ระบุยี่ห้อ'} {car.model || ''}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        <span className="inline-block w-3 h-3 rounded-full mr-1" 
                              style={{backgroundColor: car.color?.toLowerCase() === 'แดง' ? '#ef4444' : 
                                                     car.color?.toLowerCase() === 'น้ำเงิน' ? '#3b82f6' :
                                                     car.color?.toLowerCase() === 'เขียว' ? '#10b981' :
                                                     car.color?.toLowerCase() === 'เหลือง' ? '#f59e0b' :
                                                     car.color?.toLowerCase() === 'ขาว' ? '#f3f4f6' :
                                                     car.color?.toLowerCase() === 'ดำ' ? '#1f2937' :
                                                     '#6b7280'}}></span>
                        สี: {car.color || 'ไม่ระบุ'}
                      </p>
                    </div>

                    {/* Date Lost */}
                    <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                      <div className="flex items-center text-red-700">
                        <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
                        <div>
                          <p className="font-semibold text-sm">วันที่หาย</p>
                          <p className="text-lg">{formatThaiDate(car.lost_date)}</p>
                        </div>
                      </div>
                    </div>

                    {/* Owner Info */}
                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <div className="flex items-center mb-2">
                        <User className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="font-semibold text-gray-700">ข้อมูลเจ้าของ</span>
                      </div>
                      <p className="text-gray-600 ml-6">
                        {car.owner_name || 'ไม่ระบุชื่อ'}
                      </p>
                      {car.owner_phone && (
                        <div className="flex items-center mt-1 ml-6">
                          <Phone className="h-4 w-4 mr-2 text-green-500" />
                          <a href={`tel:${car.owner_phone}`} 
                             className="text-blue-600 hover:text-blue-800 hover:underline">
                            {car.owner_phone}
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Location */}
                    {car.location_lost && (
                      <div className="mb-4">
                        <div className="flex items-start">
                          <MapPin className="h-4 w-4 mr-2 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <span className="font-semibold text-gray-700">สถานที่หาย</span>
                          </div>
                        </div>
                        <p className="text-gray-600 ml-6">
                          {car.location_lost}
                        </p>
                      </div>
                    )}

                    {/* Description */}
                    {car.description && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          <strong>รายละเอียด:</strong> {car.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            ไม่พบข้อมูลรถที่ตรงกับคำค้นหา
          </h3>
          <p className="text-gray-500 mb-6">
            ลองเปลี่ยนคำค้นหาหรือตัวกรองเพื่อดูผลลัพธ์อื่น
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              ล้างการค้นหา
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ListPage;