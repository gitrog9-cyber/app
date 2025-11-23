import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SharedProgressView = () => {
  const { shareId } = useParams();
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSnapshot();
  }, [shareId]);

  const fetchSnapshot = async () => {
    try {
      const response = await axios.get(`${API}/share/${shareId}`);
      setSnapshot(response.data);
    } catch (error) {
      console.error('Error fetching shared progress:', error);
      setError('Shared progress not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !snapshot) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Progress Not Found</h2>
          <p className="text-gray-400">This shared progress doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const progressPercentage = Math.round((snapshot.completed_milestones / snapshot.total_milestones) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">⚡</div>
          <h1 className="text-4xl font-bold text-white mb-2">SUPERCHARGE</h1>
          <p className="text-gray-400 text-lg">Shared Learning Progress</p>
        </div>

        {/* Progress Card */}
        <div className="bg-slate-800 rounded-xl p-8 shadow-2xl border border-slate-700 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">{snapshot.user_name}'s Progress</h2>
            <h3 className="text-xl text-gray-400">{snapshot.path_name}</h3>
          </div>

          {/* Progress Ring */}
          <div className="flex justify-center mb-8">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#334155"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - progressPercentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-white">{progressPercentage}%</div>
                  <div className="text-gray-400 text-sm">Complete</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <Target className="text-blue-400 mx-auto mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">
                {snapshot.completed_milestones}/{snapshot.total_milestones}
              </div>
              <div className="text-gray-400 text-sm">Milestones</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <TrendingUp className="text-green-400 mx-auto mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">{progressPercentage}%</div>
              <div className="text-gray-400 text-sm">Progress</div>
            </div>

            <div className="bg-slate-700 rounded-lg p-6 text-center">
              <Trophy className="text-purple-400 mx-auto mb-3" size={32} />
              <div className="text-3xl font-bold text-white mb-1">{snapshot.achievements?.length || 0}</div>
              <div className="text-gray-400 text-sm">Achievements</div>
            </div>
          </div>

          {/* Achievements */}
          {snapshot.achievements && snapshot.achievements.length > 0 && (
            <div>
              <h4 className="text-xl font-bold text-white mb-4 text-center">Achievements Unlocked</h4>
              <div className="flex justify-center flex-wrap gap-3">
                {snapshot.achievements.map((achievement, idx) => (
                  <div 
                    key={idx}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg"
                  >
                    🏆 {achievement}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Shared Date */}
          <div className="mt-8 pt-6 border-t border-slate-700 text-center">
            <div className="flex items-center justify-center text-gray-500 text-sm">
              <Calendar size={16} className="mr-2" />
              <span>Shared on {new Date(snapshot.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Start Your Own Journey!</h3>
          <p className="text-blue-100 mb-6">
            Join SUPERCHARGE and track your learning progress
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
          >
            Get Started Free
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharedProgressView;
