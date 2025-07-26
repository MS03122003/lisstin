import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const Categories = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const categories = {
    wants: {
      name: 'Wants',
      color: '#FF6B6B',
      icon: 'heart-outline',
      description: 'Things you enjoy but can live without',
      percentage: 30,
      spent: 8500,
      budget: 10000,
      subcategories: [
        { name: 'Coffee & Snacks', spent: 2400, transactions: 15 },
        { name: 'Entertainment', spent: 1800, transactions: 6 },
        { name: 'Shopping', spent: 3200, transactions: 8 },
        { name: 'Dining Out', spent: 1100, transactions: 4 },
      ],
      tips: [
        'Try the 24-hour rule before making non-essential purchases',
        'Set a monthly limit for entertainment expenses',
        'Look for free alternatives to paid entertainment',
      ]
    },
    needs: {
      name: 'Needs',
      color: '#e34c00',
      icon: 'home-outline',
      description: 'Essential expenses for daily living',
      percentage: 50,
      spent: 15200,
      budget: 18000,
      subcategories: [
        { name: 'Groceries', spent: 6500, transactions: 18 },
        { name: 'Transportation', spent: 3200, transactions: 22 },
        { name: 'Bills', spent: 4200, transactions: 8 },
        { name: 'Medical', spent: 1300, transactions: 3 },
      ],
      tips: [
        'Plan meals in advance to reduce grocery costs',
        'Use public transport when possible',
        'Compare prices for essential services annually',
      ]
    },
    desires: {
      name: 'Desires',
      color: '#45B7D1',
      icon: 'star-outline',
      description: 'Future goals and aspirational purchases',
      percentage: 20,
      spent: 4800,
      budget: 8000,
      subcategories: [
        { name: 'Gadgets', spent: 2800, transactions: 2 },
        { name: 'Travel', spent: 1500, transactions: 1 },
        { name: 'Investments', spent: 500, transactions: 1 },
      ],
      tips: [
        'Save for bigger desires instead of impulse buying',
        'Research thoroughly before major purchases',
        'Consider the long-term value of desired items',
      ]
    }
  };

  const handleCategoryPress = (categoryKey: string) => {
    setSelectedCategory(categoryKey);
    setShowDetailModal(true);
  };

  const getSpentPercentage = (spent: number, budget: number) => {
    return Math.min((spent / budget) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>LisstIn Categories</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Introduction */}
        <View style={styles.introduction}>
          <Text style={styles.introTitle}>Understanding Your Spending</Text>
          <Text style={styles.introDescription}>
            LisstIn categorizes your expenses into three simple groups to help you make better financial decisions.
          </Text>
        </View>

        {/* Categories Overview */}
        <View style={styles.categoriesContainer}>
          {Object.entries(categories).map(([key, category]) => (
            <TouchableOpacity
              key={key}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(key)}
            >
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={28} color="#FFFFFF" />
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
                <View style={styles.categoryPercentage}>
                  <Text style={[styles.percentageText, { color: category.color }]}>
                    {category.percentage}%
                  </Text>
                </View>
              </View>

              <View style={styles.categoryProgress}>
                <View style={styles.progressInfo}>
                  <Text style={styles.spentAmount}>₹{category.spent.toLocaleString()}</Text>
                  <Text style={styles.budgetAmount}>of ₹{category.budget.toLocaleString()}</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${getSpentPercentage(category.spent, category.budget)}%`,
                          backgroundColor: category.color
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {Math.round(getSpentPercentage(category.spent, category.budget))}%
                  </Text>
                </View>
              </View>

              <View style={styles.subcategoriesPreview}>
                <Text style={styles.subcategoriesTitle}>Top Subcategories:</Text>
                <View style={styles.subcategoriesList}>
                  {category.subcategories.slice(0, 2).map((sub, index) => (
                    <View key={index} style={styles.subcategoryItem}>
                      <Text style={styles.subcategoryName}>{sub.name}</Text>
                      <Text style={styles.subcategoryAmount}>₹{sub.spent.toLocaleString()}</Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.categoryFooter}>
                <Text style={styles.viewDetailsText}>Tap to view details</Text>
                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Guidelines */}
        <View style={styles.guidelinesContainer}>
          <Text style={styles.guidelinesTitle}>Recommended Budget Allocation</Text>
          <View style={styles.guidelinesList}>
            <View style={styles.guidelineItem}>
              <View style={[styles.guidelineDot, { backgroundColor: '#e34c00' }]} />
              <Text style={styles.guidelineText}>Needs: 50% - Essential living expenses</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={[styles.guidelineDot, { backgroundColor: '#FF6B6B' }]} />
              <Text style={styles.guidelineText}>Wants: 30% - Lifestyle and enjoyment</Text>
            </View>
            <View style={styles.guidelineItem}>
              <View style={[styles.guidelineDot, { backgroundColor: '#45B7D1' }]} />
              <Text style={styles.guidelineText}>Desires: 20% - Savings and future goals</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Category Detail Modal */}
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCategory && (
              <>
                <View style={styles.modalHeader}>
                  <View style={styles.modalTitleContainer}>
                    <View style={[
                      styles.modalIcon,
                      { backgroundColor: categories[selectedCategory as keyof typeof categories].color }
                    ]}>
                      <Ionicons 
                        name={categories[selectedCategory as keyof typeof categories].icon as any} 
                        size={24} 
                        color="#FFFFFF" 
                      />
                    </View>
                    <Text style={styles.modalTitle}>
                      {categories[selectedCategory as keyof typeof categories].name}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                    <Ionicons name="close" size={24} color="#CBD5E0" />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalScrollView}>
                  <Text style={styles.modalDescription}>
                    {categories[selectedCategory as keyof typeof categories].description}
                  </Text>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Subcategories</Text>
                    {categories[selectedCategory as keyof typeof categories].subcategories.map((sub, index) => (
                      <View key={index} style={styles.modalSubcategoryItem}>
                        <View style={styles.modalSubcategoryInfo}>
                          <Text style={styles.modalSubcategoryName}>{sub.name}</Text>
                          <Text style={styles.modalSubcategoryTransactions}>
                            {sub.transactions} transactions
                          </Text>
                        </View>
                        <Text style={styles.modalSubcategoryAmount}>
                          ₹{sub.spent.toLocaleString()}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Smart Tips</Text>
                    {categories[selectedCategory as keyof typeof categories].tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <Ionicons name="bulb-outline" size={16} color="#FFD700" />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </>
            )}
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
  scrollView: {
    flex: 1,
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
  placeholder: {
    width: 24,
  },
  introduction: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  introDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 20,
    marginBottom: 32,
  },
  categoryCard: {
    backgroundColor: '#1A202C',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  categoryPercentage: {
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryProgress: {
    marginBottom: 20,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  spentAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  budgetAmount: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#2D3748',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#A0AEC0',
    minWidth: 30,
  },
  subcategoriesPreview: {
    marginBottom: 16,
  },
  subcategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#CBD5E0',
    marginBottom: 8,
  },
  subcategoriesList: {
    gap: 4,
  },
  subcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subcategoryName: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  subcategoryAmount: {
    fontSize: 14,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  categoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#e34c00',
    fontWeight: '500',
  },
  guidelinesContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  guidelinesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  guidelinesList: {
    backgroundColor: '#1A202C',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3748',
    gap: 12,
  },
  guidelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  guidelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  guidelineText: {
    fontSize: 14,
    color: '#CBD5E0',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A202C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalScrollView: {
    padding: 24,
  },
  modalDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    lineHeight: 24,
    marginBottom: 24,
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalSubcategoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2D3748',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalSubcategoryInfo: {
    flex: 1,
  },
  modalSubcategoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  modalSubcategoryTransactions: {
    fontSize: 12,
    color: '#A0AEC0',
  },
  modalSubcategoryAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#CBD5E0',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});

export default Categories;
