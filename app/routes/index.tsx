import { createRoute } from 'honox/factory';
import Roulette from '@/islands/roulette';

export default createRoute((c) => {
  return c.render(
    <>
      <title>景気玉 | お年玉増額ルーレット</title>
      <Roulette />
    </>,
  );
});
