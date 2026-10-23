const base = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };

export const IconHome = () => (
  <svg {...base}><path d="M3 13 14 3l11 10M6 11v13h6v-7h4v7h6V11" /></svg>
);
export const IconUsers = () => (
  <svg {...base}><circle cx="13" cy="9" r="4.5" /><path d="M4 24c0-5 4-8 9-8s9 3 9 8M19 5c3 0 5 2 5 4.5" /></svg>
);
export const IconBars = () => (
  <svg {...base}><path d="M5 25V16h5v9M10 25V10h5v15M15 25V4h5v21M3 25h18" /></svg>
);
export const IconEye = ({ off }) => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M2 17s5-9 15-9 15 9 15 9-5 9-15 9S2 17 2 17Z" />
    <circle cx="17" cy="17" r="4" />
    {off && <path d="M5 29 29 5" />}
  </svg>
);
export const IconChevron = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="m3 6 6 6 6-6" />
  </svg>
);
