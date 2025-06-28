import React from 'react';
import { useVehicles } from '@/context/VehicleContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, X, DollarSign, Users, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminDashboardPage = () => {
    const { vehicles, updateTipStatus } = useVehicles();
    const { users } = useAuth();

    const allTips = vehicles.flatMap(v => v.tips.map(t => ({ ...t, vehicleId: v.id, vehicleLicense: v.licensePlate, reward: v.reward })));
    const pendingTips = allTips.filter(t => t.status === 'pending');

    const totalDonations = 12500; // Mock data
    const totalRewardsPaid = 3500; // Mock data

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold text-sky-800 mb-8">แผงควบคุมแอดมิน</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ยอดบริจาคทั้งหมด</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">฿{totalDonations.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">🚧 ข้อมูลตัวอย่าง</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">รางวัลที่จ่ายแล้ว</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">฿{totalRewardsPaid.toLocaleString()}</div>
                             <p className="text-xs text-muted-foreground">🚧 ข้อมูลตัวอย่าง</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ผู้ใช้งานทั้งหมด</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                            <p className="text-xs text-muted-foreground">จาก Local Storage</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">ประกาศทั้งหมด</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{vehicles.length}</div>
                             <p className="text-xs text-muted-foreground">จาก Local Storage</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>เบาะแสที่รอการตรวจสอบ ({pendingTips.length})</CardTitle>
                        <CardDescription>ตรวจสอบและอนุมัติเบาะแสเพื่อจ่ายรางวัล</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingTips.length > 0 ? (
                            <div className="space-y-4">
                                {pendingTips.map(tip => (
                                    <div key={tip.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg">
                                        <div>
                                            <p><strong>รถ:</strong> {tip.vehicleLicense}</p>
                                            <p className="text-gray-600">{tip.message}</p>
                                            <p className="text-sm text-muted-foreground"><strong>ผู้แจ้ง:</strong> {tip.tipperId}</p>
                                            {tip.reward > 0 && <p className="text-sm text-green-600 font-bold">รางวัล: ฿{tip.reward.toLocaleString()}</p>}
                                        </div>
                                        <div className="flex gap-2 mt-4 md:mt-0">
                                            <Button size="sm" variant="outline" className="bg-green-500 hover:bg-green-600 text-white" onClick={() => updateTipStatus(tip.vehicleId, tip.id, 'approved')}>
                                                <Check className="h-4 w-4 mr-1" /> อนุมัติ
                                            </Button>
                                            <Button size="sm" variant="destructive" onClick={() => updateTipStatus(tip.vehicleId, tip.id, 'rejected')}>
                                                <X className="h-4 w-4 mr-1" /> ปฏิเสธ
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">ไม่มีเบาะแสที่รอการตรวจสอบ</p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default AdminDashboardPage;