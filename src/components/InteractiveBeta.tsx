import React, { useState } from 'react';
import { BetaDistribution } from './BetaDistribution';

export const InteractiveBeta: React.FC = () => {
  const [alpha, setAlpha] = useState(2);
  const [beta, setBeta] = useState(2);

  return (
    <div className="interactive-beta">
      <div className="controls" style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          α:
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
          <span style={{ marginLeft: '0.5rem' }}>{alpha.toFixed(1)}</span>
        </label>
        <label>
          β:
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value))}
            style={{ marginLeft: '0.5rem' }}
          />
          <span style={{ marginLeft: '0.5rem' }}>{beta.toFixed(1)}</span>
        </label>
      </div>
      <BetaDistribution alpha={alpha} beta={beta} />
    </div>
  );
};
