import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Button,
  EmptyState,
  Gradient,
  Header,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { getLesson, getWorld } from '../../../content';
import { ActivityRenderer } from '../../learn/components/ActivityRenderer';

/** Standalone player for a single lesson's interactive activity — a "sim".
 *  Launched from the Playground. Reuses the lesson ActivityRenderer engine. */
export const SimulationsScreen: React.FC = () => {
  const { spacing, colors, radius, gradients } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'Simulations'>>();
  const lesson = getLesson(route.params.lessonId);

  if (!lesson) {
    return (
      <Screen>
        <Header title="Simulation" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="git-network-outline"
          title="Simulation not found"
          message="This interactive isn’t available. Head back and pick another."
          actionLabel="Back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const world = getWorld(lesson.worldId);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title={lesson.activity.title}
        subtitle={world?.title}
        onBack={() => navigation.goBack()}
      />

      <Animated.View>
        <Gradient
          colors={gradients.cool}
          borderRadius={radius.xl}
          style={{ overflow: 'hidden', padding: spacing.xl, gap: spacing.sm }}
        >
          <View style={styles.tagRow}>
            <Icon name="flask" size={16} color={colors.textInverse} />
            <Text variant="label" color="textInverse">
              INTERACTIVE SIMULATION
            </Text>
          </View>
          <Text variant="body" color="textInverse" style={styles.heroCopy}>
            Play with the idea from “{lesson.title}”. No pressure — experiment
            and watch what happens.
          </Text>
        </Gradient>
      </Animated.View>

      <Animated.View>
        <ActivityRenderer activity={lesson.activity} />
      </Animated.View>

      <Animated.View>
        <Button
          label="Open the full lesson"
          variant="secondary"
          onPress={() => navigation.navigate('LessonIntro', { lessonId: lesson.id })}
          right={<Icon name="arrow-forward" size={18} color={colors.text} />}
        />
      </Animated.View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  heroCopy: { opacity: 0.92 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});
