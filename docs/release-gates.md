# 发布 Gate

按顺序完成并在 PR/Release 中保留命令和结果。仓库不提供 GitHub Actions CI 或自动 npm 发布；所有写操作由维护者在本地完成，并且任何 Gate 缺证据都应阻断发布。

## Gate 0：范围与来源

包位于 `packages/<plugin-name>`；`SOURCE.md`、许可证、README 和 npm `files` 已审核；README 写清 Harness API、配置、权限和副作用；没有凭据、Cookie、token、profile、宿主 checkout 或生成 tarball 入 Git。最终包名、GitHub repository 和 npm scope 必须统一为 `@lzx-bill/*` / `lzx-Bill/dsh-plugins`。

## Gate 1：包级质量

```powershell
pnpm install --frozen-lockfile
pnpm run verify
```

根脚本逐包执行 `typecheck`、`test`、`build` 和 `pack:check`；缺包、缺 script、失败命令或 `No test files found` 均阻断发布。当前最终身份变更后没有可复用的旧 PASS 宣称，必须重新运行并记录结果。

## Gate 2：包内容

```powershell
pnpm run pack:check
Set-Location packages/tool-example
npm pack --dry-run
```

审阅每个 `npm pack --dry-run` 清单，确认构建入口、类型、`cordis.patch.yml`、README、LICENSE、SOURCE 和必要依赖存在，且没有秘密或超范围文件。最终 tarball 只在本次最终身份验收时生成；不要复用旧占位包名或旧 SHA。

## Gate 3：本地宿主真实验收

在兼容矩阵的固定 commit 中构建宿主，用专用 `DSH_HOME` 加载复制并替换后的源码 overlay，通过 `--dump-config` 确认插件行，再真实执行工具的成功、参数错误和卸载路径。完整命令见 [`local-harness.md`](local-harness.md)。

## Gate 4：受控人工 npm 发布

在 Gate 0–3 全部通过后，由维护者在受控终端手工发布 npm 包。执行前运行：

```powershell
$env:NPM_SCOPE = '@lzx-bill'
pnpm run release:check
```

`release:check` 只校验包名 scope、发布身份和 token 环境；不登录、不上传、不推送。仓库没有自动 release workflow，也没有自动 publish 脚本；若使用 Changesets，先人工审阅版本计划，再在受控终端显式执行 `pnpm exec changeset publish`。否则进入包目录执行明确版本的 `npm publish --access public`。

## Gate 5：registry clean install 与 GitHub Release

npm 发布成功后，用全新临时 profile 从 registry 安装精确的 `@lzx-bill/dsh-tool-example@<version>`，重复 Gate 3；不得使用 workspace link 或旧缓存。检查 `npm view <package>@<version> dist.integrity`，并保存当前最终包的 registry integrity 与调用证据。全部通过后再创建对应 Git tag/GitHub Release；registry 验收失败时不得创建 Release，并应立即评估弃用该版本。
