import React from 'react';
import { Header, EmptyState, Screen } from '../../../components';

export const PlaygroundScreen: React.FC = () => (
  <Screen>
    <Header title="Playground" large />
    <EmptyState
      icon="flask-outline"
      title="Playground is warming up"
      message="Interactive AI sandboxes land here. Tweak, run, and watch models react in real time."
    />
  </Screen>
);
