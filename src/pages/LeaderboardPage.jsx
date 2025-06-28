import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const LeaderboardPage = () => {
    const { users } = useAuth();
    
    const sortedUsers = [...users].sort((a, b) => (b.points || 0) - (a.points || 0));

    const getInitials = (name) => {
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    const rankColors = {
        1: 'bg-yellow-400 text-yellow-900',
        2: 'bg-gray-300 text-gray-800',
        3: 'bg-yellow-600 text-yellow-100',
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <Trophy className="mx-auto h-16 w-16 text-yellow-500" />
                <h1 className="text-4xl md:text-5xl font-extrabold text-sky-800 mt-4">กระดานคะแนนนักสืบ</h1>
                <p className="mt-2 text-lg text-gray-600">
                    ผู้ที่ให้เบาะแสมากที่สุดและช่วยเหลือสังคม
                </p>
            </motion.div>
            
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle>อันดับผู้ใช้งาน</CardTitle>
                    <CardDescription>คะแนนได้จากการแจ้งเบาะแสที่เป็นประโยชน์</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {sortedUsers.map((user, index) => (
                             <motion.li
                                key={user.id}
                                className={`flex items-center p-4 rounded-lg shadow-sm ${index < 3 ? 'bg-gradient-to-r from-sky-50 to-indigo-50' : 'bg-white'}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                             >
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg mr-4 ${rankColors[index + 1] || 'bg-gray-200'}`}>
                                    {index + 1}
                                </div>
                                <Avatar className="h-12 w-12 mr-4">
                                    <AvatarImage src={user.user_metadata?.avatar_url} />
                                    <AvatarFallback>{getInitials(user.user_metadata?.full_name)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-grow">
                                    <p className="font-bold text-gray-800">{user.user_metadata?.full_name}</p>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                </div>
                                <div className="flex items-center text-yellow-600">
                                    <Trophy className="w-5 h-5 mr-1" />
                                    <span className="font-bold text-xl">{user.points || 0}</span>
                                </div>
                            </motion.li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
};

export default LeaderboardPage;