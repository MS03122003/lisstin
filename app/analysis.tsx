//npm install react-native-chart-kit react-native-svg
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Get status bar height for proper spacing
const getStatusBarHeight = () => {
  if (Platform.OS === 'android') {
    return StatusBar.currentHeight || 24;
  }
  return 44;
};

const QuicklyAnalysisScreen = () => {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('Week');

  const handleBackPress = () => {
    router.back();
  };

  // Dynamic data for different periods with multiple datasets
  const dynamicChartData = {
    Day: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43, 50],
          color: (opacity = 1) => `rgba(0, 212, 170, ${opacity})`, // Income
        },
        {
          data: [15, 30, 35, 60, 70, 25, 40],
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`, // Expenses
        },
      ],
    },
    Week: {
      labels: ['W1', 'W2', 'W3', 'W4'],
      datasets: [
        {
          data: [180, 250, 320, 190],
          color: (opacity = 1) => `rgba(0, 212, 170, ${opacity})`,
        },
        {
          data: [120, 180, 220, 140],
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        },
      ],
    },
    Month: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          data: [1200, 1800, 1500, 2200, 1900, 2100],
          color: (opacity = 1) => `rgba(0, 212, 170, ${opacity})`,
        },
        {
          data: [800, 1200, 1000, 1500, 1300, 1400],
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        },
      ],
    },
    Year: {
      labels: ['2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          data: [15000, 18000, 22000, 25000, 28000],
          color: (opacity = 1) => `rgba(0, 212, 170, ${opacity})`,
        },
        {
          data: [12000, 14000, 17000, 19000, 21000],
          color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
        },
      ],
    },
  };

  const formatCurrency = (amount: number): string => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Custom SVG Chart Component with Multiple Datasets and Tilted Labels
  const CustomMultiBarChart = ({ period }: { period: string }) => {
    const data = dynamicChartData[period as keyof typeof dynamicChartData];
    const chartWidth = screenWidth - 80;
    const chartHeight = 200;
    const barCount = data.labels.length;
    
    const yAxisLabelWidth = 50;
    const chartRightPadding = 20;
    const chartInnerPadding = yAxisLabelWidth + chartRightPadding;
    const usableWidth = chartWidth - chartInnerPadding;
    
    const groupSpacing = 20;
    const barSpacing = 4;
    const barsPerGroup = data.datasets.length;
    const groupWidth = (usableWidth - (groupSpacing * (barCount - 1))) / barCount;
    const barWidth = (groupWidth - (barSpacing * (barsPerGroup - 1))) / barsPerGroup;
    
    // Find max value across all datasets
    const allValues = data.datasets.flatMap(dataset => dataset.data);
    const maxAmount = Math.max(...allValues);
    const minBarHeight = 15;

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight + 100} style={styles.chart}>
          {/* Background grid lines */}
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <Line
                key={index}
                x1={yAxisLabelWidth + 10}
                y1={20 + (chartHeight * ratio)}
                x2={chartWidth - 10}
                y2={20 + (chartHeight * ratio)}
                stroke="#2D3748"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
          </G>

          {/* Y-axis labels */}
          <G>
            {[1, 0.75, 0.5, 0.25, 0].map((ratio, index) => (
              <SvgText
                key={index}
                x={yAxisLabelWidth - 5}
                y={25 + (chartHeight * (1 - ratio))}
                textAnchor="end"
                fontSize="11"
                fill="#A0AEC0"
                fontWeight="500"
              >
                {formatCurrency(maxAmount * ratio)}
              </SvgText>
            ))}
          </G>

          {/* Bars for each group */}
          {data.labels.map((label, groupIndex) => {
            const groupX = yAxisLabelWidth + 10 + (groupIndex * (groupWidth + groupSpacing));
            
            return (
              <G key={`group-${groupIndex}`}>
                {data.datasets.map((dataset, datasetIndex) => {
                  const barX = groupX + (datasetIndex * (barWidth + barSpacing));
                  const barHeight = Math.max(
                    minBarHeight, 
                    (dataset.data[groupIndex] / maxAmount) * (chartHeight - 40)
                  );
                  const barY = chartHeight - barHeight + 20;
                  const barColor = datasetIndex === 0 ? '#00D4AA' : '#FF6B6B';

                  return (
                    <G key={`bar-${groupIndex}-${datasetIndex}`}>
                      {/* Bar shadow */}
                      <Rect
                        x={barX + 1}
                        y={barY + 1}
                        width={barWidth}
                        height={barHeight}
                        fill={`${barColor}40`} // 25% opacity
                        rx="4"
                      />
                      
                      {/* Main bar */}
                      <Rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight}
                        fill={barColor}
                        rx="4"
                      />
                      
                      {/* Gradient overlay */}
                      <Rect
                        x={barX}
                        y={barY}
                        width={barWidth}
                        height={barHeight / 3}
                        fill="rgba(255, 255, 255, 0.2)"
                        rx="4"
                      />
                      
                      {/* Amount label on top of bar */}
                      <SvgText
                        x={barX + barWidth / 2}
                        y={barY - 5}
                        textAnchor="middle"
                        fontSize="9"
                        fill="#E2E8F0"
                        fontWeight="bold"
                      >
                        {formatCurrency(dataset.data[groupIndex])}
                      </SvgText>
                    </G>
                  );
                })}
                
                {/* X-axis label - TILTED at -45 degrees */}
                <SvgText
                  x={groupX + groupWidth / 2}
                  y={chartHeight + 50}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#CBD5E0"
                  fontWeight="500"
                  transform={`rotate(-45, ${groupX + groupWidth / 2}, ${chartHeight + 50})`}
                >
                  {label}
                </SvgText>
              </G>
            );
          })}

          {/* X-axis line */}
          <Line
            x1={yAxisLabelWidth + 10}
            y1={chartHeight + 20}
            x2={chartWidth - 10}
            y2={chartHeight + 20}
            stroke="#2D3748"
            strokeWidth="2"
          />
          
          {/* Y-axis line */}
          <Line
            x1={yAxisLabelWidth + 10}
            y1={20}
            x2={yAxisLabelWidth + 10}
            y2={chartHeight + 20}
            stroke="#2D3748"
            strokeWidth="2"
          />
        </Svg>
      </View>
    );
  };

  const expenses = [
    {
      id: 1,
      title: 'Salary',
      date: '18:27 - April 30',
      category: 'Monthly',
      amount: '₹4,000.00',
      isIncome: true,
      icon: 'card-outline',
      iconBg: '#1E3A8A',
      iconColor: '#60A5FA',
    },
    {
      id: 2,
      title: 'Groceries',
      date: '17:00 - April 24',
      category: 'Pantry',
      amount: '-₹100.00',
      isIncome: false,
      icon: 'bag-outline',
      iconBg: '#92400E',
      iconColor: '#FBBF24',
    },
    {
      id: 3,
      title: 'Rent',
      date: '8:30 - April 15',
      category: 'Rent',
      amount: '-₹674.40',
      isIncome: false,
      icon: 'home-outline',
      iconBg: '#1F2937',
      iconColor: '#9CA3AF',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: getStatusBarHeight() + 20 }]}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analytics</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.notificationBadge} />
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.savingsCard}>
            <View style={styles.savingsIcon}>
              <Ionicons name="car-outline" size={32} color="#00D4AA" />
            </View>
            <Text style={styles.savingsTitle}>Savings</Text>
            <Text style={styles.savingsSubtitle}>On Goals</Text>
          </View>

          <View style={styles.statsCards}>
            <View style={styles.statCard}>
              <View style={styles.statIcon}>
                <Ionicons name="cube-outline" size={20} color="#00D4AA" />
              </View>
              <Text style={styles.statAmount}>₹4,000.00</Text>
              <Text style={styles.statLabel}>Revenue Last Week</Text>
              <View style={styles.statProgress}>
                <View style={[styles.progressBar, { width: '70%' }]} />
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: '#FF6B6B' }]}>
                <Ionicons name="restaurant-outline" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.statAmount}>-₹100.00</Text>
              <Text style={styles.statLabel}>Food Last Week</Text>
              <View style={styles.statProgress}>
                <View style={[styles.progressBar, { width: '30%', backgroundColor: '#FF6B6B' }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Dynamic Chart Section */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Income vs Expenses</Text>
            <View style={styles.chartControls}>
              <TouchableOpacity style={styles.chartButton}>
                <Ionicons name="search-outline" size={18} color="#A0AEC0" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chartButton}>
                <Ionicons name="grid-outline" size={18} color="#A0AEC0" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Chart Legend */}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#00D4AA' }]} />
              <Text style={styles.legendText}>Income</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.legendText}>Expenses</Text>
            </View>
          </View>

          {/* Custom Multi-Dataset Chart */}
          <CustomMultiBarChart period={selectedPeriod} />

          {/* Time Period Selector */}
          <View style={styles.periodSelector}>
            {['Day', 'Week', 'Month', 'Year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.selectedPeriod
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodText,
                  selectedPeriod === period && styles.selectedPeriodText
                ]}>
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Expenses List */}
        <View style={styles.expensesSection}>
          {expenses.map((expense) => (
            <TouchableOpacity key={expense.id} style={styles.expenseItem}>
              <View style={[styles.expenseIcon, { backgroundColor: expense.iconBg }]}>
                <Ionicons name={expense.icon as any} size={24} color={expense.iconColor} />
              </View>
              <View style={styles.expenseDetails}>
                <Text style={styles.expenseTitle}>{expense.title}</Text>
                <Text style={styles.expenseDate}>
                  {expense.date} | {expense.category}
                </Text>
              </View>
              <Text style={[
                styles.expenseAmount,
                { color: expense.isIncome ? '#00D4AA' : '#FF6B6B' }
              ]}>
                {expense.amount}
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
    backgroundColor: '#0F1419',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#00D4AA',
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
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    zIndex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    gap: 15,
  },
  savingsCard: {
    backgroundColor: '#1A202C',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  savingsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 212, 170, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  savingsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  savingsSubtitle: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  statsCards: {
    flex: 1,
    gap: 15,
  },
  statCard: {
    backgroundColor: '#1A202C',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#0F1419',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  statProgress: {
    height: 4,
    backgroundColor: '#2D3748',
    borderRadius: 2,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00D4AA',
    borderRadius: 2,
  },
  chartSection: {
    backgroundColor: '#1A202C',
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chartControls: {
    flexDirection: 'row',
    gap: 10,
  },
  chartButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#2D3748',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    backgroundColor: 'transparent',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#2D3748',
    borderRadius: 25,
    padding: 4,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 20,
  },
  selectedPeriod: {
    backgroundColor: '#00D4AA',
  },
  periodText: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  selectedPeriodText: {
    color: '#FFFFFF',
  },
  expensesSection: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  expenseIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default QuicklyAnalysisScreen;
