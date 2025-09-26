import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authUtils } from '@/utils/auth';
import { showSuccess, showError } from '@/utils/toast';
import { Film, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = await authUtils.login(email, password);
      if (user) {
        showSuccess('Welcome back!');
        
        // Navigate to community for members, profile for non-members
        if (user.isMember) {
          navigate('/community');
        } else {
          navigate('/profile');
        }
      } else {
        showError('Invalid credentials');
      }
    } catch (error) {
      showError('Login failed. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      <div className="flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="w-16 h-16 dusty-pink rounded-2xl flex items-center justify-center mx-auto">
                <Film className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold text-vintage-brown">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-vintage-brown/60">
                  Sign in to your Next Cinema Playground account
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-vintage-brown font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    className="border-warm-beige focus:border-dusty-pink"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-vintage-brown font-medium">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="border-warm-beige focus:border-dusty-pink"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full dusty-pink text-white hover:opacity-90 py-3 text-base font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
              
              <div className="text-center space-y-4">
                <p className="text-sm text-vintage-brown/60">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-dusty-pink hover:underline font-medium">
                    Join Next Cinema Playground
                  </Link>
                </p>
                
                <Link to="/forgot-password" className="text-sm text-vintage-brown/60 hover:text-vintage-brown block">
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;