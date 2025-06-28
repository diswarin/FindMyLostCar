import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const LoginPage = () => {
    const { loginWithProvider, user } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [signupMode, setSignupMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Email/Password login
    const handleLogin = async () => {
        setLoading(true);
        try {
            const { error } = await loginWithProvider('email', { email, password });
            setMessage(error ? error.message : '');
        } catch (error) {
            setMessage(error.message);
        }
        setLoading(false);
    };

    // Email/Password signup
    const handleSignup = async () => {
        setLoading(true);
        try {
            const { error } = await loginWithProvider('signup', { email, password });
            setMessage(error ? error.message : 'สมัครสมาชิกสำเร็จ! กรุณาล็อกอินเข้าสู่ระบบ');
        } catch (error) {
            setMessage(error.message);
        }
        setLoading(false);
    };

    if (user?.email && user?.user_metadata?.email_verified) {
        // redirect หรือแสดงข้อความสำเร็จ
        setMessage('ยืนยันอีเมลสำเร็จ กรุณาเข้าสู่ระบบ');
    }

    return (
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl">ยินดีต้อนรับ!</CardTitle>
                        <CardDescription>
                            {signupMode ? 'สมัครสมาชิกเพื่อใช้งานระบบ' : 'เข้าสู่ระบบเพื่อแจ้งรถหายและจัดการข้อมูลของคุณ'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Social login/signup */}
                        <div className="flex flex-col gap-3 mb-4">
                            <Button
                                onClick={() => loginWithProvider('google')}
                                className="w-full h-12 text-lg bg-red-500 hover:bg-red-600 text-white"
                                disabled={loading}
                            >
                                {signupMode ? 'สมัครด้วย Google' : 'เข้าสู่ระบบด้วย Google'}
                            </Button>
                            <Button
                                onClick={() => loginWithProvider('facebook')}
                                className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={loading}
                            >
                                {signupMode ? 'สมัครด้วย Facebook' : 'เข้าสู่ระบบด้วย Facebook'}
                            </Button>
                        </div>
                        {/* Email/Password login/signup */}
                        <div className="mb-4">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full mb-2 px-3 py-2 border rounded"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                            />
                            
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full mb-2 px-3 py-2 border rounded"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={loading}
                                />
                            
                        </div>
                        {message && <div className="mb-2 text-center text-red-500">{message}</div>}
                        {!signupMode && (
                            <Button
                                onClick={handleLogin}
                                className="w-full h-12 text-lg bg-primary text-white mb-2"
                                disabled={loading}
                            >
                                เข้าสู่ระบบด้วย Email/Password
                            </Button>
                        )}
                        {signupMode && (
                            <Button
                                onClick={handleSignup}
                                className="w-full h-12 text-lg bg-primary text-white mb-2"
                                disabled={loading}
                            >
                                สมัครสมาชิกด้วย Email/Password
                            </Button>
                        )}
                        <div className="text-center mt-4">
                            {signupMode ? (
                                <span>
                                    มีบัญชีอยู่แล้ว?{' '}
                                    <button className="text-blue-600 underline" onClick={() => { setSignupMode(false); setMessage(''); }}>
                                        เข้าสู่ระบบ
                                    </button>
                                </span>
                            ) : (
                                <span>
                                    ยังไม่มีบัญชี?{' '}
                                    <button className="text-blue-600 underline" onClick={() => { setSignupMode(true); setMessage(''); }}>
                                        สมัครสมาชิก
                                    </button>
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default LoginPage;