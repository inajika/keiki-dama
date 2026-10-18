/** マスの種別 (ハズレ / 当たり / 大当たり) */
export type CellType = 'miss' | 'hit' | 'jackpot';

/** ルーレットのマス数 */
export const CELLS = 10;
/** 1マスあたりの角度 */
export const SEGMENT_DEG = 360 / CELLS;
export const BASE_HITS = 1;
export const HIT_BONUS = 500;
export const JACKPOT_BONUS = 1000;
export const JACKPOT_MIN_HITS = 4;

/** ルーレットの進行状態 */
export type Result = { kind: 'idle' } | { kind: 'spinning' } | { kind: 'done'; index: number };

export const AGES = [
  { label: '未就学', base: 1000 },
  { label: '小学校低学年', base: 2000 },
  { label: '小学校高学年', base: 3000 },
  { label: '中学生', base: 5000 },
  { label: '高校生', base: 5000 },
  { label: '大学生', base: 10000 },
] as const;

/** hits 個の当たりを均等に散らし、hits が JACKPOT_MIN_HITS 以上なら最初の1つを大当たりにする */
export function buildCells(hits: number): CellType[] {
  const cells: CellType[] = Array.from({ length: CELLS }, () => 'miss');
  for (let k = 0; k < hits; k++) {
    const pos = Math.floor((k * CELLS) / hits);
    cells[pos] = k === 0 && hits >= JACKPOT_MIN_HITS ? 'jackpot' : 'hit';
  }
  return cells;
}

export function bonusOf(type: CellType): number {
  if (type === 'jackpot') return JACKPOT_BONUS;
  if (type === 'hit') return HIT_BONUS;
  return 0;
}

export function expectedBonus(cells: CellType[]): number {
  return cells.reduce((sum, type) => sum + bonusOf(type), 0) / cells.length;
}

/** 指針(上)が targetDeg の位置で止まるために、現在角度 currentRotation から追加で回す角度を求める */
export function calcRotationDelta(currentRotation: number, targetDeg: number, turns: number): number {
  const current = ((currentRotation % 360) + 360) % 360;
  const need = ((((360 - targetDeg) % 360) - current) % 360) + 360;
  return turns * 360 + (need % 360);
}

/** 金額を「1,000円」形式に整形する */
export function yen(n: number): string {
  return `${n.toLocaleString('ja-JP')}円`;
}

/** シミュレーション結果 */
export type SimulationSummary = { runs: number; averageBonus: number; hitRate: number; jackpotRate: number };

/**
 * ルーレットを runs 回まわしたときの平均上乗せ額と当たり率を集計する
 * @param random 0以上1未満の乱数を返す関数。テストで差し替えられるよう注入する
 */
export function simulate(cells: CellType[], runs: number, random: () => number = Math.random): SimulationSummary {
  let total = 0;
  let hitCount = 0;
  let jackpotCount = 0;
  for (let i = 0; i < runs; i++) {
    const type = cells[Math.floor(random() * cells.length)];
    total += bonusOf(type);
    if (type !== 'miss') hitCount++;
    if (type === 'jackpot') jackpotCount++;
  }
  return { runs, averageBonus: total / runs, hitRate: hitCount / runs, jackpotRate: jackpotCount / runs };
}

/** シミュレーション結果を画面表示用の文字列にする */
export function formatSimulation(summary: SimulationSummary): string {
  return (
    `${summary.runs.toLocaleString('ja-JP')}回の平均:上乗せ +${summary.averageBonus.toFixed(0)}円` +
    ` ・ 当たり ${(summary.hitRate * 100).toFixed(1)}% ・ 大当たり ${(summary.jackpotRate * 100).toFixed(1)}%`
  );
}
