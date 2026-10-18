import { BASE_HITS, HIT_BONUS, yen } from '@/logics/roulette';
import { chipClass } from './styles';

const rules = [`当たり枠は${BASE_HITS}マス`, `当たりは+${yen(HIT_BONUS)}`, 'ハズレは±0(据え置き)で、減額はありません'];

type RulesSectionProps = {
  /** シミュレーション結果の表示文字列。未実行なら空文字 */
  simOut: string;
  onSimulate: () => void;
};

/** ルール説明と、シミュレーション実行ボタン・結果を表示するセクション */
export function RulesSection(props: RulesSectionProps) {
  return (
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
        <button type="button" class={chipClass} onClick={props.onSimulate}>
          1万回まわして平均を見る
        </button>
        <p class="mt-2 mb-0 text-[.8125rem] text-muted">{props.simOut}</p>
      </div>
    </section>
  );
}
