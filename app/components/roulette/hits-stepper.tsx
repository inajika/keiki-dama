import { chipClass } from './styles';

type HitsStepperProps = {
  hits: number;
  min: number;
  max: number;
  /** 回転中など、操作を受け付けないとき true */
  disabled: boolean;
  onChange: (hits: number) => void;
};

/** 当たり枠の数を −/＋ ボタンで増減するコントロール */
export function HitsStepper(props: HitsStepperProps) {
  const { hits, min, max, disabled, onChange } = props;
  const buttonClass = `${chipClass} disabled:cursor-not-allowed disabled:opacity-55`;
  return (
    <div class="mt-2 flex items-center justify-center gap-3">
      <button
        type="button"
        class={buttonClass}
        aria-label="当たり枠を減らす"
        disabled={disabled || hits <= min}
        onClick={() => onChange(hits - 1)}
      >
        −
      </button>
      <span class="text-sm text-muted">当たり枠を変更</span>
      <button
        type="button"
        class={buttonClass}
        aria-label="当たり枠を増やす"
        disabled={disabled || hits >= max}
        onClick={() => onChange(hits + 1)}
      >
        ＋
      </button>
    </div>
  );
}
