import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { CreditCard, Shield, CheckCircle, Sparkles, Lock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { authUtils } from '@/utils/auth';
import { showSuccess, showError } from '@/utils/toast';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isYearly, setIsYearly] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get user data from signup
  const signupData = location.state?.signupData;
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: '1234 5678 9012 3456',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe',
    billingZip: '12345',
  });

  // Redirect if no signup data
  if (!signupData) {
    navigate('/signup');
    return null;
  }

  const monthlyPrice = 29;
  const yearlyPrice = 228;
  const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user account with membership through backend API
      const user = await authUtils.signup(signupData.email, signupData.password, signupData.name);
      
      if (user) {
        // Update user with membership type
        authUtils.updateUser({
          membershipType: isYearly ? 'yearly' : 'monthly'
        });
        
        showSuccess('Payment successful! Welcome to Next Cinema Playground! 🎉');
        navigate('/profile-builder');
      } else {
        throw new Error('Failed to create user account');
      }
    } catch (error) {
      console.error('Payment error:', error);
      showError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 text-3xl">
              <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
              <span>💳</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Membership
          </h1>
          <p className="text-lg text-gray-600">
            You're one step away from joining the community!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card className="rounded-3xl border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
                <CardTitle className="flex items-center text-xl">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Details
                </CardTitle>
                <CardDescription>Secure payment powered by Stripe</CardDescription>
              </CardHeader>
              
              <CardContent className="bg-white p-6">
                <form onSubmit={handlePayment} className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardholderName">Cardholder Name</Label>
                    <Input
                      id="cardholderName"
                      placeholder="John Doe"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="billingZip">Billing ZIP Code</Label>
                    <Input
                      id="billingZip"
                      placeholder="12345"
                      value={paymentData.billingZip}
                      onChange={(e) => handleInputChange('billingZip', e.target.value)}
                      required
                      className="mt-2"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 text-lg font-medium mt-6"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Complete Payment ${isYearly ? yearlyPrice : monthlyPrice}
                      </>
                    )}
                  </Button>
                </form>
                
                <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                  <Shield className="h-4 w-4 mr-1" />
                  Secured by 256-bit SSL encryption
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="rounded-3xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100">
                <CardTitle className="text-xl">Order Summary</CardTitle>
                <CardDescription>Welcome, {signupData.name}!</CardDescription>
              </CardHeader>
              
              <CardContent className="bg-white p-6">
                {/* Plan Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Billing Cycle</span>
                    {isYearly && (
                      <Badge className="bg-green-500 text-white">Save ${yearlySavings}!</Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span className={`font-medium ${!isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
                      Monthly
                    </span>
                    <Switch
                      checked={isYearly}
                      onCheckedChange={setIsYearly}
                      className="data-[state=checked]:bg-purple-600"
                    />
                    <span className={`font-medium ${isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
                      Yearly
                    </span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Next Cinema Playground</span>
                    <span>${isYearly ? yearlyPrice : monthlyPrice}</span>
                  </div>
                  
                  {isYearly && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Annual Savings</span>
                      <span>-${yearlySavings}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${isYearly ? yearlyPrice : monthlyPrice}</span>
                  </div>
                  
                  <div className="text-sm text-gray-500 text-center">
                    {isYearly ? 'Billed annually' : 'Billed monthly'} • Cancel anytime
                  </div>
                </div>

                <Separator className="my-6" />

                {/* What's Included */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3">What's Included:</h3>
                  <div className="space-y-2 text-sm">
                    {[
                      'Complete video learning library',
                      'AI-powered profile builder',
                      'Community feed and networking',
                      'Industry news with AI insights',
                      'Professional worksheets',
                      'Career guidance and recommendations'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎉</div>
                    <h4 className="font-bold text-purple-900 mb-1">30-Day Money-Back Guarantee</h4>
                    <p className="text-sm text-purple-700">
                      Not satisfied? Get a full refund within 30 days.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;