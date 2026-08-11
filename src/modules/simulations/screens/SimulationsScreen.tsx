import React from 'react';
import { View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, EmptyState, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { getLesson, getWorld } from '../../../content';
import { ActivityRenderer } from '../../learn/components/ActivityRenderer';

/** Standalone player for a single lesson's interactive activity — a "sim".
 *  Launched from the Playground. Reuses the lesson ActivityRenderer engine. */
export const SimulationsScreen: React.FC = () => {
  const { spacing, colors } = useTheme();
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

      <View style={{ gap: spacing.sm }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon name="flask" size={16} color={colors.primary} />
          <Text variant="label" color="primary">
            INTERACTIVE SIMULATION
          </Text>
        </View>
        <Text variant="body" color="textSecondary">
          Play with the idea from “{lesson.title}”. No pressure — experiment and
          watch what happens.
        </Text>
      </View>

      <ActivityRenderer activity={lesson.activity} />

      <Button
        label="Open the full lesson"
        variant="secondary"
        onPress={() => navigation.navigate('Lesson', { lessonId: lesson.id })}
        right={<Icon name="arrow-forward" size={18} color={colors.text} />}
      />
    </Screen>
  );
};
