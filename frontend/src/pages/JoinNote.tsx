import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import api from '../services/api';
import { createSocket } from '../socket';
type Invitation = { noteId: string; title: string; owner: string; status: string };
export default function JoinNote() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invite, setInvite] = useState<Invitation>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const { data } = await api.get<Invitation>(`/collaborators/invite/${token}`);
        if (!active) return;
        if (!localStorage.getItem('token')) {
          localStorage.setItem('pendingInvite', token!);
          navigate('/', { replace: true }); return;
        }
        setInvite(data); setError('');
        if (data.status === 'APPROVED') navigate(`/notes/${data.noteId}`, { replace: true });
      } catch (e) {
        if (!active) return;
        if (isAxiosError(e) && e.response?.status === 401) {
          localStorage.removeItem('token'); localStorage.setItem('pendingInvite', token!); navigate('/', { replace: true });
        } else setError('This invitation is unavailable. It may have been revoked. Ask the owner for a new link.');
      }
    };
    void load();
    const socket = createSocket();
    socket.on('access-decision', load); socket.on('connect', load);
    if (localStorage.getItem('token')) socket.connect();
    const poll = window.setInterval(load, 5000);
    return () => { active = false; clearInterval(poll); socket.disconnect(); };
  }, [token, navigate]);
  const request = async () => {
    setBusy(true);
    try { const { data } = await api.post(`/collaborators/join/${token}`); setInvite(current => current && { ...current, status: data.status }); if (data.status === 'APPROVED') navigate(`/notes/${data.noteId}`); }
    catch { setError('Could not request access. Please refresh and try again.'); }
    finally { setBusy(false); }
  };
  return <main className="min-h-screen bg-black text-white grid place-items-center p-5">
    <section className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
      <LockKeyhole className="text-yellow-300 mb-6" size={32} />
      <p className="text-yellow-300 text-sm mb-2">COLLABNOTE INVITATION</p>
      <h1 className="text-3xl font-semibold break-words">{invite?.title || 'A space to work together'}</h1>
      {error ? <p role="alert" className="my-6 text-red-300">{error}</p> : !invite ? <p className="my-6">Checking invitation…</p> : <>
        <p className="text-zinc-400 mt-3 break-words">Shared by {invite.owner}</p>
        <p className="my-6 text-zinc-300" role="status">{invite.status === 'PENDING' ? 'Access requested. The note owner will need to approve your request.' : invite.status === 'REJECTED' ? 'The owner declined your request. Contact them if you think this was a mistake.' : 'Request permission to read and edit this note. Its contents stay private until the owner approves.'}</p>
        {invite.status === 'NONE' && <button disabled={busy} onClick={request} className="w-full rounded-xl bg-yellow-300 p-3 text-black font-medium disabled:opacity-50">{busy ? 'Requesting…' : 'Request Access'}</button>}
      </>}
      <Link to="/dashboard" className="mt-6 flex items-center gap-2 text-sm text-zinc-400">Back to dashboard <ArrowRight size={16} /></Link>
    </section>
  </main>;
}
