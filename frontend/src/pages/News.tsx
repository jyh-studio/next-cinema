import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, TrendingUp, Sparkles, Zap, Brain, RefreshCw } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { authUtils } from '@/utils/auth';

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
  image_url?: string;
  category: string;
  published_at: string;
  fetched_at: string;
  ai_insights?: string;
}

const News = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('nextcinema_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const response = await fetch('http://localhost:8001/api/v1/news', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setArticles(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const refreshNews = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('nextcinema_token');
      if (!token) {
        setError('Authentication required');
        return;
      }

      // First try to fetch new articles from external API
      const fetchResponse = await fetch('http://localhost:8001/api/v1/news/fetch', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (fetchResponse.ok) {
        // If successful, reload the articles
        await fetchNews();
      } else {
        // If fetch fails, just reload existing articles
        await fetchNews();
      }
    } catch (err) {
      console.error('Error refreshing news:', err);
      // Still try to reload existing articles
      await fetchNews();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading news articles...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchNews} className="bg-purple-600 hover:bg-purple-700">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <span className="text-2xl">📰</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Industry News</h1>
            <span className="text-2xl">⚡</span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Latest entertainment industry news with AI insights ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - AI Insights */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <CardHeader className="bg-gradient-to-r from-yellow-100 to-orange-100 pb-3">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Brain className="h-4 w-4 mr-2 text-orange-600" />
                  🧠 AI Insights
                </CardTitle>
                <CardDescription className="text-xs text-gray-700">
                  Top insights this week
                </CardDescription>
              </CardHeader>
              <CardContent className="bg-white p-4">
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h4 className="font-bold text-xs text-gray-900 mb-1">🎯 Self-Tape Quality</h4>
                    <p className="text-xs text-gray-600">73% of casting directors prefer high-quality self-tapes</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-bold text-xs text-gray-900 mb-1">🌍 Remote Opportunities</h4>
                    <p className="text-xs text-gray-600">40% more opportunities for remote-willing actors</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <h4 className="font-bold text-xs text-gray-900 mb-1">📱 Social Media Impact</h4>
                    <p className="text-xs text-gray-600">65% of casting directors check social profiles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - News Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">📢 Latest News</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  <Zap className="h-3 w-3 mr-1" />
                  {articles.length} Articles
                </Badge>
                <Button
                  onClick={refreshNews}
                  disabled={refreshing}
                  size="sm"
                  variant="outline"
                  className="border-purple-200 hover:bg-purple-50"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Refreshing...' : 'Refresh'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {articles.map((article) => (
                <Card key={article.id} className="rounded-2xl border border-gray-200 hover:border-purple-200 transition-all duration-200 h-full">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {article.source}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(article.published_at)}</span>
                      </div>
                      
                      <h3 className="font-bold text-sm leading-tight line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {article.summary}
                      </p>
                      
                      {article.ai_insights && (
                        <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                          <div className="flex items-start space-x-2">
                            <Brain className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <h4 className="font-bold text-purple-900 text-xs mb-1">🤖 AI Insight</h4>
                              <p className="text-purple-800 text-xs leading-relaxed line-clamp-2">{article.ai_insights}</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
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
                          onClick={() => window.open(article.url, '_blank')}
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

            {/* Load More */}
            {articles.length === 0 ? (
              <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">No news articles available yet.</p>
                <Button
                  onClick={refreshNews}
                  disabled={refreshing}
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
                  {refreshing ? 'Fetching News...' : '📰 Fetch Latest News'}
                </Button>
              </div>
            ) : (
              <div className="text-center mt-8">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6"
                  onClick={() => fetchNews()}
                >
                  📰 Load More News
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default News;