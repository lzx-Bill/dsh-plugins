import { requirePackages } from './workspace-packages.mjs';

const scope = process.env.NPM_SCOPE?.trim();
if (!scope || scope === '@your-scope' || !scope.startsWith('@') || scope.includes('/')) {
  console.error('[release:check] 请配置 GitHub repository variable NPM_SCOPE，例如 @your-org。');
  process.exit(1);
}

if (process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN) {
  console.error('[release:check] 检测到 token 环境变量；本项目发布必须使用 npm Trusted Publishing/OIDC。');
  process.exit(1);
}

let packages;
try {
  packages = requirePackages();
} catch (error) {
  console.error(`[release:check] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const mismatches = packages
  .filter(({ manifest }) => manifest.private !== true)
  .filter(({ manifest }) => !manifest.name.startsWith(`${scope}/`));
if (mismatches.length > 0) {
  console.error(`[release:check] 以下公共包不在 NPM_SCOPE=${scope} 下：${mismatches.map(({ manifest }) => manifest.name).join(', ')}`);
  process.exit(1);
}

console.log(`[release:check] ${packages.length} 个包使用 ${scope}；未发现长期 npm token。`);
