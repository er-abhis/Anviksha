/**
 * Last line of defence for JavaScript errors the React ErrorBoundary can't see:
 * errors thrown in event handlers, timers, and un-awaited promises. Render-phase
 * errors are handled by <ErrorBoundary>; this covers the async surface.
 *
 * Policy: log everything. Swallow NON-fatal errors so a stray async throw can't
 * take the whole app down (important for Play review stability). FATAL errors
 * are passed to the platform's default handler — those aren't safely
 * recoverable, and hiding them would only mask real bugs.
 */
type RNErrorUtils = {
  getGlobalHandler?: () => (error: unknown, isFatal?: boolean) => void;
  setGlobalHandler: (handler: (error: unknown, isFatal?: boolean) => void) => void;
};

export const installGlobalErrorHandler = (): void => {
  const eu: RNErrorUtils | undefined = (globalThis as { ErrorUtils?: RNErrorUtils }).ErrorUtils;
  if (!eu?.setGlobalHandler) return;

  const previous = eu.getGlobalHandler?.();

  eu.setGlobalHandler((error, isFatal) => {
    // eslint-disable-next-line no-console
    console.error('Global JS error', isFatal ? '(fatal)' : '(non-fatal)', error);
    if (isFatal && previous) previous(error, isFatal);
  });
};
