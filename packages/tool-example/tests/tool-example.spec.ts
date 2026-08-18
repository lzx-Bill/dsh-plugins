import Schema from '@deepseek-ai/schemastery'
import { Context } from '@deepseek-ai/cordis'
import SystemPrompt from '@deepseek-ai/dsh-system-prompt'
import ToolRuntime from '@deepseek-ai/dsh-tools'
import type { ToolDefinition } from '@deepseek-ai/dsh-tools'
import { describe, expect, it } from 'vitest'
import * as plugin from '../src/index.ts'
import { apply, Config, inject, name } from '../src/index.ts'

function createCaptureContext(): {
  context: Parameters<typeof apply>[0]
  registrations: ToolDefinition[]
} {
  const registrations: ToolDefinition[] = []
  const context = {
    tools: {
      register(tool: ToolDefinition): void {
        registrations.push(tool)
      },
    },
  } as unknown as Parameters<typeof apply>[0]
  return { context, registrations }
}

describe('tool-example plugin', () => {
  it('exports the named plugin entry points without a default export', () => {
    expect(name).toBe('dsh-tool-example')
    expect(inject).toEqual(['tools'])
    expect('default' in plugin).toBe(false)
  })

  it('uses the Config schema default and rejects an empty prefix', () => {
    expect(Schema.resolve({}, Config)[0]).toEqual({ prefix: 'Hello' })
    expect(Schema.resolve({ prefix: 'Welcome' }, Config)[0]).toEqual({ prefix: 'Welcome' })
    expect(() => Schema.resolve({ prefix: '' }, Config)).toThrow()
  })

  it('registers a real defineTool definition and executes it deterministically', async () => {
    const { context, registrations } = createCaptureContext()

    apply(context, { prefix: 'Welcome' })

    expect(registrations).toHaveLength(1)
    const tool = registrations[0]
    expect(tool.name).toBe('example_greet')
    expect(tool.parameters).toEqual({
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'The name to greet.',
        },
      },
      required: ['name'],
    })

    const exec = { signal: new AbortController().signal } as Parameters<ToolDefinition['execute']>[1]
    await expect(tool.execute({ name: 'Ada' }, exec)).resolves.toBe('Welcome, Ada!')
    await expect(tool.execute({}, exec)).rejects.toThrow()
    expect(tool.output.render({ name: 'Ada' }, 'Welcome, Ada!')).toEqual([{
      type: 'text',
      text: 'Welcome, Ada!',
    }])
  })

  it('executes through the real Cordis ToolRuntime pipeline', async () => {
    const ctx = new Context()
    await ctx.plugin(SystemPrompt)
    await ctx.plugin(ToolRuntime)
    await ctx.plugin(plugin, { prefix: 'Runtime' })

    const result = await ctx.tools.execute({
      signal: new AbortController().signal,
      callId: 'tool-example-runtime-1' as never,
      name: 'example_greet',
      arguments: { name: 'Ada' },
    })

    expect(result.isError).toBe(false)
    expect(result.content).toEqual([{ type: 'text', text: 'Runtime, Ada!' }])
    await ctx.fiber.dispose()
  })
})
