import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const ContentScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [readingProgress, setReadingProgress] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  const [estimatedReadTime, setEstimatedReadTime] = useState(0);

  // Sample article data - would come from your API
  const [articleData] = useState({
    id: id,
    title: 'Emergency Fund Essentials: Building Your Financial Safety Net',
    author: 'Priya Sharma, CFP',
    publishDate: '2025-01-20',
    readTime: '8 min read',
    category: 'saving',
    difficulty: 'Beginner',
    tags: ['emergency fund', 'savings', 'financial planning', 'security'],
    coverImage: 'https://via.placeholder.com/400x200/4ECDC4/FFFFFF?text=Emergency+Fund',
    content: `
# Emergency Fund Essentials: Building Your Financial Safety Net

An emergency fund is one of the most crucial components of a healthy financial plan. It serves as your financial safety net, providing peace of mind and protecting you from unexpected expenses that could derail your financial goals.

## What is an Emergency Fund?

An emergency fund is a separate savings account specifically designated for unexpected expenses or financial emergencies. This money should be easily accessible but separate from your regular checking or savings accounts to avoid the temptation of using it for non-emergencies.

## Why Do You Need an Emergency Fund?

### Financial Security
Life is unpredictable. Whether it's a medical emergency, job loss, car repair, or home maintenance issue, unexpected expenses can arise at any time. Without an emergency fund, you might be forced to rely on credit cards or loans, which can lead to debt accumulation.

### Peace of Mind
Knowing you have a financial cushion reduces stress and anxiety about unexpected expenses. This psychological benefit is invaluable and allows you to make better financial decisions.

### Avoiding Debt
With an emergency fund, you won't need to rely on high-interest credit cards or personal loans when emergencies occur. This saves you money in the long run and keeps you out of debt.

## How Much Should You Save?

The general recommendation is to save 3-6 months' worth of living expenses. However, the exact amount depends on your individual circumstances:

### For Students and Early Professionals
- **Minimum**: ₹10,000 - ₹25,000 for small emergencies
- **Target**: 2-3 months of expenses (₹30,000 - ₹75,000)

### For Working Professionals
- **Conservative**: 3-4 months of expenses
- **Moderate**: 4-6 months of expenses
- **Aggressive**: 6-12 months of expenses

## Where to Keep Your Emergency Fund

### High-Yield Savings Account
- Easy access to funds
- Earns modest interest
- FDIC insured up to certain limits

### Liquid Mutual Funds
- Slightly higher returns than savings accounts
- Can be accessed within 1-3 business days
- Low risk but not guaranteed

### Fixed Deposits with Premature Withdrawal
- Higher interest rates
- Can be broken in emergencies
- Penalty fees may apply

## Building Your Emergency Fund: Step by Step

### Step 1: Start Small
Begin with a goal of ₹1,000 - ₹5,000. This initial amount can cover many small emergencies and gives you momentum to continue saving.

### Step 2: Automate Your Savings
Set up an automatic transfer from your checking account to your emergency fund. Even ₹500 - ₹1,000 per month can build up over time.

### Step 3: Use Windfalls
Direct any unexpected money (tax refunds, bonuses, gifts) straight to your emergency fund until you reach your target amount.

### Step 4: Cut Unnecessary Expenses
Review your "wants" category in LisstIn and redirect some of that money to your emergency fund temporarily.

## Common Mistakes to Avoid

### Using It for Non-Emergencies
Your emergency fund is not for vacations, shopping sprees, or planned expenses. Keep it strictly for true emergencies.

### Keeping Too Much
While having an emergency fund is important, keeping too much in low-yield accounts when you could be investing for higher returns isn't optimal.

### Not Replenishing After Use
If you use your emergency fund, make it a priority to rebuild it as soon as possible.

## Emergency Fund Categories

### True Emergencies
- Medical emergencies
- Job loss or income reduction
- Major home or car repairs
- Family emergencies

### Not Emergencies
- Planned vacations
- Holiday shopping
- Routine maintenance
- Wants and desires

## Tips for Success

### Make It Automatic
The easiest way to build an emergency fund is to automate the process. Set up automatic transfers so you don't have to think about it.

### Start with What You Can
Don't let the recommended amount discourage you. Start with whatever you can afford, even if it's just ₹100 per month.

### Keep It Separate
Maintain your emergency fund in a separate account from your regular savings to avoid temptation.

### Review Regularly
As your income and expenses change, review and adjust your emergency fund target accordingly.

## Conclusion

Building an emergency fund is a crucial step in achieving financial stability. It provides security, peace of mind, and protects you from going into debt when unexpected expenses arise. Start small, be consistent, and watch your financial safety net grow over time.

Remember, the goal isn't to build your emergency fund overnight. It's a gradual process that becomes easier as you develop the habit of saving. Every rupee you save brings you one step closer to financial security.

---

*This article is part of LisstIn's comprehensive financial education program. For more personalized advice, consider speaking with our AI financial counselor.*
    `,
    relatedArticles: [
      { id: '2', title: 'Setting Financial Goals for Students', readTime: '6 min' },
      { id: '3', title: 'Investment Basics for Beginners', readTime: '10 min' },
      { id: '4', title: 'Budgeting 101: Getting Started', readTime: '7 min' }
    ]
  });

  useEffect(() => {
    // Calculate estimated read time based on content length
    const wordsPerMinute = 200;
    const wordCount = articleData.content.split(' ').length;
    setEstimatedReadTime(Math.ceil(wordCount / wordsPerMinute));
  }, []);

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const progress = (contentOffset.y / (contentSize.height - layoutMeasurement.height)) * 100;
    setReadingProgress(Math.min(Math.max(progress, 0), 100));
  };

  const renderContent = () => {
    // Simple markdown-like rendering
    const lines = articleData.content.split('\n').filter(line => line.trim());
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('# ')) {
        return (
          <Text key={index} style={styles.heading1}>
            {trimmedLine.substring(2)}
          </Text>
        );
      } else if (trimmedLine.startsWith('## ')) {
        return (
          <Text key={index} style={styles.heading2}>
            {trimmedLine.substring(3)}
          </Text>
        );
      } else if (trimmedLine.startsWith('### ')) {
        return (
          <Text key={index} style={styles.heading3}>
            {trimmedLine.substring(4)}
          </Text>
        );
      } else if (trimmedLine.startsWith('- ')) {
        return (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>{trimmedLine.substring(2)}</Text>
          </View>
        );
      } else if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        return (
          <Text key={index} style={styles.boldText}>
            {trimmedLine.slice(2, -2)}
          </Text>
        );
      } else if (trimmedLine === '---') {
        return <View key={index} style={styles.divider} />;
      } else if (trimmedLine.startsWith('*') && trimmedLine.endsWith('*')) {
        return (
          <Text key={index} style={styles.italicText}>
            {trimmedLine.slice(1, -1)}
          </Text>
        );
      } else if (trimmedLine) {
        return (
          <Text key={index} style={styles.paragraph}>
            {trimmedLine}
          </Text>
        );
      }
      
      return null;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setBookmarked(!bookmarked)}>
            <Ionicons 
              name={bookmarked ? "bookmark" : "bookmark-outline"} 
              size={24} 
              color={bookmarked ? "#FFD700" : "#CBD5E0"} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="#CBD5E0" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${readingProgress}%` }]} />
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Cover Image */}
        <Image source={{ uri: articleData.coverImage }} style={styles.coverImage} />

        {/* Article Header */}
        <View style={styles.articleHeader}>
          <Text style={styles.title}>{articleData.title}</Text>
          
          <View style={styles.authorInfo}>
            <View style={styles.authorAvatar}>
              <Ionicons name="person" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>{articleData.author}</Text>
              <Text style={styles.publishDate}>{articleData.publishDate}</Text>
            </View>
          </View>

          <View style={styles.articleMeta}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{articleData.category}</Text>
            </View>
            <View style={styles.difficultyTag}>
              <Text style={styles.difficultyText}>{articleData.difficulty}</Text>
            </View>
            <Text style={styles.readTime}>{estimatedReadTime} min read</Text>
          </View>

          {/* Tags */}
          <View style={styles.tagsContainer}>
            {articleData.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Article Content */}
        <View style={styles.articleContent}>
          {renderContent()}
        </View>

        {/* Related Articles */}
        <View style={styles.relatedSection}>
          <Text style={styles.relatedTitle}>Related Articles</Text>
          {articleData.relatedArticles.map((article) => (
            <TouchableOpacity
              key={article.id}
              style={styles.relatedArticle}
              onPress={() => router.push(`/learning/content/${article.id}`)}
            >
              <View style={styles.relatedArticleContent}>
                <Text style={styles.relatedArticleTitle}>{article.title}</Text>
                <Text style={styles.relatedArticleTime}>{article.readTime}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.quizButton}>
            <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.quizButtonText}>Take Related Quiz</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  shareButton: {
    marginLeft: 8,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  progressBar: {
    height: 2,
    backgroundColor: '#2D3748',
    borderRadius: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
  coverImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  articleHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 32,
    marginBottom: 16,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  publishDate: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 2,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  categoryTag: {
    backgroundColor: '#e34c00',
    paddingHorizontal: 8,
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  readTime: {
    fontSize: 14,
    color: '#A0AEC0',
    marginLeft: 'auto',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '500',
  },
  articleContent: {
    padding: 20,
  },
  heading1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginVertical: 16,
    lineHeight: 32,
  },
  heading2: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 24,
    marginBottom: 12,
    lineHeight: 28,
  },
  heading3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CBD5E0',
    marginTop: 20,
    marginBottom: 8,
    lineHeight: 24,
  },
  paragraph: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#e34c00',
    marginRight: 12,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
    flex: 1,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  italicText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
    marginVertical: 16,
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#2D3748',
    marginVertical: 24,
  },
  relatedSection: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  relatedArticle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  relatedArticleContent: {
    flex: 1,
  },
  relatedArticleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  relatedArticleTime: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  actionButtons: {
    padding: 20,
  },
  quizButton: {
    backgroundColor: '#e34c00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  quizButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ContentScreen;
