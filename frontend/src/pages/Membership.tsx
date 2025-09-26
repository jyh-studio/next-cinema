import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CheckCircle, Sparkles, Star, Crown, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { authUtils } from '@/utils/auth';
import { showSuccess } from '@/utils/toast';

const Membership = () => {
  const [isYearly, setIsYearly] = useState(false);
  const navigate = useNavigate();

  const handleSubscribe = (plan: 'monthly' | 'yearly') => {
    // Update user membership status
    authUtils.updateUser({ 
      isMember: true, 
      membershipType: plan 
    });
    
    showSuccess(`Welcome to Next Cinema Playground! 🎉 Let's build your profile!`);
    navigate('/profile-builder');
  };

  const features = [
    '📚 Complete video learning library (100+ videos)',
    '🤖 AI-powered profile builder and recommendations',
    '👥 Community feed and networking',
    '📰 Industry news with AI insights',
    '📖 Curated articles and magazines',
    '📝 Professional worksheets and templates',
    '🎭 Actor lookalike recommendations',
    '📝 Script and monologue suggestions',
    '📸 Headshot styling guidance',
    '🎯 Personalized career advice',
    '🔗 Shareable professional profile',
    '⚡ Priority community support',
  ];

  const comparisonFeatures = [
    { feature: 'Video Learning Library', free: '❌', member: '✅ 100+ Videos' },
    { feature: 'AI Profile Builder', free: '❌', member: '✅ Full Access' },
    { feature: 'Community Feed', free: '❌', member: '✅ Unlimited' },
    { feature: 'Industry News', free: '❌', member: '✅ With AI Insights' },
    { feature: 'Professional Worksheets', free: '❌', member: '✅ All Templates' },
    { feature: 'Career Guidance', free: '❌', member: '✅ AI-Powered' },
    { feature: 'Free Resources', free: '✅ 4 Guides', member: '✅ Everything' },
    { feature: 'Community Support', free: '❌', member: '✅ Priority' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-300 to-green-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 text-5xl">
                <span>👑</span>
                <Sparkles className="h-10 w-10 text-yellow-300 animate-spin" />
                <Crown className="h-10 w-10 text-yellow-300 animate-pulse" />
                <span>✨</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Next Cinema Playground! 🎪
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Unlock your full potential with professional training, AI-powered guidance, 
              and a supportive community—all for less than the cost of a single acting class! 🚀
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Toggle */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <span className={`font-medium ${!isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
                💳 Monthly
              </span>
              <Switch
                checked={isYearly}
                onCheckedChange={setIsYearly}
                className="data-[state=checked]:bg-purple-600"
              />
              <span className={`font-medium ${isYearly ? 'text-purple-600' : 'text-gray-500'}`}>
                💰 Yearly
              </span>
              {isYearly && (
                <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold">
                  💸 Save 33%!
                </Badge>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className={`rounded-3xl border-2 overflow-hidden shadow-xl transition-all duration-300 ${
              !isYearly ? 'border-purple-500 transform scale-105' : 'border-gray-200'
            }`}>
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 text-center">
                <div className="text-3xl mb-2">🎭</div>
                <CardTitle className="text-2xl">Monthly Membership</CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Perfect for getting started
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-purple-600">$29</div>
                  <div className="text-gray-600">/month</div>
                </div>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <Button 
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full py-3 shadow-lg transform hover:scale-105 transition-all duration-200 font-bold mb-6"
                >
                  🚀 Start Monthly Plan
                </Button>
                <div className="text-center text-sm text-gray-500">
                  ✨ Cancel anytime • No long-term commitment
                </div>
              </CardContent>
            </Card>

            {/* Yearly Plan */}
            <Card className={`rounded-3xl border-2 overflow-hidden shadow-xl transition-all duration-300 relative ${
              isYearly ? 'border-purple-500 transform scale-105' : 'border-gray-200'
            }`}>
              {isYearly && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-1 rounded-full shadow-lg z-10">
                  🏆 Best Value
                </Badge>
              )}
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 text-center">
                <div className="text-3xl mb-2">👑</div>
                <CardTitle className="text-2xl">Yearly Membership</CardTitle>
                <CardDescription className="text-gray-600 font-medium">
                  Save $116 per year!
                </CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-orange-600">$19</div>
                  <div className="text-gray-600">/month</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Billed annually at $228
                  </div>
                  <div className="text-sm text-green-600 font-bold">
                    💸 Save $116 vs monthly!
                  </div>
                </div>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <Button 
                  onClick={() => handleSubscribe('yearly')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black rounded-full py-3 shadow-lg transform hover:scale-105 transition-all duration-200 font-bold mb-6"
                >
                  👑 Start Yearly Plan
                </Button>
                <div className="text-center text-sm text-gray-500">
                  ✨ 30-day money-back guarantee
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features List */}
      <section className="py-20 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 text-4xl">
                <Star className="h-8 w-8 text-yellow-500 animate-pulse" />
                <span>🎁</span>
                <Zap className="h-8 w-8 text-purple-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Get! 🌟
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Unlock your full potential with these amazing features and resources! ✨
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free vs. Membership 📊
            </h2>
            <p className="text-lg text-gray-600">
              See exactly what you get with a membership!
            </p>
          </div>
          
          <Card className="rounded-3xl border-2 border-purple-200 overflow-hidden shadow-xl">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-purple-100 to-pink-100">
                    <tr>
                      <th className="text-left p-6 font-bold text-gray-900">Feature</th>
                      <th className="text-center p-6 font-bold text-gray-900">🆓 Free</th>
                      <th className="text-center p-6 font-bold text-purple-600">👑 Member</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {comparisonFeatures.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-4 font-medium text-gray-900">{item.feature}</td>
                        <td className="p-4 text-center">{item.free}</td>
                        <td className="p-4 text-center font-medium text-purple-600">{item.member}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        <div className="relative text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-3 text-5xl">
                <span>🎭</span>
                <Sparkles className="h-10 w-10 text-yellow-300 animate-spin" />
                <span>🌟</span>
                <Sparkles className="h-10 w-10 text-pink-300 animate-spin" />
                <span>🎬</span>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Career? 🚀
            </h2>
            <p className="text-xl mb-8">
              Join thousands of actors who are building successful careers with Next Cinema Playground! ✨
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleSubscribe(isYearly ? 'yearly' : 'monthly')}
                size="lg" 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 font-bold"
              >
                🎯 Start Your Journey
              </Button>
            </div>
            <p className="text-sm mt-4 opacity-90">✨ 30-day money-back guarantee • Cancel anytime</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Membership;