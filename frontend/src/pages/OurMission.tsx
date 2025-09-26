import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Heart, Users, Sparkles, Target, Globe, Star, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';

const OurMission = () => {
  const values = [
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Making professional acting training accessible to everyone, regardless of background or budget.',
      color: 'bg-gradient-to-br from-red-100 to-pink-100',
      iconColor: 'text-red-600',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive network where actors lift each other up and celebrate successes together.',
      color: 'bg-gradient-to-br from-blue-100 to-purple-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Curating only the highest quality content and resources from industry professionals.',
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Using AI and technology to personalize the learning experience and accelerate career growth.',
      color: 'bg-gradient-to-br from-green-100 to-teal-100',
      iconColor: 'text-green-600',
    },
  ];

  const impact = [
    { number: '10,000+', label: 'Aspiring Actors Supported' },
    { number: '500+', label: 'Success Stories' },
    { number: '95%', label: 'Member Satisfaction' },
    { number: '50+', label: 'Industry Partners' },
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
        
        <div className="relative bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Mission: Democratizing Acting Education
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              We believe every passionate actor deserves access to professional training, supportive community, 
              and the tools to build a successful career—regardless of their background or budget.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="rounded-3xl border-2 border-purple-200 overflow-hidden shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 text-center">
              <div className="flex justify-center mb-4">
                <Globe className="h-12 w-12 text-purple-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Our Vision</CardTitle>
            </CardHeader>
            <CardContent className="bg-white p-8">
              <div className="text-center space-y-6">
                <p className="text-xl text-gray-700 leading-relaxed">
                  <strong>To create a world where talent and passion matter more than connections or wealth.</strong>
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We're building the largest, most supportive online community for actors and filmmakers, 
                  where AI-powered personalization meets human connection, and where every member has the 
                  tools and support they need to turn their dreams into reality.
                </p>
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 border-2 border-yellow-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">The Next Cinema Playground Promise</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Every actor who joins our community will have access to the same quality of training, 
                    networking opportunities, and career guidance that was once only available to those 
                    who could afford expensive classes or had industry connections. We're leveling the playing field.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do and every decision we make.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="rounded-3xl border-2 border-transparent hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden shadow-lg">
                <CardHeader className={`${value.color} pb-4`}>
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <value.icon className={`h-8 w-8 ${value.iconColor}`} />
                  </div>
                  <CardTitle className="text-xl font-bold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent className="bg-white">
                  <CardDescription className="text-gray-600 leading-relaxed text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem We're Solving */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  The Problem We're Solving
                </h2>
              </div>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  <strong>Traditional acting education is broken:</strong>
                </p>
                <ul className="space-y-3 ml-6">
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Average acting class costs $550+ per course
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Limited to specific locations and schedules
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    No ongoing community or career support
                  </li>
                  <li className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    Success depends on who you know, not what you know
                  </li>
                </ul>
                <p className="font-medium text-purple-600">
                  We're changing all of that!
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-2xl border-4 border-gradient-to-r from-purple-200 to-pink-200">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-12 w-12 text-yellow-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Solution</h3>
                <div className="space-y-4 text-left">
                  <div className="flex items-center p-3 bg-green-50 rounded-xl">
                    <span className="text-green-500 mr-3">✓</span>
                    <span className="text-gray-700">Affordable monthly membership ($29 vs $550+)</span>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-xl">
                    <span className="text-blue-500 mr-3">✓</span>
                    <span className="text-gray-700">Learn anywhere, anytime, at your own pace</span>
                  </div>
                  <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                    <span className="text-purple-500 mr-3">✓</span>
                    <span className="text-gray-700">Ongoing community support and networking</span>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-xl">
                    <span className="text-pink-500 mr-3">✓</span>
                    <span className="text-gray-700">AI-powered career guidance and opportunities</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Growing Impact
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Together, we're building something amazing! Here's what we've accomplished so far.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {impact.map((stat, index) => (
              <Card key={index} className="text-center rounded-3xl border-2 border-white bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-3xl font-bold text-purple-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"></div>
        <div className="relative text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl mb-8">
              Be part of the movement that's democratizing acting education and building the future of entertainment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 font-bold">
                  🎯 Join now
                </Button>
              </Link>
              <Link to="/what-we-offer">
                <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-white border-2 border-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 font-bold">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default OurMission;