# app.py

import streamlit as st
from intake_chain import extract_case_info
from dotenv import load_dotenv

load_dotenv()

st.title("AI-Powered Legal Intake")

user_input = st.text_area("Describe your legal issue in plain language:")

if st.button("Analyze"):
    with st.spinner("Analyzing..."):
        result = extract_case_info(user_input)
        st.json(result)
