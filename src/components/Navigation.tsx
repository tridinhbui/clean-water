import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  History, 
  BarChart3, 
  Bell, 
  Download, 
  GitCompare,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Home,
  Droplets,
  Sparkles
} from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const pathname = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2); // Mock data

  // Simulated auth state for serverless demo
  const isAuthenticated = false; // Set to true to show authenticated UI
  const isLoading = false;
  const session = null;

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      requiresAuth: true,
    },
    {
      name: 'Camera',
      href: '/camera',
      icon: Camera,
      requiresAuth: true,
    },
    {
      name: 'History',
      href: '/history',
      icon: History,
      requiresAuth: true,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      requiresAuth: true,
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: GitCompare,
      requiresAuth: true,
    },
    {
      name: 'Export',
      href: '/export',
      icon: Download,
      requiresAuth: true,
    },
  ];

  const userMenuItems = [
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      badge: unreadNotifications > 0 ? unreadNotifications : null,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname?.startsWith(href);
  };

  const handleSignOut = async () => {
    // await signOut({ callbackUrl: '/' });
    console.log('Sign out clicked - disabled for serverless demo');
  };

  const filteredNavItems = navigationItems.filter(item => 
    !item.requiresAuth || (item.requiresAuth && isAuthenticated)
  );

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Don't show navigation on auth pages
  if (pathname?.startsWith('/auth/')) {
    return null;
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block sticky top-0 z-50">
        <div className="glass border-b border-white/20 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link 
                to={isAuthenticated ? '/dashboard' : '/'} 
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <Droplets className="w-8 h-8 text-blue-400 group-hover:text-blue-300 transition-all duration-300 glow-hover" />
                  <Sparkles className="w-4 h-4 text-blue-200 absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                </div>
                <span className="text-xl font-bold text-gradient">CleanWater</span>
              </Link>

              {/* Main Navigation */}
              {isAuthenticated && (
                <div className="flex items-center space-x-1">
                  {filteredNavItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`relative flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group ${
                        isActiveRoute(item.href)
                          ? 'bg-gradient-primary text-white shadow-lg glow'
                          : 'text-white/80 hover:text-white hover:bg-white/10 glow-hover'
                      }`}
                    >
                      <item.icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${
                        isActiveRoute(item.href) ? 'scale-110' : 'group-hover:scale-110'
                      }`} />
                      {item.name}
                      {isActiveRoute(item.href) && (
                        <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20 shimmer" />
                      )}
                    </Link>
                  ))}
                </div>
              )}

              {/* User Menu / Auth Buttons */}
              <div className="flex items-center space-x-4">
                {isLoading ? (
                  <div className="animate-pulse h-8 w-24 bg-white/20 rounded-lg shimmer"></div>
                ) : isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    {/* User menu items */}
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300 glow-hover"
                        title={item.name}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.badge && (
                          <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 text-xs p-0 flex items-center justify-center bg-gradient-secondary border-0 pulse-glow"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    ))}
                    
                    {/* User avatar and sign out */}
                    <div className="flex items-center space-x-2 pl-2 border-l border-white/20">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center glow">
                          <User className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm text-white/90 font-medium">
                          Demo User
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSignOut}
                        className="text-white/80 hover:text-white hover:bg-white/10 glow-hover transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link to="/ui-demo">
                      <Button 
                        variant="ghost" 
                        className="text-white/80 hover:text-white hover:bg-white/10 glow-hover transition-all duration-300"
                      >
                        UI Demo
                      </Button>
                    </Link>
                    <Button className="btn-magical">
                      Experience Magic ✨
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden sticky top-0 z-50">
        <div className="glass border-b border-white/20 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Mobile Logo */}
              <Link 
                to={isAuthenticated ? '/dashboard' : '/'} 
                className="flex items-center space-x-2 group"
              >
                <Droplets className="w-7 h-7 text-blue-400 group-hover:text-blue-300 transition-colors glow-hover" />
                <span className="text-lg font-bold text-gradient">CleanWater</span>
              </Link>

              {/* UI Demo Button for Mobile */}
              <div className="flex items-center space-x-2">
                <Link to="/ui-demo">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-white/80 hover:text-white hover:bg-white/10 glow-hover transition-all duration-300"
                  >
                    Demo ✨
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 