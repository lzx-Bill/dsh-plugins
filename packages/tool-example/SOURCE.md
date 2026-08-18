# Source and compatibility record

## Provenance

- Project: `@supercarlosluo/dsh-tool-example`.
- Repository: `https://github.com/lzx-Bill/dsh-plugins.git`, package directory `packages/tool-example`.
- Source: original example authored in this repository; no DeepSeek Harness source files were copied.
- API reference: `deepseek-ai/deepseek-harness` developer documentation and public package contracts.
- Referenced contracts: `docs/user/develop/basic/tool.md`, `docs/user/develop/basic/config.md`, and `docs/user/develop/basic/publish.md` from the DeepSeek Harness project.

## License

This package is released under the MIT License. The DeepSeek Harness project and its dependencies retain their own licenses; this package does not redistribute their source.

## Compatibility assumptions

- The host provides the Cordis `tools` service named by `inject = ['tools']`.
- `@deepseek-ai/dsh-tools` exposes `defineTool` and the `ToolDefinition` execution/output contract used here.
- Bundle consumers resolve the package entry from `dsh.bundle.patch` and apply `cordis.patch.yml` as a patch list.
- The compatibility row in [`docs/compatibility.md`](../../docs/compatibility.md) records the current local tarball runtime evidence and separately marks registry verification status.

## Identity-change rule

The repository identity remains `lzx-Bill/dsh-plugins`, while the npm package name is `@supercarlosluo/dsh-tool-example`. Version `0.1.0` has been rebuilt, inspected, installed from the npm registry into an isolated Harness profile, loaded through `--dump-config`, exercised through `ToolRuntime`, and removed cleanly. Current registry integrity and runtime evidence are recorded in [`docs/compatibility.md`](../../docs/compatibility.md).
