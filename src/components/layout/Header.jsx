
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Car, Search, PlusCircle, LogIn, Trophy, FolderHeart as HandHeart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { UserNav } from '@/components/auth/UserNav';

const Header = () => {
  const { user } = useAuth();
  const activeLinkClass = "text-sky-600 font-semibold";
  const inactiveLinkClass = "text-gray-600 hover:text-sky-600 transition-colors";

  return (
    <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-sky-700">
            <Car className="w-7 h-7" />
            <span>FindMyLostCar</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <NavLink 
              to="/vehicles" 
              className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
            >
              <div className="flex items-center gap-1">
                <Search className="w-4 h-4" />
                <span>ค้นหารถ</span>
              </div>
            </NavLink>
            <NavLink 
              to="/report" 
              className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
            >
              <div className="flex items-center gap-1">
                <PlusCircle className="w-4 h-4" />
                <span>แจ้งรถหาย</span>
              </div>
            </NavLink>
            <NavLink 
              to="/leaderboard" 
              className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
            >
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>กระดานคะแนน</span>
              </div>
            </NavLink>
             <NavLink 
              to="/pricing" 
              className={({ isActive }) => (isActive ? activeLinkClass : inactiveLinkClass)}
            >
              <div className="flex items-center gap-1">
                <HandHeart className="w-4 h-4" />
                <span>สนับสนุน</span>
              </div>
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <UserNav />
            ) : (
              <Button asChild>
                <Link to="/login">
                  <LogIn className="mr-2 h-4 w-4" />
                  เข้าสู่ระบบ
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
