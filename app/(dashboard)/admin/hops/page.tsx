"use client";

import { useState, useEffect } from 'react';

export default function HopsAdminPage() {
  const [hops, setHops] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [order, setOrder] = useState<number>(0);
  const [isActive, setIsActive] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHops();
  }, []);

  const fetchHops = async () => {
    const res = await fetch('/api/admin/hops');
    if (res.ok) {
      setHops(await res.json());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await fetch(`/api/admin/hops/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, order: Number(order), isActive }),
      });
    } else {
      await fetch('/api/admin/hops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, order: Number(order), isActive }),
      });
    }
    setEditingId(null);
    setTitle('');
    setOrder(0);
    setIsActive(true);
    fetchHops();
  };

  const handleEdit = (hop: any) => {
    setEditingId(hop.id);
    setTitle(hop.title);
    setOrder(hop.order);
    setIsActive(hop.isActive);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hop?')) {
      await fetch(`/api/admin/hops/${id}`, { method: 'DELETE' });
      fetchHops();
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Progress Hops</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 p-4 border rounded shadow-sm bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Hop Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              className="w-full border p-2 rounded" 
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Order</label>
            <input 
              type="number" 
              value={order} 
              onChange={e => setOrder(Number(e.target.value))} 
              className="w-full border p-2 rounded" 
              required
            />
          </div>
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
          {editingId ? 'Update Hop' : 'Add Hop'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => { setEditingId(null); setTitle(''); setOrder(0); setIsActive(true); }}
            className="ml-2 bg-gray-300 px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="bg-white rounded shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b">Title</th>
              <th className="p-3 text-left border-b">Order</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {hops.map(hop => (
              <tr key={hop.id} className="border-b">
                <td className="p-3">{hop.title}</td>
                <td className="p-3">{hop.order}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs text-white ${hop.isActive ? 'bg-green-500' : 'bg-red-500'}`}>
                    {hop.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-3">
                  <button onClick={() => handleEdit(hop)} className="text-blue-600 mr-3">Edit</button>
                  <button onClick={() => handleDelete(hop.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
