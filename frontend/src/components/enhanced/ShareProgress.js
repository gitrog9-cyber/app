import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Share2, Copy, Check } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const ShareProgress = ({ pathId, pathName }) => {
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

  if (shareUrl) {
    return (
      <div className="share-success">
        <p className="share-label">Share your progress:</p>
        <div className="share-url-container">
          <input 
            type="text" 
            value={shareUrl} 
            readOnly 
            className="share-url-input"
          />
          <Button 
            onClick={copyToClipboard} 
            className="share-copy-button"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleShare} 
      disabled={sharing}
      variant="outline"
      className="share-button"
    >
      {sharing ? 'Generating...' : (
        <>
          <Share2 size={18} className="mr-2" />
          Share Progress
        </>
      )}
    </Button>
  );
};

export default ShareProgress;
