import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Youtube API KEY
const YT_API_KEY = 'AIzaSyASNoXRjGc9Ok_UeiW5GZdlLTxclhhUve0';

const fetchFinanceVideos = async (query = "personal finance") => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=20&q=${encodeURIComponent(
        query
      )}&type=video&videoCategoryId=26&key=${YT_API_KEY}`
    );
    const json = await response.json();
    return json.items?.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      channel: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      duration: 'YouTube Video', // You can fetch duration from videos API if needed
    })) || [];
  } catch (error) {
    console.error("Error fetching YouTube videos:", error);
    return [];
  }
};

const sampleQuiz = [
  {
    question: 'According to LisstIn categorization, which of these is a "Want"?',
    options: ['Groceries', 'Coffee from Starbucks', 'Rent', 'Medical bills'],
    correct: 1,
  },
  {
    question: 'What percentage of income should ideally go to "Needs"?',
    options: ['30%', '40%', '50%', '60%'],
    correct: 2,
  },
  {
    question: 'Emergency fund should cover how many months of expenses?',
    options: ['1-2 months', '3-6 months', '8-12 months', '2+ years'],
    correct: 1,
  },
];

const Learning = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [youtubeVideos, setYoutubeVideos] = useState([]);
  const [isLoadingVideos, setIsLoadingVideos] = useState(false);

  const categories = [
    { id: 'all', name: 'All', icon: 'library-outline' },
    { id: 'basics', name: 'Basics', icon: 'school-outline' },
    { id: 'budgeting', name: 'Budgeting', icon: 'calculator-outline' },
    { id: 'investing', name: 'Investing', icon: 'trending-up-outline' },
    { id: 'saving', name: 'Saving', icon: 'wallet-outline' },
  ];

  // Removed dummy learning content - now only using YouTube videos
  const [achievements] = useState([
    { id: 1, title: 'First Steps', description: 'Watched your first video', icon: '🎯', unlocked: true, date: '2 days ago' },
    { id: 2, title: 'Video Watcher', description: 'Watched 5 educational videos', icon: '📺', unlocked: true, date: '1 day ago' },
    { id: 3, title: 'Quiz Master', description: 'Scored 80%+ on any quiz', icon: '🧠', unlocked: false, progress: 60 },
    { id: 4, title: 'Learning Streak', description: '7 days of continuous learning', icon: '🔥', unlocked: false, progress: 40 },
  ]);

  useEffect(() => {
    loadVideosByCategory(selectedCategory);
  }, [selectedCategory]);

  const loadVideosByCategory = async (category) => {
    setIsLoadingVideos(true);
    let query = 'personal finance';
    
    // Map categories to specific search queries
    switch (category) {
      case 'basics':
        query = 'personal finance basics beginners';
        break;
      case 'budgeting':
        query = 'budgeting money management';
        break;
      case 'investing':
        query = 'investing for beginners stock market';
        break;
      case 'saving':
        query = 'saving money emergency fund';
        break;
      case 'all':
      default:
        query = 'personal finance education';
        break;
    }
    
    try {
      const results = await fetchFinanceVideos(query);
      setYoutubeVideos(results);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoadingVideos(false);
    }
  };

  // Filter videos based on search query
  const filteredVideos = youtubeVideos.filter(video => {
    if (!searchQuery) return true;
    return video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
           video.channel.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleContentPress = (item: any) => {
    if (item.type === 'quiz') {
      setShowQuizModal(true);
      setCurrentQuizQuestion(0);
      setQuizScore(0);
    } else {
      // Navigate to video screen with YouTube video ID
      router.push(`/learning/video/${item.id}`);
    }
  };

  const handleQuizAnswer = (selectedAnswer: number) => {
    const correct = sampleQuiz[currentQuizQuestion].correct;
    if (selectedAnswer === correct) setQuizScore(prev => prev + 1);

    if (currentQuizQuestion < sampleQuiz.length - 1) {
      setCurrentQuizQuestion(prev => prev + 1);
    } else {
      const finalScore = quizScore + (selectedAnswer === correct ? 1 : 0);
      const percentage = Math.round((finalScore / sampleQuiz.length) * 100);
      setTimeout(() => {
        setShowQuizModal(false);
        alert(`Quiz completed! Your score: ${finalScore}/${sampleQuiz.length} (${percentage}%)`);
      }, 500);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Learning Hub</Text>
          <Text style={styles.headerSubtitle}>Expand your financial knowledge</Text>
        </View>
        <TouchableOpacity
          style={styles.progressButton}
          onPress={() => router.push('/learning/progress')}
        >
          <Ionicons name="trophy-outline" size={24} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#6B7280" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search videos, channels, topics..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesContent}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === cat.id ? '#e34c00' : '#1A202C',
                  borderColor: selectedCategory === cat.id ? '#e34c00' : '#2D3748',
                }
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon as any}
                size={16}
                color={selectedCategory === cat.id ? '#FFFFFF' : '#CBD5E0'}
              />
              <Text style={[
                styles.categoryChipText,
                { color: selectedCategory === cat.id ? '#FFFFFF' : '#CBD5E0' }
              ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Progress Overview */}
        <View style={styles.progressContainer}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>{youtubeVideos.length}</Text>
              <Text style={styles.progressLabel}>Videos Available</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>0</Text>
              <Text style={styles.progressLabel}>Watched</Text>
            </View>
            <View style={styles.progressStat}>
              <Text style={styles.progressNumber}>0%</Text>
              <Text style={styles.progressLabel}>Completion</Text>
            </View>
          </View>
        </View>

        {/* Financial Education Videos */}
        <View style={styles.contentContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all'
                ? 'Financial Education Videos'
                : `${categories.find(c => c.id === selectedCategory)?.name} Videos`}
            </Text>
            {isLoadingVideos && (
              <ActivityIndicator size="small" color="#e34c00" />
            )}
          </View>

          {isLoadingVideos ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#e34c00" />
              <Text style={styles.loadingText}>Loading educational videos...</Text>
            </View>
          ) : filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <TouchableOpacity
                key={video.id || index}
                style={styles.contentCard}
                onPress={() => handleContentPress(video)}
              >
                <View style={styles.contentHeader}>
                  <View style={styles.thumbnailContainer}>
                    <Image
                      source={{ uri: video.thumbnail }}
                      style={styles.thumbnail}
                      onError={() => console.log('Image load error')}
                    />
                    <View style={styles.playOverlay}>
                      <Ionicons name="play" size={20} color="#FFFFFF" />
                    </View>
                  </View>

                  <View style={styles.contentInfo}>
                    <Text style={styles.contentTitle} numberOfLines={2}>
                      {video.title}
                    </Text>
                    <Text style={styles.contentDescription} numberOfLines={2}>
                      {video.description || 'Financial education content from YouTube'}
                    </Text>
                    <View style={styles.contentMeta}>
                      <View style={styles.typeTag}>
                        <Text style={[styles.typeTagText, { color: '#FF6B6B' }]}>
                          VIDEO
                        </Text>
                      </View>
                      <Text style={styles.channelName} numberOfLines={1}>
                        {video.channel}
                      </Text>
                    </View>
                    <Text style={styles.publishDate}>
                      {formatDate(video.publishedAt)}
                    </Text>
                  </View>

                  <View style={styles.contentActions}>
                    <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="videocam-outline" size={64} color="#4A5568" />
              <Text style={styles.emptyStateTitle}>No videos found</Text>
              <Text style={styles.emptyStateDescription}>
                {searchQuery 
                  ? 'Try adjusting your search terms' 
                  : 'Check your internet connection and try again'}
              </Text>
            </View>
          )}
        </View>

        {/* Sample Quiz Section */}
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Test Your Knowledge</Text>
          <TouchableOpacity
            style={styles.contentCard}
            onPress={() => {
              setShowQuizModal(true);
              setCurrentQuizQuestion(0);
              setQuizScore(0);
            }}
          >
            <View style={styles.contentHeader}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: '#FFD700' }
              ]}>
                <Ionicons
                  name="help-circle-outline"
                  size={24}
                  color="#FFFFFF"
                />
              </View>

              <View style={styles.contentInfo}>
                <Text style={styles.contentTitle}>LisstIn Financial Quiz</Text>
                <Text style={styles.contentDescription}>
                  Test your understanding of financial concepts
                </Text>
                <View style={styles.contentMeta}>
                  <View style={styles.typeTag}>
                    <Text style={[styles.typeTagText, { color: '#FFD700' }]}>
                      QUIZ
                    </Text>
                  </View>
                  <Text style={styles.duration}>3 questions</Text>
                </View>
              </View>

              <View style={styles.contentActions}>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.map(a => (
            <View
              key={a.id}
              style={[
                styles.achievementCard,
                { opacity: a.unlocked ? 1 : 0.6 }
              ]}
            >
              <View style={styles.achievementContent}>
                <Text style={styles.achievementIcon}>{a.icon}</Text>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achievementTitle}>{a.title}</Text>
                  <Text style={styles.achievementDescription}>
                    {a.description}
                  </Text>
                  {a.unlocked ? (
                    <Text style={styles.achievementDate}>{a.date}</Text>
                  ) : (
                    <View style={styles.achievementProgressContainer}>
                      <View style={styles.achievementProgressBar}>
                        <View
                          style={[
                            styles.achievementProgressFill,
                            { width: `${a.progress || 0}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.achievementProgressText}>
                        {a.progress || 0}%
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {a.unlocked && (
                <View style={styles.unlockedBadge}>
                  <Ionicons name="trophy" size={16} color="#FFD700" />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Quiz Modal */}
      <Modal
        visible={showQuizModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQuizModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.quizModal}>
            <View style={styles.quizHeader}>
              <Text style={styles.quizTitle}>LisstIn Financial Quiz</Text>
              <Text style={styles.quizProgress}>
                {currentQuizQuestion + 1} of {sampleQuiz.length}
              </Text>
            </View>
            <View style={styles.quizContent}>
              <Text style={styles.quizQuestion}>
                {sampleQuiz[currentQuizQuestion]?.question}
              </Text>
              <View style={styles.quizOptions}>
                {sampleQuiz[currentQuizQuestion]?.options.map((opt, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.quizOption}
                    onPress={() => handleQuizAnswer(i)}
                  >
                    <Text style={styles.quizOptionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeQuizButton}
              onPress={() => setShowQuizModal(false)}
            >
              <Text style={styles.closeQuizButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F1419' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 14, color: '#A0AEC0', marginTop: 4 },
  progressButton: { padding: 8 },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    height: 46,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2D3748',
    marginBottom: 16,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#FFFFFF' },

  categoriesContainer: { paddingVertical: 8 },
  categoriesContent: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8
  },
  categoryChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 6,
    borderWidth: 1,
    gap: 6,
    minWidth: 0,
  },
  categoryChipText: { fontSize: 12, fontWeight: '600', textAlign: 'center' },

  content: { flex: 1, paddingHorizontal: 20 },

  progressContainer: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  progressStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#1A202C', padding: 20, borderRadius: 16, borderWidth: 1, borderColor: '#2D3748' },
  progressStat: { alignItems: 'center' },
  progressNumber: { fontSize: 24, fontWeight: 'bold', color: '#e34c00' },
  progressLabel: { fontSize: 12, color: '#A0AEC0', marginTop: 4 },

  loadingContainer: { alignItems: 'center', paddingVertical: 40 },
  loadingText: { marginTop: 16, fontSize: 16, color: '#A0AEC0' },

  contentContainer: { marginBottom: 24 },
  contentCard: { backgroundColor: '#1A202C', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2D3748' },
  contentHeader: { flexDirection: 'row', alignItems: 'flex-start' },
  thumbnailContainer: { position: 'relative', marginRight: 16 },
  thumbnail: { width: 80, height: 60, borderRadius: 8 },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 8 },
  iconContainer: { width: 80, height: 60, borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  contentInfo: { flex: 1 },
  contentTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  contentDescription: { fontSize: 14, color: '#A0AEC0', marginBottom: 8 },
  contentMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 4 },
  typeTag: { backgroundColor: '#2D3748', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  typeTagText: { fontSize: 10, fontWeight: '600' },
  channelName: { fontSize: 12, color: '#6B7280', flex: 1 },
  publishDate: { fontSize: 11, color: '#6B7280' },
  duration: { fontSize: 12, color: '#6B7280' },
  contentActions: { alignItems: 'center', gap: 8 },

  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyStateTitle: { fontSize: 18, fontWeight: '600', color: '#CBD5E0', marginTop: 16, marginBottom: 8 },
  emptyStateDescription: { fontSize: 14, color: '#6B7280', textAlign: 'center' },

  achievementsContainer: { marginBottom: 0 },
  achievementCard: { backgroundColor: '#1A202C', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#2D3748', position: 'relative' },
  achievementContent: { flexDirection: 'row', alignItems: 'center' },
  achievementIcon: { fontSize: 24, marginRight: 16 },
  achievementInfo: { flex: 1 },
  achievementTitle: { fontSize: 16, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  achievementDescription: { fontSize: 14, color: '#A0AEC0', marginBottom: 4 },
  achievementDate: { fontSize: 12, color: '#6B7280' },
  achievementProgressContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  achievementProgressBar: { flex: 1, height: 4, backgroundColor: '#2D3748', borderRadius: 2 },
  achievementProgressFill: { height: '100%', backgroundColor: '#FFD700', borderRadius: 2 },
  achievementProgressText: { fontSize: 12, color: '#A0AEC0', minWidth: 30 },
  unlockedBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#2D3748', padding: 4, borderRadius: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', paddingHorizontal: 20 },
  quizModal: { backgroundColor: '#1A202C', borderRadius: 20, padding: 24, borderWidth: 1, borderColor: '#2D3748' },
  quizHeader: { marginBottom: 24 },
  quizTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  quizProgress: { fontSize: 14, color: '#A0AEC0' },
  quizContent: { marginBottom: 24 },
  quizQuestion: { fontSize: 18, color: '#FFFFFF', marginBottom: 20, lineHeight: 24 },
  quizOptions: { gap: 12 },
  quizOption: { backgroundColor: '#2D3748', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#4A5568' },
  quizOptionText: { fontSize: 16, color: '#CBD5E0' },
  closeQuizButton: { backgroundColor: '#FF6B6B', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  closeQuizButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
});

export default Learning;
