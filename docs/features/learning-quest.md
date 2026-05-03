# Learning quest

The **RAG Learning Quest** is an in-app tutorial at **`/learn`**: Monaco-based coding challenges that teach embeddings, chunking, and vector search without leaving the main Nuxt app.

---

## What you get

- **3 levels** — embeddings → chunking → vector database  
- **9 challenges** with increasing difficulty and **XP**  
- **Monaco editor** in the browser with validation against real test cases  
- **Progress** persisted locally (badges and unlock rules)

---

## Routes (high level)

| Path | Role |
| --- | --- |
| `/learn` | Hub / level map |
| `/learn/challenge/:id` | Individual challenge |
| `/learn/wizard` | Guided setup (optional) |

Vue pages live under `pages/learn/`; challenge definitions and validators under `utils/learning/`.

---

## Deeper guide

The product-focused walkthrough (XP tables, unlock rules, hint penalties) is maintained here:

👉 **[RAG Learning Quest (full guide) →](/learning/learning)**

---

## Next

- [RAG pipeline →](./rag-pipeline)  
- [Architecture →](/architecture/)  
- [Contributing →](/contributing)
