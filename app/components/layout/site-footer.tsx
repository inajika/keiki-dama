const GITHUB_URL = 'https://github.com/inajika/keiki-dama';

/**
 * 全ページ共通のフッター。コピーライトと GitHub リポジトリへのリンクを表示する。
 * 年は SSR のたびに変わらないよう固定値にしている。
 */
export function SiteFooter() {
  return (
    <footer class="border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
      <div class="mx-auto flex max-w-[480px] items-center justify-between px-4 py-4 text-xs text-muted">
        <small>&copy; 2026 inajika</small>
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" class="underline">
          GitHub
        </a>
      </div>
    </footer>
  );
}
