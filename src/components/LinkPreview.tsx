import React, { useEffect, useState } from 'react';
import previewService from '../services/previewService';

interface LinkPreviewProps {
  url: string;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const preview = await previewService.getPreview(url);
        if (preview.imageUrl) {
          setImageUrl(preview.imageUrl);
        } else {
          setError(preview.error || 'No preview image available');
        }
      } catch (err) {
        setError('Failed to load preview');
        console.error('Error fetching preview:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPreview();
  }, [url]);

  if (loading) {
    return <div className="preview-loading">Loading preview...</div>;
  }

  if (error || !imageUrl) {
    return null; // Don't show anything if there's an error or no image
  }

  return (
    <div className="link-preview">
      <img 
        src={imageUrl} 
        alt="Link preview" 
        className="preview-image"
      />
    </div>
  );
};

export default LinkPreview; 