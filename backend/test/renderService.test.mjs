import test from 'node:test';
import assert from 'node:assert/strict';
import { handleRenderRequest, renderProvidersStatus, validateRenderRequest } from '../render/renderService.js';

const lockedEnv = {
  VERDEAI_REAL_RENDERING_ENABLED: 'false',
  VERDEAI_RENDER_KILL_SWITCH: 'true',
  VERDEAI_RENDER_TEST_MODE: 'true',
  VERDEAI_APPROVED_PROVIDER: 'not-approved',
  VERDEAI_APPROVED_BACKEND: 'not-approved',
  VERDEAI_RETENTION_POLICY: 'not-approved',
  VERDEAI_PILOT_SPEND_CAP_USD: '0',
  VERDEAI_INVITED_TESTER_LIMIT: '0'
};
Object.assign(process.env, lockedEnv);
delete process.env.OPENAI_API_KEY;

test('provider status exposes only mock as enabled with locked defaults', () => {
  const providers = renderProvidersStatus();
  assert.equal(providers.find((item) => item.id === 'mock')?.enabled, true);
  assert.equal(providers.find((item) => item.id === 'openai-gpt-image-2')?.enabled, false);
});

test('six-image request is rejected before any provider call', () => {
  assert.throws(() => validateRenderRequest({ provider: 'openai-gpt-image-2', count: 6 }), /exactly one rendered image/i);
});

test('real provider request is blocked by default', () => {
  const checked = validateRenderRequest({ provider: 'openai-gpt-image-2', count: 1, maxCostUsd: 0.15 }, { ip: '127.0.0.1' });
  assert.equal(checked.allowed, false);
  assert.equal(checked.blockReason, 'real-rendering-disabled');
});

test('mock request returns free calibrated-overlay fallback without a paid call', async () => {
  const result = await handleRenderRequest({ provider: 'mock', count: 1, selectedFuture: 'Gathering Space' }, { ip: '127.0.0.1' });
  assert.equal(result.ok, true);
  assert.equal(result.mode, 'mock-render');
  assert.equal(result.result.type, 'mock-fallback');
  assert.equal(result.estimatedCostUsd, 0);
});
