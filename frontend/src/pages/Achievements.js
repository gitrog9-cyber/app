import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import AchievementBadge from '@/components/enhanced/AchievementBadge';
import { Trophy, Lock } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Achievements = () => {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState([]);
  const [userAchievements, setUserAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const [allRes, userRes] = await Promise.all([
        axios.get(`${API}/achievements`),
        axios.get(`${API}/user/${user.id}/achievements`)
      ]);

      setAllAchievements(allRes.data.achievements);
      setUserAchievements(userRes.data.achievements);
    } catch (error) {
      console.error('Error fetching achievements:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Trophy className="text-amber-500" size={40} />
            <h1 className="text-4xl font-bold text-white">Your Achievements</h1>
          </div>
          <p className="text-gray-400 text-lg">
            You've unlocked {userAchievements.length} out of {allAchievements.length} achievements
          </p>
          
          <div className="mt-4 bg-slate-800 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-orange-600 h-full transition-all duration-500"
              style={{ width: `${(userAchievements.length / allAchievements.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allAchievements.map((achievement) => {
            const isUnlocked = userAchievements.includes(achievement.id);
            
            return (
              <div
                key={achievement.id}
                className={`relative bg-slate-800 rounded-xl p-8 border-2 transition-all duration-300 ${
                  isUnlocked 
                    ? 'border-amber-500 shadow-xl shadow-amber-500/20 transform hover:scale-105' 
                    : 'border-slate-700 opacity-60'
                }`}
              >
                {!isUnlocked && (
                  <div className="absolute top-4 right-4">
                    <Lock className="text-gray-600" size={20} />
                  </div>
                )}

                <div className="text-center">
                  <div 
                    className={`text-6xl mb-4 ${
                      isUnlocked ? 'animate-bounce' : 'grayscale opacity-50'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${
                    isUnlocked ? 'text-white' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h3>
                  
                  <p className={`text-sm ${
                    isUnlocked ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {achievement.description}
                  </p>

                  {isUnlocked && (
                    <div className="mt-4 inline-block bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      UNLOCKED
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Message */}
        {userAchievements.length === 0 && (
          <div className="mt-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-white mb-2">Start Your Journey!</h3>
            <p className="text-gray-400">
              Complete milestones to unlock your first achievement
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
