# 发布 Gate

按顺序完成并在 PR/Release 中保留命令和结果。当前 workspace 已有 1 个插件；缺少实际
package、测试或构建证据时必须阻断发布。

## Gate 0：范围与来源

包位于 `packages/<plugin-name>`；`SOURCE.md`、许可证、NOTICE、README 和 npm `files` 已
审核；README 写清 Harness commit、配置、权限和副作用；没有凭据、Cookie、token、profile
或宿主 checkout 文件入 Git。

## Gate 1：包级质量

```powershell
pnpm install
pnpm run typecheck
pnpm run test
pnpm run build
```

根脚本逐包执行；缺包、缺 script、失败命令或 `No test files found` 均阻断发布。

当前实绩：`pnpm verify` PASS，4 个测试通过，其中包含真实 Cordis `ToolRuntime`。

## Gate 2：包内容

```powershell
pnpm run pack:check
```

审阅每个 `npm pack --dry-run` 清单，确认入口、类型、`cordis.patch.yml`、README、LICENSE
和必要 NOTICE 存在且没有秘密或超范围文件。固定 tarball 后记录 SHA-256。

当前 tarball `dsh-plugins-placeholder-tool-example-0.1.0.tgz` 的 SHA-256 为
`D09B3BACB231FD30C6EFC3A365E35EC17EA4A0246DC6334F53CD79EE7A11D018`。

## Gate 3：本地宿主真实验收

在 `E:\deepseek-harness` 的固定 commit 中构建宿主，用专用 `DSH_HOME` 加载本地构建包，
通过 `--dump-config` 确认 bundle/插件行，再真实执行工具、事件或 UI 的成功、失败、重复
和卸载路径，并记录结果。完整命令见 [`local-harness.md`](local-harness.md)。

当前基线为 Harness `0.1.0-rc.7` /
`99f6f02fecdb7dff40c3fbc9470f5907c29f74ca`，Node `24.11.1`、pnpm `11.7.0`；宿主
build PASS。全新 profile add、peer 检查和 dump-config PASS；已安装 tgz 的
`example_greet` 返回 `Installed, Ada!`。Web overlay HTTP 200 后已安全停止；HTTP 200
仅是入口 smoke，不是业务验收。

## Gate 4：registry clean install

发布后用全新临时 profile 从 npm registry 安装精确版本，重复 Gate 3；不得使用 workspace
link 或旧缓存。检查 `npm view <package>@<version> dist.integrity`，并创建包版本 tag/Release。

当前 Gate 4 尚未执行，因此不能宣称 registry clean install 通过。

## Gate 5：受控发布

Changeset、版本、兼容矩阵和 release note 已审阅；GitHub repository variable `NPM_SCOPE`
与包名一致；npm trusted publisher（repository、workflow、branch/environment）已配置；
release job 仅用 OIDC（`id-token: write`），不设置 `NPM_TOKEN`。任何 Gate 缺证据均为
`NOT READY`。当前 npm scope、GitHub repository、Trusted Publisher/OIDC 尚未配置，故状态为
`NOT READY for public publish`。
