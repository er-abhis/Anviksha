import React from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';

interface Props {
  icon: string;
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}

export const SettingRow: React.FC<Props> = ({
  icon,
  label,
  description,
  value,
  onValueChange,
}) => {
  const { colors, spacing } = useTheme();
  return (
    <View style={[styles.row, { paddingVertical: spacing.md, gap: spacing.md }]}>
      <View style={[styles.icon, { backgroundColor: colors.surfaceAlt }]}>
        <Icon name={icon} size={18} color={colors.text} />
      </View>
      <View style={styles.flex}>
        <Text variant="bodyStrong">{label}</Text>
        {description && (
          <Text variant="caption" color="textSecondary">
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ true: colors.primary, false: colors.border }}
        thumbColor={colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
