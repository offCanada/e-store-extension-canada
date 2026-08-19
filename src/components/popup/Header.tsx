import { type PublicPath } from 'wxt/browser';

const Header = () => {
  const OFFLogoIcon = browser.runtime.getURL('/logos/off-icon.svg' as PublicPath);
  const OFFLogoDark = browser.runtime.getURL('/logos/off-logo-dark.svg' as PublicPath);
  return (
    <header class="flex items-center justify-between py-3 w-full">
      <div class="flex items-center gap-1">
        <div class="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shink-0">
          <img src={OFFLogoIcon} className="w-full h-6 object-contain" alt="OFF Icon" />
        </div>
        <div>
          <p class="text-lg font-semibold text-amber-500 leading-tight">NutriLens</p>
          <p class="text-xs text-gray-500 leading-tight">Your Health Lens</p>
        </div>
      </div>
      <img src={OFFLogoDark} className="w-auto h-5 object-contain" alt="OFF Logo" />
    </header>
  );
};

export default Header;
