# Harness 兼容矩阵

DeepSeek Harness 处于 Developer Preview，插件必须绑定实际构建和运行过的宿主 commit，不能把 `latest` 当作兼容证据。身份、包名或宿主 API 发生变化后，必须新增或更新矩阵行并重新运行真实验收。

| 插件包 | 插件版本 | Harness tag/commit | Node | pnpm | 状态 |
| --- | --- | --- | --- | --- | --- |
| `@lzx-bill/dsh-tool-example` | `0.1.0` | `0.1.0-rc.7` / `99f6f02fecdb7dff40c3fbc9470f5907c29f74ca` | `24.11.1` | `11.7.0` | 本地 tarball 验收 PASS；registry NOT VERIFIED |

## 当前证据状态

最终身份 tarball `@lzx-bill/dsh-tool-example@0.1.0` 的 SHA-256 为 `415265D4A9B7D96FE39B9F5D8265B58031A1A7C3F459DE93829FF4969EB2440C`，包含 7 个预期文件。它已在隔离 Harness profile 中完成安装、peer 检查、`--dump-config` 和真实 `ToolRuntime` 调用，返回 `RegistryCandidate, Grace!`。该结果只证明本地 tarball 与固定宿主兼容；npm registry clean install 尚未执行。

发布与后续版本重新验收至少需要：

1. 在干净的插件 checkout 中执行 `pnpm install --frozen-lockfile`、`pnpm run verify` 和 `npm pack --dry-run`；
2. 在上表宿主 commit 中执行 `pnpm install --frozen-lockfile` 与 `pnpm run build`；
3. 复制并替换 [`examples/local-profile/cordis.patch.yml`](../examples/local-profile/cordis.patch.yml)，用专用 `DSH_HOME` 启动本地 Harness；
4. 用 `--dump-config` 确认插件行，并实际调用 `example_greet`；
5. 发布精确版本后，在全新 profile 从 registry 安装最终包名并重复第 3、4 步。

## 记录规则

- commit 必须是完整 SHA；同时记录支持的最小/最大宿主范围和所需 API；
- 宿主 breaking change 时新增矩阵行，并用 Changeset 发布相应版本；
- `--dump-config`、真实功能调用和清洁 profile 是“验收通过”的最低证据；
- 只有类型检查/单元测试时标记“静态验证”，不能写“验收通过”。
