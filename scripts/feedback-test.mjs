import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('js/app.js', 'utf8');
const start = source.indexOf('function feedbackReactionLabel');
const end = source.indexOf('\nfunction resetProject()', start);
if (start < 0 || end < 0) throw new Error('feedback block not found');
const block = source.slice(start, end);
const store = new Map();
const elements = {
  feedbackScore: { value: '5 - Very useful' },
  feedbackNotes: { value: 'Clear and practical' },
  feedbackCsvInput: { value: '' }
};
let download = null;
const context = {
  console,
  FEEDBACK_KEY: 'feedback', LEGACY_FEEDBACK_KEYS: [],
  feedbackReviewFilters: { reaction: 'all', situation: 'all', build: 'all' },
  state: {
    analysisComplete: true, version: '8.6', propertyType: 'under-building', preference: 'balanced',
    constraint: 'shade-dark', starterCue: 'shade', selfTestMode: true, demoMode: false, photoDataUrl: 'x',
    recommendedFutureId: 'minimal', selectedFutureId: 'belonging', lastRunAt: '2026-07-14T00:00:00.000Z'
  },
  TYPE_PROFILES: {
    'under-building': { label: 'Under-building / shaded area', pattern: 'Sheltered Shade Pocket' },
    'needs-review': { label: 'Needs review', pattern: 'Guided' }
  },
  $: (id) => elements[id] || null,
  $$: () => [],
  runAnalysis: () => {},
  selectedFuture: () => ({ title: 'Belonging Garden' }),
  recommendedFuture: () => ({ title: 'Sanctuary Garden' }),
  preferenceLabel: () => 'Balanced', constraintLabel: () => 'Dark / shaded area', starterLabel: () => 'Looks shaded / under cover',
  addHistory: () => {}, toast: () => {}, renderHistory: () => {}, setFeedbackReactionState: () => {}, setText: () => {},
  escapeHtml: (v) => String(v), csvCell: (v) => `"${String(v).replaceAll('"', '""')}"`, unique: (items) => [...new Set(items)],
  readStoredArray: (key) => JSON.parse(store.get(key) || '[]'),
  localStorage: {
    setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k), getItem: (k) => store.get(k) ?? null
  },
  crypto: { randomUUID: (() => { let n = 0; return () => `unit-${++n}`; })() },
  globalThis: null,
  window: { confirm: () => true },
  downloadText: (filename, content, type) => { download = { filename, content, type }; },
  Date, JSON, String, Number, Map, Set, Array, Object, Math, Promise, setTimeout
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(block, context);
context.renderFeedbackReview = () => {};
context.renderHistory = () => {};

context.saveFeedback('useful');
let savedItems = JSON.parse(store.get('feedback'));
if (savedItems.length !== 1) throw new Error('first feedback save failed');
let saved = savedItems[0];
for (const key of ['timestamp', 'buildVersion', 'propertySituation', 'propertyPattern', 'recommendedFuture', 'selectedFuture', 'reaction', 'optionalNote', 'contextId', 'evidenceOrigin']) {
  if (!(key in saved)) throw new Error(`missing ${key}`);
}
if (saved.buildVersion !== 'v8.6' || saved.recommendedFuture !== 'Sanctuary Garden' || saved.selectedFuture !== 'Belonging Garden') throw new Error('new record values wrong');

// A second reaction on the unchanged board should update, not duplicate.
elements.feedbackScore.value = '3 - Somewhat useful';
elements.feedbackNotes.value = 'Changed reaction';
context.saveFeedback('confusing');
savedItems = JSON.parse(store.get('feedback'));
if (savedItems.length !== 1 || savedItems[0].reaction !== 'Confusing' || savedItems[0].optionalNote !== 'Changed reaction') throw new Error('same-context update failed');

const second = context.normaliseFeedbackItem({
  id: 'second', timestamp: '2026-07-13T00:00:00.000Z', buildVersion: 'v8.5', propertySituation: 'Blank canvas / new build',
  propertyPattern: 'Blank Canvas', recommendedFuture: 'Belonging Garden', selectedFuture: 'Belonging Garden', reaction: 'Useful', notes: 'Good'
}, 0);
store.set('feedback', JSON.stringify([savedItems[0], second]));
const all = context.getFeedback();
const counts = context.feedbackCounts(all);
if (counts.total !== 2 || counts.confusing !== 1 || counts.useful !== 1) throw new Error('counts wrong');
const disagreement = context.feedbackDisagreementStats(all);
if (disagreement.comparable !== 2 || disagreement.different !== 1 || disagreement.percent !== 50) throw new Error('disagreement stats wrong');
if (context.evidenceInsight([all[0]]).title !== 'One response only') throw new Error('single-record evidence threshold wrong');
const repeated = context.evidenceInsight([
  all[0],
  context.normaliseFeedbackItem({ ...all[0], id: 'third', timestamp: '2026-07-12T00:00:00.000Z' }, 2)
]);
if (repeated.title !== 'Repeated issue supported') throw new Error('repeated issue evidence threshold wrong');

context.feedbackReviewFilters.reaction = 'Useful';
const filtered = context.filteredFeedback(all);
if (filtered.length !== 1 || filtered[0].reaction !== 'Useful') throw new Error('reaction filter wrong');
context.feedbackReviewFilters.reaction = 'all';

context.exportFeedbackCsv();
if (download.filename !== 'verdeai-v8-6-feedback.csv' || !download.content.startsWith('\ufeff')) throw new Error('CSV filename/BOM wrong');
for (const label of ['Build version', 'Selected different from recommendation', 'Evidence origin', 'Context ID', 'Record ID']) {
  if (!download.content.includes(`"${label}"`)) throw new Error(`CSV missing ${label}`);
}
const parsed = context.parseCsvRows(download.content);
if (parsed.length !== 3 || !parsed[0].includes('Build version')) throw new Error('CSV parser failed');

// Import into a clean store and ensure record-ID deduplication.
store.set('feedback', '[]');
const fakeFile = { size: download.content.length, text: async () => download.content };
await context.importFeedbackCsvFile(fakeFile);
let imported = JSON.parse(store.get('feedback'));
if (imported.length !== 2 || !imported.every((item) => item.evidenceOrigin === 'Imported CSV')) throw new Error('CSV import failed');
await context.importFeedbackCsvFile(fakeFile);
imported = JSON.parse(store.get('feedback'));
if (imported.length !== 2) throw new Error('CSV import dedupe failed');

const legacy = context.normaliseFeedbackItem({ at: '2026-01-01T00:00:00Z', reaction: 'Confusing', notes: 'legacy note', future: 'Belonging Garden', propertyType: 'Old situation' }, 0);
if (legacy.reactionKey !== 'confusing' || legacy.optionalNote !== 'legacy note' || legacy.buildVersion !== 'Legacy build') throw new Error('legacy migration wrong');

console.log('VerdeAI v8.6 feedback unit test passed.');
