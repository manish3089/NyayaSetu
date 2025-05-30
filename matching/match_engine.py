import pandas as pd
from stable_baselines3 import PPO
from env.matching_env import CaseMatchingEnv

# ✅ Load the trained PPO model
model = PPO.load("case_match_rl_model")

# ✅ Load the unified datasets
cases = pd.read_csv("datasets/all_cases.csv")
advocates = pd.read_csv("datasets/all_advocates.csv")
history = pd.read_csv("datasets/all_history.csv")

# ✅ Use the most recent case for testing
current_case = cases.iloc[[-1]]  # last case as a DataFrame
env = CaseMatchingEnv(current_case, advocates, history)

obs, _ = env.reset()
results = []

# ✅ Score each lawyer manually
for i in range(len(advocates)):
    env_copy = CaseMatchingEnv(current_case, advocates, history)
    obs_copy, _ = env_copy.reset()
    _, reward, _, _, _ = env_copy.step(i)

    matched_adv = advocates.iloc[i]
    results.append({
        'Case ID': current_case.iloc[0]['id'],
        'Advocate ID': matched_adv['id'],
        'Advocate Name': matched_adv['name'],
        'Domain': matched_adv['domain'],
        'Expertise Level': matched_adv['expertise_level'],
        'Charge per Hour': matched_adv['charge_per_hour'],
        'Match Score': round(reward, 4)
    })

# ✅ Select top 5 lawyers by match score
top5 = sorted(results, key=lambda x: x['Match Score'], reverse=True)[:5]
df_top5 = pd.DataFrame(top5)

# ✅ Save results
df_top5.to_csv("datasets/top5_lawyer_matches.csv", index=False)
print("✅ Top 5 lawyer matches saved to datasets/top5_lawyer_matches.csv")
