export type CellType = 'miss' | 'hit' | 'jackpot';

export const CELLS = 10;
export const BASE_HITS = 1;
export const MAX_HITS = 6;
export const HIT_BONUS = 500;
export const JACKPOT_BONUS = 1000;
export const JACKPOT_MIN_HITS = 4;

export const INDICATORS = [
  { id: 'cpi', name: '物価', cond: '消費者物価指数が前年比+2%超' },
  { id: 'wage', name: '実質賃金', cond: '前年比でプラス' },
  { id: 'shunto', name: '春闘', cond: '賃上げ率が物価上昇率を上回る' },
  { id: 'mood', name: '消費者態度指数', cond: '前年より改善' },
  { id: 'stock', name: '日経平均', cond: '年間でプラス' },
  { id: 'bonus', name: '冬のボーナス', cond: '前年より増加' },
] as const;

export const AGES = [
  { label: '未就学', base: 1000 },
  { label: '小学校低学年', base: 2000 },
  { label: '小学校高学年', base: 3000 },
  { label: '中学生', base: 5000 },
  { label: '高校生', base: 5000 },
  { label: '大学生', base: 10000 },
] as const;

/** ○の指標数から当たり枠の数を求める */
export function countHits(onCount: number): number {
  return Math.min(BASE_HITS + onCount, MAX_HITS);
}

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
