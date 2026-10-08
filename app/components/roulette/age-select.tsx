import { AGES, yen } from '@/logics/roulette';

type AgeSelectProps = {
  /** 選択中の年齢の AGES 上のインデックス */
  age: number;
  onChange: (age: number) => void;
};

/** 年齢(基本額)を選ぶセクション */
export function AgeSelect(props: AgeSelectProps) {
  const { age, onChange } = props;
  return (
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
          onChange={(e) => onChange(Number((e.target as HTMLSelectElement).value))}
        >
          {AGES.map((a, i) => (
            <option key={a.label} value={i} selected={i === age}>
              {a.label}({yen(a.base)})
            </option>
          ))}
        </select>
      </div>
    </section>
  );
}
