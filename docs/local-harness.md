# E:\deepseek-harness 本地联调

本仓库只维护插件；Harness 保持在独立 checkout `E:\deepseek-harness`。每次联调都记录
宿主 commit、Node/pnpm 版本和 profile，避免把宿主改动误归因于插件。

## 固定宿主基线

```powershell
Set-Location E:\deepseek-harness
git status --short --branch
git log -1 --format='%H%n%ad%n%s' --date=iso
node --version                 # 24.11.1
pnpm --version                 # 11.7.0
pnpm install --frozen-lockfile
pnpm run build
```

本次已验收基线为 Harness `0.1.0-rc.7`、完整 commit
`99f6f02fecdb7dff40c3fbc9470f5907c29f74ca`；宿主 `pnpm run build` 已 PASS。

若需同步 upstream，先阅读宿主贡献说明并保留本地未提交文件；本仓库不对宿主执行 reset、
merge 或发布。

## 开发 overlay

```powershell
Set-Location E:\AI\dsh-plugins
pnpm install
pnpm --filter <plugin-package-name> run build

Set-Location E:\deepseek-harness
$env:DSH_HOME = 'E:\AI\dsh-plugins\.dsh-home-local'
pnpm dsh web --patch E:/AI/dsh-plugins/examples/local-profile/cordis.patch.yml
```

当前 local overlay 的插件模块名必须是
`file:///E:/AI/dsh-plugins/packages/tool-example/src/index.ts`；该模块名位于
`examples/local-profile/cordis.patch.yml`。发布 Bundle 的
`packages/tool-example/cordis.patch.yml` 仅用于 npm 包安装，不用于本地 overlay。实际
patch 结构与 profile 参数以固定 Harness commit 的文档为准。用 `--dump-config` 检查有效
配置层，不要假设 patch 会深度合并整行配置。

## 真实行为证据

本次已验证：全新 profile 的 package add、peer 检查和 `--dump-config` PASS；从已安装 tgz
执行 `example_greet` 返回 `Installed, Ada!`；Web overlay 返回 HTTP 200 后安全停止。
HTTP 200、进程启动和静态 patch 检查只是前置证据，不能替代业务调用。workspace
`pnpm verify` 4 tests PASS（含真实 Cordis `ToolRuntime`）。完成后清理专用 `DSH_HOME`。
