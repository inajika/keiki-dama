import { useState } from 'hono/jsx';
import { AgeSelect } from '@/components/roulette/age-select';
import { Pointer } from '@/components/roulette/pointer';
import { ResultPanel } from '@/components/roulette/result-panel';
import { RulesSection } from '@/components/roulette/rules-section';
import { Wheel } from '@/components/roulette/wheel';
import {
  AGES,
  BASE_HITS,
  buildCells,
  CELLS,
  calcRotationDelta,
  expectedBonus,
  formatSimulation,
  type Result,
  SEGMENT_DEG,
  simulate,
} from '@/logics/roulette';

const SIMULATION_RUNS = 10000;

/**
 * お年玉ルーレットの画面全体。
 * 状態管理とイベント処理だけを持ち、表示は `components/roulette/` の各コンポーネントに任せる。
 * `islands/` 配下のファイルは Island として扱われるため、props を受け取るだけの子コンポーネントはここに置かない。
 */
export default function Roulette() {
  const [age, setAge] = useState(2);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [transition, setTransition] = useState('none');
  const [result, setResult] = useState<Result>({ kind: 'idle' });
  const [simOut, setSimOut] = useState('');

  const hits = BASE_HITS;
  const cells = buildCells(hits);
  const winIndex = result.kind === 'done' && cells[result.index] !== 'miss' ? result.index : null;

  /** ルーレットを回し、アニメーション終了後に結果を確定する */
  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult({ kind: 'spinning' });

    const index = Math.floor(Math.random() * CELLS);
    // 毎回マスの中心で止まると不自然なので、マス幅の±30%の範囲でずらす
    const jitter = (Math.random() - 0.5) * SEGMENT_DEG * 0.6;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduceMotion ? 600 : 4200;

    setTransition(`transform ${duration}ms cubic-bezier(.12,.6,.1,1)`);
    setRotation(
      rotation + calcRotationDelta(rotation, index * SEGMENT_DEG + SEGMENT_DEG / 2 + jitter, reduceMotion ? 0 : 5),
    );

    // transition の終了より少し後に結果を出し、止まりきる前に結果が見えてしまうのを防ぐ
    setTimeout(() => {
      setResult({ kind: 'done', index });
      setSpinning(false);
    }, duration + 60);
  };

  const runSimulation = () => setSimOut(formatSimulation(simulate(cells, SIMULATION_RUNS)));

  return (
    <main class="mx-auto max-w-[480px] px-4 pt-5 pb-12">
      <h1 class="mt-1 mb-0.5 text-2xl font-black tracking-wide">お年玉ルーレット</h1>
      <p class="mb-4 text-sm text-muted">ハズレでも据え置きで、減ることはありません。</p>

      <div class="relative mx-auto mt-2 aspect-square w-[min(100%,360px)]">
        <Pointer />
        <Wheel cells={cells} rotation={rotation} transition={transition} winIndex={winIndex} />
      </div>

      <div class="mt-[22px] mb-2.5 text-center">
        <div class="text-4xl leading-tight font-black">
          当たり枠 <span>{hits}</span>
          <small class="ml-1 text-base font-bold text-muted">/ {CELLS}</small>
        </div>
        <p class="mt-0.5 mb-0 text-[.8125rem] text-muted">
          当たり確率 {(hits * 100) / CELLS}% ・ 1人あたり期待値 +{Math.round(expectedBonus(cells))}円
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
      <AgeSelect age={age} onChange={setAge} />
      <RulesSection simOut={simOut} onSimulate={runSimulation} />
    </main>
  );
}
