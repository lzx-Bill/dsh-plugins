import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
export const workspaceRoot = path.resolve(scriptsDirectory, '..');
export const packagesRoot = path.join(workspaceRoot, 'packages');

export function discoverPackages() {
  if (!fs.existsSync(packagesRoot)) return [];

  return fs.readdirSync(packagesRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const directory = path.join(packagesRoot, entry.name);
      const manifestPath = path.join(directory, 'package.json');
      if (!fs.existsSync(manifestPath)) return null;

      let manifest;
      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      } catch (error) {
        throw new Error(`无法解析 ${manifestPath}: ${error instanceof Error ? error.message : String(error)}`);
      }

      if (!manifest || typeof manifest !== 'object' || Array.isArray(manifest)) {
        throw new Error(`${manifestPath} 必须包含 JSON 对象`);
      }
      if (typeof manifest.name !== 'string' || manifest.name.trim() === '') {
        throw new Error(`${manifestPath} 缺少非空 package name`);
      }

      return { directory, manifest, manifestPath };
    })
    .filter(Boolean);
}

export function requirePackages() {
  const packages = discoverPackages();
  if (packages.length === 0) {
    throw new Error(
      '未发现插件包：请先创建 packages/<plugin-name>/package.json。空 workspace 不能作为插件构建或验收成功。',
    );
  }
  return packages;
}
