import React, { useState, useCallback } from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

interface Hour {
  id: number;
  alpha: number;
  beta: number;
  lastSample: number | null;
}

// Helper functions for beta distribution calculations
function betaFunction(a: number, b: number): number {
  return Math.exp(lnBeta(a, b));
}

function lnBeta(a: number, b: number): number {
  return lnGamma(a) + lnGamma(b) - lnGamma(a + b);
}

function lnGamma(z: number): number {
  const c = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5,
  ];
  let sum = 1.000000000190015;
  for (let i = 0; i < 6; i++) {
    sum += c[i] / (z + i + 1);
  }
  return (
    (Math.log(2.5066282746310005 * sum) +
      (z + 0.5) * Math.log(z + 5.5) -
      (z + 5.5))
  );
}

// Sample from beta distribution
function sampleBeta(alpha: number, beta: number): number {
  // Using rejection sampling method
  const a = alpha;
  const b = beta;
  
  // Simple rejection sampling
  while (true) {
    const u = Math.random();
    const v = Math.random();
    
    if (Math.pow(u, 1/a) + Math.pow(v, 1/b) <= 1) {
      return Math.pow(u, 1/a) / (Math.pow(u, 1/a) + Math.pow(v, 1/b));
    }
  }
}

export const ThompsonSamplingDemo: React.FC = () => {
  const [hours, setHours] = useState<Hour[]>([
    { id: 9, alpha: 8, beta: 4, lastSample: null },   // 9 AM - Good morning performance
    { id: 12, alpha: 5, beta: 5, lastSample: null },  // 12 PM - Average performance
    { id: 15, alpha: 10, beta: 2, lastSample: null }, // 3 PM - Best performance
    { id: 18, alpha: 3, beta: 7, lastSample: null },  // 6 PM - Poor performance
    { id: 21, alpha: 6, beta: 6, lastSample: null },  // 9 PM - Slightly above average
  ]);

  const sampleAll = useCallback(() => {
    setHours(prevHours => 
      prevHours.map(hour => ({
        ...hour,
        lastSample: sampleBeta(hour.alpha, hour.beta)
      }))
    );
  }, []);

  const spec: VisualizationSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 600,
    height: 400,
    data: {
      name: 'values',
      values: [
        // Distribution curves
        ...hours.flatMap(hour => 
          Array.from({ length: 101 }, (_, i) => {
            const x = i / 100;
            return {
              hour: `${hour.id}:00`,
              x,
              density: Math.pow(x, hour.alpha - 1) * Math.pow(1 - x, hour.beta - 1) / betaFunction(hour.alpha, hour.beta),
              isSample: false,
              isSelected: hour.lastSample === Math.max(...hours.map(h => h.lastSample || 0))
            };
          })
        ),
        // Sample points
        ...hours
          .filter(hour => hour.lastSample !== null)
          .map(hour => ({
            hour: `${hour.id}:00`,
            x: hour.lastSample!,
            density: Math.pow(hour.lastSample!, hour.alpha - 1) * 
                    Math.pow(1 - hour.lastSample!, hour.beta - 1) / 
                    betaFunction(hour.alpha, hour.beta),
            isSample: true,
            isSelected: hour.lastSample === Math.max(...hours.map(h => h.lastSample || 0))
          }))
      ]
    },
    layer: [
      {
        mark: { 
          type: 'line',
          strokeWidth: 2
        },
        transform: [{ calculate: "datum.isSelected ? 'Selected' : 'Not Selected'", as: 'status' }],
        encoding: {
          x: {
            field: 'x',
            type: 'quantitative',
            title: 'Success Probability',
            axis: { format: '.2f' }
          },
          y: {
            field: 'density',
            type: 'quantitative',
            title: 'Density'
          },
          color: {
            field: 'hour',
            type: 'nominal',
            title: null,
            scale: {
              domain: hours.map(h => `${h.id}:00`),
              range: ['#4C78A8', '#F58518', '#E45756', '#72B7B2', '#54A24B']
            },
            legend: {
              title: 'Hour',
              labelExpr: "datum.value + (datum.value === datum.hour && datum.isSelected ? ' ✓' : '')",
              labelFontSize: 12
            },
          },
          opacity: {
            condition: { test: "datum.isSelected", value: 1 },
            value: 0.6
          }
        }
      },
      {
        mark: { type: 'point', size: 150, filled: true },
        transform: [{ filter: 'datum.isSample' }],
        encoding: {
          x: { field: 'x', type: 'quantitative' },
          y: { field: 'density', type: 'quantitative' },
          color: { field: 'hour', type: 'nominal' }
        }
      }
    ],
    title: 'Thompson Sampling Across Different Hours',

  };

  const bestHour = hours.reduce((best, current) => 
    (current.lastSample || 0) > (best.lastSample || 0) ? current : best
  );

  return (
    <div className="thompson-sampling-demo">
      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={sampleAll}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#4C78A8',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          Sample All Hours
        </button>
        {bestHour.lastSample !== null && (
          <div style={{ marginTop: '0.5rem' }}>
            Best hour to send: {bestHour.id}:00 (sampled value: {bestHour.lastSample.toFixed(3)})
          </div>
        )}
      </div>
      <Vega spec={spec} />
    </div>
  );
};
