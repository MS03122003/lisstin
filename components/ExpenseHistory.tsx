import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import Svg, { Rect, Text as SvgText, Line, G } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface ExpenseData {
  label: string;
  amount: number;
  date: string;
}

interface ExpenseHistoryProps {
  onPeriodChange?: (period: '7days' | '7weeks' | '7months') => void;
}

type TimePeriod = '7days' | '7weeks' | '7months';

const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ onPeriodChange }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7days');
  const [showDropdown, setShowDropdown] = useState(false);
  const [expenseData, setExpenseData] = useState<ExpenseData[]>([]);

  // Mock data generator with abbreviated labels
  const generateMockData = (period: TimePeriod): ExpenseData[] => {
    switch (period) {
      case '7days':
        return [
          { label: 'Mon', amount: 2850, date: '2025-07-18' },
          { label: 'Tue', amount: 1950, date: '2025-07-19' },
          { label: 'Wed', amount: 6250, date: '2025-07-20' },
          { label: 'Thu', amount: 1200, date: '2025-07-21' },
          { label: 'Fri', amount: 3750, date: '2025-07-22' },
          { label: 'Sat', amount: 2100, date: '2025-07-23' },
          { label: 'Sun', amount: 3200, date: '2025-07-24' },
        ];
      
      case '7weeks':
        return [
          { label: 'Week1', amount: 18500, date: '2025-06-05' },
          { label: 'Week2', amount: 15200, date: '2025-06-12' },
          { label: 'Week3', amount: 22800, date: '2025-06-19' },
          { label: 'Week4', amount: 19500, date: '2025-06-26' },
          { label: 'Week5', amount: 16800, date: '2025-07-03' },
          { label: 'Week6', amount: 25200, date: '2025-07-10' },
          { label: 'Week7', amount: 21400, date: '2025-07-17' },
        ];
      
      case '7months':
        return [
          { label: 'Jan', amount: 75000, date: '2025-01-01' },
          { label: 'Feb', amount: 68500, date: '2025-02-01' },
          { label: 'Mar', amount: 82500, date: '2025-03-01' },
          { label: 'Apr', amount: 79200, date: '2025-04-01' },
          { label: 'May', amount: 85800, date: '2025-05-01' },
          { label: 'Jun', amount: 91200, date: '2025-06-01' },
          { label: 'Jul', amount: 72800, date: '2025-07-01' },
        ];
      
      default:
        return [];
    }
  };

  useEffect(() => {
    setExpenseData(generateMockData(selectedPeriod));
  }, [selectedPeriod]);

  const handlePeriodSelect = (period: TimePeriod) => {
    setSelectedPeriod(period);
    setShowDropdown(false);
    onPeriodChange?.(period);
  };

  const getPeriodDisplayName = (period: TimePeriod) => {
    switch (period) {
      case '7days': return 'Last 7 Days';
      case '7weeks': return 'Last 7 Weeks';
      case '7months': return 'Last 7 Months';
      default: return 'Last 7 Days';
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const ResponsiveBarChart = ({ data }: { data: ExpenseData[] }) => {
    const containerPadding = 16;
    const chartWidth = width - (containerPadding * 2) - 48; // Account for container padding
    const chartHeight = 220;
    const barCount = data.length;
    
    // Reserve more space for Y-axis labels
    const yAxisLabelWidth = 50;
    const chartRightPadding = 20;
    const chartInnerPadding = yAxisLabelWidth + chartRightPadding;
    const usableWidth = chartWidth - chartInnerPadding;
    
    // Responsive bar spacing and width calculation
    const minBarSpacing = 8;
    const maxBarSpacing = 16;
    const minBarWidth = 25;
    
    // Calculate optimal spacing and bar width to fit all bars
    let barSpacing = maxBarSpacing;
    let barWidth = (usableWidth - (barSpacing * (barCount - 1))) / barCount;
    
    // If bars are too narrow, reduce spacing
    if (barWidth < minBarWidth) {
      barSpacing = minBarSpacing;
      barWidth = (usableWidth - (barSpacing * (barCount - 1))) / barCount;
    }
    
    // Ensure minimum bar width
    barWidth = Math.max(barWidth, minBarWidth);
    
    const maxAmount = Math.max(...data.map(d => d.amount));
    const minBarHeight = 20;

    return (
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight + 80} style={styles.chart}>
          {/* Background grid lines */}
          <G>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <Line
                key={index}
                x1={yAxisLabelWidth + 10}
                y1={20 + (chartHeight * ratio)}
                x2={chartWidth - 10}
                y2={20 + (chartHeight * ratio)}
                stroke="#4A5568"
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

          {/* Bars */}
          {data.map((item, index) => {
            const barHeight = Math.max(minBarHeight, (item.amount / maxAmount) * (chartHeight - 40));
            const x = yAxisLabelWidth + 10 + (index * (barWidth + barSpacing));
            const y = chartHeight - barHeight + 20;

            return (
              <G key={index}>
                {/* Bar shadow */}
                <Rect
                  x={x + 2}
                  y={y + 2}
                  width={barWidth}
                  height={barHeight}
                  fill="rgba(0, 212, 170, 0.3)"
                  rx="6"
                />
                
                {/* Main bar */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="#00D4AA"
                  rx="6"
                />
                
                {/* Gradient overlay */}
                <Rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight / 3}
                  fill="rgba(255, 255, 255, 0.2)"
                  rx="6"
                />
                
                {/* Amount label on top of bar */}
                <SvgText
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#E2E8F0"
                  fontWeight="bold"
                >
                  {formatCurrency(item.amount)}
                </SvgText>
                
                {/* X-axis label */}
                <SvgText
                  x={x + barWidth / 2}
                  y={chartHeight + 40}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#CBD5E0"
                  fontWeight="500"
                >
                  {item.label}
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
            stroke="#4A5568"
            strokeWidth="2"
          />
          
          {/* Y-axis line */}
          <Line
            x1={yAxisLabelWidth + 10}
            y1={20}
            x2={yAxisLabelWidth + 10}
            y2={chartHeight + 20}
            stroke="#4A5568"
            strokeWidth="2"
          />
        </Svg>
      </View>
    );
  };

  // Move these calculations inside the component function, after expenseData is defined
  const totalExpense = expenseData.reduce((sum, item) => sum + item.amount, 0);
  const averageExpense = expenseData.length > 0 ? totalExpense / expenseData.length : 0;

  return (
    <View style={styles.containerWrapper}>
      <View style={styles.container}>
        {/* Header with Dropdown */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Expense History</Text>
            <Text style={styles.subtitle}>Track your spending patterns</Text>
          </View>
          
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowDropdown(!showDropdown)}
            >
              <Text style={styles.dropdownText}>
                {getPeriodDisplayName(selectedPeriod)}
              </Text>
              <Text style={[
                styles.dropdownArrow, 
                { transform: [{ rotate: showDropdown ? '180deg' : '0deg' }] }
              ]}>
                ▼
              </Text>
            </TouchableOpacity>

            {showDropdown && (
              <View style={styles.dropdownMenu}>
                {(['7days', '7weeks', '7months'] as TimePeriod[]).map((period) => (
                  <TouchableOpacity
                    key={period}
                    style={[
                      styles.dropdownItem,
                      selectedPeriod === period && styles.dropdownItemSelected
                    ]}
                    onPress={() => handlePeriodSelect(period)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedPeriod === period && styles.dropdownItemTextSelected
                    ]}>
                      {getPeriodDisplayName(period)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Spent</Text>
            <Text style={styles.statValue}>{formatCurrency(totalExpense)}</Text>
            <Text style={styles.statChange}>+12.5% from last period</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Daily Average</Text>
            <Text style={styles.statValue}>{formatCurrency(averageExpense)}</Text>
            <Text style={styles.statChange}>-5.2% from last period</Text>
          </View>
        </View>

        {/* Responsive Bar Chart */}
        <ResponsiveBarChart data={expenseData} />

        {/* Period Info */}
        <View style={styles.periodInfo}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={styles.legendColor} />
              <Text style={styles.legendText}>Expenses (₹)</Text>
            </View>
          </View>
          <Text style={styles.periodInfoText}>
            Displaying {expenseData.length} data points for {getPeriodDisplayName(selectedPeriod).toLowerCase()}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: '#1A202C',
    width: '100%',
    maxWidth: width - 32,
    marginBottom: 20,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A5568',
    minWidth: 130,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownText: {
    fontSize: 13,
    color: '#E2E8F0',
    fontWeight: '600',
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#A0AEC0',
    marginLeft: 4,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '110%',
    right: 0,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4A5568',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    minWidth: 160,
    zIndex: 1001,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dropdownItemSelected: {
    backgroundColor: '#0F1419',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#E2E8F0',
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: '#00D4AA',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2D3748',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  statLabel: {
    fontSize: 12,
    color: '#A0AEC0',
    marginBottom: 6,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  statChange: {
    fontSize: 10,
    color: '#00D4AA',
    fontWeight: '500',
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    backgroundColor: 'transparent',
  },
  periodInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00D4AA',
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  periodInfoText: {
    fontSize: 12,
    color: '#718096',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ExpenseHistory;