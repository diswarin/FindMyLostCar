import React from "react"
import { Link } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Trophy, FolderHeart as HandHeart, Shield } from 'lucide-react'

export function UserNav() {
  const { user, logout } = useAuth()

  if (!user) {
    return null
  }

  const getInitials = (name) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.user_metadata?.full_name} />
            <AvatarFallback>{getInitials(user.user_metadata?.full_name || 'U')}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
             <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>โปรไฟล์</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link to="/leaderboard">
                <Trophy className="mr-2 h-4 w-4" />
                <span>กระดานคะแนน</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
             <Link to="/pricing">
                <HandHeart className="mr-2 h-4 w-4" />
                <span>สนับสนุน</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        {user.is_admin && (
          <>
            <DropdownMenuItem asChild>
              <Link to="/admin">
                <Shield className="mr-2 h-4 w-4" />
                <span>แผงควบคุมแอดมิน</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>ออกจากระบบ</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}