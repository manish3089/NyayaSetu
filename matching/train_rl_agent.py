from stable_baselines3 import PPO
from stable_baselines3.common.env_checker import check_env
from env.matching_env import CaseMatchingEnv
import pandas as pd

cases = pd.read_csv("data/cases.csv")
advocates = pd.read_csv("data/advocates.csv")
history = pd.read_csv("data/history.csv")

env = CaseMatchingEnv(cases, advocates, history)
check_env(env)

model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=10000)
model.save("case_match_rl_model")
