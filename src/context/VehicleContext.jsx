import React, { createContext, useState, useContext, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';

const VehicleContext = createContext();

export const useVehicles = () => useContext(VehicleContext);

const initialVehicles = [
    {
        id: '1',
        licensePlate: 'กข 1234',
        brand: 'Toyota',
        model: 'Vios',
        color: 'ดำ',
        lastSeenLocation: 'สยามพารากอน, กรุงเทพฯ',
        lastSeenDate: '2025-06-19T10:00:00Z',
        ownerName: 'สมชาย ใจดี',
        ownerId: 'owner-1',
        contact: '081-234-5678',
        imageUrl: 'A black Toyota Vios sedan parked on a city street',
        status: 'missing',
        reward: 500,
        tips: []
    },
    {
        id: '2',
        licensePlate: 'ษล 5678',
        brand: 'Honda',
        model: 'Civic',
        color: 'ขาว',
        lastSeenLocation: 'เซ็นทรัลเวิลด์, กรุงเทพฯ',
        lastSeenDate: '2025-06-18T18:30:00Z',
        ownerName: 'สมหญิง สวยงาม',
        ownerId: 'owner-2',
        contact: '082-345-6789',
        imageUrl: 'A white Honda Civic hatchback in a parking lot',
        status: 'missing',
        reward: 0,
        tips: [
            { id: 'tip1', message: 'เห็นรถคล้ายๆ กันที่ลาดพร้าว', location: 'ลาดพร้าว', imageUrl: '', tipperId: 'mock-user-id', status: 'pending' }
        ]
    }
];

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const { toast } = useToast();
  const { user, addPoints } = useAuth();

  useEffect(() => {
    try {
      const storedVehicles = localStorage.getItem('vehicles');
      if (storedVehicles) {
        setVehicles(JSON.parse(storedVehicles));
      } else {
        setVehicles(initialVehicles);
        localStorage.setItem('vehicles', JSON.stringify(initialVehicles));
      }
    } catch (error) {
      console.error("Failed to load vehicles from localStorage", error);
      setVehicles(initialVehicles);
    }
  }, []);

  const updateLocalStorage = (updatedVehicles) => {
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles));
  };

  const addVehicle = (vehicle) => {
    const newVehicle = { ...vehicle, id: Date.now().toString(), tips: [], status: 'missing', ownerId: user.id, ownerName: user.user_metadata.full_name, reward: vehicle.reward || 0 };
    const updatedVehicles = [...vehicles, newVehicle];
    setVehicles(updatedVehicles);
    updateLocalStorage(updatedVehicles);
    toast({
      title: "สำเร็จ!",
      description: "แจ้งข้อมูลรถหายของคุณเรียบร้อยแล้ว",
      className: "bg-green-500 text-white",
    });
  };

  const getVehicleById = (id) => {
    return vehicles.find(v => v.id === id);
  };

  const addTip = (vehicleId, tip) => {
    if(!user) {
        toast({ title: "กรุณาเข้าสู่ระบบก่อนแจ้งเบาะแส", variant: "destructive" });
        return;
    }

    const newTip = { ...tip, id: Date.now().toString(), tipperId: user.id, status: 'pending' };
    const updatedVehicles = vehicles.map(v => {
      if (v.id === vehicleId) {
        return { ...v, tips: [...v.tips, newTip] };
      }
      return v;
    });
    setVehicles(updatedVehicles);
    updateLocalStorage(updatedVehicles);
    addPoints(user.id, 10);
    toast({
        title: "ขอบคุณสำหรับเบาะแส! (+10 คะแนน)",
        description: "ข้อมูลของคุณถูกส่งเพื่อตรวจสอบแล้ว",
        className: "bg-sky-500 text-white",
    });
  };

  const updateTipStatus = (vehicleId, tipId, status) => {
    const updatedVehicles = vehicles.map(v => {
        if (v.id === vehicleId) {
            const updatedTips = v.tips.map(tip => {
                if (tip.id === tipId) {
                    return { ...tip, status };
                }
                return tip;
            });
            return { ...v, tips: updatedTips };
        }
        return v;
    });
    setVehicles(updatedVehicles);
    updateLocalStorage(updatedVehicles);
    toast({
        title: "อัปเดตสถานะเบาะแสสำเร็จ",
    });
  };
  
  const value = {
    vehicles,
    addVehicle,
    getVehicleById,
    addTip,
    updateTipStatus,
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};