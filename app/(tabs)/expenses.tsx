import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Expense {
  id: number;
  description: string;
  amount: number;
  category: 'wants' | 'needs' | 'desires';
  subcategory: string;
  date: string;
  time: string;
  paymentMethod: string;
  aiConfidence: number;
  tags: string[];
}

const Expenses = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [sortBy, setSortBy] = useState('date');

  // Form state for add/edit modal
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'needs' as 'wants' | 'needs' | 'desires',
    subcategory: '',
    paymentMethod: 'UPI',
    tags: '',
  });

  const categories = [
    { id: 'all', name: 'All', color: '#e34c00', count: 0 },
    { id: 'wants', name: 'Wants', color: '#FF6B6B', count: 0 },
    { id: 'needs', name: 'Needs', color: '#e34c00', count: 0 },
    { id: 'desires', name: 'Desires', color: '#45B7D1', count: 0 },
  ];

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 1,
      description: 'Starbucks Coffee',
      amount: 350,
      category: 'wants',
      subcategory: 'Food & Dining',
      date: '2025-01-24',
      time: '09:30 AM',
      paymentMethod: 'UPI',
      aiConfidence: 95,
      tags: ['coffee', 'morning'],
    },
    {
      id: 2,
      description: 'Grocery Shopping',
      amount: 2400,
      category: 'needs',
      subcategory: 'Groceries',
      date: '2025-01-24',
      time: '07:15 PM',
      paymentMethod: 'Card',
      aiConfidence: 98,
      tags: ['groceries', 'essentials'],
    },
    {
      id: 3,
      description: 'Movie Tickets',
      amount: 600,
      category: 'wants',
      subcategory: 'Entertainment',
      date: '2025-01-23',
      time: '06:45 PM',
      paymentMethod: 'UPI',
      aiConfidence: 92,
      tags: ['entertainment', 'weekend'],
    },
    {
      id: 4,
      description: 'iPhone 15 Pro',
      amount: 134900,
      category: 'desires',
      subcategory: 'Electronics',
      date: '2025-01-22',
      time: '02:30 PM',
      paymentMethod: 'EMI',
      aiConfidence: 100,
      tags: ['gadget', 'phone'],
    },
    {
      id: 5,
      description: 'Uber Ride',
      amount: 180,
      category: 'needs',
      subcategory: 'Transportation',
      date: '2025-01-22',
      time: '11:20 AM',
      paymentMethod: 'UPI',
      aiConfidence: 89,
      tags: ['transport', 'daily'],
    },
  ]);

  // Update category counts dynamically
  const getCategoriesWithCounts = () => {
    const counts = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? expenses.length : (counts[cat.id] || 0)
    }));
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'wants': return '#FF6B6B';
      case 'needs': return '#e34c00';
      case 'desires': return '#45B7D1';
      default: return '#6B7280';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'upi': return 'phone-portrait-outline';
      case 'card': return 'card-outline';
      case 'cash': return 'cash-outline';
      case 'emi': return 'time-outline';
      default: return 'wallet-outline';
    }
  };

  // Reset form data
  const resetFormData = () => {
    setFormData({
      description: '',
      amount: '',
      category: 'needs',
      subcategory: '',
      paymentMethod: 'UPI',
      tags: '',
    });
  };

  // Add new expense
  const handleAddExpense = () => {
    setEditingExpense(null);
    resetFormData();
    setShowAddEditModal(true);
  };

  // Edit expense
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      subcategory: expense.subcategory,
      paymentMethod: expense.paymentMethod,
      tags: expense.tags.join(', '),
    });
    setShowAddEditModal(true);
  };

  // Save expense (add or edit)
  const handleSaveExpense = () => {
    if (!formData.description.trim() || !formData.amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const now = new Date();
    const expenseData: Expense = {
      id: editingExpense ? editingExpense.id : Date.now(),
      description: formData.description.trim(),
      amount: amount,
      category: formData.category,
      subcategory: formData.subcategory.trim() || 'General',
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      paymentMethod: formData.paymentMethod,
      aiConfidence: Math.floor(Math.random() * 20) + 80, // Random confidence 80-100%
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0),
    };

    if (editingExpense) {
      // Update existing expense
      setExpenses(prevExpenses =>
        prevExpenses.map(expense =>
          expense.id === editingExpense.id ? expenseData : expense
        )
      );
      Alert.alert('Success', 'Expense updated successfully');
    } else {
      // Add new expense
      setExpenses(prevExpenses => [expenseData, ...prevExpenses]);
      Alert.alert('Success', 'Expense added successfully');
    }

    setShowAddEditModal(false);
    resetFormData();
    setEditingExpense(null);
  };

  // Delete expense
  const handleDeleteExpense = (id: number) => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
            Alert.alert('Success', 'Expense deleted successfully');
          },
        },
      ]
    );
  };

  const handleVoiceAdd = () => {
    Alert.alert('Voice Input', 'Voice input feature coming soon!');
  };

  const handleAnalytics = () => {
    Alert.alert('Analytics', 'Analytics feature coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Expenses</Text>
      </View>

      {/* Search and Action Bar */}
      <View style={styles.searchActionBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search expenses..."
            placeholderTextColor="#6B7280"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="options-outline" size={18} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      {/* Single Line Quick Actions Bar */}
      <View style={styles.quickActionsBar}>
        <TouchableOpacity 
          style={styles.quickActionButton}
          onPress={handleAddExpense}
        >
          <Ionicons name="add" size={14} color="#FFFFFF" />
          <Text style={styles.quickActionText}>Add</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButtonSecondary}
          onPress={handleVoiceAdd}
        >
          <Ionicons name="mic" size={14} color="#e34c00" />
          <Text style={styles.quickActionTextSecondary}>Voice</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.quickActionButtonSecondary}
          onPress={handleAnalytics}
        >
          <Ionicons name="pie-chart" size={14} color="#e34c00" />
          <Text style={styles.quickActionTextSecondary}>Analytics</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categoriesContent}>
          {getCategoriesWithCounts().map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryChip,
                {
                  backgroundColor: selectedCategory === category.id ? category.color : '#1A202C',
                  borderColor: category.color,
                }
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryChipText,
                { color: selectedCategory === category.id ? '#FFFFFF' : category.color }
              ]}>
                {category.name} ({category.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Expenses List */}
      <ScrollView style={styles.expensesList} showsVerticalScrollIndicator={false}>
        {filteredExpenses.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#4A5568" />
            <Text style={styles.emptyStateTitle}>No expenses found</Text>
            <Text style={styles.emptyStateDescription}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Start by adding your first expense'}
            </Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={handleAddExpense}
            >
              <Text style={styles.emptyStateButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredExpenses.map((expense) => (
            <View key={expense.id} style={styles.expenseCard}>
              <View style={styles.expenseHeader}>
                <View style={styles.expenseMainInfo}>
                  <View style={styles.expenseIconContainer}>
                    <View style={[
                      styles.categoryIndicator,
                      { backgroundColor: getCategoryColor(expense.category) }
                    ]} />
                    <Ionicons 
                      name={getPaymentMethodIcon(expense.paymentMethod)} 
                      size={20} 
                      color="#CBD5E0" 
                    />
                  </View>
                  <View style={styles.expenseDetails}>
                    <Text style={styles.expenseDescription}>{expense.description}</Text>
                    <Text style={styles.expenseSubcategory}>{expense.subcategory}</Text>
                    <View style={styles.expenseMeta}>
                      <Text style={styles.expenseDate}>{expense.date}</Text>
                      <Text style={styles.expenseTime}>{expense.time}</Text>
                      <View style={styles.aiConfidenceContainer}>
                        <Ionicons name="sparkles" size={12} color="#FFD700" />
                        <Text style={styles.aiConfidenceText}>{expense.aiConfidence}%</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.expenseActions}>
                  <Text style={styles.expenseAmount}>₹{expense.amount.toLocaleString()}</Text>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={styles.actionButtonSmall}
                      onPress={() => handleEditExpense(expense)}
                    >
                      <Ionicons name="create-outline" size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButtonSmall}
                      onPress={() => handleDeleteExpense(expense.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Tags */}
              {expense.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {expense.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Add/Edit Expense Modal */}
      <Modal
        visible={showAddEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.addEditModalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingExpense ? 'Edit Expense' : 'Add New Expense'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddEditModal(false)}>
                <Ionicons name="close" size={24} color="#CBD5E0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {/* Description */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Description *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter expense description"
                  placeholderTextColor="#6B7280"
                  value={formData.description}
                  onChangeText={(text) => setFormData({...formData, description: text})}
                />
              </View>

              {/* Amount */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Amount *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="Enter amount"
                  placeholderTextColor="#6B7280"
                  value={formData.amount}
                  onChangeText={(text) => setFormData({...formData, amount: text})}
                  keyboardType="numeric"
                />
              </View>

              {/* Category */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.categorySelector}>
                  {(['needs', 'wants', 'desires'] as const).map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categorySelectorOption,
                        {
                          backgroundColor: formData.category === cat ? getCategoryColor(cat) : '#2D3748',
                          borderColor: getCategoryColor(cat),
                        }
                      ]}
                      onPress={() => setFormData({...formData, category: cat})}
                    >
                      <Text style={[
                        styles.categorySelectorText,
                        { color: formData.category === cat ? '#FFFFFF' : getCategoryColor(cat) }
                      ]}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Subcategory */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Subcategory</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., Food & Dining, Transportation"
                  placeholderTextColor="#6B7280"
                  value={formData.subcategory}
                  onChangeText={(text) => setFormData({...formData, subcategory: text})}
                />
              </View>

              {/* Payment Method */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Payment Method</Text>
                <View style={styles.paymentMethodSelector}>
                  {['UPI', 'Card', 'Cash', 'EMI'].map((method) => (
                    <TouchableOpacity
                      key={method}
                      style={[
                        styles.paymentMethodOption,
                        {
                          backgroundColor: formData.paymentMethod === method ? '#e34c00' : '#2D3748',
                        }
                      ]}
                      onPress={() => setFormData({...formData, paymentMethod: method})}
                    >
                      <Ionicons 
                        name={getPaymentMethodIcon(method)} 
                        size={18} 
                        color={formData.paymentMethod === method ? '#FFFFFF' : '#CBD5E0'} 
                      />
                      <Text style={[
                        styles.paymentMethodText,
                        { color: formData.paymentMethod === method ? '#FFFFFF' : '#CBD5E0' }
                      ]}>
                        {method}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tags */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Tags (comma separated)</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., coffee, morning, daily"
                  placeholderTextColor="#6B7280"
                  value={formData.tags}
                  onChangeText={(text) => setFormData({...formData, tags: text})}
                />
              </View>
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.modalActionButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowAddEditModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleSaveExpense}
              >
                <Text style={styles.saveButtonText}>
                  {editingExpense ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter & Sort</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="close" size={24} color="#CBD5E0" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Sort By</Text>
              {['date', 'amount', 'category'].map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.modalOption}
                  onPress={() => setSortBy(option)}
                >
                  <Text style={styles.modalOptionText}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </Text>
                  {sortBy === option && (
                    <Ionicons name="checkmark" size={20} color="#e34c00" />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              style={styles.applyFiltersButton}
              onPress={() => setShowFilterModal(false)}
            >
              <Text style={styles.applyFiltersButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1419',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 40,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#FFFFFF',
  },
  actionButton: {
    backgroundColor: '#1A202C',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  quickActionsBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 10,
    gap: 8,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e34c00',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 4,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickActionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A202C',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e34c00',
    gap: 4,
  },
  quickActionTextSecondary: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e34c00',
  },
  categoriesContainer: {
    paddingVertical: 6,
  },
  categoriesContent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  expensesList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  expenseCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  expenseMainInfo: {
    flex: 1,
    flexDirection: 'row',
  },
  expenseIconContainer: {
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    position: 'absolute',
    left: -8,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  expenseSubcategory: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  expenseTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  aiConfidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  aiConfidenceText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  expenseActions: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonSmall: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#2D3748',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 6,
  },
  tag: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#CBD5E0',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 32,
  },
  emptyStateButton: {
    backgroundColor: '#e34c00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A202C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  addEditModalContent: {
    backgroundColor: '#1A202C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  formContainer: {
    maxHeight: 400,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBD5E0',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#2D3748',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4A5568',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  categorySelectorOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  categorySelectorText: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentMethodSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentMethodOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    minWidth: '45%',
    justifyContent: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalActionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#2D3748',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBD5E0',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#e34c00',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalSection: {
    marginBottom: 32,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#CBD5E0',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#2D3748',
    borderRadius: 12,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  applyFiltersButton: {
    backgroundColor: '#e34c00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  applyFiltersButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default Expenses;