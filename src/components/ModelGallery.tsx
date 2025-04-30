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

interface ModelGalleryProps {
  models: Model[];
}

interface Tag {
  label: string;
  value: string;
}

const generateTagsFromTitles = (models: Model[]): Tag[] => {
  const titleWords = models
    .map(model => model.title.split(/[-\s]/).map(word => word.trim()))
    .flat()
    .filter(word => word.length > 3); // Filter out short words

  const wordCounts = titleWords.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to tags if word appears more than once
  const commonTags = Object.entries(wordCounts)
    .filter(([_, count]) => count > 3)
    .map(([word]) => ({
      label: word,
      value: word
    }));

  // Add manual tags for specific categories
  const manualTags: Tag[] = [
    { label: "Arcane", value: "Arcane" },
    { label: "World of Warcraft", value: "Warcraft" },
    { label: "NomNom Originals", value: "Original" },
    { label: "Fan Art", value: "Fan" },
    { label: "Full Metal Alchemist", value: "Alchemist" },
    { label: "One Piece", value: "One Piece" },
    { label: "Final Fantasy", value: "Final Fantasy" },
    { label: "Demon Slayer", value: "Demon Slayer" },
    { label: "Elden Ring", value: "Elden Ring" },
    { label: "Baldurs Gate", value: "Baldurs Gate" },
    { label: "Pokemon", value: "Pokemon" },
    { label: "Attack on Titan", value: "Attack on Titan" },
    { label: "Lord of the Rings", value: "Lord of the Rings" },
    { label: "Evangelion", value: "Evangelion" },
  ];

  return [...manualTags]
    .sort((a, b) => a.label.localeCompare(b.label));
};

const ModelGallery: React.FC<ModelGalleryProps> = ({ models }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  const tags = useMemo(() => generateTagsFromTitles(models), [models]);
  
  // Filter out models without URLs
  const validModels = useMemo(() => {
    return models.filter(model => model.url);
  }, [models]);

  // Setup fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(validModels, {
      keys: ['title'],
      threshold: 0.2,
      distance: 100,
      minMatchCharLength: 3,
      ignoreLocation: true,
      shouldSort: true,
      findAllMatches: false,
      location: 0
    });
  }, [validModels]);

  // Filter models based on search
  const filteredModels = useMemo(() => {
    if (!searchQuery) return validModels;
    const searchResults = fuse.search(searchQuery);
    return searchResults.map(result => result.item);
  }, [searchQuery, validModels, fuse]);

  const handleTagClick = (tagValue: string) => {
    if (activeTag === tagValue) {
      setActiveTag(null);
      setSearchQuery("");
    } else {
      setActiveTag(tagValue);
      setSearchQuery(tagValue);
    }
  };

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
          placeholder="Filter models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>
      
      <div className="tags-section">
        <h2 className="tags-title">Popular Models</h2>
        <div className="tags-container">
          {tags.map((tag) => (
            <button
              key={tag.label}
              className={`tag-button ${activeTag === tag.value ? 'active' : ''}`}
              onClick={() => handleTagClick(tag.value)}
            >
              {tag.label}
            </button>
          ))}
        </div>
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