import React from 'react';

interface SpreadControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  presets?: { label: string; value: number }[];
  isDisabled?: boolean;
}

/**
 * Interactive slider and preset buttons for adjusting mortgage rate spread
 */
export function SpreadControl({
  value,
  onChange,
  min = 1.2,
  max = 3.0,
  step = 0.05,
  presets = [
    { label: 'Conservative', value: 1.5 },
    { label: 'Typical', value: 1.9 },
    { label: 'High-Risk', value: 2.4 },
  ],
  isDisabled = false,
}: SpreadControlProps) {
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  const handlePresetClick = (presetValue: number) => {
    if (!isDisabled) {
      onChange(presetValue);
    }
  };

  return (
    <div className="space-y-4">
      {/* Title and current value */}
      <div className="flex items-center justify-between">
        <div>
          <label htmlFor="spread-slider" className="stat-label">
            Your Spread
          </label>
          <p className="text-sm text-gray-600 mt-1">
            The additional rate lenders charge above the 10-year Treasury to cover costs and risk.
          </p>
        </div>
        <span className="text-2xl font-mono font-bold text-primary-600">
          +{value.toFixed(2)}%
        </span>
      </div>

      {/* Slider and controls in one row */}
      <div className="flex items-center space-x-6">
        {/* Slider section */}
        <div className="flex-1">
          <div className="relative">
            <input
              id="spread-slider"
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={handleSliderChange}
              disabled={isDisabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
              }}
              aria-label={`Mortgage spread: ${value.toFixed(2)} percent`}
            />
          </div>

          {/* Range labels */}
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{min}%</span>
            <span>{max}%</span>
          </div>
        </div>

        {/* Preset buttons */}
        <div className="flex space-x-2">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              disabled={isDisabled}
              className={`px-3 py-2 text-xs font-medium rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                Math.abs(value - preset.value) < 0.01
                  ? 'bg-primary-100 border-primary-300 text-primary-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              aria-label={`Set spread to ${preset.value}% (${preset.label})`}
            >
              <div className="text-center">
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs opacity-75">{preset.value}%</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Additional info */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          <strong>Conservative:</strong> Prime borrowers, excellent credit
        </p>
        <p>
          <strong>Typical:</strong> Good credit, standard loan terms
        </p>
        <p>
          <strong>High-Risk:</strong> Lower credit scores, higher risk factors
        </p>
      </div>
    </div>
  );
}
