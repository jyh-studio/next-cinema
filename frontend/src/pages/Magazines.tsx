import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, BookOpen, Sparkles, Star, Brain } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockArticles } from '@/utils/mockData';

const Magazines = () => {
  const categories = ['Career Development', 'Industry Knowledge', 'Acting Technique', 'Business Skills'];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <span className="text-2xl">📖</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Articles & Magazines</h1>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Curated industry insights with AI summaries 📚
          </p>
        </div>

        {/* Compact Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Badge 
              key={category} 
              variant="outline" 
              className="px-3 py-1 text-xs border-purple-200 hover:bg-purple-50 cursor-pointer"
            >
              {category}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Featured & Books */}
          <div className="lg:col-span-1 space-y-6">
            {/* Featured Article */}
            <Card className="rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 pb-3">
                <div className="flex items-center space-x-1 mb-1">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <Badge className="bg-yellow-600 text-white text-xs">Featured</Badge>
                </div>
                <CardTitle className="text-sm font-bold text-gray-900 line-clamp-2">
                  Complete Guide to Building Your Acting Career in 2024
                </CardTitle>
                <CardDescription className="text-xs text-gray-700">
                  The Hollywood Reporter
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white p-4">
                <p className="text-xs text-gray-600 mb-3 line-clamp-3">
                  A comprehensive roadmap for aspiring actors navigating the modern entertainment industry.
                </p>
                
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border border-purple-200 mb-3">
                  <div className="flex items-start space-x-2">
                    <Brain className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-purple-900 text-xs mb-1">🤖 AI Summary</h4>
                      <p className="text-purple-800 text-xs line-clamp-2">
                        Focus on authentic self-tapes, build genuine relationships, maintain consistent training.
                      </p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-7 text-xs"
                  onClick={() => window.open('#', '_blank')}
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Read Article
                </Button>
              </CardContent>
            </Card>

            {/* Book Recommendations */}
            <Card className="rounded-2xl border-2 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100 pb-3">
                <CardTitle className="text-sm font-bold flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-green-600" />
                  📚 Recommended Books
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-4">
                <div className="space-y-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl mb-1">📖</div>
                    <h3 className="font-bold text-xs text-gray-900 mb-1">"The Actor's Life"</h3>
                    <p className="text-xs text-gray-600 mb-2">by Jenna Fischer</p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      View on Amazon
                    </Button>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl mb-1">🎭</div>
                    <h3 className="font-bold text-xs text-gray-900 mb-1">"Respect for Acting"</h3>
                    <p className="text-xs text-gray-600 mb-2">by Uta Hagen</p>
                    <Button size="sm" variant="outline" className="h-6 text-xs">
                      View on Amazon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Articles Grid */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-bold text-gray-900 mb-6">📚 Latest Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockArticles.map((article) => (
                <Card key={article.id} className="rounded-2xl border border-gray-200 hover:border-purple-200 transition-all duration-200 h-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {article.source}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {article.category}
                          </Badge>
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
                      </div>
                      
                      <h3 className="font-bold text-sm leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {article.summary}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                          <div className="flex items-start space-x-2">
                            <Brain className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-green-900 text-xs mb-1">🤖 AI Summary</h4>
                              <p className="text-green-800 text-xs line-clamp-2">
                                Actionable advice for {article.category.toLowerCase()}, essential for all career stages.
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="bg-purple-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-purple-600">8</div>
                            <div className="text-xs text-purple-700">min read</div>
                          </div>
                          <div className="bg-pink-50 rounded-lg p-2 text-center">
                            <div className="text-lg font-bold text-pink-600">4.8</div>
                            <div className="text-xs text-pink-700">rating</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-purple-600 h-6 px-2 text-xs"
                          >
                            ❤️ Helpful
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-blue-600 h-6 px-2 text-xs"
                          >
                            🔖 Save
                          </Button>
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-xs border-purple-200 hover:bg-purple-50"
                          onClick={() => window.open(article.fullUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Read
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Magazines;