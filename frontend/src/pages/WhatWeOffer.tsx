import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Star, Video, FileText, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import Navigation from '@/components/Navigation';

const WhatWeOffer = () => {
  const membershipFeatures = [
    {
      icon: BookOpen,
      title: 'Learn Section',
      description: 'Curated video library from industry professionals',
      color: 'sage-green',
      features: [
        'Foundations to Advanced courses',
        'Acting technique, auditions, reels, industry knowledge',
        'Progress tracking and completion certificates',
        'Resource libraries with tools and templates',
      ],
    },
    {
      icon: Star,
      title: 'AI-Powered Profiles',
      description: 'Professional profiles that get you discovered',
      color: 'dusty-pink',
      features: [
        'Guided profile builder with industry standards',
        'AI recommendations for lookalike actors',
        'Script and monologue suggestions',
        'Headshot styling guidance',
        'Shareable public URLs',
      ],
    },
    {
      icon: Users,
      title: 'Community Feed',
      description: 'Connect and collaborate with fellow creatives',
      color: 'mustard-yellow',
      features: [
        'Share reels, headshots, and monologues',
        'Get feedback from peers and mentors',
        'Follow other actors and filmmakers',
        'Organized by content type',
      ],
    },
    {
      icon: FileText,
      title: 'Articles & Resources',
      description: 'Curated industry insights and advice',
      color: 'muted-teal',
      features: [
        'AI-summarized articles from trusted sources',
        'Career development guides',
        'Industry best practices',
        'Book recommendations with affiliate links',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Industry News',
      description: 'Stay updated with industry trends',
      color: 'soft-coral',
      features: [
        'Real-time industry integration',
        'Casting call announcements',
        'Industry regulation updates',
        'AI-curated weekly insights',
      ],
    },
    {
      icon: Video,
      title: 'Worksheets & Templates',
      description: 'Professional tools for career development',
      color: 'pale-lavender',
      features: [
        'Interactive resume builder',
        'Demo reel planning templates',
        'Headshot preparation checklists',
        'Progress tracking dashboard',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <Navigation />
      
      {/* Hero Section */}
      <section className="dusty-pink text-white py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center space-y-8">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold">
              Everything You Need to Succeed
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Comprehensive resources, AI-powered tools, and a supportive community 
              to accelerate your entertainment career.
            </p>
          </div>
          
          <Link to="/signup">
            <Button size="lg" className="bg-white text-dusty-pink hover:bg-white/90 px-8 py-4 text-lg font-medium">
              Join now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Membership Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-vintage-brown">
              Membership Benefits
            </h2>
            <p className="text-xl text-vintage-brown/70 max-w-2xl mx-auto">
              Access all features with a single membership. No hidden fees, no per-course charges.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {membershipFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-vintage-brown">{feature.title}</CardTitle>
                  <CardDescription className="text-vintage-brown/60 font-medium">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm text-vintage-brown/70">
                        <CheckCircle className="h-4 w-4 text-dusty-pink mr-2 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className="py-20 warm-beige">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-vintage-brown">
              Affordable Professional Training
            </h2>
            <p className="text-xl text-vintage-brown/70">
              Get more value than traditional acting classes at a fraction of the cost.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-gray-300">
              <CardHeader className="text-center cream">
                <CardTitle className="text-2xl text-vintage-brown">Traditional Classes</CardTitle>
                <div className="text-4xl font-bold text-vintage-brown mt-4">$550+</div>
                <CardDescription className="text-lg text-vintage-brown/60">Per course, limited access</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center text-vintage-brown/60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  Single topic focus
                </div>
                <div className="flex items-center text-vintage-brown/60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  Fixed schedule
                </div>
                <div className="flex items-center text-vintage-brown/60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  Limited networking
                </div>
                <div className="flex items-center text-vintage-brown/60">
                  <div className="w-3 h-3 bg-gray-400 rounded-full mr-3"></div>
                  No ongoing support
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-dusty-pink relative shadow-xl">
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 dusty-pink text-white font-bold px-4 py-1">
                Best Value
              </Badge>
              <CardHeader className="text-center cream">
                <CardTitle className="text-2xl text-vintage-brown">Next Cinema Playground</CardTitle>
                <div className="text-4xl font-bold text-dusty-pink mt-4">$29/month</div>
                <CardDescription className="text-lg font-semibold text-vintage-brown/70">Unlimited access to everything!</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center text-vintage-brown font-medium">
                  <CheckCircle className="h-5 w-5 text-dusty-pink mr-3" />
                  Complete learning library
                </div>
                <div className="flex items-center text-vintage-brown font-medium">
                  <CheckCircle className="h-5 w-5 text-dusty-pink mr-3" />
                  Learn at your own pace
                </div>
                <div className="flex items-center text-vintage-brown font-medium">
                  <CheckCircle className="h-5 w-5 text-dusty-pink mr-3" />
                  Active community network
                </div>
                <div className="flex items-center text-vintage-brown font-medium">
                  <CheckCircle className="h-5 w-5 text-dusty-pink mr-3" />
                  AI-powered career guidance
                </div>
                <div className="flex items-center text-vintage-brown font-medium">
                  <CheckCircle className="h-5 w-5 text-dusty-pink mr-3" />
                  Professional profile tools
                </div>
                <div className="flex items-center text-vintage-brown font-medium">
                  <CheckCircle className="h-5 w-5 text-dusty-pink mr-3" />
                  Industry news & insights
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/signup">
              <Button size="lg" className="dusty-pink text-white hover:opacity-90 px-8 py-4 text-lg font-medium">
                Join now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-vintage-brown/60 mt-3 font-medium">Cancel anytime. No long-term commitment!</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="dusty-pink text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6 lg:px-8 space-y-8">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">
              Ready to Transform Your Career?
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of actors and filmmakers who are building successful careers with our platform.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-dusty-pink hover:bg-white/90 px-8 py-4 text-lg font-medium">
                🚀 Join now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/free-guides">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-dusty-pink px-8 py-4 text-lg font-medium">
                Try Free Resources First
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WhatWeOffer;