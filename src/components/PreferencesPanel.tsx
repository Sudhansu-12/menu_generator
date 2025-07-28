import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { UserPreferences } from '../types';

interface PreferencesPanelProps {
  preferences: UserPreferences;
  onUpdatePreferences: (preferences: UserPreferences) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const PreferencesPanel: React.FC<PreferencesPanelProps> = ({
  preferences,
  onUpdatePreferences,
  isOpen,
  onToggle
}) => {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences);

  const handleSave = () => {
    onUpdatePreferences(localPreferences);
    onToggle();
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const updated = localPreferences.dietaryRestrictions.includes(restriction)
      ? localPreferences.dietaryRestrictions.filter(r => r !== restriction)
      : [...localPreferences.dietaryRestrictions, restriction];
    
    setLocalPreferences(prev => ({
      ...prev,
      dietaryRestrictions: updated
    }));
  };

  const toggleTastePreference = (taste: string) => {
    const updated = localPreferences.preferredTastes.includes(taste)
      ? localPreferences.preferredTastes.filter(t => t !== taste)
      : [...localPreferences.preferredTastes, taste];
    
    setLocalPreferences(prev => ({
      ...prev,
      preferredTastes: updated
    }));
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="fixed top-4 right-4 z-50 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300 shadow-lg"
      >
        <Settings className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Meal Preferences</h2>
              <button
                onClick={onToggle}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dietary Restrictions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Dietary Restrictions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Low-Sodium'].map(restriction => (
                    <label key={restriction} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localPreferences.dietaryRestrictions.includes(restriction)}
                        onChange={() => toggleDietaryRestriction(restriction)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Taste Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Preferred Tastes</h3>
                <div className="flex flex-wrap gap-2">
                  {['sweet', 'savory', 'spicy', 'any'].map(taste => (
                    <button
                      key={taste}
                      onClick={() => toggleTastePreference(taste)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        localPreferences.preferredTastes.includes(taste)
                          ? 'bg-blue-500 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {taste.charAt(0).toUpperCase() + taste.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calorie Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Calorie Range per Combo</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Minimum</label>
                    <input
                      type="number"
                      min="400"
                      max="800"
                      value={localPreferences.calorieRange.min}
                      onChange={(e) => setLocalPreferences(prev => ({
                        ...prev,
                        calorieRange: { ...prev.calorieRange, min: parseInt(e.target.value) || 550 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Maximum</label>
                    <input
                      type="number"
                      min="500"
                      max="1000"
                      value={localPreferences.calorieRange.max}
                      onChange={(e) => setLocalPreferences(prev => ({
                        ...prev,
                        calorieRange: { ...prev.calorieRange, max: parseInt(e.target.value) || 800 }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                >
                  Save Preferences
                </button>
                <button
                  onClick={onToggle}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreferencesPanel;