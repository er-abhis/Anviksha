import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, Card, Gradient, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { DEVELOPER_LINKEDIN, openExternal } from '../../../utils/appLinks';

const BIO =
  'Passionate about building educational products, AI-powered experiences, and developer tools that simplify complex concepts into enjoyable learning experiences.';

export const AboutDeveloperScreen: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const navigation = useNavigation();

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.xl }}>
      <Header title="About Developer" onBack={() => navigation.goBack()} />

      <Animated.View entering={FadeInDown.duration(400)}>
        <Gradient colors={[colors.primary, colors.accent]} style={{ ...styles.hero, borderRadius: radius.lg }}>
          <View style={styles.avatar}>
            <Icon name="person" size={40} color="#FFFFFF" />
          </View>
          <Text variant="h2" color="textInverse" center>Abhishek Choudhary</Text>
          <Text variant="label" color="textInverse" center style={styles.dim}>
            Senior Software Engineer
          </Text>
        </Gradient>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(120).duration(400)}>
        <Card elevation="sm">
          <Text variant="body" color="textSecondary" style={styles.bio}>{BIO}</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ gap: spacing.sm }}>
        <View style={styles.tags}>
          <Tag icon="flag-outline" label="Made in India 🇮🇳" />
          <Tag icon="rocket-outline" label="Independent Developer" />
        </View>
        <Button
          label="View LinkedIn"
          onPress={() => openExternal(DEVELOPER_LINKEDIN)}
          left={<Icon name="logo-linkedin" size={18} color={colors.onPrimary} />}
          fullWidth
        />
      </Animated.View>
    </Screen>
  );
};

const Tag: React.FC<{ icon: string; label: string }> = ({ icon, label }) => {
  const { colors, radius, spacing } = useTheme();
  return (
    <View style={[styles.tag, { backgroundColor: colors.surfaceAlt, borderRadius: radius.pill, paddingHorizontal: spacing.md }]}>
      <Icon name={icon} size={14} color={colors.textSecondary} />
      <Text variant="caption" color="textSecondary">{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 8, padding: 28, overflow: 'hidden' },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  dim: { opacity: 0.9 },
  bio: { lineHeight: 24 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  tag: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 7 },
});
