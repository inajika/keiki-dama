import { INDICATORS, type IndicatorId, type Preset } from '@/logics/roulette';
import { chipClass } from './styles';

const PRESETS: { label: string; preset: Preset }[] = [
  { label: '不景気の年', preset: 0 },
  { label: 'ふつうの年', preset: 3 },
  { label: '好景気の年', preset: 6 },
  { label: 'ランダム', preset: 'random' },
];

type IndicatorListProps = {
  on: Record<IndicatorId, boolean>;
  /** 回転中は指標を変更できないようにする */
  disabled: boolean;
  onPreset: (preset: Preset) => void;
  onToggle: (id: IndicatorId) => void;
};

/** プリセットボタンと、経済指標ごとの○/×スイッチ一覧 */
export function IndicatorList(props: IndicatorListProps) {
  const { on, disabled, onPreset, onToggle } = props;
  return (
    <section class="mt-8">
      <h2 class="mb-1 text-[1.0625rem] font-black">今年の指標</h2>
      <p class="mb-3 text-[.8125rem] text-muted">
        実際のデータ取得は未実装です。タップで ○/× を切り替えて、当たり枠の変化を試せます。
      </p>
      <fieldset class="mb-3 flex flex-wrap gap-2" aria-label="プリセット">
        {PRESETS.map((p) => (
          <button key={p.label} type="button" class={chipClass} onClick={() => onPreset(p.preset)}>
            {p.label}
          </button>
        ))}
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
                disabled={disabled}
                class={`flex w-full cursor-pointer items-center gap-3 rounded-2xl border-2 bg-surface px-3.5 py-2.5 text-left ${checked ? 'border-accent' : 'border-line'}`}
                onClick={() => onToggle(d.id)}
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
  );
}
