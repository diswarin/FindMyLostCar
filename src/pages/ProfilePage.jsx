import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Gift, Heart, Car, Shield, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [profile, setProfile] = useState(null);
    const [lostCars, setLostCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [conversionRate, setConversionRate] = useState(1000); // Default rate: ฿1000 = 1 point

    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchUserLostCars();
            fetchConversionRate();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            setProfile(data || {});
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถโหลดข้อมูลโปรไฟล์ได้',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchUserLostCars = async () => {
        try {
            const { data, error } = await supabase
                .from('lost_cars')
                .select(`
                    *,
                    car_images(image_url)
                `)
                .eq('owner_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedData = data.map(car => ({
                ...car,
                image_urls: car.car_images.map(img => img.image_url) || []
            }));
            setLostCars(formattedData);
            console.log('✅ Fetched lost cars:', formattedData);
        } catch (error) {
            console.error('Error fetching lost cars:', error);
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถโหลดข้อมูลรถหายได้',
                variant: 'destructive',
            });
        }
    };

    const fetchConversionRate = async () => {
        try {
            const { data, error } = await supabase
                .from('point_conversion_rates')
                .select('conversion_rate')
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') {
                throw error;
            }

            const rate = data?.conversion_rate || 1000;
            setConversionRate(rate);
            console.log('✅ Fetched conversion rate:', rate);
        } catch (error) {
            console.error('Error fetching conversion rate:', error);
            toast({
                title: 'เกิดข้อผิดพลาด',
                description: 'ไม่สามารถโหลดอัตราแลกเปลี่ยนแต้มได้',
                variant: 'destructive',
            });
        }
    };

    // Convert baht to points
    const convertToPoints = (baht) => {
        return baht ? Math.floor(baht / conversionRate) : 0;
    };

    // Mock data for testing
    const mockLostCars = [
        {
            id: '1',
            license_plate: 'กข 1234',
            brand: 'Honda',
            model: 'Civic',
            color: 'ขาว',
            last_seen_location: 'ห้างสยามพารากอน',
            subdistrict: 'ปทุมวัน',
            district: 'ปทุมวัน',
            province: 'กรุงเทพมหานคร',
            lost_date: '2024-01-15',
            contact: '081-234-5678',
            reward: 5000,
            police_report_url: 'https://example.com/police_report_1.pdf',
            is_anonymous: false,
            status: 'active',
            image_urls: [
                'https://via.placeholder.com/300x200',
                'https://via.placeholder.com/300x200/FF0000/FFFFFF'
            ],
            created_at: '2024-01-15T10:00:00Z'
        },
        {
            id: '2',
            license_plate: '1กก 5678',
            brand: 'Yamaha',
            model: 'NMAX',
            color: 'ดำ',
            last_seen_location: 'ตลาดจตุจักร',
            subdistrict: 'จตุจักร',
            district: 'จตุจักร',
            province: 'กรุงเทพมหานคร',
            lost_date: '2024-01-10',
            contact: null,
            reward: 2000,
            police_report_url: null,
            is_anonymous: true,
            status: 'found',
            image_urls: ['https://via.placeholder.com/300x200'],
            created_at: '2024-01-10T14:30:00Z'
        }
    ];

    const mockProfile = {
        total_rewards_given: 7000, // 7,000 ฿ → 7 points at 1:1000
        total_donations: 500, // 500 ฿ → 0.5 points at 1:1000
    };

    if (!user || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-32 bg-gray-200 rounded mb-4"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    const getInitials = (name, email) => {
        if (typeof name === 'string' && name.trim()) {
            const names = name.trim().split(' ');
            if (names.length > 1) {
                return `${names[0][0]}${names[1][0]}`.toUpperCase();
            }
            return name.substring(0, 2).toUpperCase();
        }
        if (typeof email === 'string' && email.length > 1) {
            return email.substring(0, 2).toUpperCase();
        }
        return 'U';
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active': return 'กำลังหา';
            case 'found': return 'พบแล้ว';
            case 'cancelled': return 'ยกเลิก';
            default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'found': return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const generateTitle = (car) => {
        return `${car.brand} ${car.model} สี${car.color} หายที่${car.last_seen_location || 'ไม่ระบุสถานที่'}`;
    };

    const displayName = profile?.full_name || user.user_metadata?.full_name || 'ไม่ระบุชื่อ';
    const avatarUrl = profile?.avatar_url || user.user_metadata?.avatar_url;
    const displayLostCars = lostCars.length > 0 ? lostCars : mockLostCars;
    const displayProfile = profile || mockProfile;

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-3xl">โปรไฟล์ของฉัน</CardTitle>
                                <CardDescription>จัดการข้อมูลส่วนตัวและกิจกรรมของคุณ</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate('/profile/edit')}
                                className="flex items-center gap-2"
                            >
                                <Edit className="w-4 h-4" />
                                แก้ไขโปรไฟล์
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage src={avatarUrl} alt={displayName} />
                                    <AvatarFallback>
                                        {getInitials(displayName, user.email)}
                                    </AvatarFallback>
                                </Avatar>
                                <button
                                    onClick={() => navigate('/profile/edit')}
                                    className="absolute -top-1 -right-1 bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
                                    title="แก้ไขโปรไฟล์"
                                >
                                    <Edit className="w-3 h-3" />
                                </button>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-2xl font-bold">{displayName}</h2>
                                    <button
                                        onClick={() => navigate('/profile/edit')}
                                        className="text-gray-400 hover:text-blue-600 transition-colors"
                                        title="แก้ไขโปรไฟล์"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-gray-500">{user.email}</p>
                                {profile?.phone && (
                                    <p className="text-gray-500">{profile.phone}</p>
                                )}
                                {profile?.bio && (
                                    <p className="text-gray-600 mt-2 text-sm">{profile.bio}</p>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg flex items-center justify-between">
                            <h3 className="font-semibold text-lg text-yellow-800">คะแนนสะสม</h3>
                            <div className="flex items-center text-yellow-600">
                                <Trophy className="w-6 h-6 mr-2" />
                                <span className="font-bold text-2xl">{profile?.points || 0} แต้ม</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Card>
                                <CardHeader className="flex-row items-center gap-4 space-y-0">
                                    <Gift className="w-8 h-8 text-amber-500" />
                                    <CardTitle>แต้มรางวัลที่ให้</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {convertToPoints(displayProfile.total_rewards_given).toLocaleString()} แต้ม
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex-row items-center gap-4 space-y-0">
                                    <Heart className="w-8 h-8 text-pink-500" />
                                    <CardTitle>แต้มที่บริจาค</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {convertToPoints(displayProfile.total_donations).toLocaleString()} แต้ม
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-semibold text-lg flex items-center">
                                    <Car className="w-5 h-5 mr-2" />
                                    ประกาศของฉัน ({displayLostCars.length})
                                </h3>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/report')}
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                >
                                    + เพิ่มประกาศ
                                </Button>
                            </div>

                            {displayLostCars.length > 0 ? (
                                <div className="space-y-4">
                                    {displayLostCars.slice(0, 5).map((car) => (
                                        <Card key={car.id} className="p-4 hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="w-full md:w-48 flex-shrink-0">
                                                    {car.image_urls && car.image_urls.length > 0 ? (
                                                        car.image_urls.length === 1 ? (
                                                            <img
                                                                src={car.image_urls[0]}
                                                                alt={`${generateTitle(car)} - Image 1`}
                                                                className="object-cover w-full h-32 md:h-28 rounded-lg border border-gray-200 shadow-sm"
                                                                onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found')}
                                                            />
                                                        ) : (
                                                            <Carousel
                                                                showArrows={true}
                                                                showThumbs={false}
                                                                showStatus={car.image_urls.length > 1}
                                                                showIndicators={car.image_urls.length > 1}
                                                                infiniteLoop={true}
                                                                autoPlay={false}
                                                                className="rounded-lg overflow-hidden border border-gray-200 shadow-sm"
                                                            >
                                                                {car.image_urls.map((url, index) => (
                                                                    <div key={index}>
                                                                        <img
                                                                            src={url}
                                                                            alt={`${generateTitle(car)} - Image ${index + 1}`}
                                                                            className="object-cover w-full h-32 md:h-28"
                                                                            onError={(e) => (e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found')}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </Carousel>
                                                        )
                                                    ) : (
                                                        <div className="rounded-lg bg-gray-200 w-full h-32 md:h-28 flex items-center justify-center text-gray-500">
                                                            ไม่มีรูปภาพ
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-lg">{generateTitle(car)}</h4>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge className={getStatusColor(car.status)} variant="outline">
                                                                    {getStatusText(car.status)}
                                                                </Badge>
                                                                {car.police_report_url && (
                                                                    <Badge variant="outline" className="text-blue-600 border-blue-200">
                                                                        <Shield className="w-3 h-3 mr-1" />
                                                                        มีใบแจ้งความ
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {car.reward > 0 && (
                                                                <div className="text-right">
                                                                    <p className="text-lg font-bold text-green-600">
                                                                        ฿{car.reward.toLocaleString()}
                                                                    </p>
                                                                    <p className="text-2xs text-gray-500">รางวัล</p>
                                                                </div>
                                                            )}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => navigate(`/edit/${car.id}`)}
                                                                className="text-gray-400 hover:text-blue-600"
                                                                title="แก้ไขประกาศ"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <p><strong>รถ:</strong> {car.brand} {car.model}</p>
                                                            <p><strong>สี:</strong> {car.color}</p>
                                                            <p><strong>ทะเบียน:</strong> {car.license_plate}</p>
                                                        </div>
                                                        <div>
                                                            <p><strong>สถานที่หาย:</strong> {car.last_seen_location || 'ไม่ระบุ'}</p>
                                                            <p><strong>ตำบล:</strong> {car.subdistrict || 'ไม่ระบุ'}</p>
                                                            <p><strong>อำเภอ:</strong> {car.district || 'ไม่ระบุ'}</p>
                                                            <p><strong>จังหวัด:</strong> {car.province || 'ไม่ระบุ'}</p>
                                                            {car.lost_date && (
                                                                <p><strong>วันที่หาย:</strong> {new Date(car.lost_date).toLocaleDateString('th-TH')}</p>
                                                            )}
                                                            {car.police_report_url && (
                                                                <p>
                                                                    <strong>ใบแจ้งความ:</strong>{' '}
                                                                    <a
                                                                        href={car.police_report_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-blue-600 underline"
                                                                    >
                                                                        ดูไฟล์
                                                                    </a>
                                                                </p>
                                                            )}
                                                            <p><strong>สร้างเมื่อ:</strong> {new Date(car.created_at).toLocaleDateString('th-TH')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 bg-gray-100 rounded-md text-center">
                                    <p className="text-gray-600">🚧 คุณยังไม่มีประกาศรถหาย</p>
                                </div>
                            )}
                        </div>

                        <Button onClick={logout} variant="destructive" className="w-full">
                            ออกจากระบบ
                        </Button>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default ProfilePage;