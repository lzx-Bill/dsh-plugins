import { spawnSync } from 'node:child_process';
import { requirePackages, workspaceRoot } from './workspace-packages.mjs';

const [scriptName, ...scriptArgs] = process.argv.slice(2);
if (!scriptName) {
  console.error('用法：node scripts/run-packages.mjs <script> [...args]');
  process.exit(2);
}

let packages;
try {
  packages = requirePackages();
} catch (error) {
  console.error(`[run:packages] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const pnpmCommand = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const runner = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : pnpmCommand;
for (const { manifest } of packages) {
  if (!manifest.scripts || typeof manifest.scripts[scriptName] !== 'string') {
    console.error(`[run:packages] ${manifest.name} 缺少 scripts.${scriptName}，拒绝跳过。`);
    process.exitCode = 1;
    continue;
  }

  console.log(`[run:packages] ${manifest.name} → ${scriptName}`);
  const args = ['--filter', manifest.name, 'run', scriptName, ...scriptArgs];
  const result = spawnSync(
    runner,
    process.platform === 'win32' ? ['/d', '/s', '/c', pnpmCommand, ...args] : args,
    {
      cwd: workspaceRoot,
      env: process.env,
      stdio: 'inherit',
      windowsHide: true,
    },
  );
  if (result.error) {
    console.error(`[run:packages] 无法执行 ${manifest.name}: ${result.error.message}`);
    process.exitCode = 1;
  } else if (result.status !== 0) {
    console.error(`[run:packages] ${manifest.name} 的 ${scriptName} 失败（退出码 ${result.status ?? 'unknown'}）。`);
    process.exitCode = result.status ?? 1;
  }
}
