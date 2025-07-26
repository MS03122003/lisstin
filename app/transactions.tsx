import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Get status bar height for proper spacing
const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 24;
  }
  return 44; // Default iOS status bar height
};

const TransactionScreen = () => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back(); // Navigate back to previous screen
  };

  const transactions = [
    {
      id: 1,
      title: 'Salary',
      date: '18:27 - April 30',
      type: 'Monthly',
      amount: '₹4,000.00',
      isIncome: true,
      icon: 'card',
      iconBg: '#1E3A8A', // Dark blue
      iconColor: '#60A5FA', // Light blue
    },
    {
      id: 2,
      title: 'Groceries',
      date: '17:00 - April 30',
      type: 'Pantry',
      amount: '-₹100.00',
      isIncome: false,
      icon: 'bag',
      iconBg: '#92400E', // Dark orange
      iconColor: '#FBBF24', // Light orange
    },
    {
      id: 3,
      title: 'Rent',
      date: '8:30 - April 18',
      type: 'Rent',
      amount: '-₹674.40',
      isIncome: false,
      icon: 'home',
      iconBg: '#1F2937', // Dark gray instead of green
      iconColor: '#9CA3AF', // Light gray instead of green
    },
    {
      id: 4,
      title: 'Transport',
      date: '6:30 - April 08',
      type: 'Fuel',
      amount: '-₹4.13',
      isIncome: false,
      icon: 'car',
      iconBg: '#7C2D12', // Dark red-brown
      iconColor: '#FCA5A5', // Light red
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header - Much smaller green section */}
        <View style={[styles.header, { paddingTop: getStatusBarHeight() + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Account Balance</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Balance Cards - Now on dark background */}
        <View style={styles.balanceSection}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>₹7,783.00</Text>
          </View>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Total Expenses</Text>
            <Text style={styles.balanceAmount}>₹1,187.40</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '30%' }]} />
          </View>
          <Text style={styles.progressText}>₹20,000.00</Text>
        </View>

        {/* Income and Expense Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, styles.incomeCard]}>
            <Ionicons name="trending-up" size={24} color="#00D4AA" />
            <Text style={styles.statAmount}>₹4,000.00</Text>
            <Text style={styles.statLabel}>Income</Text>
          </View>
          <View style={[styles.statCard, styles.expenseCard]}>
            <Ionicons name="trending-down" size={24} color="#FF6B6B" />
            <Text style={styles.statAmount}>₹1,187.40</Text>
            <Text style={styles.statLabel}>Expense</Text>
          </View>
        </View>

        {/* Achievement Badge */}
        <View style={styles.achievementContainer}>
          <Text style={styles.achievementText}>
            30% Of Your Expenses, Looks Good.
          </Text>
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionSection}>
          <View style={styles.transactionHeader}>
            <Text style={styles.sectionTitle}>Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Transaction List */}
          {transactions.map((transaction) => (
            <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
              <View style={[styles.transactionIcon, { backgroundColor: transaction.iconBg }]}>
                <Ionicons 
                  name={transaction.icon as any} 
                  size={24} 
                  color={transaction.iconColor} 
                />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>
                  {transaction.date} | {transaction.type}
                </Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                { color: transaction.isIncome ? '#00D4AA' : '#FF6B6B' }
              ]}>
                {transaction.amount}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419', // Changed to dark background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20, // Reduced padding
    backgroundColor: '#00D4AA', // Only header has green
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  balanceSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
    gap: 15,
  },
  balanceCard: {
    flex: 1,
    backgroundColor: '#1A202C', // Dark card background
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    opacity: 0.8,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#2D3748',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'right',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1A202C', // Darker card background
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  incomeCard: {
    // Additional styling for income card if needed
  },
  expenseCard: {
    // Additional styling for expense card if needed
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    marginTop: 4,
  },
  achievementContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  achievementText: {
    fontSize: 14,
    color: '#CBD5E0',
    textAlign: 'center',
    opacity: 0.9,
  },
  transactionSection: {
    backgroundColor: '#1A202C',
    paddingTop: 25,
    paddingHorizontal: 20,
    minHeight: 400,
    borderWidth: 1,
    borderColor: '#2D3748',
    borderBottomWidth: 0,
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAllText: {
    fontSize: 14,
    color: '#00D4AA',
    fontWeight: '500',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  transactionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  transactionDate: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionScreen;
