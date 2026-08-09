import React from 'react';
import { Header, EmptyState, Screen } from '../../../components';

export const SimulationsScreen: React.FC = () => (
  <Screen>
    <Header title="Simulations" large />
    <EmptyState
      icon="git-network-outline"
      title="No simulations yet"
      message="Guided, visual simulations of AI concepts will appear here as worlds unlock."
    />
  </Screen>
);
