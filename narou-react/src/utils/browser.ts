/**
 * Check if the current browser is Safari on iPhone
 * @returns true if the browser is Safari on iPhone, false otherwise
 */
export function isIPhoneSafari(): boolean {
  const ua = navigator.userAgent;
  const isIPhone = ua.includes('iPhone');
  // Safari has "Safari" in UA, but Chrome/CriOS/FxiOS do not
  const isSafari = ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('CriOS') && !ua.includes('FxiOS');
  return isIPhone && isSafari;
}
