import os
import json
import google.generativeai as genai
from huggingface_hub import InferenceClient
from dotenv import load_dotenv

load_dotenv()

# 1. Setup Hugging Face (Sentiment Labeling)
hf_client = InferenceClient(
    provider="hf-inference",
    api_key=os.getenv("HUGGINGFACE_API_TOKEN")
)

# 2. Setup Gemini (Extraction & Rating Reasoning)
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

def analyze_sentiment(text):
    """Mendapatkan label POSITIVE/NEGATIVE dari HF"""
    try:
        result = hf_client.text_classification(
            text,
            model="distilbert/distilbert-base-uncased-finetuned-sst-2-english"
        )
        if result:
            top_result = max(result, key=lambda x: x.score)
            return {
                "label": top_result.label,
                "score": f"{top_result.score:.2f}"
            }
        return {"label": "UNKNOWN", "score": "0.0"}
    except Exception as e:
        print(f"⚠️ Error HF: {e}")
        return {"label": "ERROR", "score": "0.0"}

def analyze_with_gemini(text):
    """
    Satu kali panggil ke Gemini untuk dapatkan:
    1. Rating (1-5) berdasarkan nuansa teks.
    2. Key Points (Bullet points).
    """
    try:
        prompt = f"""
        You are an expert product review analyst. 
        Analyze this review text: "{text}"
        
        Return ONLY a raw JSON object (no markdown, no backticks) with this exact structure:
        {{
            "rating": <integer_1_to_5>,
            "key_points": "<string_summary_in_indonesian_bullet_points>"
        }}

        Rules:
        - "rating": Infer the star rating based on user sentiment (1=Terrible, 5=Perfect).
        - "key_points": Extract 3 main points, concise, in Bahasa Indonesia.
        """
        
        response = model.generate_content(prompt)
        cleaned_text = response.text.replace('```json', '').replace('```', '').strip()
        
        return json.loads(cleaned_text)
        
    except Exception as e:
        print(f"⚠️ Error Gemini: {e}")
        # Fallback values jika Gemini gagal/limit habis
        return {
            "rating": 0,
            "key_points": "Gagal menganalisis detail via AI."
        }

def analyze_review(text):
    """Fungsi Utama: Orkestrasi AI"""
    print(f"🤖 AI Analyzing: {text[:40]}...")
    
    sentiment = analyze_sentiment(text)
    
    gemini_result = analyze_with_gemini(text)
    
    return {
        "sentiment_label": sentiment['label'],
        "sentiment_score": sentiment['score'],
        "rating": gemini_result['rating'],
        "key_points": gemini_result['key_points']
    }
