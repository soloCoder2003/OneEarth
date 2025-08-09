export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'host';
  xp: number;
  createdAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  xpValue: number;
  hostId: string;
  hostName: string;
  endDate: string;
  createdAt: string;
}

export interface ChallengeCompletion {
  id: string;
  userId: string;
  challengeId: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  updatedAt: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  hostId: string;
  hostName: string;
  xpCost: number;
  available: boolean;
  createdAt: string;
}