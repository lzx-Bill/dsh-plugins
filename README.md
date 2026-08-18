# DSH Plugins

这是面向 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的社区插件
monorepo。每个插件位于 `packages/<plugin-name>`，作为独立 npm 包维护；根目录负责统一
开发、验证、Changesets 和发布流程。

当前仓库已有 1 个插件：`@dsh-plugins-placeholder/tool-example@0.1.0`。它注册确定性的
`example_greet` Host Tool，不访问网络、文件系统或外部凭据。包名和 GitHub 身份仍是发布前
占位值，因此当前状态是“本地验收通过，公开发布 NOT READY”。

## 环境与命令

- Node.js `24.11.1`；
- pnpm `11.7.0`；
- 本地 Harness checkout：`E:\deepseek-harness`；
- 兼容基线：Harness `0.1.0-rc.7`，完整 commit
  `99f6f02fecdb7dff40c3fbc9470f5907c29f74ca`。

```powershell
pnpm install
pnpm run check:packages
pnpm run verify
```

根脚本会逐包执行 `typecheck`、`test`、`build`，再运行
`npm pack --dry-run --ignore-scripts`。每个包缺少必需脚本或命令失败都会返回非零状态。

## 插件包约定

```text
packages/<plugin-name>/
├─ src/  tests/
├─ package.json  tsconfig.json
├─ cordis.patch.yml  README.md
├─ SOURCE.md  LICENSE
```

包应声明 `type: "module"`、构建后的 `main`/`exports`、`types`、`files` 和
`dsh.bundle.patch`。生产 patch 使用最终 npm 包名；开发期使用 local overlay。
README 必须说明兼容的 Harness 版本、配置、权限、网络/文件副作用和验收命令。
`SOURCE.md` 记录来源、上游 commit、许可证以及复制或修改范围。

## 本地 Harness 联调

Harness 保持在独立 checkout，不复制到本仓库：

```powershell
Set-Location E:\deepseek-harness
pnpm install --frozen-lockfile
pnpm run build
$env:DSH_HOME = 'E:\AI\dsh-plugins\.dsh-home-local'
pnpm dsh web --patch E:/AI/dsh-plugins/examples/local-profile/cordis.patch.yml
```

本地 overlay 的模块名是
`file:///E:/AI/dsh-plugins/packages/tool-example/src/index.ts`；先用 `--dump-config`
确认插件层，再在真实 Web/Headless 流程中调用插件工具或 UI。构建成功、HTTP 200 或进程
启动不能替代业务行为验收。详见
[`docs/local-harness.md`](docs/local-harness.md)。

## 已完成的本地验收

- `pnpm verify`：PASS，4 个测试通过，其中包含真实 Cordis `ToolRuntime` 执行路径；
- `E:\deepseek-harness` 在上述 commit 执行 `pnpm run build`：PASS；
- 固定 tarball `dsh-plugins-placeholder-tool-example-0.1.0.tgz` SHA-256：
  `D09B3BACB231FD30C6EFC3A365E35EC17EA4A0246DC6334F53CD79EE7A11D018`；
- 全新 profile 的 package add、peer 检查和 `--dump-config`：PASS；
- 从已安装 tgz 执行 `example_greet`：返回 `Installed, Ada!`；
- Web overlay smoke：HTTP 200 后已安全停止。

HTTP 200 仅证明 Web 入口可达，不能当作业务验收；业务结论以实际工具调用和配置证据为准。

## 当前发布状态

当前仍为 `NOT READY for public publish`：npm scope、GitHub repository 和 npm Trusted
Publisher/OIDC 尚未配置；registry clean install 也尚未完成。完成这些配置并从 registry
全新 profile 重复真实工具调用后，才可发布公共 npm 包。

## 兼容性与发布

- 兼容矩阵：[`docs/compatibility.md`](docs/compatibility.md)；
- 发布 Gate：[`docs/release-gates.md`](docs/release-gates.md)；
- 贡献规范：[`CONTRIBUTING.md`](CONTRIBUTING.md)。

发布使用 Changesets。GitHub release workflow 使用 npm Trusted Publishing/OIDC
（`id-token: write`），不读取或保存 `NPM_TOKEN`。首次发布前在 GitHub repository variable
中配置 `NPM_SCOPE`（例如 `@your-org`，实际值由维护者决定），并在 npm 为该仓库、workflow
和分支配置 trusted publisher；缺少配置时 workflow 会安全失败。

## 许可证

代码以 MIT License 发布，见 [`LICENSE`](LICENSE)。第三方代码或生成内容须保留其许可证并
在 `SOURCE.md` 中说明。
