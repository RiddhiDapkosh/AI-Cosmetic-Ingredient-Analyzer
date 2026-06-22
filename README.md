# ABSTRACT

CosmetiScan AI is an intelligent AI-powered cosmetic ingredient analyzer designed to help consumers understand skincare and cosmetic products more effectively. Most users are unable to interpret complex ingredient labels and identify ingredients that may cause allergies, irritation, acne, or other skin-related issues. The proposed system utilizes Optical Character Recognition (OCR) to extract ingredient information from product images and employs a Retrieval-Augmented Generation (RAG) framework using LangChain and ChromaDB to provide contextual and accurate explanations through the Gemini API. The application evaluates ingredient safety, predicts suitability for different skin types, identifies potentially harmful substances, and generates an overall product safety score. Built with Next.js, FastAPI, Supabase, and modern AI technologies, CosmetiScan AI provides users with an intelligent and user-friendly platform for making informed skincare decisions.

---

# INTRODUCTION

The skincare and cosmetic industry has witnessed significant growth over the past decade, resulting in thousands of products containing complex chemical ingredients. Consumers often find it difficult to understand ingredient labels and determine whether a product is suitable for their skin type or health conditions. Some ingredients may cause allergies, irritation, acne, or adverse reactions, especially in sensitive individuals and pregnant women.

Traditional ingredient databases provide static information and lack personalized explanations. Recent advancements in Artificial Intelligence and Large Language Models (LLMs) have enabled intelligent systems capable of providing contextual and human-like responses.

CosmetiScan AI aims to bridge this gap by combining OCR technology, Retrieval-Augmented Generation (RAG), vector databases, and Gemini AI to create an intelligent cosmetic ingredient analysis platform. The system provides detailed information about ingredients, their benefits, side effects, safety levels, and overall product suitability, thereby helping users make safer skincare choices.

---

# LITERATURE REVIEW

### 1. Optical Character Recognition (OCR)

OCR technology is widely used to convert images containing text into machine-readable formats. Tools such as EasyOCR and Tesseract OCR have shown high accuracy in extracting textual information from product labels and scanned documents.

### 2. Retrieval-Augmented Generation (RAG)

Lewis et al. (2020) introduced Retrieval-Augmented Generation, which combines external knowledge retrieval with language models to generate more accurate and context-aware responses. RAG overcomes the limitations of standalone LLMs by providing updated and domain-specific information.

### 3. Vector Databases

Vector databases such as ChromaDB enable efficient storage and retrieval of embeddings generated from textual data. They are widely used in semantic search and AI-based question-answering systems.

### 4. Large Language Models

Large Language Models like Gemini, GPT, and Llama provide natural language understanding and generation capabilities. These models enhance user interaction by generating contextual explanations and personalized recommendations.

### 5. AI in Healthcare and Cosmetics

Recent studies demonstrate the application of AI in medical diagnostics, ingredient analysis, and personalized recommendations. AI-powered systems improve decision-making and increase accessibility to expert-level information.

---

# METHODOLOGY

The proposed system follows the following workflow:

### Step 1: User Input

Users can:

* Upload cosmetic product images.
* Enter ingredient lists manually.

### Step 2: OCR Processing

EasyOCR or Tesseract OCR extracts text from uploaded images.

### Step 3: Text Preprocessing

Extracted ingredients are cleaned and standardized.

### Step 4: Knowledge Base Creation

Ingredient information is divided into chunks and converted into embeddings using Gemini Embeddings.

### Step 5: Vector Storage

Embeddings are stored in ChromaDB.

### Step 6: Retrieval Process

LangChain retrieves relevant ingredient information from ChromaDB based on user queries.

### Step 7: AI Analysis

Gemini API generates detailed explanations including:

* Ingredient purpose
* Benefits
* Side effects
* Safety levels
* Pregnancy safety
* Suitable skin types

### Step 8: Product Safety Evaluation

The system calculates:

* Overall safety score
* Risk level
* Detection of harmful ingredients
* Product summary

### Step 9: Data Storage

Results are stored in Supabase PostgreSQL for future reference and analysis history.

---

# IMPLEMENTATION

## Frontend

The user interface is developed using:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts

Features include:

* Responsive design
* Dark and light mode
* Dashboard
* Ingredient analyzer
* Analysis history
* Ingredient library
* Profile management

---

## Backend

FastAPI serves as the backend framework and handles:

* Image uploads
* OCR processing
* Embedding generation
* Vector retrieval
* AI analysis
* API endpoints

---

## Database

Supabase PostgreSQL stores:

* User information
* Products
* Ingredients
* Analysis history
* Saved products
* User settings

---

## AI Components

### OCR Module

* EasyOCR
* Tesseract OCR

### RAG Framework

* LangChain

### Vector Database

* ChromaDB

### LLM

* Gemini API

### Embeddings

* Gemini Embeddings

---

# CONCLUSION

CosmetiScan AI provides an intelligent solution for understanding cosmetic ingredients and improving consumer awareness regarding skincare products. By integrating OCR, Retrieval-Augmented Generation, vector databases, and Gemini AI, the system delivers accurate and contextual information about ingredients and their safety. The platform enables users to make informed decisions, reduces the risk of adverse skin reactions, and promotes safer cosmetic usage. Its scalable architecture and AI-driven approach make it suitable for future enhancements and real-world deployment.

---

# FUTURE SCOPE

The system can be extended with several advanced features:

1. Barcode and QR Code Scanner.
2. Product Comparison System.
3. Personalized Product Recommendations.
4. AI-based Skin Type Detection.
5. Acne Trigger Prediction.
6. Multi-language Support.
7. Mobile Application Development.
8. Voice Assistant Integration.
9. Community Reviews and Ratings.
10. Ingredient Compatibility Checker.
11. Pregnancy-Safe Product Recommendations.
12. Real-time Dermatologist Consultation Support.
13. Wearable Device Integration.
14. Recommendation Engine using Collaborative Filtering.
15. Offline AI Analysis Support.

---

# REFERENCES

### [1]

Lewis, P., Perez, E., Piktus, A., et al. (2020).
"Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks."
Advances in Neural Information Processing Systems (NeurIPS).

### [2]

Smith, R. (2007).
"An Overview of the Tesseract OCR Engine."
Proceedings of the Ninth International Conference on Document Analysis and Recognition.

### [3]

LangChain Documentation.
https://python.langchain.com/

### [4]

ChromaDB Documentation.
https://docs.trychroma.com/

### [5]

Google Gemini API Documentation.
https://ai.google.dev/

### [6]

EasyOCR Documentation.
https://www.jaided.ai/easyocr/

### [7]

Supabase Documentation.
https://supabase.com/docs

### [8]

FastAPI Documentation.
https://fastapi.tiangolo.com/

### [9]

Next.js Documentation.
https://nextjs.org/docs

### [10]

Tailwind CSS Documentation.
https://tailwindcss.com/docs

### [11]

Recharts Documentation.
https://recharts.org/

### [12]

Dosovitskiy, A. et al. (2021).
"An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale."
International Conference on Learning Representations (ICLR).

### [13]

Vaswani, A. et al. (2017).
"Attention Is All You Need."
Advances in Neural Information Processing Systems (NeurIPS).
