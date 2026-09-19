import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlassCard, ProgressBar, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RAG_DATABASE, RAGQuery } from '../logic';

export const RAGRetrieval: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [selectedQuery, setSelectedQuery] = useState<RAGQuery>(RAG_DATABASE[0]);
  const [useRAG, setUseRAG] = useState(true);

  return (
    <View style={{ gap: spacing.lg }}>
      {/* Query Selector */}
      <GlassCard elevation="md">
        <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.sm }}>
          SELECT A USER QUERY TO TEST
        </Text>
        <View style={{ gap: spacing.sm }}>
          {RAG_DATABASE.map(q => {
            const active = q.id === selectedQuery.id;
            return (
              <Pressable
                key={q.id}
                onPress={() => setSelectedQuery(q)}
                style={[
                  styles.queryBtn,
                  {
                    backgroundColor: active ? colors.primaryMuted : colors.glass,
                    borderColor: active ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <Icon
                  name="help-circle-outline"
                  size={20}
                  color={active ? colors.primary : colors.textTertiary}
                />
                <Text
                  variant="bodyStrong"
                  color={active ? 'primary' : 'text'}
                  style={{ flex: 1 }}
                >
                  "{q.question}"
                </Text>
              </Pressable>
            );
          })}
        </View>
      </GlassCard>

      {/* RAG Toggle */}
      <View style={styles.seg}>
        <Pressable
          onPress={() => setUseRAG(true)}
          style={[
            styles.segBtn,
            {
              borderRadius: radius.pill,
              backgroundColor: useRAG ? colors.success + '22' : colors.glass,
              borderColor: useRAG ? colors.success : colors.glassBorder,
            },
          ]}
        >
          <Text variant="bodyStrong" style={{ color: useRAG ? colors.success : colors.textSecondary }}>
            ✅ RAG Enabled (Grounded)
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setUseRAG(false)}
          style={[
            styles.segBtn,
            {
              borderRadius: radius.pill,
              backgroundColor: !useRAG ? colors.error + '22' : colors.glass,
              borderColor: !useRAG ? colors.error : colors.glassBorder,
            },
          ]}
        >
          <Text variant="bodyStrong" style={{ color: !useRAG ? colors.error : colors.textSecondary }}>
            ❌ Raw LLM (No Docs)
          </Text>
        </Pressable>
      </View>

      {/* Vector Document Chunks Retrieval Pipeline */}
      {useRAG && (
        <GlassCard elevation="md">
          <Text variant="label" color="textSecondary" style={{ marginBottom: spacing.xs }}>
            VECTOR DATABASE RETRIEVAL (TOP RANKED CHUNKS)
          </Text>
          <View style={{ gap: spacing.sm }}>
            {selectedQuery.docs.map(d => (
              <View
                key={d.id}
                style={[
                  styles.docChunk,
                  {
                    backgroundColor: d.score > 0.8 ? colors.primaryMuted : colors.surfaceAlt,
                    borderColor: d.score > 0.8 ? colors.primary : colors.border,
                    borderRadius: radius.md,
                  },
                ]}
              >
                <View style={styles.docHeader}>
                  <Text variant="caption" color="primary">
                    Document Chunk #{d.id}
                  </Text>
                  <Text variant="caption" color="accent">
                    Similarity: {(d.score * 100).toFixed(0)}%
                  </Text>
                </View>
                <Text variant="body" color="textSecondary">
                  {d.text}
                </Text>
                <ProgressBar progress={d.score} height={4} color={d.score > 0.8 ? colors.primary : colors.textTertiary} />
              </View>
            ))}
          </View>
        </GlassCard>
      )}

      {/* Answer Output */}
      <GlassCard
        elevation="lg"
        style={{
          borderColor: useRAG ? colors.success : colors.error,
          borderWidth: 1.5,
        }}
      >
        <View style={styles.answerHeader}>
          <Icon
            name={useRAG ? 'checkmark-shield' : 'alert-circle'}
            size={22}
            color={useRAG ? colors.success : colors.error}
          />
          <Text variant="bodyStrong" style={{ color: useRAG ? colors.success : colors.error }}>
            {useRAG ? 'Grounded AI Response' : 'Raw LLM Response (Hallucinated Risk)'}
          </Text>
        </View>
        <Text variant="body" style={{ marginTop: spacing.xs, lineHeight: 22 }}>
          {useRAG ? selectedQuery.ragAnswer : selectedQuery.rawAnswer}
        </Text>
      </GlassCard>

      <GlassCard elevation="md" style={{ borderColor: colors.primary + '55' }}>
        <Text variant="bodyStrong" color="primary" style={{ marginBottom: spacing.xs }}>
          What just happened?
        </Text>
        <Text variant="body" color="textSecondary">
          Retrieval-Augmented Generation (RAG) fetches accurate, factual documents from a vector store
          before passing them into the model's prompt. Without RAG, LLMs rely only on training weights
          and risk making up plausible lies (hallucinations)!
        </Text>
      </GlassCard>
    </View>
  );
};

const styles = StyleSheet.create({
  queryBtn: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderWidth: 1 },
  seg: { flexDirection: 'row', gap: 8 },
  segBtn: { flex: 1, alignItems: 'center', paddingVertical: 10, borderWidth: 1 },
  docChunk: { padding: 12, borderWidth: 1, gap: 6 },
  docHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
