import React from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { EmptyState, Header, Screen } from '../../../components';
import { RootStackParamList } from '../../../navigation/types';

/** Professional placeholder for features that aren't built yet. */
export const ComingSoonScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'ComingSoon'>>();
  const title = route.params?.title ?? 'Coming soon';
  const message =
    route.params?.message ??
    'This part of Anviksha is on the way. We’re building it with the same care as the rest of the app — check back soon.';

  return (
    <Screen>
      <Header title={title} onBack={() => navigation.goBack()} />
      <EmptyState
        icon="construct-outline"
        title="Coming soon"
        message={message}
      />
    </Screen>
  );
};
