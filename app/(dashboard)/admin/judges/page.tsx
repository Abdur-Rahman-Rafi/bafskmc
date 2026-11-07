"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function JudgesAdminPage() {
  const [judges, setJudges] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    const res = await fetch('/api/admin/judges');
    if (res.ok) {
      setJudges(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/admin/judges/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isActive }),
      });
    } else {
      await fetch('/api/admin/judges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, isActive }),
      });
    }
    setEditingId(null);
    setName('');
    setIsActive(true);
    fetchJudges();
  };

  const handleEdit = (judge: any) => {
    setEditingId(judge.id);
    setName(judge.name);
    setIsActive(judge.isActive);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this judge?')) {
      await fetch(`/api/admin/judges/${id}`, { method: 'DELETE' });
      fetchJudges();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Judges</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-sm bg-white">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Judge Name</label>
          <input 
            type="text" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            className="w-full border p-2 rounded" 
            required
          />
        </div>
        <div className="mb-4 flex items-center">
          <input 
            type="checkbox" 
            checked={isActive} 
            onChange={e => setIsActive(e.target.checked)} 
            className="mr-2"
          />
          <label className="text-sm font-medium">Is Active</label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update Judge' : 'Add Judge'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setName(''); setIsActive(true); }}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full border-collapse min-w-[450px]">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {judges.map(judge => (
              <tr key={judge.id} className="border-b">
                <td className="p-3">{judge.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs text-white ${judge.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {judge.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleEdit(judge)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(judge.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
