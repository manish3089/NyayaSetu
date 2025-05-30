import gymnasium as gym
from gymnasium import spaces
import numpy as np

class CaseMatchingEnv(gym.Env):
    def __init__(self, cases, advocates, history):
        super(CaseMatchingEnv, self).__init__()
        # your initialization code here

class CaseMatchingEnv(gym.Env):
    def __init__(self, cases, advocates, history):
        super(CaseMatchingEnv, self).__init__()
        self.cases = cases
        self.advocates = advocates
        self.history = history
        self.current_case_idx = 0

        self.cases.columns = self.cases.columns.str.strip().str.lower()
        self.advocates.columns = self.advocates.columns.str.strip().str.lower()
        self.history.columns = self.history.columns.str.strip().str.lower()

        self.min_complexity = self.cases['complexity'].min()
        self.max_complexity = self.cases['complexity'].max()

        self.observation_space = spaces.Box(low=0, high=1, shape=(7,), dtype=np.float32)
        self.action_space = spaces.Discrete(len(advocates))

    def reset(self, seed=None, options=None):
        self.current_case_idx = 0
        return self._get_observation(), {}

    def _get_observation(self):
        case = self.cases.iloc[self.current_case_idx]
        complexity_norm = (case['complexity'] - self.min_complexity) / (self.max_complexity - self.min_complexity)
        budget_norm = case['budget'] / 20000.0  # assuming max budget 20000

        return np.array([
            complexity_norm,
            *self._one_hot(case['type']),
            budget_norm,
            0.0
        ], dtype=np.float32)

    def _one_hot(self, domain):
        domains = ['Family', 'Criminal', 'Civil', 'Corporate']
        return [1.0 if d.lower() == domain.lower() else 0.0 for d in domains]

    def step(self, action):
        case = self.cases.iloc[self.current_case_idx]
        advocate = self.advocates.iloc[action]
        reward = self._calculate_reward(case, advocate)
        self.current_case_idx += 1
        done = self.current_case_idx >= len(self.cases)
        obs = self._get_observation() if not done else np.zeros(7, dtype=np.float32)
        return obs, reward, done, False, {}

    def _calculate_reward(self, case, advocate):
        domain_match = 1.0 if case['type'].lower() == advocate['domain'].lower() else 0.0
        expertise_bonus = advocate.get('expertise_level', 0.0)
        budget_factor = case['budget'] / 20000.0
        outcome = self.history[
            (self.history['case_id'] == case['id']) & (self.history['advocate_id'] == advocate['id'])]
        if not outcome.empty:
            return 1.0 if outcome['outcome'].values[0] == 1 else -1.0
        return 0.4 * domain_match + 0.4 * expertise_bonus + 0.2 * budget_factor
