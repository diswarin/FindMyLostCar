import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useVehicles } from '@/context/VehicleContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, MapPin, Calendar, User, Phone, Gift, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const VehicleDetailsPage = () => {
  const { id } = useParams();
  const { getVehicleById, addTip } = useVehicles();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const vehicle = getVehicleById(id);

  const [tipMessage, setTipMessage] = useState('');
  const [tipLocation, setTipLocation] = useState('');

  if (!vehicle) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">ไม่พบข้อมูลรถ</h2>
        <p className="text-gray-500">อาจเป็นไปได้ว่าลิงก์ไม่ถูกต้อง หรือประกาศถูกลบไปแล้ว</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/vehicles">กลับไปหน้าค้นหา</Link>
        </Button>
      </div>
    );
  }

  const handleTipSubmit = (e) => {
    e.preventDefault();
    if (!user) {
        toast({ title: "กรุณาเข้าสู่ระบบก่อน", description: "คุณต้องเข้าสู่ระบบเพื่อแจ้งเบาะแส", variant: "destructive" });
        navigate('/login');
        return;
    }
    if (!tipMessage) {
        toast({ title: "กรุณาใส่ข้อมูลเบาะแส", variant: "destructive" });
        return;
    }
    addTip(id, { message: tipMessage, location: tipLocation, tipperId: user.id });
    setTipMessage('');
    setTipLocation('');
  };

  const getStatusIcon = (status) => {
    switch (status) {
        case 'approved':
            return <CheckCircle className="w-4 h-4 text-green-500" />;
        case 'rejected':
            return <XCircle className="w-4 h-4 text-red-500" />;
        default:
            return <Clock className="w-4 h-4 text-gray-500" />;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button asChild variant="ghost" className="text-gray-600 hover:text-gray-900">
          <Link to="/vehicles">
            <ArrowLeft className="mr-2 h-4 w-4" />
            กลับไปหน้ารายการ
          </Link>
        </Button>
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="aspect-video rounded-t-lg overflow-hidden relative">
                <img-replace src={vehicle.imageUrl} alt={`รถ ${vehicle.brand} ${vehicle.model}`} className="w-full h-full object-cover" />
                {vehicle.reward > 0 && (
                    <div className="absolute top-4 right-4 bg-amber-400 text-amber-900 px-3 py-1 rounded-full font-bold flex items-center gap-2">
                        <Gift className="w-5 h-5" />
                        <span>รางวัล: ฿{vehicle.reward.toLocaleString()}</span>
                    </div>
                )}
              </div>
              <div className="pt-6">
                <p className="text-4xl font-bold text-sky-700">{vehicle.licensePlate}</p>
                <CardTitle className="text-3xl mt-2">{vehicle.brand} {vehicle.model}</CardTitle>
                <CardDescription className="text-lg">สี{vehicle.color}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold mb-4 border-b pb-2">รายละเอียด</h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-gray-400" /><span><strong>พบเห็นล่าสุด:</strong> {vehicle.lastSeenLocation}</span></div>
                <div className="flex items-center gap-3"><Calendar className="w-5 h-5 text-gray-400" /><span><strong>วันที่:</strong> {new Date(vehicle.lastSeenDate).toLocaleString('th-TH')}</span></div>
                <div className="flex items-center gap-3"><User className="w-5 h-5 text-gray-400" /><span><strong>ผู้แจ้ง:</strong> {vehicle.ownerName}</span></div>
                {vehicle.contact && <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><span><strong>ติดต่อ:</strong> {vehicle.contact}</span></div>}
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>เบาะแสที่ได้รับ ({vehicle.tips.length})</CardTitle>
            </CardHeader>
            <CardContent>
                {vehicle.tips.length > 0 ? (
                    <ul className="space-y-4">
                        {vehicle.tips.map(tip => (
                            <li key={tip.id} className="p-4 bg-gray-100 rounded-md">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p>{tip.message}</p>
                                        {tip.location && <p className="text-sm text-gray-500 mt-1"><strong>บริเวณที่พบ:</strong> {tip.location}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground capitalize">
                                        {getStatusIcon(tip.status)}
                                        <span>{tip.status}</span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500">ยังไม่มีเบาะแสสำหรับรถคันนี้</p>
                )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
            className="lg:col-span-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>พบเห็นรถคันนี้? แจ้งเบาะแส</CardTitle>
              <CardDescription>เข้าสู่ระบบเพื่อแจ้งเบาะแสและรับคะแนน</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTipSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tip-message">รายละเอียดเบาะแส</Label>
                  <Textarea id="tip-message" placeholder="เช่น พบเห็นรถที่ไหน เมื่อไหร่ ลักษณะเป็นอย่างไร" required value={tipMessage} onChange={e => setTipMessage(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="tip-location">สถานที่ที่พบ</Label>
                  <Input id="tip-location" placeholder="เช่น ลาดพร้าวซอย 5" value={tipLocation} onChange={e => setTipLocation(e.target.value)} />
                </div>
                 <div>
                    <Label htmlFor="tip-image">อัปโหลดรูปภาพ (ถ้ามี)</Label>
                    <Input id="tip-image" type="file" />
                </div>
                <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">ส่งเบาะแส (+10 คะแนน)</Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VehicleDetailsPage;