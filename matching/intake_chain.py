from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

def build_intake_chain():
    prompt = PromptTemplate(
        input_variables=["description"],
        template="""
You are a legal assistant. A user has described their issue in plain English.
Extract:
1. Legal issues
2. Involved parties
3. Urgency (Low/Medium/High)
Respond in JSON.

Description: {description}
"""
    )
    llm = ChatOpenAI(temperature=0, model_name="gpt-3.5-turbo")
    return LLMChain(llm=llm, prompt=prompt)

def extract_case_info(description):
    chain = build_intake_chain()
    result=chain.run(description=description)
    return result
