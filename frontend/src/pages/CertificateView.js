import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Award, Download, Share2, Calendar, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CertificateView = () => {
  const { certificateId } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [certificateId]);

  const fetchCertificate = async () => {
    try {
      const response = await axios.get(`${API}/certificate/${certificateId}`);
      setCertificate(response.data);
    } catch (error) {
      console.error('Error fetching certificate:', error);
      setError('Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Certificate link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-white mb-2">Certificate Not Found</h2>
          <p className="text-gray-400">This certificate doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Card */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-12 shadow-2xl border-8 border-amber-400 relative overflow-hidden">
          {/* Decorative corners */}
          <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-amber-600"></div>
          <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-amber-600"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-amber-600"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-amber-600"></div>

          <div className="text-center relative z-10">
            {/* Logo */}
            <div className="mb-6">
              <span className="text-6xl">⚡</span>
              <h1 className="text-3xl font-bold text-slate-800 mt-2">SUPERCHARGE</h1>
            </div>

            {/* Certificate Title */}
            <div className="mb-8">
              <h2 className="text-5xl font-bold text-slate-900 mb-4">Certificate of Completion</h2>
              <div className="w-32 h-1 bg-amber-500 mx-auto"></div>
            </div>

            {/* Recipient */}
            <div className="mb-8">
              <p className="text-gray-600 text-lg mb-2">This is to certify that</p>
              <h3 className="text-4xl font-bold text-slate-900 mb-4">{certificate.user_name}</h3>
              <p className="text-gray-600 text-lg mb-2">has successfully completed</p>
              <h4 className="text-3xl font-bold text-amber-700 mb-6">{certificate.path_name}</h4>
            </div>

            {/* Details */}
            <div className="mb-8">
              <p className="text-gray-600">
                Completing all {certificate.total_milestones} milestones and demonstrating 
                mastery in this career path
              </p>
            </div>

            {/* Achievements */}
            {certificate.achievements && certificate.achievements.length > 0 && (
              <div className="mb-8">
                <p className="text-gray-600 mb-3">Achievements Earned:</p>
                <div className="flex justify-center flex-wrap gap-2">
                  {certificate.achievements.map((achievement, idx) => (
                    <span 
                      key={idx}
                      className="bg-amber-200 text-amber-900 px-4 py-2 rounded-full text-sm font-semibold"
                    >
                      {achievement}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center justify-center text-gray-600 mb-8">
              <Calendar size={20} className="mr-2" />
              <span className="text-lg">
                {new Date(certificate.completion_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>

            {/* Badge */}
            <div className="flex justify-center">
              <div className="bg-amber-500 text-white rounded-full p-6 shadow-xl">
                <Trophy size={48} />
              </div>
            </div>

            {/* Certificate ID */}
            <div className="mt-8 text-gray-500 text-sm">
              Certificate ID: {certificate.id}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button
            onClick={handleShare}
            className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
          >
            <Share2 size={18} />
            <span>Share</span>
          </Button>
          
          <Button
            onClick={() => window.print()}
            className="bg-amber-600 hover:bg-amber-700 flex items-center space-x-2"
          >
            <Download size={18} />
            <span>Download</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CertificateView;
