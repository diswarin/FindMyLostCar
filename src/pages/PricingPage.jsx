import React, { useEffect, useState } from 'react';
import { CheckCircle, Star, Gift, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import { supabase } from '@/supabaseClient';
import { useAuth } from '@/context/AuthContext';

const iconMap = {
    Star,
    Gift,
    Heart,
};

const PricingPage = () => {
    const { toast } = useToast();
    const { user } = useAuth();
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [customPrice, setCustomPrice] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            const { data, error } = await supabase.from('plans').select('*').order('id');
            if (error) {
                toast({ title: "เกิดข้อผิดพลาด", description: error.message });
            } else {
                setPlans(
                    data.map(plan => ({
                        ...plan,
                        features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
                        icon: iconMap[plan.icon] || Star,
                    }))
                );
            }
        };
        fetchPlans();
    }, [toast]);

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setCustomPrice('');
    };

    const handleConfirm = async () => {
        if (!user) {
            toast({ title: "กรุณาเข้าสู่ระบบก่อนเลือกแผน" });
            return;
        }
        setProcessing(true);
        let priceToSave = selectedPlan.price;
        if (selectedPlan.price_type === 'custom') {
            if (!customPrice || isNaN(customPrice) || Number(customPrice) <= 0) {
                toast({ title: "กรุณากรอกจำนวนเงินที่ต้องการสนับสนุน" });
                setProcessing(false);
                return;
            }
            priceToSave = Number(customPrice);
        }
        const { error } = await supabase.from('user_plans').insert([
            {
                user_id: user.id,
                plan_id: selectedPlan.id,
                selected_at: new Date().toISOString(),
                price: priceToSave
            }
        ]);
        if (!error) {
            toast({ title: "เลือกแผนสำเร็จ", description: "ขอบคุณที่สนับสนุนเรา!" });
            setSelectedPlan(null);
            setCustomPrice('');
        } else {
            toast({ title: "เกิดข้อผิดพลาด", description: error.message });
        }
        setProcessing(false);
    };

    return (
        <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800">แผนบริการและการสนับสนุน</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                        เลือกแผนที่เหมาะกับคุณ หรือร่วมเป็นส่วนหนึ่งในการสนับสนุนให้แพลตฟอร์มของเราเติบโต
                    </p>
                </motion.div>

                {/* เลือกแผน */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className={`flex flex-col h-full ${plan.popular ? 'border-sky-500 border-2 shadow-xl' : ''}`}>
                                <CardHeader className="text-center">
                                    <plan.icon className="mx-auto h-10 w-10 text-sky-600 mb-4" />
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription className="text-4xl font-bold text-gray-800 mt-2">
                                        {plan.price_type === 'custom'
                                            ? <span>กำหนดเอง</span>
                                            : <>{plan.price ?? '-'} <span className="text-lg font-normal text-gray-500">{plan.price_suffix}</span></>
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow flex flex-col">
                                    <ul className="space-y-3 text-gray-600 mb-8 flex-grow">
                                        {Array.isArray(plan.features) && plan.features.map(feature => (
                                            <li key={feature} className="flex items-start">
                                                <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        onClick={() => handleSelectPlan(plan)}
                                        size="lg"
                                        className={`w-full`}
                                    >
                                        เลือกแผนนี้
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Process เลือกแผน */}
                {selectedPlan && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={() => { setSelectedPlan(null); setCustomPrice(''); }}
                                aria-label="ปิด"
                            >✕</button>
                            <h2 className="text-2xl font-bold mb-2 text-sky-700">{selectedPlan.name}</h2>
                            <div className="mb-4">
                                {selectedPlan.price_type === 'custom' ? (
                                    <div>
                                        <label className="block mb-2 text-gray-700">กรุณากรอกจำนวนเงินที่ต้องการสนับสนุน (บาท)</label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full border px-3 py-2 rounded mb-2"
                                            value={customPrice}
                                            onChange={e => setCustomPrice(e.target.value)}
                                            disabled={processing}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-3xl font-bold text-gray-800 mb-2">
                                        {selectedPlan.price} <span className="text-lg font-normal text-gray-500">{selectedPlan.price_suffix}</span>
                                    </div>
                                )}
                                <ul className="space-y-2 text-gray-600 mt-2">
                                    {Array.isArray(selectedPlan.features) && selectedPlan.features.map(feature => (
                                        <li key={feature} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <Button
                                onClick={handleConfirm}
                                size="lg"
                                className="w-full"
                                disabled={processing}
                            >
                                ยืนยันเลือกแผน
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PricingPage;
