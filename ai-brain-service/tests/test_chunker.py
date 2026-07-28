from app.ingestion.chunker import chunk_text


def test_chunk_text_empty_returns_no_chunks():
    assert chunk_text("", {"file_id": "abc"}) == []
    assert chunk_text("   ", {"file_id": "abc"}) == []


def test_chunk_text_short_document_single_chunk():
    chunks = chunk_text("Hello knowledge base", {"file_id": "file-1", "source": "google_drive"})
    assert len(chunks) == 1
    assert chunks[0]["text"] == "Hello knowledge base"
    assert chunks[0]["metadata"]["chunk_index"] == 0
    assert chunks[0]["metadata"]["total_chunks"] == 1
    assert chunks[0]["id"].startswith("chunk_")


def test_chunk_ids_are_deterministic():
    text = "A" * 2500
    first = chunk_text(text, {"file_id": "same-file"}, chunk_size=1000, chunk_overlap=150)
    second = chunk_text(text, {"file_id": "same-file"}, chunk_size=1000, chunk_overlap=150)
    assert [c["id"] for c in first] == [c["id"] for c in second]
    assert len(first) > 1
