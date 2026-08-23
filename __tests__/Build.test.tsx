/**
 * Smoke test: the "Build the AI" game renders inside a navigator without
 * throwing (drag list, scenario picker, component pool).
 * @format
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { BuildScreen } from '../src/modules/build/screens/BuildScreen';

const Stack = createNativeStackNavigator();

test('Build the AI screen renders', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(
      <SafeAreaProvider
        initialMetrics={{
          frame: { x: 0, y: 0, width: 390, height: 844 },
          insets: { top: 24, left: 0, right: 0, bottom: 0 },
        }}
      >
        <ThemeProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="BuildAI" component={BuildScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
});
