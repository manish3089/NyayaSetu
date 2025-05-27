import gym
from gym import spaces
import numpy as np
import pandas as pd

class CaseMatchingEnv(gym.Env):
    def __init__(self, cases, advocates, history):
        super(CaseMatchingEnv, self).__init__()
        self.cases = cases
        self.advocates = advocates
        self.history = history
        self.current_case_idx = 0

        self.observation_space = spaces.Box(low=0, high=1, shape=(4,), dtype=np.float32)
        self.action_space = spaces.Discrete(len(advocates))

    def reset(self):
        self.current_case_idx = 0
        return self._get_observation()

    def _get_observation(self):
        case = self.cases.iloc[self.current_case_idx]
        return np.array([case['complexity'], *self._one_hot(case['domain']), 0.0, 0.0], dtype=np.float32)

    def _one_hot(self, domain):
        domains = ['Family', 'Criminal', 'Civil', 'Corporate']
        return [1.0 if d == domain else 0.0 for d in domains]

    def step(self, action):
        case = self.cases.iloc[self.current_case_idx]
        advocate = self.advocates.iloc[action]
        reward = self._calculate_reward(case, advocate)
        self.current_case_idx += 1
        done = self.current_case_idx >= len(self.cases)
        obs = self._get_observation() if not done else np.zeros(4, dtype=np.float32)
        return obs, reward, done, {}

    def _calculate_reward(self, case, advocate):
        domain_match = 1.0 if case['domain'] == advocate['domain'] else 0.0
        expertise_bonus = advocate['expertise_level']
        outcome = self.history[
            (self.history['case_id'] == case['id']) & (self.history['advocate_id'] == advocate['id'])
        ]
        if not outcome.empty:
            return 1.0 if outcome['success'].values[0] == 1 else -1.0
        return 0.5 * domain_match + 0.5 * expertise_bonus
