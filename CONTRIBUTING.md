# 贡献指南

感谢参与 DSH Plugins。仓库采用 pnpm workspace，每个 `packages/<plugin>` 是一个
可独立构建、测试、打包和发布的 DeepSeek Harness 插件包。

## 开发前提

- Node.js `^22.19.0 || >=24.0.0`；
- pnpm `11.7.0`（由根 `package.json` 的 `packageManager` 固定）；
- 一个本地的 DeepSeek Harness checkout，默认路径为 `E:\deepseek-harness`。

首次准备依赖：

```powershell
pnpm install
```

当前仓库没有插件包时，`pnpm run verify` 会故意失败并提示缺少
`packages/*/package.json`；这不是测试通过，也不是插件可发布的信号。

## 新增插件

1. 在 `packages/<plugin-name>` 创建独立包，并声明 `name`、`version`、`type: module`、
   `files`、`main`/`exports`、`scripts` 和合适的 `dsh.bundle` manifest。
2. 提供 `src/`、`tests/`、`README.md`、`LICENSE`、`SOURCE.md`、`tsconfig.json` 和
   `cordis.patch.yml`。patch 中的生产引用使用最终 npm 包名；本地联调可用 checkout
   路径 overlay。
3. 使用根 `tsconfig.base.json`，并为包提供 `typecheck`、`test`、`build` 脚本。需要
   lint 时再提供 `lint` 脚本；根脚本会逐包执行并在任一包缺少必需脚本时失败。
4. 在包 README 中写清支持的 DeepSeek Harness 版本、权限/副作用、配置项和真实验收
   命令。来源、许可证和修改范围记录在 `SOURCE.md`。
5. 加入一个 Changeset：

   ```powershell
   pnpm changeset
   ```

## 验证与提交

提交前至少运行：

```powershell
pnpm run verify
```

再按照 [`docs/release-gates.md`](docs/release-gates.md) 完成 `npm pack --dry-run`、
全新 DSH profile 的真实运行和 npm registry 安装验收。HTTP 状态码、静态检查或空测试
不能代替插件行为验收。

提交信息建议使用 Conventional Commits，例如 `feat(plugin-name): add ...`。PR 应说明
影响范围、兼容的 Harness commit、验证命令和是否有破坏性变更。不要提交本地 profile、
模型密钥、Cookie、token 或未经许可的第三方源码。
