import { type PublicPath } from 'wxt/browser';

interface NutrientLevelProps {
  nutrient: string;
  level: string;
}

const COLOR: Record<string, string> = {
  low: 'bg-green-500',
  moderate: 'bg-yellow-500',
  high: 'bg-red-500',
  unknown: 'bg-gray-300',
};

const WIDTH: Record<string, string> = {
  low: 'w-1/4',
  moderate: 'w-1/2',
  high: 'w-3/4',
  unknown: 'w-[12.5%]',
};

const NutrientLabel: Record<string, string> = {
  fat: 'Fat',
  sugar: 'Sugar',
  salt: 'Sodium',
  saturated_fat: 'Saturated Fat',
};
const NutrientLevel = ({ nutrient, level }: NutrientLevelProps) => {
  const NutrientIcon = browser.runtime.getURL(
    `/score/nutrient-levels/${nutrient}/${level}.svg` as PublicPath
  );
  return (
    <>
      <div class="flex min-w-0 items-start gap-2 bg-gray-50 rounded-lg p-2.5">
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between gap-1">
            <div class="flex items-center gap-1.5">
              <img src={NutrientIcon} class="h-4 w-4 shrink-0" alt={`${nutrient}-${level} icon`} />
              <span class="truncate text-md font-medium text-gray-700">
                {NutrientLabel[nutrient]}
              </span>
            </div>
            <span class="text-sm font-normal whitespace-nowrap text-gray-500">
              {level.replace(/^./, (str) => str.toUpperCase())}
            </span>
          </div>
          <div class="mt-1.5 h-1 w-full rounded-full bg-gray-200">
            <div class={`h-full rounded-full ${COLOR[level]} ${WIDTH[level]}`} />
          </div>
        </div>
      </div>
    </>
  );
};

export default NutrientLevel;
