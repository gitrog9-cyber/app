import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Award, Download, Share2, X, ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CertificateGenerator = ({ pathId, userId, onClose }) => {
  const [generating, setGenerating] = useState(false);
  const [certificate, setCertificate] = useState(null);
  const { token } = useAuth();

  const generateCertificate = async () => {
    setGenerating(true);
    try {
      const response = await axios.post(
        `${API}/certificate/generate`,
        { path_id: pathId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCertificate(response.data);
    } catch (error) {
      console.error('Error generating certificate:', error);
      alert(error.response?.data?.detail || 'Failed to generate certificate');
    } finally {
      setGenerating(false);
    }
  };

  const downloadCertificate = () => {
    // Create a simple certificate HTML
    const certificateHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Georgia', serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0;
          }
          .certificate {
            width: 800px;
            padding: 60px;
            background: white;
            border: 20px solid #10B981;
            border-image: linear-gradient(135deg, #10B981, #06B6D4) 1;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          }
          .logo { font-size: 48px; margin-bottom: 20px; }
          h1 { font-size: 42px; color: #10B981; margin: 20px 0; }
          h2 { font-size: 28px; color: #333; margin: 30px 0; }
          .name { font-size: 36px; color: #764ba2; font-weight: bold; margin: 20px 0; }
          .path { font-size: 24px; color: #555; margin: 20px 0; }
          .date { font-size: 18px; color: #888; margin: 30px 0; }
          .achievements { margin: 30px 0; font-size: 32px; }
        </style>
      </head>
      <body>
        <div class="certificate">
          <div class="logo">⚡</div>
          <h1>SUPERCHARGE</h1>
          <h2>Certificate of Completion</h2>
          <p style="font-size: 18px;">This is to certify that</p>
          <div class="name">${certificate.user_name}</div>
          <p style="font-size: 18px;">has successfully completed</p>
          <div class="path">${certificate.path_name}</div>
          <p style="font-size: 16px;">completing all ${certificate.total_milestones} milestones</p>
          <div class="achievements">
            ${certificate.achievements.map(a => {
              const icons = { first_step: '🎯', halfway_hero: '🚀', path_master: '👑', speed_demon: '⚡', multi_path: '🌟' };
              return icons[a] || '⭐';
            }).join(' ')}
          </div>
          <div class="date">Completed on ${new Date(certificate.completion_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([certificateHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pathName}_Certificate.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Generate Certificate</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {!certificate ? (
          <div>
            <div className="text-center mb-6">
              <Award size={64} className="text-amber-500 mx-auto mb-4" />
              <p className="text-gray-400">
                Congratulations on completing this path! Generate your certificate to celebrate your achievement.
              </p>
            </div>
            <Button 
              onClick={generateCertificate} 
              disabled={generating}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            >
              {generating ? 'Generating...' : (
                <>
                  <Award size={18} className="mr-2" />
                  Generate Certificate
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h4 className="text-xl font-bold text-white mb-2">Certificate Generated!</h4>
              <p className="text-gray-400 mb-4">{certificate.path_name}</p>
            </div>
            
            <div className="space-y-3">
              <Button 
                onClick={downloadCertificate} 
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Download size={18} className="mr-2" />
                Download Certificate
              </Button>
              
              <Button 
                onClick={() => window.open(`/certificate/${certificate.certificate_id}`, '_blank')} 
                variant="outline"
                className="w-full"
              >
                <ExternalLink size={18} className="mr-2" />
                View Certificate
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificateGenerator;
