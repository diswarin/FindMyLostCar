import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useVehicles } from '@/context/VehicleContext.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import ImageUploader from '@/components/ImageUploader';
import { motion } from 'framer-motion';
import { DollarSign, Car } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/supabaseClient';

const EditReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addVehicle } = useVehicles();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    licensePlate: '',
    brand: '',
    model: '',
    color: '',
    lastSeenLocation: '',
    subdistrict: '',
    district: '',
    province: '',
    contact: '',
    reward: '',
    policeReportUrl: '',
    lostDate: '',
    anonymous: false,
  });
  const [acceptPolicy, setAcceptPolicy] = useState(false);
  const [policeReportFile, setPoliceReportFile] = useState(null);
  const [policeReportUrl, setPoliceReportUrl] = useState('');
  const [policeReportPreview, setPoliceReportPreview] = useState('');
  const [carImageUrls, setCarImageUrls] = useState([]);
  const [hasUploaded, setHasUploaded] = useState(false); // Flag to prevent re-uploads

  // Fetch existing data and images
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lost car data
        const { data: carData, error: carError } = await supabase
          .from('lost_cars')
          .select('*')
          .eq('id', id)
          .single();

        if (carError) {
          console.error('Error fetching car data:', carError);
          toast({ title: 'ไม่สามารถโหลดข้อมูลได้', description: carError.message, variant: 'destructive' });
          return;
        }

        console.log('- Loaded car data:', carData);

        // Map database fields to formData
        setFormData({
          licensePlate: carData.license_plate || '',
          brand: carData.brand || '',
          model: carData.model || '',
          color: carData.color || '',
          lastSeenLocation: carData.last_seen_location || '',
          subdistrict: carData.subdistrict || '',
          district: carData.district || '',
          province: carData.province || '',
          contact: carData.contact || '',
          reward: carData.reward || '',
          policeReportUrl: carData.police_report_url || '',
          lostDate: carData.lost_date ? carData.lost_date.split('T')[0] : '',
          anonymous: carData.is_anonymous || false,
        });

        // Set police report URL and preview
        if (carData.police_report_url) {
          setPoliceReportUrl(carData.police_report_url);
          setPoliceReportPreview(carData.police_report_url);
          console.log('- Police report URL:', carData.police_report_url);
        } else {
          console.log('- No police report URL found');
        }

        // Fetch existing images from car_images
        const { data: imageData, error: imageError } = await supabase
          .from('car_images')
          .select('image_url')
          .eq('lost_car_id', id);

        if (imageError) {
          console.error('Error fetching car images:', imageError);
          toast({ title: 'ไม่สามารถโหลดรูปภาพได้', description: imageError.message, variant: 'destructive' });
          return;
        }

        const existingImageUrls = imageData.map((img) => img.image_url);
        setCarImageUrls(existingImageUrls);
        setFiles(existingImageUrls.map((url, index) => ({
          name: `existing_image_${index}`,
          preview: url,
          isExisting: true,
        })));
        console.log('✅ Loaded car images:', existingImageUrls);
      } catch (error) {
        console.error('Unexpected error:', error);
        toast({ title: 'เกิดข้อผิดพลาด', description: error.message, variant: 'destructive' });
      }
    };

    fetchData();
  }, [id, toast]);

  // Handle car image uploads to Supabase when files change
  useEffect(() => {
    console.log('📸 Files state:', files);
    const uploadCarImages = async () => {
      if (hasUploaded) {
        console.log('🚫 Skipping upload: hasUploaded is true');
        setIsUploading(false);
        return;
      }

      // Filter out existing images and already uploaded files
      const newFiles = files.filter((file) => !file.isExisting && !carImageUrls.includes(file.preview));
      if (newFiles.length === 0) {
        console.log('🚫 No new files to upload');
        setIsUploading(false);
        return;
      }

      setIsUploading(true);
      const newImageUrls = [];

      for (const file of newFiles) {
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "ไฟล์ใหญ่เกินไป",
            description: `ไฟล์ ${file.name} มีขนาดเกิน 5MB`,
            variant: "destructive",
          });
          continue;
        }

        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `car_image_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

          const { data, error } = await supabase.storage
            .from('carimages')
            .upload(fileName, file);

          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from('carimages')
            .getPublicUrl(fileName);

          newImageUrls.push(urlData.publicUrl);
          console.log('✅ Uploaded car image:', urlData.publicUrl);
        } catch (error) {
          console.error('Error uploading car image:', error);
          toast({
            title: "อัปโหลดไม่สำเร็จ",
            description: `ไม่สามารถอัปโหลดไฟล์ ${file.name}: ${error.message}`,
            variant: "destructive",
          });
        }
      }

      if (newImageUrls.length > 0) {
        setCarImageUrls((prev) => [...prev, ...newImageUrls]);
        setHasUploaded(true); // Prevent further uploads
        toast({
          title: "อัปโหลดสำเร็จ",
          description: `อัปโหลด ${newImageUrls.length} รูปภาพรถเรียบร้อยแล้ว`,
        });
      }

      setIsUploading(false);
    };

    uploadCarImages();

    return () => {
      files.forEach((file) => {
        if (!file.isExisting) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [files, toast]); // Removed carImageUrls from dependencies

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    console.log('📝 Form field changed:', {
      field: id,
      value: newValue,
      type: type,
    });

    setFormData((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  };

  const handlePoliceReportChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPoliceReportFile(file);

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "ไฟล์ใหญ่เกินไป",
        description: "กรุณาเลือกไฟล์ที่มีขนาดไม่เกิน 5MB",
        variant: "destructive",
      });
      return;
    }

    if (file.type.startsWith('image/') || file.type === 'application/pdf') {
      setPoliceReportPreview(URL.createObjectURL(file));
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `police_report_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('policereports')
        .upload(fileName, file);

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('policereports')
        .getPublicUrl(fileName);

      setPoliceReportUrl(urlData.publicUrl);
      setFormData((prev) => ({ ...prev, policeReportUrl: urlData.publicUrl }));
      console.log('✅ setPoliceReportUrl:', urlData.publicUrl);
      toast({
        title: "อัปโหลดสำเร็จ",
        description: "อัปโหลดใบแจ้งความเรียบร้อยแล้ว",
      });
    } catch (error) {
      console.error('Error uploading police report:', error);
      toast({
        title: "อัปโหลดไม่สำเร็จ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Starting form submission...');

    if (!user) {
      console.log('❌ Validation failed: User not authenticated');
      toast({ title: "กรุณาเข้าสู่ระบบ", variant: "destructive" });
      return;
    }
    console.log('✅ User authenticated:', user.id);

    const { contact, reward, policeReportUrl, anonymous, ...requiredFields } = formData;
    console.log('📝 Form data validation:');
    console.log('- Required fields:', requiredFields);
    console.log('- Optional fields:', { contact, reward, policeReportUrl, anonymous });

    const emptyFields = Object.entries(requiredFields).filter(([key, value]) => value === '');
    if (emptyFields.length > 0) {
      console.log('❌ Validation failed: Empty required fields:', emptyFields.map(([key]) => key));
      toast({
        title: "ข้อมูลไม่ครบถ้วน",
        description: "กรุณากรอกข้อมูลให้ครบทุกช่อง (ยกเว้นข้อมูลติดต่อ, รางวัล, และใบแจ้งความ)",
        variant: "destructive",
      });
      return;
    }
    console.log('✅ All required fields validated');

    if (!acceptPolicy) {
      console.log('❌ Validation failed: Policy not accepted');
      toast({
        title: "กรุณายอมรับนโยบายและข้อกำหนด",
        variant: "destructive",
      });
      return;
    }
    console.log('✅ Policy accepted');

    if (isUploading) {
      toast({
        title: "กำลังอัปโหลดไฟล์",
        description: "กรุณารอให้อัปโหลดเสร็จก่อนส่ง",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    console.log('⏳ Setting submission state to loading...');

    try {
      const lostCarData = {
        license_plate: formData.licensePlate,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        last_seen_location: formData.lastSeenLocation,
        subdistrict: formData.subdistrict,
        district: formData.district,
        province: formData.province,
        lost_date: formData.lostDate || null,
        contact: formData.contact || null,
        reward: Number(formData.reward) || 0,
        police_report_url: policeReportUrl || null,
        is_anonymous: formData.anonymous,
        owner_name: formData.anonymous ? null : user.user_metadata.full_name,
        owner_id: user.id,
        status: 'active',
      };

      console.log('💾 Prepared data for lost_cars:', lostCarData);
      console.log('🔄 Updating data in lost_cars table...');

      const { data: carData, error: carError } = await supabase
        .from('lost_cars')
        .update(lostCarData)
        .eq('id', id)
        .select()
        .single();

      if (carError) {
        console.log('❌ Database error (lost_cars):', carError);
        throw carError;
      }

      console.log('✅ Data updated in lost_cars:', carData);

      // Delete existing images from car_images
      const { error: deleteImageError } = await supabase
        .from('car_images')
        .delete()
        .eq('lost_car_id', id);

      if (deleteImageError) {
        console.log('❌ Database error (deleting car_images):', deleteImageError);
        throw deleteImageError;
      }

      // Insert new images into car_images
      if (carImageUrls.length > 0) {
        const imageRecords = carImageUrls.map((url) => ({
          lost_car_id: carData.id,
          image_url: url,
        }));

        console.log('🔄 Inserting image URLs into car_images:', imageRecords);
        const { error: imageError } = await supabase
          .from('car_images')
          .insert(imageRecords);

        if (imageError) {
          console.log('❌ Database error (car_images):', imageError);
          throw imageError;
        }
        console.log('✅ Inserted image URLs into car_images');
      }

      const vehicleForContext = {
        id: carData.id,
        licensePlate: carData.license_plate,
        brand: carData.brand,
        model: carData.model,
        color: carData.color,
        lastSeenLocation: carData.last_seen_location,
        subdistrict: carData.subdistrict,
        district: carData.district,
        province: carData.province,
        lastSeenDate: carData.last_seen_date,
        contact: carData.contact,
        reward: carData.reward,
        imageUrls: carImageUrls,
        policeReportUrl: carData.police_report_url,
        lostDate: carData.lost_date,
        anonymous: carData.is_anonymous,
        ownerName: carData.owner_name,
        ownerId: carData.owner_id,
      };

      console.log('🔄 Updating vehicle context:', vehicleForContext);
      addVehicle(vehicleForContext);

      console.log('✅ Form submission completed successfully');
      toast({
        title: "อัปเดตข้อมูลสำเร็จ",
        description: "ข้อมูลรถหายของคุณได้ถูกอัปเดตเรียบร้อยแล้ว",
      });

      console.log('🔄 Navigating to /vehicles...');
      navigate('/vehicles');
    } catch (error) {
      console.error('💥 Error updating lost car:', error);
      console.log('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      console.log('🏁 Setting submission state to idle...');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Car className="h-8 w-8" />
              แก้ไขแจ้งข้อมูลรถหาย
            </CardTitle>
            <CardDescription>
              กรอกรายละเอียดเกี่ยวกับรถของคุณ ข้อมูลจะถูกแสดงพร้อมชื่อและโปรไฟล์ของคุณ
              (หรือเลือกโพสต์แบบไม่ออกนาม)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="licensePlate">ป้ายทะเบียน</Label>
                  <Input id="licensePlate" value={formData.licensePlate} onChange={handleChange} placeholder="กข 1234" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">สีรถ</Label>
                  <Input id="color" value={formData.color} onChange={handleChange} placeholder="ดำ" required />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">ยี่ห้อ</Label>
                  <Input id="brand" value={formData.brand} onChange={handleChange} placeholder="Toyota" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">รุ่น</Label>
                  <Input id="model" value={formData.model} onChange={handleChange} placeholder="Vios" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastSeenLocation">สถานที่/บริเวณที่พบเห็นล่าสุด</Label>
                <Textarea id="lastSeenLocation" value={formData.lastSeenLocation} onChange={handleChange} placeholder="เช่น สยามพารากอน, ใกล้ BTS อโศก" required />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subdistrict">ตำบล</Label>
                  <Input id="subdistrict" value={formData.subdistrict} onChange={handleChange} placeholder="เช่น คลองตัน" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district">อำเภอ</Label>
                  <Input id="district" value={formData.district} onChange={handleChange} placeholder="เช่น วัฒนา" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">จังหวัด</Label>
                  <Input id="province" value={formData.province} onChange={handleChange} placeholder="เช่น กรุงเทพมหานคร" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lostDate">วันที่รถหาย</Label>
                <Input id="lostDate" type="date" value={formData.lostDate} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">ข้อมูลติดต่อกลับ (เบอร์โทรศัพท์ หรือ Line ID)</Label>
                <Input id="contact" value={formData.contact} onChange={handleChange} placeholder="ไม่บังคับ กรอกเพื่อให้คนอื่นติดต่อได้ง่ายขึ้น" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reward">ตั้งรางวัลนำจับ (บาท)</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="reward" type="number" value={formData.reward} onChange={handleChange} placeholder="ไม่บังคับ" className="pl-8" />
                </div>
                <p className="text-xs text-gray-500">การตั้งรางวัลจะช่วยเพิ่มโอกาสในการค้นหา (ต้องชำระเงินตามแผนบริการ สนับสนุน)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="carImageFile">อัปโหลดรูปภาพรถ (ไฟล์ JPG, PNG)</Label>
                <ImageUploader files={files} setFiles={setFiles} />
                {files.length > 0 && (
                  <div className="my-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {files.map((file, index) => (
                      <img
                        key={index}
                        src={file.preview}
                        alt={`Car preview ${index}`}
                        className="max-h-48 rounded shadow object-cover"
                      />
                    ))}
                    <p className="text-xs text-gray-500 col-span-full">ตัวอย่างรูปภาพที่เลือก ({files.length} รูป)</p>
                  </div>
                )}
                {carImageUrls.length > 0 && (
                  <div className="text-xs text-green-600 break-all">
                    อัปโหลดสำเร็จ:
                    {carImageUrls.map((url, index) => (
                      <div key={index}>
                        <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                          ดูรูปภาพ {index + 1}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500">รองรับไฟล์ภาพ (สูงสุด 5MB, อัปโหลดได้สูงสุด 5 ไฟล์)</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="policeReportFile">อัปโหลดใบแจ้งความ (ไฟล์ PDF หรือรูปภาพ)</Label>
                <Input
                  id="policeReportFile"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handlePoliceReportChange}
                />
                {policeReportPreview && (
                  <div className="my-2">
                    {policeReportPreview.endsWith('.pdf') ? (
                      <iframe
                        src={policeReportPreview}
                        title="Police report preview"
                        className="w-full max-h-64 rounded shadow"
                      />
                    ) : (
                      <img src={policeReportPreview} alt="Police report preview" className="max-h-48 rounded shadow" />
                    )}
                    <p className="text-xs text-gray-500">ตัวอย่างใบแจ้งความที่เลือก</p>
                  </div>
                )}
                {policeReportUrl && (
                  <p className="text-xs text-green-600 break-all">
                    อัปโหลดสำเร็จ: <a href={policeReportUrl} target="_blank" rel="noopener noreferrer" className="underline">ดูไฟล์</a>
                  </p>
                )}
                <p className="text-xs text-gray-500">รองรับ PDF หรือรูปภาพ (สูงสุด 5MB)</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="anonymous"
                  checked={formData.anonymous}
                  onChange={handleChange}
                />
                <Label htmlFor="anonymous">โพสต์แบบไม่ออกนาม (ซ่อนชื่อเจ้าของประกาศ)</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="acceptPolicy"
                  checked={acceptPolicy}
                  onChange={(e) => setAcceptPolicy(e.target.checked)}
                />
                <Label htmlFor="acceptPolicy">
                  ฉันยอมรับ 
                  <Link to="/privacy" className="underline text-blue-600" target="_blank">
                    นโยบายความเป็นส่วนตัว
                  </Link>
                   และ 
                  <Link to="/terms" className="underline text-blue-600" target="_blank">
                    ข้อกำหนดการใช้งาน
                  </Link>
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-700 text-lg py-6"
                disabled={isSubmitting || isUploading || !acceptPolicy}
              >
                {isSubmitting ? 'กำลังอัปเดต...' : 'อัปเดตข้อมูล'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditReportPage;