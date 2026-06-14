import { describe, expect, it } from 'vitest';
import {
  determineRoutingDetails,
  ROUTING_MAP,
  DEFAULT_ROUTING,
} from '@/src/lib/routing';

describe('determineRoutingDetails', () => {
  it('should return correct routing for Pamekasan', () => {
    const result = determineRoutingDetails('Pamekasan');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli Suryono (Dapil 1)',
      staff_phone: '6281111111111',
    });
  });

  it('should return correct routing for Tlanakan', () => {
    const result = determineRoutingDetails('Tlanakan');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli Suryono (Dapil 1)',
      staff_phone: '6281111111111',
    });
  });

  it('should return correct routing for Proppo', () => {
    const result = determineRoutingDetails('Proppo');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli H. Imam Ghozali (Dapil 2)',
      staff_phone: '6282222222222',
    });
  });

  it('should return correct routing for Palengaan', () => {
    const result = determineRoutingDetails('Palengaan');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli H. Imam Ghozali (Dapil 2)',
      staff_phone: '6282222222222',
    });
  });

  it('should return correct routing for Batumarmar', () => {
    const result = determineRoutingDetails('Batumarmar');
    expect(result).toEqual({
      assigned_to: "Staf Ahli Juma'ah (Dapil 3)",
      staff_phone: '6283333333333',
    });
  });

  it('should return correct routing for Pasean', () => {
    const result = determineRoutingDetails('Pasean');
    expect(result).toEqual({
      assigned_to: "Staf Ahli Juma'ah (Dapil 3)",
      staff_phone: '6283333333333',
    });
  });

  it('should return correct routing for Waru', () => {
    const result = determineRoutingDetails('Waru');
    expect(result).toEqual({
      assigned_to: "Staf Ahli Juma'ah (Dapil 3)",
      staff_phone: '6283333333333',
    });
  });

  it('should return correct routing for Galis', () => {
    const result = determineRoutingDetails('Galis');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)',
      staff_phone: '6285555555555',
    });
  });

  it('should return correct routing for Larangan', () => {
    const result = determineRoutingDetails('Larangan');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)',
      staff_phone: '6285555555555',
    });
  });

  it('should return correct routing for Pademawu', () => {
    const result = determineRoutingDetails('Pademawu');
    expect(result).toEqual({
      assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)',
      staff_phone: '6285555555555',
    });
  });

  it('should return default routing for Kadur (unmapped)', () => {
    const result = determineRoutingDetails('Kadur');
    expect(result).toEqual(DEFAULT_ROUTING);
  });

  it('should return default routing for Pakong (unmapped)', () => {
    const result = determineRoutingDetails('Pakong');
    expect(result).toEqual(DEFAULT_ROUTING);
  });

  it('should return default routing for Pegantenan (unmapped)', () => {
    const result = determineRoutingDetails('Pegantenan');
    expect(result).toEqual(DEFAULT_ROUTING);
  });

  it('should return default routing for unknown kecamatan', () => {
    const result = determineRoutingDetails('TidakAda');
    expect(result).toEqual(DEFAULT_ROUTING);
  });

  it('should have all 13 kecamatan accounted for in ROUTING_MAP or fallback', () => {
    const allKecamatan = [
      'Batumarmar', 'Galis', 'Kadur', 'Larangan', 'Pademawu',
      'Pakong', 'Palengaan', 'Pamekasan', 'Pasean', 'Pegantenan',
      'Proppo', 'Tlanakan', 'Waru',
    ];

    for (const k of allKecamatan) {
      const result = determineRoutingDetails(k);
      expect(result.assigned_to).toBeTruthy();
      expect(result.staff_phone).toBeTruthy();
    }
  });
});
