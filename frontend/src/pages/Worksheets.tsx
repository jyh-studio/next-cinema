import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download, FileText, Video, Camera, User, Sparkles, Zap } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { worksheetApi } from '@/utils/api';
import { showSuccess, showError } from '@/utils/toast';

const Worksheets = () => {
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const worksheetCategories = [
    {
      id: 'resume',
      title: '📄 Resume Builder',
      description: 'Create a professional acting resume',
      icon: FileText,
      color: 'bg-gradient-to-br from-blue-100 to-purple-100',
      iconColor: 'text-blue-600',
      items: [
        { name: 'Personal information and contact details', fileId: 'personal-information' },
        { name: 'Training and education section', fileId: 'training-education' },
        { name: 'Stage experience listing', fileId: 'stage-experience' },
        { name: 'Film and TV credits', fileId: 'film-tv-credits' },
        { name: 'Special skills and abilities', fileId: 'special-skills' },
        { name: 'Professional references', fileId: 'professional-references' },
      ],
    },
    {
      id: 'headshots',
      title: '📸 Headshot Prep',
      description: 'Everything for a successful headshot session',
      icon: Camera,
      color: 'bg-gradient-to-br from-pink-100 to-red-100',
      iconColor: 'text-pink-600',
      items: [
        { name: 'Wardrobe selection checklist', fileId: 'wardrobe-selection' },
        { name: 'Makeup and grooming guidelines', fileId: 'makeup-grooming' },
        { name: 'Photographer research template', fileId: 'photographer-research' },
        { name: 'Shot list planning worksheet', fileId: 'shot-list-planning' },
        { name: 'Budget planning calculator', fileId: 'budget-planning' },
        { name: 'Post-session evaluation form', fileId: 'post-session-evaluation' },
      ],
    },
    {
      id: 'demo-reel',
      title: '🎬 Demo Reel Planning',
      description: 'Plan and create a compelling demo reel',
      icon: Video,
      color: 'bg-gradient-to-br from-green-100 to-teal-100',
      iconColor: 'text-green-600',
      items: [
        { name: 'Scene selection criteria', fileId: 'scene-selection' },
        { name: 'Reel structure template', fileId: 'reel-structure' },
        { name: 'Technical requirements checklist', fileId: 'technical-requirements' },
        { name: 'Editing timeline planner', fileId: 'editing-timeline' },
        { name: 'Music and sound guidelines', fileId: 'music-sound' },
        { name: 'Distribution strategy worksheet', fileId: 'distribution-strategy' },
      ],
    },
    {
      id: 'profile',
      title: '✨ Profile Optimization',
      description: 'Maximize your online presence',
      icon: User,
      color: 'bg-gradient-to-br from-yellow-100 to-orange-100',
      iconColor: 'text-yellow-600',
      items: [
        { name: 'Bio writing template', fileId: 'bio-writing' },
        { name: 'Social media audit checklist', fileId: 'social-media-audit' },
        { name: 'Professional photo inventory', fileId: 'professional-photo' },
        { name: 'Skills assessment worksheet', fileId: 'skills-assessment' },
        { name: 'Goal setting framework', fileId: 'goal-setting' },
        { name: 'Progress tracking dashboard', fileId: 'progress-tracking' },
      ],
    },
  ];

  const toggleComplete = (itemId: string) => {
    setCompletedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleDownload = async (categoryId: string, itemIndex: number) => {
    try {
      const category = worksheetCategories.find(c => c.id === categoryId);
      if (!category) return;
      
      // Use the fileId from the item object
      const item = category.items[itemIndex];
      const itemId = item.fileId;
      
      await worksheetApi.downloadWorksheet(categoryId, itemId);
      showSuccess('Worksheet downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      showError('Failed to download worksheet. Please try again.');
    }
  };

  const getCategoryProgress = (categoryId: string) => {
    const category = worksheetCategories.find(c => c.id === categoryId);
    if (!category) return 0;
    
    const categoryItems = category.items.map((_, index) => `${categoryId}-${index}`);
    const completedCategoryItems = categoryItems.filter(item => completedItems.includes(item));
    return Math.round((completedCategoryItems.length / categoryItems.length) * 100);
  };

  const overallProgress = Math.round(
    worksheetCategories.reduce((acc, category) => acc + getCategoryProgress(category.id), 0) / worksheetCategories.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <span className="text-2xl">📝</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Worksheets & Templates</h1>
            <span className="text-2xl">🛠️</span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Professional tools to advance your career ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Overall Progress */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 pb-3">
                <CardTitle className="text-lg font-bold">📊 Your Progress</CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-4">
                <div className="space-y-4">
                  <div className="text-center">
                    <span className="text-lg font-medium text-gray-700">Overall Progress</span>
                    <div className="text-2xl font-bold text-purple-600">{overallProgress}%</div>
                    <Progress value={overallProgress} className="h-2 mt-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-blue-600">{completedItems.length}</div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-green-600">
                        {worksheetCategories.reduce((acc, cat) => acc + cat.items.length, 0) - completedItems.length}
                      </div>
                      <div className="text-xs text-gray-600">Remaining</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-purple-600">
                        {worksheetCategories.filter(cat => getCategoryProgress(cat.id) === 100).length}
                      </div>
                      <div className="text-xs text-gray-600">Complete</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-orange-600">4</div>
                      <div className="text-xs text-gray-600">Categories</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Worksheet Categories */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {worksheetCategories.map((category) => {
                const progress = getCategoryProgress(category.id);
                
                return (
                  <Card key={category.id} className="rounded-2xl border border-gray-200 hover:border-purple-200 transition-all duration-200">
                    <CardHeader className={`${category.color} pb-3`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                            <category.icon className={`h-5 w-5 ${category.iconColor}`} />
                          </div>
                          <div>
                            <CardTitle className="text-lg font-bold">{category.title}</CardTitle>
                            <CardDescription className="text-xs text-gray-700">
                              {category.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge 
                          variant={progress === 100 ? "default" : "secondary"}
                          className={`${progress === 100 ? 'bg-green-500' : 'bg-gray-200'} text-white font-bold text-xs`}
                        >
                          {progress}%
                        </Badge>
                      </div>
                      <Progress value={progress} className="h-1 mt-2" />
                    </CardHeader>
                    
                    <CardContent className="bg-white p-4">
                      <div className="space-y-2">
                        {category.items.map((item, index) => {
                          const itemId = `${category.id}-${index}`;
                          const isCompleted = completedItems.includes(itemId);
                          
                          return (
                            <div 
                              key={index}
                              className={`flex items-center justify-between p-2 rounded-lg border transition-all duration-200 ${
                                isCompleted 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-gray-50 border-gray-200 hover:border-purple-200'
                              }`}
                            >
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => toggleComplete(itemId)}
                                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                                    isCompleted
                                      ? 'bg-green-500 border-green-500 text-white'
                                      : 'border-gray-300 hover:border-purple-400'
                                  }`}
                                >
                                  {isCompleted && <CheckCircle className="h-3 w-3" />}
                                </button>
                                <span className={`text-xs font-medium ${
                                  isCompleted ? 'text-green-800 line-through' : 'text-gray-700'
                                }`}>
                                  {item.name}
                                </span>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-purple-600 hover:text-purple-800 hover:bg-purple-50 h-6 px-2"
                                onClick={() => handleDownload(category.id, index)}
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="mt-4 pt-3 border-t border-gray-200">
                        <Button 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 text-xs"
                          disabled={progress !== 100}
                        >
                          {progress === 100 ? (
                            <>
                              <Download className="h-3 w-3 mr-1" />
                              🎉 Download Package
                            </>
                          ) : (
                            <>
                              🔒 Complete All Items
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Achievement Section */}
            {overallProgress === 100 && (
              <Card className="mt-6 rounded-2xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-3">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-gray-600 mb-4">
                    You've completed all worksheets! You're ready for success! ✨
                  </p>
                  <Button 
                    size="sm"
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black hover:from-yellow-300 hover:to-orange-300 px-6"
                  >
                    🎯 Share Achievement
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Worksheets;