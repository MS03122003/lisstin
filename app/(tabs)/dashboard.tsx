// app/(tabs)/dashboard.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import Svg, { Circle, Path, Text as SvgText } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const router = useRouter();
  const { fiConnected } = useLocalSearchParams();
  const [refreshing, setRefreshing] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(25750);
  const [monthlyBudget, setBudgetRemaining] = useState(15000);
  const [isConnected, setIsConnected] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  
  // Sample data - would come from your API/store
  const [categoryData, setCategoryData] = useState({
    wants: { amount: 8500, percentage: 35, color: '#FF6B6B' },
    needs: { amount: 12250, percentage: 50, color: '#e34c00' },
    desires: { amount: 3675, percentage: 15, color: '#45B7D1' },
  });

  const [recentTransactions] = useState([
    { id: 1, description: 'Coffee & Snacks', amount: -280, category: 'wants', time: '2 hours ago' },
    { id: 2, description: 'Groceries', amount: -1500, category: 'needs', time: '5 hours ago' },
    { id: 3, description: 'Salary Credit', amount: 25000, category: 'income', time: '1 day ago' },
    { id: 4, description: 'Movie Tickets', amount: -600, category: 'wants', time: '2 days ago' },
  ]);

  const [achievements] = useState([
    { id: 1, title: 'First Week Complete', icon: '🎯', unlocked: true },
    { id: 2, title: 'Category Master', icon: '🧠', unlocked: true },
    { id: 3, title: 'Voice AI User', icon: '🎤', unlocked: false },
    { id: 4, title: 'Learning Champion', icon: '📚', unlocked: false },
  ]);

  // Load Fi Money connection status from storage
  useEffect(() => {
    loadFiConnectionStatus();
  }, []);

  // Handle route params for Fi connection
  useEffect(() => {
    if (fiConnected === 'true') {
      setIsConnected(true);
      saveFiConnectionStatus(true);
    }
  }, [fiConnected]);

  const loadFiConnectionStatus = async () => {
    try {
      const status = await AsyncStorage.getItem('fiMoneyConnected');
      if (status === 'true') {
        setIsConnected(true);
      }
    } catch (error) {
      console.log('Error loading Fi connection status:', error);
    }
  };

  const saveFiConnectionStatus = async (status: boolean) => {
    try {
      await AsyncStorage.setItem('fiMoneyConnected', status.toString());
    } catch (error) {
      console.log('Error saving Fi connection status:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const toggleBalanceVisibility = () => {
    setBalanceVisible(!balanceVisible);
  };

  const handleFiMoneyConnect = () => {
    if (isConnected) {
      Alert.alert(
        'Fi Money MCP',
        'Choose an action:',
        [
          {
            text: 'Settings',
            onPress: () => router.push('/fi/settings'),
          },
          {
            text: 'Disconnect',
            style: 'destructive',
            onPress: () => {
              Alert.alert(
                'Disconnect Fi Money',
                'Are you sure you want to disconnect your Fi Money account?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Disconnect',
                    style: 'destructive',
                    onPress: () => {
                      setIsConnected(false);
                      saveFiConnectionStatus(false);
                    },
                  },
                ]
              );
            },
          },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    } else {
      // Navigate to Fi MCP code entry
      router.push('/fi/fi-mcp-code');
    }
  };

  const renderPieChart = () => {
    const total = categoryData.wants.amount + categoryData.needs.amount + categoryData.desires.amount;
    const radius = 60;
    const centerX = 80;
    const centerY = 80;
    
    const wantsAngle = (categoryData.wants.amount / total) * 360;
    const needsAngle = (categoryData.needs.amount / total) * 360;
    const desiresAngle = (categoryData.desires.amount / total) * 360;

    return (
      <Svg width="160" height="160">
        <Path
          d={`M ${centerX} ${centerY} L ${centerX} ${centerY - radius} A ${radius} ${radius} 0 ${wantsAngle > 180 ? 1 : 0} 1 ${centerX + radius * Math.sin((wantsAngle * Math.PI) / 180)} ${centerY - radius * Math.cos((wantsAngle * Math.PI) / 180)} Z`}
          fill={categoryData.wants.color}
        />
        <Path
          d={`M ${centerX} ${centerY} L ${centerX + radius * Math.sin((wantsAngle * Math.PI) / 180)} ${centerY - radius * Math.cos((wantsAngle * Math.PI) / 180)} A ${radius} ${radius} 0 ${needsAngle > 180 ? 1 : 0} 1 ${centerX + radius * Math.sin(((wantsAngle + needsAngle) * Math.PI) / 180)} ${centerY - radius * Math.cos(((wantsAngle + needsAngle) * Math.PI) / 180)} Z`}
          fill={categoryData.needs.color}
        />
        <Path
          d={`M ${centerX} ${centerY} L ${centerX + radius * Math.sin(((wantsAngle + needsAngle) * Math.PI) / 180)} ${centerY - radius * Math.cos(((wantsAngle + needsAngle) * Math.PI) / 180)} A ${radius} ${radius} 0 ${desiresAngle > 180 ? 1 : 0} 1 ${centerX} ${centerY - radius} Z`}
          fill={categoryData.desires.color}
        />
        <Circle cx={centerX} cy={centerY} r="25" fill="#1A202C" />
        <SvgText x={centerX} y={centerY + 5} fontSize="12" fill="#FFFFFF" textAnchor="middle" fontWeight="bold">
          Total
        </SvgText>
      </Svg>
    );
  };

  const formatHiddenBalance = (amount: number) => {
    return '₹' + '•'.repeat(amount.toString().length);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e34c00" />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Good Morning! 👋</Text>
            <Text style={styles.userNameText}>Ready to LisstIn to your finances?</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#CBD5E0" />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <TouchableOpacity onPress={toggleBalanceVisibility}>
              <Ionicons 
                name={balanceVisible ? "eye-outline" : "eye-off-outline"} 
                size={20} 
                color="#A0AEC0" 
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceAmount}>
            {balanceVisible ? `₹${currentBalance.toLocaleString()}` : formatHiddenBalance(currentBalance)}
          </Text>
          <View style={styles.budgetRow}>
            <Text style={styles.budgetText}>
              Monthly Budget: {balanceVisible ? `₹${monthlyBudget.toLocaleString()}` : formatHiddenBalance(monthlyBudget)}
            </Text>
            <View style={styles.budgetIndicator}>
              <View style={[styles.budgetBar, { width: '65%' }]} />
            </View>
          </View>
        </View>

        {/* Fi Money MCP Connection */}
        <TouchableOpacity style={[
          styles.fiMoneyCard,
          isConnected && styles.fiMoneyCardConnected
        ]} onPress={handleFiMoneyConnect}>
          <View style={styles.fiMoneyContent}>
            <View style={styles.fiMoneyLeft}>
              <View style={[
                styles.fiMoneyIcon,
                isConnected ? styles.fiMoneyIconConnected : styles.fiMoneyIconDisconnected
              ]}>
                <Ionicons 
                  name={isConnected ? "checkmark-circle" : "link"} 
                  size={24} 
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.fiMoneyText}>
                <Text style={styles.fiMoneyTitle}>
                  {isConnected ? "Fi Money Connected" : "Connect to Fi Money MCP"}
                </Text>
                <Text style={styles.fiMoneySubtitle}>
                  {isConnected 
                    ? "Your transactions are syncing automatically" 
                    : "Seamlessly import your banking data"
                  }
                </Text>
              </View>
            </View>
            <View style={styles.fiMoneyArrow}>
              <Ionicons 
                name={isConnected ? "settings-outline" : "chevron-forward"} 
                size={20} 
                color="#A0AEC0" 
              />
            </View>
          </View>
          
          <View style={styles.fiMoneyStatus}>
            <View style={[
              styles.statusDot,
              { backgroundColor: isConnected ? '#10B981' : '#6B7280' }
            ]} />
            <Text style={[
              styles.statusText,
              { color: isConnected ? '#10B981' : '#6B7280' }
            ]}>
              {isConnected ? 'Connected & Syncing' : 'Not Connected'}
            </Text>
          </View>

          {!isConnected && (
            <View style={styles.fiMoneyBenefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="flash" size={14} color="#e34c00" />
                <Text style={styles.benefitText}>Auto transaction sync</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="shield-checkmark" size={14} color="#e34c00" />
                <Text style={styles.benefitText}>Bank-level security</Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="analytics" size={14} color="#e34c00" />
                <Text style={styles.benefitText}>Real-time insights</Text>
              </View>
            </View>
          )}

          {isConnected && (
            <View style={styles.connectedFeatures}>
              <View style={styles.featureItem}>
                <Ionicons name="sync" size={16} color="#10B981" />
                <Text style={styles.featureText}>Last sync: 2 minutes ago</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="trending-up" size={16} color="#10B981" />
                <Text style={styles.featureText}>24 transactions imported today</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/expense/add')}
            >
              <View style={styles.quickActionIcon}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Add Expense</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/voice/history')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="mic" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Voice Log</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/voice/voice-ai')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#45B7D1' }]}>
                <Ionicons name="call" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>AI Counselor</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickActionButton}
              onPress={() => router.push('/(tabs)/learning')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FFD700' }]}>
                <Ionicons name="school" size={24} color="#FFFFFF" />
              </View>
              <Text style={styles.quickActionText}>Learn</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Spending Categories */}
        <View style={styles.categoriesContainer}>
          <View style={styles.categoriesHeader}>
            <Text style={styles.sectionTitle}>Spending Categories</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContent}>
            <View style={styles.chartContainer}>
              {renderPieChart()}
            </View>

            <View style={styles.categoriesLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: categoryData.wants.color }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendCategory}>Wants</Text>
                  <Text style={styles.legendAmount}>
                    {balanceVisible ? `₹${categoryData.wants.amount.toLocaleString()}` : '₹••••••'}
                  </Text>
                </View>
                <Text style={styles.legendPercentage}>{categoryData.wants.percentage}%</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: categoryData.needs.color }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendCategory}>Needs</Text>
                  <Text style={styles.legendAmount}>
                    {balanceVisible ? `₹${categoryData.needs.amount.toLocaleString()}` : '₹••••••'}
                  </Text>
                </View>
                <Text style={styles.legendPercentage}>{categoryData.needs.percentage}%</Text>
              </View>

              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: categoryData.desires.color }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendCategory}>Desires</Text>
                  <Text style={styles.legendAmount}>
                    {balanceVisible ? `₹${categoryData.desires.amount.toLocaleString()}` : '₹••••••'}
                  </Text>
                </View>
                <Text style={styles.legendPercentage}>{categoryData.desires.percentage}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.transactionsContainer}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/expenses')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <View style={[
                  styles.transactionIcon,
                  { backgroundColor: transaction.amount > 0 ? '#e34c00' : '#FF6B6B' }
                ]}>
                  <Ionicons 
                    name={transaction.amount > 0 ? "arrow-down" : "arrow-up"} 
                    size={16} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  <Text style={styles.transactionTime}>{transaction.time}</Text>
                </View>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.amount > 0 ? '#e34c00' : '#FF6B6B' }
              ]}>
                {balanceVisible 
                  ? `${transaction.amount > 0 ? '+' : ''}₹${Math.abs(transaction.amount).toLocaleString()}`
                  : '₹••••'
                }
              </Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
            {achievements.map((achievement) => (
              <View key={achievement.id} style={[
                styles.achievementCard,
                { opacity: achievement.unlocked ? 1 : 0.5 }
              ]}>
                <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                <Text style={styles.achievementTitle}>{achievement.title}</Text>
                {achievement.unlocked && (
                  <View style={styles.achievementBadge}>
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userNameText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
  },
  balanceCard: {
    backgroundColor: '#1A202C',
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  budgetText: {
    fontSize: 12,
    color: '#A0AEC0',
    flex: 1,
  },
  budgetIndicator: {
    width: 100,
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 2,
    marginLeft: 12,
  },
  budgetBar: {
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 2,
  },
  fiMoneyCard: {
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  fiMoneyCardConnected: {
    borderColor: '#10B981',
    backgroundColor: '#1A202C',
  },
  fiMoneyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  fiMoneyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fiMoneyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  fiMoneyIconConnected: {
    backgroundColor: '#10B981',
  },
  fiMoneyIconDisconnected: {
    backgroundColor: '#e34c00',
  },
  fiMoneyText: {
    flex: 1,
  },
  fiMoneyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  fiMoneySubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  fiMoneyArrow: {
    padding: 4,
  },
  fiMoneyStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  fiMoneyBenefits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  benefitItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  benefitText: {
    fontSize: 12,
    color: '#CBD5E0',
    marginLeft: 6,
    fontWeight: '500',
  },
  connectedFeatures: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#CBD5E0',
    textAlign: 'center',
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  categoriesHeader: {
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
  categoriesContent: {
    backgroundColor: '#1A202C',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartContainer: {
    marginRight: 20,
  },
  categoriesLegend: {
    flex: 1,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
  },
  legendCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  legendAmount: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  legendPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E0',
  },
  transactionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  transactionTime: {
    fontSize: 12,
    color: '#A0AEC0',
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  achievementsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  achievementsScroll: {
    marginTop: 8,
  },
  achievementCard: {
    backgroundColor: '#1A202C',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#2D3748',
    position: 'relative',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 12,
    color: '#CBD5E0',
    textAlign: 'center',
    fontWeight: '500',
  },
  achievementBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#e34c00',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;