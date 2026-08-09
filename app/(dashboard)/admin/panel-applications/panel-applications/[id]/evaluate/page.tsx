"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EvaluateApplicationPage() {
  const { id } = useParams();
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);
  const [judges, setJudges] = useState<any[]>([]);
  const [hops, setHops] = useState<any[]>([]);

  const [judgeMarks, setJudgeMarks] = useState<Record<string, number>>({});
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [clubComment, setClubComment] = useState('');
  const [chosenPanel, setChosenPanel] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const res = await fetch(`/api/admin/panel-applications/${id}/evaluate`);
    if (res.ok) {
      const data = await res.json();
      setApplication(data.application);
      setJudges(data.judges);
      setHops(data.hops);

      // Initialize form state
      setClubComment(data.application.clubComment || '');
      setChosenPanel(data.application.chosenPanel || '');

      const initialMarks: Record<string, number> = {};
      data.application.judgeMarks.forEach((jm: any) => {
        initialMarks[jm.judgeId] = jm.mark;
      });
      setJudgeMarks(initialMarks);

      const initialProgress: Record<string, boolean> = {};
      data.application.progress.forEach((p: any) => {
        initialProgress[p.hopId] = p.isCompleted;
      });
      setProgress(initialProgress);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const marksPayload = Object.entries(judgeMarks).map(([judgeId, mark]) => ({ judgeId, mark }));
    const progressPayload = Object.entries(progress).map(([hopId, isCompleted]) => ({ hopId, isCompleted }));

    const res = await fetch(`/api/admin/panel-applications/${id}/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        judgeMarks: marksPayload,
        progress: progressPayload,
        clubComment,
        chosenPanel,
      }),
    });

    if (res.ok) {
      alert('Evaluation saved successfully!');
      router.push('/admin/panel-applications'); // redirect to application list
    } else {
      alert('Failed to save evaluation.');
    }
  };

  if (!application) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Evaluate Application: {application.name}</h1>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded shadow">
        
        {/* Panel Assignment */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Panel Assignment</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Chosen Panel</label>
            <input 
              type="text" 
              value={chosenPanel} 
              onChange={e => setChosenPanel(e.target.value)} 
              className="w-full border p-2 rounded" 
              placeholder="e.g. Executive Panel"
            />
          </div>
        </section>

        {/* Judges Evaluation */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Judge Marks</h2>
          {judges.length === 0 ? (
            <p className="text-gray-500">No active judges available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {judges.map(judge => (
                <div key={judge.id}>
                  <label className="block text-sm font-medium mb-1">{judge.name}</label>
                  <input 
                    type="number" 
                    value={judgeMarks[judge.id] || ''} 
                    onChange={e => setJudgeMarks({ ...judgeMarks, [judge.id]: Number(e.target.value) })}
                    className="w-full border p-2 rounded" 
                    placeholder="Enter mark"
                    min="0"
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Progress Tracker */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Progress Tracker</h2>
          {hops.length === 0 ? (
            <p className="text-gray-500">No active hops available.</p>
          ) : (
            <div className="space-y-2">
              {hops.map(hop => (
                <div key={hop.id} className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={progress[hop.id] || false}
                    onChange={e => setProgress({ ...progress, [hop.id]: e.target.checked })}
                    className="mr-2 h-4 w-4"
                  />
                  <label className="text-sm font-medium">{hop.title}</label>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Club Comment */}
        <section>
          <h2 className="text-xl font-semibold mb-3 border-b pb-2">Club Comment</h2>
          <textarea
            value={clubComment}
            onChange={e => setClubComment(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Final remarks or comments from the club..."
          />
        </section>

        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded font-medium">
          Save Evaluation
        </button>
      </form>
    </div>
  );
}
