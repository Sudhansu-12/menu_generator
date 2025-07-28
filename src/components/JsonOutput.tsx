import React, { useState } from 'react';
import { Code, Copy, Check, Download } from 'lucide-react';
import { DayOutput } from '../types';

interface JsonOutputProps {
  dayOutput: DayOutput | null;
}

const JsonOutput: React.FC<JsonOutputProps> = ({ dayOutput }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!dayOutput) {
    return null;
  }

  const generateJsonOutput = () => {
    return dayOutput.combos.map((combo, index) => ({
      combo_id: index + 1,
      main: combo.main.name.replace(/_\d+$/, ''), // Remove the random suffix for cleaner display
      side: combo.side.name.replace(/_\d+$/, ''),
      drink: combo.drink.name.replace(/_\d+$/, ''),
      total_calories: combo.total_calories,
      popularity_score: parseFloat((combo.popularity_score / 100).toFixed(1)), // Convert to 0-3 scale
      reasoning: generateReasoning(combo, dayOutput.day)
    }));
  };

  const generateReasoning = (combo: any, day: string) => {
    const reasons = [];
    
    // Taste profile reasoning
    if (combo.taste_profile === 'spicy') {
      if (day === 'Thursday' || day === 'Friday') {
        reasons.push('Spicy profile fits ' + day + ' trends');
      } else {
        reasons.push('Spicy profile allowed on ' + day);
      }
    } else if (combo.taste_profile === 'sweet') {
      reasons.push('Sweet profile balances daily variety');
    } else if (combo.taste_profile === 'savory') {
      reasons.push('Savory profile meets daily requirements');
    } else {
      reasons.push('Mixed taste profile adds variety');
    }

    // Popularity reasoning
    if (combo.popularity_score > 240) {
      reasons.push('highly popular choices');
    } else if (combo.popularity_score > 210) {
      reasons.push('popular choices');
    } else {
      reasons.push('balanced popularity');
    }

    // Calorie reasoning
    if (combo.total_calories >= 700) {
      reasons.push('high-energy target met');
    } else if (combo.total_calories >= 650) {
      reasons.push('calorie target met');
    } else {
      reasons.push('light calorie target achieved');
    }

    return reasons.join(', ');
  };

  const jsonData = generateJsonOutput();
  const jsonString = JSON.stringify(jsonData, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `combo-output-${dayOutput.day.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Code className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-800">JSON Output</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center space-x-1 px-3 py-1 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-48 overflow-hidden'}`}>
        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto font-mono">
          <code>{jsonString}</code>
        </pre>
      </div>

      {!isExpanded && (
        <div className="mt-2 text-center">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            Click to view full JSON output...
          </button>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p>This JSON format can be used for API responses, data export, or integration with other systems.</p>
      </div>
    </div>
  );
};

export default JsonOutput;