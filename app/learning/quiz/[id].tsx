import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const QuizScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  // Sample quiz data - would come from your API
  const [quizData] = useState({
    id: id,
    title: 'Emergency Fund & Financial Planning Quiz',
    description: 'Test your knowledge about emergency funds and basic financial planning concepts.',
    duration: '10 minutes',
    totalQuestions: 10,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: 'What is the recommended size for an emergency fund?',
        options: [
          '1-2 months of expenses',
          '3-6 months of expenses',
          '12 months of expenses',
          '2 years of expenses'
        ],
        correct: 1,
        explanation: 'Financial experts typically recommend saving 3-6 months of living expenses in an emergency fund to cover unexpected costs without going into debt.'
      },
      {
        id: 2,
        question: 'Which of these is considered a true emergency expense?',
        options: [
          'Holiday shopping',
          'New smartphone',
          'Medical emergency',
          'Weekend vacation'
        ],
        correct: 2,
        explanation: 'A medical emergency is a true emergency expense. The other options are planned or discretionary expenses that should be budgeted for separately.'
      },
      {
        id: 3,
        question: 'Where should you keep your emergency fund?',
        options: [
          'Under your mattress',
          'In stocks',
          'In a high-yield savings account',
          'In cryptocurrency'
        ],
        correct: 2,
        explanation: 'A high-yield savings account provides easy access to funds while earning some interest, making it ideal for emergency funds.'
      },
      {
        id: 4,
        question: 'According to LisstIn categorization, coffee from Starbucks would be classified as:',
        options: [
          'Needs',
          'Wants',
          'Desires',
          'Investment'
        ],
        correct: 1,
        explanation: 'Coffee from Starbucks is a "Want" - something you enjoy but can live without. Basic sustenance is a need, but premium coffee is a lifestyle choice.'
      },
      {
        id: 5,
        question: 'What percentage of income should ideally go to "Needs" according to the 50-30-20 rule?',
        options: [
          '30%',
          '40%',
          '50%',
          '60%'
        ],
        correct: 2,
        explanation: 'In the 50-30-20 rule, 50% should go to needs, 30% to wants, and 20% to savings and debt repayment.'
      },
      {
        id: 6,
        question: 'Which of these should you do FIRST when building your financial foundation?',
        options: [
          'Start investing in mutual funds',
          'Build an emergency fund',
          'Buy insurance',
          'Pay off all debts'
        ],
        correct: 1,
        explanation: 'Building an emergency fund should be your first priority as it prevents you from going into debt when unexpected expenses arise.'
      },
      {
        id: 7,
        question: 'How often should you review and adjust your budget?',
        options: [
          'Once a year',
          'Every 6 months',
          'Monthly',
          'Only when income changes'
        ],
        correct: 2,
        explanation: 'Monthly budget reviews help you stay on track and make necessary adjustments based on your spending patterns and changing circumstances.'
      },
      {
        id: 8,
        question: 'What is the main benefit of using the LisstIn categorization system?',
        options: [
          'To impress friends with financial knowledge',
          'To understand spending patterns and make better decisions',
          'To avoid paying taxes',
          'To get discounts on purchases'
        ],
        correct: 1,
        explanation: 'The LisstIn system helps you understand your spending patterns by categorizing expenses, enabling better financial decision-making.'
      },
      {
        id: 9,
        question: 'If you use your emergency fund, what should you do next?',
        options: [
          'Forget about it',
          'Use it for other expenses',
          'Make it a priority to rebuild it',
          'Invest the remaining amount'
        ],
        correct: 2,
        explanation: 'After using your emergency fund, you should prioritize rebuilding it to maintain your financial safety net.'
      },
      {
        id: 10,
        question: 'Which is NOT a good characteristic of an emergency fund?',
        options: [
          'Easily accessible',
          'Separate from regular accounts',
          'Invested in high-risk stocks',
          'Covers 3-6 months of expenses'
        ],
        correct: 2,
        explanation: 'Emergency funds should be easily accessible and low-risk. High-risk investments like stocks are not suitable for emergency funds as their value can fluctuate.'
      }
    ]
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && timeLeft > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleQuizSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, timeLeft, showResults]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleQuizSubmit();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuizSubmit = () => {
    let correctAnswers = 0;
    quizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct) {
        correctAnswers++;
      }
    });
    
    const finalScore = (correctAnswers / quizData.questions.length) * 100;
    setScore(finalScore);
    setShowResults(true);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setScore(0);
    setTimeLeft(600);
    setQuizStarted(false);
  };

  const renderQuizStart = () => (
    <View style={styles.startContainer}>
      <View style={styles.quizIcon}>
        <Ionicons name="help-circle" size={64} color="#e34c00" />
      </View>
      
      <Text style={styles.quizTitle}>{quizData.title}</Text>
      <Text style={styles.quizDescription}>{quizData.description}</Text>
      
      <View style={styles.quizInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={20} color="#e34c00" />
          <Text style={styles.infoText}>{quizData.duration}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="help-circle-outline" size={20} color="#e34c00" />
          <Text style={styles.infoText}>{quizData.totalQuestions} questions</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="trophy-outline" size={20} color="#e34c00" />
          <Text style={styles.infoText}>{quizData.passingScore}% to pass</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
        <Text style={styles.startButtonText}>Start Quiz</Text>
      </TouchableOpacity>
    </View>
  );

  const renderQuestion = () => {
    const question = quizData.questions[currentQuestion];
    const isAnswered = selectedAnswers[currentQuestion] !== undefined;

    return (
      <View style={styles.questionContainer}>
        {/* Progress Header */}
        <View style={styles.progressHeader}>
          <Text style={styles.questionProgress}>
            Question {currentQuestion + 1} of {quizData.questions.length}
          </Text>
          <Text style={styles.timer}>{formatTime(timeLeft)}</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentQuestion + 1) / quizData.questions.length) * 100}%` }
            ]} 
          />
        </View>

        {/* Question */}
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.questionText}>{question.question}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswers[currentQuestion] === index && styles.selectedOption
                ]}
                onPress={() => handleAnswerSelect(index)}
              >
                <View style={styles.optionContent}>
                  <View style={[
                    styles.optionRadio,
                    selectedAnswers[currentQuestion] === index && styles.selectedRadio
                  ]}>
                    {selectedAnswers[currentQuestion] === index && (
                      <View style={styles.radioInner} />
                    )}
                  </View>
                  <Text style={[
                    styles.optionText,
                    selectedAnswers[currentQuestion] === index && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Navigation */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestion === 0 && styles.disabledButton]}
            onPress={handlePreviousQuestion}
            disabled={currentQuestion === 0}
          >
            <Ionicons name="chevron-back" size={20} color={currentQuestion === 0 ? "#6B7280" : "#FFFFFF"} />
            <Text style={[styles.navButtonText, currentQuestion === 0 && styles.disabledButtonText]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !isAnswered && styles.disabledButton]}
            onPress={handleNextQuestion}
            disabled={!isAnswered}
          >
            <Text style={[styles.nextButtonText, !isAnswered && styles.disabledButtonText]}>
              {currentQuestion === quizData.questions.length - 1 ? 'Submit' : 'Next'}
            </Text>
            {currentQuestion < quizData.questions.length - 1 && (
              <Ionicons name="chevron-forward" size={20} color={!isAnswered ? "#6B7280" : "#FFFFFF"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderResults = () => {
    const passed = score >= quizData.passingScore;
    const correctAnswers = Math.round((score / 100) * quizData.questions.length);

    return (
      <ScrollView style={styles.resultsContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.scoreHeader}>
          <View style={[styles.scoreCircle, { borderColor: passed ? '#e34c00' : '#FF6B6B' }]}>
            <Text style={styles.scoreText}>{Math.round(score)}%</Text>
          </View>
          
          <Text style={styles.resultTitle}>
            {passed ? 'Congratulations!' : 'Keep Learning!'}
          </Text>
          
          <Text style={styles.resultSubtitle}>
            You scored {correctAnswers} out of {quizData.questions.length} questions correctly
          </Text>

          <View style={[styles.resultBadge, { backgroundColor: passed ? '#e34c00' : '#FF6B6B' }]}>
            <Text style={styles.resultBadgeText}>
              {passed ? 'PASSED' : 'TRY AGAIN'}
            </Text>
          </View>
        </View>

        {/* Question Review */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Question Review</Text>
          
          {quizData.questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            return (
              <View key={index} style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewQuestionNumber}>Question {index + 1}</Text>
                  <View style={[styles.reviewStatus, { backgroundColor: isCorrect ? '#e34c00' : '#FF6B6B' }]}>
                    <Ionicons 
                      name={isCorrect ? "checkmark" : "close"} 
                      size={16} 
                      color="#FFFFFF" 
                    />
                  </View>
                </View>
                
                <Text style={styles.reviewQuestion}>{question.question}</Text>
                
                <View style={styles.reviewAnswers}>
                  <Text style={styles.reviewAnswerLabel}>Your answer:</Text>
                  <Text style={[styles.reviewAnswer, { color: isCorrect ? '#e34c00' : '#FF6B6B' }]}>
                    {question.options[userAnswer] || 'Not answered'}
                  </Text>
                  
                  {!isCorrect && (
                    <>
                      <Text style={styles.reviewAnswerLabel}>Correct answer:</Text>
                      <Text style={[styles.reviewAnswer, { color: '#e34c00' }]}>
                        {question.options[question.correct]}
                      </Text>
                    </>
                  )}
                </View>
                
                <Text style={styles.explanation}>{question.explanation}</Text>
              </View>
            );
          })}
        </View>

        {/* Action Buttons */}
        <View style={styles.resultsActions}>
          <TouchableOpacity style={styles.retakeButton} onPress={handleRetakeQuiz}>
            <Ionicons name="refresh" size={20} color="#e34c00" />
            <Text style={styles.retakeButtonText}>Retake Quiz</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={() => router.push('/(tabs)/learning')}
          >
            <Text style={styles.continueButtonText}>Continue Learning</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#CBD5E0" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quiz</Text>
        <View style={styles.placeholder} />
      </View>

      {!quizStarted && !showResults && renderQuizStart()}
      {quizStarted && !showResults && renderQuestion()}
      {showResults && renderResults()}
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
  placeholder: {
    width: 24,
  },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  quizIcon: {
    marginBottom: 24,
  },
  quizTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  quizDescription: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  quizInfo: {
    width: '100%',
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  infoText: {
    fontSize: 16,
    color: '#CBD5E0',
    marginLeft: 12,
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#e34c00',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  questionProgress: {
    fontSize: 16,
    color: '#CBD5E0',
    fontWeight: '500',
  },
  timer: {
    fontSize: 16,
    color: '#e34c00',
    fontWeight: '600',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#2D3748',
    marginHorizontal: 20,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e34c00',
    borderRadius: 2,
  },
  questionContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  questionText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
    lineHeight: 28,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 16,
  },
  optionButton: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2D3748',
  },
  selectedOption: {
    borderColor: '#e34c00',
    backgroundColor: '#e34c0020',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2D3748',
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRadio: {
    borderColor: '#e34c00',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e34c00',
  },
  optionText: {
    fontSize: 16,
    color: '#CBD5E0',
    flex: 1,
    lineHeight: 22,
  },
  selectedOptionText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#2D3748',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A202C',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  navButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e34c00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  disabledButton: {
    backgroundColor: '#2D3748',
    borderColor: '#4A5568',
  },
  disabledButtonText: {
    color: '#6B7280',
  },
  resultsContainer: {
    flex: 1,
  },
  scoreHeader: {
    alignItems: 'center',
    padding: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    color: '#A0AEC0',
    textAlign: 'center',
    marginBottom: 16,
  },
  resultBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  resultBadgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  reviewSection: {
    padding: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#1A202C',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewQuestionNumber: {
    fontSize: 14,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  reviewStatus: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewQuestion: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 16,
    lineHeight: 22,
  },
  reviewAnswers: {
    marginBottom: 16,
  },
  reviewAnswerLabel: {
    fontSize: 14,
    color: '#A0AEC0',
    marginBottom: 4,
    fontWeight: '500',
  },
  reviewAnswer: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  explanation: {
    fontSize: 14,
    color: '#CBD5E0',
    lineHeight: 20,
    backgroundColor: '#2D3748',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#e34c00',
  },
  resultsActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A202C',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e34c00',
  },
  retakeButtonText: {
    color: '#e34c00',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  continueButton: {
    flex: 1,
    backgroundColor: '#e34c00',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default QuizScreen;
