import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check, X } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ShareProgress = ({ pathId, userId, onClose }) => {
  const [sharing, setSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const { token } = useAuth();

  const handleShare = async () => {
    setSharing(true);
    try {
      const response = await axios.post(
        `${API}/share/progress`,
        { path_id: pathId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fullUrl = `${window.location.origin}${response.data.share_url}`;
      setShareUrl(fullUrl);
    } catch (error) {
      console.error('Error sharing progress:', error);
      alert('Failed to generate share link');
    } finally {
      setSharing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-800 rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Share Your Progress</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {!shareUrl ? (
          <div>
            <p className="text-gray-400 mb-6">
              Create a shareable link to show your progress to others
            </p>
            <Button 
              onClick={handleShare} 
              disabled={sharing}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {sharing ? 'Generating Link...' : (
                <>
                  <Share2 size={18} className="mr-2" />
                  Generate Share Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-gray-400 mb-3">Share this link:</p>
            <div className="flex items-center space-x-2">
              <input 
                type="text" 
                value={shareUrl} 
                readOnly 
                className="flex-1 bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 text-sm"
              />
              <Button 
                onClick={copyToClipboard} 
                className="bg-green-600 hover:bg-green-700"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />}
              </Button>
            </div>
            {copied && (
              <p className="text-green-400 text-sm mt-2">Link copied to clipboard!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShareProgress;
