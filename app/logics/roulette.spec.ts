import { describe, expect, it } from 'vitest';
import { buildCells, CELLS, calcRotationDelta, countHits, expectedBonus, MAX_HITS } from './roulette';

describe('countHits', () => {
  it('指標が全て×でも基本の1枠', () => {
    expect(countHits(0)).toBe(1);
  });
  it('○1つにつき+1枠', () => {
    expect(countHits(3)).toBe(4);
  });
  it('上限を超えない', () => {
    expect(countHits(6)).toBe(MAX_HITS);
  });
});

describe('buildCells', () => {
  it('マス数は常に CELLS', () => {
    expect(buildCells(3)).toHaveLength(CELLS);
  });
  it('当たり枠が3以下なら大当たりなし', () => {
    expect(buildCells(3).filter((c) => c === 'hit')).toHaveLength(3);
    expect(buildCells(3)).not.toContain('jackpot');
  });
  it('当たり枠が4以上なら先頭が大当たりで合計は枠数と一致', () => {
    const cells = buildCells(4);
    expect(cells[0]).toBe('jackpot');
    expect(cells.filter((c) => c !== 'miss')).toHaveLength(4);
  });
  it('当たりは均等に散らされる', () => {
    expect(buildCells(2)).toEqual(['hit', 'miss', 'miss', 'miss', 'miss', 'hit', 'miss', 'miss', 'miss', 'miss']);
  });
});

describe('expectedBonus', () => {
  it('当たり1枠なら 500/10 = 50', () => {
    expect(expectedBonus(buildCells(1))).toBe(50);
  });
  it('当たり4枠 (大当たり1 + 当たり3) なら (1000 + 1500)/10 = 250', () => {
    expect(expectedBonus(buildCells(4))).toBe(250);
  });
});

describe('calcRotationDelta', () => {
  it('回転後の角度で target が指針(0度)に来る', () => {
    const current = 130;
    const target = 75;
    const next = current + calcRotationDelta(current, target, 5);
    expect((((next + target) % 360) + 360) % 360).toBeCloseTo(0);
  });
  it('turns 分の回転が加算される', () => {
    expect(calcRotationDelta(0, 0, 5)).toBe(1800);
  });
});
