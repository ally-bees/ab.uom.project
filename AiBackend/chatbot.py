from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from langchain_google_genai import ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings
from langchain_chroma import Chroma
import json
import asyncio
from typing import List, Dict

# import the .env file
from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# configuration
DATA_PATH = r"data"
CHROMA_PATH = r"chroma_db"

embeddings_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# initiate the model
llm = ChatGoogleGenerativeAI(temperature=0.5, model='gemini-1.5-flash')

# connect to the chromadb
vector_store = Chroma(
    collection_name="example_collection",
    embedding_function=embeddings_model,
    persist_directory=CHROMA_PATH, 
)

# Set up the vectorstore to be the retriever
num_results = 5
retriever = vector_store.as_retriever(search_kwargs={'k': num_results})

# Pydantic models
class ChatMessage(BaseModel):
    message: str
    history: List[Dict[str, str]] = []

class ChatResponse(BaseModel):
    response: str

@app.post("/chat")
async def chat_endpoint(chat_request: ChatMessage):
    """Non-streaming chat endpoint"""
    try:
        # retrieve the relevant chunks based on the question asked
        docs = retriever.invoke(chat_request.message)
        
        # add all the chunks to 'knowledge'
        knowledge = ""
        for doc in docs:
            knowledge += doc.page_content + "\n\n"
        
        # Create the RAG prompt
        rag_prompt = f"""
        You are an assistant which answers questions based on knowledge which is provided to you.
        While answering, you don't use your internal knowledge, 
        but solely the information in the "The knowledge" section.
        You don't mention anything to the user about the provided knowledge.

        The question: {chat_request.message}

        Conversation history: {chat_request.history}

        The knowledge: {knowledge}
        """
        
        # Get response from LLM
        response = llm.invoke(rag_prompt)
        
        return ChatResponse(response=response.content)
        
    except Exception as e:
        return {"error": str(e)}

@app.post("/chat/stream")
async def chat_stream_endpoint(chat_request: ChatMessage):
    """Streaming chat endpoint"""
    async def generate_response():
        try:
            # retrieve the relevant chunks based on the question asked
            docs = retriever.invoke(chat_request.message)
            
            # add all the chunks to 'knowledge'
            knowledge = ""
            for doc in docs:
                knowledge += doc.page_content + "\n\n"
            
            # Create the RAG prompt
            rag_prompt = f"""
            You are an assistant which answers questions based on knowledge which is provided to you.
            While answering, you don't use your internal knowledge, 
            but solely the information in the "The knowledge" section.
            You don't mention anything to the user about the provided knowledge.

            The question: {chat_request.message}

            Conversation history: {chat_request.history}

            The knowledge: {knowledge}
            """
            
            # Stream response from LLM
            partial_response = ""
            for chunk in llm.stream(rag_prompt):
                partial_response += chunk.content
                yield f"data: {json.dumps({'response': partial_response})}\n\n"
                await asyncio.sleep(0.01)  # Small delay for better streaming
            
            yield f"data: {json.dumps({'done': True})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_response(),
        media_type="text/plain",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        }
    )

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)