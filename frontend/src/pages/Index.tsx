import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Star, TrendingUp, Video, MessageCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Profile from './Profile';
import { authUtils } from '@/utils/auth';

const Index = () => {
  const navigate = useNavigate();
  const isAuthenticated = authUtils.isAuthenticated();
  const user = authUtils.getCurrentUser();

  // If user is logged in, show their profile page
  if (isAuthenticated && user) {
    return <Profile />;
  }

  // Otherwise show the marketing landing page
  const features = [
    {
      icon: BookOpen,
      title: 'Structured Learning',
      description: 'Curated video library from foundations to advanced techniques, organized by industry professionals.',
      color: 'bg-pink-100 text-pink-600',
    },
    {
      icon: Users,
      title: 'Community Network',
      description: 'Connect with fellow actors and filmmakers, share work, and get valuable feedback.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Star,
      title: 'AI-Powered Profiles',
      description: 'Create discoverable profiles with AI recommendations for roles, scripts, and career development.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: TrendingUp,
      title: 'Industry Insights',
      description: 'Stay updated with the latest news, trends, and opportunities in the entertainment industry.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: Video,
      title: 'Showcase Your Work',
      description: 'Upload reels, headshots, and monologues to build your professional portfolio.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: MessageCircle,
      title: 'Expert Guidance',
      description: 'Access worksheets, templates, and resources created by industry professionals.',
      color: 'bg-teal-100 text-teal-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-medium mb-6 leading-tight text-gray-900">
                  Your Gateway to the
                  <span className="block" style={{ color: '#80229b' }}>
                    Entertainment Industry
                  </span>
                </h1>
                <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-600">
                  Join an AI-powered community of actors and filmmakers. Learn, network, and grow your career 
                  with structured resources and personalized guidance.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="text-white text-lg px-8 py-4 rounded-md" style={{ backgroundColor: '#80229b' }}>
                    Join now
                  </Button>
                </Link>
                <Link to="/what-we-offer">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-md border-2" style={{ color: '#80229b', borderColor: '#80229b' }}>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-80 h-80 bg-pink-400 rounded-2xl p-6 shadow-xl mx-auto">
                <div className="h-full bg-white rounded-xl p-6 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-400 rounded-xl mx-auto flex items-center justify-center">
                      <Video className="h-8 w-8 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-medium text-gray-900">10,000+</h3>
                      <p className="text-gray-600">Actors Growing Their Careers</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-xl shadow-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-teal-400 rounded-xl shadow-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From structured learning to community support, we provide the tools and connections 
              to accelerate your entertainment career.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-lg">
                <CardHeader className="pb-4">
                  <div className={`mx-auto w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mb-4`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-xl font-medium">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
                Affordable Alternative to Traditional Classes
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Skip the $550+ introductory acting classes. Get structured, professional-grade training 
                and community support for a fraction of the cost.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Professional-quality curated content</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5" style={{ backgroundColor: '#80229b' }}>
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">AI-powered personalized recommendations</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Active community of peers and mentors</span>
                </li>
                <li className="flex items-start">
                  <div className="w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <span className="text-gray-700">Professional profile and portfolio tools</span>
                </li>
              </ul>
              <Link to="/signup">
                <Button size="lg" className="text-white px-8 py-4 rounded-md" style={{ backgroundColor: '#80229b' }}>
                  Join now
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-200">
              <div className="text-center">
                <div className="text-4xl font-medium mb-2" style={{ color: '#80229b' }}>$29/month</div>
                <div className="text-gray-600 mb-6 text-lg">vs. $550+ for traditional classes</div>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-medium text-xl mb-4 text-gray-800">What's Included:</h3>
                  <ul className="text-left space-y-3 text-gray-700">
                    <li className="flex items-center"><span className="mr-2">📚</span> Complete video learning library</li>
                    <li className="flex items-center"><span className="mr-2">🤖</span> AI-powered profile builder</li>
                    <li className="flex items-center"><span className="mr-2">👥</span> Community feed and networking</li>
                    <li className="flex items-center"><span className="mr-2">📰</span> Industry news and insights</li>
                    <li className="flex items-center"><span className="mr-2">📝</span> Professional worksheets and templates</li>
                    <li className="flex items-center"><span className="mr-2">∞</span> Unlimited access to all content</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-white py-16" style={{ backgroundColor: '#e86a06' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">
            Ready to Launch Your Career?
          </h2>
          <p className="text-xl mb-8">
            Join thousands of actors and filmmakers who are building their careers with Next Cinema Playground.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-lg px-8 py-4 rounded-md" style={{ color: '#e86a06' }}>
                Join now
              </Button>
            </Link>
            <Link to="/free-guides">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-white hover:bg-white text-lg px-8 py-4 rounded-md" style={{ '--hover-color': '#e86a06' } as React.CSSProperties}>
                Try Free Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;