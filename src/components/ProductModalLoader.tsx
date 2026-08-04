import { X } from 'lucide-preact';
import { type PublicPath } from 'wxt/browser';

const ProductModalLoader = ({ close }: { close: () => void }) => {
  const OFFDarkLogo = browser.runtime.getURL('/logos/off-logo-dark.svg' as PublicPath);
  return (
    <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div class="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-50 px-3.5 py-2.5">
        <div class="flex h-5 w-28 shrink-0 items-center">
          <img alt="Open Food Facts Logo" src={OFFDarkLogo} class="h-full w-auto" />
        </div>

        <div class="flex items-center gap-2">
          <button class="cursor-pointer btn btn-ghost btn-sm" onClick={close}>
            <X />
          </button>
        </div>
      </div>

      <div class="p-4 space-y-4">
        {/* Product header skeleton */}
        <div class="flex items-start gap-3.5">
          <div class="shrink-0 size-18 rounded-xl bg-gray-100 animate-pulse" />
          <div class="flex-1 space-y-2 pt-1">
            <div class="h-3 w-16 rounded-full bg-gray-100 animate-pulse" />
            <div class="h-4 w-full rounded-full bg-gray-100 animate-pulse" />
            <div class="h-4 w-3/4 rounded-full bg-gray-100 animate-pulse" />
            <div class="h-5 w-24 rounded-full bg-gray-100 animate-pulse" />
          </div>
        </div>

        {/* Score badges skeleton */}
        <div class="grid grid-cols-3 gap-2">
          {[0, 1, 2].map(() => (
            <div class="rounded-lg border border-gray-100 bg-gray-50 p-2.5 space-y-2">
              <div class="h-10 w-full rounded-lg bg-gray-100 animate-pulse" />
              <div class="h-2.5 w-2/3 rounded-full bg-gray-100 animate-pulse" />
              <div class="h-2 w-full rounded-full bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Nutrient rows skeleton */}
        <div class="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map(() => (
            <div class="rounded-lg bg-gray-50 p-2.5 space-y-2">
              <div class="flex justify-between">
                <div class="h-2.5 w-16 rounded-full bg-gray-100 animate-pulse" />
                <div class="h-2.5 w-10 rounded-full bg-gray-100 animate-pulse" />
              </div>
              <div class="h-1 w-full rounded-full bg-gray-100 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductModalLoader;
