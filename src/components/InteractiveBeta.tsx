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
    <div className="interactive-beta">
      <div className="controls" style={{ marginBottom: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.5rem' }}>
            α: {alpha.toFixed(1)} | β: {beta.toFixed(1)}
          </div>
          <button
            onClick={handleSuccess}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '1rem'
            }}
          >
            Success (+α)
          </button>
          <button
            onClick={handleFailure}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Failure (+β)
          </button>
        </div>
        <button 
          onClick={handleReset}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4C78A8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '0.5rem'
          }}
        >
          Reset
        </button>
      </div>
      <BetaDistribution alpha={alpha} beta={beta} />
    </div>
  );
};
