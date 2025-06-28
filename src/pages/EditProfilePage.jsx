import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Camera, Save, User, Phone, Mail, AlertCircle, CheckCircle, AtSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/supabaseClient';

const EditProfilePage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [notification, setNotification] = useState({ type: '', message: '' });
    
    const [formData, setFormData] = useState({
        full_name: '',
        display_name: '',
        phone: '',
        bio: '',
        avatar_url: ''
    });

    // Notification helper
    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            if (data) {
                setFormData({
                    full_name: data.full_name || '',
                    display_name: data.display_name || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || ''
                });
            } else {
                // ถ้าไม่มีข้อมูลใน profiles ให้ใช้ข้อมูลจาก user metadata
                setFormData({
                    full_name: user.user_metadata?.full_name || '',
                    display_name: user.user_metadata?.display_name || '',
                    phone: user.user_metadata?.phone || '',
                    bio: user.user_metadata?.bio || '',
                    avatar_url: user.user_metadata?.avatar_url || ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            showNotification('error', 'เกิดข้อผิดพลาดในการโหลดข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const uploadAvatar = async (file) => {
        try {
            setUploading(true);
            
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, { upsert: true });

            if (uploadError) {
                throw uploadError;
            }

            const { data: publicUrlData } = supabase
                .storage
                .from('avatars')
                .getPublicUrl(filePath);

            console.log('Public URL:', publicUrlData?.publicUrl);

            return publicUrlData?.publicUrl || null;
        } catch (error) {
            console.error('Error uploading avatar:', error);
            showNotification('error', 'เกิดข้อผิดพลาดในการอัพโหลดรูปภาพ');
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB limit
                showNotification('error', 'ขนาดไฟล์ต้องไม่เกิน 2MB');
                return;
            }

            const avatarUrl = await uploadAvatar(file);
            if (avatarUrl) {
                setFormData(prev => ({
                    ...prev,
                    avatar_url: avatarUrl
                }));
                showNotification('success', 'อัพโหลดรูปภาพเรียบร้อยแล้ว');
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            console.log('Submitting profile data:', formData);
            console.log('User ID:', user.id);
            console.log('Final avatar_url:', formData.avatar_url);

            // ตรวจสอบว่า user มี id หรือไม่
            if (!user?.id) {
                throw new Error('ไม่พบข้อมูลผู้ใช้');
            }

            // เตรียมข้อมูลสำหรับ upsert
            const profileData = {
                id: user.id,
                full_name: formData.full_name?.trim() || null,
                display_name: formData.display_name?.trim() || null,
                phone: formData.phone?.trim() || null,
                bio: formData.bio?.trim() || null,
                avatar_url: formData.avatar_url || null,
                updated_at: new Date().toISOString()
            };

            console.log('Profile data to upsert:', profileData);

            // อัพเดทข้อมูลใน profiles table
            const { data, error: profileError } = await supabase
                .from('profiles')
                .upsert(profileData, {
                    onConflict: 'id',
                    returning: 'minimal'
                });

            if (profileError) {
                console.error('Profile upsert error:', profileError);
                throw new Error(`เกิดข้อผิดพลาดในการบันทึกข้อมูล: ${profileError.message}`);
            }

            console.log('Profile upsert success:', data);

            // อัพเดท user metadata (ไม่บังคับ - ถ้าล้มเหลวไม่ต้อง throw error)
            try {
                const { error: authError } = await supabase.auth.updateUser({
                    data: {
                        full_name: formData.full_name,
                        display_name: formData.display_name,
                        phone: formData.phone,
                        bio: formData.bio,
                        avatar_url: formData.avatar_url
                    }
                });

                if (authError) {
                    console.warn('Auth metadata update failed:', authError);
                }
            } catch (authError) {
                console.warn('Auth update error (non-critical):', authError);
            }

            showNotification('success', 'บันทึกข้อมูลเรียบร้อยแล้ว');
            setTimeout(() => navigate('/profile'), 1500);

        } catch (error) {
            console.error('Error updating profile:', error);
            showNotification('error', error.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setSaving(false);
        }
    };

    const getInitials = (displayName, fullName, email) => {
        const name = displayName || fullName;
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

    if (!user || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded mb-4"></div>
                        <div className="h-96 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Notification */}
            {notification.message && (
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center gap-2 ${
                        notification.type === 'success' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <AlertCircle className="w-5 h-5" />
                    )}
                    {notification.message}
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center mb-6">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate('/profile')}
                            className="mr-4"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            กลับ
                        </Button>
                        <h1 className="text-2xl font-bold">แก้ไขโปรไฟล์</h1>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2" />
                                ข้อมูลส่วนตัว
                            </CardTitle>
                            <CardDescription>
                                แก้ไขข้อมูลส่วนตัวของคุณ
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage 
                                                src={formData.avatar_url} 
                                                alt={formData.display_name || formData.full_name || user.email} 
                                            />
                                            <AvatarFallback className="text-lg">
                                                {getInitials(formData.display_name, formData.full_name, user.email)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label 
                                            htmlFor="avatar-upload"
                                            className={`absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            ) : (
                                                <Camera className="w-4 h-4" />
                                            )}
                                        </label>
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarChange}
                                            disabled={uploading}
                                            className="hidden"
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 text-center">
                                        คลิกที่ไอคอนกล้องเพื่อเปลี่ยนรูปโปรไฟล์<br />
                                        <span className="text-xs">ขนาดไฟล์ไม่เกิน 2MB</span>
                                    </p>
                                </div>

                                {/* Form Fields */}
                                <div className="grid grid-cols-1 gap-6">
                                    {/* Display Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="display_name">ฉายา / ชื่อที่ใช้แสดง</Label>
                                        <div className="relative">
                                            <AtSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="display_name"
                                                name="display_name"
                                                type="text"
                                                value={formData.display_name}
                                                onChange={handleInputChange}
                                                placeholder="เช่น น้องแมว, คุณหมอ, ครูใหญ่"
                                                className="pl-10"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            ชื่อที่จะแสดงในประกาศและความคิดเห็น
                                        </p>
                                    </div>

                                    {/* Full Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="full_name">ชื่อ-นามสกุล</Label>
                                        <Input
                                            id="full_name"
                                            name="full_name"
                                            type="text"
                                            value={formData.full_name}
                                            onChange={handleInputChange}
                                            placeholder="กรอกชื่อ-นามสกุล"
                                            className="w-full"
                                        />
                                        <p className="text-xs text-gray-500">
                                            ชื่อจริงของคุณ (จะไม่แสดงต่อสาธารณะ)
                                        </p>
                                    </div>

                                    {/* Email (Read-only) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email">อีเมล</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                type="email"
                                                value={user.email}
                                                disabled
                                                className="pl-10 bg-gray-50"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            ไม่สามารถเปลี่ยนอีเมลได้
                                        </p>
                                    </div>

                                    {/* Phone */}
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">เบอร์โทรศัพท์</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                placeholder="081-234-5678"
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    {/* Bio */}
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">เกี่ยวกับฉัน</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            placeholder="เขียนอะไรเกี่ยวกับตัวคุณ..."
                                            rows={4}
                                            className="resize-none"
                                            maxLength={200}
                                        />
                                        <p className="text-xs text-gray-500">
                                            {formData.bio.length}/200 ตัวอักษร
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => navigate('/profile')}
                                        className="flex-1"
                                        disabled={saving || uploading}
                                    >
                                        ยกเลิก
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1"
                                        disabled={saving || uploading}
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                กำลังบันทึก...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" />
                                                บันทึกการเปลี่ยนแปลง
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Additional Settings Card */}
                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle className="text-red-600">การตั้งค่า</CardTitle>
                        </CardHeader>
                    </Card>
                </div>
            </motion.div>
        </div>
    );
};
export default EditProfilePage;