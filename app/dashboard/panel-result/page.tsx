"use client";

import { useState, useEffect } from 'react';

export default function StudentPanelResultPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [emailSending, setEmailSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = async () => {
    try {
      const res = await fetch('/api/student/panel-result');
      if (res.ok) {
        setResult(await res.json());
      } else {
        const errData = await res.json();
        setError(errData.error || 'Failed to fetch result');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    setEmailSending(true);
    try {
      const res = await fetch('/api/student/panel-result/email', { method: 'POST' });
      if (res.ok) {
        alert('Email sent successfully! Check your inbox.');
      } else {
        alert('Failed to send email.');
      }
    } catch (err) {
      alert('Error sending email.');
    } finally {
      setEmailSending(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="p-8 text-center text-red-500 font-semibold">{error}</div>;
  if (!result) return <div className="p-8 text-center">No result found.</div>;

  const sortedProgress = [...(result.progress || [])].sort((a, b) => a.hop.order - b.hop.order);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Panel Application Result</h1>
            <p className="mt-2 text-gray-500">Welcome back, <span className="font-semibold text-gray-800">{result.name}</span></p>
          </div>
          <div className="mt-4 md:mt-0 bg-blue-50 px-6 py-3 rounded-lg border border-blue-100 text-center">
            <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider">Chosen Panel</p>
            <p className="text-xl font-bold text-blue-900 mt-1">{result.chosenPanel || 'Pending'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Progress Tracker */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Progress Tracker
              </h2>
              <div className="space-y-6">
                {sortedProgress.length === 0 ? (
                  <p className="text-gray-500 italic">No progress recorded yet.</p>
                ) : (
                  sortedProgress.map((p, idx) => (
                    <div key={p.id} className="relative flex items-center">
                      {idx !== sortedProgress.length - 1 && (
                        <div className={`absolute top-8 left-4 -ml-px h-full w-0.5 ${p.isCompleted ? 'bg-blue-500' : 'bg-gray-200'}`} aria-hidden="true" />
                      )}
                      <div className="relative flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full border-2 bg-white">
                        {p.isCompleted ? (
                          <div className="h-full w-full rounded-full bg-blue-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        ) : (
                          <div className="h-2 w-2 bg-gray-300 rounded-full" />
                        )}
                      </div>
                      <div className="ml-4 min-w-0 flex-1 flex justify-between items-center">
                        <div>
                          <p className={`text-sm font-medium ${p.isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                            {p.hop.title}
                          </p>
                        </div>
                        <div>
                          {p.isCompleted ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Club Comment */}
            {result.clubComment && (
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-8 rounded-2xl border border-blue-100">
                <h2 className="text-lg font-bold text-indigo-900 mb-2">Message from the Club</h2>
                <p className="text-indigo-800 leading-relaxed italic">"{result.clubComment}"</p>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            
            {/* Marks Summary */}
            <div className="bg-gray-900 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl"></div>
              <h2 className="text-lg font-medium text-gray-300 mb-4">Total Score</h2>
              <div className="flex items-baseline">
                <span className="text-5xl font-extrabold tracking-tight">{result.totalMarks || 0}</span>
                <span className="ml-2 text-sm text-gray-400 font-medium">pts</span>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Individual Marks</h3>
                <ul className="space-y-3">
                  {result.judgeMarks && result.judgeMarks.length > 0 ? (
                    result.judgeMarks.map((jm: any) => (
                      <li key={jm.id} className="flex justify-between items-center text-sm">
                        <span className="text-gray-300">{jm.judge.name}</span>
                        <span className="font-semibold bg-gray-800 px-2 py-1 rounded text-gray-200">{jm.mark}</span>
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-gray-500 italic">No marks available</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Your Report</h3>
              <p className="text-sm text-gray-500 mb-6">Receive a detailed copy of your panel application result directly in your inbox.</p>
              <button 
                onClick={sendEmail}
                disabled={emailSending}
                className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${emailSending ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {emailSending ? 'Sending...' : 'Send Report via Email'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
