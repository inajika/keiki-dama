/**
 * 全ページ共通のヘッダー。アプリ名のみを表示する。
 * ページ見出し (h1) は各ページ側が持つため、ここでは見出し要素を使わない。
 */
export function SiteHeader() {
  return (
    <header class="border-b border-line bg-surface pt-[env(safe-area-inset-top)]">
      <div class="mx-auto flex h-12 max-w-[480px] items-center px-4">
        <a href="/" class="text-lg font-black tracking-wide text-ink">
          景気玉
        </a>
      </div>
    </header>
  );
}
