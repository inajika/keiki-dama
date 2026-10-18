/** ホイールの上に重ねて表示する、当たりマスを指す指針 */
export function Pointer() {
  return (
    <svg
      class="absolute -top-2.5 left-1/2 z-10 h-[34px] w-7 -translate-x-1/2 drop-shadow-[0_2px_0_rgba(0,0,0,.18)]"
      viewBox="0 0 28 34"
      aria-hidden="true"
    >
      <path d="M14 34 L1.5 6 Q14 -4 26.5 6 Z" class="fill-ink" />
      <circle cx="14" cy="10" r="3.5" class="fill-surface" />
    </svg>
  );
}
