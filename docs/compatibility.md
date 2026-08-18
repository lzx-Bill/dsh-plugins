# Harness 兼容矩阵

DeepSeek Harness 处于 Developer Preview，插件必须绑定实际构建和运行过的宿主 commit，不能把 `latest` 当作兼容证据。身份、包名或宿主 API 发生变化后，必须新增或更新矩阵行并重新运行真实验收。

| 插件包 | 插件版本 | Harness tag/commit | Node | pnpm | 状态 |
| --- | --- | --- | --- | --- | --- |
| `@supercarlosluo/dsh-tool-example` | `0.1.0` | `0.1.0-rc.7` / `99f6f02fecdb7dff40c3fbc9470f5907c29f74ca` | `24.11.1` | `11.7.0` | npm registry clean install PASS |

## 当前证据状态

`@supercarlosluo/dsh-tool-example@0.1.0` 已从 npm registry 精确安装到全新隔离 profile；registry SHA-1 为 `af24925c99e9b1a05e0b34304eba3d5b22df7f30`，integrity 为 `sha512-vmoeL7Ox1Okc0ja3odTJkZYOW7c3v/sstARpWw0RpgKtzumlarstNZAyWX3uTMdH6zXbM4NX14ETu1i6bSBzUA==`，与 profile lockfile 一致。`--dump-config` 显示正确 bundle；真实 `Context + ToolRuntime` 成功调用返回 `Registry, Ada!`，缺少 `name` 返回参数错误；卸载后配置中不再出现插件。

发布与后续版本重新验收至少需要：

1. 在干净的插件 checkout 中执行 `pnpm install --frozen-lockfile`、`pnpm run verify` 和 `npm pack --dry-run`；
2. 在上表宿主 commit 中执行 `pnpm install --frozen-lockfile` 与 `pnpm run build`；
3. 复制并替换 [`examples/local-profile/cordis.patch.yml`](../examples/local-profile/cordis.patch.yml)，用专用 `DSH_HOME` 启动本地 Harness；
4. 用 `--dump-config` 确认插件行，并实际调用 `example_greet`；
5. 发布精确版本后，在全新 profile 从 registry 安装 `@supercarlosluo/dsh-tool-example@<version>` 并重复第 3、4 步。

## 记录规则

- commit 必须是完整 SHA；同时记录支持的最小/最大宿主范围和所需 API；
- 宿主 breaking change 时新增矩阵行，并用 Changeset 发布相应版本；
- `--dump-config`、真实功能调用和清洁 profile 是“验收通过”的最低证据；
- 只有类型检查/单元测试时标记“静态验证”，不能写“验收通过”。
