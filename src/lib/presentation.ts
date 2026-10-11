export const slides = [
  { title: 'SMART BAG', label: 'Introduction' },
  { title: 'The problem we solve', label: 'Problem & solution' },
  { title: 'Everyday carry. Active awareness.', label: 'The product' },
  { title: 'The economics of one bag.', label: 'Unit economics' },
  { title: 'A business case to validate.', label: 'Valuation' },
] as const;

// Planning proposal only; no validated supplier costs or sales figures implied.
export const proposedPricing = { mrp: 2999, currency: 'INR', status: 'proposal' } as const;

export const economicsAssumptions = {
  status: 'illustrative estimate', taxRate: 0.18, discount: 0, channelFee: 0,
  production: { bag: 600, electronics: 400, assembly: 150, testingAndPackaging: 50 },
  selling: { delivery: 100, marketing: 200, warrantyReserve: 50, overheadAllocation: 100 },
} as const;
export function unitEconomics() {
  const revenue = proposedPricing.mrp / (1 + economicsAssumptions.taxRate);
  const productionCost = Object.values(economicsAssumptions.production).reduce((a, b) => a + b, 0);
  const sellingCost = Object.values(economicsAssumptions.selling).reduce((a, b) => a + b, 0);
  const grossProfit = revenue - productionCost;
  return { revenue, tax: proposedPricing.mrp - revenue, productionCost, sellingCost, grossProfit,
    grossMargin: grossProfit / revenue * 100, operatingProfit: grossProfit - sellingCost,
    operatingMargin: (grossProfit - sellingCost) / revenue * 100 };
}
export function transitionEffect(from: number, to: number) {
  return (['shutter', 'iris', 'lift', 'fold'] as const)[Math.min(from, to) % 4] ?? 'shutter';
}

export type Scenario = 'idle' | 'authorized' | 'movement' | 'tamper';
export function scenarioState(scenario: Scenario) {
  return {
    authorized: scenario === 'authorized',
    movement: scenario === 'movement',
    tamper: scenario === 'tamper',
    buzzer: scenario === 'movement' || scenario === 'tamper',
    notification: scenario === 'movement' ? 'Unauthorized movement detected' : scenario === 'tamper' ? 'Chain or zipper tampering detected' : null,
    status: scenario === 'authorized' ? 'Access authorized' : scenario === 'idle' ? 'System ready' : 'Security alert',
  };
}
export function slideIndex(value: unknown) {
  const number = Number(value);
  return Number.isInteger(number) && number >= 1 && number <= slides.length ? number - 1 : 0;
}