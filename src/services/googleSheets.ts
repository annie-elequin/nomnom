// Configuration
const SPREADSHEET_URL = process.env.REACT_APP_SPREADSHEET_URL || '';

export interface CellData {
  value: string;
  link?: string;
}

export interface SheetData {
  range: string;
  majorDimension: string;
  values: CellData[][];
}

export async function getGoogleSheetsData(): Promise<SheetData | null> {
  try {
    console.log('Attempting to fetch spreadsheet data...');
    console.log('SPREADSHEET_URL:', SPREADSHEET_URL);
    
    const spreadsheetId = extractSpreadsheetId(SPREADSHEET_URL);
    console.log('Extracted spreadsheetId:', spreadsheetId);
    
    if (!spreadsheetId) {
      console.error('Invalid spreadsheet URL. URL provided:', SPREADSHEET_URL);
      throw new Error('Invalid spreadsheet URL');
    }

    // Use CSV export format with specific sheet name
    const exportUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=Links`;
    console.log('Fetching from:', exportUrl);
    
    const response = await fetch(exportUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch spreadsheet data');
    }

    const csvText = await response.text();
    // Split into rows and cells
    const rows = csvText.split('\n').map(row => row.split(','));

    // Convert to our data format
    const formattedRows = rows.map(row => {
      const cells: CellData[] = [];
      // Process cells in alternating columns
      for (let i = 0; i < row.length; i++) {
        const value = row[i]?.trim().replace(/^"|"$/g, '') || '';
        const link = row[i + 1]?.trim().replace(/^"|"$/g, '') || undefined;
        
        // Only add cells for the content columns (A, C, E, etc.)
        if (i % 2 === 0) {
          cells.push({ value, link });
        }
      }
      return cells;
    }).filter(row => row.length > 0); // Remove empty rows

    return {
      range: 'A1:Z',
      majorDimension: 'ROWS',
      values: formattedRows
    };
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    return null;
  }
}

function extractSpreadsheetId(url: string): string | null {
  // Extract ID from URL like: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
} 