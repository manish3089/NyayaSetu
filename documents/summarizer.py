import spacy
import nltk
from nltk.corpus import stopwords
import re

# Download necessary NLTK resources
def download_nltk_resources():
    try:
        nltk.data.find('corpora/stopwords')
    except LookupError:
        nltk.download('stopwords')

download_nltk_resources()

# Load SpaCy model
nlp = spacy.load("en_core_web_sm")
stop_words = set(stopwords.words('english'))

# preprocess_text function (unchanged)
def preprocess_text(text):
    if not text:
        raise ValueError("Input text cannot be empty.")

    case_ids = re.findall(r'(Case\s*No\.?\s*\d+/\d+)', text)
    case_ids_lower = [cid.lower() for cid in case_ids]

    doc = nlp(text)
    
    entity_spans = []
    for ent in doc.ents:
        if ent.label_ in ['DATE', 'CARDINAL', 'ORDINAL']:
            entity_spans.append((ent.start, ent.end, ent.text.lower()))
    
    lemmas = case_ids_lower.copy()
    i = 0
    while i < len(doc):
        is_in_entity = False
        entity_text = None
        
        for start, end, text in entity_spans:
            if start <= i < end:
                is_in_entity = True
                entity_text = text
                i = end
                break
        
        if is_in_entity:
            if entity_text not in lemmas:
                lemmas.append(entity_text)
        else:
            token = doc[i]
            if not any(token.text.lower() in cid for cid in case_ids_lower):
                if token.ent_type_ in ['DATE', 'CARDINAL', 'ORDINAL', 'TIME']:
                    lemmas.append(token.text.lower())
                elif token.is_alpha and token.text.lower() not in stop_words:
                    lemmas.append(token.lemma_.lower())
            i += 1

    preprocessed_text = " ".join(lemmas)
    preprocessed_text = re.sub(r'\s+([.,:;!?])', r'\1', preprocessed_text)
    preprocessed_text = re.sub(r'([.,:;!?])\s+', r'\1 ', preprocessed_text)
    return preprocessed_text.strip()

def extract_entities(text):
    """
    Extracts named entities from the text including custom pattern for case numbers.

    Parameters:
    text (str): The input text from which to extract entities.

    Returns:
    dict: A dictionary containing lists of extracted entities.
    """
    if not text:
        raise ValueError("Input text cannot be empty.")

    doc = nlp(text)
    entities = {
        "PERSON": [],
        "ORG": [],
        "DATE": [],
        "GPE": [],
        "CASE_ID": []
    }

    # Custom logic to handle titles like "Judge"
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Include titles like "Judge" or "Justice"
            if ent.start > 0 and doc[ent.start - 1].text.lower() in ["judge", "justice"]:
                full_name = f"{doc[ent.start - 1].text} {ent.text}"
                entities["PERSON"].append(full_name)
            else:
                entities["PERSON"].append(ent.text)
        elif ent.label_ == "ORG":
            # Remove "the" from organization names
            org_name = ent.text.replace("the ", "")
            entities["ORG"].append(org_name)
        elif ent.label_ in entities:
            entities[ent.label_].append(ent.text)

    # Custom regex for case numbers
    case_ids = re.findall(r'(Case\s*No\.?\s*\d+/\d+)', text)
    entities["CASE_ID"].extend(case_ids)

    # Post-processing to capture missed organizations
    org_patterns = [
        r'High\s*Court\s*of\s*[A-Za-z]+',  # Matches "High Court of Karnataka"
        r'CID\s*[A-Za-z]+'  # Matches "CID Bengaluru"
    ]
    for pattern in org_patterns:
        matches = re.findall(pattern, text)
        for match in matches:
            entities["ORG"].append(match)

    # Remove redundant ORG entities (e.g., keep "High Court of Karnataka" over "High Court")
    filtered_orgs = []
    for org in entities["ORG"]:
        # Only add org if it's not a substring of another longer org
        if not any(org != other_org and org in other_org for other_org in entities["ORG"]):
            filtered_orgs.append(org)
    entities["ORG"] = filtered_orgs

    # Remove duplicates while preserving order
    for key in entities:
        entities[key] = list(dict.fromkeys(entities[key]))

    return entities

import numpy as np
import networkx as nx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load SpaCy model
nlp = spacy.load("en_core_web_sm")

def split_sentences(text):
    """Uses SpaCy to split text into sentences."""
    doc = nlp(text)
    return [sent.text.strip() for sent in doc.sents if sent.text.strip()]

def hybrid_summarize(text, top_n=3, textrank_weight=0.6, tfidf_weight=0.4):
    """
    Summarizes text using a hybrid approach combining TextRank and TF-IDF.
    
    Parameters:
        text (str): The input text.
        top_n (int): Number of top sentences to include in the summary.
        textrank_weight (float): Weight given to TextRank scores (0.0-1.0).
        tfidf_weight (float): Weight given to TF-IDF scores (0.0-1.0).
        
    Returns:
        str: Extractive summary.
    """
    # Validate weights
    if textrank_weight + tfidf_weight != 1.0:
        raise ValueError("Weights must sum to 1.0")
        
    sentences = split_sentences(text)
    if len(sentences) < top_n:
        return " ".join(sentences)

    # TF-IDF vectorization
    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(sentences)
    
    # TextRank scores
    sim_matrix = cosine_similarity(X)
    np.fill_diagonal(sim_matrix, 0)
    nx_graph = nx.from_numpy_array(sim_matrix)
    textrank_scores = np.array(list(nx.pagerank(nx_graph).values()))
    
    # Normalize TextRank scores to range [0,1]
    if textrank_scores.max() != textrank_scores.min():
        textrank_scores = (textrank_scores - textrank_scores.min()) / (textrank_scores.max() - textrank_scores.min())
    
    # TF-IDF scores (sum of TF-IDF values for each sentence)
    tfidf_scores = X.sum(axis=1).A1  # Flatten to 1D array
    
    # Normalize TF-IDF scores to range [0,1]
    if tfidf_scores.max() != tfidf_scores.min():
        tfidf_scores = (tfidf_scores - tfidf_scores.min()) / (tfidf_scores.max() - tfidf_scores.min())
    
    # Combine scores with weights
    combined_scores = textrank_weight * textrank_scores + tfidf_weight * tfidf_scores
    
    # Get top sentences by combined score
    ranked_indices = np.argsort(combined_scores)[::-1][:top_n]
    
    # Keep sentences in original order
    selected = [sentences[i] for i in sorted(ranked_indices)]
    
    return " ".join(selected)

def extractive_summarize(text, method='hybrid', top_n=3, textrank_weight=0.6, tfidf_weight=0.4):
    """
    Unified summarization function supporting multiple methods.
    
    Parameters:
        text (str): The input text.
        method (str): One of 'hybrid', 'textrank', or 'tfidf'.
        top_n (int): Number of top sentences to include in the summary.
        textrank_weight (float): Weight for TextRank in hybrid method.
        tfidf_weight (float): Weight for TF-IDF in hybrid method.
        
    Returns:
        str: Extractive summary.
    """
    if method == 'hybrid':
        return hybrid_summarize(text, top_n, textrank_weight, tfidf_weight)
    elif method == 'textrank':
        return textrank_summarize(text, top_n)
    elif method == 'tfidf':
        return tfidf_summarize(text, top_n)
    else:
        raise ValueError("Method must be 'hybrid', 'textrank', or 'tfidf'")

def textrank_summarize(text, top_n=3):
    """Summarizes text using TextRank (based on sentence similarity)."""
    sentences = split_sentences(text)
    if len(sentences) < top_n:
        return " ".join(sentences)

    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(sentences)

    sim_matrix = cosine_similarity(X)
    np.fill_diagonal(sim_matrix, 0)

    nx_graph = nx.from_numpy_array(sim_matrix)
    scores = nx.pagerank(nx_graph)

    ranked_sentences = sorted(((scores[i], s) for i, s in enumerate(sentences)), reverse=True)
    selected = [s for _, s in ranked_sentences[:top_n]]
    
    # Sort by original order
    original_indices = [sentences.index(s) for s in selected]
    selected = [selected[i] for i in np.argsort(original_indices)]
    
    return " ".join(selected)

def tfidf_summarize(text, top_n=3):
    """Summarizes text based on sentence importance via TF-IDF score sum."""
    sentences = split_sentences(text)
    if len(sentences) < top_n:
        return " ".join(sentences)

    vectorizer = TfidfVectorizer(stop_words='english')
    X = vectorizer.fit_transform(sentences)
    sentence_scores = X.sum(axis=1).A1  # Flatten to 1D array

    ranked_indices = np.argsort(sentence_scores)[::-1][:top_n]
    selected = [sentences[i] for i in sorted(ranked_indices)]  # Preserve order

    return " ".join(selected)

# Example usage
if __name__ == "__main__":
    sample_text = """
Parties
Saila Behari Singh Versus Commissioner Of Income-Tax
High Court of Judicature at Calcutta
Judges THE HONOURABLE CHIEF JUSTICE MR. HARRIES &amp; THE HONOURABLE MR. JUSTICE BANERJEE
I.-T. Ref No. 30 of 1951DOJ 03.01.1951
ADVOCATES APPEARED:For the Appearing Parties : J.C.Pal,Panchanan Pal,Priti Burman,R.B.Pal,Advocates.
Judgment
HARRIES, C. J.
(1) THIS is a reference under <PV>Section 66 (i) </PV>, <LG>Income-tax Act, </LG> at the instance of the assessee in which the following questions are propounded for the opinion of the Court:
<IS>(1) Whether the legal obligation created by the deed was rightly construed by the Tribunal as a private religious trust? If so, (2) Whether the last paragraph of   Section 4 (3)  (xii) enumerated above governs both the words "trust" and; "other legal obligations" as mentioned in   Section 4 (3)  (i) or only "trusts"?</IS>
(2) THE income sought to be assessed in this case was income from property which admittedly was devoted to religious purposes. The only difference between the parties was whether these properties which produced the income, which were admittedly debutter properties, were properties held in trust for deities or properties dedicated to the deities. The question arose upon the true construction to be given to the phrase "held under trust or other legal obligation wholly for religious or charitable purposes" appearing inSection 4 (3) (i), Income-tax Act. To this sub section there is appended an Explanation which is in these terms :
"in this sub-section, 'charitable purpose' includes relief of the poor, education, medical relief, and the advancement of any other object of general public utility but nothing contained in Clause (i), Clause (ia) or Clause (ii) shall operate to exempt from the provisions of this Act that part of the income of a private religious trust which does not enure for the benefit of the public. "
(3) IT will be seen that although <HD>under  Section 4 (3) (i) income derived from property held under trusts or other legal obligation wholly for religious or charitable purposes is exempt from taxation, the Explanation makes it clear that only that part of an income of a private religious trust is exempted which enures for the benefit of the public and that part which does not enure for the benefit of the public is not exempt from taxation.</HD>
(4) IT will be seen that what is not exempt from taxation is that part of the income of a private religious trust which does not enure for the benefit of the public and the question arose in an earlier case as to whether the words "private religious trust" were wide enough to cover all debutter property. This Court held in the case of Sree Sree Iswar Gopal Jew v. Commr. of Income-tax, West Bengal, (1950) 18 I. T. R. 743 (Cal.), that where the income arose from property dedicated to a deity as opposed to property held by trustees in trust for a deity, the provisions exempting (withdrawing the exemption from?) such portions of the income as did not enure for the benefit of the public had no application, and that where the income arose from dedicated property as opposed to property held on trust for the deity, the whole of the income was exempt from taxation.
(5) IT appears clear that the Appellate Tribunal regarded this income as income arising from property dedicated to deities rather than to property held in trust for deities. But in the view of the Appellate Tribunal it mattered not as no distinction could be drawn between property held under a private religious trust and property dedicated to a private deity. The case of course was decided by the Appellate Tribunal before the decision of this Court to which I have made reference.
(6) MR. Pal admits that if the income in this case arose from property dedicated to deities, no distinction could be drawn between this case and the authority of this Court which I have cited. However his contention is that the income in this case was income derived from property held on trust for deities and not from property dedicated to the deities. It seems from an Arpannama executed by the Shebaits on 21/11/1910 that the properties of Arpannama recite that a document is necessary for the following reasons:
"but although the aforesaid properties are really ancient debutter properties as there is no written deed of Arpannama and in order to remove our apprehension that in future someone might treat the aforesaid debutter properties or any portion thereof as secular properties we execute this deed of Arpannama and promise that the aforesaid properties are real debutter properties and that we both the brothers are at present absolute Maliks (owners) of the same as sole shebaits. "
<HD>From this recital it appears clear that the properties had been devoted to religious purposes for a considerable time. They are ancient debutter properties in which there was no written deed of Arpannama. That would strongly suggest that these were properties which had been dedicated to the deities in the past. Further it appears to me that there are other words used earlier which make it clear that these debutter properties were properties dedicated to the deities rather than properties held in trust for the deities. </HD>It is stated that certain expenses of the deities"which are being incurred to carry on the aforesaid 'sheba, Mahotsab etc. , or to make new construction and repairs in respect of Sree Mandir (temple), Natyasala (Auditorium), kitchen and stores etc. , the properties described in detail in the schedule given below have been dedicated for the same from the time of our ancestors as well as in our time. "
(7) IF that is a correct translation there can be no question that the properties were regarded as having been dedicated to the deities and that the income therefrom was to be devoted to the worship of the deity.
(8) MR. Pal however has contended that the translation is not accurate and that a more literal translation would have been that the properties had been earmarked for the deities. On the other hand my learned brother is satisfied that the translation does express the meaning of the original Arpannama. Even if the appropriate translation was "earmarked" that would be inappropriate for the creation of a trust in the English fashion, but would be more appropriate for the dedication or the creating of a legal obligation which is not a "trust" in the true sense of the word.
(9) <HD>THIS deed of Arpannama of course cannot create a trust. It merely recites that the properties were debutter and had been debutter for a long time. The executants recite that they are the shebaits and Mr. Pal lays great stress on the words they use namely, that they were "absolute Maliks of the same as sole shebaits. " It appears to me that all that that means is that they are the shebaits and of course have the sole management of the property and are in effect, if not in law, the owners for the time being. However, it is seen that a distinction is drawn between the ownership of property and the office of she-bait, because it is later stated that the owners of Ukhra Estate for the time being will be the shebaits. It seems to me that the Arpannama for what it is worth, shows that the properties were debutter and were not held in trust for the deities, but were properties which had been dedicated or given to the deities. The income from such properties cannot be said to be income arising from a private religious trust, as the word "trust" had a definite meaning and dedicated properties are not in the strict sense properties held in trust or properties which are the subject-matter of a trust. Once it is held that these properties were dedicated properties then the earlier case to which I have made reference admittedly applies and I would, therefore, answer the questions submitted as follows: Question (1) is answered in the negative. Question (2) is answered as follows: The last paragraph ofSection 4 (3) (xii), Income-tax Act governs only the word "trust" and does not govern the words "other legal obligations" which appear in   Section 4 (3)  (i) of the Act.</HD>
(10) THE assessees are entitled to the costs of these proceedings. Certified for two counsel.
    """
summary = extractive_summarize(sample_text)
print("\nSummary:\n",summary)

entities = extract_entities(sample_text)
print("\nExtracted Entities:\n", entities)

