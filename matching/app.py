from flask import Flask, render_template, request, jsonify
import pandas as pd
from stable_baselines3 import PPO
from env.matching_env import CaseMatchingEnv

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def match_lawyers():
    # Load data
    cases = pd.read_csv("datasets/all_cases.csv")
    advocates = pd.read_csv("datasets/all_advocates.csv")
    history = pd.read_csv("datasets/all_history.csv")

    all_domains = sorted(advocates['domain'].unique())
    selected_domain = request.form.get('domain') if request.method == 'POST' else None
    min_budget = request.form.get('min_budget', type=float)
    max_budget = request.form.get('max_budget', type=float)

    # Filter advocates based on domain
    filtered_advocates = advocates.copy()
    if selected_domain and selected_domain.strip() != '':
        filtered_advocates = filtered_advocates[filtered_advocates['domain'].str.lower() == selected_domain.lower()]

    # Filter based on budget
    if min_budget is not None:
        filtered_advocates = filtered_advocates[filtered_advocates['charge_per_hour'] >= min_budget]

    if max_budget is not None:
        filtered_advocates = filtered_advocates[filtered_advocates['charge_per_hour'] <= max_budget]

    if filtered_advocates.empty:
        error = "⚠️ No lawyers found matching your filters."
        return render_template(
            'results.html',
            domains=all_domains,
            error=error,
            results=None,
            selected_domain=selected_domain,
            min_budget=min_budget,
            max_budget=max_budget
        )

    # Use the most recent case for RL-based matching
    current_case = cases.iloc[[-1]]
    env = CaseMatchingEnv(current_case, filtered_advocates, history)
    model = PPO.load("case_match_rl_model")

    obs, _ = env.reset()
    scores = []

    for i in range(len(filtered_advocates)):
        env_copy = CaseMatchingEnv(current_case, filtered_advocates, history)
        obs_copy, _ = env_copy.reset()
        _, reward, _, _, _ = env_copy.step(i)
        scores.append((i, reward))

    top_5 = sorted(scores, key=lambda x: x[1], reverse=True)[:5]

    results = []
    for idx, reward in top_5:
        adv = filtered_advocates.iloc[idx]
        results.append({
            'name': adv['name'],
            'domain': adv['domain'],
            'expertise': adv['expertise_level'],
            'charge': adv['charge_per_hour'],
            'reward': round(reward, 2)
        })

    return render_template(
        'results.html',
        domains=all_domains,
        results=results,
        selected_domain=selected_domain,
        min_budget=min_budget,
        max_budget=max_budget,
        error=None
    )


@app.route('/items')
def get_items():
    search = request.args.get('filter')
    sort_by = request.args.get('sort', 'name')

    items = Item.query
    if search:
        items = items.filter(Item.name.ilike(f"%{search}%"))
    if sort_by == 'date':
        items = items.order_by(Item.date.desc())
    else:
        items = items.order_by(Item.name)

    return jsonify([item.to_dict() for item in items.all()])


if __name__ == '__main__':
    print("🚀 Flask server starting at http://127.0.0.1:5000")
    app.run(debug=True)
