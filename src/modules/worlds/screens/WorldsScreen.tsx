import React from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  Header,
  ProgressBar,
  Screen,
  Text,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';
import { WORLDS, isWorldUnlocked, worldProgress } from '../../../content/curriculum';

export const WorldsScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const completedWorlds = useProgressStore(s => s.completedWorlds);
  const completed = useProgressStore(s => s.completed);

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.md }}>
      <Header title="Worlds" onBack={() => navigation.goBack()} />
      {[...WORLDS]
        .sort((a, b) => a.order - b.order)
        .map(world => {
          const unlocked = isWorldUnlocked(world, completedWorlds);
          const progress = worldProgress(world.id, completed);
          return (
            <Card
              key={world.id}
              elevation="sm"
              onPress={() =>
                unlocked
                  ? navigation.navigate('WorldDetail', { worldId: world.id })
                  : Alert.alert(
                      'World locked',
                      'Complete previous worlds to unlock.',
                    )
              }
            >
              <View style={[styles.row, { gap: spacing.md }]}>
                <View
                  style={[
                    styles.icon,
                    {
                      backgroundColor: unlocked
                        ? colors.primaryMuted
                        : colors.surfaceAlt,
                      borderRadius: radius.md,
                    },
                  ]}
                >
                  <Icon
                    name={unlocked ? world.icon : 'lock-closed'}
                    size={22}
                    color={unlocked ? colors.primary : colors.textTertiary}
                  />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">{world.title}</Text>
                  <Text variant="caption" color="textSecondary">
                    {unlocked
                      ? world.subtitle
                      : 'Complete previous worlds to unlock'}
                  </Text>
                  {unlocked && (
                    <View style={{ marginTop: spacing.sm }}>
                      <ProgressBar progress={progress} />
                    </View>
                  )}
                </View>
                <Icon
                  name="chevron-forward"
                  size={18}
                  color={colors.textTertiary}
                />
              </View>
            </Card>
          );
        })}
    </Screen>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  icon: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
