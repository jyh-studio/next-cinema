import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { showError } from '@/utils/toast';
import { Film, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      showError('Please agree to the terms and conditions');
      setIsLoading(false);
      return;
    }

    try {
      // For testing purposes, create account directly
      const { authUtils } = await import('@/utils/auth');
      const user = await authUtils.signup(formData.email, formData.password, formData.name);
      
      if (user) {
        // Show success message and navigate to community
        const { showSuccess } = await import('@/utils/toast');
        showSuccess('Account created successfully! Welcome to Next Cinema Playground! 🎉');
        navigate('/community');
      } else {
        showError('Failed to create account. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      showError('Something went wrong. Please try again!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
                  Join Next Cinema Playground
                </CardTitle>
                <CardDescription className="text-vintage-brown/60">
                  Create your account and start building your entertainment career
                </CardDescription>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-vintage-brown font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    placeholder="Your full name"
                    className="border-warm-beige focus:border-dusty-pink"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-vintage-brown font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
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
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    required
                    placeholder="••••••••"
                    minLength={8}
                    className="border-warm-beige focus:border-dusty-pink"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-vintage-brown font-medium">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    placeholder="••••••••"
                    className="border-warm-beige focus:border-dusty-pink"
                  />
                </div>
                
                <div className="flex items-start space-x-3 p-4 warm-beige rounded-xl">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-vintage-brown leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-dusty-pink hover:underline font-medium">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-dusty-pink hover:underline font-medium">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full dusty-pink text-white hover:opacity-90 py-3 text-base font-medium" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>
              
              <div className="text-center">
                <p className="text-sm text-vintage-brown/60">
                  Already have an account?{' '}
                  <Link to="/login" className="text-dusty-pink hover:underline font-medium">
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;