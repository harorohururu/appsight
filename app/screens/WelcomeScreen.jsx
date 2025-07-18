import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import theme from '../config/theme';
import LoginModal from '../modals/LoginModal';
import PrivacyPolicyModal from '../modals/PrivacyPolicyModal';
import TermsModal from '../modals/TermsModal';

const slides = [
  {
    title: 'ALA',
    subtitle: 'Save time on your journey by booking everything in one place.',
    image: require('../../assets/images/marian.jpg'),
  },
  {
    title: 'Discover new places',
    subtitle: 'Explore landmarks and hidden gems with ease.',
    image: require('../../assets/images/marian.jpg'),
  },
  {
    title: 'Plan your trip',
    subtitle: 'Get recommendations and plan your itinerary.',
    image: require('../../assets/images/marian.jpg'),
  },
];
// For carousel: duplicate first and last slides
const carouselSlides = [slides[slides.length - 1], ...slides, slides[0]];

const { width: deviceWidth } = Dimensions.get('window');
const slideWidth = deviceWidth;

const WelcomeScreen = () => {
  // Start at index 1 (first real slide)
  const [current, setCurrent] = useState(1);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);
  const [privacyVisible, setPrivacyVisible] = useState(false);
  const scrollRef = useRef(null);

  // Auto-swipe every 10s
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent(prev => prev + 1);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ x: (current + 1) * slideWidth, animated: true });
      }
    }, 10000);
    return () => clearInterval(timer);
  }, [current]);

  return (
    <View style={styles.container}>
      <View style={styles.centerWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          snapToInterval={slideWidth}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{ flexGrow: 1 }}
          onMomentumScrollEnd={e => {
            const page = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
            let newIndex = page;
            if (page === 0) {
              newIndex = slides.length;
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: slides.length * slideWidth, animated: false });
              }
            } else if (page === carouselSlides.length - 1) {
              newIndex = 1;
              if (scrollRef.current) {
                scrollRef.current.scrollTo({ x: slideWidth, animated: false });
              }
            }
            setCurrent(newIndex);
          }}
          scrollEventThrottle={16}
          onLayout={() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTo({ x: slideWidth, animated: false });
            }
          }}
        >
          {carouselSlides.map((slide, idx) => (
            <View style={{ width: slideWidth, height: '100%' }} key={idx}>
              <Image
                source={slide.image}
                style={{ ...StyleSheet.absoluteFillObject, width: '100%', height: '100%', opacity: 0.35 }}
                resizeMode="cover"
              />
              <View style={styles.slideContentTop}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{slide.title}</Text>
                <Text style={styles.subtitle} numberOfLines={3} ellipsizeMode="tail">{slide.subtitle}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
      <View style={styles.stickyButtonRow}>
        <View style={styles.dotsWrapper}>
          {slides.map((_, idx) => (
            <View
              key={idx}
              style={[styles.dot, current === idx + 1 && styles.dotActive]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.button, current === slides.length - 1 && styles.buttonActive]}
          onPress={() => setLoginModalVisible(true)}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
      <LoginModal
        visible={loginModalVisible}
        termsVisible={termsVisible}
        privacyVisible={privacyVisible}
        onClose={() => {
          if (!termsVisible && !privacyVisible) {
            setLoginModalVisible(false);
          }
        }}
        setTermsVisible={setTermsVisible}
        setPrivacyVisible={setPrivacyVisible}
      />
      {/* Overlay modals rendered outside LoginModal for proper stacking/locking */}
      {/* Only render if login modal is visible */}
      {loginModalVisible && (
        <>
          <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
          <PrivacyPolicyModal visible={privacyVisible} onClose={() => setPrivacyVisible(false)} />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  slide: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    height: 320,
    paddingTop: 64,
  },
  slideContentTop: {
    width: '90%',
    paddingHorizontal: 24,
    paddingTop: 0,
    alignItems: 'flex-start',
    marginTop: 80, // Added margin to bring text into view
  },
  title: {
    fontSize: 40,
    color: theme.colors.primary,
    textAlign: 'left',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
    width: '100%',
    flexWrap: 'wrap',
    letterSpacing: -1,
    lineHeight: 50,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.tertiary,
    textAlign: 'left',
    marginBottom: 24,
    fontFamily: 'Poppins-Regular',
    width: '100%',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
  },
  stickyButtonRow: {
    position: 'absolute',
    bottom: 32,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 24,
    width: '90%',
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  buttonActive: {
    backgroundColor: theme.colors.tertiary,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    letterSpacing: -1,
    textAlign: 'center',
    width: '100%',
  },
  dotsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D3D3D3',
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
});

export default WelcomeScreen;
