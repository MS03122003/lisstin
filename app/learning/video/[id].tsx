import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

// YouTube API Configuration
const YT_API_KEY = 'AIzaSyASNoXRjGc9Ok_UeiW5GZdlLTxclhhUve0';

const VideoScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showNotes, setShowNotes] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [hasRealTranscript, setHasRealTranscript] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const videoId = Array.isArray(id) ? id[0] : id;

  // Fetch video details from YouTube API
  const fetchVideoDetails = async (videoId: string) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics,contentDetails&id=${videoId}&key=${YT_API_KEY}`
      );
      const json = await response.json();
      
      if (json.items && json.items.length > 0) {
        const video = json.items[0];
        const snippet = video.snippet;
        const statistics = video.statistics;
        const contentDetails = video.contentDetails;

        // Try to fetch real transcript
        const transcript = await fetchVideoTranscript(videoId);
        const hasTranscript = transcript && transcript.length > 0;

        return {
          id: videoId,
          title: snippet.title,
          description: snippet.description,
          youtubeId: videoId,
          duration: formatDuration(contentDetails.duration),
          instructor: snippet.channelTitle,
          category: getCategoryFromTags(snippet.tags || []),
          difficulty: getDifficultyFromTitle(snippet.title),
          views: parseInt(statistics.viewCount || 0),
          likes: parseInt(statistics.likeCount || 0),
          publishedAt: snippet.publishedAt,
          thumbnail: snippet.thumbnails.high?.url || snippet.thumbnails.medium?.url,
          tags: snippet.tags || [],
          keyPoints: generateKeyPoints(snippet.description, snippet.title),
          transcript: hasTranscript ? transcript : null,
          notes: generateNotes(snippet.title, snippet.description),
          hasRealTranscript: hasTranscript,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  };

  // Fetch video transcript (YouTube doesn't provide direct transcript API, so we'll simulate checking)
  const fetchVideoTranscript = async (videoId: string) => {
    try {
      // Note: YouTube doesn't provide transcript in their public API
      // This is a placeholder for when transcript is available
      // In real implementation, you might use third-party services or manual transcripts
      
      // For now, we'll return null to indicate no real transcript available
      // You can integrate with services like Rev.ai, Assembly.ai, etc.
      return null;
    } catch (error) {
      console.error('Error fetching transcript:', error);
      return null;
    }
  };

  // Fetch related videos with proper thumbnail URLs
  const fetchRelatedVideos = async (videoTitle: string, channelId?: string) => {
    try {
      setIsLoadingRelated(true);
      
      // Create search query from video title keywords
      const searchQuery = extractKeywords(videoTitle) + ' personal finance';
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=8&q=${encodeURIComponent(searchQuery)}&type=video&videoCategoryId=26&key=${YT_API_KEY}`
      );
      const json = await response.json();
      
      if (json.items) {
        // Get video IDs for duration fetch
        const videoIds = json.items
          .filter(item => item.id.videoId !== videoId)
          .map(item => item.id.videoId)
          .slice(0, 6);

        // Fetch video details including duration
        const videosResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${YT_API_KEY}`
        );
        const videosJson = await videosResponse.json();

        const related = json.items
          .filter(item => item.id.videoId !== videoId)
          .slice(0, 6)
          .map((item, index) => {
            const videoDetails = videosJson.items?.find(v => v.id === item.id.videoId);
            const duration = videoDetails ? formatDuration(videoDetails.contentDetails.duration) : 'Unknown';
            
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              duration: duration,
              category: getCategoryFromTags(item.snippet.tags || []),
              thumbnail: item.snippet.thumbnails.high?.url || 
                        item.snippet.thumbnails.medium?.url || 
                        item.snippet.thumbnails.default?.url,
              channel: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
            };
          });
        
        setRelatedVideos(related);
      }
    } catch (error) {
      console.error('Error fetching related videos:', error);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  // Helper functions
  const formatDuration = (duration: string) => {
    // Convert ISO 8601 duration (PT15M30S) to readable format (15:30)
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return 'Unknown';
    
    const hours = parseInt(match[1]?.replace('H', '') || '0');
    const minutes = parseInt(match[2]?.replace('M', '') || '0');
    const seconds = parseInt(match[3]?.replace('S', '') || '0');
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getCategoryFromTags = (tags: string[]) => {
    const categoryKeywords = {
      budgeting: ['budget', 'budgeting', 'expense', 'spending'],
      investing: ['invest', 'investment', 'stock', 'market', 'portfolio'],
      saving: ['saving', 'save', 'emergency', 'fund'],
      basics: ['basic', 'beginner', 'introduction', 'guide', 'learn'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (tags.some(tag => keywords.some(keyword => tag.toLowerCase().includes(keyword)))) {
        return category;
      }
    }
    return 'basics';
  };

  const getDifficultyFromTitle = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('beginner') || lowerTitle.includes('basic') || lowerTitle.includes('introduction')) {
      return 'Beginner';
    }
    if (lowerTitle.includes('advanced') || lowerTitle.includes('expert')) {
      return 'Advanced';
    }
    return 'Intermediate';
  };

  const extractKeywords = (title: string) => {
    const keywords = title.split(' ').slice(0, 3).join(' ');
    return keywords;
  };

  const generateKeyPoints = (description: string, title: string) => {
    // Generate key points based on title and description
    const points = [];
    
    if (title.toLowerCase().includes('budget')) {
      points.push('Understanding budget fundamentals');
      points.push('Creating and maintaining a budget');
      points.push('Tracking expenses effectively');
    } else if (title.toLowerCase().includes('invest')) {
      points.push('Investment basics and strategies');
      points.push('Risk assessment and management');
      points.push('Building a diversified portfolio');
    } else if (title.toLowerCase().includes('save')) {
      points.push('Importance of emergency savings');
      points.push('Saving strategies and techniques');
      points.push('Setting and achieving financial goals');
    } else {
      // Generic financial education points
      points.push('Core financial concepts');
      points.push('Practical money management tips');
      points.push('Building financial literacy');
    }
    
    points.push('Real-world application examples');
    points.push('Action steps for implementation');
    
    return points;
  };

  const generateNotes = (title: string, description: string) => {
    const shortDesc = description && description.length > 100 ? description.substring(0, 100) + '...' : description || 'Financial education content';
    return `💡 Key Takeaway from "${title}": ${shortDesc} Remember to apply these concepts in your daily financial decisions for better money management.`;
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return `${Math.ceil(diffDays / 365)} years ago`;
  };

  useEffect(() => {
    const loadVideoData = async () => {
      if (!videoId) return;
      
      setIsLoading(true);
      const data = await fetchVideoDetails(videoId);
      
      if (data) {
        setVideoData(data);
        setHasRealTranscript(data.hasRealTranscript);
        // Fetch related videos based on the video title
        await fetchRelatedVideos(data.title);
        loadVideoProgress();
      } else {
        Alert.alert('Error', 'Failed to load video data');
      }
      
      setIsLoading(false);
    };

    loadVideoData();
  }, [videoId]);

  const loadVideoProgress = async () => {
    // Implement loading progress from AsyncStorage or API
    // For now, simulate some progress
    setVideoProgress(0);
  };

  const saveVideoProgress = async (progress: number) => {
    // Implement saving progress to AsyncStorage or API
    console.log('Saving video progress:', progress);
  };

  const handleVideoEnd = () => {
    setVideoProgress(100);
    saveVideoProgress(100);
    
    Alert.alert(
      '🎉 Video Completed!',
      'Congratulations! You\'ve completed this lesson. Ready to explore more content?',
      [
        { text: 'Take Quiz', onPress: () => router.push(`/learning/quiz/${videoData.id}`) },
        { text: 'Continue Learning', onPress: () => router.back() },
        { text: 'View Certificate', onPress: () => showCertificate() }
      ]
    );
  };

  const handleProgress = (progress: number) => {
    setVideoProgress(progress);
    saveVideoProgress(progress);
  };

  const showCertificate = () => {
    Alert.alert('Certificate', 'Certificate feature coming soon!');
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    Alert.alert(
      isBookmarked ? 'Removed from Saved' : 'Saved!',
      isBookmarked ? 'Video removed from your saved list' : 'Video saved for later viewing'
    );
  };

  const shareVideo = () => {
    const shareUrl = `https://youtube.com/watch?v=${videoId}`;
    Alert.alert('Share Video', `Share this video: ${shareUrl}`, [
      { text: 'Copy Link', onPress: () => console.log('Link copied') },
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderVideoPlayer = () => {
    if (!videoData) return null;
    
    const youtubeUrl = `https://www.youtube.com/embed/${videoData.youtubeId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&playsinline=1`;
    
    return (
      <View style={styles.videoContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: youtubeUrl }}
          style={styles.webView}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          onError={(error) => {
            console.error('WebView error:', error);
            Alert.alert('Error', 'Failed to load video. Please check your internet connection.');
          }}
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#e34c00" />
              <Text style={styles.loadingText}>Loading video...</Text>
            </View>
          )}
        />
      </View>
    );
  };

  if (!videoData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e34c00" />
          <Text style={styles.loadingText}>Loading video details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={shareVideo} style={styles.headerButton}>
            <Ionicons name="share-outline" size={24} color="#CBD5E0" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setShowNotes(!showNotes)} 
            style={styles.headerButton}
          >
            <Ionicons 
              name={showNotes ? "document-text" : "document-text-outline"} 
              size={24} 
              color="#e34c00" 
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        {renderVideoPlayer()}

        {/* Video Info */}
        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{videoData.title}</Text>
          
          <View style={styles.videoMeta}>
            <View style={styles.metaRow}>
              <View style={styles.instructorInfo}>
                <View style={styles.instructorAvatar}>
                  <Ionicons name="person" size={16} color="#e34c00" />
                </View>
                <View>
                  <Text style={styles.instructorName}>{videoData.instructor}</Text>
                  <Text style={styles.publishDate}>{formatDate(videoData.publishedAt)}</Text>
                </View>
              </View>
              <View style={styles.statsContainer}>
                <Ionicons name="eye-outline" size={16} color="#A0AEC0" />
                <Text style={styles.statText}>{videoData.views.toLocaleString()}</Text>
                <Ionicons name="heart-outline" size={16} color="#A0AEC0" style={{ marginLeft: 16 }} />
                <Text style={styles.statText}>{videoData.likes.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.metaRow}>
              <View style={styles.tagsContainer}>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryText}>{videoData.category}</Text>
                </View>
                <View style={styles.difficultyTag}>
                  <Text style={styles.difficultyText}>{videoData.difficulty}</Text>
                </View>
              </View>
              <Text style={styles.duration}>
                <Ionicons name="time-outline" size={14} color="#A0AEC0" /> {videoData.duration}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your Progress</Text>
              <Text style={styles.progressText}>{Math.round(videoProgress)}% complete</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${videoProgress}%` }]} />
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this video</Text>
          <Text style={styles.description} numberOfLines={showNotes ? undefined : 3}>
            {videoData.description}
          </Text>
          {videoData.description && videoData.description.length > 200 && (
            <TouchableOpacity onPress={() => setShowNotes(!showNotes)}>
              <Text style={styles.showMoreText}>
                {showNotes ? 'Show less' : 'Show more'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Key Points */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What you'll learn</Text>
          <View style={styles.keyPointsList}>
            {videoData.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPointItem}>
                <View style={styles.keyPointNumber}>
                  <Text style={styles.keyPointNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Notes Section */}
        {showNotes && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Study Notes</Text>
              <Ionicons name="bookmark-outline" size={20} color="#e34c00" />
            </View>
            <View style={styles.notesContainer}>
              <Text style={styles.notesText}>{videoData.notes}</Text>
            </View>
          </View>
        )}

        {/* Transcript - Only show if real transcript is available */}
        {hasRealTranscript && videoData.transcript && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Transcript</Text>
            <View style={styles.transcriptContainer}>
              {videoData.transcript.map((item, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.transcriptItem}
                  onPress={() => {
                    Alert.alert('Seek to', `Jump to ${item.time}?`, [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Jump', onPress: () => {
                        // Implement seek functionality here
                        console.log(`Seeking to ${item.time}`);
                      }}
                    ]);
                  }}
                >
                  <Text style={styles.transcriptTime}>{item.time}</Text>
                  <Text style={styles.transcriptText}>{item.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Related Videos with Real Thumbnails */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Continue Learning</Text>
            {isLoadingRelated && <ActivityIndicator size="small" color="#e34c00" />}
          </View>
          
          {relatedVideos.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.relatedVideosScroll}>
              {relatedVideos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={styles.relatedVideoCard}
                  onPress={() => router.push(`/learning/video/${video.id}`)}
                >
                  <View style={styles.relatedVideoThumbnailContainer}>
                    {video.thumbnail ? (
                      <Image 
                        source={{ uri: video.thumbnail }} 
                        style={styles.relatedVideoThumbnailImage}
                        onError={(error) => console.log('Thumbnail load error:', error)}
                      />
                    ) : (
                      <View style={styles.relatedVideoThumbnailPlaceholder}>
                        <Ionicons name="videocam-outline" size={32} color="#6B7280" />
                      </View>
                    )}
                    <View style={styles.playOverlay}>
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                    </View>
                    <View style={styles.durationOverlay}>
                      <Text style={styles.durationOverlayText}>{video.duration}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.relatedVideoTitle} numberOfLines={2}>
                    {video.title}
                  </Text>
                  
                  <Text style={styles.relatedVideoChannel} numberOfLines={1}>
                    {video.channel}
                  </Text>
                  
                  <View style={styles.relatedVideoMeta}>
                    <Text style={styles.relatedVideoDate}>
                      {formatRelativeDate(video.publishedAt)}
                    </Text>
                    <View style={styles.relatedVideoCategory}>
                      <Text style={styles.relatedVideoCategoryText}>{video.category}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyRelatedVideos}>
              <Text style={styles.emptyRelatedText}>No related videos found</Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.quizButton}
            onPress={() => router.push(`/learning/quiz/${videoData.id}`)}
          >
            <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.quizButtonText}>Take Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.bookmarkButton, isBookmarked && styles.bookmarkButtonActive]}
            onPress={toggleBookmark}
          >
            <Ionicons 
              name={isBookmarked ? "bookmark" : "bookmark-outline"} 
              size={20} 
              color={isBookmarked ? "#FFFFFF" : "#e34c00"} 
            />
            <Text style={[
              styles.bookmarkButtonText,
              isBookmarked && styles.bookmarkButtonTextActive
            ]}>
              {isBookmarked ? 'Saved' : 'Save for Later'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  content: {
    flex: 1,
  },
  videoContainer: {
    height: width * (9/16),
    backgroundColor: '#000',
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    gap: 12,
  },
  loadingText: {
    color: '#CBD5E0',
    fontSize: 16,
  },
  videoInfo: {
    padding: 20,
    backgroundColor: '#1A202C',
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  videoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    lineHeight: 28,
  },
  videoMeta: {
    gap: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  instructorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2D3748',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructorName: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  publishDate: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#A0AEC0',
    marginLeft: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#e34c00',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  difficultyTag: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  duration: {
    fontSize: 12,
    color: '#A0AEC0',
    alignItems: 'center',
  },
  progressContainer: {
    marginTop: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#2D3748',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
  },
  showMoreText: {
    fontSize: 14,
    color: '#e34c00',
    marginTop: 8,
    fontWeight: '500',
  },
  keyPointsList: {
    gap: 16,
  },
  keyPointItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  keyPointNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  keyPointNumberText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  keyPointText: {
    fontSize: 14,
    color: '#CBD5E0',
    flex: 1,
    lineHeight: 20,
  },
  notesContainer: {
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#e34c00',
  },
  notesText: {
    fontSize: 14,
    color: '#CBD5E0',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  transcriptContainer: {
    gap: 8,
  },
  transcriptItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2D3748',
    borderRadius: 8,
  },
  transcriptTime: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '600',
    minWidth: 60,
    marginRight: 16,
  },
  transcriptText: {
    fontSize: 14,
    color: '#CBD5E0',
    flex: 1,
    lineHeight: 20,
  },
  relatedVideosScroll: {
    marginTop: 8,
  },
  relatedVideoCard: {
    width: 200,
    marginRight: 16,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    padding: 12,
  },
  relatedVideoThumbnailContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  relatedVideoThumbnailImage: {
    width: '100%',
    height: 112,
    borderRadius: 8,
    backgroundColor: '#1A202C',
  },
  relatedVideoThumbnailPlaceholder: {
    width: '100%',
    height: 112,
    borderRadius: 8,
    backgroundColor: '#1A202C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -15 }, { translateY: -15 }],
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationOverlayText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  relatedVideoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
  },
  relatedVideoChannel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  relatedVideoMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  relatedVideoDate: {
    fontSize: 11,
    color: '#6B7280',
  },
  relatedVideoCategory: {
    backgroundColor: '#1A202C',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  relatedVideoCategoryText: {
    fontSize: 9,
    color: '#e34c00',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  emptyRelatedVideos: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyRelatedText: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  quizButton: {
    flex: 1,
    backgroundColor: '#e34c00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  bookmarkButton: {
    flex: 1,
    backgroundColor: '#1A202C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e34c00',
    gap: 8,
  },
  bookmarkButtonActive: {
    backgroundColor: '#e34c00',
    borderColor: '#e34c00',
  },
  bookmarkButtonText: {
    color: '#e34c00',
    fontSize: 16,
    fontWeight: '600',
  },
  bookmarkButtonTextActive: {
    color: '#FFFFFF',
  },
});

export default VideoScreen;
