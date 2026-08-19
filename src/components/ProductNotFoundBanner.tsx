import { SearchAlert, X } from 'lucide-preact';
import { type PublicPath } from 'wxt/browser';

const ProductNotFoundBanner = ({ close }: { close: () => void }) => {
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

      {/* Body */}
      <div class="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
        <div class="flex size-12 items-center justify-center rounded-full bg-gray-100">
          <SearchAlert size={24} class="text-gray-400" />
        </div>
        <div>
          <p class="text-md font-semibold text-gray-700">No match found</p>
          <p class="mt-1 text-sm text-gray-400 leading-relaxed">
            This product isn't in our database yet.
          </p>
        </div>
        {/* <a
          href="https://world.openfoodfacts.org/contribute"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-1 text-sm font-medium text-blue-600 no-underline hover:text-blue-800"
        >
          <div className="flex justify-center gap-2">
            Add to Open Food Facts <ExternalLink size={12} />
          </div>
        </a> */}
      </div>
    </div>
  );
};

export default ProductNotFoundBanner;
