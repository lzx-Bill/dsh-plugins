# Source and compatibility record

## Provenance

- Project: `@dsh-plugins-placeholder/tool-example`
- Package status: the repository currently contains this one plugin; local acceptance is complete,
  but public publication is not ready.
- Source: original example authored in this repository; no DeepSeek Harness source files were copied.
- API reference: `deepseek-ai/deepseek-harness` developer documentation and public package contracts.
- Harness source baseline inspected and locally built: commit
  `99f6f02fecdb7dff40c3fbc9470f5907c29f74ca` ( `0.1.0-rc.7` ).
- Runtime baseline: Node `24.11.1`, pnpm `11.7.0`,
  `@deepseek-ai/dsh-tools` `0.1.0-rc.7`.
- Referenced contracts: `docs/user/develop/basic/tool.md`,
  `docs/user/develop/basic/config.md`, and `docs/user/develop/basic/publish.md`.

## License

This package is released under the MIT License. The DeepSeek Harness project and its dependencies
retain their own licenses; this package does not redistribute their source.

## Compatibility assumptions

- The host provides the Cordis `tools` service named by `inject = ['tools']`.
- `@deepseek-ai/dsh-tools` continues to expose `defineTool` and the `ToolDefinition`
  execution/output contract used here.
- Bundle consumers resolve the package entry from `dsh.bundle.patch` and apply
  `cordis.patch.yml` as a patch list.
- The placeholder npm scope and GitHub repository are intentionally not publishable identities;
  replace them before the first public release.

## Local acceptance evidence

- Workspace `pnpm verify`: PASS, 4 tests including the real Cordis `ToolRuntime` path.
- Harness `pnpm run build`: PASS.
- Tarball `dsh-plugins-placeholder-tool-example-0.1.0.tgz` SHA-256:
  `D09B3BACB231FD30C6EFC3A365E35EC17EA4A0246DC6334F53CD79EE7A11D018`.
- A clean profile package add, peer check, and `--dump-config`: PASS.
- `example_greet` from the installed tarball returned `Installed, Ada!`.
- Web overlay returned HTTP 200 and was safely stopped. HTTP 200 is only an entry smoke result,
  not business acceptance.

Registry clean install has not been performed. npm scope, GitHub repository, and Trusted
Publisher/OIDC are not configured; therefore this package remains `NOT READY for public publish`.
