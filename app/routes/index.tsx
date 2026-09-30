import { createRoute } from 'honox/factory';
import Roulette from '@/islands/roulette';

export default createRoute((c) => {
  return c.render(
    <>
      <title>お年玉ルーレット(プロトタイプ)</title>
      <Roulette />
    </>,
  );
});
