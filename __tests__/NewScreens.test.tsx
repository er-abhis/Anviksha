import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { ModelExplorerScreen } from '../src/modules/brain/screens/ModelExplorerScreen';
import { NeuralVisualizerScreen } from '../src/modules/brain/screens/NeuralVisualizerScreen';
import { AIEvolutionTimeline } from '../src/modules/brain/components/AIEvolutionTimeline';
import { WebViewScreen } from '../src/modules/news/screens/WebViewScreen';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useRoute: () => ({
      params: { url: 'https://huggingface.co/papers', title: 'Test Article' },
    }),
  };
});

describe('New AI Features & Screens Smoke Tests', () => {
  const renderWithProviders = (children: React.ReactNode) =>
    ReactTestRenderer.act(() => {
      ReactTestRenderer.create(
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 390, height: 844 },
            insets: { top: 24, left: 0, right: 0, bottom: 0 },
          }}
        >
          <ThemeProvider>
            <NavigationContainer>{children}</NavigationContainer>
          </ThemeProvider>
        </SafeAreaProvider>
      );
    });

  it('renders ModelExplorerScreen without errors', async () => {
    await renderWithProviders(<ModelExplorerScreen />);
  });

  it('renders NeuralVisualizerScreen without errors', async () => {
    await renderWithProviders(<NeuralVisualizerScreen />);
  });

  it('renders AIEvolutionTimeline without errors', async () => {
    await renderWithProviders(<AIEvolutionTimeline />);
  });

  it('renders WebViewScreen without errors', async () => {
    await renderWithProviders(<WebViewScreen />);
  });
});
