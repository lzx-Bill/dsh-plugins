/**
 * A deterministic, credential-free Host Tool example for DeepSeek Harness.
 *
 * The package intentionally keeps the first example small: it consumes only
 * the Harness tool registry, accepts one string, and returns one string.
 * @module @supercarlosluo/dsh-tool-example
 */

import type { Context } from '@deepseek-ai/cordis'
import Schema from '@deepseek-ai/schemastery'
import { defineTool } from '@deepseek-ai/dsh-tools'

/** Stable Cordis plugin name. */
export const name = 'dsh-tool-example'

/** The plugin waits for the shared Harness tool registry before applying. */
export const inject = ['tools']

/** Configuration for the deterministic greeting prefix. */
export interface Config {
  /** Text placed before the greeted name. */
  prefix: string
}

/** Runtime schema; Harness fills the default when the config is omitted. */
export const Config: Schema<Config> = Schema.object({
  prefix: Schema.string().min(1).default('Hello'),
})

/**
 * Register the example greeting tool.
 *
 * @param ctx - Cordis context with the injected Harness tool registry.
 * @param config - Validated plugin configuration.
 */
export function apply(ctx: Context, config: Config): void {
  const prefix = config.prefix.trim()
  if (prefix.length === 0) {
    throw new Error('dsh-tool-example: prefix must contain a non-whitespace character')
  }

  ctx.tools.register(defineTool({
    name: 'example_greet',
    description: 'Return a deterministic greeting for one name.',
    parameters: {
      name: {
        type: 'string',
        required: true,
        description: 'The name to greet.',
      },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args, exec) {
      exec.signal.throwIfAborted()
      return `${prefix}, ${args.name}!`
    },
  }))
}
