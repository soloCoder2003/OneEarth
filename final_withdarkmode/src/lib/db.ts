import { User, Challenge, ChallengeCompletion, Reward } from './types';

// Sample data for the app
const sampleUsers: User[] = [
  {
    id: '1',
    username: 'user1',
    email: 'user1@example.com',
    password: 'password',
    role: 'user',
    xp: 150,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    username: 'user2',
    email: 'user2@example.com',
    password: 'password',
    role: 'user',
    xp: 300,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    username: 'ecohost',
    email: 'host@example.com',
    password: 'password',
    role: 'host',
    xp: 0,
    createdAt: new Date().toISOString(),
  },
];

const sampleChallenges: Challenge[] = [
  {
    id: '1',
    title: 'Plastic-Free Week',
    description: 'Go without single-use plastics for a full week. Document your journey.',
    xpValue: 50,
    hostId: '3',
    hostName: 'ecohost',
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Public Transit Champion',
    description: 'Use only public transportation for 5 days. Share your experience.',
    xpValue: 75,
    hostId: '3',
    hostName: 'ecohost',
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Zero Food Waste',
    description: 'Track and eliminate all food waste for 3 days. Show your meal planning.',
    xpValue: 40,
    hostId: '3',
    hostName: 'ecohost',
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
    createdAt: new Date().toISOString(),
  },
];

const sampleCompletions: ChallengeCompletion[] = [
  {
    id: '1',
    userId: '1',
    challengeId: '1',
    status: 'approved',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: '2',
    userId: '2',
    challengeId: '1',
    status: 'approved',
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
  {
    id: '3',
    userId: '1',
    challengeId: '2',
    status: 'pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleRewards: Reward[] = [
  {
    id: '1',
    title: 'Reusable Water Bottle',
    description: 'High-quality stainless steel water bottle for your eco-friendly journey.',
    hostId: '3',
    hostName: 'ecohost',
    xpCost: 100,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Tree Planting Certificate',
    description: 'We will plant a tree in your name with our partner organization.',
    hostId: '3',
    hostName: 'ecohost',
    xpCost: 200,
    available: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Eco Store Discount Code',
    description: '20% discount code for our partner eco-friendly store.',
    hostId: '3',
    hostName: 'ecohost',
    xpCost: 75,
    available: true,
    createdAt: new Date().toISOString(),
  },
];

// Local storage keys
const USERS_KEY = 'oneearth-users';
const CHALLENGES_KEY = 'oneearth-challenges';
const COMPLETIONS_KEY = 'oneearth-completions';
const REWARDS_KEY = 'oneearth-rewards';
const CURRENT_USER_KEY = 'oneearth-current-user';

// Initialize data in localStorage if it doesn't exist
const initializeData = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(sampleUsers));
  }
  if (!localStorage.getItem(CHALLENGES_KEY)) {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(sampleChallenges));
  }
  if (!localStorage.getItem(COMPLETIONS_KEY)) {
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(sampleCompletions));
  }
  if (!localStorage.getItem(REWARDS_KEY)) {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(sampleRewards));
  }
};

// User operations
export const getUsers = (): User[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const createUser = (user: Omit<User, 'id' | 'xp' | 'createdAt'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: (users.length + 1).toString(),
    xp: 0,
    createdAt: new Date().toISOString(),
  };
  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  return newUser;
};

export const updateUser = (user: User): User => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index !== -1) {
    users[index] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  return user;
};

export const updateUserXP = (userId: string, xpToAdd: number): User | undefined => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    users[userIndex].xp += xpToAdd;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[userIndex];
  }
  
  return undefined;
};

// Auth operations
export const getCurrentUser = (): User | null => {
  const currentUserJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!currentUserJson) return null;
  return JSON.parse(currentUserJson);
};

export const login = (email: string, password: string): User | null => {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return user;
  }
  return null;
};

export const logout = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

export const register = (username: string, email: string, password: string, role: 'user' | 'host'): User | null => {
  // Check if user already exists
  const existingUser = getUserByEmail(email);
  if (existingUser) return null;
  
  // Create new user
  const newUser = createUser({ username, email, password, role });
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  return newUser;
};

// Challenge operations
export const getChallenges = (): Challenge[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(CHALLENGES_KEY) || '[]');
};

export const getChallengeById = (id: string): Challenge | undefined => {
  const challenges = getChallenges();
  return challenges.find(challenge => challenge.id === id);
};

export const getChallengesByHostId = (hostId: string): Challenge[] => {
  const challenges = getChallenges();
  return challenges.filter(challenge => challenge.hostId === hostId);
};

export const createChallenge = (challenge: Omit<Challenge, 'id' | 'createdAt'>): Challenge => {
  const challenges = getChallenges();
  const newChallenge: Challenge = {
    ...challenge,
    id: (challenges.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  challenges.push(newChallenge);
  localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
  return newChallenge;
};

export const updateChallenge = (challenge: Challenge): Challenge => {
  const challenges = getChallenges();
  const index = challenges.findIndex(c => c.id === challenge.id);
  if (index !== -1) {
    challenges[index] = challenge;
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(challenges));
  }
  return challenge;
};

export const deleteChallenge = (id: string): boolean => {
  const challenges = getChallenges();
  const filteredChallenges = challenges.filter(challenge => challenge.id !== id);
  if (filteredChallenges.length < challenges.length) {
    localStorage.setItem(CHALLENGES_KEY, JSON.stringify(filteredChallenges));
    return true;
  }
  return false;
};

// Completion operations
export const getCompletions = (): ChallengeCompletion[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(COMPLETIONS_KEY) || '[]');
};

export const getCompletionById = (id: string): ChallengeCompletion | undefined => {
  const completions = getCompletions();
  return completions.find(completion => completion.id === id);
};

export const getCompletionsByUserId = (userId: string): ChallengeCompletion[] => {
  const completions = getCompletions();
  return completions.filter(completion => completion.userId === userId);
};

export const getCompletionsByChallengeId = (challengeId: string): ChallengeCompletion[] => {
  const completions = getCompletions();
  return completions.filter(completion => completion.challengeId === challengeId);
};

export const getPendingCompletionsForHost = (hostId: string): Array<ChallengeCompletion & { challenge: Challenge, user: User }> => {
  const completions = getCompletions();
  const challenges = getChallenges();
  const users = getUsers();
  
  // Get challenges by host
  const hostChallenges = challenges.filter(challenge => challenge.hostId === hostId);
  const hostChallengeIds = hostChallenges.map(challenge => challenge.id);
  
  // Get pending completions for those challenges
  const pendingCompletions = completions.filter(
    completion => 
      hostChallengeIds.includes(completion.challengeId) && 
      completion.status === 'pending'
  );
  
  // Enrich with challenge and user details
  return pendingCompletions.map(completion => {
    const challenge = challenges.find(c => c.id === completion.challengeId)!;
    const user = users.find(u => u.id === completion.userId)!;
    return { ...completion, challenge, user };
  });
};

export const createCompletion = (completion: Omit<ChallengeCompletion, 'id' | 'status' | 'submittedAt' | 'updatedAt'>): ChallengeCompletion => {
  // Check if already submitted
  const completions = getCompletions();
  const existing = completions.find(
    c => c.userId === completion.userId && c.challengeId === completion.challengeId
  );
  
  if (existing) {
    return existing;
  }
  
  const newCompletion: ChallengeCompletion = {
    ...completion,
    id: (completions.length + 1).toString(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  completions.push(newCompletion);
  localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  return newCompletion;
};

export const updateCompletion = (completion: ChallengeCompletion): ChallengeCompletion => {
  const completions = getCompletions();
  const index = completions.findIndex(c => c.id === completion.id);
  if (index !== -1) {
    completions[index] = {
      ...completion,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
    
    // If the completion was approved, update the user's XP
    if (completion.status === 'approved') {
      const challenge = getChallengeById(completion.challengeId);
      if (challenge) {
        updateUserXP(completion.userId, challenge.xpValue);
      }
    }
  }
  return completion;
};

// Reward operations
export const getRewards = (): Reward[] => {
  initializeData();
  return JSON.parse(localStorage.getItem(REWARDS_KEY) || '[]');
};

export const getRewardById = (id: string): Reward | undefined => {
  const rewards = getRewards();
  return rewards.find(reward => reward.id === id);
};

export const getRewardsByHostId = (hostId: string): Reward[] => {
  const rewards = getRewards();
  return rewards.filter(reward => reward.hostId === hostId);
};

export const createReward = (reward: Omit<Reward, 'id' | 'createdAt'>): Reward => {
  const rewards = getRewards();
  const newReward: Reward = {
    ...reward,
    id: (rewards.length + 1).toString(),
    createdAt: new Date().toISOString(),
  };
  rewards.push(newReward);
  localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  return newReward;
};

export const updateReward = (reward: Reward): Reward => {
  const rewards = getRewards();
  const index = rewards.findIndex(r => r.id === reward.id);
  if (index !== -1) {
    rewards[index] = reward;
    localStorage.setItem(REWARDS_KEY, JSON.stringify(rewards));
  }
  return reward;
};

export const deleteReward = (id: string): boolean => {
  const rewards = getRewards();
  const filteredRewards = rewards.filter(reward => reward.id !== id);
  if (filteredRewards.length < rewards.length) {
    localStorage.setItem(REWARDS_KEY, JSON.stringify(filteredRewards));
    return true;
  }
  return false;
};

// Leaderboard operations
export const getLeaderboard = (): User[] => {
  const users = getUsers();
  // Only include users with 'user' role and sort by XP
  return users
    .filter(user => user.role === 'user')
    .sort((a, b) => b.xp - a.xp);
};