import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const EditExpense = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'wants' | 'needs' | 'desires' | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [originalExpense, setOriginalExpense] = useState<any>(null);

  const categories = {
    wants: {
      name: 'Wants',
      color: '#FF6B6B',
      icon: 'heart-outline',
      subcategories: ['Coffee & Snacks', 'Entertainment', 'Shopping', 'Dining Out', 'Hobbies'],
    },
    needs: {
      name: 'Needs',
      color: '#e34c00',
      icon: 'home-outline',
      subcategories: ['Groceries', 'Transportation', 'Bills', 'Medical', 'Education'],
    },
    desires: {
      name: 'Desires',
      color: '#45B7D1',
      icon: 'star-outline',
      subcategories: ['Gadgets', 'Travel', 'Luxury Items', 'Investments', 'Premium Services'],
    }
  };

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: 'phone-portrait-outline' },
    { id: 'card', name: 'Card', icon: 'card-outline' },
    { id: 'cash', name: 'Cash', icon: 'cash-outline' },
    { id: 'wallet', name: 'Wallet', icon: 'wallet-outline' },
  ];

  useEffect(() => {
    // Simulate loading expense data
    const mockExpense = {
      id: id,
      amount: '350',
      description: 'Coffee and pastry',
      category: 'wants',
      subcategory: 'Coffee & Snacks',
      paymentMethod: 'upi',
    };
    
    setOriginalExpense(mockExpense);
    setAmount(mockExpense.amount);
    setDescription(mockExpense.description);
    setSelectedCategory(mockExpense.category as 'wants' | 'needs' | 'desires');
    setSelectedSubcategory(mockExpense.subcategory);
    setPaymentMethod(mockExpense.paymentMethod);
  }, [id]);

  const handleUpdateExpense = () => {
    if (!amount || !description || !selectedCategory) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    const updatedExpense = {
      id: id,
      amount: parseFloat(amount),
      description,
      category: selectedCategory,
      subcategory: selectedSubcategory,
      paymentMethod,
      updatedAt: new Date().toISOString(),
    };

    console.log('Updating expense:', updatedExpense);
    Alert.alert('Success', 'Expense updated successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const handleDeleteExpense = () => {
    Alert.alert(
      'Delete Expense',
      'Are you sure you want to delete this expense? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Deleting expense:', id);
            Alert.alert('Deleted', 'Expense has been deleted.', [
              { text: 'OK', onPress: () => router.replace('/(tabs)/expenses') }
            ]);
          },
        },
      ]
    );
  };

  if (!originalExpense) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Expense</Text>
          <TouchableOpacity onPress={handleDeleteExpense}>
            <Ionicons name="trash-outline" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Amount Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount</Text>
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              placeholderTextColor="#6B7280"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Description Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <TextInput
            style={styles.descriptionInput}
            value={description}
            onChangeText={setDescription}
            placeholder="What did you spend on?"
            placeholderTextColor="#6B7280"
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.categoriesGrid}>
            {Object.entries(categories).map(([key, category]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryCard,
                  {
                    borderColor: selectedCategory === key ? category.color : '#2D3748',
                    backgroundColor: selectedCategory === key ? `${category.color}20` : '#1A202C',
                  }
                ]}
                onPress={() => {
                  setSelectedCategory(key as 'wants' | 'needs' | 'desires');
                  setSelectedSubcategory(category.subcategories[0]);
                }}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={[
                  styles.categoryName,
                  { color: selectedCategory === key ? category.color : '#FFFFFF' }
                ]}>
                  {category.name}
                </Text>
                {selectedCategory === key && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark-circle" size={20} color={category.color} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Subcategory Selection */}
        {selectedCategory && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Subcategory</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.subcategoriesContainer}
            >
              {categories[selectedCategory].subcategories.map((subcategory) => (
                <TouchableOpacity
                  key={subcategory}
                  style={[
                    styles.subcategoryChip,
                    {
                      backgroundColor: selectedSubcategory === subcategory ? 
                        categories[selectedCategory].color : '#1A202C',
                      borderColor: categories[selectedCategory].color,
                    }
                  ]}
                  onPress={() => setSelectedSubcategory(subcategory)}
                >
                  <Text style={[
                    styles.subcategoryText,
                    {
                      color: selectedSubcategory === subcategory ? 
                        '#FFFFFF' : categories[selectedCategory].color
                    }
                  ]}>
                    {subcategory}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsGrid}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  {
                    borderColor: paymentMethod === method.id ? '#e34c00' : '#2D3748',
                    backgroundColor: paymentMethod === method.id ? '#e34c0020' : '#1A202C',
                  }
                ]}
                onPress={() => setPaymentMethod(method.id)}
              >
                <Ionicons 
                  name={method.icon as any} 
                  size={24} 
                  color={paymentMethod === method.id ? '#e34c00' : '#CBD5E0'} 
                />
                <Text style={[
                  styles.paymentMethodText,
                  { color: paymentMethod === method.id ? '#e34c00' : '#CBD5E0' }
                ]}>
                  {method.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateExpense}>
            <Text style={styles.updateButtonText}>Update Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteExpense}>
            <Ionicons name="trash-outline" size={20} color="#FF6B6B" />
            <Text style={styles.deleteButtonText}>Delete Expense</Text>
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
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#CBD5E0',
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
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e34c00',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  descriptionInput: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  subcategoriesContainer: {
    paddingVertical: 8,
  },
  subcategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  subcategoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  paymentMethodCard: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    width: '47%',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  actionButtons: {
    paddingHorizontal: 20,
    marginBottom: 40,
    gap: 16,
  },
  updateButton: {
    backgroundColor: '#e34c00',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  updateButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A202C',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF6B6B',
    marginLeft: 8,
  },
});

export default EditExpense;
