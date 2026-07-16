import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync('js/app.js', 'utf8');
const start = source.indexOf('const FEEDBACK_EVIDENCE_LABELS');
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
  feedbackReviewFilters: { reaction: 'all', situation: 'all', build: 'all', evidence: 'all' },
  feedbackEvidenceOverride: '', feedbackIssueStageOverride: '', feedbackEvidenceBoardKey: '',
  state: {
    analysisComplete: true, version: '9.2', propertyType: 'under-building', preference: 'balanced',
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

// Self-test feedback must default to internal, never genuine tester evidence.
context.saveFeedback('useful');
let savedItems = JSON.parse(store.get('feedback'));
if (savedItems.length !== 1) throw new Error('first feedback save failed');
let internal = savedItems[0];
for (const key of ['timestamp', 'buildVersion', 'propertySituation', 'recommendedFuture', 'selectedFuture', 'evidenceKindKey', 'evidenceKind', 'issueStage']) {
  if (!(key in internal)) throw new Error(`missing ${key}`);
}
if (internal.buildVersion !== 'v9.2' || internal.evidenceKindKey !== 'internal') throw new Error('self-test was not classified as internal');
if (context.evidenceInsight(context.getFeedback()).title !== 'No genuine tester evidence in this view') throw new Error('internal evidence leaked into tester conclusion');

// The same board can save a separate genuine tester response without overwriting the internal check.
context.state.selfTestMode = false;
context.state.photoDataUrl = 'uploaded-photo';
context.feedbackEvidenceOverride = 'tester';
context.feedbackIssueStageOverride = 'navigation';
elements.feedbackScore.value = '3 - Somewhat useful';
elements.feedbackNotes.value = 'Navigation feels crowded on the phone';
context.saveFeedback('confusing');
savedItems = JSON.parse(store.get('feedback'));
if (savedItems.length !== 2) throw new Error('tester and internal records were not kept separate');
let tester = savedItems.find((item) => item.evidenceKindKey === 'tester');
if (!tester || tester.issueStageKey !== 'navigation' || tester.issueStage !== 'Navigation or mobile layout') throw new Error('tester evidence metadata wrong');
if (context.evidenceInsight([tester]).title !== 'One tester response only') throw new Error('single tester threshold wrong');

// A second click on the same unchanged tester board updates rather than duplicates.
elements.feedbackNotes.value = 'Navigation and mobile layout still feel crowded';
context.saveFeedback('not-believable');
savedItems = JSON.parse(store.get('feedback'));
if (savedItems.length !== 2) throw new Error('same tester context duplicate was not updated');
tester = savedItems.find((item) => item.evidenceKindKey === 'tester');
if (tester.reaction !== 'Not believable') throw new Error('tester context update failed');

const secondTester = context.normaliseFeedbackItem({
  id: 'tester-two', timestamp: '2026-07-13T00:00:00.000Z', buildVersion: 'v9.2', propertySituation: 'Blank canvas / new build',
  propertyPattern: 'Blank Canvas', recommendedFuture: 'Belonging Garden', selectedFuture: 'Belonging Garden', reaction: 'Confusing',
  notes: 'Mobile navigation feels crowded and confusing', evidenceKind: 'Tester response', issueStage: 'Navigation or mobile layout', source: 'Uploaded photo'
}, 0);
const combined = [context.normaliseFeedbackItem(tester), secondTester, context.normaliseFeedbackItem(internal)];
if (context.evidenceInsight(combined).title !== 'Repeated issue area supported') throw new Error('repeated tester issue area not detected');
if (!context.repeatedTesterNoteLanguage(combined).some((row) => row.label.includes('navigation'))) throw new Error('repeated tester wording not detected');

const counts = context.feedbackCounts(combined);
if (counts.total !== 3 || counts.tester !== 2 || counts.internal !== 1) throw new Error('evidence counts wrong');
const disagreement = context.feedbackDisagreementStats(context.testerEvidenceItems(combined));
if (disagreement.comparable !== 2 || disagreement.different !== 1 || disagreement.percent !== 50) throw new Error('tester disagreement stats wrong');

context.feedbackReviewFilters.evidence = 'Tester response';
store.set('feedback', JSON.stringify(combined));
const filtered = context.filteredFeedback(context.getFeedback());
if (filtered.length !== 2 || filtered.some((item) => item.evidenceKindKey !== 'tester')) throw new Error('evidence filter wrong');
context.feedbackReviewFilters.evidence = 'all';

context.exportFeedbackCsv();
if (download.filename !== 'verdeai-v9-2-feedback.csv' || !download.content.startsWith('\ufeff')) throw new Error('CSV filename/BOM wrong');
for (const label of ['Build version', 'Selected different from recommendation', 'Evidence origin', 'Evidence type', 'Issue area', 'Context ID', 'Record ID']) {
  if (!download.content.includes(`"${label}"`)) throw new Error(`CSV missing ${label}`);
}
const parsed = context.parseCsvRows(download.content);
if (parsed.length !== 4 || !parsed[0].includes('Evidence type')) throw new Error('CSV parser failed');

// Import into a clean store and ensure evidence type survives and record IDs deduplicate.
store.set('feedback', '[]');
const fakeFile = { size: download.content.length, text: async () => download.content };
await context.importFeedbackCsvFile(fakeFile);
let imported = JSON.parse(store.get('feedback'));
if (imported.length !== 3 || !imported.every((item) => item.evidenceOrigin === 'Imported CSV')) throw new Error('CSV import failed');
if (imported.filter((item) => item.evidenceKindKey === 'tester').length !== 2) throw new Error('CSV evidence classification lost');
await context.importFeedbackCsvFile(fakeFile);
imported = JSON.parse(store.get('feedback'));
if (imported.length !== 3) throw new Error('CSV import dedupe failed');

// Old records must not be silently promoted to genuine tester evidence.
const legacyUnknown = context.normaliseFeedbackItem({ at: '2026-01-01T00:00:00Z', reaction: 'Confusing', notes: 'legacy note', future: 'Belonging Garden', propertyType: 'Old situation', source: 'Uploaded photo' }, 0);
const legacySelfTest = context.normaliseFeedbackItem({ at: '2026-01-02T00:00:00Z', reaction: 'Useful', source: 'Shaded self-test' }, 1);
if (legacyUnknown.evidenceKindKey !== 'unclassified') throw new Error('legacy uploaded record was falsely promoted to tester');
if (legacySelfTest.evidenceKindKey !== 'internal') throw new Error('legacy self-test was not classified internal');

console.log('VerdeAI v9.2 feedback evidence unit test passed.');
