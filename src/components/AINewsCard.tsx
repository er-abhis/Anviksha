import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { GlassCard } from './GlassCard';
import { Text } from './Text';
import { useTheme } from '../theme/ThemeProvider';
import { AINewsItem, getAllDailyNewsEditions, getCuratedNewsSync } from '../services/aiNews';

export const AINewsCard: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation<any>();
  const [newsMap, setNewsMap] = useState<Record<'latest' | 'missed' | 'papers', AINewsItem>>(getCuratedNewsSync());
  const [activeTab, setActiveTab] = useState<'latest' | 'missed' | 'papers'>('latest');
  const [loading, setLoading] = useState(false);
  const mountedRef = useRef(true);

  const fetchNews = async () => {
    setLoading(true);
    const data = await getAllDailyNewsEditions();
    if (mountedRef.current && data) {
      setNewsMap({
        latest: { ...data.morning, tag: 'Latest Breakthrough' },
        missed: { ...data.afternoon, tag: 'Missed Update' },
        papers: { ...data.evening, tag: 'Research Paper' },
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;
    if (process.env.NODE_ENV !== 'test') {
      fetchNews();
    }
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const activeItem = newsMap[activeTab];

  return (
    <GlassCard elevation="glow" style={{ borderRadius: radius.xl, gap: spacing.sm }}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Icon name="newspaper-outline" size={20} color={colors.accent} />
          <Text variant="h3" style={{ fontSize: 15, fontWeight: '800' }}>
            Latest AI News & Breakthroughs
          </Text>
        </View>

        <Pressable
          onPress={fetchNews}
          hitSlop={8}
          style={[styles.refreshBtn, { backgroundColor: colors.primaryMuted, borderRadius: radius.pill }]}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Icon name="refresh" size={14} color={colors.primary} />
          )}
        </Pressable>
      </View>

      <Text variant="caption" color="textSecondary" style={{ fontSize: 12 }}>
        Curated daily AI news, missed updates, and research paper breakthroughs.
      </Text>

      {/* Category Tabs: Latest, Missed Updates, AI Papers */}
      <View style={[styles.tabRow, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
        {[
          { key: 'latest', label: '🔥 Latest' },
          { key: 'missed', label: '💡 Missed Updates' },
          { key: 'papers', label: '📜 AI Papers' },
        ].map(tab => {
          const active = activeTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              onPress={() => setActiveTab(tab.key as any)}
              style={[
                styles.tabBtn,
                active && { backgroundColor: colors.primary, borderRadius: radius.sm },
              ]}
            >
              <Text
                variant="caption"
                style={{
                  color: active ? colors.onPrimary : colors.textSecondary,
                  fontWeight: '700',
                  fontSize: 10,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Article Content */}
      {activeItem ? (
        <Animated.View key={activeItem.id} entering={FadeInDown.duration(250)}>
          <GlassCard
            elevation="sm"
            onPress={() => navigation.navigate('WebView', { url: activeItem.url, title: activeItem.title })}
            style={[styles.itemCard, { borderColor: colors.glassBorder, borderRadius: radius.md }]}
          >
            <View style={styles.itemHeader}>
              <View style={[styles.tagBadge, { backgroundColor: colors.primaryMuted }]}>
                <Text variant="caption" style={{ color: colors.primary, fontWeight: '700', fontSize: 10 }}>
                  {activeItem.tag}
                </Text>
              </View>
              <Text variant="caption" color="textTertiary" style={{ fontSize: 10, fontWeight: '600' }}>
                {activeItem.source}
              </Text>
            </View>

            <Text variant="bodyStrong" numberOfLines={2} style={{ fontSize: 13, marginTop: 6 }}>
              {activeItem.title}
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={3} style={{ fontSize: 11, lineHeight: 16, marginTop: 4 }}>
              {activeItem.summary}
            </Text>

            <View style={[styles.footerRow, { marginTop: 10 }]}>
              <Text variant="caption" color="textTertiary" style={{ fontSize: 10 }}>
                Today’s Highlight
              </Text>
              <View style={styles.readBtnRow}>
                <Text variant="caption" color="primary" style={{ fontWeight: '700', fontSize: 11 }}>
                  Read Article
                </Text>
                <Icon name="open-outline" size={13} color={colors.primary} />
              </View>
            </View>
          </GlassCard>
        </Animated.View>
      ) : (
        <View style={{ padding: 16, alignItems: 'center' }}>
          <ActivityIndicator color={colors.primary} />
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  titleWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  refreshBtn: { width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  tabRow: { flexDirection: 'row', padding: 3, gap: 2 },
  tabBtn: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  itemCard: { padding: 12, gap: 2 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  tagBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  readBtnRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
