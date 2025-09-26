import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Clock, CheckCircle, Star, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { mockVideos } from '@/utils/mockData';

const Learn = () => {
  const [completedVideos, setCompletedVideos] = useState<string[]>(['1']);

  const toggleComplete = (videoId: string) => {
    setCompletedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  const videosByLevel = {
    foundations: mockVideos.filter(v => v.level === 'foundations'),
    intermediate: mockVideos.filter(v => v.level === 'intermediate'),
    advanced: mockVideos.filter(v => v.level === 'advanced'),
  };

  const VideoCard = ({ video }: { video: typeof mockVideos[0] }) => {
    const isCompleted = completedVideos.includes(video.id);
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200 border border-gray-200 hover:border-purple-200 rounded-xl overflow-hidden h-full">
        <div className="relative">
          <img 
            src={video.thumbnailUrl} 
            alt={video.title}
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
            <Button size="sm" className="bg-white text-black hover:bg-gray-100">
              <Play className="h-4 w-4 mr-1" />
              Watch
            </Button>
          </div>
          {isCompleted && (
            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
              <CheckCircle className="h-3 w-3" />
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-bold text-sm leading-tight line-clamp-2">{video.title}</h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="truncate">{video.source}</span>
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {video.duration}
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {video.category}
            </Badge>
            <p className="text-xs text-gray-600 line-clamp-2">{video.summary}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => toggleComplete(video.id)}
              className={`w-full h-7 text-xs ${isCompleted ? 'bg-green-100 text-green-700 border-green-300' : ''}`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Completed
                </>
              ) : (
                <>
                  <Star className="h-3 w-3 mr-1" />
                  Mark Complete
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <span className="text-2xl">📚</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Learning Library</h1>
            <span className="text-2xl">🎭</span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Curated content from industry professionals ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Progress */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 pb-3">
                <CardTitle className="text-lg font-bold">📊 Progress</CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{completedVideos.length}</div>
                    <div className="text-xs text-gray-600">Videos Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{mockVideos.length - completedVideos.length}</div>
                    <div className="text-xs text-gray-600">Remaining</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((completedVideos.length / mockVideos.length) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="foundations" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-white rounded-xl border border-purple-200">
                <TabsTrigger value="foundations" className="text-sm">🌱 Foundations</TabsTrigger>
                <TabsTrigger value="intermediate" className="text-sm">📈 Intermediate</TabsTrigger>
                <TabsTrigger value="advanced" className="text-sm">🚀 Advanced</TabsTrigger>
              </TabsList>
              
              <TabsContent value="foundations">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">🌱 Foundation Level</h2>
                  <p className="text-sm text-gray-600">Essential skills for beginners</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videosByLevel.foundations.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="intermediate">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">📈 Intermediate Level</h2>
                  <p className="text-sm text-gray-600">Refine your technique and expand your range</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videosByLevel.intermediate.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="advanced">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">🚀 Advanced Level</h2>
                  <p className="text-sm text-gray-600">Master-level content for serious actors</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {videosByLevel.advanced.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn;