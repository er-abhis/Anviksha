import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { PromptMasterGame } from '../games/PromptMasterGame';
import { AIStackBuilderGame } from '../games/AIStackBuilderGame';
import { OverfittingDefenderGame } from '../games/OverfittingDefenderGame';

export const AIGamesScreen: React.FC = () => {
  const { colors, spacing, radius } = useTheme();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<'prompt' | 'stack' | 'overfit'>('prompt');

  const tabs: { id: 'prompt' | 'stack' | 'overfit'; label: string; icon: string }[] = [
    { id: 'prompt', label: 'Prompt Master', icon: 'sparkles' },
    { id: 'stack', label: 'Stack Builder', icon: 'construct' },
    { id: 'overfit', label: 'Defender', icon: 'shield-checkmark' },
  ];

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header title="AI Arcade Games 🎮" subtitle="Learn AI concepts by playing interactive mini-games" onBack={() => navigation.goBack()} />

      {/* Game Selector Tabs */}
      <View style={[styles.tabRow, { gap: spacing.xs }]}>
        {tabs.map(t => {
          const active = activeTab === t.id;
          return (
            <Pressable
              key={t.id}
              onPress={() => setActiveTab(t.id)}
              style={[
                styles.tabBtn,
                {
                  backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  borderRadius: radius.pill,
                },
              ]}
            >
              <Icon name={t.icon} size={16} color={active ? colors.onPrimary : colors.text} />
              <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500' }}>
                {t.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {activeTab === 'prompt' && <PromptMasterGame />}
      {activeTab === 'stack' && <AIStackBuilderGame />}
      {activeTab === 'overfit' && <OverfittingDefenderGame />}
    </Screen>
  );
};

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', flexWrap: 'wrap' },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8 },
});
