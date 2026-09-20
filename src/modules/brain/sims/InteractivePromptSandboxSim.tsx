import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, GlassCard, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { triggerHaptic } from '../../../utils/haptics';

interface Persona {
  id: string;
  name: string;
  system: string;
  defaultPrompt: string;
}

const PERSONAS: Persona[] = [
  {
    id: 'json',
    name: 'Strict JSON API',
    system: 'System: You are an API gateway. Output strictly valid JSON object without markdown fences.',
    defaultPrompt: 'Parse sentiment for "App is fast and responsive!"',
  },
  {
    id: 'doctor',
    name: 'Medical Specialist',
    system: 'System: You are a board-certified clinical physician using formal diagnostic language.',
    defaultPrompt: 'Patient reported elevated blood pressure reading 150/95.',
  },
  {
    id: 'eli5',
    name: 'ELI5 Physics Tutor',
    system: 'System: Explain complex concepts like I am 5 years old using analogies.',
    defaultPrompt: 'How do Transformers and Attention work in AI?',
  },
];

export const InteractivePromptSandboxSim: React.FC = () => {
  const { colors, radius, spacing } = useTheme();
  const [selectedPersona, setSelectedPersona] = useState<Persona>(PERSONAS[0]);
  const [userPrompt, setUserPrompt] = useState(PERSONAS[0].defaultPrompt);
  const [temperature, setTemperature] = useState(0.2); // Low = deterministic
  const [topP, setTopP] = useState(0.9);
  const [outputStream, setOutputStream] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState(false);

  const handleSelectPersona = (p: Persona) => {
    triggerHaptic('selection');
    setSelectedPersona(p);
    setUserPrompt(p.defaultPrompt);
    setOutputStream('');
  };

  const handleRunStream = () => {
    triggerHaptic('impactHeavy');
    setIsStreaming(true);
    setOutputStream('');

    let mockResponse = '';
    if (selectedPersona.id === 'json') {
      mockResponse = '{\n  "sentiment": "positive",\n  "confidence": 0.98,\n  "intent": "feedback"\n}';
    } else if (selectedPersona.id === 'doctor') {
      mockResponse = 'Diagnosis: Stage 1 Hypertension. Recommended baseline: Lifestyle modification + Lisinopril 10mg daily.';
    } else {
      mockResponse = 'Think of Attention like a flashlight! When reading a big book, your eyes shine a light on the most important words.';
    }

    // Simulate real-time LLM token streaming
    const tokens = mockResponse.split(' ');
    let currentIdx = 0;

    const interval = setInterval(() => {
      if (currentIdx < tokens.length) {
        setOutputStream(prev => (prev ? prev + ' ' + tokens[currentIdx] : tokens[currentIdx]));
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        triggerHaptic('success');
      }
    }, 120);
  };

  return (
    <GlassCard elevation="md" padding={12} style={{ gap: 10 }}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconBox, { backgroundColor: colors.primaryMuted, borderRadius: radius.md }]}>
          <Icon name="code-slash-outline" size={20} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong">Interactive LLM Prompt Sandbox 🧪</Text>
          <Text variant="caption" color="textSecondary" style={{ fontSize: 11 }}>
            Test System Prompts, Temperature sampling & live token generation.
          </Text>
        </View>
      </View>

      {/* Preset Persona Selector */}
      <View style={{ gap: 4 }}>
        <Text variant="label" color="textSecondary" style={{ fontSize: 10 }}>
          SELECT SYSTEM PERSONA PRESET:
        </Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {PERSONAS.map(p => {
            const active = selectedPersona.id === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => handleSelectPersona(p)}
                style={[
                  styles.personaBtn,
                  {
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                    borderRadius: radius.pill,
                    borderColor: active ? colors.accent : colors.glassBorder,
                    borderWidth: active ? 1.5 : 1,
                  },
                ]}
              >
                <Text variant="caption" style={{ color: active ? colors.onPrimary : colors.text, fontWeight: active ? '700' : '500', fontSize: 10 }}>
                  {p.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* System Prompt View */}
      <View style={[styles.systemBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
        <Text variant="label" color="accent" style={{ fontSize: 10 }}>SYSTEM INSTRUCTION:</Text>
        <Text variant="caption" color="textSecondary" style={{ marginTop: 2, fontSize: 11 }}>
          {selectedPersona.system}
        </Text>
      </View>

      {/* User Input Prompt Field */}
      <View style={{ gap: 4 }}>
        <Text variant="label" color="textSecondary" style={{ fontSize: 10 }}>
          USER PROMPT:
        </Text>
        <TextInput
          value={userPrompt}
          onChangeText={setUserPrompt}
          placeholder="Enter user prompt..."
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.textInput,
            {
              backgroundColor: colors.surfaceAlt,
              color: colors.text,
              borderRadius: radius.md,
              borderColor: colors.glassBorder,
            },
          ]}
        />
      </View>

      {/* Temperature & Top-P Hyperparameter Sliders */}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={[styles.paramBox, { backgroundColor: colors.surface, borderRadius: radius.md }]}>
          <Text variant="caption" color="textSecondary" style={{ fontSize: 10 }}>
            Temp (Randomness): <Text variant="caption" style={{ fontWeight: '700', color: colors.primary }}>{temperature.toFixed(1)}</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
            {[0.0, 0.2, 0.7, 1.0].map(val => (
              <Pressable
                key={val}
                onPress={() => { setTemperature(val); triggerHaptic('selection'); }}
                style={[
                  styles.valPill,
                  { backgroundColor: temperature === val ? colors.primary : colors.surfaceAlt },
                ]}
              >
                <Text variant="caption" style={{ color: temperature === val ? colors.onPrimary : colors.textSecondary, fontSize: 9, fontWeight: '700' }}>
                  {val === 0.0 ? '0.0 (Strict)' : val === 1.0 ? '1.0 (Creative)' : val}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <Button
        label={isStreaming ? 'Streaming Tokens...' : 'Execute Prompt Stream ⚡'}
        size="sm"
        onPress={handleRunStream}
        disabled={isStreaming}
      />

      {/* Streamed Output Box */}
      {outputStream.length > 0 && (
        <View style={[styles.outputBox, { backgroundColor: colors.surfaceAlt, borderRadius: radius.md }]}>
          <Text variant="label" color="success" style={{ fontSize: 10 }}>
            LIVE GENERATED LLM TOKEN STREAM:
          </Text>
          <Text variant="body" color="text" style={{ marginTop: 4, fontSize: 12, lineHeight: 18 }}>
            {outputStream}
          </Text>
        </View>
      )}
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconBox: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  personaBtn: { paddingHorizontal: 10, paddingVertical: 4 },
  systemBox: { padding: 8 },
  textInput: { paddingHorizontal: 10, paddingVertical: 8, fontSize: 12, borderWidth: StyleSheet.hairlineWidth },
  paramBox: { flex: 1, padding: 8 },
  valPill: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 4 },
  outputBox: { padding: 10, borderWidth: StyleSheet.hairlineWidth, borderColor: 'rgba(16, 185, 129, 0.3)' },
});
