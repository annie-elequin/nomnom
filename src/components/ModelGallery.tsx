import React, { useState, useMemo } from 'react';
import Fuse from 'fuse.js';
import Masonry from 'react-masonry-css';
import { PreviewService } from '../services/previewService';
import '../styles/ModelGallery.css';

interface Model {
  title: string;
  url?: string;
  imageUrl?: string;
}

interface SearchResult {
  item: Model;
  refIndex: number;
  score: number;
}

interface ModelGalleryProps {
  models: Model[];
}

const ModelGallery: React.FC<ModelGalleryProps> = ({ models }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter out models without URLs
  const validModels = useMemo(() => {
    return models.filter(model => model.url);
  }, [models]);

  // Setup fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(validModels, {
      keys: ['title'],
      threshold: 0.4,
    });
  }, [validModels]);

  // Filter models based on search
  const filteredModels = useMemo(() => {
    if (!searchQuery) return validModels;
    const searchResults = fuse.search(searchQuery);
    return searchResults.map(result => result.item);
  }, [searchQuery, validModels, fuse]);

  // Masonry breakpoints
  const breakpointColumns = {
    default: 4,
    1100: 3,
    700: 2,
    500: 1
  };

  return (
    <div className="model-gallery">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <Masonry
        breakpointCols={breakpointColumns}
        className="masonry-grid"
        columnClassName="masonry-grid_column"
      >
        {filteredModels.map((model: Model, index: number) => (
          <div key={index} className="model-card">
            <a 
              href={model.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="model-link"
            >
              <div className="model-image">
                <img 
                  src={model.imageUrl || PreviewService.PLACEHOLDER_IMAGE}
                  alt={model.title}
                  loading="lazy"
                />
              </div>
              <h3 className="model-title">{model.title}</h3>
            </a>
          </div>
        ))}
      </Masonry>
    </div>
  );
};

export default ModelGallery; 