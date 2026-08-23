import React from 'react';
import { FlatList, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { CONTENT_MAX_WIDTH } from '../constants/layout';

export interface CarouselProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string;
  /** How much of the next card peeks in, hinting horizontal scroll. */
  peek?: number;
  /** Cap so cards don't stretch on tablets. */
  maxItemWidth?: number;
}

/**
 * A snapping horizontal carousel: cards snap to position, the next card peeks
 * in to signal more content, spacing is consistent, and there is NO auto-scroll.
 * Cards fill the computed item width, so any full-width card component drops in.
 */
export function Carousel<T>({
  data,
  renderItem,
  keyExtractor,
  peek = 32,
  maxItemWidth = 360,
}: CarouselProps<T>) {
  const { spacing } = useTheme();
  const { width } = useWindowDimensions();
  const pad = spacing.lg;
  const gap = spacing.md;
  const itemWidth = Math.min(width - pad * 2 - peek, maxItemWidth, CONTENT_MAX_WIDTH);

  return (
    <FlatList
      horizontal
      data={data}
      keyExtractor={keyExtractor}
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={itemWidth + gap}
      snapToAlignment="start"
      contentContainerStyle={{ paddingHorizontal: pad, gap }}
      renderItem={({ item, index }) => (
        <View style={{ width: itemWidth }}>{renderItem(item, index)}</View>
      )}
    />
  );
}
