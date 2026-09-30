import { useState } from 'hono/jsx';
import {
  AGES,
  BASE_HITS,
  bonusOf,
  buildCells,
  CELLS,
  type CellType,
  calcRotationDelta,
  countHits,
  expectedBonus,
  HIT_BONUS,
  INDICATORS,
  JACKPOT_BONUS,
  JACKPOT_MIN_HITS,
  MAX_HITS,
} from '@/logics/roulette';

type IndicatorId = (typeof INDICATORS)[number]['id'];
type Result = { kind: 'idle' } | { kind: 'ready' } | { kind: 'spinning' } | { kind: 'done'; index: number };

const SEGMENT_DEG = 360 / CELLS;
const CENTER = 150;
const RADIUS = 138;

const yen = (n: number) => `${n.toLocaleString('ja-JP')}円`;

const polar = (deg: number, r: number) => {
  const t = (deg * Math.PI) / 180;
  return [CENTER + r * Math.sin(t), CENTER - r * Math.cos(t)];
};

const segmentClass: Record<CellType, string> = {
  jackpot: 'fill-gold',
  hit: 'fill-accent',
  miss: '',
};

const labelClass: Record<CellType, string> = {
  jackpot: 'fill-gold-ink text-[17px]',
  hit: 'fill-white text-[19px]',
  miss: 'fill-muted text-[15px] font-bold',
};

const labelText: Record<CellType, string> = { jackpot: '+1000', hit: '+500', miss: '±0' };

const buildInitialOn = () => Object.fromEntries(INDICATORS.map((d) => [d.id, false])) as Record<IndicatorId, boolean>;

function Wheel(props: { cells: CellType[]; rotation: number; transition: string; winIndex: number | null }) {
  return (
    <div
      class="size-full will-change-transform"
      role="img"
      aria-label="10マスのルーレット"
      style={{ transform: `rotate(${props.rotation}deg)`, transition: props.transition }}
    >
      <svg class="block size-full overflow-visible" viewBox="0 0 300 300" aria-hidden="true">
        {props.cells.map((type, i) => {
          const [x0, y0] = polar(i * SEGMENT_DEG, RADIUS);
          const [x1, y1] = polar((i + 1) * SEGMENT_DEG, RADIUS);
          const missClass = i % 2 === 0 ? 'fill-miss-a' : 'fill-miss-b';
          const winClass = props.winIndex === i ? 'animate-win motion-reduce:animate-none' : '';
          return (
            <g key={i}>
              <path
                d={`M${CENTER} ${CENTER} L${x0} ${y0} A${RADIUS} ${RADIUS} 0 0 1 ${x1} ${y1} Z`}
                class={`stroke-ink stroke-[1.5] ${type === 'miss' ? missClass : segmentClass[type]} ${winClass}`}
                stroke-linejoin="round"
              />
              <g transform={`rotate(${i * SEGMENT_DEG + SEGMENT_DEG / 2} ${CENTER} ${CENTER})`}>
                <text
                  x={CENTER}
                  y={CENTER - RADIUS * 0.68}
                  class={`font-black ${labelClass[type]}`}
                  text-anchor="middle"
                  dominant-baseline="middle"
                >
                  {labelText[type]}
                </text>
              </g>
            </g>
          );
        })}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} class="fill-none stroke-ink stroke-5" />
        <circle cx={CENTER} cy={CENTER} r={20} class="fill-surface stroke-ink stroke-4" />
        <circle cx={CENTER} cy={CENTER} r={7} class="fill-accent" />
      </svg>
    </div>
  );
}

function ResultPanel(props: { result: Result; cells: CellType[]; base: number }) {
  const { result, cells, base } = props;
  let border = 'border-line';
  let main = '指標を選んで、回してみましょう';
  let sub = '当たり枠は上の数字のとおりです';

  if (result.kind === 'ready') {
    main = '準備OK';
    sub = '当たり枠が変わりました。回してみましょう';
  } else if (result.kind === 'spinning') {
    main = 'まわっています…';
    sub = ' ';
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

const chipClass =
  'cursor-pointer rounded-full border-2 border-line bg-surface px-3.5 py-1.5 text-sm font-bold hover:border-ink';

export default function Roulette() {
  const [on, setOn] = useState(buildInitialOn);
  const [age, setAge] = useState(2);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [transition, setTransition] = useState('none');
  const [result, setResult] = useState<Result>({ kind: 'idle' });
  const [simOut, setSimOut] = useState('');

  const onCount = INDICATORS.filter((d) => on[d.id]).length;
  const hits = countHits(onCount);
  const cells = buildCells(hits);
  const capped = BASE_HITS + onCount > MAX_HITS;
  const winIndex = result.kind === 'done' && cells[result.index] !== 'miss' ? result.index : null;

  const changeIndicators = (next: Record<IndicatorId, boolean>) => {
    if (spinning) return;
    setOn(next);
    setResult({ kind: 'ready' });
  };

  const applyPreset = (preset: number | 'random') => {
    changeIndicators(
      Object.fromEntries(
        INDICATORS.map((d, i) => [d.id, preset === 'random' ? Math.random() < 0.5 : i < preset]),
      ) as Record<IndicatorId, boolean>,
    );
  };

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult({ kind: 'spinning' });

    const index = Math.floor(Math.random() * CELLS);
    const jitter = (Math.random() - 0.5) * SEGMENT_DEG * 0.6;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 600 : 4200;

    setTransition(`transform ${duration}ms cubic-bezier(.12,.6,.1,1)`);
    setRotation(
      rotation + calcRotationDelta(rotation, index * SEGMENT_DEG + SEGMENT_DEG / 2 + jitter, reduceMotion ? 0 : 5),
    );

    setTimeout(() => {
      setResult({ kind: 'done', index });
      setSpinning(false);
    }, duration + 60);
  };

  const simulate = () => {
    const runs = 10000;
    let total = 0;
    let hitCount = 0;
    let jackpotCount = 0;
    for (let i = 0; i < runs; i++) {
      const type = cells[Math.floor(Math.random() * CELLS)];
      total += bonusOf(type);
      if (type !== 'miss') hitCount++;
      if (type === 'jackpot') jackpotCount++;
    }
    setSimOut(
      `${runs.toLocaleString('ja-JP')}回の平均:上乗せ +${(total / runs).toFixed(0)}円` +
        ` ・ 当たり ${((hitCount * 100) / runs).toFixed(1)}% ・ 大当たり ${((jackpotCount * 100) / runs).toFixed(1)}%`,
    );
  };

  const rules = [
    `基本の当たり枠は${BASE_HITS}マス。指標が○になるごとに+1マス(最大${MAX_HITS}マス)`,
    `当たりは+${yen(HIT_BONUS)}。当たり枠が${JACKPOT_MIN_HITS}マス以上の年は、そのうち1マスが+${yen(JACKPOT_BONUS)}の大当たり`,
    'ハズレは±0(据え置き)で、減額はありません',
    `予算は「基本額 + ${yen(JACKPOT_BONUS)}」で確保しておけば足ります`,
  ];

  return (
    <main class="mx-auto max-w-[480px] px-4 pt-5 pb-12">
      <h1 class="mt-1 mb-0.5 text-2xl font-black tracking-wide">お年玉ルーレット</h1>
      <p class="mb-4 text-sm text-muted">
        今年の経済指標が○なら、当たり枠が増えます。ハズレでも据え置きで、減ることはありません。
      </p>

      <div class="relative mx-auto mt-2 aspect-square w-[min(100%,360px)]">
        <svg
          class="absolute -top-2.5 left-1/2 z-10 h-[34px] w-7 -translate-x-1/2 drop-shadow-[0_2px_0_rgba(0,0,0,.18)]"
          viewBox="0 0 28 34"
          aria-hidden="true"
        >
          <path d="M14 34 L1.5 6 Q14 -4 26.5 6 Z" class="fill-ink" />
          <circle cx="14" cy="10" r="3.5" class="fill-surface" />
        </svg>
        <Wheel cells={cells} rotation={rotation} transition={transition} winIndex={winIndex} />
      </div>

      <div class="mt-[22px] mb-2.5 text-center">
        <div class="text-4xl leading-tight font-black">
          当たり枠 <span>{hits}</span>
          <small class="ml-1 text-base font-bold text-muted">/ {CELLS}</small>
        </div>
        <p class="mt-0.5 mb-0 text-[.8125rem] text-muted">
          当たり確率 {(hits * 100) / CELLS}% ・ 1人あたり期待値 +{Math.round(expectedBonus(cells))}円
          {capped ? '(上限)' : ''}
        </p>
      </div>

      <button
        type="button"
        class="mx-auto mt-3.5 block w-full max-w-[360px] cursor-pointer rounded-full bg-accent px-5 py-3.5 text-lg font-black text-white shadow-[0_4px_0_rgba(0,0,0,.22)] transition active:translate-y-[3px] active:shadow-[0_1px_0_rgba(0,0,0,.22)] disabled:cursor-not-allowed disabled:opacity-55 motion-reduce:transition-none"
        disabled={spinning}
        onClick={spin}
      >
        ルーレットを回す
      </button>

      <ResultPanel result={result} cells={cells} base={AGES[age].base} />

      <section class="mt-8">
        <h2 class="mb-1 text-[1.0625rem] font-black">今年の指標</h2>
        <p class="mb-3 text-[.8125rem] text-muted">
          実際のデータ取得は未実装です。タップで ○/× を切り替えて、当たり枠の変化を試せます。
        </p>
        <fieldset class="mb-3 flex flex-wrap gap-2" aria-label="プリセット">
          <button type="button" class={chipClass} onClick={() => applyPreset(0)}>
            不景気の年
          </button>
          <button type="button" class={chipClass} onClick={() => applyPreset(3)}>
            ふつうの年
          </button>
          <button type="button" class={chipClass} onClick={() => applyPreset(6)}>
            好景気の年
          </button>
          <button type="button" class={chipClass} onClick={() => applyPreset('random')}>
            ランダム
          </button>
        </fieldset>
        <ul class="m-0 grid list-none gap-2 p-0">
          {INDICATORS.map((d) => {
            const checked = on[d.id];
            return (
              <li key={d.id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={checked}
                  disabled={spinning}
                  class={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 bg-surface px-3.5 py-2.5 text-left ${checked ? 'border-accent' : 'border-line'}`}
                  onClick={() => changeIndicators({ ...on, [d.id]: !checked })}
                >
                  <span
                    class={`grid size-9 flex-none place-items-center rounded-full border-2 text-lg font-black ${checked ? 'border-accent bg-accent text-white' : 'border-line text-muted'}`}
                    aria-hidden="true"
                  >
                    {checked ? '○' : '×'}
                  </span>
                  <span class="min-w-0 flex-1">
                    <span class="block font-black leading-snug">{d.name}</span>
                    <span class="block text-[.8125rem] leading-snug text-muted">{d.cond}</span>
                  </span>
                  <span class={`flex-none text-[.8125rem] font-black ${checked ? 'text-accent' : 'text-muted'}`}>
                    {checked ? '当たり+1' : ''}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section class="mt-8">
        <h2 class="mb-1 text-[1.0625rem] font-black">渡す額</h2>
        <p class="mb-3 text-[.8125rem] text-muted">
          年齢別の基本額です。ルーレットの結果は、この額への上乗せとして表示します。
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <label for="age">年齢</label>
          <select
            id="age"
            class="rounded-xl border-2 border-line bg-surface px-3 py-2 font-bold"
            value={age}
            onChange={(e) => setAge(Number((e.target as HTMLSelectElement).value))}
          >
            {AGES.map((a, i) => (
              <option key={a.label} value={i} selected={i === age}>
                {a.label}({yen(a.base)})
              </option>
            ))}
          </select>
        </div>
      </section>

      <section class="mt-8">
        <h2 class="mb-1 text-[1.0625rem] font-black">ルール</h2>
        <ul class="m-0 list-disc pl-[1.2em] text-[.8125rem] text-muted">
          {rules.map((t) => (
            <li key={t} class="mb-0.5">
              {t}
            </li>
          ))}
        </ul>
        <div class="mt-3">
          <button type="button" class={chipClass} onClick={simulate}>
            1万回まわして平均を見る
          </button>
          <p class="mt-2 mb-0 text-[.8125rem] text-muted">{simOut}</p>
        </div>
      </section>
    </main>
  );
}
