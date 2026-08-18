# `@dsh-plugins-placeholder/tool-example`

当前仓库唯一的 DeepSeek Harness Host Tool 插件。它注册确定性的 `example_greet` 工具：
输入姓名，返回带可配置前缀的问候语。插件不访问网络、文件系统或任何外部凭据。

## 发布前必须修改包名

`@dsh-plugins-placeholder` 只是避免在公开发布前误占用 npm scope 的占位符。发布到 npm
前，请将 `package.json`、`cordis.patch.yml`、README、GitHub 仓库信息和所有安装示例中的
scope 一并替换成你实际拥有的公开 scope，并确认包名可用。

## 本地开发

本仓库的 [local-profile overlay](../../examples/local-profile/cordis.patch.yml) 使用
`file:///E:/AI/dsh-plugins/packages/tool-example/src/index.ts` 绝对源码 URL（Windows ESM
不能使用裸 `E:/...` 模块名），不需要先发布或安装该包。确保 `E:\deepseek-harness` 已安装
依赖并完成构建后，在 Harness 仓库执行：

```powershell
Set-Location E:\deepseek-harness
pnpm dsh web --patch E:/AI/dsh-plugins/examples/local-profile/cordis.patch.yml
```

本地 overlay 配置前缀为 `Local`。本次 Web smoke 返回 HTTP 200 后安全停止；HTTP 200 只
证明入口可达，不是业务验收。业务验收使用全新 profile 从已安装 tgz 执行 `example_greet`
问候 `Ada`，实际返回 `Installed, Ada!`。

## 包结构与命令

```text
src/index.ts          # ESM 插件，导出 name / inject / apply / Config
tests/tool-example.spec.ts
cordis.patch.yml      # npm 包可安装 Bundle 的 patch 层（本地开发请用 local-profile）
```

在包目录（安装依赖后）运行：

```powershell
npm run typecheck
npm test
npm run build
npm run pack
```

`npm run pack` 使用 `npm pack --dry-run` 检查最终文件清单；真正发布前应先用 `npm pack`
生成 tarball，在全新 Harness profile 中从 tarball 安装并验证 `--dump-config` 与真实工具
调用，再执行 `npm publish --access public`。

兼容性基线是 Harness `0.1.0-rc.7`、完整 commit
`99f6f02fecdb7dff40c3fbc9470f5907c29f74ca`、Node `24.11.1`、pnpm `11.7.0`，以及
`@deepseek-ai/dsh-tools` `0.1.0-rc.7`。本包 `pnpm verify` 4 tests PASS（含真实
Cordis `ToolRuntime`），宿主 `pnpm run build` PASS；固定 tgz SHA-256 为
`D09B3BACB231FD30C6EFC3A365E35EC17EA4A0246DC6334F53CD79EE7A11D018`。

当前仍 `NOT READY for public publish`：npm scope、GitHub repository、Trusted Publisher/OIDC
尚未配置，且 registry clean install 尚未完成。Harness 是 Developer Preview，发布前必须
完成 Gate 4 并重新确认目标版本与 peer 范围。

## 许可证与来源

代码使用 MIT 许可证，来源与兼容性记录见 [`SOURCE.md`](SOURCE.md)。
