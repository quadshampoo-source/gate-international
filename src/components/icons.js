export const ShieldIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" {...props}>
    <path d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z" />
  </svg>
);
export const AwardIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" {...props}>
    <circle cx="12" cy="9" r="6" />
    <path d="M9 14l-2 7 5-3 5 3-2-7" />
  </svg>
);
export const GlobeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />
  </svg>
);
export const KeyIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16" {...props}>
    <circle cx="8" cy="12" r="4" />
    <path d="M12 12h10M18 12v4M22 12v2" />
  </svg>
);
export const PlayIcon = (props) => (
  <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
);
export const WhatsappIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.5 14.4c-.3-.15-1.8-.9-2.1-1s-.5-.15-.7.15-.8 1-.95 1.2-.35.2-.65.07c-.3-.15-1.25-.46-2.4-1.47-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.45.13-.6.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5-.17 0-.37-.02-.57-.02s-.52.07-.8.37c-.27.3-1.05 1.02-1.05 2.5 0 1.48 1.08 2.9 1.23 3.1.15.2 2.1 3.2 5.08 4.5.71.3 1.27.49 1.7.62.71.22 1.36.19 1.87.12.57-.09 1.8-.73 2.06-1.45.25-.72.25-1.33.17-1.45-.07-.13-.27-.2-.57-.35zM12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2z" />
  </svg>
);
export const WechatIcon = (props) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M9.5 4C5.36 4 2 6.7 2 10.1c0 1.8.93 3.4 2.4 4.6l-.6 1.8 2.2-1.1c.8.2 1.6.3 2.5.3h.5c-.1-.4-.2-.9-.2-1.4 0-3.3 3.1-6 7-6h.4C16 6.1 13 4 9.5 4zM7 8.5a.9.9 0 110 1.8.9.9 0 010-1.8zm5 0a.9.9 0 110 1.8.9.9 0 010-1.8zM22 15.3c0-2.8-2.7-5.1-6-5.1s-6 2.3-6 5.1 2.7 5.1 6 5.1c.7 0 1.3-.1 1.9-.3l1.8.9-.5-1.5c1.7-.9 2.8-2.5 2.8-4.2zm-8-.9a.7.7 0 110 1.4.7.7 0 010-1.4zm4 0a.7.7 0 110 1.4.7.7 0 010-1.4z" />
  </svg>
);
export const MailIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="3" y="5" width="18" height="14" rx="1" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
export const PhoneIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M5 4h4l2 5-2.5 1.5c1 2.5 3 4.5 5.5 5.5L15.5 13.5l5 2V20c0 .5-.5 1-1 1-8.8 0-16-7.2-16-16 0-.5.5-1 1-1z" />
  </svg>
);
export const CheckIcon = (props) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M5 12l5 5 9-11" />
  </svg>
);

export const FakeQR = () => {
  const cells = [];
  const seed = 17;
  for (let y = 0; y < 21; y++) {
    for (let x = 0; x < 21; x++) {
      const on = ((x * 7 + y * 13 + seed) * 31) % 5 < 2;
      const isFinder = (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
      if (isFinder) {
        const edge =
          x < 7 && y < 7
            ? x === 0 || y === 0 || x === 6 || y === 6
            : x > 13 && y < 7
            ? x === 14 || y === 0 || x === 20 || y === 6
            : x === 0 || y === 14 || x === 6 || y === 20;
        const inner =
          x < 7 && y < 7
            ? x >= 2 && y >= 2 && x <= 4 && y <= 4
            : x > 13 && y < 7
            ? x >= 16 && y >= 2 && x <= 18 && y <= 4
            : x >= 2 && y >= 16 && x <= 4 && y <= 18;
        if (edge || inner) cells.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill="#000" />);
        continue;
      }
      if (on) cells.push(<rect key={`${x},${y}`} x={x} y={y} width="1" height="1" fill="#000" />);
    }
  }
  return (
    <svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      {cells}
    </svg>
  );
};
