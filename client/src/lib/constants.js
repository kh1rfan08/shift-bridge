export const REACTIONS = [
  { type: 'got_it', emoji: '\u{1F64B}', label: "I got it" },
  { type: 'need_it', emoji: '\u{1F64F}', label: 'Need this' },
  { type: 'thanks', emoji: '\u{1F49C}', label: 'Thanks' },
  { type: 'oof', emoji: '\u{1F62E}\u200D\u{1F4A8}', label: 'Oof' },
];

export const TIME_PRESETS = [
  { label: '7a-3p', start: '07:00', end: '15:00' },
  { label: '3p-11p', start: '15:00', end: '23:00' },
  { label: '11p-7a', start: '23:00', end: '07:00' },
  { label: '7a-7p', start: '07:00', end: '19:00' },
  { label: '7p-7a', start: '19:00', end: '07:00' },
];

export const UNITS = ['ICU', 'ER', 'Med-Surg', 'L&D', 'NICU', 'Tele', 'OR', 'PACU', 'Psych', 'Float'];

export const SHIFT_STATUS = {
  open: { label: 'Open', color: 'text-pit-gold' },
  claimed: { label: 'Claimed', color: 'text-pit-green' },
  closed: { label: 'Closed', color: 'text-gray-500' },
};
