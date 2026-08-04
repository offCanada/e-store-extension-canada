import { ExternalLink, Image, Scale, ScanBarcode, SearchAlert, X } from 'lucide-preact';
import { type PublicPath } from 'wxt/browser';

import { type Product } from '../types/Product';

import NutrientLevel from './ui/NutrientLevel';
import ScoreCard from './ui/ScoreCard';

interface ProductInfoModalProps {
  product: Product;
  close: () => void;
}

const ProductInfoModal = ({ product, close }: ProductInfoModalProps) => {
  const OFFDarkLogo = browser.runtime.getURL('/logos/off-logo-dark.svg' as PublicPath);

  return (
    <>
      <div class="overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm">
        {/* ── Header ── */}
        <div class="flex cursor-pointer items-center justify-between border-b border-gray-100 bg-gray-50 px-3.5 py-2.5">
          <div class="flex h-8 w-32 shrink-0 items-center">
            <img alt="Open Food Facts Logo" src={OFFDarkLogo} class="h-full w-auto" />
          </div>

          <div class="flex items-center gap-2">
            <button class="cursor-pointer btn btn-ghost btn-sm" onClick={close}>
              <X />
            </button>
          </div>
        </div>

        <div>
          <div class="p-1">
            {/* Search warning banner */}
            {product.showSearchWarning && (
              <div class="mx-3 mt-2 flex items-end gap-2 rounded-lg border border-amber-200 bg-amber-50 px-2 py-2">
                <SearchAlert size={14} class="text-amber-500" />
                <div class="flex-1 min-w-0">
                  <p class="text-md font-medium text-amber-700 leading-tight">
                    We couldn't find exact match, instead showing similar match
                  </p>
                </div>
              </div>
            )}

            {/* ── Product header ── */}
            <div class="flex items-start gap-3.5 px-4 py-3.5">
              <div class="shrink-0 size-18 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={`${product.name}`}
                    class="size-full object-contain p-1"
                  />
                ) : (
                  <div class="size-full flex items-center justify-center text-gray-300">
                    <Image size={18} />
                  </div>
                )}
              </div>

              <div class="flex-1 min-w-0">
                <div class="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
                  {product.brand ?? 'Unknown'}
                </div>

                <div class="text-xl font-semibold text-gray-900 leading-snug line-clamp-2 mb-1.5">
                  {product.name ?? 'Unknown'}
                </div>
                <div className="flex items-center gap-2">
                  {product.code && (
                    <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      <ScanBarcode className="text-gray-400" size={16} />
                      <span class="text-sm font-mono text-gray-500 tracking-wide">
                        {product.code}
                      </span>
                    </div>
                  )}
                  {product.quantity && (
                    <div class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                      <Scale className="text-gray-400" size={16} />
                      <span class="text-sm text-gray-500">
                        {Number(product.quantity).toFixed(2)} {product.quantityUnit ?? ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── Score badges ── */}
            <div class="grid grid-cols-3 gap-2 px-3 py-2">
              <ScoreCard scoreType="nutri-score" grade={product.nutriscoreGrade ?? 'unknown'} />
              <ScoreCard
                scoreType="nova-group"
                grade={product.novaGroup?.toString() ?? 'unknown'}
              />
              <ScoreCard scoreType="green-score" grade={product.ecoscoreGrade ?? 'unknown'} />
            </div>
            {/* handle not-applicable values */}

            {/* ── Nutrient rows ── */}
            <div class="grid grid-cols-2 gap-2 px-3 py-2">
              {Object.entries(product.nutrients ?? []).map(
                ([nutrient, level]: [string, string]) => (
                  <NutrientLevel key={nutrient} nutrient={nutrient} level={level} />
                )
              )}
            </div>
          </div>

          {/* ── Footer ── */}
          <div class="border-t border-gray-100 bg-gray-50 py-2 text-center">
            <a
              href={`https://world.openfoodfacts.org/product/${product.code}`}
              target="_blank"
              rel="noopener noreferrer"
              class="text-md font-medium text-blue-600 no-underline hover:text-blue-800"
            >
              <div className="flex justify-center gap-2 items-center">
                View on Open Food Facts <ExternalLink size={14} />
              </div>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductInfoModal;
