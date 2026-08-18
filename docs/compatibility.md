# Harness 兼容矩阵

DeepSeek Harness 处于快速迭代阶段；插件必须绑定实际构建、运行过的宿主 commit，不使用
未核实的 `latest`。每个插件 README 和 release note 都应引用本表中的一行。

| 插件包 | 插件版本 | Harness tag/commit | Node | pnpm | 状态 |
| --- | --- | --- | --- | --- | --- |
| `@dsh-plugins-placeholder/tool-example` | `0.1.0` | `0.1.0-rc.7` / `99f6f02fecdb7dff40c3fbc9470f5907c29f74ca` | `24.11.1` | `11.7.0` | 本地验收通过；公开发布 NOT READY |

## 已记录证据

- workspace `pnpm verify`：4 tests PASS，包含真实 Cordis `ToolRuntime`；
- `E:\deepseek-harness` `pnpm run build`：PASS；
- 固定 tgz SHA-256：`D09B3BACB231FD30C6EFC3A365E35EC17EA4A0246DC6334F53CD79EE7A11D018`；
- 全新 profile package add、peer 检查和 `--dump-config`：PASS；
- 已安装 tgz 的 `example_greet` 调用返回 `Installed, Ada!`；
- Web overlay 返回 HTTP 200 后安全停止。该 HTTP 结果只属于入口 smoke，不是业务验收。

公开发布仍未就绪：npm scope、GitHub repository、Trusted Publisher/OIDC 未配置，且尚未
完成 registry clean install。

## 记录规则

- commit 必须是完整 SHA；同时记录支持的最小/最大宿主范围和所需 API；
- 宿主 breaking change 时新增矩阵行，并用 Changeset 发布相应版本；
- `--dump-config`、真实功能调用和清洁 profile 是“验收通过”的最低证据；
- 只有类型检查/单元测试时标记“静态验证”，不能写“验收通过”。
