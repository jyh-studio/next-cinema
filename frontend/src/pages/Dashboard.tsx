import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, TrendingUp, FileText, Video, Star, Sparkles, Heart } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { authUtils } from '@/utils/auth';

const Dashboard = () => {
  const user = authUtils.getCurrentUser();

  const quickActions = [
    {
      icon: BookOpen,
      title: '📚 Continue Learning',
      description: 'Pick up where you left off in your acting journey',
      href: '/learn',
      color: 'bg-gradient-to-br from-blue-100 to-purple-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: Users,
      title: '👥 Community Feed',
      description: 'See what fellow actors are sharing today',
      href: '/community',
      color: 'bg-gradient-to-br from-pink-100 to-red-100',
      iconColor: 'text-pink-600',
    },
    {
      icon: Star,
      title: '✨ Update Profile',
      description: 'Keep your actor profile fresh and discoverable',
      href: '/profile',
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      iconColor: 'text-yellow-600',
    },
    {
      icon: TrendingUp,
      title: '📰 Industry News',
      description: 'Stay updated with the latest casting calls and trends',
      href: '/news',
      color: 'bg-gradient-to-br from-green-100 to-teal-100',
      iconColor: 'text-green-600',
    },
    {
      icon: FileText,
      title: '📖 Read Magazines',
      description: 'Curated articles and career advice from industry pros',
      href: '/magazines',
      color: 'bg-gradient-to-br from-purple-100 to-indigo-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: Video,
      title: '📝 Use Worksheets',
      description: 'Professional templates to advance your career',
      href: '/worksheets',
      color: 'bg-gradient-to-br from-orange-100 to-red-100',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 text-4xl">
              <span>🎭</span>
              <Sparkles className="h-8 w-8 text-purple-500 animate-pulse" />
              <Heart className="h-8 w-8 text-pink-500 animate-pulse" />
              <span>🎬</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}! 🌟
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to take your acting career to the next level? Let's dive into your creative playground! 🚀
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
              <div className="text-sm text-gray-600">🎥 Videos Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-blue-100 to-green-100 border-2 border-blue-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">47</div>
              <div className="text-sm text-gray-600">👥 Community Connections</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">✨ Profile Completeness</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            What would you like to do today? 🎯
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.href}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-200 rounded-2xl overflow-hidden cursor-pointer">
                  <CardHeader className={`${action.color} pb-4`}>
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-md">
                      <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                    </div>
                    <CardTitle className="text-lg font-bold">{action.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="bg-white">
                    <CardDescription className="text-gray-600">
                      {action.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="rounded-3xl border-2 border-purple-200 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100">
            <CardTitle className="text-xl font-bold flex items-center">
              <span className="mr-2">🔥</span>
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <span className="text-2xl">🎬</span>
                <div>
                  <div className="font-medium text-gray-900">Completed "Self-Tape Best Practices"</div>
                  <div className="text-sm text-gray-500">2 hours ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <span className="text-2xl">👥</span>
                <div>
                  <div className="font-medium text-gray-900">Sarah Chen liked your demo reel</div>
                  <div className="text-sm text-gray-500">5 hours ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-xl">
                <span className="text-2xl">📰</span>
                <div>
                  <div className="font-medium text-gray-900">New casting call matches your profile</div>
                  <div className="text-sm text-gray-500">1 day ago</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;