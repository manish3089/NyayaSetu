import os
import pandas as pd
import numpy as np
import random

# Ensure datasets folder exists
os.makedirs("datasets", exist_ok=True)

# Fixed domains
domains = ['Family', 'Criminal', 'Civil', 'Corporate', 'real_estate', 'intellectual property',
           'taxation', 'employment', 'environmental', 'international']

# Random name generators
first_names = ['Aarav', 'Vivaan', 'Aditya', 'Ishaan', 'Riya', 'Diya', 'Anaya', 'Sneha', 'Meera', 'Isha',
               'Karan', 'Sanjay', 'Raj', 'Pooja', 'Arjun', 'Neha', 'Rohit', 'Deepa', 'Alok', 'Tanvi']

last_names = ['Sharma', 'Verma', 'Kumar', 'Singh', 'Joshi', 'Patel', 'Reddy', 'Das', 'Sinha', 'Mehra',
              'Gupta', 'Iyer', 'Chatterjee', 'Banerjee', 'Naidu', 'Bose', 'Pandey', 'Mishra', 'Shetty', 'Rao']

def random_name():
    return f"{random.choice(first_names)} {random.choice(last_names)}"

# ✅ Create exactly 100 advocates
advocate_ids = list(range(1001, 1101))
advocates = pd.DataFrame({
    'id': advocate_ids,
    'name': [random_name() for _ in range(100)],
    'domain': np.random.choice(domains, size=100),
    'expertise_level': np.random.uniform(0.1, 1.0, size=100).round(2),
    'charge_per_hour': np.random.randint(500, 3000, size=100)
})

# ✅ Create exactly 100 cases
case_ids = list(range(2001, 2101))
cases = pd.DataFrame({
    'id': case_ids,
    'type': np.random.choice(domains, size=100),
    'complexity': np.random.randint(1, 11, size=100),
    'budget': np.random.randint(5000, 20000, size=100)
})

# ✅ Create exactly 100 match history entries
history = pd.DataFrame({
    'case_id': np.random.choice(case_ids, size=100),
    'advocate_id': np.random.choice(advocate_ids, size=100),
    'outcome': np.random.choice([0, 1], size=100)
})

# ✅ Save all into single files
cases.to_csv("datasets/all_cases.csv", index=False)
advocates.to_csv("datasets/all_advocates.csv", index=False)
history.to_csv("datasets/all_history.csv", index=False)

print("✅ Done: 100 cases, 100 advocates, 100 history entries saved in /datasets/")
