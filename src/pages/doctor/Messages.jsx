import { useState, useMemo, useRef, useEffect } from "react";
import { MessageSquare, Send, Search } from "lucide-react";
import DashboardShell from "../../components/layout/DashboardShell";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import PatientAvatar from "../../components/doctor/PatientAvatar";
import { useDoctorData } from "../../context/DoctorDataContext";
import { useSimulatedLoad } from "../../utils/useSimulatedLoad";
import { doctorNav } from "./doctorNav";

export default function Messages() {
  const { conversations, sendMessage, markConversationRead } = useDoctorData();
  const { loading } = useSimulatedLoad(500);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState(conversations[0]?.id || null);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef(null);

  const filtered = useMemo(
    () => conversations.filter((c) => c.patientName.toLowerCase().includes(search.toLowerCase())),
    [conversations, search]
  );

  const active = conversations.find((c) => c.id === activeId) || filtered[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [active?.messages?.length]);

  useEffect(() => {
    if (active) markConversationRead(active.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active?.id]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!draft.trim() || !active) return;
    sendMessage(active.id, draft.trim());
    setDraft("");
  };

  if (loading) {
    return (
      <DashboardShell navItems={doctorNav}>
        <Loader full label="Loading conversations..." />
      </DashboardShell>
    );
  }

  return (
    <DashboardShell navItems={doctorNav}>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--font-display)" }}>Messages</h1>
        <p className="text-mist-400 mt-1">Secure conversations with your patients.</p>
      </div>

      {conversations.length === 0 ? (
        <Card><EmptyState icon={MessageSquare} title="No conversations yet" description="Patient messages will appear here." /></Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] h-[600px]">
            <div className="border-r border-ink-border flex flex-col">
              <div className="p-3 border-b border-ink-border">
                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-mist-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search conversations..."
                    className="w-full rounded-lg bg-ink-850 border border-ink-border text-mist-100 placeholder:text-mist-500 pl-9 pr-3 py-2 text-sm outline-none focus:border-teal-500"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="text-sm text-mist-500 text-center py-8">No matches found.</p>
                ) : (
                  filtered.map((c) => {
                    const last = c.messages[c.messages.length - 1];
                    return (
                      <button
                        key={c.id}
                        onClick={() => setActiveId(c.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left border-b border-ink-border/60 transition-colors ${active?.id === c.id ? "bg-teal-500/10" : "hover:bg-ink-800/50"}`}
                      >
                        <PatientAvatar name={c.patientName} color={c.avatarColor} size={38} />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-mist-100 truncate">{c.patientName}</p>
                          <p className="text-xs text-mist-500 truncate">{last?.text}</p>
                        </div>
                        <span className="text-[11px] text-mist-500 shrink-0">{last?.time}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex flex-col">
              {active ? (
                <>
                  <div className="flex items-center gap-3 px-5 py-3.5 border-b border-ink-border">
                    <PatientAvatar name={active.patientName} color={active.avatarColor} size={36} />
                    <p className="text-mist-100 font-medium">{active.patientName}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
                    {active.messages.map((m) => (
                      <div key={m.id} className={`flex ${m.sender === "doctor" ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.sender === "doctor" ? "bg-teal-500 text-ink-950" : "bg-ink-800 text-mist-100"}`}>
                          <p>{m.text}</p>
                          <p className={`text-[10px] mt-1 ${m.sender === "doctor" ? "text-ink-900/70" : "text-mist-500"}`}>{m.time}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                  <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-ink-border">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl bg-ink-850 border border-ink-border text-mist-100 placeholder:text-mist-500 px-3.5 py-2.5 text-sm outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                    <button type="submit" className="w-10 h-10 shrink-0 rounded-xl bg-teal-500 text-ink-950 flex items-center justify-center hover:bg-teal-400 transition-colors" aria-label="Send message">
                      <Send size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-mist-500 text-sm">Select a conversation</div>
              )}
            </div>
          </div>
        </Card>
      )}
    </DashboardShell>
  );
}
