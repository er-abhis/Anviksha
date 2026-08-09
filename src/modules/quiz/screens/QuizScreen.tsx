import React from 'react';
import { Header, EmptyState, Screen } from '../../../components';

export const QuizScreen: React.FC = () => (
  <Screen>
    <Header title="Quiz" large />
    <EmptyState
      icon="help-circle-outline"
      title="Quizzes coming soon"
      message="Quick, playful checks to lock in what you learn — one concept at a time."
    />
  </Screen>
);
