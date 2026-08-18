import { spawnSync } from 'node:child_process';
import { requirePackages } from './workspace-packages.mjs';

let packages;
try {
  packages = requirePackages();
} catch (error) {
  console.error(`[pack:check] ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const runner = process.platform === 'win32' ? (process.env.ComSpec ?? 'cmd.exe') : npmCommand;
for (const { manifest, directory } of packages) {
  console.log(`[pack:check] ${manifest.name} → npm pack --dry-run --ignore-scripts`);
  const args = ['pack', '--dry-run', '--ignore-scripts'];
  const result = spawnSync(
    runner,
    process.platform === 'win32' ? ['/d', '/s', '/c', npmCommand, ...args] : args,
    {
      cwd: directory,
      env: process.env,
      stdio: 'inherit',
      windowsHide: true,
    },
  );
  if (result.error) {
    console.error(`[pack:check] 无法打包 ${manifest.name}: ${result.error.message}`);
    process.exitCode = 1;
  } else if (result.status !== 0) {
    console.error(`[pack:check] ${manifest.name} 的 pack 检查失败（退出码 ${result.status ?? 'unknown'}）。`);
    process.exitCode = result.status ?? 1;
  }
}
