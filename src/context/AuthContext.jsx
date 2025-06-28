import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/supabaseClient'; // เพิ่มบรรทัดนี้

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [users, setUsers] = useState([]); // To manage all users for leaderboard
    const { toast } = useToast();

    useEffect(() => {
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });
        // initial fetch
        supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
        return () => listener?.subscription.unsubscribe();
    }, []);

    useEffect(() => {
        try {
            const storedUsers = localStorage.getItem('app_users');
            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
                const initialUsers = [{
                    id: 'mock-user-id',
                    email: 'user@line.me',
                    user_metadata: {
                        full_name: 'ผู้ใช้ LINE',
                        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&fit=crop',
                    },
                    points: 0,
                    is_admin: true, // Mock admin user
                }];
                setUsers(initialUsers);
                localStorage.setItem('app_users', JSON.stringify(initialUsers));
            }
        } catch (error) {
            console.error("Failed to load users from localStorage", error);
        }
    }, []);

    const updateLocalStorageUsers = (updatedUsers) => {
        localStorage.setItem('app_users', JSON.stringify(updatedUsers));
    };

    const logout = () => {
        setUser(null);
        toast({
            title: "ออกจากระบบสำเร็จ",
        });
    };
    
    const addPoints = (userId, pointsToAdd) => {
        const updatedUsers = users.map(u => {
            if (u.id === userId) {
                const updatedUser = { ...u, points: (u.points || 0) + pointsToAdd };
                if(user && user.id === userId) {
                    setUser(updatedUser);
                }
                return updatedUser;
            }
            return u;
        });
        setUsers(updatedUsers);
        updateLocalStorageUsers(updatedUsers);
    };

    const loginWithProvider = async (provider, payload) => {
        if (provider === 'email') {
            return await supabase.auth.signInWithPassword({ email: payload.email, password: payload.password });
        }
        if (provider === 'signup') {
            return await supabase.auth.signUp({ email: payload.email, password: payload.password });
        }
        if (provider === 'verifyOtp') {
            return await supabase.auth.verifyOtp({ email: payload.email, token: payload.otp, type: 'email' });
        }
        // LINE OIDC (External OAuth)
        if (provider === 'line_oidc' && payload?.idToken) {
            return await supabase.auth.signInWithIdToken({
                provider: 'oidc',
                token: payload.idToken,
                accessToken: payload.accessToken, // optional
            });
        }
        // social providers (Google, Facebook, Apple, LINE ที่เปิดใน Supabase)
        return await supabase.auth.signInWithOAuth({ provider });
    };

    const value = {
        user,
        users,
        logout,
        addPoints,
        loginWithProvider,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};