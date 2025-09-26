import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Heart, MessageCircle, Plus, Sparkles, Users, Upload, X, Play, Send, Trash2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Post } from '@/types';
import { communityApi, getMediaUrl } from '@/utils/api';
import { authUtils } from '@/utils/auth';
import { showError, showSuccess } from '@/utils/toast';

const Community = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedType, setSelectedType] = useState<'text' | 'monologue' | 'reel' | 'headshot' | 'resume'>('text');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{[postId: string]: string}>({});
  const [showComments, setShowComments] = useState<{[postId: string]: boolean}>({});
  const user = authUtils.getCurrentUser();

  // Load posts on component mount
  useEffect(() => {
    initializeAndLoadPosts();
  }, []);

  const initializeAndLoadPosts = async () => {
    try {
      setIsLoading(true);
      
      // Initialize auth if needed
      if (!authUtils.isAuthenticated()) {
        await authUtils.initializeAuth();
      }
      
      await loadPosts();
    } catch (error) {
      console.error('Error initializing:', error);
      showError('Failed to initialize');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPosts = async () => {
    try {
      const fetchedPosts = await communityApi.getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      showError('Failed to load posts');
    }
  };

  const postTypes = [
    { value: 'text', label: '💬 Text', emoji: '💬', requiresFile: false },
    { value: 'monologue', label: '🎭 Monologue', emoji: '🎭', requiresFile: true },
    { value: 'reel', label: '🎬 Reel', emoji: '🎬', requiresFile: true },
    { value: 'headshot', label: '📸 Headshot', emoji: '📸', requiresFile: true },
    { value: 'resume', label: '📄 Resume', emoji: '📄', requiresFile: true },
  ];

  // File size limits (in MB)
  const FILE_SIZE_LIMITS = {
    image: 4, // 4MB for images
    video: 50, // 50MB for videos
    document: 10, // 10MB for documents
  };

  const getFileType = (file: File) => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    return 'document';
  };

  const validateFile = (file: File) => {
    const fileType = getFileType(file);
    const fileSizeMB = file.size / (1024 * 1024);
    const limit = FILE_SIZE_LIMITS[fileType as keyof typeof FILE_SIZE_LIMITS];

    if (fileSizeMB > limit) {
      showError(`File size must be less than ${limit}MB`);
      return false;
    }

    // Validate file types
    const allowedTypes = {
      monologue: ['video/mp4', 'video/webm', 'video/quicktime'],
      headshot: ['image/jpeg', 'image/png', 'image/webp'],
      reel: ['video/mp4', 'video/webm', 'video/quicktime'],
      resume: ['application/pdf'],
    };

    if (selectedType !== 'text') {
      const allowed = allowedTypes[selectedType as keyof typeof allowedTypes];
      if (allowed && !allowed.includes(file.type)) {
        showError(`Invalid file type for ${selectedType}. Allowed: ${allowed.join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) {
      e.target.value = ''; // Clear the input
      return;
    }

    setUploadedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setFilePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    setFilePreview(null);
  };

  const handleLike = async (postId: string) => {
    try {
      const result = await communityApi.toggleLike(postId);
      
      // Update the post in the local state
      setPosts(prev => prev.map(post =>
        post.id === postId
          ? { ...post, likes_count: result.likes_count, is_liked: result.is_liked }
          : post
      ));
    } catch (error) {
      console.error('Error toggling like:', error);
      showError('Failed to update like');
    }
  };

  const handleComment = async (postId: string) => {
    const content = commentInputs[postId]?.trim();
    if (!content) {
      showError('Please enter a comment');
      return;
    }

    try {
      await communityApi.createComment(postId, content);
      
      // Clear comment input
      setCommentInputs(prev => ({ ...prev, [postId]: '' }));
      
      // Reload posts to get updated comments
      await loadPosts();
      
      showSuccess('Comment added successfully! 💬');
    } catch (error) {
      console.error('Error creating comment:', error);
      showError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await communityApi.deleteComment(commentId);
      
      // Reload posts to get updated comments
      await loadPosts();
      
      showSuccess('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showError('Failed to delete comment');
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await communityApi.deletePost(postId);
      
      // Remove the post from local state
      setPosts(prev => prev.filter(post => post.id !== postId));
      
      showSuccess('Post deleted successfully');
    } catch (error) {
      console.error('Error deleting post:', error);
      showError('Failed to delete post');
    }
  };

  const toggleComments = (postId: string) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleCommentInputChange = (postId: string, value: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: value }));
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() && !uploadedFile) {
      showError('Please add some content or upload a file');
      return;
    }

    const currentPostType = postTypes.find(type => type.value === selectedType);
    if (currentPostType?.requiresFile && !uploadedFile) {
      showError(`Please upload a file for ${selectedType} posts`);
      return;
    }

    setIsUploading(true);

    try {
      let mediaUrl = undefined;
      let mediaType = undefined;

      // Upload file if present
      if (uploadedFile) {
        const uploadResult = await communityApi.uploadFile(uploadedFile);
        mediaUrl = uploadResult.file_url;
        mediaType = uploadResult.media_type;
      }

      // Create post with uploaded media URL
      const postData = {
        content: newPost,
        type: selectedType,
        media_url: mediaUrl,
      };

      await communityApi.createPost(postData);
      
      // Reload posts to get the new post
      await loadPosts();
      
      setNewPost('');
      setUploadedFile(null);
      setFilePreview(null);
      showSuccess('Post shared successfully! 🎉');
    } catch (error) {
      console.error('Error creating post:', error);
      showError('Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getPostTypeEmoji = (type: string) => {
    const typeMap: { [key: string]: string } = {
      text: '💬',
      monologue: '🎭',
      reel: '🎬',
      headshot: '📸',
      resume: '📄',
    };
    return typeMap[type] || '💬';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const currentPostType = postTypes.find(type => type.value === selectedType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Compact Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center space-x-2 mb-3">
            <span className="text-2xl">👥</span>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Community Feed</h1>
            <span className="text-2xl">🎭</span>
          </div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Connect, share, and celebrate with fellow actors! ✨
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Create Post */}
          <div className="lg:col-span-1">
            <Card className="rounded-2xl border-2 border-purple-200">
              <CardHeader className="bg-gradient-to-r from-purple-100 to-pink-100 pb-3">
                <CardTitle className="text-lg font-bold flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Share Something
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-4">
                <div className="space-y-3">
                  {/* Post Type Selection */}
                  <div className="grid grid-cols-2 gap-1">
                    {postTypes.map((type) => (
                      <Button
                        key={type.value}
                        variant={selectedType === type.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setSelectedType(type.value as any);
                          // Clear file when switching to text only
                          if (!type.requiresFile) {
                            setUploadedFile(null);
                            setFilePreview(null);
                          }
                        }}
                        className="text-xs h-8"
                      >
                        {type.label}
                      </Button>
                    ))}
                  </div>
                  
                  <Textarea
                    placeholder={`Share your ${selectedType}...`}
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />

                  {/* File Upload Section */}
                  {currentPostType?.requiresFile && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Upload {
                          selectedType === 'headshot' ? 'Image' : 
                          selectedType === 'monologue' ? 'Video' :
                          selectedType === 'reel' ? 'Video' : 
                          'File'
                        }
                      </Label>
                      
                      {!uploadedFile ? (
                        <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 text-center">
                          <Upload className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                          <Input
                            type="file"
                            onChange={handleFileUpload}
                            accept={
                              selectedType === 'headshot' ? 'image/*' :
                              selectedType === 'monologue' ? 'video/*' :
                              selectedType === 'reel' ? 'video/*' :
                              selectedType === 'resume' ? '.pdf' : '*'
                            }
                            className="hidden"
                            id="file-upload"
                          />
                          <Label htmlFor="file-upload" className="cursor-pointer">
                            <div className="text-xs text-purple-600 hover:text-purple-800">
                              Click to upload
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              Max {
                                selectedType === 'monologue' || selectedType === 'reel' ? '50MB' :
                                selectedType === 'resume' ? '10MB' :
                                '4MB'
                              }
                            </div>
                          </Label>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* File Preview */}
                          <div className="border border-gray-200 rounded-lg p-2">
                            {selectedType === 'headshot' && filePreview && (
                              <img 
                                src={filePreview} 
                                alt="Preview" 
                                className="w-full h-32 object-cover rounded"
                              />
                            )}
                            {(selectedType === 'monologue' || selectedType === 'reel') && filePreview && (
                              <div className="relative">
                                <video 
                                  src={filePreview} 
                                  className="w-full h-32 object-cover rounded"
                                  controls={false}
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded">
                                  <Play className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            )}
                            {selectedType === 'resume' && (
                              <div className="flex items-center p-2">
                                <div className="text-2xl mr-2">📄</div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium truncate">{uploadedFile.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Remove File Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeFile}
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600 rounded-full"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleCreatePost}
                    disabled={(!newPost.trim() && !uploadedFile) || isUploading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-8 text-sm"
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>🚀 Share</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="rounded-2xl border border-gray-200">
                    <CardContent className="p-4">
                      <div className="animate-pulse">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                          </div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <Card className="rounded-2xl border-2 border-dashed border-purple-200">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-4">🎭</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet!</h3>
                  <p className="text-gray-600 mb-4">Be the first to share something with the community.</p>
                  <p className="text-sm text-gray-500">Share your headshots, reels, monologues, or just say hello!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="rounded-2xl border border-gray-200 hover:border-purple-200 transition-all duration-200">
                  <CardContent className="p-4">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <Link to={`/profile/${post.user_id}`}>
                        <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-purple-300 transition-all">
                          <AvatarImage src={post.author_headshot} alt={post.author_name} />
                          <AvatarFallback className="text-sm">{post.author_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <Link to={`/profile/${post.user_id}`}>
                            <h3 className="font-semibold text-gray-900 text-sm truncate hover:text-purple-600 cursor-pointer transition-colors">{post.author_name}</h3>
                          </Link>
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            {getPostTypeEmoji(post.type)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">{formatTimeAgo(post.created_at)}</p>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <p className="text-gray-800 mb-3 text-sm leading-relaxed">{post.content}</p>
                    
                    {/* Media */}
                    {post.media_url && (
                      <div className="mb-3 rounded-lg overflow-hidden">
                        {(post.type === 'headshot' || (post.media_url && post.media_url.match(/\.(jpg|jpeg|png|gif|webp)$/i))) && (
                          <img
                            src={getMediaUrl(post.media_url) || ''}
                            alt="Post media"
                            className="w-full h-48 object-cover"
                            loading="lazy"
                          />
                        )}
                        {((post.type === 'reel' || post.type === 'monologue') || (post.media_url && post.media_url.match(/\.(mp4|webm|mov|avi)$/i))) && (
                          <video
                            src={getMediaUrl(post.media_url) || ''}
                            controls
                            preload="metadata"
                            className="w-full h-48 object-cover"
                          />
                        )}
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLike(post.id)}
                          className={`h-8 px-2 text-xs ${post.is_liked ? 'text-pink-600' : 'text-gray-600 hover:text-pink-600'}`}
                        >
                          <Heart className={`h-3 w-3 mr-1 ${post.is_liked ? 'fill-current' : ''}`} />
                          {post.likes_count}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleComments(post.id)}
                          className="text-gray-600 hover:text-blue-600 h-8 px-2 text-xs"
                        >
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {post.comments.length}
                        </Button>
                      </div>
                      
                      {/* Delete Button - Only show for post author */}
                      {post.user_id === user?.id && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-gray-400 hover:text-red-600 h-8 px-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Post</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this post? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeletePost(post.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                    
                    {/* Comments Section */}
                    {showComments[post.id] && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        {/* Add Comment Input */}
                        <div className="flex items-center space-x-2 mb-3">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 flex space-x-2">
                            <Input
                              placeholder="Write a comment..."
                              value={commentInputs[post.id] || ''}
                              onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                              className="text-xs h-8"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  handleComment(post.id);
                                }
                              }}
                            />
                            <Button
                              size="sm"
                              onClick={() => handleComment(post.id)}
                              disabled={!commentInputs[post.id]?.trim()}
                              className="h-8 px-2"
                            >
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>

                        {/* Comments List */}
                        {post.comments.length > 0 && (
                          <div className="space-y-2">
                            {post.comments.map((comment) => (
                              <div key={comment.id} className="flex items-start space-x-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarImage src={getMediaUrl(comment.author_headshot) || ''} alt={comment.author_name} />
                                  <AvatarFallback className="text-xs">{comment.author_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-gray-50 rounded-lg p-2">
                                  <div className="flex items-center justify-between">
                                    <div className="font-medium text-xs text-gray-900">{comment.author_name}</div>
                                    {comment.user_id === user?.id && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="h-4 w-4 p-0 text-gray-400 hover:text-red-600"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-700 mt-1">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;