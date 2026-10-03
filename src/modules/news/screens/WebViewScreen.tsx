import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebView from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/types';
import { Text } from '../../../components/Text';
import { useTheme } from '../../../theme/ThemeProvider';
import { openExternal, shareAchievement } from '../../../utils/appLinks';

type WebViewRouteProp = RouteProp<RootStackParamList, 'WebView'>;

export const WebViewScreen: React.FC = () => {
  const { colors, radius } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<WebViewRouteProp>();
  const { url, title } = route.params;

  const [loading, setLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState(title || 'AI News Reader');
  const [canGoBack, setCanGoBack] = useState(false);
  const webViewRef = React.useRef<WebView>(null);

  // Extract clean domain name from URL
  const domain = React.useMemo(() => {
    try {
      const match = url.match(/^https?:\/\/([^/]+)/i);
      return match ? match[1].replace(/^www\./, '') : 'web';
    } catch {
      return 'web';
    }
  }, [url]);

  const handleBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    } else {
      navigation.goBack();
    }
  };

  const handleShare = () => {
    shareAchievement(`📰 Check out this AI news article on Anviksha: ${url}`);
  };

  const handleOpenExternal = () => {
    openExternal(url);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Header Bar */}
      <View style={[styles.header, { borderColor: colors.border, backgroundColor: colors.surface }]}>
        <Pressable
          onPress={handleBack}
          style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}
          hitSlop={8}
          accessibilityLabel="Back"
        >
          <Icon name="arrow-back" size={20} color={colors.text} />
        </Pressable>

        <View style={styles.titleWrap}>
          <View style={styles.domainRow}>
            <Icon name="lock-closed" size={11} color={colors.success || '#10B981'} />
            <Text variant="caption" color="textSecondary" style={{ fontSize: 11, fontWeight: '600' }} numberOfLines={1}>
              {domain}
            </Text>
          </View>
          <Text variant="bodyStrong" numberOfLines={1} style={{ fontSize: 13, fontWeight: '700' }}>
            {pageTitle}
          </Text>
        </View>

        <View style={styles.rightActions}>
          <Pressable
            onPress={handleShare}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}
            hitSlop={8}
            accessibilityLabel="Share Article"
          >
            <Icon name="share-outline" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            onPress={handleOpenExternal}
            style={[styles.iconBtn, { backgroundColor: colors.surfaceAlt, borderRadius: radius.sm }]}
            hitSlop={8}
            accessibilityLabel="Open in External Browser"
          >
            <Icon name="open-outline" size={18} color={colors.text} />
          </Pressable>
        </View>
      </View>

      {/* Loading Bar */}
      {loading && (
        <View style={[styles.loadingBar, { backgroundColor: colors.primaryMuted }]}>
          <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />
        </View>
      )}

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onNavigationStateChange={(navState) => {
            setCanGoBack(navState.canGoBack);
            if (navState.title && !title) {
              setPageTitle(navState.title);
            }
          }}
          startInLoadingState={true}
          renderLoading={() => (
            <View style={[styles.loadingOverlay, { backgroundColor: colors.background }]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text variant="caption" color="textSecondary" style={{ marginTop: 12 }}>
                Loading in-app article...
              </Text>
            </View>
          )}
          style={{ flex: 1, backgroundColor: colors.background }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    gap: 10,
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justify: 'center',
  },
  titleWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  loadingBar: {
    height: 3,
    width: '100%',
    alignItems: 'center',
    justify: 'center',
  },
  loader: {
    transform: [{ scale: 0.7 }],
  },
  webViewContainer: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justify: 'center',
  },
});
