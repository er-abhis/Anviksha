import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Gradient, GlassCard, IconButton, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { useAILabStore } from '../../../store';
import { getMission } from '../data/missions';
import { LabProject } from '../types';

interface SavedProjectsProps {
  onResume: (project: LabProject) => void;
}

/** Saved-build list with Resume / Rename / Duplicate / Delete. */
export const SavedProjects: React.FC<SavedProjectsProps> = ({ onResume }) => {
  const { colors, spacing, radius, gradients } = useTheme();
  const projects = useAILabStore(s => s.projects);
  const renameProject = useAILabStore(s => s.renameProject);
  const duplicateProject = useAILabStore(s => s.duplicateProject);
  const deleteProject = useAILabStore(s => s.deleteProject);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const list = Object.values(projects).sort((a, b) => b.updatedAt - a.updatedAt);
  if (list.length === 0) return null;

  const startRename = (p: LabProject) => {
    setEditingId(p.id);
    setDraftName(p.name);
  };
  const commitRename = () => {
    if (editingId && draftName.trim()) renameProject(editingId, draftName.trim());
    setEditingId(null);
  };
  const confirmDelete = (p: LabProject) =>
    Alert.alert('Delete project', `Delete "${p.name}"? This can't be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteProject(p.id) },
    ]);

  return (
    <View style={{ gap: spacing.sm }}>
      <Text variant="label" color="textSecondary">
        SAVED BUILDS
      </Text>
      {list.map((p, i) => {
        const mission = getMission(p.missionId);
        const editing = editingId === p.id;
        return (
          <Animated.View
            key={p.id}
            layout={LinearTransition}
          >
          <GlassCard elevation="md">
            <View style={[styles.row, { gap: spacing.sm }]}>
              <View
                style={[
                  styles.emoji,
                  { borderRadius: radius.md, overflow: 'hidden' },
                ]}
              >
                <Gradient
                  colors={gradients.brand}
                  borderRadius={radius.md}
                  style={StyleSheet.absoluteFill}
                />
                <Text style={styles.emojiText}>{mission?.emoji ?? '🧪'}</Text>
              </View>

              <View style={styles.flex}>
                {editing ? (
                  <TextInput
                    value={draftName}
                    onChangeText={setDraftName}
                    autoFocus
                    onSubmitEditing={commitRename}
                    onBlur={commitRename}
                    returnKeyType="done"
                    maxLength={40}
                    accessibilityLabel="Project name"
                    placeholder="Project name"
                    placeholderTextColor={colors.textTertiary}
                    style={[
                      styles.input,
                      {
                        color: colors.text,
                        borderColor: colors.primary,
                        borderRadius: radius.sm,
                      },
                    ]}
                  />
                ) : (
                  <Pressable
                    onPress={() => onResume(p)}
                    accessibilityRole="button"
                    accessibilityLabel={`Resume ${p.name}`}
                  >
                    <Text variant="bodyStrong" numberOfLines={1}>
                      {p.name}
                    </Text>
                    <Text variant="caption" color="textSecondary" numberOfLines={1}>
                      {mission?.title ?? 'AI build'} · Score {p.score}
                    </Text>
                  </Pressable>
                )}
              </View>

              {editing ? (
                <IconButton
                  name="checkmark"
                  onPress={commitRename}
                  accessibilityLabel="Save name"
                  color="success"
                />
              ) : (
                <View style={styles.actions}>
                  <IconButton
                    name="create-outline"
                    onPress={() => startRename(p)}
                    accessibilityLabel="Rename"
                    size={18}
                  />
                  <IconButton
                    name="copy-outline"
                    onPress={() => duplicateProject(p.id)}
                    accessibilityLabel="Duplicate"
                    size={18}
                  />
                  <IconButton
                    name="trash-outline"
                    onPress={() => confirmDelete(p)}
                    accessibilityLabel="Delete"
                    color="error"
                    size={18}
                  />
                </View>
              )}
            </View>
          </GlassCard>
          </Animated.View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  flex: { flex: 1 },
  emoji: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  emojiText: { fontSize: 20 },
  actions: { flexDirection: 'row', alignItems: 'center' },
  input: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 15,
  },
});
