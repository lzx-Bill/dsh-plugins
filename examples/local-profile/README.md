# Local profile overlay

这个文件是公开仓库中的 overlay 模板，不包含任何维护者机器的绝对路径。它使用 `file:///ABSOLUTE_PATH_TO_DSH_PLUGINS/...` 标记；请复制到临时文件后替换标记，再交给 Harness 启动器。不要直接把未替换的模板当作可运行 patch，也不要把本机路径提交回仓库。

## Windows PowerShell

```powershell
$env:DSH_PLUGINS_ROOT = (Resolve-Path '<path-to-dsh-plugins>').Path
$env:DSH_HARNESS_ROOT = (Resolve-Path '<path-to-deepseek-harness>').Path
$privateOverlay = Join-Path $env:TEMP 'dsh-tool-example.patch.yml'
$source = Get-Content (Join-Path $env:DSH_PLUGINS_ROOT 'examples/local-profile/cordis.patch.yml') -Raw
$repoUrlPath = $env:DSH_PLUGINS_ROOT -replace '\\', '/'
$source.Replace('ABSOLUTE_PATH_TO_DSH_PLUGINS', $repoUrlPath) |
  Set-Content $privateOverlay -Encoding utf8

Set-Location $env:DSH_HARNESS_ROOT
pnpm install --frozen-lockfile
pnpm run build
pnpm dsh web --patch $privateOverlay
```

启动后在 Harness Web/Headless 流程中调用 `example_greet` 并传入 `Ada`，应返回 `Local, Ada!`。完成后删除 `$privateOverlay`；真实验收还需要在全新 profile 中安装构建后的包并重复 `--dump-config` 和工具调用。
