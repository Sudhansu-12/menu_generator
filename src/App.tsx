import React, { useState, useEffect } from 'react';
import { RefreshCw, ChefHat, Calendar, Clock } from 'lucide-react';
import { DayOutput, UserPreferences, ComboHistory } from './types';
import { generateDailyMenu } from './utils/menuGenerator';
import { generateDailyCombos } from './utils/comboGenerator';
import PreferencesPanel from './components/PreferencesPanel';
import ComboDisplay from './components/ComboDisplay';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function App() {
  const [currentDayOutput, setCurrentDayOutput] = useState<DayOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);
  
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('mealPreferences');
    return saved ? JSON.parse(saved) : {
      dietaryRestrictions: [],
      preferredTastes: ['any'],
      calorieRange: { min: 550, max: 800 },
      avoidIngredients: []
    };
  });

  const [comboHistory, setComboHistory] = useState<ComboHistory>(() => {
    const saved = localStorage.getItem('comboHistory');
    return saved ? JSON.parse(saved) : {};
  });

  const getCurrentDateInfo = () => {
    const now = new Date();
    const dayName = DAYS_OF_WEEK[now.getDay()];
    const dateString = now.toISOString().split('T')[0]; // YYYY-MM-DD format
    const displayDate = now.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    return { dayName, dateString, displayDate };
  };

  const generateTodaysMenu = async () => {
    setLoading(true);
    const { dayName, dateString, displayDate } = getCurrentDateInfo();
    
    try {
      // Generate fresh menu
      const menu = generateDailyMenu();
      
      // Generate combos with constraints
      const combos = generateDailyCombos(menu, dayName, dateString, preferences, comboHistory);
      
      const dayOutput: DayOutput = {
        day: dayName,
        date: displayDate,
        combos,
        menu
      };
      
      setCurrentDayOutput(dayOutput);
      setLastGenerated(dateString);
      
      // Save to localStorage
      localStorage.setItem(`dayOutput_${dateString}`, JSON.stringify(dayOutput));
      localStorage.setItem('comboHistory', JSON.stringify(comboHistory));
      localStorage.setItem('lastGenerated', dateString);
      
    } catch (error) {
      console.error('Error generating menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = (newPreferences: UserPreferences) => {
    setPreferences(newPreferences);
    localStorage.setItem('mealPreferences', JSON.stringify(newPreferences));
  };

  // Load today's menu if already generated
  useEffect(() => {
    const { dateString } = getCurrentDateInfo();
    const saved = localStorage.getItem(`dayOutput_${dateString}`);
    const savedLastGenerated = localStorage.getItem('lastGenerated');
    
    if (saved && savedLastGenerated === dateString) {
      setCurrentDayOutput(JSON.parse(saved));
      setLastGenerated(dateString);
    }
  }, []);

  const { dateString } = getCurrentDateInfo();
  const isAlreadyGenerated = lastGenerated === dateString;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <PreferencesPanel
        preferences={preferences}
        onUpdatePreferences={handleUpdatePreferences}
        isOpen={preferencesOpen}
        onToggle={() => setPreferencesOpen(!preferencesOpen)}
      />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Intelligent Combo Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Smart meal combo generation with calorie optimization, taste balancing, and dietary preferences
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-8">
          <button
            onClick={generateTodaysMenu}
            disabled={loading}
            className={`
              flex items-center space-x-2 px-8 py-4 rounded-2xl font-semibold text-white shadow-lg
              transition-all duration-300 transform hover:scale-105 hover:shadow-xl
              ${loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isAlreadyGenerated
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
              }
            `}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>{isAlreadyGenerated ? 'Regenerate Today\'s Menu' : 'Generate Today\'s Menu'}</span>
              </>
            )}
          </button>

          {currentDayOutput && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Clock className="w-4 h-4" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <ComboDisplay dayOutput={currentDayOutput} loading={loading} />
        </div>

        {/* Footer Info */}
        {currentDayOutput && (
          <div className="mt-12 text-center">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto border border-white/20">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Algorithm Features</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>3-day combo uniqueness tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Day-specific taste profile enforcement</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Popularity score balancing (±10)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;