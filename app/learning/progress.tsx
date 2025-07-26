import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ProgressScreen = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Sample progress data - would come from your API
  const [progressData] = useState({
    overall: {
      totalCourses: 24,
      completedCourses: 8,
      inProgress: 3,
      totalWatchTime: 1245, // minutes
      currentStreak: 7,
      longestStreak: 12,
    },
    recentActivity: [
      {
        id: 1,
        type: 'video',
        title: 'Understanding Wants vs Needs',
        completedAt: '2025-01-24',
        score: null,
        progress: 100,
      },
      {
        id: 2,
        type: 'quiz',
        title: 'Emergency Fund Quiz',
        completedAt: '2025-01-24',
        score: 85,
        progress: 100,
      },
      {
        id: 3,
        type: 'article',
        title: 'Investment Basics for Students',
        completedAt: '2025-01-23',
        score: null,
        progress: 100,
      },
      {
        id: 4,
        type: 'video',
        title: 'SIP Investment Guide',
        completedAt: '2025-01-22',
        score: null,
        progress: 65,
      },
    ],
    achievements: [
      {
        id: 1,
        title: 'First Steps',
        description: 'Completed your first lesson',
        icon: '🎯',
        unlockedAt: '2025-01-20',
        category: 'milestone',
      },
      {
        id: 2,
        title: 'Video Enthusiast',
        description: 'Watched 10 educational videos',
        icon: '📺',
        unlockedAt: '2025-01-22',
        category: 'engagement',
      },
      {
        id: 3,
        title: 'Quiz Master',
        description: 'Scored 90%+ on 3 quizzes',
        icon: '🧠',
        unlockedAt: '2025-01-24',
        category: 'performance',
      },
      
    ],
    categoryProgress: [
      { name: 'Budgeting', completed: 5, total: 8, color: '#e34c00' },
      { name: 'Saving', completed: 3, total: 6, color: '#FFD700' },
      { name: 'Investing', completed: 2, total: 7, color: '#FF6B6B' },
      { name: 'Planning', completed: 1, total: 4, color: '#45B7D1' },
    ],
    weeklyStats: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [45, 30, 60, 0, 25, 90, 40], // minutes per day
    }
  });

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'video': return 'play-circle';
      case 'quiz': return 'help-circle';
      case 'article': return 'document-text';
      default: return 'book';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'video': return '#FF6B6B';
      case 'quiz': return '#FFD700';
      case 'article': return '#e34c00';
      default: return '#6B7280';
    }
  };

  const renderWeeklyChart = () => {
    const maxValue = Math.max(...progressData.weeklyStats.data);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>This Week's Activity</Text>
        <View style={styles.chart}>
          {progressData.weeklyStats.labels.map((label, index) => {
            const value = progressData.weeklyStats.data[index];
            const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
            
            return (
              <View key={index} style={styles.chartColumn}>
                <View style={styles.chartBarContainer}>
                  <View 
                    style={[
                      styles.chartBar, 
                      { 
                        height: `${height}%`,
                        backgroundColor: value > 0 ? '#e34c00' : '#2D3748'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.chartLabel}>{label}</Text>
                <Text style={styles.chartValue}>{value}m</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Learning Progress</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.overviewContainer}>
          <Text style={styles.sectionTitle}>Overview</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="book" size={24} color="#e34c00" />
              <Text style={styles.statNumber}>{progressData.overall.completedCourses}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#FFD700" />
              <Text style={styles.statNumber}>{formatTime(progressData.overall.totalWatchTime)}</Text>
              <Text style={styles.statLabel}>Watch Time</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="flame" size={24} color="#FF6B6B" />
              <Text style={styles.statNumber}>{progressData.overall.currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            
            <View style={styles.statCard}>
              <Ionicons name="trophy" size={24} color="#45B7D1" />
              <Text style={styles.statNumber}>{progressData.achievements.length}</Text>
              <Text style={styles.statLabel}>Achievements</Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity Chart */}
        {renderWeeklyChart()}

        {/* Category Progress */}
        <View style={styles.categoryContainer}>
          <Text style={styles.sectionTitle}>Progress by Category</Text>
          
          {progressData.categoryProgress.map((category, index) => {
            const completionPercentage = (category.completed / category.total) * 100;
            
            return (
              <View key={index} style={styles.categoryItem}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryStats}>
                    {category.completed}/{category.total} completed
                  </Text>
                </View>
                
                <View style={styles.categoryProgressBar}>
                  <View 
                    style={[
                      styles.categoryProgressFill,
                      { 
                        width: `${completionPercentage}%`,
                        backgroundColor: category.color
                      }
                    ]} 
                  />
                </View>
                
                <Text style={styles.categoryPercentage}>
                  {Math.round(completionPercentage)}% complete
                </Text>
              </View>
            );
          })}
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          {progressData.recentActivity.map((activity) => (
            <View key={activity.id} style={styles.activityItem}>
              <View style={[
                styles.activityIcon,
                { backgroundColor: getActivityColor(activity.type) }
              ]}>
                <Ionicons 
                  name={getActivityIcon(activity.type) as any} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityDate}>{activity.completedAt}</Text>
                
                {activity.progress < 100 ? (
                  <View style={styles.activityProgressContainer}>
                    <View style={styles.activityProgressBar}>
                      <View 
                        style={[
                          styles.activityProgressFill,
                          { width: `${activity.progress}%` }
                        ]} 
                      />
                    </View>
                    <Text style={styles.activityProgressText}>
                      {activity.progress}%
                    </Text>
                  </View>
                ) : (
                  <View style={styles.completedContainer}>
                    <Ionicons name="checkmark-circle" size={16} color="#e34c00" />
                    <Text style={styles.completedText}>Completed</Text>
                    {activity.score && (
                      <Text style={styles.scoreText}>Score: {activity.score}%</Text>
                    )}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <View style={styles.achievementsHeader}>
            <Text style={styles.sectionTitle}>Recent Achievements</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {progressData.achievements.map((achievement) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                <Text style={styles.achievementDate}>
                  {achievement.unlockedAt}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Goals Section */}
        <View style={styles.goalsContainer}>
          <Text style={styles.sectionTitle}>Learning Goals</Text>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Ionicons name="target" size={20} color="#e34c00" />
              <Text style={styles.goalTitle}>Complete 3 courses this month</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgressFill, { width: '67%' }]} />
              </View>
              <Text style={styles.goalProgressText}>2/3</Text>
            </View>
          </View>
          
          <View style={styles.goalItem}>
            <View style={styles.goalHeader}>
              <Ionicons name="time" size={20} color="#FFD700" />
              <Text style={styles.goalTitle}>Study 2 hours per week</Text>
            </View>
            <View style={styles.goalProgress}>
              <View style={styles.goalProgressBar}>
                <View style={[styles.goalProgressFill, { width: '85%' }]} />
              </View>
              <Text style={styles.goalProgressText}>1h 42m/2h</Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  overviewContainer: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '47%',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
  },
  chartContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    backgroundColor: '#1A202C',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  chartColumn: {
    alignItems: 'center',
    flex: 1,
  },
  chartBarContainer: {
    height: 60,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    width: 8,
    borderRadius: 4,
    minHeight: 2,
  },
  chartLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    color: '#6B7280',
  },
  categoryContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  categoryItem: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryStats: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  categoryProgressBar: {
    height: 6,
    backgroundColor: '#2D3748',
    borderRadius: 3,
    marginBottom: 8,
  },
  categoryProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#CBD5E0',
    textAlign: 'right',
  },
  activityContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  activityProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  activityProgressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 2,
  },
  activityProgressFill: {
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 2,
  },
  activityProgressText: {
    fontSize: 12,
    color: '#A0AEC0',
    minWidth: 30,
  },
  completedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  scoreText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
    marginLeft: 'auto',
  },
  achievementsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  achievementsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  achievementCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    alignItems: 'center',
    minWidth: 160,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 8,
  },
  achievementDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  goalsContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
    marginBottom: 40,
  },
  goalItem: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 12,
    flex: 1,
  },
  goalProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#2D3748',
    borderRadius: 3,
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 14,
    color: '#CBD5E0',
    fontWeight: '500',
    minWidth: 60,
  },
});

export default ProgressScreen;
