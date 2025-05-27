from stable_baselines3 import PPO
import pandas as pd
from env.matching_env import CaseMatchingEnv

cases = pd.read_csv("data/cases.csv")
advocates = pd.read_csv("data/advocates.csv")
history = pd.read_csv("data/history.csv")

env = CaseMatchingEnv(cases, advocates, history)
model = PPO.load("case_match_rl_model")

obs = env.reset()
done = False

while not done:
    action, _ = model.predict(obs)
    obs, reward, done, _ = env.step(action)
    print(f"Selected Advocate ID: {advocates.iloc[action]['id']}, Reward: {reward}")
