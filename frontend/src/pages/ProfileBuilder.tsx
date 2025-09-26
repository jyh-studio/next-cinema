import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Upload, Sparkles, User, Camera, GraduationCap, Heart, Star } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { authUtils } from '@/utils/auth';
import { showSuccess, showError } from '@/utils/toast';
import { Profile } from '@/types';

const ProfileBuilder = () => {
  const navigate = useNavigate();
  const user = authUtils.getCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [profileData, setProfileData] = useState<Partial<Profile>>({
    userId: user?.id || '',
    name: user?.name || '',
    pronouns: '',
    ageRange: '',
    location: '',
    willingToRelocate: false,
    height: '',
    build: '',
    eyeColor: '',
    hairColor: '',
    ethnicity: '',
    actingSchools: [],
    workshops: [],
    coaches: [],
    stageExperience: false,
    filmExperience: false,
    specialSkills: [],
    unionStatus: '',
    preferredGenres: [],
    careerGoals: '',
    headshots: [],
    resume: '',
    demoReel: '',
    socialLinks: [],
    bio: '',
    tagline: '',
    isPublic: true,
  });

  const updateProfileData = (field: string, value: any) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: string, value: string) => {
    if (!value.trim()) return;
    setProfileData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof Profile] as string[] || []), value.trim()]
    }));
  };

  const removeFromArray = (field: string, index: number) => {
    setProfileData(prev => ({
      ...prev,
      [field]: (prev[field as keyof Profile] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Generate AI-powered bio and tagline
    const generatedBio = `${profileData.name} is a passionate ${profileData.ageRange?.replace('-', ' to ')} year old actor based in ${profileData.location}. With training from ${profileData.actingSchools?.join(', ') || 'various institutions'} and experience in ${profileData.stageExperience && profileData.filmExperience ? 'both stage and screen' : profileData.stageExperience ? 'theater' : 'film and television'}, they bring ${profileData.specialSkills?.length ? `special skills including ${profileData.specialSkills.slice(0, 3).join(', ')}` : 'dedication and authenticity'} to every role.`;
    
    const generatedTagline = profileData.careerGoals?.split('.')[0] || 'Bringing authenticity and passion to every performance';

    const completeProfile: Profile = {
      ...profileData as Profile,
      id: Date.now().toString(),
      bio: generatedBio,
      tagline: generatedTagline,
      profileUrl: profileData.name?.toLowerCase().replace(/\s+/g, '-') || 'actor-profile',
      completionPercentage: 95,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save profile to localStorage (in real app, this would be an API call)
    localStorage.setItem('user_profile', JSON.stringify(completeProfile));
    
    // Update user as having completed profile
    authUtils.updateUser({ profileCompleted: true });
    
    showSuccess('Profile created successfully! Welcome to the community! 🎉');
    navigate('/profile');
  };

  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    '👤 Basic Information',
    '🎭 Physical Profile', 
    '🎓 Training & Experience',
    '❤️ Interests & Goals',
    '📸 Media & Portfolio'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex items-center space-x-2 text-3xl">
              <span>✨</span>
              <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
              <span>🎭</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Build Your Actor Profile! 🌟
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Let's create your digital calling card for casting and collaboration!
          </p>
          
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Step {currentStep} of {totalSteps}</span>
              <span className="text-sm font-medium text-purple-600">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="mt-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                {stepTitles[currentStep - 1]}
              </Badge>
            </div>
          </div>
        </div>

        <Card className="rounded-3xl border-2 border-purple-200 overflow-hidden shadow-xl">
          <CardContent className="p-8">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <User className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-gray-900">👤 Tell Us About Yourself</h2>
                  <p className="text-gray-600">Basic information that casting directors need to know</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => updateProfileData('name', e.target.value)}
                      placeholder="Your professional name"
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pronouns">Pronouns</Label>
                    <Select value={profileData.pronouns} onValueChange={(value) => updateProfileData('pronouns', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select pronouns" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="she/her">she/her</SelectItem>
                        <SelectItem value="he/him">he/him</SelectItem>
                        <SelectItem value="they/them">they/them</SelectItem>
                        <SelectItem value="she/they">she/they</SelectItem>
                        <SelectItem value="he/they">he/they</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="ageRange">Age Range You Can Play *</Label>
                    <Select value={profileData.ageRange} onValueChange={(value) => updateProfileData('ageRange', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16-20">16-20</SelectItem>
                        <SelectItem value="18-25">18-25</SelectItem>
                        <SelectItem value="25-30">25-30</SelectItem>
                        <SelectItem value="30-35">30-35</SelectItem>
                        <SelectItem value="35-40">35-40</SelectItem>
                        <SelectItem value="40-50">40-50</SelectItem>
                        <SelectItem value="50-60">50-60</SelectItem>
                        <SelectItem value="60+">60+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => updateProfileData('location', e.target.value)}
                      placeholder="City, State/Province"
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="relocate"
                    checked={profileData.willingToRelocate}
                    onCheckedChange={(checked) => updateProfileData('willingToRelocate', checked)}
                  />
                  <Label htmlFor="relocate" className="text-sm">
                    I'm willing to travel/relocate for work 🌍
                  </Label>
                </div>
              </div>
            )}

            {/* Step 2: Physical Profile */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Camera className="h-12 w-12 text-pink-600 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-gray-900">🎭 Your Look</h2>
                  <p className="text-gray-600">Help casting directors visualize you for roles</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="height">Height</Label>
                    <Input
                      id="height"
                      value={profileData.height}
                      onChange={(e) => updateProfileData('height', e.target.value)}
                      placeholder="5'6&quot; or 168cm"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="build">Build</Label>
                    <Select value={profileData.build} onValueChange={(value) => updateProfileData('build', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select build" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Petite">Petite</SelectItem>
                        <SelectItem value="Slim">Slim</SelectItem>
                        <SelectItem value="Athletic">Athletic</SelectItem>
                        <SelectItem value="Average">Average</SelectItem>
                        <SelectItem value="Curvy">Curvy</SelectItem>
                        <SelectItem value="Plus Size">Plus Size</SelectItem>
                        <SelectItem value="Muscular">Muscular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="eyeColor">Eye Color</Label>
                    <Select value={profileData.eyeColor} onValueChange={(value) => updateProfileData('eyeColor', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select eye color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Blue">Blue</SelectItem>
                        <SelectItem value="Green">Green</SelectItem>
                        <SelectItem value="Hazel">Hazel</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="Amber">Amber</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="hairColor">Hair Color</Label>
                    <Select value={profileData.hairColor} onValueChange={(value) => updateProfileData('hairColor', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Brown">Brown</SelectItem>
                        <SelectItem value="Blonde">Blonde</SelectItem>
                        <SelectItem value="Red">Red</SelectItem>
                        <SelectItem value="Auburn">Auburn</SelectItem>
                        <SelectItem value="Gray">Gray</SelectItem>
                        <SelectItem value="White">White</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="ethnicity">Ethnicity/Cultural Background (Optional)</Label>
                    <Input
                      id="ethnicity"
                      value={profileData.ethnicity}
                      onChange={(e) => updateProfileData('ethnicity', e.target.value)}
                      placeholder="e.g., Asian American, Hispanic/Latino, etc."
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Training & Experience */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-gray-900">🎓 Your Training</h2>
                  <p className="text-gray-600">Show your dedication to the craft</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Acting Schools/Programs</Label>
                    <div className="mt-2 space-y-2">
                      {profileData.actingSchools?.map((school, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="secondary">{school}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('actingSchools', index)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Add acting school or program"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              addToArray('actingSchools', e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Workshops & Masterclasses</Label>
                    <div className="mt-2 space-y-2">
                      {profileData.workshops?.map((workshop, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="secondary">{workshop}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('workshops', index)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Input
                        placeholder="Add workshop (press Enter)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addToArray('workshops', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Special Skills</Label>
                    <div className="mt-2 space-y-2">
                      {profileData.specialSkills?.map((skill, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="secondary">{skill}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('specialSkills', index)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Input
                        placeholder="Add special skill (languages, instruments, sports, etc.)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addToArray('specialSkills', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="stage"
                        checked={profileData.stageExperience}
                        onCheckedChange={(checked) => updateProfileData('stageExperience', checked)}
                      />
                      <Label htmlFor="stage">Stage/Theater Experience 🎭</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="film"
                        checked={profileData.filmExperience}
                        onCheckedChange={(checked) => updateProfileData('filmExperience', checked)}
                      />
                      <Label htmlFor="film">Film/TV Experience 🎬</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="union">Union Status</Label>
                    <Select value={profileData.unionStatus} onValueChange={(value) => updateProfileData('unionStatus', value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select union status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Non-Union">Non-Union</SelectItem>
                        <SelectItem value="SAG-AFTRA">SAG-AFTRA</SelectItem>
                        <SelectItem value="SAG-AFTRA Eligible">SAG-AFTRA Eligible</SelectItem>
                        <SelectItem value="ACTRA">ACTRA (Canada)</SelectItem>
                        <SelectItem value="Equity">Equity (Theater)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Interests & Goals */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Heart className="h-12 w-12 text-red-600 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-gray-900">❤️ Your Passions</h2>
                  <p className="text-gray-600">What drives your artistic journey?</p>
                </div>

                <div>
                  <Label>Preferred Genres</Label>
                  <div className="mt-2 space-y-2">
                    {profileData.preferredGenres?.map((genre, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Badge variant="secondary">{genre}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('preferredGenres', index)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Input
                      placeholder="Add preferred genre (Drama, Comedy, Horror, etc.)"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addToArray('preferredGenres', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="goals">Career Goals & Aspirations</Label>
                  <Textarea
                    id="goals"
                    value={profileData.careerGoals}
                    onChange={(e) => updateProfileData('careerGoals', e.target.value)}
                    placeholder="Describe your career goals, dream roles, or what you hope to achieve as an actor..."
                    className="mt-2 min-h-[120px]"
                  />
                </div>
              </div>
            )}

            {/* Step 5: Media & Portfolio */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Star className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                  <h2 className="text-2xl font-bold text-gray-900">📸 Your Portfolio</h2>
                  <p className="text-gray-600">Showcase your professional materials</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Headshots *</Label>
                    <div className="mt-2 p-6 border-2 border-dashed border-purple-300 rounded-xl text-center">
                      <Upload className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Upload your professional headshots</p>
                      <Button variant="outline" size="sm">
                        📸 Choose Files
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Resume (PDF)</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <Upload className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                      <Button variant="outline" size="sm">
                        📄 Upload Resume
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Demo Reel (Optional)</Label>
                    <div className="mt-2 p-4 border-2 border-dashed border-gray-300 rounded-xl text-center">
                      <Upload className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                      <Button variant="outline" size="sm">
                        🎬 Upload Demo Reel
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>Social Media Links (Optional)</Label>
                    <div className="mt-2 space-y-2">
                      {profileData.socialLinks?.map((link, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <Badge variant="secondary">{link}</Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromArray('socialLinks', index)}
                          >
                            ✕
                          </Button>
                        </div>
                      ))}
                      <Input
                        placeholder="Add social media handle or website"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addToArray('socialLinks', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="public"
                      checked={profileData.isPublic}
                      onCheckedChange={(checked) => updateProfileData('isPublic', checked)}
                    />
                    <Label htmlFor="public" className="text-sm">
                      Make my profile public and discoverable 🌟
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="rounded-full"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                ⬅️ Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full"
                >
                  Next ➡️
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-full"
                >
                  🎉 Complete Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileBuilder;