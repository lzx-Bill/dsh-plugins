# 安全策略

请不要在公开 issue、PR 或日志中披露密码、API key、Cookie、访问令牌、私有 profile
配置或可识别个人的信息。

## 报告漏洞

请优先使用 GitHub 的 **Private vulnerability reporting / Security advisory**，并提供：

- 受影响的包名和版本；
- 可复现步骤或最小示例；
- 影响范围（例如任意代码执行、凭据泄露、越权或数据破坏）；
- 已知的临时缓解措施。

如果仓库尚未启用 Private vulnerability reporting，请先通过维护者在 GitHub 个人资料中
公开的联系方式取得私下沟通渠道。维护者会确认收到报告、评估影响并在修复发布后更新
公告。请在协调完成前避免公开披露可直接利用的细节。

插件可能执行模型请求、访问本地文件或调用外部服务；每个包必须在 README 中说明权限、
网络行为、数据处理和副作用。
