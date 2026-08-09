import React, { useRef, useState } from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/types';
import { Button, Gradient, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { usePreferencesStore } from '../../../store';
import { OnboardingSlide, SLIDES } from '../data';
import { AbstractArt } from '../components/AbstractArt';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const { spacing } = useTheme();
  const completeOnboarding = usePreferencesStore(s => s.completeOnboarding);
  const listRef = useRef<FlatList<OnboardingSlide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const next = () => {
    if (isLast) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index) setIndex(i);
  };

  return (
    <View style={styles.fill}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={s => s.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        renderItem={({ item }) => (
          <Gradient colors={item.gradient} style={{ width }}>
            <SafeAreaView style={styles.slide}>
              <View style={styles.artWrap}>
                <AbstractArt variant={item.art} size={width * 0.6} />
              </View>
              <Animated.View
                entering={FadeIn.duration(400)}
                style={[styles.copy, { paddingHorizontal: spacing.xxl }]}
              >
                <Text variant="h1" color="textInverse">
                  {item.title}
                </Text>
                <Text
                  variant="body"
                  color="textInverse"
                  style={[styles.desc, { marginTop: spacing.md }]}
                >
                  {item.description}
                </Text>
              </Animated.View>
            </SafeAreaView>
          </Gradient>
        )}
      />

      <SafeAreaView edges={['bottom']} style={styles.footer}>
        <View style={[styles.footerInner, { padding: spacing.xl }]}>
          <View style={styles.dots}>
            {SLIDES.map((s, i) => (
              <View
                key={s.key}
                style={[
                  styles.dot,
                  {
                    width: i === index ? 22 : 8,
                    backgroundColor:
                      i === index ? '#FFFFFF' : 'rgba(255,255,255,0.5)',
                  },
                ]}
              />
            ))}
          </View>
          <View style={[styles.actions, { gap: spacing.sm }]}>
            {!isLast && (
              <Button
                label="Skip"
                variant="ghost"
                size="md"
                onPress={finish}
                style={styles.ghostOnGradient}
              />
            )}
            <Button
              label={isLast ? 'Get started' : 'Next'}
              variant="secondary"
              size="md"
              onPress={next}
              style={styles.grow}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: { flex: 1 },
  slide: { flex: 1, justifyContent: 'center' },
  artWrap: { alignItems: 'center', marginBottom: 24 },
  copy: {},
  desc: { opacity: 0.92 },
  footer: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  footerInner: { gap: 20 },
  dots: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  dot: { height: 8, borderRadius: 4 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  grow: { flex: 1 },
  ghostOnGradient: { borderColor: 'rgba(255,255,255,0.4)' },
});
