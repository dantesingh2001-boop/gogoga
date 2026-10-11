import { describe, expect, it } from 'vitest';
import { slides, slideIndex, scenarioState, proposedPricing, unitEconomics, transitionEffect } from '@/lib/presentation';

describe('SMART BAG presentation rules', () => {
  it('has exactly five slides', () => { expect(slides).toHaveLength(5); });
  it('keeps suggested pricing an INR planning proposal', () => { expect(proposedPricing).toEqual({ mrp: 2999, currency: 'INR', status: 'proposal' }); });
  it('deducts assumed tax from the proposed MRP', () => { expect(unitEconomics().revenue).toBeCloseTo(2541.53, 2); expect(unitEconomics().tax).toBeCloseTo(457.47, 2); });
  it('totals estimated production costs', () => { expect(unitEconomics().productionCost).toBe(1200); });
  it('calculates gross profit and margin on tax-exclusive revenue', () => { expect(unitEconomics().grossProfit).toBeCloseTo(1341.53, 2); expect(unitEconomics().grossMargin).toBeCloseTo(52.7843, 3); });
  it('deducts all assumed selling and overhead costs', () => { expect(unitEconomics().sellingCost).toBe(450); expect(unitEconomics().operatingProfit).toBeCloseTo(891.53, 2); });
  it('uses four different effects across the four slide boundaries', () => { expect(new Set([0,1,2,3].map(i => transitionEffect(i, i+1))).size).toBe(4); expect(transitionEffect(3,2)).toBe('lift'); });
  it('keeps navigation within five slides', () => { expect(slideIndex(5)).toBe(4); expect(slideIndex(6)).toBe(0); expect(slideIndex(-1)).toBe(0); });
  it('authorizes RFID without triggering an alarm', () => { expect(scenarioState('authorized')).toMatchObject({ authorized: true, buzzer: false, notification: null }); });
  it('triggers movement, buzzer and a simulated notification', () => { expect(scenarioState('movement')).toMatchObject({ movement: true, tamper: false, buzzer: true, notification: 'Unauthorized movement detected' }); });
  it('triggers tamper, buzzer and a simulated notification', () => { expect(scenarioState('tamper')).toMatchObject({ movement: false, tamper: true, buzzer: true, notification: 'Chain or zipper tampering detected' }); });
  it('resets all sensor and alarm states', () => { expect(scenarioState('idle')).toEqual({ authorized: false, movement: false, tamper: false, buzzer: false, notification: null, status: 'System ready' }); });
});