import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  Card,
  Header,
  IconButton,
  Screen,
  Text,
  XPBadge,
} from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useProgressStore } from '../../../store';

export const ProfileScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { xp, coins, level, streakDays } = useProgressStore();
  const fresh = xp === 0 && coins === 0;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header
        title="Profile"
        large
        right={
          <IconButton
            name="settings-outline"
            accessibilityLabel="Settings"
            onPress={() => navigation.navigate('Settings')}
          />
        }
      />

      <Card elevation="sm">
        <View style={[styles.identity, { gap: spacing.md }]}>
          <View style={[styles.avatar, { backgroundColor: colors.primaryMuted }]}>
            <Icon name="person" size={30} color={colors.primary} />
          </View>
          <View style={styles.flex}>
            <Text variant="h3">Explorer</Text>
            <Text variant="label" color="textSecondary">
              {`Level ${level} · ${xp.toLocaleString()} XP`}
            </Text>
          </View>
        </View>
      </Card>

      <View style={[styles.stats, { gap: spacing.sm }]}>
        <XPBadge value={xp} kind="xp" />
        <XPBadge value={coins} kind="coins" />
        <XPBadge value={streakDays} kind="streak" />
      </View>

      {fresh && (
        <Text variant="body" color="textSecondary" center>
          Complete your first challenge to start earning XP and coins.
        </Text>
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  identity: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  stats: { flexDirection: 'row' },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
