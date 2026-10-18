import { describe, expect, it } from 'vitest';
import {
  buildCells,
  CELLS,
  calcRotationDelta,
  clampHits,
  expectedBonus,
  formatSimulation,
  MAX_HITS,
  MIN_HITS,
  simulate,
  yen,
} from './roulette';

describe('clampHits', () => {
  it('範囲内はそのまま', () => {
    expect(clampHits(4)).toBe(4);
  });
  it('下限未満は MIN_HITS', () => {
    expect(clampHits(0)).toBe(MIN_HITS);
  });
  it('上限超は MAX_HITS', () => {
    expect(clampHits(10)).toBe(MAX_HITS);
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

describe('yen', () => {
  it('3桁区切りで「円」を付ける', () => {
    expect(yen(10000)).toBe('10,000円');
  });
});

describe('simulate', () => {
  it('乱数が0なら常に先頭マス (大当たり) を引く', () => {
    expect(simulate(buildCells(4), 10, () => 0)).toEqual({
      runs: 10,
      averageBonus: 1000,
      hitRate: 1,
      jackpotRate: 1,
    });
  });
  it('末尾のハズレを引き続けると上乗せ0', () => {
    expect(simulate(buildCells(1), 5, () => 0.99)).toEqual({
      runs: 5,
      averageBonus: 0,
      hitRate: 0,
      jackpotRate: 0,
    });
  });
});

describe('formatSimulation', () => {
  it('表示用の文字列にする', () => {
    expect(formatSimulation({ runs: 10000, averageBonus: 250, hitRate: 0.5, jackpotRate: 0.1 })).toBe(
      '10,000回の平均:上乗せ +250円 ・ 当たり 50.0% ・ 大当たり 10.0%',
    );
  });
});
