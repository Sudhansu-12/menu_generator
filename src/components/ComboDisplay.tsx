import React from 'react';
import { Calendar, Clock, Star, Zap } from 'lucide-react';
import { DayOutput } from '../types';
import JsonOutput from './JsonOutput';

interface ComboDisplayProps {
  dayOutput: DayOutput | null;
  loading: boolean;
}

const ComboDisplay: React.FC<ComboDisplayProps> = ({ dayOutput, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Generating delicious combos...</span>
      </div>
    );
  }

  if (!dayOutput) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Click "Generate Today's Menu" to get started!</p>
      </div>
    );
  }

  const getTasteColor = (taste: string) => {
    switch (taste) {
      case 'sweet': return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'savory': return 'bg-green-100 text-green-800 border-green-200';
      case 'spicy': return 'bg-red-100 text-red-800 border-red-200';
      case 'mixed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-800">{dayOutput.day}</h2>
        </div>
        <p className="text-gray-600">{dayOutput.date}</p>
      </div>

      {/* Combos */}
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {dayOutput.combos.map((combo, index) => (
          <div
            key={index}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Combo #{index + 1}</h3>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getTasteColor(combo.taste_profile)}`}>
                {combo.taste_profile}
              </div>
            </div>

            {/* Combo Items */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{combo.main.name}</div>
                  <div className="text-sm text-gray-600">{combo.main.calories} kcal • {combo.main.taste}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{combo.side.name}</div>
                  <div className="text-sm text-gray-600">{combo.side.calories} kcal • {combo.side.taste}</div>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{combo.drink.name}</div>
                  <div className="text-sm text-gray-600">{combo.drink.calories} kcal • {combo.drink.taste}</div>
                </div>
              </div>
            </div>

            {/* Combo Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-500">Total Calories</div>
                  <div className="font-semibold text-gray-800">{combo.total_calories}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <div>
                  <div className="text-xs text-gray-500">Popularity</div>
                  <div className="font-semibold text-gray-800">{combo.popularity_score}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Daily Menu Summary */}
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-white/20">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Today's Menu Items</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Main Courses ({dayOutput.menu.mains.length})</h4>
            <div className="space-y-1">
              {dayOutput.menu.mains.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-600 flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.calories}kcal</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-green-700 mb-2">Side Dishes ({dayOutput.menu.sides.length})</h4>
            <div className="space-y-1">
              {dayOutput.menu.sides.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-600 flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.calories}kcal</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-purple-700 mb-2">Drinks ({dayOutput.menu.drinks.length})</h4>
            <div className="space-y-1">
              {dayOutput.menu.drinks.map((item, idx) => (
                <div key={idx} className="text-sm text-gray-600 flex justify-between">
                  <span>{item.name}</span>
                  <span>{item.calories}kcal</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
      {/* JSON Output Section */}
      <JsonOutput dayOutput={dayOutput} />

  );
};

export default ComboDisplay;