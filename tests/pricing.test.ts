import { describe, expect, it } from 'bun:test';
import { calculatePrice } from '../src/lib/pricing';

describe('deterministic pricing engine', () => {
  it('TEST 1 — small car, full detail, normal condition, drop-off = K650', () => {
    const r = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'light',
      addOnIds: [], serviceMode: 'dropoff',
    });
    expect(r.total).toBe(650);
    expect(r.transport).toBe(0);
  });

  it('TEST 2 — heavy condition + seat removal, drop-off = K1,060', () => {
    const r = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'heavy',
      addOnIds: ['seat-removal'], serviceMode: 'dropoff',
    });
    expect(r.adjustedBase).toBe(910);
    expect(r.conditionAdjustment).toBe(260);
    expect(r.total).toBe(1060);
  });

  it('TEST 3 — heavy + seat removal + mobile to Ibex Hill = K1,310', () => {
    const r = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'heavy',
      addOnIds: ['seat-removal'], serviceMode: 'mobile', transportZoneId: 'zone-3',
    });
    expect(r.transport).toBe(250);
    expect(r.total).toBe(1310);
  });

  it('TEST 4 — moderate condition, mobile = K1,030', () => {
    const r = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'moderate',
      addOnIds: [], serviceMode: 'mobile', transportZoneId: 'zone-3',
    });
    expect(r.adjustedBase).toBe(780);
    expect(r.total).toBe(1030);
  });

  it('TEST 5 — switching to Kabulonga then drop-off removes transport', () => {
    const mobileFar = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'heavy',
      addOnIds: ['seat-removal'], serviceMode: 'mobile', transportZoneId: 'zone-3',
    });
    const mobileNear = calculatePrice({ ...{
      serviceId: 'car-full', sizeId: 'small', conditionId: 'heavy',
      addOnIds: ['seat-removal'], serviceMode: 'mobile' as const, transportZoneId: 'zone-1',
    } });
    const dropoff = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'heavy',
      addOnIds: ['seat-removal'], serviceMode: 'dropoff',
    });
    expect(mobileFar.transport).toBe(250);
    expect(mobileNear.transport).toBe(120);
    expect(dropoff.transport).toBe(0);
    expect(dropoff.total).toBe(1060);
  });

  it('never applies the multiplier to add-ons or transport', () => {
    const r = calculatePrice({
      serviceId: 'car-full', sizeId: 'small', conditionId: 'heavy',
      addOnIds: ['seat-removal'], serviceMode: 'mobile', transportZoneId: 'zone-3',
    });
    expect(r.total).not.toBe(Math.round((650 + 150 + 250) * 1.4));
  });
});
