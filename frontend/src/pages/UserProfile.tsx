import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Calendar, Award, Users, Brain, Sparkles, Star, Camera, FileText } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Profile } from '@/types';
import { authApi } from '@/utils/api';
import { showError } from '@/utils/toast';

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      loadUserProfile(userId);
    }
  }, [userId]);

  const loadUserProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const profileData = await authApi.getUserProfile(userId);
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      showError('Failed to load user profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">This user's profile could not be found or is not public.</p>
        </div>
      </div>
    );
  }

  // AI Recommendations based on profile data
  const getAIRecommendations = () => {
    const recommendations = {
      lookalikes: [
        { name: 'Emma Stone', reason: 'Similar age range and comedic timing potential' },
        { name: 'Zendaya', reason: 'Versatile performer with similar build and energy' },
        { name: 'Anya Taylor-Joy', reason: 'Distinctive features and dramatic range' },
      ],
      scripts: [
        { title: 'Contemporary Monologue: "Rabbit Hole"', reason: 'Matches your dramatic interests and age range' },
        { title: 'Classical Scene: "Romeo and Juliet"', reason: 'Great for showcasing range with your theater background' },
        { title: 'Comedy Piece: "The Marvelous Mrs. Maisel"', reason: 'Perfect for your comedic timing and energy' },
      ],
      headshots: [
        { tip: 'Natural lighting headshot', reason: 'Your eye color would pop beautifully in natural light' },
        { tip: 'Professional business casual look', reason: 'Perfect for your age range and versatile casting' },
        { tip: 'Character-driven shot', reason: 'Show your range with a more dramatic, storytelling headshot' },
      ],
      careerAdvice: [
        { advice: 'Focus on self-tape quality', reason: 'Your training shows you\'re ready for professional opportunities' },
        { advice: 'Network in your local theater scene', reason: 'Your stage experience is a valuable asset' },
        { advice: 'Consider commercial work', reason: 'Your look and skills are perfect for commercial casting' },
      ],
    };

    return recommendations;
  };

  const aiRecommendations = getAIRecommendations();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header - Clean Design */}
        <Card className="mb-8 rounded-3xl border-2 border-purple-200 overflow-hidden">
          <CardContent className="bg-white p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-6 mb-6">
              <Avatar className="h-32 w-32 border-4 border-purple-200 shadow-lg">
                <AvatarImage src={profile.headshots?.[0]} alt={profile.name} />
                <AvatarFallback className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                    <p className="text-lg text-purple-600 font-medium mb-2">{profile.tagline}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {profile.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Age Range: {profile.ageRange}
                      </div>
                      {profile.unionStatus && (
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-1" />
                          {profile.unionStatus}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-green-900">Profile Completeness</h3>
                  <p className="text-sm text-green-700">This profile is looking great! 🌟</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{profile.completionPercentage}%</div>
                  <div className="text-xs text-green-600">Complete</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-white rounded-2xl border-2 border-purple-200 p-1">
                <TabsTrigger value="about" className="rounded-xl">👤 About</TabsTrigger>
                <TabsTrigger value="experience" className="rounded-xl">🎓 Experience</TabsTrigger>
                <TabsTrigger value="media" className="rounded-xl">📸 Media</TabsTrigger>
                <TabsTrigger value="ai-insights" className="rounded-xl">🤖 AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="about">
                <Card className="rounded-3xl border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      About {profile.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Bio</h3>
                      <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Physical Profile</h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {profile.height && <div><span className="font-medium">Height:</span> {profile.height}</div>}
                        {profile.build && <div><span className="font-medium">Build:</span> {profile.build}</div>}
                        {profile.eyeColor && <div><span className="font-medium">Eyes:</span> {profile.eyeColor}</div>}
                        {profile.hairColor && <div><span className="font-medium">Hair:</span> {profile.hairColor}</div>}
                        {profile.ethnicity && <div className="col-span-2"><span className="font-medium">Ethnicity:</span> {profile.ethnicity}</div>}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">Preferred Genres</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.preferredGenres?.map((genre, index) => (
                          <Badge key={index} variant="secondary">{genre}</Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-2">Career Goals</h3>
                      <p className="text-gray-700 leading-relaxed">{profile.careerGoals}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience">
                <Card className="rounded-3xl border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Training & Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {profile.actingSchools && profile.actingSchools.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">🎓 Acting Schools</h3>
                        <div className="space-y-2">
                          {profile.actingSchools.map((school, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-xl">
                              {school}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.workshops && profile.workshops.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">🎭 Workshops & Masterclasses</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.workshops.map((workshop, index) => (
                            <Badge key={index} variant="outline">{workshop}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.specialSkills && profile.specialSkills.length > 0 && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">⭐ Special Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.specialSkills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">🎬 Experience</h3>
                      <div className="space-y-2">
                        {profile.stageExperience && (
                          <div className="flex items-center p-3 bg-purple-50 rounded-xl">
                            <span className="text-2xl mr-3">🎭</span>
                            <span>Stage/Theater Experience</span>
                          </div>
                        )}
                        {profile.filmExperience && (
                          <div className="flex items-center p-3 bg-pink-50 rounded-xl">
                            <span className="text-2xl mr-3">🎬</span>
                            <span>Film/TV Experience</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media">
                <Card className="rounded-3xl border-2 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="h-5 w-5 mr-2" />
                      Portfolio & Media
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-3">📸 Headshots</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {profile.headshots?.map((headshot, index) => (
                          <div key={index} className="aspect-square bg-gray-200 rounded-xl overflow-hidden">
                            <img src={headshot} alt={`Headshot ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {profile.resume && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">📄 Resume</h3>
                        <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                          <div className="flex items-center">
                            <FileText className="h-8 w-8 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium">Acting Resume.pdf</p>
                              <p className="text-sm text-gray-500">Last updated: {new Date(profile.updatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {profile.demoReel && (
                      <div>
                        <h3 className="font-bold text-gray-900 mb-3">🎬 Demo Reel</h3>
                        <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🎬</div>
                            <p className="font-medium">Demo Reel</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="ai-insights">
                <div className="space-y-6">
                  {/* Actor Lookalikes */}
                  <Card className="rounded-3xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Brain className="h-5 w-5 mr-2 text-orange-600" />
                        🤖 AI Actor Lookalikes
                      </CardTitle>
                      <CardDescription>Based on their physical profile and energy</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {aiRecommendations.lookalikes.map((actor, index) => (
                          <div key={index} className="p-4 bg-white rounded-xl border border-orange-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-gray-900">{actor.name}</h4>
                                <p className="text-sm text-gray-600">{actor.reason}</p>
                              </div>
                              <Star className="h-5 w-5 text-yellow-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Script Recommendations */}
                  <Card className="rounded-3xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-blue-600" />
                        📝 Recommended Scripts & Monologues
                      </CardTitle>
                      <CardDescription>Perfect matches for their profile and interests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {aiRecommendations.scripts.map((script, index) => (
                          <div key={index} className="p-4 bg-white rounded-xl border border-blue-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-gray-900">{script.title}</h4>
                                <p className="text-sm text-gray-600">{script.reason}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Headshot Guidance */}
                  <Card className="rounded-3xl border-2 border-pink-200 bg-gradient-to-r from-pink-50 to-red-50">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Camera className="h-5 w-5 mr-2 text-pink-600" />
                        📸 Headshot Styling Suggestions
                      </CardTitle>
                      <CardDescription>AI-powered recommendations for their next shoot</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {aiRecommendations.headshots.map((tip, index) => (
                          <div key={index} className="p-4 bg-white rounded-xl border border-pink-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-bold text-gray-900">{tip.tip}</h4>
                                <p className="text-sm text-gray-600">{tip.reason}</p>
                              </div>
                              <Sparkles className="h-5 w-5 text-pink-500" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="rounded-3xl border-2 border-green-200">
              <CardHeader>
                <CardTitle className="text-lg">📊 Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profile.completionPercentage}%</div>
                  <div className="text-sm text-gray-600">Profile Complete</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{profile.specialSkills?.length || 0}</div>
                  <div className="text-sm text-gray-600">Special Skills</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.preferredGenres?.length || 0}</div>
                  <div className="text-sm text-gray-600">Preferred Genres</div>
                </div>
              </CardContent>
            </Card>

            {/* Career Advice */}
            <Card className="rounded-3xl border-2 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Brain className="h-5 w-5 mr-2" />
                  🎯 AI Career Advice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {aiRecommendations.careerAdvice.map((advice, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-xl">
                      <h4 className="font-bold text-purple-900 text-sm">{advice.advice}</h4>
                      <p className="text-xs text-purple-700 mt-1">{advice.reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;