# 本地 Harness 联调

本仓库只维护插件；DeepSeek Harness 保持在独立 checkout。每次联调都记录宿主 tag/commit、Node/pnpm 版本和专用 `DSH_HOME`，不要把宿主文件复制进本仓库。

## 设置路径变量

公开文档不假设任何本机盘符。请在 PowerShell 中设置：

```powershell
$env:DSH_PLUGINS_ROOT = (Resolve-Path '<path-to-dsh-plugins>').Path
$env:DSH_HARNESS_ROOT = (Resolve-Path '<path-to-deepseek-harness>').Path
$env:DSH_HOME = Join-Path $env:DSH_PLUGINS_ROOT '.dsh-home-local'
```

## 固定宿主基线

```powershell
Set-Location $env:DSH_HARNESS_ROOT
git status --short --branch
git log -1 --format='%H%n%ad%n%s' --date=iso
node --version
pnpm --version
pnpm install --frozen-lockfile
pnpm run build
```

兼容矩阵中的 commit 只是待验证基线。同步宿主前先阅读宿主贡献说明并保留其本地未提交文件；本仓库不对宿主执行 reset、merge 或发布。

## 开发 overlay

模板 [`examples/local-profile/cordis.patch.yml`](../examples/local-profile/cordis.patch.yml) 使用 `file:///ABSOLUTE_PATH_TO_DSH_PLUGINS/...` 标记。先复制模板到临时目录，再按 [`examples/local-profile/README.md`](../examples/local-profile/README.md) 替换为本机插件仓库路径；不要直接修改并提交模板。

```powershell
$privateOverlay = Join-Path $env:TEMP 'dsh-tool-example.patch.yml'
$template = Join-Path $env:DSH_PLUGINS_ROOT 'examples/local-profile/cordis.patch.yml'
$source = Get-Content $template -Raw
$repoUrlPath = $env:DSH_PLUGINS_ROOT -replace '\\', '/'
$source.Replace('ABSOLUTE_PATH_TO_DSH_PLUGINS', $repoUrlPath) |
  Set-Content $privateOverlay -Encoding utf8

Set-Location $env:DSH_HARNESS_ROOT
pnpm dsh web --patch $privateOverlay
```

Windows ESM 模块名使用 `file:///...` URL；发布 Bundle 的 `packages/tool-example/cordis.patch.yml` 使用 npm 包名，只适用于安装后的 profile，不用于源码 overlay。

## 真实行为证据

先用 `--dump-config` 确认有效配置层，再在真实 Web/Headless 流程中调用 `example_greet`，检查成功、参数错误和插件卸载后的注册清理。HTTP 200、进程启动、静态 patch 检查和历史验收结果都不能替代当前最终身份对应的业务调用证据。完成后删除临时 `DSH_HOME`、临时 overlay 和生成 tarball。
