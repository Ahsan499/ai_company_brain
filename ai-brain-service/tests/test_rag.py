from app.core.rag import _build_context_and_sources, answer_question
from app.core.vector_store import VectorStore


class FakeStore(VectorStore):
    def __init__(self, documents=None, metadatas=None, total=0):
        self._documents = documents or []
        self._metadatas = metadatas or []
        self._total = total

    def count(self, collection_name: str) -> int:
        return self._total

    def query(self, collection_name: str, query_text: str, n_results: int = 5):
        return {
            "documents": [self._documents],
            "metadatas": [self._metadatas],
            "ids": [["id-1"]],
            "distances": [[0.1]],
        }


def test_build_context_labels_sources():
    raw = {
        "documents": [["Chunk A text", "Chunk B text"]],
        "metadatas": [
            [
                {
                    "file_name": "report.pdf",
                    "file_id": "f1",
                    "web_view_link": "https://example.com/1",
                },
                {
                    "file_name": "notes.txt",
                    "file_id": "f2",
                    "web_view_link": "https://example.com/2",
                },
            ]
        ],
    }
    context, sources, names = _build_context_and_sources(raw)
    assert "[Source 1: report.pdf]" in context
    assert "[Source 2: notes.txt]" in context
    assert len(sources) == 2
    assert sources[0]["chunk_preview"].startswith("Chunk A")
    assert names == ["report.pdf", "notes.txt"]


def test_answer_question_skips_claude_when_collection_empty(monkeypatch):
    store = FakeStore(total=0)
    called = {"rag": False}

    def _fake_rag(*args, **kwargs):
        called["rag"] = True
        return "should not run"

    monkeypatch.setattr("app.core.rag.ask_claude_rag", _fake_rag)
    result = answer_question("What is X?", store)
    assert called["rag"] is False
    assert result["chunks_used"] == 0
    assert "empty" in result["answer"].lower() or "no relevant" in result["answer"].lower()
