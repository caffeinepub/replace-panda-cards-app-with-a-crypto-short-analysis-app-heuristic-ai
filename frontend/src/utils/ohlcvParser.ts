import type { OHLCVDataPoint } from '../hooks/useQueries';

export function parseOHLCVData(text: string): OHLCVDataPoint[] {
  const lines = text.trim().split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    throw new Error('No data provided');
  }

  const dataPoints: OHLCVDataPoint[] = [];
  let hasHeader = false;

  // Check if first line is a header
  const firstLine = lines[0].toLowerCase();
  if (firstLine.includes('timestamp') || firstLine.includes('open') || firstLine.includes('close')) {
    hasHeader = true;
  }

  const dataLines = hasHeader ? lines.slice(1) : lines;

  if (dataLines.length < 14) {
    throw new Error('Insufficient data: At least 14 rows required for RSI calculation (provided: ' + dataLines.length + ')');
  }

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i].trim();
    if (!line) continue;

    // Support both comma and tab delimiters
    const parts = line.split(/[,\t]/).map(p => p.trim());

    if (parts.length < 6) {
      throw new Error(`Invalid data format at row ${i + 1}: Expected 6 columns (timestamp, open, high, low, close, volume), found ${parts.length}`);
    }

    const timestamp = parts[0];
    const open = parseFloat(parts[1]);
    const high = parseFloat(parts[2]);
    const low = parseFloat(parts[3]);
    const close = parseFloat(parts[4]);
    const volume = parseFloat(parts[5]);

    // Validate numeric values
    if (isNaN(open) || isNaN(high) || isNaN(low) || isNaN(close) || isNaN(volume)) {
      throw new Error(`Invalid numeric values at row ${i + 1}: Ensure all price and volume values are valid numbers`);
    }

    // Validate price relationships
    if (high < low) {
      throw new Error(`Invalid data at row ${i + 1}: High price (${high}) cannot be less than low price (${low})`);
    }

    if (close > high || close < low) {
      throw new Error(`Invalid data at row ${i + 1}: Close price (${close}) must be between high (${high}) and low (${low})`);
    }

    if (open > high || open < low) {
      throw new Error(`Invalid data at row ${i + 1}: Open price (${open}) must be between high (${high}) and low (${low})`);
    }

    // Parse timestamp (support both Unix timestamp and ISO string)
    let timestampBigInt: bigint;
    if (/^\d+$/.test(timestamp)) {
      // Unix timestamp
      timestampBigInt = BigInt(timestamp);
    } else {
      // Try parsing as date string
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new Error(`Invalid timestamp at row ${i + 1}: "${timestamp}" is not a valid Unix timestamp or date string`);
      }
      timestampBigInt = BigInt(date.getTime());
    }

    dataPoints.push({
      timestamp: timestampBigInt,
      open,
      high,
      low,
      close,
      volume,
    });
  }

  // Sort by timestamp ascending
  dataPoints.sort((a, b) => Number(a.timestamp - b.timestamp));

  return dataPoints;
}
