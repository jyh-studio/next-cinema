import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Download, FileText, Video, Camera, Users, Sparkles, Gift, Star } from 'lucide-react';
import Navigation from '@/components/Navigation';

const FreeGuides = () => {
  const freeResources = [
    {
      id: 1,
      title: 'How to Build an Acting Resume',
      description: 'Complete guide to creating a professional acting resume that gets noticed by casting directors.',
      type: 'PDF Guide',
      icon: FileText,
      color: 'bg-gradient-to-br from-blue-100 to-purple-100',
      iconColor: 'text-blue-600',
      downloadCount: '12.5K',
      rating: 4.9,
      pages: 15,
      features: [
        'Professional resume templates',
        'Industry formatting standards',
        'What to include (and what to avoid)',
        'Examples from working actors',
        'Tips for beginners with no experience'
      ]
    },
    {
      id: 2,
      title: 'Top 10 Free Self-Tape Tools',
      description: 'Essential apps, equipment, and techniques for creating professional self-tape auditions at home.',
      type: 'Resource List',
      icon: Video,
      color: 'bg-gradient-to-br from-green-100 to-teal-100',
      iconColor: 'text-green-600',
      downloadCount: '8.3K',
      rating: 4.8,
      pages: 12,
      features: [
        'Free and paid app recommendations',
        'Budget-friendly equipment setup',
        'Lighting and audio tips',
        'Background and framing guide',
        'File format and submission guidelines'
      ]
    },
    {
      id: 3,
      title: 'Headshot Preparation Checklist',
      description: 'Everything you need to know before your headshot session to get the best possible results.',
      type: 'Checklist',
      icon: Camera,
      color: 'bg-gradient-to-br from-pink-100 to-red-100',
      iconColor: 'text-pink-600',
      downloadCount: '15.2K',
      rating: 4.9,
      pages: 8,
      features: [
        'Pre-shoot preparation timeline',
        'Wardrobe selection guide',
        'Makeup and grooming tips',
        'What to bring to your session',
        'Questions to ask your photographer'
      ]
    },
    {
      id: 4,
      title: 'Beginner\'s Guide to Acting Technique',
      description: 'Introduction to fundamental acting methods and exercises you can practice at home.',
      type: 'Training Guide',
      icon: Users,
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      iconColor: 'text-yellow-600',
      downloadCount: '9.7K',
      rating: 4.7,
      pages: 20,
      features: [
        'Overview of major acting methods',
        'Basic exercises and warm-ups',
        'Emotional preparation techniques',
        'Character development basics',
        'Practice monologues included'
      ]
    }
  ];

  const bonusResources = [
    {
      title: '30-Day Acting Challenge',
      description: 'Daily exercises to improve your craft',
      type: 'Email Series'
    },
    {
      title: 'Industry Contact Templates',
      description: 'Professional email templates for agents and casting directors',
      type: 'Templates'
    },
    {
      title: 'Community Discord Access',
      description: 'Join our free community for networking and support',
      type: 'Community'
    }
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
                <Gift className="h-12 w-12 text-yellow-300 animate-pulse" />
                <Sparkles className="h-10 w-10 text-pink-300 animate-spin" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Free Acting Resources
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
              Get started on your acting journey with our collection of professional-grade guides, 
              templates, and resources—completely free! No strings attached.
            </p>
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold px-4 py-2 text-lg">
              Downloaded by 45,000+ Actors
            </Badge>
          </div>
        </div>
      </section>

      {/* Free Resources */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <div className="flex items-center space-x-2 text-4xl">
                <Star className="h-8 w-8 text-yellow-500 animate-pulse" />
                <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Professional Resources, Zero Cost
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              These are the same quality resources our members love, available to everyone.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {freeResources.map((resource) => (
              <Card key={resource.id} className="rounded-3xl border-2 border-transparent hover:border-purple-200 transition-all duration-300 transform hover:-translate-y-2 overflow-hidden shadow-lg hover:shadow-2xl">
                <CardHeader className={`${resource.color} pb-4`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                        <resource.icon className={`h-6 w-6 ${resource.iconColor}`} />
                      </div>
                      <div>
                        <Badge variant="secondary" className="mb-2 text-xs">
                          {resource.type}
                        </Badge>
                        <CardTitle className="text-lg font-bold leading-tight">{resource.title}</CardTitle>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="bg-white p-6">
                  <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                    {resource.description}
                  </CardDescription>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>{resource.downloadCount} downloads</span>
                      <span>⭐ {resource.rating}/5</span>
                      <span>{resource.pages} pages</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-2">What's Included:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {resource.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2 mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200">
                    <Download className="h-4 w-4 mr-2" />
                    🎁 Download Free
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bonus Resources */}
      <section className="py-20 bg-gradient-to-r from-purple-100 via-pink-100 to-blue-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Bonus Free Resources
            </h2>
            <p className="text-lg text-gray-600">
              Even more ways to jumpstart your acting career!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bonusResources.map((resource, index) => (
              <Card key={index} className="text-center rounded-3xl border-2 border-white bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <CardContent className="p-6">
                  <div className="text-3xl mb-3">🎁</div>
                  <h3 className="font-bold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                  <Badge variant="outline" className="mb-4">{resource.type}</Badge>
                  <Button variant="outline" size="sm" className="w-full rounded-full">
                    🚀 Get Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="rounded-3xl border-2 border-yellow-200 overflow-hidden bg-gradient-to-r from-yellow-50 to-orange-50 shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="flex items-center space-x-3 text-5xl">
                  <Sparkles className="h-10 w-10 text-purple-500 animate-spin" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Love These Resources?
              </h2>
              <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
                These free guides are just the beginning! Our members get access to 100+ premium resources, 
                AI-powered career guidance, and an amazing community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 font-bold">
                    🎯 Join now
                  </Button>
                </Link>
                <Link to="/what-we-offer">
                  <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm text-gray-900 border-2 border-purple-300 hover:bg-purple-50 text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200 font-bold">
                    See All Benefits
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-500 mt-4">Start with a free trial • Cancel anytime</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FreeGuides;