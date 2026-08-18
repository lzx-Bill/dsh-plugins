# `@lzx-bill/dsh-tool-example`

这是一个用于 DeepSeek Harness 的最小 Host Tool Bundle 示例。它注册确定性的 `example_greet` 工具：输入姓名，返回带可配置前缀的问候语。插件只依赖 Harness 的 `tools` 服务，不访问网络、文件系统或外部凭据。

## 本地开发

本仓库的 [`examples/local-profile/cordis.patch.yml`](../../examples/local-profile/cordis.patch.yml) 是可复制的开发模板，其中的源码 URL 使用 `ABSOLUTE_PATH_TO_DSH_PLUGINS` 标记，不包含维护者机器路径。请按 [`examples/local-profile/README.md`](../../examples/local-profile/README.md) 复制模板到临时文件并替换标记，再启动本地 Harness。

```powershell
$env:DSH_PLUGINS_ROOT = (Resolve-Path '<path-to-dsh-plugins>').Path
$env:DSH_HARNESS_ROOT = (Resolve-Path '<path-to-deepseek-harness>').Path
# 复制并替换 overlay 后：
Set-Location $env:DSH_HARNESS_ROOT
pnpm dsh web --patch '<path-to-private-overlay>/tool-example.patch.yml'
```

overlay 的 `prefix` 配置为 `Local`。启动后在 Harness Web/Headless 流程中请求 `example_greet` 问候 `Ada`，应得到 `Local, Ada!`。这一步是本地真实行为验收的一部分；仅构建成功、进程启动或 HTTP 200 不足以证明工具行为正确。

## 配置与副作用

Bundle 默认配置如下：

```yaml
- insert:
    - id: dsh-tool-example
      name: '@lzx-bill/dsh-tool-example'
      config:
        prefix: 'Hello'
```

`prefix` 必须包含至少一个非空白字符。工具参数 `name` 必填，返回值始终是 `${prefix}, ${name}!` 的字符串。插件没有网络、文件、子进程、凭据、定时器或持久化副作用；工具执行只在当前 Harness 进程内计算字符串。

## 包级命令

在仓库根目录安装依赖后：

```powershell
pnpm --filter @lzx-bill/dsh-tool-example run typecheck
pnpm --filter @lzx-bill/dsh-tool-example test
pnpm --filter @lzx-bill/dsh-tool-example run build
pnpm --filter @lzx-bill/dsh-tool-example run pack
```

`pack` 使用 `npm pack --dry-run` 检查发布文件清单。发布前必须先生成 tarball，在全新 Harness profile 中安装并通过 `--dump-config` 检查 Bundle/插件行，再真实调用工具；人工发布 npm 包后，从 registry 的精确版本重复同一验收，验收通过后再创建 Git tag/GitHub Release。本仓库不提供自动发布 workflow。

## 兼容性与状态

代码依据 DeepSeek Harness `0.1.0-rc.7` 的 `defineTool`、Cordis `tools` 注入和 Bundle manifest API 编写；由于 Harness 处于 Developer Preview，发布前应以目标宿主的完整 commit 重新构建并验证。仓库身份和包名现已固定为 `lzx-Bill` / `@lzx-bill`；任何早于这次最终身份变更的占位包验收、tarball 或 registry 记录都不再是当前发布证据，必须重新执行完整 Gate。

## 许可证与来源

代码使用 MIT 许可证，来源与兼容性假设见 [`SOURCE.md`](SOURCE.md)。
