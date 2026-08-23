/**
 * Smoke test: the redesigned Home (carousels + sections) must render without
 * throwing. Mounts it inside a real navigator + providers so useNavigation and
 * the stores resolve as they do in the app.
 * @format
 */
import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { HomeScreen } from '../src/modules/home/screens/HomeScreen';

const Stack = createNativeStackNavigator();

test('Home screen renders', async () => {
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
              <Stack.Screen name="Home" component={HomeScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </SafeAreaProvider>,
    );
  });
});
