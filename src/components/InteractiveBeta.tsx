import React, { useState } from 'react';
import { BetaDistribution } from './BetaDistribution';

interface InteractiveBetaProps {
  initialAlpha?: number;
  initialBeta?: number;
}

export const InteractiveBeta: React.FC<InteractiveBetaProps> = ({ 
  initialAlpha = 2, 
  initialBeta = 2 
}) => {
  const [alpha, setAlpha] = useState(initialAlpha);
  const [beta, setBeta] = useState(initialBeta);

  const handleSuccess = () => {
    setAlpha(prev => prev + 1);
  };

  const handleFailure = () => {
    setBeta(prev => prev + 1);
  };

  const handleReset = () => {
    setAlpha(initialAlpha);
    setBeta(initialBeta);
  };

  return (
    <div className="interactive-beta w-full max-w-full overflow-x-hidden">
      <div className="controls mb-4 flex flex-col items-start gap-4">
        <div className="w-full">
          <div className="mb-2 text-lg font-medium">
            α: {alpha.toFixed(1)} | β: {beta.toFixed(1)}
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSuccess}
              className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Success (+α)
            </button>
            <button
              onClick={handleFailure}
              className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Failure (+β)
            </button>
          </div>
        </div>
        <button 
          onClick={handleReset}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <BetaDistribution alpha={alpha} beta={beta} />
      </div>
    </div>
  );
};
