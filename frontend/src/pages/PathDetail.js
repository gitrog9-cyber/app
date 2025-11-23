import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import ShareProgress from '@/components/enhanced/ShareProgress';
import CertificateGenerator from '@/components/enhanced/CertificateGenerator';
import { 
  Check, 
  X, 
  Video, 
  FileText, 
  BookOpen, 
  ExternalLink,
  ArrowLeft,
  Award,
  Share2
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ICON_MAP = {
  code: '💻',
  shield: '🛡️',
  brain: '🧠',
  chart: '📊',
  cube: '📦',
  cloud: '☁️'
};

const RESOURCE_ICONS = {
  video: Video,
  article: FileText,
  course: BookOpen
};

const PathDetail = () => {
  const { pathId } = useParams();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [path, setPath] = useState(null);
  const [progress, setProgress] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShare, setShowShare] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    fetchPathData();
  }, [pathId]);

  const fetchPathData = async () => {
    try {
      const [pathRes, progressRes] = await Promise.all([
        axios.get(`${API}/career-paths/${pathId}`),
        axios.get(`${API}/progress/${user.id}/${pathId}`)
      ]);

      setPath(pathRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error fetching path data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMilestoneComplete = async (milestoneId) => {
    const isCompleted = progress?.completed_milestones?.includes(milestoneId);
    
    try {
      await axios.post(
        `${API}/progress/${user.id}/${pathId}`,
        {
          milestone_id: milestoneId,
          completed: !isCompleted
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      await fetchPathData();
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const calculateProgress = () => {
    if (!path || !progress?.completed_milestones) return 0;
    return Math.round((progress.completed_milestones.length / path.milestones.length) * 100);
  };

  const isPathCompleted = () => {
    if (!path || !progress?.completed_milestones) return false;
    return progress.completed_milestones.length === path.milestones.length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!path) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Path not found</div>
      </div>
    );
  }

  const completedDays = path.milestones
    .filter(m => progress?.completed_milestones?.includes(m.id))
    .reduce((sum, m) => sum + m.estimated_days, 0);
  const totalDays = path.milestones.reduce((sum, m) => sum + m.estimated_days, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft className="mr-2" size={18} />
            Back to Dashboard
          </Button>

          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="text-6xl">{ICON_MAP[path.icon]}</div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">{path.name}</h1>
                  <p className="text-gray-400 text-lg mb-4">{path.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Progress:</span>
                      <span className="text-white font-semibold">{calculateProgress()}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Milestones:</span>
                      <span className="text-white font-semibold">
                        {progress?.completed_milestones?.length || 0}/{path.milestones.length}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400">Days:</span>
                      <span className="text-white font-semibold">{completedDays}/{totalDays}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowShare(true)}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Share2 size={18} />
                  <span>Share</span>
                </Button>
                
                {isPathCompleted() && (
                  <Button
                    onClick={() => setShowCertificate(true)}
                    className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 flex items-center space-x-2"
                  >
                    <Award size={18} />
                    <span>Get Certificate</span>
                  </Button>
                )}
              </div>
            </div>

            <Progress value={calculateProgress()} className="mt-6 h-3" />
          </div>
        </div>

        {/* Milestones List */}
        <div className="space-y-4">
          {path.milestones.map((milestone, index) => {
            const isCompleted = progress?.completed_milestones?.includes(milestone.id);
            const isActive = selectedMilestone?.id === milestone.id;
            
            return (
              <div
                key={milestone.id}
                className={`bg-slate-800 rounded-xl p-6 border-2 transition-all duration-300 ${
                  isCompleted 
                    ? 'border-green-500 shadow-lg shadow-green-500/20' 
                    : 'border-slate-700 hover:border-slate-600'
                } ${isActive ? 'ring-2 ring-blue-500' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Checkpoint */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-green-500 text-white' 
                      : 'bg-slate-700 text-gray-400'
                  }`}>
                    {isCompleted ? <Check size={24} /> : <span className="text-xl font-bold">{index + 1}</span>}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">{milestone.title}</h3>
                        <p className="text-gray-400">{milestone.description}</p>
                      </div>
                      
                      <Button
                        onClick={() => toggleMilestoneComplete(milestone.id)}
                        className={isCompleted ? 'bg-green-600 hover:bg-green-700' : ''}
                      >
                        {isCompleted ? (
                          <>
                            <Check size={18} className="mr-2" />
                            Completed
                          </>
                        ) : (
                          'Mark Complete'
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        📅 {milestone.estimated_days} days
                      </span>
                      <span className="flex items-center">
                        📚 {milestone.resources.length} resources
                      </span>
                    </div>

                    {/* Resources */}
                    <div>
                      <button
                        onClick={() => setSelectedMilestone(selectedMilestone?.id === milestone.id ? null : milestone)}
                        className="text-blue-400 hover:text-blue-300 text-sm font-medium mb-3"
                      >
                        {selectedMilestone?.id === milestone.id ? 'Hide' : 'Show'} Resources
                      </button>

                      {selectedMilestone?.id === milestone.id && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                          {milestone.resources.map((resource, idx) => {
                            const ResourceIcon = RESOURCE_ICONS[resource.type];
                            return (
                              <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-3 bg-slate-700 hover:bg-slate-600 p-4 rounded-lg transition"
                              >
                                <div className="flex-shrink-0 w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center">
                                  {ResourceIcon && <ResourceIcon size={20} className="text-blue-400" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-white font-medium truncate">{resource.title}</div>
                                  <div className="text-gray-400 text-xs capitalize">{resource.type}</div>
                                </div>
                                <ExternalLink size={16} className="text-gray-500 flex-shrink-0" />
                              </a>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Share Modal */}
      {showShare && (
        <ShareProgress
          pathId={pathId}
          userId={user.id}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Certificate Modal */}
      {showCertificate && (
        <CertificateGenerator
          pathId={pathId}
          userId={user.id}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
};

export default PathDetail;
