from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine, get_database_url_display, init_db, is_database_available
from app.routers import ai, audit_logs, auth, dashboard, product_requests, products, transactions, users, chatbot

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Inventory Management System",
    description="Full-stack inventory management with RBAC",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app|http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(transactions.router, prefix="/api")
app.include_router(audit_logs.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(product_requests.router, prefix="/api")
app.include_router(ai.router, prefix="/api")
app.include_router(chatbot.router)


@app.get("/api/health")
def health_check():
    return {"status": "ok"}