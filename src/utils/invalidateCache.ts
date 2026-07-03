export function invalidateCache() {
  void browser.runtime.sendMessage({
    type: 'INVALIDATE_CACHE',
    payload: null,
  });
}
