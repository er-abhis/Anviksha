import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Top-level safety net. Catches any render/runtime error in the tree below and
 * shows a friendly recover screen instead of crashing the whole app. Kept
 * dependency-free (no theme/context/hooks) so it still works even if something
 * deeper is broken. "Try again" remounts the subtree.
 */
interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Surfaces in logcat/console for debugging; no crash reporter wired in.
    // eslint-disable-next-line no-console
    console.error('Uncaught UI error:', error);
  }

  reset = () => this.setState({ hasError: false });

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.msg}>
          The screen hit an unexpected error. You can try again — your progress is saved.
        </Text>
        <Pressable style={styles.btn} onPress={this.reset} accessibilityRole="button">
          <Text style={styles.btnText}>Try again</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0B0B12' },
  title: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', marginBottom: 8, textAlign: 'center' },
  msg: { fontSize: 14, color: '#B9B9C6', textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  btn: { backgroundColor: '#6C5CE7', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
});
