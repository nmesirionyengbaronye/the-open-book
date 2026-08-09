'use client';

import { useState, useEffect } from 'react';
import Card from '@/components/ui/card';
import Button from '@/components/ui/button';
import Input from '@/components/ui/input';

type Note = {
  id: number;
  note: string;
  admin_identifier: string;
  created_at: string;
};

export default function AdminNotesPage() {
  const [code, setCode] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!code) return;
    const res = await fetch(`/api/admin/notes?code=${encodeURIComponent(code)}`);
    if (res.ok) {
      const data = await res.json();
      setNotes(data.notes || []);
    }
  };

  useEffect(() => {
    load();
  }, [code]);

  const addNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || !newNote.trim()) return;
    setLoading(true);
    await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, note: newNote.trim() }),
    });
    setNewNote('');
    setLoading(false);
    load();
  };

  return (
    <div className="px-4 py-8">
      <h1 className="text-2xl font-bold text-white">Admin Notes</h1>
      <p className="mt-1 text-sm text-white/60">Add manual tracking notes per user.</p>

      <div className="mt-6">
        <label className="mb-1 block text-xs text-white/60">Referral code</label>
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="UNI-XXXXXX"
        />
      </div>

      {code && (
        <form onSubmit={addNote} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-xs text-white/60">New note</label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white placeholder:text-white/30 focus:border-[#D4AF37]/50 focus:outline-none"
              rows={3}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving…' : 'Add note'}
          </Button>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {notes.map((note) => (
          <Card key={note.id} className="p-4">
            <p className="text-sm text-white">{note.note}</p>
            <p className="mt-1 text-[11px] text-white/40">
              {note.admin_identifier} • {new Date(note.created_at).toLocaleString()}
            </p>
          </Card>
        ))}
        {notes.length === 0 && code && (
          <p className="text-sm text-white/40">No notes yet.</p>
        )}
      </div>
    </div>
  );
}
