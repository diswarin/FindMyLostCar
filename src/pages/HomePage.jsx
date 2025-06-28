
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVehicles } from '@/context/VehicleContext.jsx';
import VehicleCard from '@/components/VehicleCard';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search, Gift } from 'lucide-react';

const HomePage = () => {
  const { vehicles } = useVehicles();
  const recentVehicles = vehicles.slice(-3).reverse();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center py-16 md:py-24 rounded-xl bg-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-100 to-indigo-100 opacity-50 -z-10"></div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-sky-800 tracking-tight">
          ช่วยกันตามหา <span className="text-indigo-600">รถที่หายไป</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
          แพลตฟอร์มกลางสำหรับแจ้งและติดตามรถหาย ร่วมเป็นส่วนหนึ่งของสังคมที่ช่วยเหลือกัน
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700 text-lg h-12 px-8">
            <Link to="/report">
              <PlusCircle className="mr-2 h-5 w-5" />
              แจ้งรถหาย
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="text-lg h-12 px-8 border-sky-600 text-sky-600 hover:bg-sky-50 hover:text-sky-700">
            <Link to="/vehicles">
              <Search className="mr-2 h-5 w-5" />
              ค้นหารถ / แจ้งเบาะแส
            </Link>
          </Button>
        </div>
      </motion.section>

       {/* Bounty Section */}
      <section className="mt-16 text-center bg-gradient-to-r from-amber-50 to-orange-50 p-8 rounded-lg">
        <Gift className="mx-auto h-12 w-12 text-amber-600" />
        <h2 className="text-3xl font-bold text-gray-800 mt-4">เพิ่มรางวัลนำจับ</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
          เพิ่มโอกาสในการค้นพบรถของคุณโดยการตั้งรางวัลสำหรับผู้ที่ให้เบาะแสจนเจอรถ
        </p>
        <Button asChild className="mt-6 bg-amber-500 hover:bg-amber-600 text-white">
          <Link to="/pricing">ดูรายละเอียดและตั้งรางวัล</Link>
        </Button>
      </section>

      {/* Recent Vehicles Section */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          ประกาศล่าสุด
        </h2>
        {recentVehicles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">ยังไม่มีประกาศรถหาย</p>
        )}
        <div className="text-center mt-12">
            <Button asChild variant="ghost" className="text-sky-600 hover:text-sky-700 hover:bg-sky-100">
                <Link to="/vehicles">ดูประกาศทั้งหมด →</Link>
            </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
