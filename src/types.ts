/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MatchData {
  id: string;
  map: string;
  agent: string;
  score: string; // e.g. "13-11"
  outcome: 'Victory' | 'Defeat';
  kda: string; // e.g. "18/12/5"
  kdRatio: number;
  hsPercentage: number;
  adr: number;
  firstBloods: number;
  economicRating: number;
  timestamp: string;
}

export interface PlayerStats {
  name: string;
  tag: string;
  rank: string;
  overallHs: number;
  overallWinRate: number;
  recentMatches: MatchData[];
}

export interface TrainingInsight {
  category: 'mira' | 'posicionamento' | 'economia' | 'utilitarias';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  actionableStep: string;
}

export interface MapPerformance {
  mapName: string;
  winRate: number;
  bestAgent: string;
  tendency: string; // e.g. "Struggles on Defense"
}

export interface TacticalMetric {
  label: string;
  value: number;
  average: number; // For comparison
  description: string;
}

export interface AnalysisResult {
  id: string;
  userId: string;
  riotId: string;
  overallScore: number;
  tacticalBreakdown: {
    mira: TacticalMetric;
    gameSense: TacticalMetric;
    economia: TacticalMetric;
    posicionamento: TacticalMetric;
    utilitarias: TacticalMetric;
  };
  mapMastery: MapPerformance[];
  insights: TrainingInsight[];
  trainingPlan: {
    title: string;
    duration: string;
    exercises: {
      name: string;
      mode: string;
      focus: string;
      sets: string;
    }[];
  };
  coachVerdict: string;
  createdAt: string;
}
