import { requirePackages } from './workspace-packages.mjs';

const scope = process.env.NPM_SCOPE?.trim();
const expectedScope = '@lzx-bill';
const expectedRepository = 'https://github.com/lzx-Bill/dsh-plugins.git';
const expectedAuthor = 'lzx-Bill';
if (!scope || scope !== expectedScope) {
  console.error(`[release:check] 请将 NPM_SCOPE 设置为 ${expectedScope}，以匹配最终包名。`);
  process.exit(1);
}

if (process.env.NPM_TOKEN || process.env.NODE_AUTH_TOKEN) {
  console.error('[release:check] 检测到 token 环境变量；发布前请清理长期 npm token。');
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

const metadataMismatches = packages.filter(({ manifest }) => (
  manifest.author !== expectedAuthor
  || manifest.repository?.url !== expectedRepository
  || manifest.homepage !== 'https://github.com/lzx-Bill/dsh-plugins#readme'
  || manifest.bugs?.url !== 'https://github.com/lzx-Bill/dsh-plugins/issues'
));
if (metadataMismatches.length > 0) {
  console.error(`[release:check] 以下包的 author/repository/homepage/bugs 元数据未统一：${metadataMismatches.map(({ manifest }) => manifest.name).join(', ')}`);
  process.exit(1);
}

console.log(`[release:check] ${packages.length} 个包使用 ${scope}；未发现长期 npm token。仅完成本地配置检查，未执行发布。`);
