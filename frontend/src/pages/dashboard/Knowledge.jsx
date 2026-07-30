import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BrainCircuit,
  HardDrive,
  Hash,
  Loader2,
  MessageSquareText,
  RefreshCw,
  Send,
  Sparkles,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import {
  getApiErrorMessage,
  useIngestDrive,
  useIngestSlack,
  useKnowledgeHealth,
  useKnowledgeQuery,
  useKnowledgeStatus,
} from '../../hooks/useKnowledge';

const SUGGESTIONS = [
  'What database did the team decide to use?',
  'Summarize the latest project updates from Drive and Slack.',
  'Who is leading the backend team?',
  'What open decisions are still pending?',
];

const PREVIEW_QUESTIONS = [
  'What database did the team decide to use?',
  'department workload report',
  'new-channel Slack updates',
];

function SourceCitation({ source, index, expanded, onToggle }) {
  const isSlack = source?.source === 'slack' || String(source?.file_name || '').startsWith('#');
  const label = source?.file_name || (source?.channel_name ? `#${source.channel_name}` : 'Source');
  const href = source?.web_view_link;
  const preview = String(source?.chunk_preview || '').trim();
  const previewText = preview.length > 180 ? `${preview.slice(0, 180).trim()}…` : preview;

  return (
    <div className="min-w-0">
      <button
        type="button"
        onClick={onToggle}
        className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 transition hover:opacity-90 ${
          isSlack
            ? 'bg-[#F4F0FF] text-[#4A154B] ring-[#4A154B]/15'
            : 'bg-[#EFF6FF] text-primary ring-primary/15'
        } ${expanded ? 'ring-2' : ''}`}
      >
        {isSlack ? <Hash size={11} strokeWidth={2} /> : <HardDrive size={11} strokeWidth={2} />}
        <span className="truncate">{label}</span>
        {preview ? (
          <span className="opacity-60">{expanded ? '▾' : '▸'}</span>
        ) : null}
      </button>

      <AnimatePresence initial={false}>
        {expanded && previewText ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.18 }}
            className="overflow-hidden"
          >
            <div className="mt-2 rounded-xl bg-[#F8FAFC] px-3 py-2.5 ring-1 ring-border/50">
              <p className="text-[11px] font-medium uppercase tracking-wide text-secondaryText">
                Source preview {index + 1}
              </p>
              <p className="mt-1 text-[12px] leading-relaxed text-heading/80 whitespace-pre-wrap">
                {previewText}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    Open in Drive
                  </a>
                ) : null}
                {isSlack ? (
                  <span className="text-[11px] text-secondaryText">
                    Full thread → open in Slack
                  </span>
                ) : null}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [openSource, setOpenSource] = useState(0);
  const sources = Array.isArray(message.sources) ? message.sources : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[92%] sm:max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? 'bg-primary text-white rounded-br-md'
            : 'bg-white/90 border border-border/50 text-heading rounded-bl-md'
        }`}
      >
        {!isUser && (
          <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary/80">
            <Sparkles size={12} />
            Knowledge Brain
          </div>
        )}
        <p className={`text-[14px] leading-relaxed whitespace-pre-wrap ${isUser ? 'text-white' : 'text-heading'}`}>
          {message.content}
        </p>
        {sources.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-border/40 pt-3">
            <p className="text-[11px] font-medium uppercase tracking-wide text-secondaryText">
              Sources used
            </p>
            <div className="flex flex-col gap-2">
              {sources.map((source, index) => (
                <SourceCitation
                  key={`${source.file_name || source.channel_name}-${index}`}
                  source={source}
                  index={index}
                  expanded={openSource === index}
                  onToggle={() => setOpenSource((prev) => (prev === index ? -1 : index))}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

const Knowledge = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const listRef = useRef(null);

  const { data: health, isError: healthError } = useKnowledgeHealth();
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useKnowledgeStatus();
  const ask = useKnowledgeQuery();
  const ingestDrive = useIngestDrive();
  const ingestSlack = useIngestSlack();

  const chromaOk = Boolean(health?.chroma_connected);
  const serviceUp = !healthError && Boolean(health?.status === 'ok' || chromaOk);
  const bySource = status?.by_source || {};
  const driveChunks = bySource.google_drive || 0;
  const slackChunks = bySource.slack || 0;
  const totalChunks = status?.total_chunks || 0;

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, ask.isPending]);

  const sendQuestion = async (question, { skipLlm = false } = {}) => {
    const cleaned = String(question || '').trim();
    if (!cleaned || ask.isPending) return;

    setInput('');
    setMessages((prev) => [
      ...prev,
      {
        id: `u-${Date.now()}`,
        role: 'user',
        content: skipLlm ? `${cleaned} (sources preview)` : cleaned,
      },
    ]);

    try {
      const result = await ask.mutateAsync({
        question: cleaned,
        nResults: 5,
        skipLlm,
      });
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: result?.answer || 'No answer returned.',
          sources: result?.sources || [],
        },
      ]);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Could not reach the knowledge service.');
      const looksLikeCredits = /credit/i.test(message);

      // If full Ask fails on Anthropic credits, auto-fallback to retrieval-only sources.
      if (!skipLlm && looksLikeCredits) {
        try {
          const preview = await ask.mutateAsync({
            question: cleaned,
            nResults: 5,
            skipLlm: true,
          });
          setMessages((prev) => [
            ...prev,
            {
              id: `a-${Date.now()}`,
              role: 'assistant',
              content:
                `${preview?.answer || 'Sources preview ready.'}\n\n(Note: AI answer needs Anthropic credits. Showing sources only for now.)`,
              sources: preview?.sources || [],
            },
          ]);
          return;
        } catch {
          // fall through to original error
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: message,
          sources: [],
        },
      ]);
    }
  };

  const onSubmit = (event) => {
    event.preventDefault();
    sendQuestion(input);
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-7.5rem)] max-w-[1400px] flex-col gap-4 lg:h-[calc(100vh-6.5rem)] lg:flex-row lg:gap-5">
      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[20px] border border-border/40 bg-white/80 shadow-sm backdrop-blur">
        <header className="shrink-0 border-b border-border/40 px-5 py-4 sm:px-6">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] to-[#DBEAFE] text-primary shadow-sm ring-1 ring-primary/10">
              <BrainCircuit size={20} strokeWidth={2} />
            </span>
            <div className="min-w-0">
              <h1 className="text-[22px] sm:text-[26px] font-bold text-heading tracking-tight leading-tight">
                Knowledge
              </h1>
              <p className="mt-1 text-[13px] text-secondaryText leading-relaxed">
                Ask across Google Drive and Slack — answers cite the sources they used.
              </p>
            </div>
          </div>
        </header>

        <div ref={listRef} className="dashboard-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-5 sm:px-6">
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex h-full min-h-[280px] flex-col items-center justify-center text-center"
            >
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#EFF6FF] via-white to-[#DBEAFE] text-primary ring-1 ring-primary/10">
                <MessageSquareText size={24} />
              </div>
              <h2 className="text-[17px] font-semibold text-heading">Ask your company brain</h2>
              <p className="mt-1.5 max-w-md text-[13px] text-secondaryText leading-relaxed">
                Questions are answered only from ingested Drive files and Slack channels.
              </p>
              <div className="mt-5 flex max-w-xl flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => sendQuestion(suggestion)}
                    className="rounded-full border border-border/60 bg-white px-3.5 py-2 text-left text-[12px] text-heading/80 shadow-sm transition hover:border-primary/30 hover:text-primary"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <p className="mt-5 text-[11px] font-medium uppercase tracking-wide text-secondaryText">
                Test sources without AI credits
              </p>
              <div className="mt-2 flex max-w-xl flex-wrap justify-center gap-2">
                {PREVIEW_QUESTIONS.map((suggestion) => (
                  <button
                    key={`preview-${suggestion}`}
                    type="button"
                    onClick={() => sendQuestion(suggestion, { skipLlm: true })}
                    className="rounded-full border border-dashed border-primary/30 bg-primary/[0.04] px-3.5 py-2 text-left text-[12px] text-primary shadow-sm transition hover:bg-primary/[0.08]"
                  >
                    Preview: {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </AnimatePresence>

          {ask.isPending && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-2xl rounded-bl-md border border-border/50 bg-white/90 px-4 py-3 text-[13px] text-secondaryText shadow-sm">
                <Loader2 size={14} className="animate-spin text-primary" />
                Searching knowledge base…
              </div>
            </div>
          )}
        </div>

        <form onSubmit={onSubmit} className="shrink-0 border-t border-border/40 bg-white/70 px-4 py-4 sm:px-6">
          <div className="flex items-end gap-2.5">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  sendQuestion(input);
                }
              }}
              rows={1}
              placeholder="Ask about projects, decisions, docs, Slack threads…"
              className="max-h-32 min-h-[46px] flex-1 resize-none rounded-2xl border border-border/60 bg-white px-4 py-3 text-[14px] text-heading shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
            <Button
              type="button"
              variant="secondary"
              className="h-[46px] shrink-0 rounded-2xl px-3"
              disabled={!input.trim() || ask.isPending}
              onClick={() => sendQuestion(input, { skipLlm: true })}
            >
              Sources
            </Button>
            <Button
              type="submit"
              className="h-[46px] shrink-0 rounded-2xl px-4"
              disabled={!input.trim() || ask.isPending}
              isLoading={ask.isPending}
            >
              <Send size={15} className={ask.isPending ? 'opacity-0' : ''} />
              {!ask.isPending && <span className="ml-1.5 hidden sm:inline">Ask</span>}
            </Button>
          </div>
          <p className="mt-2 text-[11px] text-secondaryText">
            Use <span className="font-medium text-heading">Sources</span> to test citations without Anthropic credits.
          </p>
        </form>
      </section>

      <aside className="flex w-full shrink-0 flex-col gap-4 lg:w-[300px]">
        <div className="rounded-[20px] border border-border/40 bg-white/80 p-5 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-[13px] font-semibold uppercase tracking-wide text-secondaryText">
              Sources
            </h2>
            <button
              type="button"
              onClick={() => refetchStatus()}
              className="rounded-lg p-1.5 text-secondaryText transition hover:bg-primary/5 hover:text-primary"
              aria-label="Refresh status"
            >
              <RefreshCw size={14} className={statusLoading ? 'animate-spin' : ''} />
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3.5 py-3 ring-1 ring-border/40">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EFF6FF] text-primary">
                  <HardDrive size={15} />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-heading">Google Drive</p>
                  <p className="text-[11px] text-secondaryText">Documents & sheets</p>
                </div>
              </div>
              <span className="text-[13px] font-semibold text-heading">{driveChunks}</span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#F8FAFC] px-3.5 py-3 ring-1 ring-border/40">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F4F0FF] text-[#4A154B]">
                  <Hash size={15} />
                </span>
                <div>
                  <p className="text-[13px] font-medium text-heading">Slack</p>
                  <p className="text-[11px] text-secondaryText">Joined channels</p>
                </div>
              </div>
              <span className="text-[13px] font-semibold text-heading">{slackChunks}</span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-[12px]">
            <span className="text-secondaryText">Total chunks</span>
            <span className="font-semibold text-heading">{totalChunks}</span>
          </div>

          <div className="mt-3 flex items-center gap-2 text-[12px]">
            <span
              className={`h-2 w-2 rounded-full ${serviceUp ? 'bg-emerald-500' : 'bg-amber-500'}`}
            />
            <span className="text-secondaryText">
              {serviceUp ? 'Knowledge service online' : 'Service offline — start port 8001'}
            </span>
          </div>
        </div>

        <div className="rounded-[20px] border border-border/40 bg-white/80 p-5 shadow-sm backdrop-blur">
          <h2 className="text-[13px] font-semibold uppercase tracking-wide text-secondaryText">
            Sync
          </h2>
          <p className="mt-1.5 text-[12px] text-secondaryText leading-relaxed">
            Pull latest Drive files and Slack channels into the shared knowledge base.
            Drive sync can take a few minutes and may briefly pause other Knowledge requests.
          </p>
          <div className="mt-4 space-y-2.5">
            <Button
              type="button"
              variant="secondary"
              className="h-10 w-full rounded-xl justify-center gap-2"
              onClick={() => ingestDrive.mutate({})}
              isLoading={ingestDrive.isPending}
              disabled={ingestDrive.isPending || ingestSlack.isPending}
            >
              <HardDrive size={14} />
              Sync Drive
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="h-10 w-full rounded-xl justify-center gap-2"
              onClick={() => ingestSlack.mutate()}
              isLoading={ingestSlack.isPending}
              disabled={ingestDrive.isPending || ingestSlack.isPending}
            >
              <Hash size={14} />
              Sync Slack
            </Button>
          </div>
          {(ingestDrive.isError || ingestSlack.isError) && (
            <p className="mt-3 text-[12px] text-red-600">
              {getApiErrorMessage(
                ingestDrive.error || ingestSlack.error,
                'Sync failed. Check the knowledge service.'
              )}
            </p>
          )}
          {(ingestDrive.isSuccess || ingestSlack.isSuccess) && !ingestDrive.isPending && !ingestSlack.isPending && (
            <p className="mt-3 text-[12px] text-emerald-600">Sync finished. Status refreshed.</p>
          )}
        </div>
      </aside>
    </div>
  );
};

export default Knowledge;
