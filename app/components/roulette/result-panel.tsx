import { bonusOf, type CellType, type Result, yen } from '@/logics/roulette';

type ResultPanelProps = {
  result: Result;
  cells: CellType[];
  /** 選択中の年齢の基本額 (円) */
  base: number;
};

/** ルーレットの進行状況と結果(上乗せ額)を表示するパネル */
export function ResultPanel(props: ResultPanelProps) {
  const { result, cells, base } = props;
  let border = 'border-line';
  let main = '指標を選んで、回してみましょう';
  let sub = '当たり枠は上の数字のとおりです';

  if (result.kind === 'ready') {
    main = '準備OK';
    sub = '当たり枠が変わりました。回してみましょう';
  } else if (result.kind === 'spinning') {
    main = 'まわっています…';
    // 空文字だと行が潰れてパネルの高さが変わるため、空白で高さを保つ
    sub = ' ';
  } else if (result.kind === 'done') {
    const type = cells[result.index];
    const bonus = bonusOf(type);
    if (type === 'miss') {
      main = `据え置き ${yen(base)}`;
      sub = '今回は上乗せなし。来年の景気に期待しましょう';
    } else {
      border = type === 'jackpot' ? 'border-gold' : 'border-accent';
      main = `${type === 'jackpot' ? '大当たり! ' : '当たり! '}+${yen(bonus)}`;
      sub = `${yen(base)} → ${yen(base + bonus)}`;
    }
  }

  return (
    <div
      class={`mx-auto mt-[18px] min-h-[92px] max-w-[360px] rounded-[18px] border-2 bg-surface px-4 py-3.5 text-center ${border}`}
      aria-live="polite"
    >
      <p class="m-0 text-[1.375rem] font-black">{main}</p>
      <p class="mt-0.5 mb-0 text-sm text-muted">{sub}</p>
    </div>
  );
}
