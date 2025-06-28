
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)" }}
    >
      <Card className="overflow-hidden h-full flex flex-col">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden">
            <img-replace src={vehicle.imageUrl} alt={`รถ ${vehicle.brand} ${vehicle.model} สี${vehicle.color}`} className="w-full h-full object-cover transition-transform duration-300 hover:scale-110" />
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex-grow">
          <CardTitle className="mb-2 text-xl">{vehicle.brand} {vehicle.model}</CardTitle>
          <p className="font-bold text-2xl text-sky-700 mb-3">{vehicle.licensePlate}</p>
          <div className="space-y-2 text-gray-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>พบเห็นล่าสุด: {vehicle.lastSeenLocation}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>วันที่: {new Date(vehicle.lastSeenDate).toLocaleDateString('th-TH')}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full bg-sky-600 hover:bg-sky-700">
            <Link to={`/vehicle/${vehicle.id}`}>
              ดูรายละเอียด / แจ้งเบาะแส
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default VehicleCard;
