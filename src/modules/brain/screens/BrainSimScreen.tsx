import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Button, EmptyState, Header, Screen, Text } from '../../../components';
import { useTheme } from '../../../theme/ThemeProvider';
import { RootStackParamList } from '../../../navigation/types';
import { useBrainStore, useProgressStore } from '../../../store';
import { getSim } from '../data';
import { TokenExplorer } from '../sims/TokenExplorer';
import { NeuralNetwork } from '../sims/NeuralNetwork';
import { DecisionTree } from '../sims/DecisionTree';
import { TrainingLab } from '../sims/TrainingLab';
import { EmbeddingSpace } from '../sims/EmbeddingSpace';
import { AttentionMap } from '../sims/AttentionMap';
import { TemperatureLab } from '../sims/TemperatureLab';
import { KMeansClustering } from '../sims/KMeansClustering';
import { BiasVariance } from '../sims/BiasVariance';
import { CNNFilter } from '../sims/CNNFilter';
import { RAGRetrieval } from '../sims/RAGRetrieval';

const SIM_XP = 40;

const PANELS: Record<string, React.FC> = {
  'token-explorer': TokenExplorer,
  'neural-network': NeuralNetwork,
  'decision-tree': DecisionTree,
  'training-lab': TrainingLab,
  'embedding-space': EmbeddingSpace,
  'attention-map': AttentionMap,
  'temperature-lab': TemperatureLab,
  'kmeans-clustering': KMeansClustering,
  'bias-variance': BiasVariance,
  'cnn-filter': CNNFilter,
  'rag-retrieval': RAGRetrieval,
};

export const BrainSimScreen: React.FC = () => {
  const { colors, spacing } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<RootStackParamList, 'BrainSim'>>();
  const sim = getSim(route.params.simId);
  const Panel = sim ? PANELS[sim.id] : undefined;

  const completeSim = useBrainStore(s => s.completeSim);
  const alreadyDone = useBrainStore(s => Boolean(s.simsCompleted[route.params.simId]));
  const progress = useProgressStore();
  const [justDone, setJustDone] = useState(false);

  if (!sim || !Panel) {
    return (
      <Screen>
        <Header title="Simulation" onBack={() => navigation.goBack()} />
        <EmptyState
          icon="flask-outline"
          title="Simulation not found"
          message="Head back and pick another from the AI Brain."
          actionLabel="Back"
          onAction={() => navigation.goBack()}
        />
      </Screen>
    );
  }

  const onComplete = () => {
    const at = Date.now();
    const firstTime = completeSim(sim.id, sim.concept, at);
    if (firstTime) {
      progress.addXp(SIM_XP);
      progress.markCompleted(`sim:${sim.id}`, 100);
      progress.logActivity({
        label: `Explored ${sim.title}`,
        detail: `+${SIM_XP} XP · ${sim.concept}`,
        icon: 'flask',
        at,
      });
    }
    setJustDone(true);
  };

  const done = alreadyDone || justDone;

  return (
    <Screen scroll contentContainerStyle={{ gap: spacing.lg }}>
      <Header title={sim.title} subtitle={sim.concept} onBack={() => navigation.goBack()} />
      <Panel />
      {done ? (
        <View style={[styles.doneRow, { backgroundColor: colors.success + '22' }]}>
          <Icon name="checkmark-circle" size={20} color={colors.success} />
          <Text variant="bodyStrong" color="success">
            {justDone && !alreadyDone ? `Nice! +${SIM_XP} XP` : 'Simulation completed'}
          </Text>
        </View>
      ) : (
        <Button
          label="I explored this — got it"
          onPress={onComplete}
          right={<Icon name="checkmark" size={18} color={colors.onPrimary} />}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  doneRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 14, borderRadius: 16 },
});
