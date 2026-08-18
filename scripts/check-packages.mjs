import { requirePackages } from './workspace-packages.mjs';

try {
  const packages = requirePackages();
  const names = packages.map(({ manifest }) => manifest.name).join(', ');
  console.log(`[check:packages] 发现 ${packages.length} 个 workspace package: ${names}`);
  console.log('[check:packages] 这只证明包可被发现，不代表插件行为已验收。');
} catch (error) {
  console.error(`[check:packages] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
