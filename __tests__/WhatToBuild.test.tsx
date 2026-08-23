/**
 * Smoke test: "What Would You Build?" renders inside a navigator.
 * @format
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { WhatToBuildScreen } from '../src/modules/build/screens/WhatToBuildScreen';

const Stack = createNativeStackNavigator();

test('What Would You Build screen renders', async () => {
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
              <Stack.Screen name="WhatToBuild" component={WhatToBuildScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
});
