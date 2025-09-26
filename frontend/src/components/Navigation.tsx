import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, User, LogOut, Film } from 'lucide-react';
import { authUtils } from '@/utils/auth';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/what-we-offer', label: 'What We Offer' },
    { href: '/our-mission', label: 'Our Mission' },
    { href: '/free-guides', label: 'Free Resources' },
  ];

  const memberLinks = [
    { href: '/learn', label: 'Learn' },
    { href: '/community', label: 'Community' },
    { href: '/news', label: 'News' },
    { href: '/magazines', label: 'Articles' },
    { href: '/worksheets', label: 'Worksheets' },
  ];

  const handleLogout = () => {
    authUtils.logout();
    navigate('/');
    setIsOpen(false);
  };

  const links = isAuthenticated && user?.isMember ? memberLinks : publicLinks;

  return (
    <nav className="border-b border-warm-beige bg-white/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 dusty-pink rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                <Film className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-vintage-brown">
                  Next Cinema Playground
                </h1>
                <p className="text-xs text-vintage-brown/60 -mt-1">Actor Community Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === link.href 
                    ? 'bg-cream text-vintage-brown' 
                    : 'text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-warm-beige">
                <Link to="/profile">
                  <Button variant="ghost" size="sm" className="text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50">
                    <User className="h-4 w-4 mr-2" />
                    {user?.name}
                  </Button>
                </Link>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout} 
                  className="text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-warm-beige">
                <Link to="/login">
                  <Button variant="ghost" className="text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="dusty-pink text-white hover:opacity-90 shadow-sm">
                    Join now
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-vintage-brown">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white border-warm-beige">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-warm-beige">
                    <div className="w-8 h-8 dusty-pink rounded-lg flex items-center justify-center">
                      <Film className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-vintage-brown">Next Cinema</h2>
                      <p className="text-xs text-vintage-brown/60">Playground</p>
                    </div>
                  </div>
                  
                  {links.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className="text-vintage-brown/70 hover:text-vintage-brown px-4 py-3 text-sm font-medium rounded-lg hover:bg-cream/50 transition-all duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  
                  {isAuthenticated ? (
                    <div className="pt-6 border-t border-warm-beige space-y-2">
                      <Link to="/profile" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50">
                          <User className="h-4 w-4 mr-2" />
                          {user?.name}
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50" 
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-warm-beige space-y-2">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full text-vintage-brown/70 hover:text-vintage-brown hover:bg-cream/50">
                          Login
                        </Button>
                      </Link>
                      <Link to="/signup" onClick={() => setIsOpen(false)}>
                        <Button className="w-full dusty-pink text-white hover:opacity-90">
                          Join now
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;