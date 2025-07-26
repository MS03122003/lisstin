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

const VoiceHistory = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filters = [
    { id: 'all', name: 'All', count: 24 },
    { id: 'counselor', name: 'Counselor', count: 8 },
    { id: 'recordings', name: 'Recordings', count: 16 },
  ];

  const voiceHistory = [
    {
      id: 1,
      type: 'counselor',
      title: 'Budget Planning Session',
      duration: '12:45',
      date: '2025-01-24',
      time: '14:30',
      summary: 'Discussed monthly budget allocation using the 50-30-20 rule and expense categorization strategies',
      topics: ['budgeting', 'expense categorization', 'savings'],
      rating: 5,
      aiInsights: [
        'You\'re doing well with expense tracking',
        'Consider increasing your emergency fund',
        'Your wants spending is within healthy limits'
      ],
    },
    {
      id: 2,
      type: 'recording',
      subtype: 'expense',
      title: 'Coffee Purchase',
      transcription: 'I spent three hundred rupees on coffee and sandwich at Starbucks',
      extractedData: {
        amount: 300,
        description: 'Coffee and sandwich at Starbucks',
        category: 'wants',
        confidence: 95
      },
      date: '2025-01-24',
      time: '09:15',
      processed: true,
    },
    {
      id: 3,
      type: 'counselor',
      title: 'Investment Guidance',
      duration: '8:30',
      date: '2025-01-23',
      time: '18:20',
      summary: 'Learned about SIP investments, risk assessment, and building a diversified portfolio',
      topics: ['investing', 'SIP', 'risk management'],
      rating: 4,
      aiInsights: [
        'Start with low-risk investments',
        'SIP is perfect for your age group',
        'Consider index funds for diversification'
      ],
    },
    {
      id: 4,
      type: 'recording',
      subtype: 'income',
      title: 'Freelance Payment',
      transcription: 'Received five thousand rupees from freelance web design project',
      extractedData: {
        amount: 5000,
        description: 'Freelance web design payment',
        category: 'income',
        confidence: 98
      },
      date: '2025-01-23',
      time: '16:45',
      processed: true,
    },
    {
      id: 5,
      type: 'recording',
      subtype: 'note',
      title: 'Financial Planning Note',
      transcription: 'Need to start saving more for emergency fund and reduce dining out expenses',
      extractedData: {
        note: 'Emergency fund savings and reduce dining expenses',
        actionItems: ['Increase emergency fund contributions', 'Set dining out budget'],
        confidence: 92
      },
      date: '2025-01-22',
      time: '20:30',
      processed: true,
    },
    {
      id: 6,
      type: 'counselor',
      title: 'Expense Analysis Session',
      duration: '15:20',
      date: '2025-01-22',
      time: '19:15',
      summary: 'Deep dive into spending patterns, identified trends, and discussed optimization strategies',
      topics: ['expense analysis', 'spending trends', 'optimization'],
      rating: 5,
      aiInsights: [
        'Your needs expenses are well managed',
        'Consider meal planning to reduce food costs',
        'Entertainment expenses are reasonable'
      ],
    },
  ];

  const filteredHistory = voiceHistory.filter(item => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'counselor') return item.type === 'counselor';
    if (selectedFilter === 'recordings') return item.type === 'recording';
    return true;
  });

  const getItemIcon = (item: any) => {
    if (item.type === 'counselor') return 'call';
    if (item.type === 'recording') {
      switch (item.subtype) {
        case 'expense': return 'trending-down';
        case 'income': return 'trending-up';
        case 'note': return 'document-text';
        default: return 'mic';
      }
    }
    return 'mic';
  };

  const getItemColor = (item: any) => {
    if (item.type === 'counselor') return '#e34c00';
    if (item.type === 'recording') {
      switch (item.subtype) {
        case 'expense': return '#FF6B6B';
        case 'income': return '#e34c00';
        case 'note': return '#FFD700';
        default: return '#6B7280';
      }
    }
    return '#6B7280';
  };

  const handleItemPress = (item: any) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        visible={showDetailModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedItem.title}</Text>
              <TouchableOpacity onPress={() => setShowDetailModal(false)}>
                <Ionicons name="close" size={24} color="#CBD5E0" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScrollView} showsVerticalScrollIndicator={false}>
              {/* Basic Info */}
              <View style={styles.modalSection}>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Date:</Text>
                  <Text style={styles.modalInfoValue}>{selectedItem.date} at {selectedItem.time}</Text>
                </View>
                
                {selectedItem.duration && (
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Duration:</Text>
                    <Text style={styles.modalInfoValue}>{selectedItem.duration}</Text>
                  </View>
                )}
              </View>

              {/* Counselor Session Details */}
              {selectedItem.type === 'counselor' && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Session Summary</Text>
                    <Text style={styles.modalSummaryText}>{selectedItem.summary}</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Topics Discussed</Text>
                    <View style={styles.topicsContainer}>
                      {selectedItem.topics.map((topic: string, index: number) => (
                        <View key={index} style={styles.topicChip}>
                          <Text style={styles.topicChipText}>#{topic}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>AI Insights</Text>
                    {selectedItem.aiInsights.map((insight: string, index: number) => (
                      <View key={index} style={styles.insightItem}>
                        <Ionicons name="bulb-outline" size={16} color="#FFD700" />
                        <Text style={styles.insightText}>{insight}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Your Rating</Text>
                    <View style={styles.ratingContainer}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Ionicons 
                          key={i} 
                          name={i < selectedItem.rating ? "star" : "star-outline"} 
                          size={24} 
                          color="#FFD700" 
                        />
                      ))}
                      <Text style={styles.ratingText}>({selectedItem.rating}/5)</Text>
                    </View>
                  </View>
                </>
              )}

              {/* Recording Details */}
              {selectedItem.type === 'recording' && (
                <>
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Transcription</Text>
                    <Text style={styles.transcriptionText}>"{selectedItem.transcription}"</Text>
                  </View>

                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Extracted Data</Text>
                    <View style={styles.extractedDataContainer}>
                      {selectedItem.extractedData.amount && (
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Amount:</Text>
                          <Text style={styles.dataValue}>₹{selectedItem.extractedData.amount}</Text>
                        </View>
                      )}
                      
                      {selectedItem.extractedData.description && (
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Description:</Text>
                          <Text style={styles.dataValue}>{selectedItem.extractedData.description}</Text>
                        </View>
                      )}
                      
                      {selectedItem.extractedData.category && (
                        <View style={styles.dataRow}>
                          <Text style={styles.dataLabel}>Category:</Text>
                          <View style={[styles.categoryChip, { 
                            backgroundColor: selectedItem.extractedData.category === 'wants' ? '#FF6B6B' :
                                           selectedItem.extractedData.category === 'needs' ? '#e34c00' :
                                           selectedItem.extractedData.category === 'desires' ? '#45B7D1' :
                                           selectedItem.extractedData.category === 'income' ? '#e34c00' : '#6B7280'
                          }]}>
                            <Text style={styles.categoryText}>{selectedItem.extractedData.category}</Text>
                          </View>
                        </View>
                      )}

                      {selectedItem.extractedData.note && (
                        <View style={styles.dataColumn}>
                          <Text style={styles.dataLabel}>Note:</Text>
                          <Text style={styles.dataValue}>{selectedItem.extractedData.note}</Text>
                        </View>
                      )}

                      {selectedItem.extractedData.actionItems && (
                        <View style={styles.dataColumn}>
                          <Text style={styles.dataLabel}>Action Items:</Text>
                          {selectedItem.extractedData.actionItems.map((item: string, index: number) => (
                            <Text key={index} style={styles.actionItem}>• {item}</Text>
                          ))}
                        </View>
                      )}
                      
                      <View style={styles.dataRow}>
                        <Text style={styles.dataLabel}>AI Confidence:</Text>
                        <Text style={styles.confidenceValue}>{selectedItem.extractedData.confidence}%</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voice History</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#CBD5E0" />
        </TouchableOpacity>
      </View>

      {/* Filters - Updated without ScrollView */}
      <View style={styles.filtersContainer}>
        <View style={styles.filtersContent}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                selectedFilter === filter.id && styles.selectedFilterChip
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterChipText,
                selectedFilter === filter.id && styles.selectedFilterChipText
              ]}>
                {filter.name} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* History List */}
      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {filteredHistory.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.historyItem}
            onPress={() => handleItemPress(item)}
          >
            <View style={[styles.itemIcon, { backgroundColor: getItemColor(item) }]}>
              <Ionicons name={getItemIcon(item) as any} size={20} color="#FFFFFF" />
            </View>
            
            <View style={styles.itemContent}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              
              {item.type === 'counselor' ? (
                <Text style={styles.itemSummary} numberOfLines={2}>
                  {item.summary}
                </Text>
              ) : (
                <Text style={styles.itemTranscription} numberOfLines={2}>
                  {item.transcription}
                </Text>
              )}
              
              <View style={styles.itemMeta}>
                <Text style={styles.itemDate}>{item.date}</Text>
                <Text style={styles.itemTime}>{item.time}</Text>
                {item.duration && (
                  <Text style={styles.itemDuration}>{item.duration}</Text>
                )}
                {item.type === 'counselor' && item.rating && (
                  <View style={styles.itemRating}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.itemRatingText}>{item.rating}</Text>
                  </View>
                )}
                {item.type === 'recording' && item.processed && (
                  <View style={styles.processedBadge}>
                    <Ionicons name="checkmark-circle" size={12} color="#e34c00" />
                    <Text style={styles.processedText}>Processed</Text>
                  </View>
                )}
              </View>
            </View>
            
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {renderDetailModal()}
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
  // Updated filters without ScrollView
  filtersContainer: {
    paddingVertical: 8,
  },
  filtersContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flex: 1,
    backgroundColor: '#1A202C',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6, // More rectangular
    borderWidth: 1,
    borderColor: '#2D3748',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedFilterChip: {
    backgroundColor: '#e34c00',
    borderColor: '#e34c00',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#CBD5E0',
    textAlign: 'center',
  },
  selectedFilterChipText: {
    color: '#FFFFFF',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  itemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  itemSummary: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
    lineHeight: 20,
  },
  itemTranscription: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 8,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemDuration: {
    fontSize: 12,
    color: '#6B7280',
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  itemRatingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '500',
  },
  processedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  processedText: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '500',
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  modalScrollView: {
    padding: 24,
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
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: '#A0AEC0',
  },
  modalInfoValue: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  modalSummaryText: {
    fontSize: 16,
    color: '#CBD5E0',
    lineHeight: 24,
  },
  topicsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  topicChip: {
    backgroundColor: '#2D3748',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  topicChipText: {
    fontSize: 12,
    color: '#e34c00',
    fontWeight: '500',
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: '#CBD5E0',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#A0AEC0',
    marginLeft: 8,
  },
  transcriptionText: {
    fontSize: 16,
    color: '#CBD5E0',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  extractedDataContainer: {
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataColumn: {
    gap: 4,
  },
  dataLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '500',
  },
  dataValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  actionItem: {
    fontSize: 14,
    color: '#CBD5E0',
    marginLeft: 8,
  },
  confidenceValue: {
    fontSize: 16,
    color: '#e34c00',
    fontWeight: '600',
  },
});

export default VoiceHistory;
