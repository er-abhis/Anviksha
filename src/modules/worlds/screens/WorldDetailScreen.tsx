import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  EmptyState,
  Gradient,
  Header,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import { WORLDS, lessonsForWorld } from '../../../content/curriculum';

export const WorldDetailScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'WorldDetail'>>();
  const world = WORLDS.find(w => w.id === route.params.worldId);
  const completed = useProgressStore(s => s.completed);

  if (!world) {
    return (
      <Screen>
        <Header title="World" onBack={() => navigation.goBack()} />
        <EmptyState title="World not found" />
      </Screen>
    );
  }

  const lessons = lessonsForWorld(world.id);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header title={world.title} onBack={() => navigation.goBack()} />

      <Gradient colors={world.gradient} style={{ borderRadius: radius.lg }}>
        <View style={{ padding: spacing.xl }}>
          <Icon name={world.icon} size={28} color="#FFFFFF" />
          <Text
            variant="h2"
            color="textInverse"
            style={{ marginTop: spacing.sm }}
          >
            {world.title}
          </Text>
          <Text variant="body" color="textInverse" style={styles.sub}>
            {world.subtitle}
          </Text>
        </View>
      </Gradient>

      <Text variant="h3">Lessons</Text>
      {lessons.length === 0 ? (
        <EmptyState
          icon="book-outline"
          title="No lessons yet"
          message="Lessons for this world are coming soon."
        />
      ) : (
        lessons.map(lesson => {
          const done = lesson.id in completed;
          return (
            <Card
              key={lesson.id}
              elevation="sm"
              onPress={() =>
                navigation.navigate('ComingSoon', {
                  title: lesson.title,
                  message:
                    'This lesson’s interactive content is coming soon. Your progress will be saved once it lands.',
                })
              }
            >
              <View style={[styles.row, { gap: spacing.md }]}>
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: done
                        ? colors.success
                        : colors.primaryMuted,
                      borderRadius: radius.sm,
                    },
                  ]}
                >
                  <Icon
                    name={done ? 'checkmark' : 'play'}
                    size={18}
                    color={done ? '#FFFFFF' : colors.primary}
                  />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{lesson.title}</Text>
                  <Text variant="caption" color="textSecondary">
                    {`${lesson.estimatedMinutes} min · ${lesson.summary}`}
                  </Text>
                </View>
                <Icon
                  name="chevron-forward"
                  size={18}
                  color={colors.textTertiary}
                />
              </View>
            </Card>
          );
        })
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  sub: { opacity: 0.9, marginTop: 4 },
  badge: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
