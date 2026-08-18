# 贡献指南

感谢参与 DSH Plugins。仓库采用 pnpm workspace；每个 `packages/<plugin>` 是一个可独立构建、测试和打包的 DeepSeek Harness 插件包。

## 开发前提

- Node.js `^22.19.0 || >=24.0.0`；
- pnpm `11.7.0`，由根 `package.json` 的 `packageManager` 固定；
- 一个独立的 DeepSeek Harness checkout。路径由 `DSH_HARNESS_ROOT` 环境变量提供，不把宿主 checkout 放进本仓库。

首次准备依赖并执行本地门禁：

```powershell
pnpm install --frozen-lockfile
pnpm run verify
```

`verify` 会发现真实插件包，逐包执行 `typecheck`、`test`、`build`，再检查 npm pack 清单；缺包、缺脚本、空测试或失败命令都会返回非零状态。

## 新增插件

1. 在 `packages/<plugin-name>` 创建独立包，声明 `name`、`version`、`author`、GitHub `repository`/`homepage`/`bugs`、`keywords`、`type: module`、`files`、`main`/`exports`、脚本和 `dsh.bundle` manifest。
2. 提供 `src/`、`tests/`、`README.md`、`LICENSE`、`SOURCE.md`、`tsconfig.json` 和 `cordis.patch.yml`。生产 patch 使用最终 npm 包名；本地联调将 `examples/local-profile/cordis.patch.yml` 复制到临时目录后替换绝对源码路径标记。
3. 包的 `tsconfig.json` 是独立编译入口，可以复用根 `tsconfig.base.json`，但必须明确覆盖自己的 `rootDir`、`outDir`、模块解析和声明输出；根 `tsconfig.json` 只是空的 solution aggregator，不是插件源码的编译入口。
4. 包必须提供 `typecheck`、`test`、`build` 和 `pack` 脚本。当前仓库没有单独的 ESLint/Oxlint gate；不要在文档中宣称存在未配置的 `lint` 命令。若插件引入真实 lint 工具，才添加包级 `lint` 脚本并在 README 记录。
5. 在包 README 中写清支持的 Harness 版本、配置、权限/网络/文件副作用和真实验收命令；来源、许可证和修改范围记录在 `SOURCE.md`。
6. 功能变更使用 Changesets 记录版本影响：

   ```powershell
   pnpm changeset
   ```

## 验证与提交

提交前至少运行：

```powershell
pnpm run verify
pnpm run pack:check
```

发布前还要按照 [`docs/release-gates.md`](docs/release-gates.md) 完成 tarball、全新 Harness profile 和 registry clean install 的真实验收。HTTP 状态码、静态检查或空测试不能代替插件行为验收。

提交信息建议使用 Conventional Commits，例如 `feat(tool-example): add ...`。PR 应说明影响范围、兼容的 Harness tag/commit、验证命令和是否有破坏性变更。不要提交本地 profile、模型密钥、Cookie、token、生成的 tarball 或未经许可的第三方源码。
