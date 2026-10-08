import { CELLS, type CellType, SEGMENT_DEG } from '@/logics/roulette';

// viewBox (300x300) の中心と、ホイール外周の半径
const CENTER = 150;
const RADIUS = 138;

/** 中心 CENTER・半径 r の円周上で、真上を 0 度として時計回りに deg 度進んだ座標を返す */
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

type WheelProps = {
  cells: CellType[];
  /** ホイール全体の回転角度 (deg) */
  rotation: number;
  /** CSS の transition 値。回転開始時にだけアニメーションさせるため親から渡す */
  transition: string;
  /** 当たったマスの番号。ハズレ・未確定なら null */
  winIndex: number | null;
};

/** CELLS 個のマスを扇形で描画するルーレットのホイール */
export function Wheel(props: WheelProps) {
  return (
    <div
      class="size-full will-change-transform"
      role="img"
      aria-label={`${CELLS}マスのルーレット`}
      style={{ transform: `rotate(${props.rotation}deg)`, transition: props.transition }}
    >
      <svg class="block size-full overflow-visible" viewBox="0 0 300 300" aria-hidden="true">
        {props.cells.map((type, i) => {
          const [x0, y0] = polar(i * SEGMENT_DEG, RADIUS);
          const [x1, y1] = polar((i + 1) * SEGMENT_DEG, RADIUS);
          // ハズレは隣同士で見分けがつくよう、交互に色を変える
          const missClass = i % 2 === 0 ? 'fill-miss-a' : 'fill-miss-b';
          const winClass = props.winIndex === i ? 'animate-win motion-reduce:animate-none' : '';
          return (
            <g key={i}>
              <path
                d={`M${CENTER} ${CENTER} L${x0} ${y0} A${RADIUS} ${RADIUS} 0 0 1 ${x1} ${y1} Z`}
                class={`stroke-ink stroke-[1.5] ${type === 'miss' ? missClass : segmentClass[type]} ${winClass}`}
                stroke-linejoin="round"
              />
              {/* ラベルは扇形の中心角まで回転させた上で、真上(12時)の位置に描くことで放射状に並べる */}
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
