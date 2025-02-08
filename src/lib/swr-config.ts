// lib/swr-config.ts

import cache from '~/utils/cache';

const swrConfig = {
  provider: () => cache,
};

export default swrConfig;
