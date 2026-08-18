# DSH Plugins

`dsh-plugins` 是面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的开源插件 monorepo。仓库身份固定为 [`lzx-Bill/dsh-plugins`](https://github.com/lzx-Bill/dsh-plugins)，每个 `packages/<plugin>` 都是可独立安装、构建、测试和打包的 npm 包。

当前包含 [`@lzx-bill/dsh-tool-example`](packages/tool-example)，它通过 Cordis 的 `tools` 服务注册确定性的 `example_greet` Host Tool，不访问网络、文件系统或外部凭据。包名、GitHub 仓库身份已经固定；公开发布前仍必须按发布 Gate 重新完成最终包名对应的构建、打包、宿主运行和 registry clean install 验收。

## 环境与本地门禁

要求 Node.js `^22.19.0 || >=24.0.0`、pnpm `11.7.0`。仓库不提供 GitHub Actions CI 或自动 npm 发布；维护者在本地执行以下门禁：

```powershell
pnpm install --frozen-lockfile
pnpm run check:packages
pnpm run verify
pnpm run pack:check
pnpm run release:check
```

`release:check` 只检查最终 npm scope 与发布环境，不执行发布；它要求 `NPM_SCOPE=@lzx-bill`，并拒绝长期 `NPM_TOKEN`/`NODE_AUTH_TOKEN` 环境变量。npm/GitHub 写操作由维护者在 Gate 通过后手动执行。

## 插件包约定

```text
packages/<plugin-name>/
├─ src/  tests/
├─ package.json  tsconfig.json
├─ cordis.patch.yml  README.md
├─ SOURCE.md  LICENSE
```

包必须声明 ESM 入口、构建后的 `main`/`exports`、`types`、`files`、`dsh.bundle.patch`，并明确 peer 依赖与兼容的 Harness 版本。生产 patch 使用最终 npm 包名；本地联调使用复制后替换绝对源码路径的 overlay。`SOURCE.md` 记录来源、许可证、上游 API 参考和兼容性假设。

## 本地 Harness 联调

Harness 保持在独立 checkout。先设置两个本地路径变量：

```powershell
$env:DSH_PLUGINS_ROOT = (Resolve-Path '<path-to-dsh-plugins>').Path
$env:DSH_HARNESS_ROOT = (Resolve-Path '<path-to-deepseek-harness>').Path
```

然后按照 [`docs/local-harness.md`](docs/local-harness.md) 复制 overlay 并替换 `ABSOLUTE_PATH_TO_DSH_PLUGINS` 标记，在 Harness checkout 中构建和启动。构建成功、HTTP 200 或进程启动都不能替代真实工具调用验收。

## 当前验证状态

`@lzx-bill/dsh-tool-example@0.1.0` 已通过 `pnpm run verify`、最终 tarball 清单检查，以及 Harness `0.1.0-rc.7`（commit `99f6f02fecdb7dff40c3fbc9470f5907c29f74ca`）隔离 profile 的安装、peer 检查、`--dump-config` 和真实 `ToolRuntime` 调用。验收 tarball SHA-256 为 `415265D4A9B7D96FE39B9F5D8265B58031A1A7C3F459DE93829FF4969EB2440C`。npm registry 安装尚未验证，不能据此宣称 npm 版本已经发布可用。

## 发布路线

发布顺序固定为：`verify` → 每个包 `npm pack --dry-run` → 完整 tarball 安装到全新 Harness profile → `--dump-config` → 真实调用 `example_greet` → 人工执行 npm 发布 → registry clean install 重复验收 → 创建 Git tag/GitHub Release。详细步骤见 [`docs/release-gates.md`](docs/release-gates.md)。

## 贡献与安全

- 贡献流程见 [`CONTRIBUTING.md`](CONTRIBUTING.md)。
- 漏洞请通过 [GitHub Security Advisories](https://github.com/lzx-Bill/dsh-plugins/security/advisories/new) 私密报告，勿在公开 issue/PR 中提交凭据或可利用细节。
- 根项目和首个插件均使用 MIT License，见 [`LICENSE`](LICENSE) 与 [`packages/tool-example/LICENSE`](packages/tool-example/LICENSE)。
