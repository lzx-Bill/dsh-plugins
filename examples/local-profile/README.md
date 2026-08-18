# Local profile overlay

This overlay loads the repository's only example plugin directly from the absolute TypeScript module
name `file:///E:/AI/dsh-plugins/packages/tool-example/src/index.ts`. Windows ESM loaders reject a
bare `E:/...` module name, so keep the URL form when moving the workspace. It is intentionally
separate from the published bundle patch, so local Harness development does not depend on npm
publication or a placeholder package scope.

From the built/source checkout at `E:\deepseek-harness`:

```powershell
Set-Location E:\deepseek-harness
pnpm dsh web --patch E:/AI/dsh-plugins/examples/local-profile/cordis.patch.yml
```

The overlay configures the example prefix as `Local`. The verified Web smoke returned HTTP 200 and
was then safely stopped; HTTP 200 is not business acceptance. Business acceptance was performed in
a clean profile from the installed package tarball, where `example_greet` with `Ada` returned
`Installed, Ada!`.
