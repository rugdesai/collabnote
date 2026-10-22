import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { Share2, Trash2 } from 'lucide-react';
import api from '../../services/api';
import type { Note } from '../../types/note';
import { createSocket } from '../../socket';
import TiptapEditor from '../editor/TiptapEditor';
import ShareDialog from './ShareDialog';
type Draft = { title: string; content: string; version: number };
export default function Editor() { const { id } = useParams(); return id ? <NoteEditor key={id} id={id} /> : null; }
function NoteEditor({ id }: { id: string }) {
  const [note, setNote] = useState<Note>();
  const [draft, setDraft] = useState<Draft>();
  const [status, setStatus] = useState('Loading…');
  const [error, setError] = useState('');
  const [conflict, setConflict] = useState<Note>();
  const [sharing, setSharing] = useState(false);
  const [online, setOnline] = useState<string[]>([]);
  const [typing, setTyping] = useState('');
  const engine = useRef<{ edit: (patch: Partial<Draft>) => void; retry: () => void; resolve: (keep: boolean) => void } | null>(null);
  useEffect(() => {
    let alive = true, dirty = false, saving = false, paused = false, editNumber = 0;
    let current: Draft | undefined, latest: Note | undefined;
    let timer: ReturnType<typeof setTimeout>, typingTimer: ReturnType<typeof setTimeout>;
    const key = `collabnote:draft:${localStorage.getItem('email')}:${id}`;
    const socket = createSocket();
    const retain = () => { try { if (dirty && current) sessionStorage.setItem(key, JSON.stringify(current)); else sessionStorage.removeItem(key); } catch { /* Memory draft remains available. */ } };
    const apply = (next: Note) => { current = { title: next.title, content: next.content, version: next.version }; setDraft(current); setStatus('Saved'); };
    const receive = (next: Note) => {
      if (!alive || next.id !== id || (latest && next.version < latest.version)) return;
      latest = next;
      if (!current) return;
      if (saving) return;
      if (dirty && next.version > current.version) {
        if (next.title === current.title && next.content === current.content) {
          dirty = false; paused = false; setConflict(undefined); apply(next); retain();
        } else { paused = true; setConflict(next); setStatus('Changes need review'); }
      }
      else if (!dirty) apply(next);
    };
    const save = async () => {
      if (!alive || !dirty || saving || paused || !current) return;
      saving = true; setStatus('Saving…'); setError('');
      const sent = { ...current }, sequence = editNumber;
      try {
        const { data } = await api.put(`/notes/${id}`, sent);
        if (!alive) return;
        const saved: Note = data.note;
        if (!latest || saved.version > latest.version) latest = saved;
        current = { ...current!, version: saved.version };
        dirty = editNumber !== sequence;
        saving = false;
        if (latest && latest.version > saved.version) receive(latest);
        else if (!dirty) apply(saved);
        else { setDraft(current); setStatus('Saving…'); timer = setTimeout(save, 350); }
        retain();
      } catch (e) {
        if (!alive) return;
        saving = false;
        if (isAxiosError(e) && e.response?.status === 409) {
          latest = e.response.data.note; paused = true; setConflict(latest); setStatus('Changes need review');
        } else { setStatus('Save failed'); setError('Your changes are kept in this tab. Check your connection and retry.'); }
        retain();
      }
    };
    engine.current = {
      edit: patch => {
        if (!current) return;
        current = { ...current, ...patch }; dirty = true; editNumber++; setDraft(current); retain();
        if (!paused) { setStatus('Saving…'); clearTimeout(timer); timer = setTimeout(save, 450); }
        if (socket.connected) socket.emit('user-typing', { noteId: id });
      },
      retry: () => void save(),
      resolve: keep => {
        if (!latest || !current) return;
        paused = false; setConflict(undefined); setError('');
        if (keep) { current = { ...current, version: latest.version }; dirty = true; editNumber++; setDraft(current); retain(); void save(); }
        else { dirty = false; apply(latest); retain(); }
      },
    };
    const join = () => socket.timeout(5000).emit('join-note', id, (err: Error | null, result: { note?: Note; error?: string }) => {
      if (!alive) return;
      if (err || !result?.note) { setError(result?.error || 'Realtime connection unavailable. Saves still use the server.'); return; }
      receive(result.note);
    });
    socket.on('connect', join);
    socket.on('receive-changes', receive);
    socket.on('connect_error', () => { if (alive) setOnline([]); });
    socket.on('disconnect', () => { if (alive) { setOnline([]); setTyping(''); } });
    socket.on('presence', data => { if (alive && data.noteId === id) setOnline(data.users.map((u: { email: string }) => u.email)); });
    socket.on('receive-typing', data => { if (alive && data.noteId === id) { setTyping(`${data.user.email} is editing…`); clearTimeout(typingTimer); typingTimer = setTimeout(() => setTyping(''), 2200); } });
    socket.on('note-deleted', () => { if (alive) { paused = true; setError('This note was deleted by its owner.'); setStatus('Unavailable'); } });
    void api.get<Note>(`/notes/${id}`).then(({ data }) => {
      if (!alive) return;
      latest = data; setNote(data); apply(data);
      try {
        const raw = sessionStorage.getItem(key);
        if (raw) {
          const recovered: Draft = JSON.parse(raw);
          if (typeof recovered.title === 'string' && typeof recovered.content === 'string' && Number.isSafeInteger(recovered.version) && (recovered.title !== data.title || recovered.content !== data.content)) {
            current = recovered; dirty = true; paused = true; setDraft(current); setConflict(data); setStatus('Recovered unsaved changes');
          } else sessionStorage.removeItem(key);
        }
      } catch { /* Invalid recovery data is ignored. */ }
      socket.connect();
    }).catch(() => { if (alive) { setError('This note is unavailable. Sign in with an approved account or request access from its invitation.'); setStatus('Unable to open note'); } });
    // Reconcile missed events even when a proxy blocks Socket.IO.
    const poll = setInterval(() => { void api.get<Note>(`/notes/${id}`).then(r => receive(r.data)).catch(() => {}); }, 10000);
    const unload = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); retain(); } };
    window.addEventListener('beforeunload', unload);
    return () => { alive = false; retain(); clearTimeout(timer); clearTimeout(typingTimer); clearInterval(poll); window.removeEventListener('beforeunload', unload); socket.disconnect(); engine.current = null; };
  }, [id]);
  return <main className="max-w-5xl mx-auto p-4 sm:p-8 space-y-5">
    <header className="flex flex-wrap items-center justify-between gap-3"><Link className="text-zinc-400 text-sm" to="/dashboard">← All notes</Link><div className="flex items-center gap-4"><span role="status" className="text-sm text-zinc-400">{status}</span>{note?.isOwner && <><button onClick={() => setSharing(true)} className="flex gap-2 items-center bg-yellow-300 text-black px-4 py-2 rounded-lg"><Share2 size={16} />Share</button><button aria-label="Delete note" className="text-red-300" onClick={async () => { if (confirm('Delete this note permanently?')) { try { await api.delete(`/notes/${id}`); window.location.assign('/dashboard'); } catch { setError('Could not delete this note.'); } } }}><Trash2 size={18} /></button></>}</div></header>
    {error && <p role="alert" className="text-red-300">{error} {status === 'Save failed' && <button className="underline" onClick={() => engine.current?.retry()}>Retry save</button>}</p>}
    {conflict && <section className="rounded-xl border border-yellow-600 bg-yellow-950/30 p-4 space-y-3"><p>Your draft is preserved. Another version is on the server. Review it before choosing which version to save.</p><details><summary className="cursor-pointer text-yellow-300">View server version</summary><p className="font-semibold mt-3">{conflict.title}</p><pre className="max-h-48 overflow-auto whitespace-pre-wrap text-xs">{conflict.content}</pre></details><div className="flex flex-wrap gap-4"><button className="text-yellow-300" onClick={() => engine.current?.resolve(false)}>Use server version</button><button className="text-yellow-300" onClick={() => engine.current?.resolve(true)}>Save my draft instead</button><button className="text-zinc-300" onClick={() => { const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'collabnote-draft.json'; a.click(); URL.revokeObjectURL(url); }}>Download my draft</button></div></section>}
    {draft && <><input aria-label="Note title" maxLength={500} value={draft.title} onChange={e => engine.current?.edit({ title: e.target.value })} placeholder="Untitled note" className="w-full bg-transparent text-3xl font-bold outline-none" /><p className="text-xs text-zinc-500 break-words">{online.length ? `Online: ${online.join(', ')}` : 'Connecting to live collaboration…'}</p><p role="status" className="text-sm text-zinc-400 h-5">{typing}</p><TiptapEditor content={draft.content} onChange={content => engine.current?.edit({ content })} /></>}
    {sharing && <ShareDialog noteId={id} title={draft?.title || ''} close={() => setSharing(false)} />}
  </main>;
}
