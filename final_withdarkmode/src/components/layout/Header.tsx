import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Leaf } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export function Header() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <Leaf className="h-6 w-6 text-green-600" />
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg font-bold">OneEarth</span>
          </Link>
        </div>

        <nav className="ml-auto flex items-center space-x-2">
        <ThemeToggle />
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-4 mr-4">
                <Link to="/challenges" className="text-sm font-medium transition-colors hover:text-primary">
                  Challenges
                </Link>
                <Link to="/leaderboard" className="text-sm font-medium transition-colors hover:text-primary">
                  Leaderboard
                </Link>
                <Link to="/rewards" className="text-sm font-medium transition-colors hover:text-primary">
                  Rewards
                </Link>
                {user.role === 'host' && (
                  <Link to="/host/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                    Host Dashboard
                  </Link>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-green-600 text-white">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    {user.role === 'user' && (
                      <p className="text-xs text-muted-foreground">XP: {user.xp}</p>
                    )}
                  </div>
                  <div className="md:hidden">
                    <DropdownMenuItem asChild>
                      <Link to="/challenges">Challenges</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/leaderboard">Leaderboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/rewards">Rewards</Link>
                    </DropdownMenuItem>
                    {user.role === 'host' && (
                      <DropdownMenuItem asChild>
                        <Link to="/host/dashboard">Host Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}