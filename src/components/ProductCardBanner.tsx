import { SearchAlert } from 'lucide-preact';
import { type PublicPath } from 'wxt/browser';

import { type Product } from '../types/Product';

import ScoreBadge from './ui/ScoreBadge';

interface Props {
  product: Product | null;
  loading: boolean;
  notFound: boolean;
  onClick: () => void;
}

const ProductCardBanner = ({ product, loading, notFound, onClick }: Props) => {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick?.();
  };

  const OFFLogoIcon = browser.runtime.getURL('/logos/off-icon.svg' as PublicPath);
  return (
    <div
      onClick={handleClick}
      class="mb-2 overflow-hidden rounded-xl border border-gray-200 bg-white text-base shadow-sm w-fit cursor-pointer transition-colors duration-150 hover:border-blue-200 hover:shadow-blue-50"
    >
      {/* Header */}
      <div class="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-2 py-1 gap-2">
        <div class="flex items-center gap-1.5">
          <img alt="OFF Logo" src={OFFLogoIcon} class="size-4 shrink-0" />
          <span class="text-sm font-bold text-gray-600 tracking-wide">NutriLens</span>
        </div>
        <div class="flex items-center gap-1.5">
          {product?.showSearchWarning && (
            <span title="We couldn't find exact match, instead showing similar match">
              <SearchAlert size={14} class="text-amber-500" />
            </span>
          )}
        </div>
      </div>

      <div class="flex items-center gap-1.5 px-2 py-1.5 overflow-x-scroll no-scrollbar">
        {loading && (
          <>
            <div class="flex items-center gap-1.5">
              <div class="h-8 w-10 rounded bg-gray-200 animate-pulse" />
              <div class="h-8 w-10 rounded bg-gray-200 animate-pulse" />
              <div class="h-8 w-10 rounded bg-gray-200 animate-pulse" />
            </div>
          </>
        )}

        {!loading && notFound && (
          <>
            <ScoreBadge classNames="h-8 w-auto" scoreType="nutri-score" scoreValue={'unknown'} />
            <ScoreBadge classNames="h-8 w-auto" scoreType="green-score" scoreValue={'unknown'} />
            <ScoreBadge classNames="h-8 w-auto" scoreType="nova-group" scoreValue={'unknown'} />
          </>
        )}

        {!loading && !notFound && (
          <>
            <ScoreBadge
              classNames="h-8 w-auto"
              scoreType="nutri-score"
              scoreValue={product?.nutriscoreGrade ?? 'unknown'}
            />
            <ScoreBadge
              classNames="h-8 w-auto"
              scoreType="green-score"
              scoreValue={product?.ecoscoreGrade ?? 'unknown'}
            />
            <ScoreBadge
              classNames="h-8 w-auto"
              scoreType="nova-group"
              scoreValue={product?.novaGroup ?? 'unknown'}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ProductCardBanner;
