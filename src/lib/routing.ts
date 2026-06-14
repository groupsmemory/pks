export interface RoutingDetails {
  assigned_to: string;
  staff_phone: string;
}

export const ROUTING_MAP: Record<string, RoutingDetails> = {
  Pamekasan:  { assigned_to: 'Staf Ahli Suryono (Dapil 1)',          staff_phone: '6281111111111' },
  Tlanakan:   { assigned_to: 'Staf Ahli Suryono (Dapil 1)',          staff_phone: '6281111111111' },
  Proppo:     { assigned_to: 'Staf Ahli H. Imam Ghozali (Dapil 2)',  staff_phone: '6282222222222' },
  Palengaan:  { assigned_to: 'Staf Ahli H. Imam Ghozali (Dapil 2)',  staff_phone: '6282222222222' },
  Batumarmar: { assigned_to: 'Staf Ahli Juma\'ah (Dapil 3)',        staff_phone: '6283333333333' },
  Pasean:     { assigned_to: 'Staf Ahli Juma\'ah (Dapil 3)',        staff_phone: '6283333333333' },
  Waru:       { assigned_to: 'Staf Ahli Juma\'ah (Dapil 3)',        staff_phone: '6283333333333' },
  Galis:      { assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)',     staff_phone: '6285555555555' },
  Larangan:   { assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)',     staff_phone: '6285555555555' },
  Pademawu:   { assigned_to: 'Staf Ahli Ita Kusmita (Dapil 5)',     staff_phone: '6285555555555' },
};

export const DEFAULT_ROUTING: RoutingDetails = {
  assigned_to: 'Humas DPD PKS Pamekasan (Default)',
  staff_phone: '6284444444444',
};

export function determineRoutingDetails(kecamatan: string): RoutingDetails {
  return ROUTING_MAP[kecamatan] ?? DEFAULT_ROUTING;
}
