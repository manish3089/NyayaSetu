from stable_baselines3 import PPO
from stable_baselines3.common.env_checker import check_env
import sys
import os
import pandas as pd

# ✅ Add root path so Python can import env/
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from env.matching_env import CaseMatchingEnv

# ✅ Correct dataset paths (based on your setup)
cases = pd.read_csv("datasets/all_cases.csv")
advocates = pd.read_csv("datasets/all_advocates.csv")
history = pd.read_csv("datasets/all_history.csv")

# ✅ Initialize and check custom environment
env = CaseMatchingEnv(cases, advocates, history)
check_env(env, warn=True)

# ✅ Train PPO model
model = PPO("MlpPolicy", env, verbose=1)
model.learn(total_timesteps=10000)

# ✅ Save the trained model once
model.save("case_match_rl_model")
print("✅ Model saved as 'case_match_rl_model.zip'")
