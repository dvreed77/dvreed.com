import React, { useMemo } from 'react';
import { Vega, VisualizationSpec } from 'react-vega';

interface BetaDistributionProps {
  alpha: number;
  beta: number;
}

// Helper function for beta function calculation
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

export const BetaDistribution: React.FC<BetaDistributionProps> = ({ alpha = 2, beta = 2 }) => {
  const spec: VisualizationSpec = useMemo(() => ({
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 500,
    height: 300,
    data: {
      name: 'values',
      values: Array.from({ length: 101 }, (_, i) => {
        const x = i / 100;
        return {
          x,
          density: Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / betaFunction(alpha, beta)
        };
      })
    },
    mark: {
      type: 'line',
      color: '#4C78A8',
      strokeWidth: 2
    },
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
      }
    },
    title: `Beta Distribution (α=${alpha}, β=${beta})`
  }), [alpha, beta]);

  return <Vega spec={spec} />;
};
