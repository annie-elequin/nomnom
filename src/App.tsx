import React, { useEffect, useState } from 'react';
import './App.css';
import { getGoogleSheetsData, SheetData } from './services/googleSheets';
import ModelGallery from './components/ModelGallery';

interface Model {
  title: string;
  url?: string;
  imageUrl?: string;
}

function App() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getGoogleSheetsData();
        if (!data) {
          setError('No data received');
          return;
        }
        // Transform sheet data into models
        const transformedModels = data.values
          .filter(row => row[0].value.trim() !== '') // Filter out empty rows
          .map(row => {
            // Generate random dimensions between 200-600px
            const width = Math.floor(Math.random() * 400) + 200;
            const height = Math.floor(Math.random() * 400) + 200;
            return {
              title: row[0].value,
              url: row[0].link || undefined,
              imageUrl: `https://placehold.co/${width}x${height}/e0e0e0/808080?text=Preview`
            };
          });
        setModels(transformedModels);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading spreadsheet data...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="App">
      <ModelGallery models={models} />
    </div>
  );
}

export default App;
