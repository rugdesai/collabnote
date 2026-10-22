import { useEffect, useRef, useState } from 'react';
import { X, Copy, Users } from 'lucide-react';
import api from '../../services/api';
type Person = { id: string; email: string };
type AccessRequest = { id: string; status: string; createdAt: string; user: Person };
export default function ShareDialog({ noteId, title, close }: { noteId: string; title: string; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [link, setLink] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const refresh = async () => {
    try {
      const [r, p] = await Promise.all([api.get(`/collaborators/${noteId}/requests`), api.get(`/collaborators/${noteId}`)]);
      setRequests(r.data); setPeople(p.data); setError('');
    } catch { setError('Could not load sharing details. Please try again.'); }
    finally { setLoading(false); }
  };
  useEffect(() => {
    dialog.current?.showModal();
    const initial = window.setTimeout(refresh, 0);
    const poll = window.setInterval(refresh, 4000);
    return () => { clearTimeout(initial); clearInterval(poll); };
    // This dialog is mounted separately for each note.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);
  const copy = async () => {
    setBusy('link'); setMessage(''); setError('');
    try {
      const value = (await api.post(`/collaborators/${noteId}/link`)).data.link;
      setLink(value);
      try { await navigator.clipboard.writeText(value); setMessage('Invitation link copied.'); }
      catch { setMessage('Select and copy the invitation link below.'); }
    } catch { setError('Could not create an invitation. Please try again.'); }
    finally { setBusy(''); }
  };
  const decide = async (requestId: string, status: string) => {
    setBusy(requestId);
    try { await api.patch(`/collaborators/${noteId}/requests/${requestId}`, { status }); await refresh(); setMessage(status === 'APPROVED' ? 'Access approved.' : 'Request rejected.'); }
    catch { setError('Could not update this request. Refresh and try again.'); }
    finally { setBusy(''); }
  };
  return <dialog ref={dialog} onCancel={close} onClick={e => { if (e.target === dialog.current) close(); }} className="m-auto w-[calc(100%-2rem)] max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl border border-zinc-700 bg-zinc-900 p-6 text-white backdrop:bg-black/70" aria-labelledby="share-title">
    <div className="flex justify-between gap-3"><div><p className="text-yellow-300 text-sm">Share your workspace</p><h2 id="share-title" className="text-2xl font-semibold break-words mt-1">{title || 'Untitled note'}</h2></div><button aria-label="Close share dialog" onClick={close}><X /></button></div>
    <p className="text-sm text-zinc-400 my-4">Anyone with this link can request access. Only people you approve can read and edit this note.</p>
    <button disabled={!!busy} onClick={copy} className="flex gap-2 items-center rounded-lg bg-yellow-300 text-black px-4 py-3 disabled:opacity-50"><Copy size={18} />{busy === 'link' ? 'Preparing…' : 'Copy invitation link'}</button>
    {link && <div className="mt-3"><input aria-label="Invitation link" readOnly value={link} onFocus={e => e.target.select()} className="w-full bg-black border border-zinc-700 rounded-lg p-3 text-sm" /><button disabled={!!busy} className="text-sm text-red-300 mt-2" onClick={async () => { setBusy('revoke'); try { await api.delete(`/collaborators/${noteId}/link`); setLink(''); setMessage('Previous links revoked. Existing collaborators keep access.'); } catch { setError('Could not revoke links.'); } finally { setBusy(''); } }}>Revoke invitation links</button></div>}
    <p role="status" className="text-sm text-yellow-200 mt-3">{message}</p>{error && <p role="alert" className="text-red-300 mt-3">{error}</p>}
    <h3 className="mt-7 mb-3 font-semibold">Pending Requests</h3>
    {loading ? <p className="text-zinc-400">Loading…</p> : !requests.some(r => r.status === 'PENDING') ? <p className="text-sm text-zinc-500">No pending requests. Share a link to invite someone.</p> : requests.filter(r => r.status === 'PENDING').map(r => <div key={r.id} className="border-t border-zinc-800 py-3 flex flex-wrap gap-3 items-center justify-between"><div className="min-w-0"><p className="break-all">{r.user.email}</p><p className="text-xs text-zinc-500">{new Date(r.createdAt).toLocaleString()}</p></div><div className="flex gap-3 text-sm"><button disabled={!!busy} onClick={() => decide(r.id, 'APPROVED')} className="text-yellow-300">Approve</button><button disabled={!!busy} onClick={() => decide(r.id, 'REJECTED')} className="text-zinc-400">Reject</button></div></div>)}
    <h3 className="mt-7 mb-3 flex items-center gap-2 font-semibold"><Users size={18} />Current collaborators</h3>
    <p className="text-sm text-zinc-400 mb-2">You · Owner</p>
    {people.map(p => <p key={p.id} className="py-2 text-sm break-all border-t border-zinc-800">{p.email} <span className="text-zinc-500">· Editor</span></p>)}
    {!loading && !people.length && <p className="text-sm text-zinc-500">Approved collaborators will appear here.</p>}
  </dialog>;
}
