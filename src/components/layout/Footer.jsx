
import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Car className="w-6 h-6 text-sky-700" />
            <span className="font-bold text-lg text-gray-700">FindMyLostCar</span>
          </div>
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} FindMyLostCar. All Rights Reserved.
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link to="/about" className="text-sm text-gray-500 hover:text-sky-600">เกี่ยวกับเรา</Link>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-sky-600">นโยบายความเป็นส่วนตัว</Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-sky-600">ข้อกำหนดในการใช้งาน</Link>
            <Link to="/delete-data" className="text-sm text-gray-500 hover:text-sky-600">นโยบายการลบข้อมูลส่วนตัว</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
