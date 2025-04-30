import React from 'react';
import ModelGallery from '../components/ModelGallery';
import type { Model } from '../types/models';

// Example models - replace with your actual data
const models: Model[] = [
  {
    title: "Valeera Sanguinar",
    url: "https://www.cgtrader.com/3d-print-models/miniatures/figurines/valeera-sanguinar-world-of-warcraft"
  },
  // Add more models here
];

const IndexPage: React.FC = () => {
  // Add necessary meta tags for iframe embedding
  React.useEffect(() => {
    document.title = "3D Model Gallery";
    // Allow embedding in iframes
    const meta = document.createElement('meta');
    meta.name = 'content-security-policy';
    meta.content = "frame-ancestors 'self' *";
    document.head.appendChild(meta);
    
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      margin: 0,
      padding: 0,
      boxSizing: 'border-box'
    }}>
      <ModelGallery models={models} />
    </div>
  );
};

export default IndexPage; 