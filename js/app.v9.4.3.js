const BUILD_VERSION = "9.4.3";
const $ = (id) => document.getElementById(id);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function announce(message) {
  const status = $("appStatus");
  if (!status) return;
  status.textContent = "";
  window.setTimeout(() => { status.textContent = String(message || ""); }, 20);
}

const STORAGE_KEY = "verdeai_v5_7_projects";
const FEEDBACK_KEY = "verdeai_v5_7_feedback";
const HISTORY_KEY = "verdeai_v5_7_history";
const LEGACY_STORAGE_KEYS = ["verdeai_v5_5_projects", "verdeai_v5_3_projects", "verdeai_v5_1_projects", "verdeai_v5_0_projects", "verdeai_v4_9_projects", "verdeai_v4_7_projects", "verdeai_v4_5_projects", "verdeai_v4_3_projects", "verdeai_v4_2_projects", "verdeai_v4_1_projects", "verdeai_v3_9_projects", "verdeai_v3_7_projects", "verdeai_v3_6_projects", "verdeai_v3_5_projects", "verdeai_v3_4_projects", "verdeai_v3_3_projects", "verdeai_v3_2_projects", "verdeai_v3_1_projects", "verdeai_v3_0_projects", "verdeai_v2_9_projects", "verdeai_v2_8_projects", "verdeai_v2_7_projects", "verdeai_v2_6_projects", "verdeai_v2_5_projects", "verdeai_v2_4_projects", "verdeai_v2_3_projects", "verdeai_v2_2_projects"];
const LEGACY_FEEDBACK_KEYS = ["verdeai_v5_5_feedback", "verdeai_v5_3_feedback", "verdeai_v5_1_feedback", "verdeai_v5_0_feedback", "verdeai_v4_9_feedback", "verdeai_v4_7_feedback", "verdeai_v4_5_feedback", "verdeai_v4_3_feedback", "verdeai_v4_2_feedback", "verdeai_v4_1_feedback", "verdeai_v3_9_feedback", "verdeai_v3_7_feedback", "verdeai_v3_6_feedback", "verdeai_v3_5_feedback", "verdeai_v3_4_feedback", "verdeai_v3_3_feedback", "verdeai_v3_2_feedback", "verdeai_v3_1_feedback", "verdeai_v3_0_feedback", "verdeai_v2_9_feedback", "verdeai_v2_8_feedback", "verdeai_v2_7_feedback", "verdeai_v2_6_feedback", "verdeai_v2_5_feedback", "verdeai_v2_4_feedback", "verdeai_v2_3_feedback", "verdeai_v2_2_feedback"];
const LEGACY_HISTORY_KEYS = ["verdeai_v5_5_history", "verdeai_v5_3_history", "verdeai_v5_1_history", "verdeai_v5_0_history", "verdeai_v4_9_history", "verdeai_v4_7_history", "verdeai_v4_5_history", "verdeai_v4_3_history", "verdeai_v4_2_history", "verdeai_v4_1_history", "verdeai_v3_9_history", "verdeai_v3_7_history", "verdeai_v3_6_history", "verdeai_v3_5_history", "verdeai_v3_4_history", "verdeai_v3_3_history", "verdeai_v3_2_history", "verdeai_v3_1_history", "verdeai_v3_0_history", "verdeai_v2_9_history", "verdeai_v2_8_history", "verdeai_v2_7_history", "verdeai_v2_6_history", "verdeai_v2_5_history", "verdeai_v2_4_history", "verdeai_v2_3_history", "verdeai_v2_2_history"];

const SESSION_KEY = "verdeai_v5_7_current_session";
const LEGACY_SESSION_KEYS = ["verdeai_v5_5_current_session", "verdeai_v5_3_current_session", "verdeai_v5_1_current_session", "verdeai_v5_0_current_session", "verdeai_v4_9_current_session", "verdeai_v4_7_current_session", "verdeai_v4_5_current_session", "verdeai_v4_3_current_session", "verdeai_v4_2_current_session", "verdeai_v4_1_current_session", "verdeai_v3_9_current_session", "verdeai_v3_7_current_session", "verdeai_v3_6_current_session", "verdeai_v3_5_current_session", "verdeai_v3_4_current_session", "verdeai_v3_3_current_session", "verdeai_v3_2_current_session", "verdeai_v3_1_current_session", "verdeai_v3_0_current_session", "verdeai_v2_9_current_session", "verdeai_v2_8_current_session", "verdeai_v2_7_current_session", "verdeai_v2_6_current_session"];
const SESSION_SAVE_DELAY_MS = 220;
const RENDER_SETTINGS_KEY = "verdeai_v5_7_render_settings";
const LEGACY_RENDER_SETTINGS_KEYS = ["verdeai_v5_5_render_settings", "verdeai_v5_3_render_settings", "verdeai_v5_1_render_settings", "verdeai_v5_0_render_settings", "verdeai_v4_9_render_settings", "verdeai_v4_7_render_settings", "verdeai_v4_5_render_settings", "verdeai_v4_3_render_settings", "verdeai_v4_2_render_settings", "verdeai_v4_1_render_settings", "verdeai_v3_9_render_settings", "verdeai_v3_7_render_settings", "verdeai_v3_6_render_settings", "verdeai_v3_5_render_settings", "verdeai_v3_4_render_settings", "verdeai_v3_3_render_settings", "verdeai_v3_2_render_settings"];
const RENDER_PROVIDER_COSTS = {
  none: { label: "Free calibrated overlay", perImage: 0, maxPerImage: 0, note: "No provider call. The calibrated concept overlay remains fully usable." },
  "openai-gpt-image-2": { label: "OpenAI GPT Image 2", perImage: 0.08, maxPerImage: 0.15, note: "Prepared planning estimate for one medium landscape image edit. Actual API usage is token-based and must be rechecked before activation." }
};
const PILOT_MAX_COST_USD = 0.15;
const PILOT_MAX_IMAGE_BYTES = 2_621_440;
const PILOT_MAX_LONG_EDGE = 1536;
const PILOT_TIMEOUT_MS = 120_000;
const OWNER_ACTIVATION_PLAN = Object.freeze({
  provider: "OpenAI GPT Image 2",
  backendHost: "Cloudflare Worker Paid",
  pilotBudget: "US$10 total · US$5 provider reservation cap · US$0.15 request ceiling",
  testerLimit: "10 invited testers · one render per session · two per IP per 24 hours",
  retentionPolicy: "No VerdeAI server image storage; disclose provider processing and retention",
  approvals: Object.freeze({ provider: true, backendHost: true, pilotBudget: true, testerLimit: true, retentionPolicy: true })
});
const PILOT_SESSION_KEY = "verdeai_v9_3_2_pilot_session";
const PILOT_LOCAL_SAFE_LOCK_KEY = "verdeai_v9_3_2_local_safe_lock";
const pilotRuntime = {
  health: null,
  healthError: "",
  healthCheckedAt: 0,
  checkingHealth: false,
  liveResult: null,
  requestAbort: null,
  localSafeLock: false
};

const FUTURES = [
  {
    id: "belonging",
    icon: "🏡",
    title: "Feature Garden",
    subtitle: "One strong focal composition, supported by lower planting and clear open ground.",
    color: "#0b5c40",
    tint: "rgba(11, 92, 64, .30)",
    tags: ["arrival", "identity", "comfort"],
    bestFor: ["balanced", "income", "front-yard", "foundation", "needs-review", "under-building"],
    visualLabels: ["main focal plant", "supporting low planting", "clear open ground"],
    baseWhy: "This future creates one memorable focal composition without cluttering the whole property."
  },
  {
    id: "minimal",
    icon: "🌾",
    title: "Low-Maintenance Haven",
    subtitle: "Restrained repeated planting, clean structure, and generous negative space.",
    color: "#6b7f2a",
    tint: "rgba(107, 127, 42, .28)",
    tags: ["calm", "low care", "retreat"],
    bestFor: ["minimal", "low-maintenance", "blank", "backyard", "under-building"],
    visualLabels: ["repeat one plant mass", "clean edge line", "mulched low-care zone"],
    baseWhy: "This future reduces decision fatigue and makes the space easier to keep tidy."
  },
  {
    id: "wildlife",
    icon: "🦋",
    title: "Wildlife Haven",
    subtitle: "Dense habitat layers, flowering variation, shelter, and organic plant groupings.",
    color: "#2f714a",
    tint: "rgba(47, 113, 74, .34)",
    tags: ["potential", "habitat", "flexible"],
    bestFor: ["wildlife", "overgrown", "side-yard", "backyard", "under-building"],
    visualLabels: ["layered habitat", "pollinator strip", "small water/shelter point"],
    baseWhy: "This future turns unused edges into habitat instead of just decoration."
  },
  {
    id: "gathering",
    icon: "🔥",
    title: "Gathering Space",
    subtitle: "Seating, warm light, and a clear reason to gather.",
    color: "#a34c05",
    tint: "rgba(163, 76, 5, .28)",
    tags: ["seating", "lighting", "social"],
    bestFor: ["outdoor-living", "courtyard", "backyard"],
    visualLabels: ["seating circle", "evening lighting", "defined outdoor room"],
    baseWhy: "This future gives the space a reason to be used, not just looked at."
  },
  {
    id: "productive",
    icon: "🍋",
    title: "Food Garden",
    subtitle: "Recognisable edible beds, herbs, productive edges, and clear working paths.",
    color: "#537a2d",
    tint: "rgba(83, 122, 45, .30)",
    tags: ["food", "useful", "seasonal"],
    bestFor: ["food", "backyard", "blank"],
    visualLabels: ["raised productive bed", "herb edge", "compost/service corner"],
    baseWhy: "This future makes the garden useful and rewarding, especially where there is open sun."
  },
  {
    id: "maker",
    icon: "🔧",
    title: "Maker / Workshop Yard",
    subtitle: "Storage, access, project space, and tidy workflow.",
    color: "#405a68",
    tint: "rgba(64, 90, 104, .32)",
    tags: ["workshop", "storage", "workflow"],
    bestFor: ["maker", "workshop", "utility", "side-yard"],
    visualLabels: ["protected work zone", "storage boundary", "clear access path"],
    baseWhy: "This future protects usefulness so the area does not slowly become random storage soup."
  }
];

const TYPE_PROFILES = {
  "needs-review": {
    label: "Photo uploaded / help me choose",
    pattern: "Guided First Pass",
    secondary: "Human Clues Needed",
    noticed: ["A real photo is loaded, but this build still needs your clues before it can make a fair call.", "Use the starter suggestions if the area is shaded, awkward, under a building, overgrown, or utility-heavy.", "The app should ask better questions instead of pretending it can fully see the image."],
    warning: "Do not trust a first pass until the situation and main problem match what you can actually see.",
    dnaBoost: { potential: 10, identity: -2, flow: 4, maintenance: 2 }
  },
  blank: {
    label: "Blank canvas / new build",
    pattern: "Blank Canvas",
    secondary: "Identity Discovery",
    noticed: ["Few fixed features are forcing one clear direction.", "The first decision matters more than the first plant.", "A small test zone can prevent random spending."],
    warning: "Do not start with shopping. Start by choosing the role of the space.",
    dnaBoost: { potential: 18, identity: -5, flow: 3, maintenance: 4 }
  },
  "front-yard": {
    label: "Front yard / street appeal",
    pattern: "Arrival Space",
    secondary: "Public Face",
    noticed: ["This area affects first impressions more than people realise.", "A clear entry path or feature will carry the design.", "Street-facing spaces usually need structure before detail."],
    warning: "Avoid scattering small features everywhere. One confident arrival move beats ten nervous decorations.",
    dnaBoost: { identity: 12, flow: 10, value: 14, privacy: 2 }
  },
  backyard: {
    label: "Backyard / open lawn",
    pattern: "Flexible Backyard",
    secondary: "Use Before Ornament",
    noticed: ["Open space is useful, but it needs a stronger reason to stay open.", "Edges and destinations can do more than filling the middle.", "The main risk is mowing a space nobody loves."],
    warning: "Do not fill the centre first. Decide what should happen around the edges and where people naturally pause.",
    dnaBoost: { gathering: 12, potential: 8, flow: 5 }
  },
  foundation: {
    label: "House edge / foundation bed",
    pattern: "Foundation Rescue",
    secondary: "Scale + Layering",
    noticed: ["The building is the dominant backdrop.", "Repeated plant masses will work better than one-of-everything planting.", "Depth, rhythm, and height transitions matter here."],
    warning: "Tiny scattered plants can make a wall look bigger. Use repeated groups and enough scale.",
    dnaBoost: { identity: 8, privacy: 4, maintenance: 5, value: 8 }
  },
  "side-yard": {
    label: "Side yard / narrow space",
    pattern: "Passage Space",
    secondary: "Movement + Utility",
    noticed: ["This is likely a movement zone, not a full garden room.", "Narrow spaces work best with rhythm and access kept clear.", "Vertical ideas can do more than filling the floor."],
    warning: "Do not block access. Side yards punish over-excitement fast.",
    dnaBoost: { flow: 15, maintenance: 8, privacy: 8 }
  },
  courtyard: {
    label: "Courtyard / patio",
    pattern: "Outdoor Room",
    secondary: "Comfort + Boundaries",
    noticed: ["The value is the activity, not the object.", "Comfort, shade, lighting, and edges will decide whether people use it.", "A seating area needs enough room to move."],
    warning: "Do not make the seating circle too small. Humans need elbow room; chairs are sneaky little space thieves.",
    dnaBoost: { gathering: 18, identity: 8, flow: 4 }
  },
  "under-building": {
    label: "Under-building / shaded area",
    pattern: "Sheltered Shade Pocket",
    secondary: "Light + Access Limits",
    noticed: ["Overhead structure, columns, hard edges, or permanent shade can decide what will actually work.", "Low-light planting, clean access, and utility access matter more than flower-heavy decoration.", "This kind of space usually needs tidy edges and one clear route before it needs more features."],
    warning: "Do not choose sun-loving plants for a shaded pocket. They will sulk dramatically, and nobody has time for plant theatre.",
    dnaBoost: { flow: 12, utility: 10, maintenance: 8, habitat: 4, gathering: -3 }
  },
  workshop: {
    label: "Workshop / shed / maker area",
    pattern: "Maker Territory",
    secondary: "Capability Potential",
    noticed: ["The value is usefulness, not tidiness.", "Workflow and access matter more than decoration.", "Storage can quietly eat the whole space if it is not contained."],
    warning: "Protect one permanent work zone or the area will turn into storage soup.",
    dnaBoost: { utility: 18, identity: 5, maintenance: -3 }
  },
  overgrown: {
    label: "Overgrown / tired garden",
    pattern: "Recovery Garden",
    secondary: "Reveal Before Rebuild",
    noticed: ["There may be useful structure hidden under the mess.", "Cutting back before redesigning will reveal what is worth keeping.", "The best first move is observation and selective clearing."],
    warning: "Do not rip everything out on day one. Some of the good stuff may be hiding like a shy garden goblin.",
    dnaBoost: { habitat: 12, potential: 12, maintenance: -8 }
  },
  utility: {
    label: "Awkward object / utility zone",
    pattern: "Functional Disguise",
    secondary: "Access Must Remain",
    noticed: ["The object may not be the real problem; lack of context is.", "Any disguise must preserve access.", "A small feature or removable screen may be better than a permanent cover."],
    warning: "Do not hide something you still need to service. Future you will say rude words.",
    dnaBoost: { utility: 16, flow: 7, identity: -2 }
  },
  slope: {
    label: "Slope / wall / drainage",
    pattern: "Landscape Systems",
    secondary: "Stability Before Beauty",
    noticed: ["Water, grade, and gravity matter more than styling here.", "Planting should support the system, not hide a structural problem.", "Drainage clues deserve attention before money is spent."],
    warning: "Do not cosmetic-fix a systems problem. Soil and water do not care about vibes.",
    dnaBoost: { utility: 12, flow: 8, maintenance: -4 }
  }
};


const SCENARIO_FUTURE_BOOSTS = {
  blank: { belonging: 40, productive: 8, minimal: 4, maker: -8 },
  "front-yard": { belonging: 26, minimal: 8, wildlife: 4, maker: -12 },
  "under-building": { minimal: 28, wildlife: 10, belonging: 6, gathering: -12, productive: -14 },
  overgrown: { wildlife: 46, minimal: 0, belonging: 3, gathering: -8, productive: -4 },
  workshop: { maker: 38, minimal: 7, belonging: -5, gathering: -12, productive: -8 },
  utility: { maker: 30, minimal: 12, belonging: 2, gathering: -10 },
  "side-yard": { maker: 12, minimal: 14, belonging: 4 },
  slope: { wildlife: 10, minimal: 8, productive: -12 }
};

const SCENARIO_GUIDES = {
  blank: {
    diagnosis: "The space has freedom but no hierarchy yet. One anchor, one open zone, and one clear edge will stop it becoming a shopping-list garden.",
    labels: ["mark one anchor point", "keep a flexible open zone", "define one strong edge", "test scale from the main view"],
    firstMove: "Use hose, chairs, or buckets to mark one destination, one open zone, and one boundary; view it from the house and street before buying anything."
  },
  "front-yard": {
    diagnosis: "The entry sequence is doing the heavy lifting. A readable path, one welcoming focal point, and repeated edge planting will create street appeal without clutter.",
    labels: ["clarify the arrival path", "repeat one planting edge", "place one welcome feature", "protect the street-to-door view"],
    firstMove: "Walk from the street to the door, then mark the clearest arrival line and one focal point with temporary pots or stakes."
  },
  "under-building": {
    diagnosis: "Permanent shade, hard surfaces, columns, and service access are the real design brief. The win is a dry clear route plus tough low-light structure.",
    labels: ["protect the dry access line", "keep columns/services clear", "build one shade planting mass", "soften the brightest hard edge"],
    firstMove: "Check the darkest and brightest patches at midday, then chalk one access line and one low-light planting or mulch zone that stays clear of columns and services."
  },
  overgrown: {
    diagnosis: "The useful bones are hidden. Selective clearing should reveal paths, mature structure, and salvageable edges before anything is removed permanently.",
    labels: ["reveal one walking line", "flag plants worth keeping", "clear one inspection strip", "mulch the recovered edge"],
    firstMove: "Clear one narrow inspection strip for 30 minutes, flag what stays, and photograph the revealed edge before deciding what to remove next."
  },
  workshop: {
    diagnosis: "Workflow beats decoration here. A permanent work pad, a bulky-item route, bounded storage, and safe separation from planting will keep the area usable.",
    labels: ["protect the bulky-item route", "reserve a permanent work pad", "contain storage inside one edge", "keep a safe planting buffer"],
    firstMove: "Carry the bulkiest normal item from entry to bench, tape that route on the ground, then mark one storage boundary that cannot spread across it."
  },
  utility: {
    diagnosis: "The service object must stay reachable. A removable screen, tidy service path, and one deliberate edge will make it look intentional without creating a maintenance trap.",
    labels: ["keep the service path open", "use a removable screen line", "frame the utility edge", "leave inspection clearance"],
    firstMove: "Mark the access needed to service the object, then test a removable screen position with cardboard or temporary pots outside that clearance."
  }
};

const CONSTRAINT_PROFILES = {
  unsure: {
    label: "Not sure yet",
    problem: "The real problem is still being discovered.",
    nudge: "Use one small test to reveal whether the space needs structure, privacy, use, or recovery first.",
    boost: { potential: 6 },
    futureBoost: {}
  },
  "too-open": {
    label: "Too open / no purpose",
    problem: "The space has room, but not enough role.",
    nudge: "Give the open area one job before filling it with features.",
    boost: { identity: 10, potential: 8, gathering: 4 },
    futureBoost: { belonging: 14, minimal: 8, gathering: 8 }
  },
  "messy-edge": {
    label: "Messy edge or ugly boundary",
    problem: "The edges are doing too much visual damage.",
    nudge: "Fix the boundary rhythm first; the middle can stay simple.",
    boost: { identity: 9, maintenance: 7, value: 7 },
    futureBoost: { minimal: 13, belonging: 10, wildlife: 4 }
  },
  "privacy-gap": {
    label: "Needs privacy",
    problem: "The space feels too exposed or visually open.",
    nudge: "Test one screen line before planting the whole boundary.",
    boost: { privacy: 22, identity: 4 },
    futureBoost: { belonging: 6, wildlife: 8, gathering: 6, minimal: 3 }
  },
  unused: {
    label: "Nobody really uses it",
    problem: "The area exists, but it does not invite behaviour.",
    nudge: "Create a reason to stop, sit, work, harvest, or walk through deliberately.",
    boost: { gathering: 15, utility: 7, potential: 6 },
    futureBoost: { gathering: 16, productive: 7, maker: 7 }
  },
  "shade-dark": {
    label: "Dark / shaded area",
    problem: "Light levels are probably limiting plant choice and comfort.",
    nudge: "Work with the shade: clean the edges, keep access clear, then use tough low-light planting or mulch.",
    boost: { maintenance: 10, flow: 7, habitat: 6 },
    futureBoost: { minimal: 14, wildlife: 10, belonging: 6 }
  },
  "maintenance-drag": {
    label: "Too much upkeep",
    problem: "The current setup asks for more work than it gives back.",
    nudge: "Simplify repetition, edges, mulch, and access before adding delicate plants.",
    boost: { maintenance: 20, flow: 4 },
    futureBoost: { minimal: 22, belonging: 6 }
  },
  "water-risk": {
    label: "Drainage / water concern",
    problem: "Water behaviour may decide what survives.",
    nudge: "Treat drainage and soil movement as the first design feature, not an afterthought.",
    boost: { flow: 16, utility: 12, maintenance: -4 },
    futureBoost: { wildlife: 8, minimal: 6 }
  },
  "storage-creep": {
    label: "Storage or clutter creep",
    problem: "Useful stuff is slowly taking control of the space.",
    nudge: "Create one contained storage boundary and one clear working path.",
    boost: { utility: 22, flow: 8, identity: -2 },
    futureBoost: { maker: 24, minimal: 8 }
  },
  "access-awkward": {
    label: "Access feels awkward",
    problem: "Movement through the area is not clean enough yet.",
    nudge: "Protect the walking route first; everything else must respect that line.",
    boost: { flow: 22, utility: 8 },
    futureBoost: { maker: 9, minimal: 9, belonging: 4 }
  }
};

const state = {
  version: BUILD_VERSION,
  recommendedFutureId: "belonging",
  photoDataUrl: "",
  photoName: "",
  photoMeta: {},
  demoMode: false,
  propertyType: "needs-review",
  preference: "balanced",
  postcode: "",
  budget: "weekend",
  maintenance: "low",
  constraint: "unsure",
  note: "",
  analysisComplete: false,
  selectedFutureId: "belonging",
  visualMode: "recommended",
  calibration: null,
  designRefinements: [],
  intensity: 3,
  dna: {},
  noticed: [],
  climate: {},
  history: [],
  lastRunAt: null,
  starterCue: "",
  analysisSnapshot: null,
  selfTestMode: false,
  aiRender: { provider: "none", connected: false, lastMockRenders: [], flowState: "idle", flowMessage: "", preparedImage: null }
};

const feedbackReviewFilters = { reaction: "all", situation: "all", build: "all", evidence: "all" };
let feedbackEvidenceOverride = "";
let feedbackIssueStageOverride = "";
let feedbackEvidenceBoardKey = "";
const calibrationUi = { open: false, tool: "usable", undo: [], pendingKeepClear: null, dragging: false };
let conceptSvgSerial = 0;

const STARTER_PRESETS = [
  { id: "shade", label: "Looks shaded / under cover", propertyType: "under-building", constraint: "shade-dark", note: "Photo clue: shaded or under-building area with low light. Keep access clear and use tough low-light planting or mulch." },
  { id: "blank", label: "Mostly blank / open", propertyType: "blank", constraint: "too-open", note: "Photo clue: mostly blank or open area with no clear role yet. Mark one anchor, one open zone, and one strong edge before buying." },
  { id: "access", label: "Path/access feels awkward", propertyType: "overgrown", constraint: "access-awkward", note: "Photo clue: movement through the area feels awkward. Protect a clear walking route before adding features." },
  { id: "tired", label: "Overgrown or tired", propertyType: "overgrown", constraint: "maintenance-drag", note: "Photo clue: tired or overgrown planting. Reveal what is worth keeping before redesigning." },
  { id: "workshop", label: "Workshop / storage area", propertyType: "workshop", constraint: "storage-creep", note: "Photo clue: workshop or shed area where tools, storage, and access compete. Protect one work pad and one clear bulky-item route." },
  { id: "utility", label: "Utility object / tank / services", propertyType: "utility", constraint: "access-awkward", note: "Photo clue: utility or service object nearby. Improve appearance without blocking future access." },
  { id: "edge", label: "Messy edges / bare soil", propertyType: "foundation", constraint: "messy-edge", note: "Photo clue: bare soil, messy edges, or hard surface meeting planting. Fix the edge line first." }
];

function init() {
  prepareAccessibility();
  wireTabs();
  wireInputs();
  wireButtons();
  loadHistory();
  loadRenderSettings();
  try { pilotRuntime.localSafeLock = sessionStorage.getItem(PILOT_LOCAL_SAFE_LOCK_KEY) === "true"; } catch { pilotRuntime.localSafeLock = false; }
  const restored = restoreCurrentSession();
  renderAll();
  window.setTimeout(() => refreshPilotHealth({ force: false, announceResult: false }), 120);
  if (restored) {
    setProgress(state.analysisComplete ? 100 : 45, "Session restored", state.analysisComplete ? `${TYPE_PROFILES[state.propertyType]?.label || "Property"}: ${TYPE_PROFILES[state.propertyType]?.pattern || "analysis"}.` : "Previous photo/clues restored. Continue from the green Next best action card.");
    toast("Previous VerdeAI session restored");
  } else {
    setProgress(0, "Ready", "Upload a photo or use demo mode to begin.");
  }
  window.addEventListener("pagehide", persistCurrentSessionNow);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") persistCurrentSessionNow();
  });
}

function prepareAccessibility() {
  $$(".screen").forEach((screen) => {
    screen.tabIndex = -1;
    screen.setAttribute("aria-hidden", screen.classList.contains("active") ? "false" : "true");
  });
  $$(".tab").forEach((tab) => {
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", tab.classList.contains("active") ? "true" : "false");
    tab.tabIndex = 0;
  });
}

function wireTabs() {
  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", (event) => {
      event.preventDefault();
      const tabId = btn.dataset.tab;
      if (!tabId) return;
      activateTab(tabId, { scroll: true, feedback: true, trigger: btn });
      const moreTools = $("moreToolsDetails");
      if (moreTools && btn.closest(".advanced-tab-list")) moreTools.open = false;
    });
    btn.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const tabs = $$(".tab").filter((item) => item.getClientRects().length && !item.disabled);
      const current = tabs.indexOf(btn);
      if (current < 0) return;
      event.preventDefault();
      let next = current;
      if (event.key === "ArrowLeft") next = (current - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") next = (current + 1) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      tabs[next]?.focus();
    });
  });
  const moreTools = $("moreToolsDetails");
  const moreToolsSummary = $("moreToolsSummary");
  moreToolsSummary?.addEventListener("click", () => window.setTimeout(() => toast(moreTools?.open ? "More tools opened" : "More tools closed"), 0));
  moreToolsSummary?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") window.setTimeout(() => toast(moreTools?.open ? "More tools opened" : "More tools closed"), 0);
  });
}

function wireInputs() {
  const photoInput = $("photoInput");
  photoInput?.addEventListener("change", handlePhotoInput);

  ["propertyType", "preferenceSelect", "postcodeInput", "budgetSelect", "maintenanceSelect", "constraintSelect", "propertyNote", "renderProviderSelect", "renderApiKeyInput"].forEach((id) => {
    $(id)?.addEventListener("input", () => {
      syncStateFromForm();
      if (state.analysisComplete) {
        runAnalysis({ quiet: true });
      } else {
        renderAll();
      }
    });
  });

  const drop = $("uploadDrop");
  if (drop) {
    ["dragenter", "dragover"].forEach((eventName) => drop.addEventListener(eventName, (event) => {
      event.preventDefault();
      drop.classList.add("dragover");
    }));
    ["dragleave", "drop"].forEach((eventName) => drop.addEventListener(eventName, () => drop.classList.remove("dragover")));
    drop.addEventListener("drop", (event) => {
      event.preventDefault();
      const file = event.dataTransfer?.files?.[0];
      if (file) readPhoto(file);
    });
  }

  $$(".design-toggle").forEach((input) => input.addEventListener("change", () => {
    state.designRefinements = $$(".design-toggle:checked").map((x) => x.value);
    restoreAnalysisSnapshot();
    renderAll();
  }));

  $("styleIntensity")?.addEventListener("input", () => {
    state.intensity = Number($("styleIntensity")?.value || 3);
    restoreAnalysisSnapshot();
    renderDesign();
    renderVisionBoard();
    renderReports();
  });
}

function wireButtons() {
  $("analyseBtn")?.addEventListener("click", () => runAnalysis());
  $("demoBtn")?.addEventListener("click", enableDemoMode);
  $$(".self-test-btn").forEach((btn) => btn.addEventListener("click", runShadedGardenSelfTest));
  $("saveProjectBtn")?.addEventListener("click", saveProject);
  $("resetBtn")?.addEventListener("click", resetProject);
  $("copyReportBtn")?.addEventListener("click", () => copyText(reportText(), "Report copied"));
  $("copyFullReportBtn")?.addEventListener("click", () => copyText(reportText({ full: true }), "Full report copied"));
  $("copyTesterSummaryBtn")?.addEventListener("click", () => { copyText(testerSummaryText(), "Tester summary copied"); addHistory("Tester summary copied", selectedFuture().title); renderAll(); });
  $("testerPageCopySummaryBtn")?.addEventListener("click", () => { copyText(testerSummaryText(), "Tester summary copied"); addHistory("Tester page summary copied", selectedFuture().title); renderAll(); });
  $("copyTesterInviteBtn")?.addEventListener("click", copyTesterInvite);
  $("dashboardCopyBtn")?.addEventListener("click", () => { copyText(cleanTesterResultText(), "Clean dashboard result copied"); addHistory("Dashboard result copied", selectedFuture().title); renderAll(); });
  $("dashboardCopyTopBtn")?.addEventListener("click", () => { copyText(cleanTesterResultText(), "Clean dashboard result copied"); addHistory("Dashboard result copied", selectedFuture().title); renderAll(); });
  $("exportCopyCleanResultBtn")?.addEventListener("click", () => { copyText(cleanTesterResultText(), "Clean tester result copied"); addHistory("Clean tester result copied", selectedFuture().title); renderAll(); });
  $("createBoardBtn")?.addEventListener("click", createPropertyFuturesBoard);
  $("dashboardAdjustConceptBtn")?.addEventListener("click", () => openConceptCalibration("Top result control"));
  $$(`[data-open-ai-setup]`).forEach((btn) => btn.addEventListener("click", () => {
    openAiSetup("AI Setup opened");
  }));
  $$(`[data-view-render-roadmap]`).forEach((btn) => btn.addEventListener("click", () => {
    openAiSetup("Render roadmap opened", "aiRenderRoadmapTitle");
  }));
  $("copyRenderChecklistBtn")?.addEventListener("click", copyRenderChecklist);
  $("copyOwnerApprovalRequestBtn")?.addEventListener("click", copyOwnerApprovalRequest);
  $("resetOwnerSafeStateBtn")?.addEventListener("click", resetOwnerSafeState);
  $("smartNextBtn")?.addEventListener("click", handleSmartNextAction);
  $("copyTesterChecklistBtn")?.addEventListener("click", copyTesterChecklist);
  $("copyShareCodeBtn")?.addEventListener("click", copyShareCode);
  $("importShareCodeBtn")?.addEventListener("click", importShareCode);
  $("printBtn")?.addEventListener("click", () => window.print());
  $("printFullReportBtn")?.addEventListener("click", () => window.print());
  $("downloadJsonBtn")?.addEventListener("click", downloadProjectJson);
  $("saveFeedbackBtn")?.addEventListener("click", () => saveFeedback());
  $$('[data-feedback-reaction]').forEach((btn) => btn.addEventListener("click", () => saveQuickFeedback(btn.dataset.feedbackReaction)));
  $("clearSavedBtn")?.addEventListener("click", clearSavedProjects);
  $("exportFeedbackBtn")?.addEventListener("click", exportFeedbackCsv);
  $("clearFeedbackBtn")?.addEventListener("click", clearFeedback);
  $("feedbackReactionFilter")?.addEventListener("change", (event) => { feedbackReviewFilters.reaction = event.target.value; renderFeedbackReview(); });
  $("feedbackSituationFilter")?.addEventListener("change", (event) => { feedbackReviewFilters.situation = event.target.value; renderFeedbackReview(); });
  $("feedbackBuildFilter")?.addEventListener("change", (event) => { feedbackReviewFilters.build = event.target.value; renderFeedbackReview(); });
  $("feedbackEvidenceFilter")?.addEventListener("change", (event) => { feedbackReviewFilters.evidence = event.target.value; renderFeedbackReview(); });
  $$('[data-feedback-evidence-kind]').forEach((control) => control.addEventListener("change", (event) => {
    feedbackEvidenceOverride = event.target.value;
    syncFeedbackEvidenceControls();
  }));
  $$('[data-feedback-issue-stage]').forEach((control) => control.addEventListener("change", (event) => {
    feedbackIssueStageOverride = event.target.value;
    syncFeedbackEvidenceControls();
  }));
  $("feedbackResetFiltersBtn")?.addEventListener("click", resetFeedbackFilters);
  $("feedbackCsvInput")?.addEventListener("change", (event) => importFeedbackCsvFile(event.target.files?.[0]));
  $("saveRenderSettingsBtn")?.addEventListener("click", saveRenderSettings);
  $("clearRenderSettingsBtn")?.addEventListener("click", clearRenderSettings);
  $("renderFutureSelect")?.addEventListener("change", (event) => {
    const picked = FUTURES.find((future) => future.id === event.target.value);
    if (picked) {
      state.selectedFutureId = picked.id;
      state.visualMode = "selected";
      addHistory("Render future selected", picked.title);
      toast(`Render preview: ${picked.title}`);
      renderAll();
    }
  });
  $("renderSelectedFutureBtn")?.addEventListener("click", openAiRenderConfirmation);
  $("dashboardCreateAiRenderBtn")?.addEventListener("click", openAiRenderConfirmation);
  $("closeAiRenderDialogBtn")?.addEventListener("click", closeAiRenderConfirmation);
  $("cancelAiRenderBtn")?.addEventListener("click", closeAiRenderConfirmation);
  $("aiRenderConfirmForm")?.addEventListener("submit", submitOneRenderPilot);
  $("testTimeoutStateBtn")?.addEventListener("click", () => setAiRenderFlowState("timeout"));
  $("testProviderErrorStateBtn")?.addEventListener("click", () => setAiRenderFlowState("provider-error"));
  $("testBudgetLockStateBtn")?.addEventListener("click", () => setAiRenderFlowState("budget-lock"));
  $("checkPilotConnectionBtn")?.addEventListener("click", () => refreshPilotHealth({ force: true, announceResult: true }));
  $("applyDesignBtn")?.addEventListener("click", () => {
    state.designRefinements = $$(".design-toggle:checked").map((x) => x.value);
    state.intensity = Number($("styleIntensity")?.value || 3);
    restoreAnalysisSnapshot();
    toast("Refinement applied — analysis kept");
    addHistory("Design refinement applied", `Refinements: ${state.designRefinements.map(labelForRefinement).join(", ") || "balanced"}`);
    renderAll();
  });
  $("clearDesignBtn")?.addEventListener("click", () => {
    $$(".design-toggle").forEach((input) => { input.checked = false; });
    state.designRefinements = [];
    state.intensity = 3;
    if ($("styleIntensity")) $("styleIntensity").value = "3";
    restoreAnalysisSnapshot();
    toast("Refinements cleared — analysis kept");
    renderAll();
  });
}

function handlePhotoInput(event) {
  const file = event.target.files?.[0];
  if (file) readPhoto(file);
}

async function readPhoto(file) {
  if (!file.type.startsWith("image/")) {
    toast("Please choose an image file");
    return;
  }
  setProgress(15, "Preparing photo", "Compressing large photos so the browser save stays light.");
  try {
    const compressed = await compressImageFile(file);
    setUploadedImage(compressed.dataUrl, file.name, compressed.meta);
  } catch {
    const fallback = await readFileAsDataUrl(file);
    setUploadedImage(fallback, file.name, { originalBytes: file.size, storedBytes: fallback.length, compressed: false });
  }
}

function setUploadedImage(dataUrl, name, meta = {}) {
  state.photoDataUrl = dataUrl;
  state.photoName = name;
  state.photoMeta = meta;
  state.demoMode = false;
  state.selfTestMode = false;
  state.analysisComplete = false;
  state.selectedFutureId = "belonging";
  state.calibration = null;
  calibrationUi.open = false;
  calibrationUi.undo = [];
  clearAnalysisSnapshot();
  if (["blank", "front-yard", "backyard"].includes(state.propertyType) || !state.starterCue) state.propertyType = "needs-review";
  if (!state.starterCue) state.constraint = "unsure";
  setFormFromState();
  $("photoPreview").src = state.photoDataUrl;
  $("uploadDrop")?.classList.add("has-image");
  setProgress(30, "Photo uploaded", "Tap one starter clue. VerdeAI will run the first useful analysis automatically.");
  addHistory("Photo uploaded", name);
  toast(meta.compressed ? "Photo compressed and loaded" : "Photo loaded");
  renderAll();
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(String(event.target?.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function compressImageFile(file, maxDimension = 1600, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = Math.min(1, maxDimension / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * ratio));
      const height = Math.max(1, Math.round(img.height * ratio));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d", { alpha: false });
      ctx.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(objectUrl);
      const type = file.type === "image/png" ? "image/jpeg" : "image/jpeg";
      const dataUrl = canvas.toDataURL(type, quality);
      resolve({
        dataUrl,
        meta: {
          originalBytes: file.size,
          storedBytes: Math.round((dataUrl.length * 3) / 4),
          originalSize: `${img.width}×${img.height}`,
          storedSize: `${width}×${height}`,
          compressed: dataUrl.length < file.size * 1.35 || ratio < 1
        }
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image compression failed"));
    };
    img.src = objectUrl;
  });
}

function enableDemoMode() {
  state.demoMode = true;
  state.selfTestMode = false;
  state.photoDataUrl = "assets/demo-overgrown-garden.jpg";
  state.photoName = "Built-in overgrown garden demo";
  state.photoMeta = { compressed: false, demo: true, storedSize: "600×600 bundled demo · natural-ratio preview" };
  state.propertyType = "overgrown";
  state.preference = "balanced";
  state.postcode = "3941";
  state.budget = "weekend";
  state.maintenance = "low";
  state.constraint = "maintenance-drag";
  state.note = "Overgrown garden with hidden edges, crowded growth, salvageable structure, and an unclear walking route.";
  state.starterCue = "overgrown";
  state.calibration = {
    version: 1,
    scenario: "recovery",
    customised: false,
    usable: [point(18, 250), point(982, 215), point(982, 624), point(18, 624)],
    keepClear: [
      { id: "upper-boundary", x: 0, y: 0, width: 1000, height: 190 },
      { id: "stored-materials", x: 755, y: 245, width: 240, height: 390 }
    ],
    access: [point(95, 600), point(590, 330)],
    opportunity: point(500, 455),
    firstMove: point(260, 515)
  };
  calibrationUi.open = false;
  calibrationUi.undo = [];
  setFormFromState();
  if ($("photoPreview")) $("photoPreview").src = state.photoDataUrl;
  $("uploadDrop")?.classList.add("has-image");
  runAnalysis({ forceSelection: true });
}

function runShadedGardenSelfTest() {
  state.demoMode = false;
  state.selfTestMode = true;
  state.photoDataUrl = shadedSelfTestImage();
  state.photoName = "Built-in shaded garden self-test";
  state.photoMeta = { selfTest: true, storedSize: "self-test SVG", compressed: false };
  state.propertyType = "under-building";
  state.preference = "balanced";
  state.postcode = "3941";
  state.budget = "weekend";
  state.maintenance = "low";
  state.constraint = "shade-dark";
  state.note = "Self-test: shaded under-building area with concrete columns, hard surfaces, low light, awkward access, and bare soil edges.";
  state.starterCue = "shade";
  state.designRefinements = [];
  state.intensity = 3;
  state.calibration = null;
  calibrationUi.open = false;
  state.analysisComplete = false;
  clearAnalysisSnapshot();
  setFormFromState();
  if ($("photoPreview")) $("photoPreview").src = state.photoDataUrl;
  $("uploadDrop")?.classList.add("has-image");
  setProgress(70, "Self-test running", "Simulating photo upload, shaded starter clue, analysis, report, Vision Board, and saved project.");
  addHistory("Self-test started", "Built-in shaded garden flow");
  runAnalysis({ quiet: true });
  addHistory("Self-test analysis generated", `${TYPE_PROFILES[state.propertyType].pattern} → ${selectedFuture().title}`);
  saveSelfTestProject();
  setProgress(100, "Self-test complete", `${TYPE_PROFILES[state.propertyType].label}: ${TYPE_PROFILES[state.propertyType].pattern}. Report, Vision Board, Export, and Saved are ready.`);
  toast("Shaded garden self-test complete");
  showGeneratedBoard("self-test");
}

function saveSelfTestProject() {
  const f = selectedFuture();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const items = getSavedProjects();
  const title = `Self-test: ${profile.pattern} → ${f.title}`;
  const summary = `${profile.label}. ${roadmapData()[0].task}`;
  const duplicateIndex = items.findIndex((item) => item.title === title);
  const card = { title, summary, savedAt: new Date().toISOString(), state: serialiseState() };
  if (duplicateIndex >= 0) items.splice(duplicateIndex, 1);
  items.unshift(card);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
  addHistory("Self-test project saved", `${profile.pattern} → ${f.title}`);
  persistCurrentSessionNow();
}

function shadedSelfTestImage() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 820" role="img" aria-label="Shaded under-building garden self-test image">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c8d3c0"/><stop offset="1" stop-color="#7f8b77"/></linearGradient>
      <linearGradient id="soil" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5d5546"/><stop offset="1" stop-color="#2f342d"/></linearGradient>
      <filter id="soft"><feGaussianBlur stdDeviation="8"/></filter>
    </defs>
    <rect width="1200" height="820" fill="url(#sky)"/>
    <rect y="0" width="1200" height="185" fill="#263029" opacity=".92"/>
    <rect x="0" y="185" width="1200" height="70" fill="#424941" opacity=".9"/>
    <rect x="0" y="255" width="1200" height="565" fill="url(#soil)"/>
    <rect x="120" y="160" width="82" height="585" rx="12" fill="#59615a"/>
    <rect x="540" y="145" width="92" height="610" rx="12" fill="#535c55"/>
    <rect x="940" y="155" width="80" height="590" rx="12" fill="#59615a"/>
    <path d="M80 690 C300 625 490 635 680 560 C820 505 950 520 1130 450 L1130 820 L80 820 Z" fill="#2e3a2f" opacity=".9"/>
    <path d="M70 620 C280 590 430 570 605 515 C790 455 920 430 1115 385" fill="none" stroke="#a79572" stroke-width="38" stroke-linecap="round" opacity=".52"/>
    <path d="M108 606 C294 578 438 553 595 505 C780 447 920 420 1090 378" fill="none" stroke="#dfcfaa" stroke-width="11" stroke-linecap="round" opacity=".62"/>
    <ellipse cx="330" cy="575" rx="165" ry="85" fill="#314832" opacity=".82"/>
    <ellipse cx="790" cy="488" rx="210" ry="92" fill="#374d38" opacity=".85"/>
    <circle cx="305" cy="520" r="54" fill="#506348"/><circle cx="372" cy="548" r="44" fill="#42533e"/><circle cx="742" cy="430" r="56" fill="#526b4a"/><circle cx="836" cy="462" r="62" fill="#40543d"/>
    <rect x="885" y="292" width="128" height="174" rx="18" fill="#717a71" opacity=".8"/>
    <circle cx="950" cy="292" r="64" fill="#818a82" opacity=".82"/>
    <path d="M0 255 L1200 255 L1200 360 C820 315 470 335 0 390 Z" fill="#111712" opacity=".28" filter="url(#soft)"/>
    <text x="46" y="775" font-family="Arial, sans-serif" font-size="34" fill="#f5f0df" opacity=".82">Built-in shaded garden self-test</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function syncStateFromForm() {
  state.propertyType = $("propertyType")?.value || state.propertyType;
  state.preference = $("preferenceSelect")?.value || state.preference;
  state.postcode = ($("postcodeInput")?.value || "").trim();
  state.budget = $("budgetSelect")?.value || state.budget;
  state.maintenance = $("maintenanceSelect")?.value || state.maintenance;
  state.constraint = $("constraintSelect")?.value || state.constraint;
  state.note = ($("propertyNote")?.value || "").trim();
  state.intensity = Number($("styleIntensity")?.value || 3);
  state.aiRender = normaliseRenderSettings(state.aiRender);
  if ($("renderProviderSelect")) state.aiRender.provider = $("renderProviderSelect").value || state.aiRender.provider;
  if ($("renderApiKeyInput")) state.aiRender.connected = false;
}

function setFormFromState() {
  if ($("propertyType")) $("propertyType").value = state.propertyType;
  if ($("preferenceSelect")) $("preferenceSelect").value = state.preference;
  if ($("postcodeInput")) $("postcodeInput").value = state.postcode;
  if ($("budgetSelect")) $("budgetSelect").value = state.budget;
  if ($("maintenanceSelect")) $("maintenanceSelect").value = state.maintenance;
  if ($("constraintSelect")) $("constraintSelect").value = state.constraint;
  if ($("propertyNote")) $("propertyNote").value = state.note;
  if ($("styleIntensity")) $("styleIntensity").value = String(state.intensity);
  if ($("renderProviderSelect")) $("renderProviderSelect").value = state.aiRender?.provider || "none";
  if ($("renderApiKeyInput")) $("renderApiKeyInput").value = "Worker connection is verified separately · no API key in browser";
  syncDesignControlsFromState();
}

function syncDesignControlsFromState() {
  const selected = new Set(state.designRefinements || []);
  $$(".design-toggle").forEach((input) => { input.checked = selected.has(input.value); });
  if ($("styleIntensity")) $("styleIntensity").value = String(state.intensity || 3);
}

function runAnalysis(options = {}) {
  const wasComplete = Boolean(state.analysisComplete);
  const previousSelection = state.selectedFutureId;
  syncStateFromForm();
  if (state.propertyType === "needs-review" && state.photoDataUrl && state.constraint === "unsure") {
    setProgress(55, "Guided first pass", "Photo loaded. Because no clue was chosen, VerdeAI is using a cautious first pass instead of guessing blank canvas.");
  }
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const climate = climateFromPostcode(state.postcode);
  const noteSignals = extractNoteSignals(state.note);
  const ranked = rankFutures(profile, noteSignals);
  state.recommendedFutureId = ranked[0]?.id || "belonging";
  const previousIsValid = FUTURES.some((future) => future.id === previousSelection);
  state.selectedFutureId = !wasComplete || options.forceSelection || !previousIsValid ? state.recommendedFutureId : previousSelection;
  state.visualMode = !wasComplete || options.forceSelection ? "recommended" : normaliseVisualMode();
  ensureCalibration({ resetIfUncustomised: true });
  state.dna = buildDna(profile, noteSignals, climate);
  state.noticed = buildNoticed(profile, noteSignals, climate);
  state.climate = climate;
  state.analysisComplete = true;
  state.lastRunAt = new Date().toISOString();
  captureAnalysisSnapshot();
  if (!options.quiet) {
    setProgress(100, "Analysis complete", `${profile.label}: ${profile.pattern}. Top future: ${selectedFuture().title}.`);
    addHistory("Analysis generated", `${profile.pattern} → ${selectedFuture().title}`);
    toast("Analysis complete");
  }
  renderAll();
}

function captureAnalysisSnapshot() {
  state.analysisSnapshot = {
    propertyType: state.propertyType,
    preference: state.preference,
    postcode: state.postcode,
    budget: state.budget,
    maintenance: state.maintenance,
    constraint: state.constraint,
    note: state.note,
    selectedFutureId: state.selectedFutureId,
    recommendedFutureId: state.recommendedFutureId,
    dna: { ...(state.dna || {}) },
    noticed: [...(state.noticed || [])],
    climate: state.climate ? { ...state.climate, notes: [...(state.climate.notes || [])] } : {},
    starterCue: state.starterCue,
    lastRunAt: state.lastRunAt
  };
}

function restoreAnalysisSnapshot() {
  const snap = state.analysisSnapshot;
  if (!snap || !state.analysisComplete) return false;
  state.propertyType = snap.propertyType || state.propertyType;
  state.preference = snap.preference || state.preference;
  state.postcode = snap.postcode || "";
  state.budget = snap.budget || state.budget;
  state.maintenance = snap.maintenance || state.maintenance;
  state.constraint = snap.constraint || state.constraint;
  state.note = snap.note || "";
  // Keep the user's current future selection; the snapshot protects analysis inputs, not card choice.
  state.recommendedFutureId = snap.recommendedFutureId || state.recommendedFutureId || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note))[0]?.id || "belonging";
  state.dna = { ...(snap.dna || {}) };
  state.noticed = [...(snap.noticed || [])];
  state.climate = snap.climate ? { ...snap.climate, notes: [...(snap.climate.notes || [])] } : {};
  state.starterCue = snap.starterCue || "";
  state.lastRunAt = snap.lastRunAt || state.lastRunAt;
  setFormFromState();
  syncDesignControlsFromState();
  return true;
}

function clearAnalysisSnapshot() {
  state.analysisSnapshot = null;
}

function extractNoteSignals(note) {
  const text = note.toLowerCase();
  const signals = new Set();
  const patterns = [
    ["privacy", ["privacy", "neighbour", "fence", "screen", "screening", "private"]],
    ["shade", ["shade", "shaded", "dark", "low light", "under cover", "under-building", "under building", "columns", "pillar", "concrete", "hot", "sun", "heat", "summer"]],
    ["access", ["access", "path", "walk", "walking", "route", "entry", "movement", "awkward"]],
    ["edge", ["edge", "border", "boundary", "bare soil", "mulch", "messy", "tidy"]],
    ["utility", ["tank", "water tank", "services", "pipe", "utility", "meter", "drain", "tap"]],
    ["wildlife", ["bird", "birds", "bee", "bees", "butterfly", "wildlife", "native", "habitat"]],
    ["food", ["food", "veggie", "vegetable", "herb", "fruit", "citrus", "edible"]],
    ["low-maintenance", ["easy", "simple", "less", "low maintenance", "mowing", "mow", "tidy"]],
    ["gathering", ["seating", "family", "friends", "bbq", "fire", "patio", "kids", "entertain"]],
    ["maker", ["shed", "workshop", "tools", "build", "repair", "welding", "woodwork", "storage"]],
    ["value", ["sell", "value", "street", "appeal", "income", "money"]],
    ["water", ["water", "drain", "drainage", "mud", "wet", "slope"]]
  ];
  patterns.forEach(([signal, words]) => {
    if (words.some((word) => text.includes(word))) signals.add(signal);
  });
  if (!note) signals.add("needs-input");
  return Array.from(signals);
}

function climateFromPostcode(postcode) {
  const pc = String(postcode || "").trim();
  if (!pc) {
    return { label: "No postcode supplied", notes: ["Use hardy, locally available plants until climate data is connected."], confidence: "low" };
  }
  const n = Number(pc.slice(0, 1));
  const firstTwo = Number(pc.slice(0, 2));
  if (pc.startsWith("39")) {
    return { label: "Coastal / temperate southern clue", notes: ["Plan for wind tolerance, salt exposure in some areas, summer dryness, and winter wet periods.", "Use staged planting and mulch so the garden survives hot spells."], confidence: "medium" };
  }
  if (n === 3) return { label: "Temperate southern clue", notes: ["Consider summer heat, cool winters, variable rainfall, and drought-ready planting."], confidence: "medium" };
  if (n === 2) return { label: "Warm temperate clue", notes: ["Expect warmer summers and plant for heat resilience and water efficiency."], confidence: "low-medium" };
  if (firstTwo >= 40 && firstTwo <= 49) return { label: "Subtropical clue", notes: ["Allow for humidity, strong growth, shade, and stormwater behaviour."], confidence: "low-medium" };
  if (firstTwo >= 60 && firstTwo <= 69) return { label: "Western dry-summer clue", notes: ["Prioritise drought tolerance, soil improvement, shade, and water-wise irrigation."], confidence: "low-medium" };
  return { label: "General climate clue", notes: ["Climate engine is still basic. Confirm local rainfall, frost, heat, and soil before planting."], confidence: "low" };
}

function rankFutures(profile, noteSignals) {
  const preference = state.preference;
  const type = state.propertyType;
  const scores = FUTURES.map((future) => {
    let score = 50;
    if (future.bestFor.includes(preference)) score += 24;
    if (future.bestFor.includes(type)) score += 18;
    if (noteSignals.some((s) => future.bestFor.includes(s))) score += 18;
    if (preference === "balanced" && ["belonging", "minimal", "wildlife"].includes(future.id)) score += 8;
    if (state.maintenance === "low" && future.id === "minimal") score += 18;
    if (state.maintenance === "high" && ["productive", "maker", "wildlife"].includes(future.id)) score += 8;
    if (state.budget === "weekend" && ["minimal", "belonging", "maker"].includes(future.id)) score += 7;
    if (noteSignals.includes("shade") && ["minimal", "wildlife", "belonging"].includes(future.id)) score += 7;
    if (noteSignals.includes("access") && ["minimal", "maker", "belonging"].includes(future.id)) score += 6;
    score += constraintProfile().futureBoost?.[future.id] || 0;
    score += SCENARIO_FUTURE_BOOSTS[type]?.[future.id] || 0;
    if (profile.pattern === "Landscape Systems" && future.id === "productive") score -= 8;
    const rankScore = score;
    const displayScore = clamp(Math.round(48 + ((rankScore - 50) * 0.55)), 35, 96);
    return { ...future, score: displayScore, rankScore };
  });
  return scores.sort((a, b) => b.rankScore - a.rankScore);
}

function buildDna(profile, noteSignals, climate) {
  const dna = {
    identity: 62,
    flow: 58,
    privacy: 48,
    habitat: 48,
    gathering: 52,
    utility: 46,
    maintenance: 58,
    potential: 70,
    value: 52
  };
  Object.entries(profile.dnaBoost || {}).forEach(([key, value]) => { dna[key] = (dna[key] || 50) + value; });
  Object.entries(constraintProfile().boost || {}).forEach(([key, value]) => { dna[key] = (dna[key] || 50) + value; });
  noteSignals.forEach((signal) => {
    if (signal === "privacy") dna.privacy += 20;
    if (signal === "wildlife") dna.habitat += 20;
    if (signal === "gathering") dna.gathering += 18;
    if (signal === "maker") dna.utility += 22;
    if (signal === "food") dna.utility += 8;
    if (signal === "value") dna.value += 20;
    if (signal === "water") dna.flow += 10;
    if (signal === "shade") { dna.maintenance += 7; dna.habitat += 5; }
    if (signal === "access") dna.flow += 12;
    if (signal === "edge") { dna.identity += 6; dna.maintenance += 4; }
    if (signal === "utility") dna.utility += 12;
    if (signal === "low-maintenance") dna.maintenance += 14;
  });
  if (state.preference === "minimal" || state.preference === "low-maintenance") dna.maintenance += 12;
  if (state.preference === "income") dna.value += 18;
  if (state.preference === "outdoor-living") dna.gathering += 14;
  if (state.preference === "wildlife") dna.habitat += 14;
  if (state.preference === "maker") dna.utility += 18;
  if (climate.label.includes("Coastal")) dna.maintenance += 4;
  Object.keys(dna).forEach((key) => { dna[key] = clamp(Math.round(dna[key]), 8, 96); });
  return dna;
}

function buildNoticed(profile, noteSignals, climate) {
  const lines = [...profile.noticed];
  const visible = visibleSiteLanguage(profile, noteSignals).filter((line) => !line.startsWith("Photo is used"));
  visible.slice(0, 2).forEach((line) => lines.push(line));
  const constraint = constraintProfile();
  if (state.constraint !== "unsure") lines.push(`${constraint.label}: ${constraint.nudge}`);
  if (noteSignals.includes("privacy")) lines.push("Privacy or screening is a real pressure, so the design should create cover without blocking movement.");
  if (noteSignals.includes("low-maintenance")) lines.push("Low-care choices matter here: repeat materials, simplify edges, and avoid fiddly feature creep.");
  if (noteSignals.includes("maker")) lines.push("The space needs workflow and access, not just visual polish.");
  if (noteSignals.includes("water")) lines.push("Water or drainage may need checking before planting decisions.");
  if (noteSignals.includes("shade")) lines.push("Shade or overhead cover makes plant choice and edge quality more important than flower-heavy detail.");
  if (noteSignals.includes("access")) lines.push("The overlay protects a clear route first, then adds softer zones around it.");
  if (state.postcode) lines.push(`Postcode clue: ${climate.label}.`);
  return unique(lines).slice(0, 6);
}

function renderAll() {
  renderPhotoSurfaces();
  renderStarterSuggestions();
  renderQuickStatus();
  renderPublicBetaChecklist();
  renderFlowCoach();
  renderTesterPage();
  renderInsights();
  renderFutures();
  renderRecommendation();
  renderNextSteps();
  renderReports();
  renderCompare();
  renderPlan();
  renderDesign();
  renderAISetup();
  renderExport();
  renderDashboard();
  renderTesterHealth();
  renderHistory();
  renderVisionBoard();
  renderSavedProjects();
  renderFeedbackReview();
  renderSessionRecovery();
  syncFeedbackEvidenceControls();
  scheduleSessionPersist();
}

function renderPhotoSurfaces() {
  const upload = $("uploadDrop");
  const preview = $("photoPreview");
  if (state.photoDataUrl && preview) {
    preview.src = state.photoDataUrl;
    upload?.classList.add("has-image");
  }
}

function renderInsights() {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  const subtitle = state.analysisComplete
    ? `${profile.label} detected as ${profile.pattern}. Results tuned for ${preferenceLabel(state.preference)} and ${constraintLabel(state.constraint).toLowerCase()}.`
    : "The cards will become more specific once you run an analysis.";
  setText("resultsSubtitle", subtitle);
  renderDnaList("propertyDnaMini", state.analysisComplete ? state.dna : buildDna(profile, [], { label: "" }), ["identity", "flow", "privacy", "habitat", "gathering", "maintenance"]);
  const noticed = state.analysisComplete ? state.noticed : profile.noticed;
  $("noticedList").innerHTML = noticed.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
  setText("warningText", state.analysisComplete ? profile.warning : "Run the analysis first. The garden oracle refuses to guess before coffee.");
  renderSiteClues(profile);
  setText("analysisBrief", analysisBrief(profile));
  setText("firstMoveBanner", state.analysisComplete ? firstMoveFor(profile, recommendedFuture()) : "Run the analysis and VerdeAI will choose one cheap, reversible action to test.");
}

function renderDnaList(containerId, dna, keys) {
  const labels = { identity: "Identity", flow: "Flow", privacy: "Privacy", habitat: "Habitat", gathering: "Gathering", utility: "Utility", maintenance: "Low care", potential: "Potential", value: "Value" };
  const container = $(containerId);
  if (!container) return;
  container.innerHTML = keys.map((key) => {
    const value = dna[key] ?? 50;
    return `<div class="dna-row"><b>${labels[key] || key}</b><div class="meter" aria-label="${labels[key] || key} ${value} percent"><span style="--w:${value}%"></span></div><small>${value}</small></div>`;
  }).join("");
}

function renderFutures() {
  const ranked = rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note));
  const grid = $("futureGrid");
  if (!grid) return;
  grid.innerHTML = ranked.map((future) => futureCardHtml(future)).join("");
  $$(".future-card", grid).forEach((card) => {
    card.addEventListener("click", () => {
      state.selectedFutureId = card.dataset.futureId;
      state.visualMode = "selected";
      addHistory("Future selected", selectedFuture().title);
      renderAll();
      toast(`${selectedFuture().title} selected`);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });
}

function futureCardHtml(future) {
  const active = future.id === state.selectedFutureId ? " active" : "";
  const visualClass = state.photoDataUrl || state.demoMode ? `future-visual ${overlayStyleClass(future)}` : `future-visual no-photo ${overlayStyleClass(future)}`;
  const background = state.photoDataUrl ? `background-image:url('${state.photoDataUrl}')` : demoBackgroundStyle();
  return `<article class="future-card${active}" tabindex="0" role="button" data-future-id="${future.id}" aria-label="Select ${escapeHtml(future.title)}" style="--future-color:${future.color}">
    <header class="future-head"><i aria-hidden="true">${future.icon}</i><div><b>${escapeHtml(future.title)}</b><small>${escapeHtml(future.subtitle)}</small></div></header>
    <div class="${visualClass}" style="${background}; --overlay-tint:${future.tint}">
      ${overlayHtml(future)}
    </div>
    <div class="future-body"><p>${escapeHtml(specificWhy(future))}</p><div class="overlay-caption">Layered plant concept on your photo · not a final design</div><div class="future-tags">${future.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}<span class="tag">match ${future.score || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note)).find((x) => x.id === future.id)?.score || 72}%</span></div></div>
  </article>`;
}

function overlayHtml(future, options = {}) {
  const mode = options.mode || "selected";
  const showTrust = options.showTrust !== false;
  const trust = showTrust ? `<span class="concept-overlay-trust">Plant Concept Overlay · Not Final Design</span>` : "";
  return `${trust}${conceptOverlaySvg(future, mode)}${plantPictureOverlayHtml(future)}`;
}

function conceptScenarioKey() {
  if (state.propertyType === "courtyard") return "courtyard";
  if (state.propertyType === "under-building" || state.constraint === "shade-dark") return "shade";
  if (["blank", "front-yard", "backyard", "foundation"].includes(state.propertyType)) return "blank";
  if (state.propertyType === "overgrown") return "recovery";
  if (["workshop", "utility", "side-yard"].includes(state.propertyType) || ["access-awkward", "storage-creep"].includes(state.constraint)) return "workshop";
  return "blank";
}

function clampConcept(value, min = 0, max = 1000) {
  return Math.max(min, Math.min(max, Number(value) || 0));
}

function point(x, y) {
  return { x: clampConcept(x), y: clampConcept(y, 0, 640) };
}

const CALIBRATION_HANDLE_MARGIN = 36;

function calibrationSafePoint(x, y) {
  return {
    x: clampConcept(x, CALIBRATION_HANDLE_MARGIN, 1000 - CALIBRATION_HANDLE_MARGIN),
    y: clampConcept(y, CALIBRATION_HANDLE_MARGIN, 640 - CALIBRATION_HANDLE_MARGIN)
  };
}

function calibrationHandleDisplayPoint(value, stage = null) {
  const p = value || point(500, 320);
  let xMargin = CALIBRATION_HANDLE_MARGIN;
  let yMargin = CALIBRATION_HANDLE_MARGIN;
  const rect = stage?.getBoundingClientRect?.();
  if (rect?.width && rect?.height) {
    const xScale = (rect.height * 1000) / (rect.width * 640);
    xMargin = Math.max(xMargin, Math.min(180, 53 * xScale));
    yMargin = Math.max(yMargin, 53);
  }
  return {
    x: clampConcept(p.x, xMargin, 1000 - xMargin),
    y: clampConcept(p.y, yMargin, 640 - yMargin)
  };
}

function calibrationToolMeta(tool = calibrationUi.tool) {
  const tools = {
    usable: {
      step: 1,
      label: "Ground",
      button: "1 · Ground",
      instruction: "Drag points 1–4 around the ground or paving where a concept is allowed.",
      hint: "Start here. Keep the outline below roofs, walls, doors and windows."
    },
    keep: {
      step: 2,
      label: "Keep clear",
      button: "2 · Keep clear",
      instruction: "Resize the red boxes over anything the concept must not cover.",
      hint: "Protect doors, windows, roofs, furniture, pools and machinery."
    },
    access: {
      step: 3,
      label: "Access",
      button: "3 · Access",
      instruction: "Move A1 and A2 along the route that must remain open.",
      hint: "Use this for people, vehicles, machinery or a doorway path."
    },
    opportunity: {
      step: 4,
      label: "Opportunity",
      button: "4 · Opportunity",
      instruction: "Move O to the strongest believable place for change.",
      hint: "This guides the main visual emphasis; it does not block access."
    },
    firstMove: {
      step: 5,
      label: "First move",
      button: "5 · First move",
      instruction: "Move marker 5 to the exact place for the first reversible test.",
      hint: "Place it where pots, chalk, hose, rope or stakes could test the idea."
    }
  };
  return tools[tool] || tools.usable;
}

function calibrationKindTool(kind) {
  return kind === "firstMove" ? "firstMove" : kind;
}

function calibrationHandleMarkup({ kind, index = "", corner = "", label, x, y, radius = 29, text = "", className = "" }) {
  const active = calibrationKindTool(kind) === calibrationUi.tool;
  const display = calibrationHandleDisplayPoint({ x, y });
  const dataIndex = index === "" ? "" : ` data-cal-index="${index}"`;
  const dataCorner = corner ? ` data-cal-corner="${corner}"` : "";
  const valueText = `Horizontal ${Math.round(clampConcept(x) / 10)} percent, vertical ${Math.round(clampConcept(y, 0, 640) / 6.4)} percent`;
  return `<g class="calibration-handle ${className} ${active ? "is-active" : "is-inactive"}" data-cal-kind="${kind}"${dataIndex}${dataCorner} tabindex="${active ? 0 : -1}" role="slider" aria-label="${escapeHtml(label)}" aria-valuetext="${valueText}" transform="translate(${display.x} ${display.y})"><g class="calibration-handle-shape"><circle class="calibration-hit-target" r="49"/><circle class="calibration-handle-face" r="${radius}"/>${text ? `<text text-anchor="middle" dominant-baseline="central">${text}</text>` : ""}</g></g>`;
}

function defaultCalibrationForScenario(scenario = conceptScenarioKey()) {
  const presets = {
    courtyard: {
      usable: [point(25, 410), point(975, 350), point(1000, 640), point(0, 640)],
      keepClear: [{ id: "building", x: 0, y: 0, width: 1000, height: 345 }],
      access: [point(420, 640), point(530, 365)], opportunity: point(790, 470), firstMove: point(225, 520)
    },
    shade: {
      usable: [point(15, 390), point(985, 305), point(1000, 640), point(0, 640)],
      keepClear: [{ id: "overhead", x: 0, y: 0, width: 1000, height: 185 }],
      access: [point(105, 595), point(920, 335)], opportunity: point(725, 440), firstMove: point(565, 510)
    },
    blank: {
      usable: [point(0, 350), point(1000, 255), point(1000, 640), point(0, 640)],
      keepClear: [], access: [point(500, 640), point(510, 275)], opportunity: point(785, 410), firstMove: point(500, 485)
    },
    recovery: {
      usable: [point(0, 405), point(1000, 300), point(1000, 640), point(0, 640)],
      keepClear: [], access: [point(390, 640), point(740, 300)], opportunity: point(180, 455), firstMove: point(450, 475)
    },
    workshop: {
      usable: [point(70, 350), point(930, 305), point(1000, 640), point(0, 640)],
      keepClear: [{ id: "work-structure", x: 250, y: 0, width: 530, height: 245 }],
      access: [point(620, 640), point(850, 250)], opportunity: point(225, 430), firstMove: point(675, 465)
    }
  };
  const preset = presets[scenario] || presets.blank;
  return JSON.parse(JSON.stringify({ version: 1, scenario, customised: false, ...preset }));
}

function normaliseCalibration(value) {
  const fallback = defaultCalibrationForScenario();
  if (!value || typeof value !== "object") return fallback;
  const usable = Array.isArray(value.usable) && value.usable.length === 4
    ? value.usable.map((p, index) => point(p?.x ?? fallback.usable[index].x, p?.y ?? fallback.usable[index].y))
    : fallback.usable;
  const keepClear = Array.isArray(value.keepClear) ? value.keepClear.slice(0, 4).map((box, index) => ({
    id: String(box?.id || `keep-clear-${index + 1}`),
    x: clampConcept(box?.x), y: clampConcept(box?.y, 0, 640),
    width: Math.max(35, Math.min(1000 - clampConcept(box?.x), Number(box?.width) || 180)),
    height: Math.max(35, Math.min(640 - clampConcept(box?.y, 0, 640), Number(box?.height) || 120))
  })) : fallback.keepClear;
  const access = Array.isArray(value.access) && value.access.length === 2
    ? value.access.map((p, index) => point(p?.x ?? fallback.access[index].x, p?.y ?? fallback.access[index].y))
    : fallback.access;
  return {
    version: 1,
    scenario: String(value.scenario || fallback.scenario),
    customised: Boolean(value.customised),
    usable,
    keepClear,
    access,
    opportunity: point(value.opportunity?.x ?? fallback.opportunity.x, value.opportunity?.y ?? fallback.opportunity.y),
    firstMove: point(value.firstMove?.x ?? fallback.firstMove.x, value.firstMove?.y ?? fallback.firstMove.y)
  };
}

function ensureCalibration(options = {}) {
  const current = normaliseCalibration(state.calibration);
  const scenario = conceptScenarioKey();
  if (!state.calibration || (options.resetIfUncustomised && !current.customised && current.scenario !== scenario)) {
    state.calibration = defaultCalibrationForScenario(scenario);
  } else {
    state.calibration = current;
  }
  return state.calibration;
}

function calibrationSnapshot() {
  return JSON.parse(JSON.stringify(ensureCalibration()));
}

function pushCalibrationUndo() {
  calibrationUi.undo.push(calibrationSnapshot());
  calibrationUi.undo = calibrationUi.undo.slice(-12);
}

function calibrationPolygonPoints() {
  return ensureCalibration().usable.map((p) => `${p.x},${p.y}`).join(" ");
}

function calibrationKeepClearSvg(fill = "#000") {
  return ensureCalibration().keepClear.map((box, index) => `<rect data-cal-mask-keep="${index}" x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="18" fill="${fill}"/>`).join("");
}

function conceptMarkerPositions() {
  const cal = ensureCalibration();
  const midpoint = point((cal.access[0].x + cal.access[1].x) / 2, (cal.access[0].y + cal.access[1].y) / 2);
  const keep = cal.keepClear[0] ? point(cal.keepClear[0].x + cal.keepClear[0].width / 2, cal.keepClear[0].y + cal.keepClear[0].height / 2) : point(500, 130);
  return [cal.access[0], cal.opportunity, keep, midpoint, cal.firstMove];
}

function conceptMarkerSvg(options = {}) {
  const onlyFirst = Boolean(options.onlyFirst);
  return conceptMarkerPositions().map((p, index) => ({ p, index })).filter(({ index }) => !onlyFirst || index === 4).map(({ p, index }) => `<g data-concept-marker="${index + 1}" class="concept-map-marker ${index === 4 ? "marker-first" : ""}" transform="translate(${p.x} ${p.y})"><circle r="22"></circle><text text-anchor="middle" dominant-baseline="central">${index + 1}</text></g>`).join("");
}

function calibrationProtectedRouteSvg(className = "calibration-protected-route") {
  const [a, b] = ensureCalibration().access;
  return `<path class="${className}" d="M${a.x} ${a.y} L${b.x} ${b.y}"/>`;
}

function calibrationDefsSvg(id) {
  const route = calibrationProtectedRouteSvg("calibration-mask-route");
  return `<defs>
    <clipPath id="${id}-usable"><polygon points="${calibrationPolygonPoints()}"/></clipPath>
    <mask id="${id}-safe"><rect width="1000" height="640" fill="white"/>${calibrationKeepClearSvg("black")}${route}</mask>
  </defs>`;
}

function calibrationEditorSvg() {
  if (!calibrationUi.open) return "";
  const cal = ensureCalibration();
  const usableHandles = cal.usable.map((p, index) => calibrationHandleMarkup({ kind: "usable", index, label: `Usable ground point ${index + 1}`, x: p.x, y: p.y, radius: 31, text: String(index + 1), className: "usable-handle" })).join("");
  const keepClearActive = calibrationUi.tool === "keep";
  const keepClear = cal.keepClear.map((box, index) => `<g class="calibration-keep-clear ${keepClearActive ? "is-active" : "is-inactive"}" data-cal-box-index="${index}"><rect x="${box.x}" y="${box.y}" width="${box.width}" height="${box.height}" rx="18"/><text x="${Math.max(110, Math.min(890, box.x + box.width / 2))}" y="${Math.max(44, box.y + 42)}" text-anchor="middle">KEEP CLEAR ${index + 1}</text>${[
    [box.x, box.y, "nw"],
    [box.x + box.width, box.y, "ne"],
    [box.x + box.width, box.y + box.height, "se"],
    [box.x, box.y + box.height, "sw"]
  ].map(([x, y, corner]) => calibrationHandleMarkup({ kind: "keep", index, corner, label: `Keep-clear area ${index + 1} ${corner} corner`, x, y, radius: 27, className: "keep-handle" })).join("")}</g>`).join("");
  const access = cal.access.map((p, index) => calibrationHandleMarkup({ kind: "access", index, label: `Access route point ${index + 1}`, x: p.x, y: p.y, radius: 31, text: `A${index + 1}`, className: "access-handle" })).join("");
  const opportunity = calibrationHandleMarkup({ kind: "opportunity", label: "Main opportunity location", x: cal.opportunity.x, y: cal.opportunity.y, radius: 33, text: "O", className: "opportunity-handle" });
  const first = calibrationHandleMarkup({ kind: "firstMove", label: "First move marker 5", x: cal.firstMove.x, y: cal.firstMove.y, radius: 35, text: "5", className: "first-handle" });
  const accessRoute = calibrationProtectedRouteSvg(`calibration-protected-route ${calibrationUi.tool === "access" ? "is-active" : "is-inactive"}`);
  return `<svg class="calibration-editor-svg tool-${calibrationUi.tool}" data-calibration-tool="${calibrationUi.tool}" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-label="Concept placement calibration"><polygon class="calibration-usable-outline" points="${calibrationPolygonPoints()}"/>${accessRoute}${keepClear}${usableHandles}${access}${opportunity}${first}</svg>`;
}

function calibrationControlsHtml() {
  if (!state.analysisComplete) return "";
  const cal = ensureCalibration();
  const status = cal.customised ? "Adjusted for this property" : "VerdeAI starting layout";
  if (!calibrationUi.open) return `<div class="calibration-closed"><div><b>Concept placement</b><span>${escapeHtml(status)} · adjust only the parts that look wrong.</span></div><button type="button" class="secondary" data-cal-action="open">Help VerdeAI place the concept</button></div>`;
  const tools = ["usable", "keep", "access", "opportunity", "firstMove"];
  const meta = calibrationToolMeta();
  return `<div class="calibration-panel" aria-label="Help VerdeAI place the concept"><div class="calibration-heading"><div><span class="calibration-kicker">Quick placement · usually under one minute</span><b>Help VerdeAI place the concept</b><span>Choose a step, then drag the bright handles. Unrelated controls stay hidden so the photo remains clear.</span></div><button type="button" class="calibration-done-primary" data-cal-action="done">Done placing concept</button></div><div class="calibration-step-status" aria-live="polite"><span>Step ${meta.step} of 5</span><b>${escapeHtml(meta.label)}</b><small>${escapeHtml(meta.hint)}</small></div><div class="calibration-tools" role="toolbar" aria-label="Calibration steps">${tools.map((id) => { const item = calibrationToolMeta(id); return `<button type="button" class="${calibrationUi.tool === id ? "active" : ""}" data-cal-tool="${id}" aria-pressed="${calibrationUi.tool === id}">${escapeHtml(item.button)}</button>`; }).join("")}</div><div class="calibration-actions"><button type="button" class="secondary" data-cal-action="undo" ${calibrationUi.undo.length ? "" : "disabled"}>Undo last move</button><button type="button" class="secondary" data-cal-action="reset">Reset VerdeAI layout</button><button type="button" class="secondary" data-cal-action="add-keep">Add keep-clear box</button><button type="button" class="secondary" data-cal-action="remove-keep" ${cal.keepClear.length ? "" : "disabled"}>Remove last box</button></div><p class="calibration-instruction" aria-live="polite">${escapeHtml(calibrationInstruction())}</p></div>`;
}

function calibrationInstruction() {
  return calibrationToolMeta().instruction;
}

function calibrationPlantBounds() {
  const cal = ensureCalibration();
  const xs = cal.usable.map((p) => p.x);
  const ys = cal.usable.map((p) => p.y);
  const minX = Math.max(0, Math.min(...xs));
  const maxX = Math.min(1000, Math.max(...xs));
  const minY = Math.max(0, Math.min(...ys));
  const maxY = Math.min(640, Math.max(...ys));
  const width = Math.max(220, maxX - minX);
  const height = Math.max(180, maxY - minY);
  return {
    minX, maxX, minY, maxY, width, height,
    at: (xPercent, yPercent) => point(minX + width * (xPercent / 100), minY + height * (yPercent / 100))
  };
}

function conceptScenarioSvg() {
  const scenario = conceptScenarioKey();
  const cal = ensureCalibration();
  const bounds = calibrationPlantBounds();
  const route = calibrationProtectedRouteSvg("site-access-route");
  const depthTop = bounds.minY + bounds.height * .30;
  const depthMid = bounds.minY + bounds.height * .64;
  return `<g class="scenario-treatment site-logic scenario-${scenario}">
    <polygon class="site-ground-veil" points="${calibrationPolygonPoints()}"/>
    <path class="site-depth-rear" d="M${bounds.minX} ${depthTop} L${bounds.maxX} ${depthTop - 18} L${bounds.maxX} ${depthMid} L${bounds.minX} ${depthMid + 18} Z"/>
    <path class="site-depth-front" d="M${bounds.minX} ${depthMid} L${bounds.maxX} ${depthMid - 18} L${bounds.maxX} ${bounds.maxY} L${bounds.minX} ${bounds.maxY} Z"/>
    ${route}
  </g>`;
}


function botanicalDefsSvg(id) {
  return `<defs class="botanical-defs">
    <linearGradient id="${id}-leaf-deep" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#102d20"/><stop offset=".38" stop-color="#28543a"/><stop offset=".72" stop-color="#4f7f50"/><stop offset="1" stop-color="#87a76d"/></linearGradient>
    <linearGradient id="${id}-leaf-mid" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#1c3f2c"/><stop offset=".48" stop-color="#4f8052"/><stop offset="1" stop-color="#a0b77d"/></linearGradient>
    <linearGradient id="${id}-leaf-soft" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#314f37"/><stop offset=".52" stop-color="#78936b"/><stop offset="1" stop-color="#c1c99c"/></linearGradient>
    <linearGradient id="${id}-leaf-silver" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#40554b"/><stop offset=".55" stop-color="#7d9480"/><stop offset="1" stop-color="#c5ceb5"/></linearGradient>
    <linearGradient id="${id}-bed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#98714e"/><stop offset=".55" stop-color="#725039"/><stop offset="1" stop-color="#412c21"/></linearGradient>
    <linearGradient id="${id}-trunk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3f2a1d"/><stop offset=".44" stop-color="#705039"/><stop offset=".72" stop-color="#8c6748"/><stop offset="1" stop-color="#4a3021"/></linearGradient>
    <filter id="${id}-plant-shadow" x="-45%" y="-55%" width="190%" height="230%"><feDropShadow dx="0" dy="6" stdDeviation="5.5" flood-color="#071d14" flood-opacity=".34"/></filter>
    <filter id="${id}-rear-soft" x="-35%" y="-35%" width="170%" height="190%"><feGaussianBlur stdDeviation="1.05"/></filter>
    <filter id="${id}-organic" x="-12%" y="-12%" width="124%" height="124%"><feTurbulence type="fractalNoise" baseFrequency=".018 .032" numOctaves="2" seed="17" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.7" xChannelSelector="R" yChannelSelector="G"/></filter>
  </defs>`;
}


function botanicalHash(value) {
  let hash = 2166136261;
  const source = String(value || "");
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function botanicalRandom(seed) {
  let stateValue = seed >>> 0;
  return () => {
    stateValue += 0x6D2B79F5;
    let value = stateValue;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 4294967296;
  };
}

function botanicalNumber(value) {
  return Number(value).toFixed(1).replace(/\.0$/, "");
}

function botanicalLeafPath(cx, cy, length, width, angle, bend = 0) {
  const radians = angle * Math.PI / 180;
  const ux = Math.cos(radians);
  const uy = Math.sin(radians);
  const px = -uy;
  const py = ux;
  const tipX = cx + ux * length;
  const tipY = cy + uy * length;
  const shoulderX = cx + ux * length * .48 + px * bend;
  const shoulderY = cy + uy * length * .48 + py * bend;
  const leftX = cx + px * width;
  const leftY = cy + py * width;
  const rightX = cx - px * width;
  const rightY = cy - py * width;
  const tipLeftX = shoulderX + px * width * .68;
  const tipLeftY = shoulderY + py * width * .68;
  const tipRightX = shoulderX - px * width * .68;
  const tipRightY = shoulderY - py * width * .68;
  return `M${botanicalNumber(cx)} ${botanicalNumber(cy)} C${botanicalNumber(leftX)} ${botanicalNumber(leftY)} ${botanicalNumber(tipLeftX)} ${botanicalNumber(tipLeftY)} ${botanicalNumber(tipX)} ${botanicalNumber(tipY)} C${botanicalNumber(tipRightX)} ${botanicalNumber(tipRightY)} ${botanicalNumber(rightX)} ${botanicalNumber(rightY)} ${botanicalNumber(cx)} ${botanicalNumber(cy)}Z`;
}

function botanicalLeaf(cx, cy, length, width, angle, className = "plant-leaf plant-leaf-mid", bend = 0) {
  const veinX = cx + Math.cos(angle * Math.PI / 180) * length * .78;
  const veinY = cy + Math.sin(angle * Math.PI / 180) * length * .78;
  return `<path class="${className}" d="${botanicalLeafPath(cx, cy, length, width, angle, bend)}"/><path class="plant-leaf-vein" d="M${botanicalNumber(cx)} ${botanicalNumber(cy)} L${botanicalNumber(veinX)} ${botanicalNumber(veinY)}"/>`;
}

function botanicalContactShadow(width = 54, opacity = .28) {
  return `<ellipse class="plant-contact-shadow" cx="0" cy="5" rx="${botanicalNumber(width)}" ry="${botanicalNumber(Math.max(7, width * .18))}" style="opacity:${opacity}"/>`;
}

function botanicalRosette(random, centerX, centerY, count, radius, leafLength, className) {
  let output = "";
  for (let index = 0; index < count; index += 1) {
    const angle = -166 + (332 / count) * index + (random() - .5) * 18;
    const baseX = centerX + Math.cos(angle * Math.PI / 180) * radius * (random() * .45);
    const baseY = centerY + Math.sin(angle * Math.PI / 180) * radius * (random() * .28);
    const length = leafLength * (.74 + random() * .5);
    const width = length * (.18 + random() * .08);
    output += botanicalLeaf(baseX, baseY, length, width, angle - 90, `${className} plant-leaf`, (random() - .5) * 8);
  }
  return output;
}

function botanicalPlantGeometry(id, type, seed) {
  const random = botanicalRandom(seed);
  let output = botanicalContactShadow(type === "tree" ? 74 : type === "screen" ? 46 : type === "groundcover" ? 58 : 54, type === "tree" ? .34 : .27);
  const dark = "plant-leaf plant-leaf-dark";
  const mid = "plant-leaf plant-leaf-mid";
  const light = "plant-leaf plant-leaf-light";
  const silver = "plant-leaf plant-leaf-silver";

  if (type === "groundcover") {
    output += `<ellipse class="plant-ground-base" cx="0" cy="-2" rx="49" ry="13"/>`;
    output += botanicalRosette(random, -25, -4, 8, 18, 45, dark);
    output += botanicalRosette(random, 18, -6, 9, 20, 49, mid);
    output += botanicalRosette(random, 0, -17, 7, 16, 42, light);
  } else if (type === "herb") {
    output += botanicalRosette(random, 0, -2, 12, 14, 48, mid);
    output += botanicalRosette(random, -8, -13, 6, 10, 34, light);
  } else if (type === "grass") {
    for (let index = 0; index < 15; index += 1) {
      const spread = -62 + (124 / 14) * index + (random() - .5) * 9;
      const height = 70 + random() * 72;
      const endX = Math.sin(spread * Math.PI / 180) * height * .58;
      const endY = -Math.cos(spread * Math.PI / 180) * height;
      const controlX = endX * .35 + (random() - .5) * 18;
      const controlY = endY * .52;
      output += `<path class="plant-blade ${index % 4 === 0 ? "plant-blade-light" : ""}" d="M0 1 Q${botanicalNumber(controlX)} ${botanicalNumber(controlY)} ${botanicalNumber(endX)} ${botanicalNumber(endY)}"/>`;
    }
  } else if (type === "strappy") {
    for (let index = 0; index < 11; index += 1) {
      const angle = -154 + index * 12 + (random() - .5) * 8;
      const length = 92 + random() * 88;
      output += botanicalLeaf((random() - .5) * 14, 0, length, 10 + random() * 6, angle, index % 3 === 0 ? silver : mid, (random() - .5) * 10);
    }
  } else if (type === "fern") {
    const fronds = [-142, -116, -93, -66, -39];
    fronds.forEach((angle, frondIndex) => {
      const length = 82 + random() * 55;
      const radians = angle * Math.PI / 180;
      const tipX = Math.cos(radians) * length;
      const tipY = Math.sin(radians) * length;
      output += `<path class="fern-rachis" d="M0 0 Q${botanicalNumber(tipX * .42)} ${botanicalNumber(tipY * .62)} ${botanicalNumber(tipX)} ${botanicalNumber(tipY)}"/>`;
      for (let leaflet = 2; leaflet <= 8; leaflet += 1) {
        const t = leaflet / 9;
        const baseX = tipX * t;
        const baseY = tipY * t;
        const leafletLength = 21 * (1 - t * .45) + random() * 6;
        output += botanicalLeaf(baseX, baseY, leafletLength, 5.3, angle - 62, frondIndex % 2 ? light : mid, -3);
        output += botanicalLeaf(baseX, baseY, leafletLength, 5.3, angle + 62, frondIndex % 2 ? mid : light, 3);
      }
    });
  } else if (type === "perennial") {
    const stems = [-35, -18, 1, 21, 39];
    stems.forEach((offset, index) => {
      const height = 82 + random() * 58;
      const sway = offset + (random() - .5) * 12;
      output += `<path class="plant-stem" d="M${offset * .22} 0 Q${sway * .45} ${-height * .55} ${sway} ${-height}"/>`;
      output += botanicalLeaf(sway * .35, -height * .42, 32 + random() * 13, 8, -152 + random() * 20, index % 2 ? mid : dark);
      output += botanicalLeaf(sway * .62, -height * .62, 29 + random() * 12, 7, -28 + random() * 18, index % 2 ? light : mid);
      output += `<g class="plant-flower-head" transform="translate(${botanicalNumber(sway)} ${botanicalNumber(-height)})"><circle r="${botanicalNumber(7 + random() * 3)}"/><circle class="flower-centre" r="2.7"/></g>`;
    });
    output += botanicalRosette(random, 0, -1, 8, 12, 38, dark);
  } else if (type === "screen") {
    const stems = [-25, -8, 12, 30];
    stems.forEach((offset, stemIndex) => {
      const height = 132 + random() * 94;
      const tipX = offset + (random() - .5) * 22;
      output += `<path class="woody-stem" d="M${offset * .25} 0 Q${offset} ${-height * .53} ${botanicalNumber(tipX)} ${botanicalNumber(-height)}"/>`;
      for (let leafIndex = 1; leafIndex <= 8; leafIndex += 1) {
        const t = leafIndex / 9;
        const x = offset * .25 + (tipX - offset * .25) * t;
        const y = -height * t;
        const side = leafIndex % 2 ? -1 : 1;
        output += botanicalLeaf(x, y, 34 + random() * 18, 8 + random() * 4, side < 0 ? -154 + random() * 18 : -26 - random() * 18, stemIndex % 2 ? mid : dark);
      }
    });
  } else if (type === "tree") {
    output += `<path class="plant-trunk" fill="url(#${id}-trunk)" d="M-13 2 C-10-48 -11-94 -5-137 C-2-157 7-176 13-191 C20-167 20-147 16-129 C14-88 17-45 18 2Z"/>`;
    output += `<path class="plant-branch" d="M1-118 Q-32-151-55-167 M9-137 Q42-165 64-186 M8-105 Q47-121 70-135"/>`;
    const centres = [[-52,-174],[2,-212],[52,-183],[-16,-153],[43,-143],[-66,-130],[5,-123]];
    centres.forEach(([cx, cy], clusterIndex) => {
      const leaves = 8 + Math.floor(random() * 5);
      for (let index = 0; index < leaves; index += 1) {
        const angle = index * (360 / leaves) + random() * 25;
        const radius = 8 + random() * 32;
        const bx = cx + Math.cos(angle * Math.PI / 180) * radius;
        const by = cy + Math.sin(angle * Math.PI / 180) * radius * .65;
        output += botanicalLeaf(bx, by, 38 + random() * 26, 12 + random() * 8, angle - 90, clusterIndex % 3 === 0 ? light : clusterIndex % 2 ? mid : dark, (random() - .5) * 8);
      }
    });
  } else if (type === "edible-bed") {
    output += `<path class="edible-bed-soil" fill="url(#${id}-bed)" d="M-98-7 L76-36 L108 37 L-73 69Z"/><path class="bed-rim" d="M-98-7 L76-36 L108 37 L-73 69Z"/>`;
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 5; col += 1) {
        const x = -65 + col * 34 + row * 8;
        const y = 9 + row * 27 - col * 6;
        output += `<g transform="translate(${x} ${y}) scale(.36)">${botanicalRosette(random, 0, 0, 7, 10, 42, row ? light : mid)}</g>`;
      }
    }
  } else {
    const low = type === "mound";
    const flower = type === "flower-shrub";
    const branchCount = low ? 9 : 12;
    for (let branch = 0; branch < branchCount; branch += 1) {
      const angle = -166 + (branch / (branchCount - 1)) * 152 + (random() - .5) * 12;
      const length = (low ? 48 : 68) + random() * (low ? 34 : 48);
      const baseX = (random() - .5) * (low ? 38 : 30);
      output += `<path class="woody-stem shrub-stem" d="M${botanicalNumber(baseX * .25)} 0 Q${botanicalNumber(baseX)} ${botanicalNumber(-length * .5)} ${botanicalNumber(Math.cos(angle * Math.PI / 180) * length)} ${botanicalNumber(-Math.sin((angle + 180) * Math.PI / 180) * length - length * .45)}"/>`;
      const leafCount = 3 + Math.floor(random() * 3);
      for (let leafIndex = 0; leafIndex < leafCount; leafIndex += 1) {
        const t = .32 + leafIndex * (.52 / Math.max(1, leafCount - 1));
        const x = Math.cos(angle * Math.PI / 180) * length * t + baseX * (1 - t);
        const y = -length * (.26 + t * .5);
        const side = leafIndex % 2 ? 1 : -1;
        output += botanicalLeaf(x, y, (low ? 34 : 41) + random() * 17, (low ? 10 : 12) + random() * 6, side < 0 ? -155 + random() * 24 : -25 - random() * 24, branch % 3 === 0 ? light : branch % 2 ? mid : dark, side * 4);
      }
      if (flower && branch % 2 === 0) {
        const fx = Math.cos(angle * Math.PI / 180) * length;
        const fy = -length * .77;
        output += `<g class="plant-flower-head" transform="translate(${botanicalNumber(fx)} ${botanicalNumber(fy)})"><circle r="${botanicalNumber(6 + random() * 3)}"/><circle class="flower-centre" r="2.5"/></g>`;
      }
    }
    output += botanicalRosette(random, 0, -4, low ? 9 : 11, low ? 19 : 24, low ? 40 : 47, dark);
  }
  return output;
}

function plantUse(id, type, x, y, scale = 1, rotate = 0, extraClass = "") {
  const seed = botanicalHash(`${type}:${Math.round(x)}:${Math.round(y)}:${rotate}:${extraClass}`);
  const perspective = .82 + Math.max(0, Math.min(640, Number(y) || 0)) / 1800;
  const finalScale = Math.max(.24, Number(scale) * perspective);
  const variant = seed % 997;
  return `<g class="botanical-plant plant-type-${type} ${extraClass}" data-plant-type="${type}" data-plant-variant="${variant}" transform="translate(${Math.round(x)} ${Math.round(y)}) rotate(${rotate}) scale(${botanicalNumber(finalScale)})" filter="url(#${id}-plant-shadow)">${botanicalPlantGeometry(id, type, seed)}</g>`;
}

function plantRowSvg(id, type, placements, className = "") {
  return placements.map(([x, y, scale = 1, rotate = 0]) => plantUse(id, type, x, y, scale, rotate, className)).join("");
}

function gatheringRoomSvg(bounds) {
  const c = bounds.at(55, 61);
  const rx = Math.min(170, bounds.width * .18);
  const ry = Math.min(92, bounds.height * .21);
  return `<g class="landscape-use-zone gathering-use-zone" transform="translate(${c.x} ${c.y})">
    <ellipse class="gathering-surface" rx="${rx}" ry="${ry}"/>
    <ellipse class="gathering-table-top" rx="48" ry="28" cy="-3"/><path class="gathering-table-leg" d="M-5 18 V57 M5 18 V57"/>
    <g class="gathering-chairs"><path d="M-25-${Math.round(ry*.78)} h50 v37 h-50z"/><path d="M-25 ${Math.round(ry*.42)} h50 v37 h-50z"/><path d="M-${Math.round(rx*.79)} -20 h38 v45 h-38z"/><path d="M${Math.round(rx*.58)} -20 h38 v45 h-38z"/></g>
  </g>`;
}

function makerUseZoneSvg(bounds) {
  const a = bounds.at(35, 70);
  const b = bounds.at(76, 43);
  return `<g class="landscape-use-zone maker-use-zone"><rect class="maker-work-surface" x="${a.x - 145}" y="${a.y - 75}" width="290" height="150" rx="20"/><rect class="maker-storage-block" x="${b.x - 85}" y="${b.y - 80}" width="170" height="160" rx="18"/></g>`;
}

function productiveBedsSvg(id, bounds) {
  const p1 = bounds.at(22, 68), p2 = bounds.at(48, 57), p3 = bounds.at(75, 47);
  return `<g class="landscape-use-zone productive-use-zone">${plantUse(id,"edible-bed",p1.x,p1.y,.92,-3,"bed-one")}${plantUse(id,"edible-bed",p2.x,p2.y,.82,-2,"bed-two")}${plantUse(id,"edible-bed",p3.x,p3.y,.72,-1,"bed-three")}</g>`;
}


function futureGroundTreatmentSvg(future, bounds, cal) {
  const p = bounds.at;
  if (future.id === "belonging") {
    const c = { x: clampConcept(cal.opportunity.x, bounds.minX + 120, bounds.maxX - 120), y: clampConcept(cal.opportunity.y + 20, bounds.minY + 155, bounds.maxY - 38) };
    return `<g class="future-ground-treatment feature-ground-treatment"><ellipse class="feature-cleared-bed" cx="${c.x}" cy="${c.y}" rx="150" ry="78"/><path class="feature-open-sweep" d="M${p(8,78).x} ${p(8,78).y} Q${p(38,70).x} ${p(38,70).y} ${c.x-110} ${c.y+24} M${c.x+118} ${c.y+20} Q${p(72,70).x} ${p(72,70).y} ${p(92,77).x} ${p(92,77).y}"/></g>`;
  }
  if (future.id === "minimal") {
    return `<g class="future-ground-treatment minimal-ground-treatment"><path class="minimal-mulch-bed" d="M${p(5,69).x} ${p(5,69).y} Q${p(25,60).x} ${p(25,60).y} ${p(42,67).x} ${p(42,67).y} L${p(42,95).x} ${p(42,95).y} Q${p(22,88).x} ${p(22,88).y} ${p(5,94).x} ${p(5,94).y}Z"/><path class="minimal-mulch-bed" d="M${p(58,67).x} ${p(58,67).y} Q${p(76,59).x} ${p(76,59).y} ${p(95,67).x} ${p(95,67).y} L${p(95,94).x} ${p(95,94).y} Q${p(78,88).x} ${p(78,88).y} ${p(58,95).x} ${p(58,95).y}Z"/><path class="minimal-negative-space" d="M${p(44,64).x} ${p(44,64).y} L${p(56,63).x} ${p(56,63).y} L${p(58,98).x} ${p(58,98).y} L${p(42,98).x} ${p(42,98).y}Z"/></g>`;
  }
  if (future.id === "wildlife") {
    return `<g class="future-ground-treatment wildlife-ground-treatment"><path class="wildlife-habitat-bed" d="M${p(3,55).x} ${p(3,55).y} Q${p(17,47).x} ${p(17,47).y} ${p(33,57).x} ${p(33,57).y} Q${p(47,66).x} ${p(47,66).y} ${p(60,57).x} ${p(60,57).y} Q${p(78,46).x} ${p(78,46).y} ${p(97,57).x} ${p(97,57).y} L${p(97,98).x} ${p(97,98).y} L${p(3,98).x} ${p(3,98).y}Z"/></g>`;
  }
  return "";
}

function botanicalPlantingSvg(future, id) {
  const bounds = calibrationPlantBounds();
  const cal = ensureCalibration();
  const p = bounds.at;
  const scenario = conceptScenarioKey();
  const shadeScale = scenario === "courtyard" ? .82 : scenario === "shade" ? .9 : 1;
  const opportunityAnchor = {
    x: clampConcept(cal.opportunity.x, bounds.minX + 105, bounds.maxX - 105),
    y: clampConcept(cal.opportunity.y, bounds.minY + 175, bounds.maxY - 28)
  };
  const rear = [], mid = [], front = [];
  let objects = "";

  if (future.id === "belonging") {
    rear.push([p(12,40),"strappy",.54,-6],[p(86,38),"strappy",.55,5]);
    mid.push([p(13,65),"mound",.66,-4],[p(29,61),"perennial",.62,5],[p(70,60),"mound",.64,3],[p(86,64),"perennial",.60,-5]);
    front.push([p(13,88),"groundcover",.74,-5],[p(30,85),"fern",.70,4],[p(69,84),"groundcover",.73,-4],[p(86,88),"fern",.72,5]);
    objects += plantUse(id,"flower-shrub",opportunityAnchor.x,opportunityAnchor.y,.92*shadeScale,-2,"feature-anchor focal-shrub");
    objects += plantUse(id,"mound",opportunityAnchor.x-94,opportunityAnchor.y+28,.58*shadeScale,4,"feature-support");
    objects += plantUse(id,"mound",opportunityAnchor.x+96,opportunityAnchor.y+22,.55*shadeScale,-4,"feature-support");
    objects += plantUse(id,"flower-shrub",cal.firstMove.x,cal.firstMove.y,.54*shadeScale,-4,"first-move-plant");
  } else if (future.id === "minimal") {
    rear.push([p(14,39),"strappy",.6,-2],[p(29,38),"strappy",.6,1],[p(71,37),"strappy",.6,-1],[p(86,37),"strappy",.6,2]);
    mid.push([p(15,63),"mound",.61],[p(31,60),"mound",.61],[p(69,59),"mound",.61],[p(85,62),"mound",.61]);
    front.push([p(14,87),"groundcover",.72],[p(30,84),"groundcover",.72],[p(70,83),"groundcover",.72],[p(86,86),"groundcover",.72]);
    objects += `<path class="minimal-clean-edge" d="M${p(7,76).x} ${p(7,76).y} Q${p(32,68).x} ${p(32,68).y} ${p(43,72).x} ${p(43,72).y} M${p(58,70).x} ${p(58,70).y} Q${p(80,66).x} ${p(80,66).y} ${p(94,72).x} ${p(94,72).y}"/>`;
    objects += plantUse(id,"herb",cal.firstMove.x,cal.firstMove.y,.65*shadeScale,0,"first-move-plant");
  } else if (future.id === "wildlife") {
    rear.push([p(5,39),"screen",.65,-4],[p(17,35),"strappy",.65,6],[p(31,40),"fern",.62,-7],[p(68,36),"strappy",.68,-4],[p(82,32),"screen",.66,4],[p(95,39),"fern",.61,8]);
    mid.push([p(7,64),"perennial",.78,-7],[p(21,57),"mound",.76,4],[p(35,67),"flower-shrub",.67,-3],[p(65,61),"perennial",.74,6],[p(80,56),"mound",.79,-3],[p(94,64),"flower-shrub",.72,5]);
    front.push([p(3,89),"fern",.88,-6],[p(16,83),"groundcover",.9,5],[p(29,90),"perennial",.54,-2],[p(67,87),"groundcover",.91,-4],[p(82,82),"fern",.9,7],[p(97,89),"perennial",.52,3]);
    objects += plantUse(id,"tree",opportunityAnchor.x,opportunityAnchor.y,.64*shadeScale,-2,"habitat-anchor");
    objects += plantUse(id,"flower-shrub",cal.firstMove.x,cal.firstMove.y,.58*shadeScale,3,"first-move-plant");
  } else if (future.id === "gathering") {
    rear.push([p(8,37),"screen",.62,-3],[p(20,40),"strappy",.56,5],[p(80,38),"strappy",.56,-5],[p(92,35),"screen",.62,3]);
    mid.push([p(10,64),"mound",.69,-4],[p(25,59),"perennial",.59,4],[p(76,58),"perennial",.59,-4],[p(91,63),"mound",.69,4]);
    front.push([p(10,88),"fern",.82,-5],[p(25,84),"groundcover",.76,4],[p(77,84),"groundcover",.76,-4],[p(92,88),"fern",.82,5]);
    objects += gatheringRoomSvg(bounds);
    objects += plantUse(id,"herb",cal.firstMove.x,cal.firstMove.y,.67*shadeScale,0,"first-move-plant");
  } else if (future.id === "productive") {
    rear.push([p(8,38),"screen",.56,-3],[p(92,36),"screen",.56,3],[p(20,42),"herb",.54,-4],[p(82,40),"herb",.54,4]);
    mid.push([p(8,65),"herb",.7,-3],[p(91,62),"herb",.7,3]);
    front.push([p(7,88),"fern",.68,-5],[p(93,87),"fern",.68,5]);
    objects += productiveBedsSvg(id,bounds);
    objects += plantUse(id,"herb",cal.firstMove.x,cal.firstMove.y,.76*shadeScale,-2,"first-move-plant");
  } else {
    rear.push([p(7,37),"screen",.7,-4],[p(17,40),"strappy",.61,5],[p(91,36),"screen",.64,4]);
    mid.push([p(8,66),"mound",.64,-3],[p(91,62),"mound",.62,3]);
    front.push([p(7,89),"groundcover",.72,-3],[p(92,87),"groundcover",.7,3]);
    objects += makerUseZoneSvg(bounds);
    objects += plantUse(id,"grass",cal.firstMove.x,cal.firstMove.y,.56*shadeScale,0,"first-move-plant");
  }

  const render = (entries, className) => {
    const isFront = className.includes("front");
    const inset = isFront ? 76 : 42;
    const densityScale = isFront ? .86 : 1;
    return `<g class="${className}">${entries.map(([pos,type,scale,rotate=0]) => {
      const safeX = clampConcept(pos.x, bounds.minX + inset, bounds.maxX - inset);
      return plantUse(id,type,safeX,pos.y,scale*shadeScale*densityScale,rotate);
    }).join("")}</g>`;
  };
  return `<g class="botanical-composition botanical-${future.id} scenario-${scenario}">${render(rear,"plant-depth-layer plant-rear-layer")}${render(mid,"plant-depth-layer plant-mid-layer")}${objects}${render(front,"plant-depth-layer plant-front-layer")}</g>`;
}

function futureTreatmentSvg(future, id) {
  const bounds = calibrationPlantBounds();
  const cal = ensureCalibration();
  return `${futureGroundTreatmentSvg(future, bounds, cal)}${botanicalPlantingSvg(future, id)}`;
}

function conceptOverlaySvg(future, mode = "selected") {
  ensureCalibration();
  const id = `concept-safe-${++conceptSvgSerial}`;
  const className = `concept-overlay-svg scenario-${conceptScenarioKey()} future-${future.id} mode-${mode}`;
  const markers = conceptMarkerSvg({ onlyFirst: !calibrationUi.open });
  return `<svg class="${className}" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">${calibrationDefsSvg(id)}${botanicalDefsSvg(id)}<g class="concept-safe-treatment" clip-path="url(#${id}-usable)" mask="url(#${id}-safe)"><g class="concept-overlay-underlay">${conceptScenarioSvg()}</g><g class="concept-future-layer">${futureTreatmentSvg(future, id)}</g></g><g class="concept-access-protection">${calibrationProtectedRouteSvg()}</g><g class="concept-marker-layer">${markers}</g></svg>`;
}

function plantPictureOverlayHtml() {
  // Kept as the compatibility hook used by older views; v9.4 draws the visual treatment as layered botanical SVG.
  return `<span class="concept-depth-wash" aria-hidden="true"></span>`;
}

function visualLegendItems(future) {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const guide = scenarioGuide();
  const access = {
    courtyard: "Doorway-to-seating circulation kept clear",
    shade: "Existing dry access / service line",
    blank: state.propertyType === "front-yard" ? "Street-to-door arrival line" : "Main approach and viewing line",
    recovery: "Walking line revealed through existing growth",
    workshop: "Protected bulky-item and working route"
  }[conceptScenarioKey()];
  const opportunity = {
    belonging: "Feature focal zone",
    minimal: "Calm low-care planting zone",
    wildlife: "Layered habitat zone",
    gathering: "Usable outdoor room",
    productive: "Practical edible zone",
    maker: "Permanent work and storage zone"
  }[future.id] || "Strongest opportunity zone";
  const constraint = state.analysisComplete ? constraintLabel(state.constraint) : profile.secondary;
  const intervention = tailoredLabels(future)[2] || tailoredLabels(future)[0] || "Recommended intervention";
  const first = state.analysisComplete ? firstMoveFor(profile, future) : smartNextPlan().detail;
  return [
    ["Existing access", access],
    ["Opportunity", opportunity],
    ["Constraint", constraint],
    ["Intervention", intervention],
    ["First move", first]
  ];
}

function compactFirstMoveText(future) {
  const full = state.analysisComplete ? firstMoveFor(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"], future) : smartNextPlan().detail;
  return full.length > 155 ? `${full.slice(0, 152).replace(/[,;]\s*[^,;]*$/, "")}…` : full;
}

function conceptLegendHtml(future) {
  return `<div class="concept-map-legend" aria-label="What VerdeAI sees">${visualLegendItems(future).map(([title, text], index) => `<article class="concept-legend-item ${index === 4 ? "is-first-move" : ""}"><span>${index + 1}</span><div><b>${escapeHtml(title)}</b><small>${escapeHtml(text)}</small></div></article>`).join("")}</div>`;
}

function visualModeSwitchHtml(mode = normaliseVisualMode()) {
  return `<div class="visual-mode-switch" role="group" aria-label="Compare property image modes">
    <button type="button" class="${mode === "original" ? "active" : ""}" data-visual-mode="original" aria-pressed="${mode === "original"}">Original</button>
    <button type="button" class="${mode === "recommended" ? "active" : ""}" data-visual-mode="recommended" aria-pressed="${mode === "recommended"}">VerdeAI Concept</button>
    <button type="button" class="${mode === "selected" ? "active" : ""}" data-visual-mode="selected" aria-pressed="${mode === "selected"}">Selected Future</button>
  </div>`;
}

function createHtmlFragment(html) {
  const template = document.createElement("template");
  template.innerHTML = String(html || "").trim();
  return template.content;
}

function renderDedicatedConceptHost(host, mode = normaliseVisualMode()) {
  if (!host) return;
  host.replaceChildren(createHtmlFragment(conceptVisualHtml(mode)));
  host.dataset.renderedBuild = BUILD_VERSION;
  host.dataset.hostIntegrity = assertConceptHostIntegrity(host) ? "clean" : "failed";
}

function assertConceptHostIntegrity(host) {
  if (!host) return false;
  const forbidden = host.querySelector([
    ".intake-panel", ".upload-drop", "#uploadDrop", "#photoPrivacyNote", "#propertyType",
    ".field-grid", ".starter-coaching", ".privacy-callout", ".camera-button",
    ".replace-photo-button", ".panel-title", ".panel-body"
  ].join(","));
  const shells = host.querySelectorAll(":scope > .photo-first-visual-shell");
  const stages = host.querySelectorAll(".photo-concept-stage");
  const images = host.querySelectorAll(".photo-concept-stage > .photo-concept-image");
  const clean = !forbidden && shells.length === 1 && stages.length === 1 && images.length <= 1;
  if (!clean) console.error("VerdeAI concept-host integrity failure", { forbidden, shells: shells.length, stages: stages.length, images: images.length });
  return clean;
}

function photoSourceCheckHtml() {
  if (!state.photoDataUrl || state.demoMode || state.selfTestMode) return "";
  const name = String(state.photoName || "").toLowerCase();
  const size = String(state.photoMeta?.originalSize || state.photoMeta?.storedSize || "");
  const match = size.match(/(\d+)\s*[×x]\s*(\d+)/i);
  const portrait = match ? Number(match[2]) > Number(match[1]) * 1.18 : false;
  const screenshotName = /(screen.?shot|screen.?capture|screenshot|capture)/i.test(name);
  if (!portrait && !screenshotName) return "";
  return `<p class="photo-source-check" role="note"><b>Photo source check:</b> if VerdeAI headings, privacy text, or a camera icon appear inside the photograph, they are baked into the uploaded image. Replace it with the original property photo rather than an app screenshot.</p>`;
}

function conceptVisualHtml(mode = normaliseVisualMode(), options = {}) {
  const analysed = synchroniseAnalysedBoardState("visual render");
  const future = visualFutureForMode(mode);
  const hasPhoto = Boolean(state.photoDataUrl || state.demoMode || state.selfTestMode);
  const stageBackground = state.photoDataUrl ? "" : demoBackgroundStyle();
  const photoLayer = state.photoDataUrl ? `<img class="photo-concept-image" src="${escapeHtml(state.photoDataUrl)}" alt="Property photograph used as the concept base" />` : "";
  const noPhoto = hasPhoto ? "" : " no-photo";
  if (analysed) ensureCalibration();
  const overlay = mode === "original" || !analysed ? "" : overlayHtml(future, { mode });
  const switcher = options.includeSwitch === false ? "" : visualModeSwitchHtml(mode);
  const legend = mode === "original" || !analysed ? "" : conceptLegendHtml(future);
  const context = `<div class="visual-context-line"><span>${escapeHtml(visualModeTitle(mode))}</span>${analysed && mode !== "original" ? `<small>${future.id === state.recommendedFutureId ? "VerdeAI recommendation" : "Your selected direction"}</small>` : `<small>${hasPhoto ? "Untouched visual anchor" : "Upload a photo to begin"}</small>`}</div>`;
  const calibration = options.includeCalibration === false ? "" : calibrationControlsHtml();
  const editor = calibrationUi.open && analysed ? calibrationEditorSvg() : "";
  const finishBar = calibrationUi.open && analysed ? `<div class="calibration-finish-bar" role="group" aria-label="Finish concept placement"><button type="button" class="secondary" data-cal-action="undo" ${calibrationUi.undo.length ? "" : "disabled"}>Undo</button><button type="button" data-cal-action="done">Done placing concept</button></div>` : "";
  const stageState = calibrationUi.open ? " is-calibrating" : " is-finished";
  return `<div class="photo-first-visual-shell mode-${mode}" data-clean-visual-panel="v9.4">${switcher}${calibration}<div class="photo-concept-stage mode-${mode} ${overlayStyleClass(future)}${state.demoMode ? " demo-natural-ratio" : ""}${noPhoto}${stageState}" style="${stageBackground}; --overlay-tint:${future.tint}; --future-color:${future.color}">${photoLayer}${overlay || (!hasPhoto ? `<span class="dashboard-photo-empty">Upload a property photo or run the self-test</span>` : "")}${editor}<span class="visual-mode-chip">${escapeHtml(visualModeTitle(mode))}</span></div>${finishBar}${context}${legend}</div>`;
}

function testerPlantStageHtml() {
  return conceptVisualHtml("selected", { includeSwitch: false });
}


function setCalibrationTool(tool) {
  if (!["usable", "keep", "access", "opportunity", "firstMove"].includes(tool)) return;
  calibrationUi.tool = tool;
  renderDashboard();
  announce(calibrationInstruction());
}

function calibrationPointFromEvent(stage, event) {
  const rect = stage.getBoundingClientRect();
  return calibrationSafePoint(((event.clientX - rect.left) / rect.width) * 1000, ((event.clientY - rect.top) / rect.height) * 640);
}

function constrainUsablePoint(index, value, cal) {
  const p = calibrationSafePoint(value.x, value.y);
  const leftSide = Number(index) === 0 || Number(index) === 3;
  p.x = clampConcept(p.x, leftSide ? CALIBRATION_HANDLE_MARGIN : 500, leftSide ? 500 : 1000 - CALIBRATION_HANDLE_MARGIN);
  if (Number(index) === 0) p.y = clampConcept(p.y, CALIBRATION_HANDLE_MARGIN, Math.max(CALIBRATION_HANDLE_MARGIN, cal.usable[3].y - 42));
  if (Number(index) === 1) p.y = clampConcept(p.y, CALIBRATION_HANDLE_MARGIN, Math.max(CALIBRATION_HANDLE_MARGIN, cal.usable[2].y - 42));
  if (Number(index) === 2) p.y = clampConcept(p.y, Math.min(640 - CALIBRATION_HANDLE_MARGIN, cal.usable[1].y + 42), 640 - CALIBRATION_HANDLE_MARGIN);
  if (Number(index) === 3) p.y = clampConcept(p.y, Math.min(640 - CALIBRATION_HANDLE_MARGIN, cal.usable[0].y + 42), 640 - CALIBRATION_HANDLE_MARGIN);
  return p;
}

function updateCalibrationHandle(kind, index, corner, value) {
  const cal = ensureCalibration();
  const p = calibrationSafePoint(value.x, value.y);
  if (kind === "usable") cal.usable[Number(index)] = constrainUsablePoint(index, p, cal);
  if (kind === "access") cal.access[Number(index)] = p;
  if (kind === "opportunity") cal.opportunity = p;
  if (kind === "firstMove") cal.firstMove = p;
  if (kind === "keep") {
    const box = cal.keepClear[Number(index)];
    if (!box) return;
    const right = box.x + box.width;
    const bottom = box.y + box.height;
    if (corner === "nw") { box.x = Math.min(p.x, right - 48); box.y = Math.min(p.y, bottom - 48); box.width = right - box.x; box.height = bottom - box.y; }
    if (corner === "ne") { box.y = Math.min(p.y, bottom - 48); box.width = Math.max(48, p.x - box.x); box.height = bottom - box.y; }
    if (corner === "se") { box.width = Math.max(48, p.x - box.x); box.height = Math.max(48, p.y - box.y); }
    if (corner === "sw") { box.x = Math.min(p.x, right - 48); box.width = right - box.x; box.height = Math.max(48, p.y - box.y); }
  }
  cal.customised = true;
  state.calibration = normaliseCalibration(cal);
}

function calibrationPointForHandle(handle) {
  const cal = ensureCalibration();
  const kind = handle.dataset.calKind;
  const index = Number(handle.dataset.calIndex || 0);
  const corner = handle.dataset.calCorner;
  if (kind === "usable") return { ...cal.usable[index] };
  if (kind === "access") return { ...cal.access[index] };
  if (kind === "opportunity") return { ...cal.opportunity };
  if (kind === "firstMove") return { ...cal.firstMove };
  const box = cal.keepClear[index] || { x: 0, y: 0, width: 100, height: 100 };
  return { x: corner?.includes("e") ? box.x + box.width : box.x, y: corner?.includes("s") ? box.y + box.height : box.y };
}

function calibrationHandleSelector(handle) {
  const kind = handle.dataset.calKind;
  const index = handle.dataset.calIndex;
  const corner = handle.dataset.calCorner;
  return `.calibration-handle[data-cal-kind="${kind}"]${index !== undefined ? `[data-cal-index="${index}"]` : ""}${corner ? `[data-cal-corner="${corner}"]` : ""}`;
}

function refreshCalibrationStageGeometry(stage) {
  if (!stage) return;
  const cal = ensureCalibration();
  const points = calibrationPolygonPoints();
  stage.querySelectorAll(".calibration-usable-outline, clipPath polygon").forEach((node) => node.setAttribute("points", points));
  const routeD = `M${cal.access[0].x} ${cal.access[0].y} L${cal.access[1].x} ${cal.access[1].y}`;
  stage.querySelectorAll(".calibration-protected-route, .calibration-mask-route").forEach((node) => node.setAttribute("d", routeD));
  stage.querySelectorAll("[data-cal-mask-keep]").forEach((node) => {
    const box = cal.keepClear[Number(node.dataset.calMaskKeep)];
    if (!box) return;
    node.setAttribute("x", box.x); node.setAttribute("y", box.y); node.setAttribute("width", box.width); node.setAttribute("height", box.height);
  });
  stage.querySelectorAll(".calibration-keep-clear[data-cal-box-index]").forEach((group) => {
    const box = cal.keepClear[Number(group.dataset.calBoxIndex)];
    if (!box) return;
    const rect = group.querySelector("rect");
    const text = group.querySelector("text");
    if (rect) { rect.setAttribute("x", box.x); rect.setAttribute("y", box.y); rect.setAttribute("width", box.width); rect.setAttribute("height", box.height); }
    if (text) { text.setAttribute("x", Math.max(110, Math.min(890, box.x + box.width / 2))); text.setAttribute("y", Math.max(44, box.y + 42)); text.setAttribute("text-anchor", "middle"); }
  });
  stage.querySelectorAll(".calibration-handle").forEach((handle) => {
    const actual = calibrationPointForHandle(handle);
    const display = calibrationHandleDisplayPoint(actual, stage);
    handle.setAttribute("transform", `translate(${display.x} ${display.y})`);
    handle.setAttribute("aria-valuetext", `Horizontal ${Math.round(actual.x / 10)} percent, vertical ${Math.round(actual.y / 6.4)} percent`);
  });
  conceptMarkerPositions().forEach((p, index) => stage.querySelectorAll(`[data-concept-marker="${index + 1}"]`).forEach((marker) => marker.setAttribute("transform", `translate(${p.x} ${p.y})`)));
}

function refreshCalibrationHandleShape(stage) {
  if (!stage) return;
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const xScale = (rect.height * 1000) / (rect.width * 640);
  stage.querySelectorAll(".calibration-handle-shape").forEach((shape) => shape.setAttribute("transform", `scale(${xScale} 1)`));
  refreshCalibrationStageGeometry(stage);
}

function setCalibrationDragging(active) {
  calibrationUi.dragging = Boolean(active);
  document.body.classList.toggle("calibration-dragging", calibrationUi.dragging);
}

function bindCalibrationUi(container) {
  $$('[data-cal-action]', container).forEach((button) => button.addEventListener("click", () => {
    const action = button.dataset.calAction;
    if (action === "open") { openConceptCalibration("Inline visual control"); return; }
    if (action === "done") {
      setCalibrationDragging(false);
      calibrationUi.open = false;
      addHistory("Concept placement adjusted", state.calibration?.customised ? "User-guided calibration saved" : "VerdeAI layout kept");
      renderAll();
      scheduleSessionPersist();
      announce("Concept placement saved");
      window.setTimeout(scrollToMainVisual, 30);
      return;
    }
    if (action === "reset") { pushCalibrationUndo(); state.calibration = defaultCalibrationForScenario(); state.calibration.customised = false; renderDashboard(); announce("VerdeAI starting layout restored"); return; }
    if (action === "undo" && calibrationUi.undo.length) { state.calibration = normaliseCalibration(calibrationUi.undo.pop()); renderDashboard(); scheduleSessionPersist(); announce("Last calibration change undone"); return; }
    if (action === "add-keep") {
      pushCalibrationUndo();
      const cal = ensureCalibration();
      const offset = cal.keepClear.length * 45;
      cal.keepClear.push({ id: `keep-clear-${Date.now()}`, x: Math.min(700, 150 + offset), y: Math.min(400, 145 + offset), width: 260, height: 135 });
      cal.customised = true;
      calibrationUi.tool = "keep";
      state.calibration = normaliseCalibration(cal);
      renderDashboard();
      announce("Keep-clear box added. Drag its bright corner handles.");
      return;
    }
    if (action === "remove-keep") {
      const cal = ensureCalibration();
      if (cal.keepClear.length) { pushCalibrationUndo(); cal.keepClear.pop(); cal.customised = true; state.calibration = normaliseCalibration(cal); renderDashboard(); announce("Last keep-clear box removed"); }
    }
  }));
  $$('[data-cal-tool]', container).forEach((button) => button.addEventListener("click", () => setCalibrationTool(button.dataset.calTool)));
  const stage = container.querySelector(".photo-concept-stage");
  if (!stage || !calibrationUi.open) return;
  stage.style.touchAction = "none";
  refreshCalibrationHandleShape(stage);
  window.requestAnimationFrame(() => refreshCalibrationHandleShape(stage));
  $$(".calibration-handle.is-active", stage).forEach((handle) => {
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      pushCalibrationUndo();
      const kind = handle.dataset.calKind;
      const index = handle.dataset.calIndex;
      const corner = handle.dataset.calCorner;
      const pointerId = event.pointerId;
      let pendingEvent = event;
      let frame = 0;
      let finished = false;
      const applyPending = () => {
        frame = 0;
        if (!pendingEvent) return;
        updateCalibrationHandle(kind, index, corner, calibrationPointFromEvent(stage, pendingEvent));
        refreshCalibrationStageGeometry(stage);
        pendingEvent = null;
      };
      const move = (moveEvent) => {
        moveEvent.preventDefault();
        pendingEvent = moveEvent;
        if (!frame) frame = window.requestAnimationFrame(applyPending);
      };
      const finish = (finishEvent) => {
        if (finished) return;
        finished = true;
        finishEvent?.preventDefault?.();
        if (frame) { window.cancelAnimationFrame(frame); frame = 0; }
        if (pendingEvent) applyPending();
        handle.removeEventListener("pointermove", move);
        handle.removeEventListener("pointerup", finish);
        handle.removeEventListener("pointercancel", finish);
        try { if (handle.hasPointerCapture?.(pointerId)) handle.releasePointerCapture(pointerId); } catch {}
        setCalibrationDragging(false);
        renderDashboard();
        scheduleSessionPersist();
        announce(`${handle.getAttribute("aria-label") || "Concept placement"} updated`);
      };
      try { handle.setPointerCapture?.(pointerId); } catch {}
      setCalibrationDragging(true);
      handle.addEventListener("pointermove", move, { passive: false });
      handle.addEventListener("pointerup", finish);
      handle.addEventListener("pointercancel", finish);
      announce(`Moving ${handle.getAttribute("aria-label") || "concept handle"}`);
    });
    handle.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      pushCalibrationUndo();
      const selector = calibrationHandleSelector(handle);
      const current = calibrationPointForHandle(handle);
      const step = event.shiftKey ? 28 : 10;
      if (event.key === "ArrowLeft") current.x -= step;
      if (event.key === "ArrowRight") current.x += step;
      if (event.key === "ArrowUp") current.y -= step;
      if (event.key === "ArrowDown") current.y += step;
      updateCalibrationHandle(handle.dataset.calKind, handle.dataset.calIndex, handle.dataset.calCorner, current);
      renderDashboard();
      scheduleSessionPersist();
      window.requestAnimationFrame(() => document.querySelector(`#dashboardTodayVisual ${selector}`)?.focus());
    });
  });
}


function renderTesterPage() {
  const holder = $("testerPageVisual");
  if (holder) holder.innerHTML = testerPlantStageHtml();
  const legend = $("testerPageOverlayLegend");
  if (legend) legend.innerHTML = tailoredLabels(selectedFuture()).map((label, index) => `<span data-index="${index + 1}">${escapeHtml(label)}</span>`).join("");
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const f = selectedFuture();
  const status = state.analysisComplete ? `${profile.pattern} → ${f.title}` : smartNextPlan().label;
  const cards = [
    ["Current result", status],
    ["Plant overlay", state.analysisComplete ? tailoredLabels(f).join(" • ") : "Run self-test or tap one starter clue to place overlay labels."],
    ["First move", state.analysisComplete ? roadmapData()[0].task : smartNextPlan().detail],
    ["What to show testers", "Screenshot the plant overlay, then copy the tester summary. No app-explaining marathon required."]
  ];
  const cardEl = $("testerPageCards");
  if (cardEl) cardEl.innerHTML = cards.map(([title, text]) => `<article class="tester-result-card"><b>${escapeHtml(title)}</b><p>${escapeHtml(text)}</p></article>`).join("");
}

function scenarioGuide() {
  return SCENARIO_GUIDES[state.propertyType] || null;
}

function recommendedFuture() {
  return FUTURES.find((future) => future.id === state.recommendedFutureId)
    || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note))[0]
    || FUTURES[0];
}

function scenarioDiagnosis(profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"]) {
  return scenarioGuide()?.diagnosis || `${profile.pattern} needs one clear role, one protected route, and a staged first test before permanent changes.`;
}

function scenarioFutureFit(future) {
  const type = state.propertyType;
  const fits = {
    blank: {
      belonging: "Creates the missing identity with one anchor and a readable arrival.",
      minimal: "Keeps the open space calm with a repeated edge and very little upkeep.",
      wildlife: "Uses one edge for habitat while keeping the centre flexible.",
      gathering: "Tests a destination without filling the whole blank canvas.",
      productive: "Turns the sunniest practical edge into a useful food zone.",
      maker: "Reserves practical space early so storage does not claim the site later."
    },
    "front-yard": {
      belonging: "Best strengthens the street-to-door welcome without adding clutter.",
      minimal: "Uses repeated planting and clean edges for quiet street appeal.",
      wildlife: "Adds habitat along the public edge while protecting the entry view.",
      gathering: "Adds a small pause point without turning the front yard into a patio.",
      productive: "Keeps edible planting neat and away from the main arrival line.",
      maker: "Protects practical access but is visually secondary in this public-facing space."
    },
    courtyard: {
      belonging: "Uses containers, a protected doorway line, and one welcoming pause point without pretending paving is open soil.",
      minimal: "Keeps the paved room calm with narrow edge planters and clear circulation.",
      wildlife: "Adds habitat through containers and a small water cue while keeping doors and furniture clear.",
      gathering: "Best uses the existing paved room for comfortable seating, lighting, and an uncluttered route.",
      productive: "Uses raised containers only at the brightest practical edge; it does not assume full sun or garden soil.",
      maker: "Protects a durable route and bounded storage without taking over the social courtyard."
    },
    "under-building": {
      belonging: "Softens concrete and makes the entry feel intentional while preserving access.",
      minimal: "Best fits deep shade with mulch, tough foliage, and one clean route.",
      wildlife: "Builds a sheltered habitat pocket away from columns and foot traffic.",
      gathering: "Creates a dry pause point only where headroom and access allow it.",
      productive: "Uses portable herbs only at the brightest reachable edge.",
      maker: "Protects a practical strip and keeps tools clear of damp planting zones."
    },
    overgrown: {
      belonging: "Reveals a welcoming line using the best existing structure rather than replacing everything.",
      minimal: "Reduces upkeep after the keep/remove audit with mulch and repeated edges.",
      wildlife: "Best preserves mature habitat while selectively clearing movement and sight lines.",
      gathering: "Finds one usable pocket only after hidden ground and access are revealed.",
      productive: "Reclaims a sunny serviceable patch after competing growth is removed.",
      maker: "Protects access through the recovery area but should not drive the whole garden."
    },
    workshop: {
      belonging: "Adds a tidy arrival edge without compromising workshop movement.",
      minimal: "Keeps dust-prone edges simple and low-care around the work zone.",
      wildlife: "Places habitat outside sparks, traffic, and storage pressure.",
      gathering: "Adds a break area only after the working route is protected.",
      productive: "Keeps food planting away from dust and uses a clean sunny edge.",
      maker: "Best protects the work pad, bulky-item route, and bounded storage."
    },
    utility: {
      belonging: "Frames the service zone so it looks intentional from the main view.",
      minimal: "Uses the least clutter: one removable screen and a clean service edge.",
      wildlife: "Adds habitat beside, never across, the inspection path.",
      gathering: "Keeps people away from service clearance while improving the nearby view.",
      productive: "Uses movable pots only where maintenance access stays obvious.",
      maker: "Best treats access, screening, and practical clearance as one system."
    }
  };
  return fits[type]?.[future.id] || future.baseWhy;
}

function scenarioOverlayLabels(future) {
  const guide = scenarioGuide();
  const futureLens = {
    belonging: ["welcome point", "soft repeated edge"],
    minimal: ["low-care planting mass", "clean material edge"],
    wildlife: ["habitat pocket", "water/shelter point"],
    gathering: ["comfortable pause zone", "low-glare evening light"],
    productive: ["sunny useful pocket", "easy water route"],
    maker: ["protected work zone", "bounded storage edge"]
  }[future.id] || future.visualLabels.slice(0, 2);
  if (!guide) return [...future.visualLabels, "main viewing line"].slice(0, 4);
  return [guide.labels[0], guide.labels[1], futureLens[0], futureLens[1]].slice(0, 4);
}

function tailoredLabels(future) {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  const labels = scenarioOverlayLabels(future);
  const constraint = state.constraint;
  if (state.propertyType === "courtyard") { labels[0] = "keep doorway and main path clear"; labels[1] = "use narrow container planting"; labels[3] = "test comfort, shade, and lighting"; }
  if (state.propertyType === "side-yard") { labels[0] = "protect the narrow access line"; labels[1] = "keep wall/fence edges readable"; }
  if (state.propertyType === "foundation") { labels[0] = "repair the house-edge line"; labels[1] = "repeat planting masses"; }
  if (state.propertyType === "slope") { labels[0] = "trace water movement"; labels[1] = "protect stable access"; labels[3] = "check drainage first"; }
  if (constraint === "water-risk") labels[3] = "drainage check zone";
  if (constraint === "privacy-gap" || extractNoteSignals(state.note).includes("privacy")) labels[2] = "test a removable privacy line";
  if (constraint === "storage-creep") labels[1] = state.propertyType === "workshop" ? "contain storage outside route" : "contained storage edge";
  if (constraint === "access-awkward") labels[0] = state.propertyType === "workshop" ? "protect the bulky-item route" : "clear access route";
  if (constraint === "messy-edge") labels[1] = "repair one boundary rhythm";
  if (state.designRefinements.includes("seating")) labels[2] = "test seating position";
  if (state.designRefinements.includes("lighting")) labels[3] = "test evening light cue";
  if (profile.pattern === "Maker Territory" && future.id === "maker") labels[2] = "keep the work surface clear";
  return unique(labels).slice(0, 4);
}


function futureCompositionText(future) {
  const composition = {
    belonging: "One irregular focal tree or sculptural shrub anchors the view, with low supporting planting and open ground around marker 5.",
    minimal: "A restrained palette repeats naturally varied grasses and low mounds along clean edges while leaving generous negative space.",
    wildlife: "Layered screening, shrubs, ferns, grasses, flowering perennials, and groundcovers form habitat bands without closing the movement route.",
    gathering: "Planting frames the perimeter while the centre remains open for a table, chairs, and comfortable circulation.",
    productive: "Recognisable edible beds, herbs, and compact productive planting sit beside clear working paths and accessible edges.",
    maker: "Boundary screening and tough low planting soften the yard while the work pad, storage boundary, and bulky-item route remain open."
  };
  return composition[future.id] || future.baseWhy;
}

function specificWhy(future) {
  const note = cleanPropertyNote(state.note);
  const noteLine = note && !note.toLowerCase().startsWith("self-test") ? ` Property clue: ${note}` : "";
  return `${scenarioFutureFit(future)} ${futureCompositionText(future)}${noteLine}`.trim();
}

function renderRecommendation() {
  const f = recommendedFuture();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  setText("recommendationTitle", state.analysisComplete ? f.title : "Upload, analyse, then choose.");
  setText("recommendationWhy", state.analysisComplete ? recommendationWhy(f, profile) : "VerdeAI will use the situation, goal, postcode clue, and your note to make the result less generic.");
  setText("oracleReading", state.analysisComplete ? oracleReading(f, profile) : "A place is rarely asking for more stuff first. Usually it wants a clearer role.");
  const compass = state.analysisComplete ? state.dna : buildDna(profile, [], { label: "" });
  renderDnaList("compassList", compass, ["potential", "identity", "flow", "utility", "value"]);
  const list = specificityReasons(f, profile);
  $("specificityList").innerHTML = list.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
}

function recommendationWhy(future, profile) {
  const reasons = [scenarioDiagnosis(profile), scenarioFutureFit(future)];
  if (state.constraint !== "unsure") reasons.push(`Main pressure: ${constraintLabel(state.constraint)}. ${constraintProfile().nudge}`);
  if (state.budget === "weekend") reasons.push("The first move is deliberately cheap, visible, and reversible.");
  return unique(reasons).join(" ");
}

function oracleReading(future, profile) {
  const readings = {
    belonging: "This place wants one confident welcome gesture. Not twenty little apologies in plant form.",
    minimal: "The strongest move is restraint: fewer choices, repeated better, with edges that make maintenance boring in a good way.",
    wildlife: "The edge zones are probably more valuable than the open middle. Give life somewhere to arrive, hide, drink, and feed.",
    gathering: "The property is asking for a reason to stay. Comfort beats decoration every day of the week.",
    productive: "Useful plants need good access. If harvesting feels annoying, the garden slowly becomes decorative guilt.",
    maker: "Protect the work zone. A practical place becomes joyful when starting a project feels easy."
  };
  return `${readings[future.id] || readings.belonging} Pattern: ${profile.secondary}.`;
}

function renderNextSteps() {
  const steps = roadmapData();
  $("nextSteps").innerHTML = steps.slice(0, 5).map((step) => `<li><strong>${escapeHtml(step.when)}:</strong> ${escapeHtml(step.task)}</li>`).join("");
}

function roadmapData() {
  const f = selectedFuture();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  const commonFirst = firstMoveFor(profile, f);
  const refinements = state.designRefinements.map(labelForRefinement);
  return [
    { when: "Today", task: commonFirst },
    { when: "Before buying", task: constraintProfile().nudge },
    { when: "This weekend", task: `Mark the main ${tailoredLabels(f)[0].toLowerCase()} with hose, rope, chalk, or temporary pots before buying anything.` },
    { when: "Next 2 weeks", task: `Test ${f.title.toLowerCase()} with one cheap, reversible change: edge line, seating position, mulch patch, or screen sample.` },
    { when: "Month 1", task: `Commit only after the test feels right from the main viewing point and normal walking route.` },
    { when: "Refinement", task: refinements.length ? `Tune toward ${refinements.join(", ")}.` : "Keep the design balanced until one problem proves it needs special attention." }
  ];
}

function firstMoveFor(profile, future) {
  if (state.propertyType === "courtyard") return "Marker 5: use two pots or chalk to test a narrow edge beside the covered seating area while keeping the doorway and main path clear.";
  if (state.constraint === "water-risk") return "Pour a bucket or hose-test a small area and watch where water collects before designing around it.";
  if (state.constraint === "privacy-gap") return "Stand where you feel exposed and mark one screen line with temporary pots, stakes, or cardboard before planting.";
  if (scenarioGuide()?.firstMove) return scenarioGuide().firstMove;
  if (state.constraint === "storage-creep") return "Sort the space into keep, move, and contain piles, then mark one storage boundary that cannot expand.";
  if (state.constraint === "maintenance-drag") return "Pick the worst maintenance trap and replace it with one repeated low-care edge or mulch zone.";
  if (state.constraint === "access-awkward") return "Walk the route with tools or a wheelbarrow and mark the path that must stay clear.";
  if (state.constraint === "shade-dark") return "Check where the shade is strongest, then mark one low-light planting or mulch zone that will not block access.";
  if (profile.pattern === "Guided First Pass") return "Choose one starter clue that matches the photo before trusting the result.";
  if (profile.pattern === "Landscape Systems") return "Check water movement, drainage, base stability, and soil erosion before adding plants.";
  if (profile.pattern === "Passage Space") return "Walk the access route with something bulky in your hands, then mark what must stay clear.";
  if (future.id === "minimal") return "Choose one repeatable edge line and one tough plant/material combination; ignore everything else for now.";
  if (future.id === "wildlife") return "Find the quiet edge where habitat can start without blocking movement.";
  if (future.id === "gathering") return "Place chairs temporarily and test the circle size before building or buying.";
  if (future.id === "productive") return "Find the sunniest practical patch with easy water access and enough walking room.";
  return "Stand at the main viewing point and choose the one feature that should guide the whole space.";
}

function renderReports() {
  const text = reportText();
  setText("reportText", text);
  setText("fullReport", reportText({ full: true }));
}

function reportText(options = {}) {
  restoreAnalysisSnapshot();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const f = selectedFuture();
  const recommended = recommendedFuture();
  const signals = extractNoteSignals(state.note);
  const keySiteLines = visibleSiteLanguage(profile, signals).filter((line) => !line.startsWith("Photo is used")).slice(0, 4);
  const noticedLines = unique(state.noticed.length ? state.noticed : buildNoticed(profile, signals, state.climate || {}))
    .filter((line) => !keySiteLines.includes(line))
    .slice(0, 4);
  const dnaLines = Object.entries(state.dna || {}).slice(0, options.full ? 9 : 5).map(([key, value]) => `- ${titleCase(key)}: ${value}/100`).join("\n");
  const steps = roadmapData().slice(0, options.full ? 6 : 4).map((step) => `- ${step.when}: ${step.task}`).join("\n");
  const note = cleanPropertyNote(state.note);
  const design = state.designRefinements.length ? state.designRefinements.map(labelForRefinement).join(", ") : "balanced / none selected";
  return `VERDEAI PROPERTY REPORT — v${state.version}

Result snapshot:
- Situation: ${profile.label}
- Pattern: ${profile.pattern} / ${profile.secondary}
- Main problem: ${constraintLabel(state.constraint)} — ${constraintProfile().problem}
- Recommended future: ${recommended.icon} ${recommended.title}
- Selected future: ${f.icon} ${f.title}${f.id === recommended.id ? " (same as recommendation)" : " (tester choice)"}
- Recommended first move: ${firstMoveFor(profile, recommended)}

Why VerdeAI recommends it:
${recommendationWhy(recommended, profile)}

Visible clues used:
${keySiteLines.length ? keySiteLines.map((line) => `- ${line}`).join("\n") : "- Add one starter clue or property note to make this more specific."}
${note ? `- Property note considered: ${note}` : ""}

Plant overlay ideas:
- ${tailoredLabels(f).join("\n- ")}

First actions:
${steps}

What VerdeAI noticed:
${noticedLines.length ? noticedLines.map((line) => `- ${line}`).join("\n") : "- Run an analysis to generate specific observations."}

Climate clue:
${state.climate?.label || "No postcode supplied"}
${state.climate?.notes?.slice(0, 2).map((n) => `- ${n}`).join("\n") || "- Add a postcode for a basic climate clue."}

Design refinements:
${design}

Tester note:
${$("feedbackNotes")?.value || "No tester note yet."}${options.full ? `

Property DNA:
${dnaLines || "- Run analysis to generate Property DNA."}

Specificity reasons:
${specificityReasons(f, profile).slice(0, 6).map((line) => `- ${line}`).join("\n")}

Generated:
${state.lastRunAt || new Date().toISOString()}

Important limitation:
Build v9.4 uses procedurally varied botanical silhouettes, contact shadows, depth bands, and perspective scaling directly on the uploaded photo across six distinct futures. Site interpretation remains clue-guided rule logic. Real AI rendering, backend activation, provider calls, and paid calls are disabled.` : ""}`;
}

function renderCompare() {
  restoreAnalysisSnapshot();
  const original = $("compareOriginal");
  const future = $("compareFuture");
  const f = selectedFuture();
  if (original) {
    original.className = "compare-image compare-concept-host";
    original.removeAttribute("style");
    original.innerHTML = conceptVisualHtml("original", { includeSwitch: false });
  }
  if (future) {
    future.className = `compare-image future-overlay-preview compare-concept-host ${overlayStyleClass(f)}`;
    future.removeAttribute("style");
    future.innerHTML = conceptVisualHtml("selected", { includeSwitch: false });
  }
  const legend = $("overlayLegend");
  if (legend) legend.innerHTML = visualLegendItems(f).map(([title, text], index) => `<span data-index="${index + 1}"><b>${escapeHtml(title)}</b> ${escapeHtml(text)}</span>`).join("");
  if ($("scorecard")) $("scorecard").innerHTML = scorecardHtml(f);
}
function scorecardHtml(future) {
  const dna = state.dna || {};
  const scores = [
    ["Fit for stated goal", rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note)).find((x) => x.id === future.id)?.score || 74],
    ["Ease of first step", state.budget === "weekend" ? 88 : 72],
    ["Maintenance fit", state.maintenance === "low" && future.id !== "minimal" ? 64 : 84],
    ["Hidden potential unlocked", dna.potential || 70]
  ];
  return scores.map(([name, value]) => `<div class="score-item"><b>${escapeHtml(name)}</b><div class="meter" aria-label="${escapeHtml(name)} ${value} percent"><span style="--w:${value}%"></span></div><small>${value}/100</small></div>`).join("");
}

function renderPlan() {
  const f = selectedFuture();
  const stages = [
    ["Now", "Temporary marks and observation"],
    ["3 months", "One test zone proves the direction"],
    ["1 year", `${f.title} becomes visible from the main view`],
    ["3 years", "Structure, planting, and use start working together"],
    ["5 years", "The property has a recognisable identity"]
  ];
  $("timelineMovie").innerHTML = stages.map(([time, text]) => `<article class="movie-card"><b>${escapeHtml(time)}</b><small>${escapeHtml(text)}</small></article>`).join("");
  $("actionRoadmap").innerHTML = `<div class="action-roadmap-grid">${roadmapData().map((step) => `<article class="action-step"><b>${escapeHtml(step.when)}</b><p>${escapeHtml(step.task)}</p></article>`).join("")}</div>`;
  $("plantPalette").innerHTML = `<div class="plant-grid">${paletteFor(f).map(([name, why]) => `<article class="plant-card"><b>${escapeHtml(name)}</b><small>${escapeHtml(why)}</small></article>`).join("")}</div>`;
  $("riskNotes").innerHTML = riskNotes().map((line) => `<article class="risk-item">${escapeHtml(line)}</article>`).join("");
}

function paletteFor(future) {
  const palettes = {
    belonging: [["Feature tree or large pot", "Creates one strong arrival gesture"], ["Repeated hardy shrubs", "Makes the design feel intentional"], ["Simple path edge", "Clarifies movement"], ["Warm lighting", "Improves evening first impression"]],
    minimal: [["Mulch or gravel plane", "Reduces weeds and visual clutter"], ["One repeated grass/sedge", "Clean rhythm with low fuss"], ["Steel/timber edge", "Defines lines clearly"], ["Evergreen structure", "Keeps it tidy year-round"]],
    wildlife: [["Flowering native shrubs", "Food for birds and pollinators"], ["Layered groundcover", "Shelter and weed control"], ["Small water point", "Habitat value without huge cost"], ["Deadwood/rock habitat", "Useful micro-shelter"]],
    gathering: [["Shade element", "Makes the place usable longer"], ["Movable chairs", "Test comfort before building"], ["Low planting edge", "Creates room boundaries"], ["Soft lighting", "Turns it into an evening destination"]],
    productive: [["Raised bed", "Easy soil control and access"], ["Herb edge", "Quick wins near the house"], ["Citrus or fruit feature", "Useful long-term reward"], ["Compost corner", "Closes the loop"]],
    maker: [["Hard working surface", "Cleaner and safer project area"], ["Weather screen", "Protects tools and workflow"], ["Storage boundary", "Stops clutter creep"], ["Pause seat", "A place to think without leaving the zone"]]
  };
  return palettes[future.id] || palettes.belonging;
}

function renderDesign() {
  restoreAnalysisSnapshot();
  const f = selectedFuture();
  const refs = state.designRefinements.length ? state.designRefinements.map(labelForRefinement) : ["balanced design"];
  setText("promptPreview", `VERDEAI IMAGE / CONCEPT PROMPT PREVIEW

Use the uploaded property photo as the base.
Preserve the existing building, boundaries, major trees, and perspective.
Create a ${f.title} concept for a ${TYPE_PROFILES[state.propertyType]?.label || "property"}.
Overlay readable concept zones: ${tailoredLabels(f).join(", ")}.
Style direction: ${refs.join(", ")}.
Intensity: ${state.intensity}/5.
Climate clue: ${state.climate?.label || "not supplied"}.
Main problem: ${constraintLabel(state.constraint)}.
Budget direction: ${budgetLabel(state.budget)}.
Maintenance direction: ${maintenanceLabel(state.maintenance)}.

Do not make it look like a fantasy mansion unless the original photo is already a fantasy mansion. Practical first, pretty second.`);
}


function loadRenderSettings() {
  try {
    const raw = localStorage.getItem(RENDER_SETTINGS_KEY) || LEGACY_RENDER_SETTINGS_KEYS.map((key) => localStorage.getItem(key)).find(Boolean) || "{}";
    const saved = JSON.parse(raw);
    state.aiRender = normaliseRenderSettings({ ...(state.aiRender || {}), ...saved });
  } catch {
    state.aiRender = normaliseRenderSettings(state.aiRender);
  }
}

function renderAISetup() {
  state.aiRender = normaliseRenderSettings(state.aiRender);
  const provider = RENDER_PROVIDER_COSTS["openai-gpt-image-2"];
  const health = pilotRuntime.health;
  const liveReady = isLivePilotReady();
  const status = $("renderStatusCard");
  if (status) {
    const headline = liveReady ? "Owner-approved one-image pilot is ready" : "Owner-approved pilot awaiting live Worker verification";
    const body = liveReady
      ? "The deployed Worker reports the server-side key present, kill switch off, test mode off, approved limits active, and no-store retention. One invited-code request may proceed."
      : pilotRuntime.localSafeLock
        ? "AI calls are stopped on this browser. The free calibrated overlay remains fully available."
        : pilotRuntime.healthError || "Add the deployed Worker URL to config.v9.4.js, configure its required secrets, then check pilot readiness.";
    status.innerHTML = `<div class="render-status ${liveReady ? "online" : "offline"}"><b>${escapeHtml(headline)}</b><p>${escapeHtml(body)}</p><div class="render-status-statusline"><span><em>Provider</em> ${escapeHtml(provider.label)}</span><span><em>Planning ceiling</em> US$0.15</span><span><em>Retention</em> No VerdeAI server storage</span><span><em>Fallback</em> Free calibrated overlay</span></div></div>`;
  }
  if ($("renderProviderSelect")) { $("renderProviderSelect").value = state.aiRender.provider; $("renderProviderSelect").disabled = false; }
  const renderButton = $("renderSelectedFutureBtn");
  if (renderButton) {
    renderButton.disabled = state.aiRender.provider === "none";
    renderButton.textContent = state.aiRender.provider === "none" ? "Select the approved provider to continue" : "Create one AI concept render";
  }
  if ($("renderApiKeyInput")) $("renderApiKeyInput").value = liveReady ? "Worker verified · API key remains server-side" : configuredApiBaseUrl() ? "Worker not ready or unreachable · no API key in browser" : "Worker URL not configured · no API key in browser";
  const futureSelect = $("renderFutureSelect");
  if (futureSelect) {
    futureSelect.innerHTML = FUTURES.map((future) => `<option value="${escapeHtml(future.id)}">${escapeHtml(future.icon)} ${escapeHtml(future.title)}</option>`).join("");
    futureSelect.value = selectedFuture().id;
  }
  const costBox = $("renderCostBox");
  if (costBox) costBox.innerHTML = `<b>Approved one-image limit</b><ul><li>Planning estimate: about US$0.08</li><li>Maximum request reservation: US$${PILOT_MAX_COST_USD.toFixed(2)}</li><li>Provider reservation cap: US$5 within a US$10 total pilot budget</li></ul><small>Actual provider billing is token-based. VerdeAI reserves the conservative request ceiling before contact.</small>`;
  renderReadinessChecklist();
  renderOwnerActivationPanel();
  renderBackendProviderPlan();
  const summary = $("renderActionSummary");
  if (summary) summary.innerHTML = `<div class="render-warning-card"><b>Free overlay remains the default</b><p><strong>Property:</strong> ${escapeHtml((TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"]).label)} · <strong>Selected:</strong> ${escapeHtml(selectedFuture().title)} · <strong>Request ceiling:</strong> US$0.15</p><p>${liveReady ? "The real path is available to an invited tester with a valid access code." : "The confirmation can be reviewed, but the Worker will safely block any unready request."}</p></div>`;
  renderOneFuturePreview();
  const promptGrid = $("renderPromptGrid");
  if (promptGrid) {
    const item = buildCalibrationAwareRenderRequest();
    promptGrid.innerHTML = renderPromptCard(item);
    $$('[data-copy-prompt]', promptGrid).forEach((btn) => btn.addEventListener("click", () => copyText(item.prompt, "Calibration-aware render prompt copied")));
  }
  renderAiRenderFlowState();
  renderMockRenderResults();
  renderLiveRenderResults();
}

function renderOneFuturePreview() {
  const el = $("oneFutureRenderPreview");
  if (!el) return;
  const request = buildCalibrationAwareRenderRequest();
  el.innerHTML = `<article class="one-render-summary"><div><span>${escapeHtml(request.icon)}</span><div><b>${escapeHtml(request.title)}</b><small>One photo · one selected future · one confirmation</small></div></div><p>${escapeHtml(request.short)}</p><div class="one-render-guardrails"><span>Planning ceiling US$0.15</span><span>120-second timeout</span><span>No VerdeAI image storage</span><span>Free-overlay fallback</span></div></article>`;
}

function renderReadinessChecklist() {
  const el = $("renderReadinessChecklist");
  if (!el) return;
  const health = pilotRuntime.health || {};
  const checks = [
    [true, "One-image-only request contract"],
    [true, "Browser resize and metadata-stripping path"],
    [true, "Server-side secret boundary"],
    [true, "Session, IP, invite-code and spend-cap guards"],
    [true, "Timeout, provider-failure and budget-lock fallbacks"],
    [true, "Free calibrated-overlay fallback"],
    [true, "Owner approved OpenAI GPT Image 2"],
    [true, "Owner approved Cloudflare Worker Paid"],
    [true, "Owner approved total pilot budget"],
    [true, "Owner approved 10 invited testers"],
    [true, "Owner approved no-store retention policy"],
    [Boolean(health.providerKeyPresent), "Provider API key present as a Worker secret"],
    [Boolean(health.realRenderingEnabled) && !health.killSwitchOn && !health.testModeOn, "Worker intentionally released for one-image pilot"],
    [Boolean(health.inviteCodesConfigured), "Invited pilot access codes configured"],
    [!pilotRuntime.localSafeLock, "This browser allows optional AI calls"]
  ];
  el.innerHTML = checks.map(([ok, label]) => `<div class="render-readiness-item ${ok ? "ready" : "blocked"}"><span>${ok ? "✓" : "LOCKED"}</span><b>${escapeHtml(label)}</b></div>`).join("");
}

function renderOwnerActivationPanel() {
  const el = $("ownerActivationChecklist");
  if (!el) return;
  const decisions = [
    ["Rendering provider", OWNER_ACTIVATION_PLAN.provider],
    ["Backend host", OWNER_ACTIVATION_PLAN.backendHost],
    ["Total pilot budget", OWNER_ACTIVATION_PLAN.pilotBudget],
    ["Invited tester limit", OWNER_ACTIVATION_PLAN.testerLimit],
    ["Retention / deletion policy", OWNER_ACTIVATION_PLAN.retentionPolicy]
  ];
  const approvedCount = Object.values(OWNER_ACTIVATION_PLAN.approvals).filter(Boolean).length;
  setText("ownerApprovalCount", `${approvedCount} of ${decisions.length} approvals recorded`);
  if ($("ownerApprovalProgress")) $("ownerApprovalProgress").value = approvedCount;
  el.innerHTML = decisions.map(([label, value], index) => `<article class="v922-owner-decision approved"><span>${index + 1}</span><div><b>${escapeHtml(label)}</b><small>${escapeHtml(value)}</small></div><strong>APPROVED</strong></article>`).join("");
  const health = pilotRuntime.health;
  const ready = isLivePilotReady();
  const liveState = $("ownerLiveSafetyState");
  if (liveState) liveState.innerHTML = `<b>Live Worker safety state</b><span>${ready ? "Provider path ready" : pilotRuntime.localSafeLock ? "Stopped on this browser" : health ? "Worker connected but locked" : "Worker not verified"}</span><span>Kill switch ${health ? (health.killSwitchOn ? "on" : "off") : "unknown"}</span><span>Test mode ${health ? (health.testModeOn ? "on" : "off") : "unknown"}</span><span>Server key ${health ? (health.providerKeyPresent ? "present" : "missing") : "unknown"}</span><span>No frontend key</span>`;
  const btn = $("activateOwnerPilotBtn");
  if (btn) {
    btn.disabled = true;
    btn.textContent = ready ? "Worker verified · use the render action below" : "Waiting for Worker verification";
  }
  setText("ownerActivationLockStatus", ready
    ? "The approved one-image path is available. The Worker still enforces the access code, session limit, IP limit, spend reservation, timeout, no-store policy, and hard server kill switch."
    : pilotRuntime.localSafeLock
      ? "This browser is in free-overlay-only mode. Use Check live pilot readiness to re-enable optional calls on this browser."
      : configuredApiBaseUrl()
        ? (pilotRuntime.healthError || "The Worker has not reported every required production gate as ready.")
        : "The five owner decisions are approved, but the deployed Worker URL has not been inserted into config.v9.4.js.");
}

function ownerApprovalRequestText() {
  return `VerdeAI Build v9.4 — approved pilot settings

1. Rendering provider: ${OWNER_ACTIVATION_PLAN.provider} — APPROVED
2. Backend host: ${OWNER_ACTIVATION_PLAN.backendHost} — APPROVED
3. Total pilot budget: ${OWNER_ACTIVATION_PLAN.pilotBudget} — APPROVED
4. Invited tester limit: ${OWNER_ACTIVATION_PLAN.testerLimit} — APPROVED
5. Retention / deletion policy: ${OWNER_ACTIVATION_PLAN.retentionPolicy} — APPROVED

Activation remains server-controlled. Required deployment items: deployed Worker URL, OPENAI_API_KEY secret, RATE_LIMIT_SALT secret, PILOT_INVITE_CODE_HASHES secret, active spend cap, and an intentionally released Worker kill switch.`;
}

function copyOwnerApprovalRequest() {
  copyText(ownerApprovalRequestText(), "Owner approval request copied");
}

function resetOwnerSafeState() {
  pilotRuntime.localSafeLock = true;
  pilotRuntime.liveResult = null;
  pilotRuntime.requestAbort?.abort();
  pilotRuntime.requestAbort = null;
  try { sessionStorage.setItem(PILOT_LOCAL_SAFE_LOCK_KEY, "true"); } catch { /* browser storage may be unavailable */ }
  state.aiRender = normaliseRenderSettings({ provider: "openai-gpt-image-2", connected: false, lastMockRenders: [], flowState: "idle", flowMessage: "", preparedImage: null });
  try { localStorage.setItem(RENDER_SETTINGS_KEY, JSON.stringify({ ...state.aiRender, preparedImage: null })); } catch { /* browser storage may be unavailable */ }
  renderAISetup();
  toast("AI calls stopped on this browser");
  announce("Safe browser lock restored. The free calibrated overlay remains available. The server kill switch is controlled in Cloudflare.");
}

function renderBackendProviderPlan() {
  const el = $("backendProviderPlan");
  if (!el) return;
  el.innerHTML = `<div class="backend-plan-card"><b>Approved production combination</b><p>OpenAI GPT Image 2 through a Cloudflare Worker with a Durable Object reservation, invite-code and rate-limit guard. The API key and access-code hashes are encrypted Worker secrets. Input and output are passed through and are not stored by VerdeAI.</p><ul><li>Browser: resize to a 1536px long edge, JPEG re-encode and strip normal metadata.</li><li>Worker: validate one image, five consent flags, invite code, byte limit, origin, session/IP limits and budget reservation.</li><li>Provider: one medium 1536×1024 JPEG image edit.</li><li>Response: one generated image in browser memory or an explicit free-overlay fallback.</li></ul></div>`;
}

function renderPromptCard(item) {
  return `<article class="render-prompt-card selected"><div class="render-prompt-head"><span>${escapeHtml(item.icon)}</span><b>${escapeHtml(item.title)}</b><small>planning ceiling US$0.15</small></div><p>${escapeHtml(item.short)}</p><pre>${escapeHtml(item.prompt)}</pre><button type="button" class="secondary" data-copy-prompt="${escapeHtml(item.futureId)}">Copy secure-pilot prompt</button></article>`;
}

function calibrationPercentPoint(pointValue) {
  return { xPercent: Number((Number(pointValue?.x || 0) / 10).toFixed(1)), yPercent: Number((Number(pointValue?.y || 0) / 6.4).toFixed(1)) };
}

function buildCalibrationAwareRenderRequest() {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const recommended = recommendedFuture();
  const selected = selectedFuture();
  const cal = normaliseCalibration(ensureCalibration());
  const firstMove = firstMoveFor(profile, selected);
  const usable = cal.usable.map(calibrationPercentPoint);
  const keepClear = cal.keepClear.map((box) => ({ xPercent: Number((box.x / 10).toFixed(1)), yPercent: Number((box.y / 6.4).toFixed(1)), widthPercent: Number((box.width / 10).toFixed(1)), heightPercent: Number((box.height / 6.4).toFixed(1)) }));
  const access = cal.access.map(calibrationPercentPoint);
  const opportunity = calibrationPercentPoint(cal.opportunity);
  const marker5 = calibrationPercentPoint(cal.firstMove);
  const prompt = [
    "Create one plausible early-stage landscape concept by editing the supplied property photograph. Preserve the original camera viewpoint and photographic character.",
    `Property situation: ${profile.label}. Pattern: ${profile.pattern}.`,
    `VerdeAI recommendation: ${recommended.title}. Owner/tester selected future: ${selected.title}.`,
    `Selected-future design language: ${tailoredLabels(selected).join(", ")}.`,
    `Usable ground polygon, image percentages: ${JSON.stringify(usable)}. Change only inside this permitted ground area.`,
    `Keep-clear rectangles, image percentages: ${JSON.stringify(keepClear)}. Do not alter or cover these areas.`,
    `Protected access route points, image percentages: ${JSON.stringify(access)}. Keep this route visibly unobstructed.`,
    `Main opportunity point: ${JSON.stringify(opportunity)}. Use it as the strongest believable emphasis.`,
    `Marker 5 / first reversible test location: ${JSON.stringify(marker5)}. First move: ${firstMove}`,
    "Preserve all buildings, rooflines, doors, windows, walls, columns, paths, utilities, hard surfaces and useful existing plants unless the permitted ground area clearly allows a minor surface treatment.",
    "Do not block access. Do not make structural modifications. Do not add extensions, new roofs, walls, pools, decks, stairs or relocated openings.",
    "Avoid unrealistic mature landscaping, instant large trees, excessive density, impossible shadows, floating objects or costly full-site rebuilding.",
    "Show a believable first-phase concept using modest young planting, movable pots, mulch, edging, lighting or seating only where permitted and appropriate.",
    "The output is inspiration only, not a final design, engineering drawing, planting specification or construction plan."
  ].join("\n");
  return {
    provider: "openai-gpt-image-2", count: 1, futureId: selected.id, icon: selected.icon, title: selected.title,
    short: `${profile.pattern} → ${selected.title}. Marker 5: ${String(firstMove).replace(/^Marker 5:\s*/i, "")}`,
    propertySituation: profile.label, recommendedFuture: recommended.title, selectedFuture: selected.title,
    calibration: { usableGround: usable, keepClearAreas: keepClear, protectedAccessRoute: access, opportunityPoint: opportunity, marker5 },
    firstMove, prompt, maxCostUsd: PILOT_MAX_COST_USD, fallback: "calibrated-overlay"
  };
}

function buildRenderPrompts() { return [buildCalibrationAwareRenderRequest()]; }
function estimateRenderCost(count = 1) { return count === 1 && state.aiRender?.provider !== "none" ? 0.08 : 0; }
function money(value) { return value <= 0 ? "$0.00" : `US$${Number(value).toFixed(2)} estimate`; }

function normaliseRenderSettings(value = {}) {
  const provider = value.provider === "none" ? "none" : "openai-gpt-image-2";
  return { provider, connected: Boolean(value.connected), lastMockRenders: Array.isArray(value.lastMockRenders) ? value.lastMockRenders.slice(-1) : [], flowState: value.flowState || "idle", flowMessage: value.flowMessage || "", preparedImage: value.preparedImage || null };
}

function saveRenderSettings() {
  state.aiRender = normaliseRenderSettings({ ...state.aiRender, provider: $("renderProviderSelect")?.value || "none" });
  try { localStorage.setItem(RENDER_SETTINGS_KEY, JSON.stringify({ ...state.aiRender, preparedImage: null })); } catch { /* browser storage may be unavailable */ }
  toast(state.aiRender.provider === "none" ? "Free overlay mode saved" : "Approved pilot preference saved");
  addHistory("Secure render plan updated", RENDER_PROVIDER_COSTS[state.aiRender.provider].label);
  renderAll();
}

function clearRenderSettings() {
  state.aiRender = normaliseRenderSettings({ provider: "none", lastMockRenders: [], flowState: "idle" });
  try { localStorage.removeItem(RENDER_SETTINGS_KEY); } catch { /* ignore */ }
  toast("Free calibrated overlay remains active");
  renderAll();
}

function openAiRenderConfirmation() {
  if (state.aiRender?.provider === "none") {
    toast("Select OpenAI GPT Image 2 in AI Setup before continuing");
    return;
  }
  if (!state.analysisComplete) {
    toast("Analyse the property before preparing an AI concept");
    activateTab("dashboard");
    return;
  }
  if (!state.photoDataUrl || state.demoMode || state.selfTestMode) {
    toast("A real uploaded property photo is required for the paid pilot");
    activateTab("explore");
    return;
  }
  const dialog = $("aiRenderConfirmDialog");
  const request = buildCalibrationAwareRenderRequest();
  const summary = $("aiRenderConfirmationSummary");
  if (summary) summary.innerHTML = `<div><b>Property situation</b><span>${escapeHtml(request.propertySituation)}</span></div><div><b>Selected future</b><span>${escapeHtml(request.selectedFuture)}</span></div><div><b>Estimated maximum cost</b><span>US$0.15 request reservation; provider billing must be verified</span></div><div><b>Image use</b><span>One concept request only; no render-all option</span></div><div><b>Live readiness</b><span>${escapeHtml(isLivePilotReady() ? "Worker verified" : "Worker will block until production gates are ready")}</span></div><div><b>Fallback</b><span>Free calibrated overlay remains available</span></div>`;
  ["confirmRenderPrivacy", "confirmRenderImageUse", "confirmRenderCost", "confirmRenderConcept"].forEach((id) => { if ($(id)) $(id).checked = false; });
  if ($("pilotAccessCode")) $("pilotAccessCode").value = "";
  setText("aiRenderConfirmError", "");
  if (dialog?.showModal) dialog.showModal(); else dialog?.setAttribute("open", "");
}

function closeAiRenderConfirmation() {
  const dialog = $("aiRenderConfirmDialog");
  if (dialog?.close) dialog.close(); else dialog?.removeAttribute("open");
}

async function submitOneRenderPilot(event) {
  event?.preventDefault();
  const required = ["confirmRenderPrivacy", "confirmRenderImageUse", "confirmRenderCost", "confirmRenderConcept"];
  const accessCode = String($("pilotAccessCode")?.value || "").trim();
  if (!required.every((id) => $(id)?.checked)) {
    setText("aiRenderConfirmError", "Confirm all four items before continuing.");
    return;
  }
  if (accessCode.length < 8) {
    setText("aiRenderConfirmError", "Enter the invited pilot access code supplied by the owner.");
    return;
  }
  if (pilotRuntime.localSafeLock) {
    setText("aiRenderConfirmError", "AI calls are stopped on this browser. Check live pilot readiness before continuing.");
    return;
  }
  if (!configuredApiBaseUrl()) {
    setText("aiRenderConfirmError", "The deployed Worker URL is not configured. The free overlay remains available.");
    return;
  }
  closeAiRenderConfirmation();
  pilotRuntime.liveResult = null;
  renderLiveRenderResults();
  setAiRenderFlowState("progress", "Resizing the photo, stripping metadata and asking the Worker to validate one approved request…");
  try {
    const preparedImage = await prepareImageForRender();
    if (!preparedImage) throw new Error("A real uploaded property photo is required.");
    state.aiRender.preparedImage = { bytes: preparedImage.bytes, width: preparedImage.width, height: preparedImage.height, metadataStripped: true };
    const request = buildCalibrationAwareRenderRequest();
    const sessionId = pilotSessionId();
    const controller = new AbortController();
    pilotRuntime.requestAbort = controller;
    const timer = window.setTimeout(() => controller.abort(), PILOT_TIMEOUT_MS + 15_000);
    let response;
    try {
      response = await fetch(`${configuredApiBaseUrl()}/api/render`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          ...request,
          provider: "openai-gpt-image-2",
          buildVersion: BUILD_VERSION,
          count: 1,
          sessionId,
          accessCode,
          imageDataUrl: preparedImage.dataUrl,
          imageBytes: preparedImage.bytes,
          metadataStripped: true,
          confirmRender: true,
          confirmPrivacy: true,
          confirmImageUse: true,
          confirmConceptOnly: true,
          confirmCost: true,
          maxCostUsd: PILOT_MAX_COST_USD
        })
      });
    } finally { window.clearTimeout(timer); pilotRuntime.requestAbort = null; }
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) {
      const mode = data.mode === "timeout" || response.status === 504 ? "timeout" : data.mode === "provider-error" || response.status >= 500 ? "provider-error" : "budget-lock";
      setAiRenderFlowState(mode, friendlyRenderBlockMessage(data.blockReason || data.message || `Worker returned ${response.status}`));
      addHistory("AI concept render blocked safely", `${mode} · free overlay available`);
      return;
    }
    const imageDataUrl = data?.result?.imageDataUrl || null;
    const imageUrl = data?.result?.imageUrl || null;
    if (!imageDataUrl && !imageUrl) throw new Error("The provider returned no usable image.");
    pilotRuntime.liveResult = {
      futureId: request.futureId,
      selectedFuture: request.selectedFuture,
      imageDataUrl,
      imageUrl,
      requestId: data.requestId || data?.result?.providerRequestId || "",
      reservedCostUsd: Number(data.reservedCostUsd || PILOT_MAX_COST_USD),
      estimatedCostUsd: Number(data.estimatedCostUsd || 0.08),
      preparedImage: state.aiRender.preparedImage,
      completedAt: new Date().toISOString()
    };
    setAiRenderFlowState("provider-success", "One provider image returned. It is held only in this browser tab and is not written to VerdeAI server storage.");
    addHistory("One AI concept render completed", `${request.selectedFuture} · owner-approved pilot`);
    scheduleSessionPersist();
  } catch (error) {
    const mode = error?.name === "AbortError" ? "timeout" : "provider-error";
    setAiRenderFlowState(mode, error?.message || "The request failed safely.");
  }
}

function configuredApiBaseUrl() {
  const candidate = String(window.VERDEAI_CONFIG?.apiBaseUrl || "").trim();
  const raw = candidate.endsWith("/") ? candidate.slice(0, -1) : candidate;
  if (!raw || /REPLACE_WITH|YOUR_WORKER/i.test(raw)) return "";
  return raw;
}

function pilotSessionId() {
  try {
    let id = sessionStorage.getItem(PILOT_SESSION_KEY);
    if (!id) { id = crypto.randomUUID ? crypto.randomUUID() : `pilot-${Date.now()}-${Math.random().toString(36).slice(2)}`; sessionStorage.setItem(PILOT_SESSION_KEY, id); }
    return id;
  } catch { return `pilot-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
}

function isLivePilotReady() {
  const h = pilotRuntime.health;
  return Boolean(!pilotRuntime.localSafeLock && h?.ok && h?.version === BUILD_VERSION && h?.realRenderingEnabled && !h?.killSwitchOn && !h?.testModeOn && h?.providerKeyPresent && h?.inviteCodesConfigured && h?.retentionPolicy === "no-store" && h?.approvedProvider === "openai-gpt-image-2" && h?.approvedBackend === "cloudflare-worker" && Number(h?.pilotSpendCapUsd) === 5 && Number(h?.invitedTesterLimit) === 10 && Number(h?.perSessionLimit) === 1 && Number(h?.perIpDailyLimit) === 2 && Number(h?.maxCostPerRenderUsd) === PILOT_MAX_COST_USD && h?.oneImageOnly === true && h?.serverImageStorage === false);
}

async function refreshPilotHealth({ force = false, announceResult = false } = {}) {
  if (pilotRuntime.checkingHealth) return pilotRuntime.health;
  if (!force && pilotRuntime.localSafeLock) {
    pilotRuntime.healthError = "AI calls are stopped on this browser. Press Check live pilot readiness to release only this browser lock.";
    renderAISetup();
    return pilotRuntime.health;
  }
  if (!force && pilotRuntime.healthCheckedAt && Date.now() - pilotRuntime.healthCheckedAt < 30_000) return pilotRuntime.health;
  if (force) {
    pilotRuntime.localSafeLock = false;
    try { sessionStorage.removeItem(PILOT_LOCAL_SAFE_LOCK_KEY); } catch { /* ignore */ }
  }
  const base = configuredApiBaseUrl();
  if (!base) {
    pilotRuntime.health = null; pilotRuntime.healthError = "Worker URL not configured. Insert the deployed Worker URL in config.v9.4.js."; pilotRuntime.healthCheckedAt = Date.now();
    renderAISetup();
    if (announceResult) toast("Worker URL is not configured");
    return null;
  }
  pilotRuntime.checkingHealth = true;
  try {
    const response = await fetch(`${base}/api/health`, { headers: { accept: "application/json" }, cache: "no-store" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.message || `Worker health returned ${response.status}`);
    pilotRuntime.health = data; pilotRuntime.healthError = isHealthShapeReady(data) ? "" : friendlyHealthLockMessage(data); pilotRuntime.healthCheckedAt = Date.now();
    if (announceResult) toast(isLivePilotReady() ? "Live one-render pilot is ready" : "Worker connected but a safety gate remains locked");
  } catch (error) {
    pilotRuntime.health = null; pilotRuntime.healthError = `Worker could not be verified: ${error?.message || "connection failed"}`; pilotRuntime.healthCheckedAt = Date.now();
    if (announceResult) toast("Worker connection could not be verified");
  } finally { pilotRuntime.checkingHealth = false; renderAISetup(); }
  return pilotRuntime.health;
}

function isHealthShapeReady(h = {}) {
  return Boolean(h.realRenderingEnabled && !h.killSwitchOn && !h.testModeOn && h.providerKeyPresent && h.inviteCodesConfigured && h.retentionPolicy === "no-store" && h.approvedProvider === "openai-gpt-image-2" && h.approvedBackend === "cloudflare-worker" && Number(h.pilotSpendCapUsd) === 5 && Number(h.invitedTesterLimit) === 10 && Number(h.perSessionLimit) === 1 && Number(h.perIpDailyLimit) === 2 && Number(h.maxCostPerRenderUsd) === PILOT_MAX_COST_USD && h.oneImageOnly === true && h.serverImageStorage === false);
}

function friendlyHealthLockMessage(h = {}) {
  if (h.killSwitchOn) return "The Worker hard kill switch is on.";
  if (h.testModeOn) return "The Worker is still in test mode.";
  if (!h.realRenderingEnabled) return "Real rendering is disabled on the Worker.";
  if (!h.providerKeyPresent) return "The OpenAI API key secret is missing from the Worker.";
  if (!h.inviteCodesConfigured) return "Invited pilot access-code hashes are missing from the Worker.";
  if (h.retentionPolicy !== "no-store") return "The Worker retention policy is not set to no-store.";
  return "The Worker connected, but one or more approved limits do not match Build v9.4.";
}

function friendlyRenderBlockMessage(reason = "") {
  const messages = {
    "invalid-invite-code": "The invited pilot access code was not accepted.",
    "invite-code-used": "That pilot access code has already reserved its one request.",
    "session-render-limit": "This browser session has already reserved its one pilot render.",
    "ip-daily-render-limit": "This connection has reached the two-render daily limit.",
    "invited-tester-limit": "The 10-tester pilot limit has been reached.",
    "pilot-budget-lock": "The US$5 provider reservation cap would be exceeded.",
    "provider-key-missing": "The server-side OpenAI API key is not configured.",
    "hard-kill-switch-on": "The owner has stopped provider calls using the server kill switch.",
    "test-mode-on": "The Worker remains in test mode.",
    "real-rendering-disabled": "Real rendering is disabled on the Worker.",
    "worker-version-mismatch": "The frontend and Worker build versions do not match."
  };
  return messages[String(reason)] || String(reason || "The request was blocked safely before a usable result was returned.");
}

async function prepareImageForRender() {
  if (!state.photoDataUrl) return null;
  const source = await loadImageElement(state.photoDataUrl);
  const ratio = Math.min(1, PILOT_MAX_LONG_EDGE / Math.max(source.naturalWidth || source.width, source.naturalHeight || source.height));
  const width = Math.max(1, Math.round((source.naturalWidth || source.width) * ratio));
  const height = Math.max(1, Math.round((source.naturalHeight || source.height) * ratio));
  const canvas = document.createElement("canvas");
  canvas.width = width; canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  ctx.drawImage(source, 0, 0, width, height);
  let quality = 0.82;
  let dataUrl = canvas.toDataURL("image/jpeg", quality);
  while (dataUrlBytes(dataUrl) > PILOT_MAX_IMAGE_BYTES && quality > 0.48) {
    quality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", quality);
  }
  const bytes = dataUrlBytes(dataUrl);
  if (bytes > PILOT_MAX_IMAGE_BYTES) throw new Error("Prepared image is still above the 2.5 MB pilot limit. Use a smaller photo.");
  return { dataUrl, bytes, width, height, mimeType: "image/jpeg", metadataStripped: true };
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = () => reject(new Error("The property photo could not be prepared.")); image.src = src; });
}
function dataUrlBytes(dataUrl = "") { const base64 = String(dataUrl).split(",")[1] || ""; return Math.ceil(base64.length * 0.75); }

function setAiRenderFlowState(flowState, message = "") {
  state.aiRender = normaliseRenderSettings({ ...state.aiRender, flowState, flowMessage: message });
  renderAiRenderFlowState();
  renderMockRenderResults();
  renderLiveRenderResults();
}

function renderAiRenderFlowState() {
  const el = $("aiRenderFlowStatus");
  if (!el) return;
  const stateName = state.aiRender?.flowState || "idle";
  const definitions = {
    idle: {
      eyebrow: isLivePilotReady() ? "OWNER-APPROVED PILOT READY" : "FREE OVERLAY READY",
      title: isLivePilotReady() ? "One invited-code render is available" : "Free overlay remains the normal result",
      body: isLivePilotReady() ? "A real uploaded property photo, valid invited access code and four confirmations are required." : (pilotRuntime.healthError || "The optional real path remains server-controlled and safely blocked until every deployment gate is verified."),
      facts: isLivePilotReady() ? ["One image only", "US$0.15 reservation ceiling", "Server kill switch available"] : ["Free overlay available", "No frontend API key", "Unready calls blocked"]
    },
    progress: {
      eyebrow: "ONE REQUEST IN PROGRESS",
      title: "Creating one early concept…",
      body: state.aiRender.flowMessage || "The Worker is validating the invited code, limits, spend reservation and image before contacting the provider.",
      facts: ["One image only", "No automatic retry", "Free overlay remains available"]
    },
    "mock-success": {
      eyebrow: "TEST PREVIEW · US$0.00",
      title: "AI Concept Render · Not Final Design",
      body: state.aiRender.flowMessage || "Preview mode completed without provider contact.",
      facts: ["No provider contacted", "No charge", "Free overlay shown"]
    },
    "provider-success": {
      eyebrow: "OWNER-APPROVED PILOT RESULT",
      title: "AI Concept Render · Not Final Design",
      body: state.aiRender.flowMessage || "One provider image returned and is held only in this browser tab.",
      facts: ["One provider request", "No VerdeAI server image storage", "Not a construction plan"]
    },
    timeout: {
      eyebrow: "SAFE STOP · NO AUTOMATIC RETRY",
      title: "Render stopped after the time limit",
      body: state.aiRender.flowMessage || "VerdeAI ended the request. It does not silently start a second paid request or keep waiting in the background.",
      facts: ["No automatic retry", "Reservation may remain conservative", "Free overlay ready"]
    },
    "provider-error": {
      eyebrow: "SAFE FALLBACK · PROVIDER RESPONSE FAILED",
      title: "Provider could not return a usable image",
      body: state.aiRender.flowMessage || "The provider response was unavailable, invalid or incomplete. VerdeAI does not retry automatically.",
      facts: ["No automatic retry", "No result stored by VerdeAI", "Free overlay ready"]
    },
    "budget-lock": {
      eyebrow: "BLOCKED BY A PILOT GUARD",
      title: "The request did not pass the access, limit or budget gate",
      body: state.aiRender.flowMessage || "The Worker blocked the request before a usable provider result.",
      facts: ["No automatic retry", "Guardrail remains active", "Free overlay ready"]
    }
  };
  const content = definitions[stateName] || definitions.idle;
  const showActions = !["idle", "progress"].includes(stateName);
  el.className = `v92-render-flow-status v922-render-flow-status state-${stateName}`;
  el.innerHTML = `<span class="v922-state-eyebrow">${escapeHtml(content.eyebrow)}</span><b>${escapeHtml(content.title)}</b><p>${escapeHtml(content.body)}</p><div class="v922-state-facts">${content.facts.map((fact) => `<span>${escapeHtml(fact)}</span>`).join("")}</div>${showActions ? '<div class="button-row v922-state-actions"><button type="button" data-return-free-overlay>Use free calibrated overlay</button><button type="button" class="secondary" data-reset-render-state>Back to pilot</button></div>' : ""}`;
  el.querySelector('[data-return-free-overlay]')?.addEventListener("click", () => { activateTab("dashboard"); toast("Free calibrated overlay opened"); });
  el.querySelector('[data-reset-render-state]')?.addEventListener("click", () => setAiRenderFlowState("idle"));
  if (stateName !== "idle") window.requestAnimationFrame(() => el.focus({ preventScroll: true }));
}

function renderMockRenderResults() {
  const container = $("mockRenderResults");
  if (!container) return;
  const render = state.aiRender?.lastMockRenders?.[0];
  if (!render || state.aiRender.flowState !== "mock-success") { container.innerHTML = ""; return; }
  const future = FUTURES.find((item) => item.id === render.futureId) || selectedFuture();
  container.innerHTML = `<article class="mock-render-card v92-ai-result"><div class="mock-preview-header"><span>${escapeHtml(future.icon)}</span><div><b>AI Concept Render · Not Final Design</b><small>Failure-state preview · no provider contacted</small></div></div><div class="mock-render-visual-panel compact">${futureSceneHtml(future)}<div class="mock-render-watermark">FREE OVERLAY FALLBACK</div></div><p class="render-safe-note"><strong>This is not a generated provider image.</strong> It is only a safe UI preview.</p></article>`;
}

function renderLiveRenderResults() {
  const container = $("liveRenderResults");
  if (!container) return;
  const result = pilotRuntime.liveResult;
  if (!result || state.aiRender.flowState !== "provider-success") { container.innerHTML = ""; return; }
  const future = FUTURES.find((item) => item.id === result.futureId) || selectedFuture();
  const src = result.imageDataUrl || result.imageUrl;
  container.innerHTML = `<article class="mock-render-card v92-ai-result v922-live-result"><div class="mock-preview-header"><span>${escapeHtml(future.icon)}</span><div><b>AI Concept Render · Not Final Design</b><small>One owner-approved provider request</small></div></div><figure class="v922-provider-image"><img src="${escapeHtml(src)}" alt="AI concept render for ${escapeHtml(future.title)}" /><figcaption>Inspiration only. Verify access, dimensions, plants, drainage, services and construction requirements independently.</figcaption></figure><div class="mock-result-grid"><div><b>Selected future</b><span>${escapeHtml(future.title)}</span></div><div><b>Reserved ceiling</b><span>US$${Number(result.reservedCostUsd || PILOT_MAX_COST_USD).toFixed(2)}</span></div><div><b>Prepared photo</b><span>${result.preparedImage ? `${result.preparedImage.width}×${result.preparedImage.height} · ${Math.round(result.preparedImage.bytes / 1024)} KB` : "Prepared in browser"}</span></div><div><b>Retention</b><span>No VerdeAI server image storage</span></div></div><div class="button-row"><button type="button" class="secondary" data-discard-live-render>Discard AI image from this tab</button></div></article>`;
  container.querySelector('[data-discard-live-render]')?.addEventListener("click", () => { pilotRuntime.liveResult = null; container.innerHTML = ""; setAiRenderFlowState("idle"); toast("AI image discarded from this tab"); });
}

function renderExport() {
  setText("testerSummary", testerSummaryText());
  const readiness = readinessScore();
  const checklist = readinessChecklist();
  const status = $("handoffStatus");
  if (status) {
    status.innerHTML = `<div class="readiness-meter"><b>${readiness}% beta handoff readiness</b><span>${escapeHtml(readinessLabel(readiness))}</span><div><i style="width:${readiness}%"></i></div></div>`;
  }
  const plan = smartNextPlan();
  const next = $("exportNextStep");
  if (next) next.innerHTML = `<b>Next export action:</b> ${escapeHtml(plan.detail)}`;
  const checks = [
    ...checklist.map((item) => [item.done ? "✅" : "⬜", item.label, item.detail]),
    ["⚠️", "Real AI renders", "Optional; requires verified Worker and invited pilot code."],
    ["⚠️", "Cloud accounts", "Not connected; local browser storage only."]
  ];
  $("alphaReadiness").innerHTML = checks.map(([icon, title, text]) => `<div class="readiness-item"><span>${icon}</span> <b>${escapeHtml(title)}</b><br><small>${escapeHtml(text)}</small></div>`).join("");
}

function testerSummaryText() {
  restoreAnalysisSnapshot();
  const selected = selectedFuture();
  const recommended = recommendedFuture();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  const selectionLine = selected.id !== recommended.id ? `\nTester selected: ${selected.icon} ${selected.title}` : "";
  return `VERDEAI v${state.version} TEST RESULT

Situation: ${profile.label}
Pattern: ${profile.pattern}
Recommended: ${recommended.icon} ${recommended.title}${selectionLine}
Why: ${scenarioDiagnosis(profile)}
First move: ${firstMoveFor(profile, recommended)}
Look for: ${tailoredLabels(selected).slice(0, 3).join(" • ")}

Reply with one: USEFUL / CONFUSING / NOT BELIEVABLE — and one reason.

Concept overlay only; not a final AI render.`;
}

function testerInviteText() {
  const url = currentPublicUrl();
  return `Can you test VerdeAI? It takes about 2 minutes.

${url}

1. Upload one property photo.
2. Tap the closest clue.
3. Read the recommended first move.
4. Reply USEFUL, CONFUSING, or NOT BELIEVABLE — plus one reason.

Build v${state.version} · Photos stay in your browser · Concept boards, not final AI renders.`;
}

function testerChecklistText() {
  return readinessChecklist().map((item) => `${item.done ? "✅" : "⬜"} ${item.label} — ${item.detail}`).join("\n");
}

function copyTesterInvite() {
  copyText(testerInviteText(), "Tester invite copied");
  addHistory("Tester invite copied", `Readiness ${readinessScore()}%`);
  renderAll();
}

function copyTesterChecklist() {
  copyText(testerChecklistText(), "Tester checklist copied");
  addHistory("Tester checklist copied", `Readiness ${readinessScore()}%`);
  renderAll();
}

function readinessChecklist() {
  const hasHandoffAction = (state.history || []).some((item) => /saved|feedback|copied|export|share/i.test(`${item.title} ${item.detail}`));
  return [
    { done: Boolean(state.photoDataUrl || state.demoMode), label: "Upload/demo", detail: state.photoDataUrl || state.demoMode ? `Loaded${photoMetaSummary() ? ` (${photoMetaSummary()})` : ""}.` : "Needs a tester photo or demo run." },
    { done: state.propertyType !== "needs-review" || Boolean(state.starterCue), label: "Starter clue", detail: state.starterCue ? starterLabel(state.starterCue) : "Tap the closest clue so the app avoids a generic first pass." },
    { done: state.constraint !== "unsure", label: "Main problem", detail: state.constraint !== "unsure" ? constraintLabel(state.constraint) : "Choose the visible problem that matters most." },
    { done: Boolean(state.analysisComplete), label: "Overlay read", detail: state.analysisComplete ? `${selectedFuture().title} with ${tailoredLabels(selectedFuture())[0]}.` : "Run analysis, then read one future card." },
    { done: Boolean(hasHandoffAction), label: "Save/share", detail: hasHandoffAction ? "A saved, copied, or exported handoff exists." : "Copy summary, tester invite, share code, or save locally." }
  ];
}

function readinessScore() {
  const checks = readinessChecklist();
  const base = Math.round((checks.filter((item) => item.done).length / checks.length) * 100);
  return clamp(base, state.analysisComplete ? 60 : 15, 100);
}

function readinessLabel(score) {
  if (score >= 90) return "ready for first public feedback";
  if (score >= 70) return "close, needs one handoff action";
  if (score >= 45) return "testable, but still needs a clue/analysis";
  return "setup needed before sharing";
}

function starterLabel(id) {
  return STARTER_PRESETS.find((item) => item.id === id)?.label || "Starter clue selected";
}


function smartNextPlan() {
  const hasPhoto = Boolean(state.photoDataUrl || state.demoMode);
  const hasHandoffAction = (state.history || []).some((item) => /saved|feedback|copied|export|share/i.test(`${item.title} ${item.detail}`));
  if (!hasPhoto) {
    return { action: "photo", label: "Upload one property photo", detail: "Start with one real photo. VerdeAI will use it as the overlay base." };
  }
  if (state.propertyType === "needs-review" && !state.starterCue) {
    return { action: "clue", label: "Tap the closest starter clue", detail: "Pick shade, access, tired, utility, or edge. The clue runs the analysis automatically." };
  }
  if (state.constraint === "unsure") {
    return { action: "problem", label: "Choose the main problem", detail: "Choose the one problem that would make the first weekend move useful." };
  }
  if (!state.analysisComplete) {
    return { action: "analyse", label: "Analyse Property", detail: "Run the first pass so the overlay labels, report, and first move can sync." };
  }
  if (!hasHandoffAction) {
    return { action: "board", label: "Result ready", detail: `${selectedFuture().title} and the first move are ready to review.` };
  }
  return { action: "tester", label: "Ready for first public feedback", detail: "The tester result is ready. Share one screenshot, copy the clean result, and ask for one honest sentence of feedback." };
}

function renderFlowCoach() {
  const plan = smartNextPlan();
  setText("smartNextTitle", plan.label);
  setText("smartNextDetail", plan.detail);
  setText("smartNextBtn", plan.action === "analyse" ? "Analyse now" : plan.action === "board" ? "View result" : plan.action === "export" ? "Go to Export" : plan.action === "tester" ? "Open Tester Mode" : "Show me where");
  const card = $("smartNextCard");
  if (card) card.dataset.state = plan.action;
}

function handleSmartNextAction() {
  const plan = smartNextPlan();
  if (plan.action === "photo") {
    activateTab("explore");
    $("photoInput")?.click();
    toast("Choose one property photo");
    return;
  }
  if (plan.action === "clue") {
    activateTab("explore");
    $("starterSuggestions")?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast("Tap the closest starter clue");
    return;
  }
  if (plan.action === "problem") {
    activateTab("explore");
    $("constraintSelect")?.focus();
    $("constraintSelect")?.scrollIntoView({ behavior: "smooth", block: "center" });
    toast("Choose the main problem");
    return;
  }
  if (plan.action === "analyse") {
    activateTab("explore");
    runAnalysis();
    return;
  }
  if (plan.action === "board") {
    showGeneratedBoard("coach");
    return;
  }
  if (plan.action === "export") {
    activateTab("export");
    $("copyTesterInviteBtn")?.focus();
    toast("Copy an invite or summary");
    return;
  }
  activateTab("testerPage");
}

function activateTab(id, options = {}) {
  const btn = options.trigger || $(`.tab[data-tab="${id}"]`);
  const screen = $(id);
  if (!screen) return;
  $$(".tab").forEach((item) => {
    const active = item === btn;
    item.classList.toggle("active", active);
    item.setAttribute("aria-selected", active ? "true" : "false");
    item.tabIndex = 0;
  });
  $$(".screen").forEach((item) => {
    const active = item === screen;
    item.classList.toggle("active", active);
    item.setAttribute("aria-hidden", active ? "false" : "true");
  });
  screen.classList.add("active");
  screen.setAttribute("aria-hidden", "false");
  renderAll();
  if (options.scroll) window.setTimeout(() => { screen.scrollIntoView({ behavior: "smooth", block: "start" }); screen.focus({ preventScroll: true }); }, 40);
  if (options.feedback) toast(`${tabLabel(id)} opened`);
}

function tabLabel(id) {
  const btn = $(`.tab[data-tab="${id}"]`);
  return btn?.textContent?.trim() || id;
}

function openAiSetup(message = "AI Setup opened", targetId = "ai") {
  const moreTools = $("moreToolsDetails");
  if (moreTools) moreTools.open = false;
  activateTab("ai", { scroll: true });
  window.setTimeout(() => {
    const target = $(targetId) || $("ai");
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast(message);
  }, 80);
}

function copyRenderChecklist() {
  const text = `VerdeAI v9.4 owner-approved pilot checklist

Provider approved: OpenAI GPT Image 2.
Backend approved: Cloudflare Worker Paid.
Estimated maximum: US$0.15 planning ceiling for one request; provider billing must be verified.
Approved pilot budget: US$10 total; US$5 provider reservation cap.
Approved tester limit: 10 invited testers; invited access code required.
Retention: no VerdeAI server storage; disclose provider processing and default API data controls.
API key: server-side secret only.
Kill switch: controlled by deployed Worker.
Test mode: controlled by deployed Worker.
Provider calls: available only when Worker health verifies every gate.
Fallback: free calibrated overlay.
There is no render-all-six option.`;
  copyText(text, "Security checklist copied");
}

function createPropertyFuturesBoard() {
  if (!state.photoDataUrl && !state.demoMode && !state.selfTestMode) {
    activateTab("explore");
    $("photoInput")?.click();
    toast("Upload one photo to create a futures board");
    return;
  }
  if (!state.analysisComplete) {
    runAnalysis({ quiet: true });
  }
  showGeneratedBoard("manual");
}


function scrollBelowStickyTabs(target, behavior = "smooth") {
  if (!target) return;
  const tabs = document.querySelector(".public-tabs");
  const stickyOffset = (tabs?.getBoundingClientRect().height || 72) + 12;
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - stickyOffset);
  window.scrollTo({ top, behavior });
}

function showGeneratedBoard(source = "generated") {
  activateTab("dashboard");
  setProgress(100, "Property board ready", `${selectedFuture().title} is the current best-fit direction.`);
  addHistory(source === "self-test" ? "Self-test board opened" : "Property Futures Board created", selectedFuture().title);
  toast(source === "self-test" ? "Self-test board ready" : "Property board ready");
  window.requestAnimationFrame(() => {
    const target = $("possibilitiesBoard") || $("boardResultTop") || $("dashboardTodayVisual") || $("dashboard");
    if (target) {
      window.setTimeout(() => scrollBelowStickyTabs(target), 90);
      if (target.focus) target.focus({ preventScroll: true });
    }
  });
}

function currentPublicUrl() {
  try { return window.location.href.split("#")[0]; } catch { return "https://christiamhere-svg.github.io/VerdeAI-Alpha/"; }
}


function ensureFutureSelectionPanel() {
  const dashboard = $("dashboard")?.querySelector(".futures-dashboard");
  const panel = $("futureSelectionPanel") || dashboard?.querySelector(".future-selection-panel");
  if (!dashboard || !panel) return panel;
  panel.id = "futureSelectionPanel";
  panel.hidden = false;
  panel.removeAttribute("aria-hidden");
  panel.style.removeProperty("display");
  panel.setAttribute("aria-label", "Six possible futures");
  const grid = panel.querySelector("#dashboardFutureCards");
  if (grid) {
    grid.setAttribute("aria-live", "polite");
    grid.setAttribute("aria-label", "Six selectable landscape futures");
  }
  return panel;
}

function renderDashboard() {
  ensureFutureSelectionPanel();
  document.body.classList.toggle("calibration-active", calibrationUi.open);
  synchroniseAnalysedBoardState("dashboard render");
  restoreAnalysisSnapshot();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const f = selectedFuture();
  const recommended = recommendedFuture();
  const ranked = rankFutures(profile, extractNoteSignals(state.note));
  const readiness = readinessScore();
  const boardReady = synchroniseAnalysedBoardState("dashboard controls");
  document.body.classList.toggle("board-ready", boardReady);
  const dashboardTitle = $("dashboardTitle");
  if (dashboardTitle) dashboardTitle.textContent = "What Could Your Property Become?";
  const dashboardIntro = $("dashboardIntro");
  if (dashboardIntro) dashboardIntro.textContent = boardReady
    ? "One photo becomes six visibly different futures, one recommendation and one practical first move."
    : "Upload one photo to create a complete possibilities board.";
  const createBtn = $("createBoardBtn");
  if (createBtn) createBtn.textContent = boardReady ? "Jump to possibilities board" : "Create possibilities board";
  const boardJumpNote = $("boardJumpNote");
  if (boardJumpNote) boardJumpNote.textContent = boardReady ? "The full story is ready below." : "Upload or run self-test first.";
  const adjustConceptBtn = $("dashboardAdjustConceptBtn");
  if (adjustConceptBtn) {
    adjustConceptBtn.disabled = !boardReady;
    adjustConceptBtn.setAttribute("aria-disabled", String(!boardReady));
    adjustConceptBtn.textContent = boardReady ? "Adjust concept placement" : "Adjust placement after analysis";
  }
  state.visualMode = normaliseVisualMode();
  const boardToday = $("dashboardBoardToday");
  const boardTodaySummary = $("dashboardBoardTodaySummary");
  if (boardToday) {
    const hasPhoto = Boolean(state.photoDataUrl || state.demoMode || state.selfTestMode);
    const photo = state.photoDataUrl
      ? `<img src="${escapeHtml(state.photoDataUrl)}" alt="Your property today before any VerdeAI concept overlay" />`
      : hasPhoto
        ? `<span class="board-today-demo" style="${demoBackgroundStyle()}" role="img" aria-label="Demonstration property today"></span>`
        : `<span class="board-today-empty">Upload one property photo to begin</span>`;
    boardToday.innerHTML = `<div class="board-today-photo">${photo}<span>Your property today</span></div>`;
  }
  if (boardTodaySummary) {
    const label = state.analysisComplete ? profile.label : "Waiting for one photo or self-test";
    const detail = state.analysisComplete ? scenarioDiagnosis(profile) : "The original photograph stays visible as the anchor for every future.";
    boardTodaySummary.innerHTML = `<b>${escapeHtml(label)}</b><p>${escapeHtml(detail)}</p>`;
  }
  const today = $("dashboardTodayVisual");
  const conceptHost = $("dashboardConceptStageHost");
  if (today && conceptHost) {
    today.dataset.visualModule = "botanical-realism-v9.4";
    renderDedicatedConceptHost(conceptHost, state.visualMode);
    today.setAttribute("data-panel-integrity", assertConceptHostIntegrity(conceptHost) ? "clean" : "failed");
    $$('[data-visual-mode]', conceptHost).forEach((button) => button.addEventListener("click", () => {
      state.visualMode = normaliseVisualMode(button.dataset.visualMode);
      addHistory("Property visual changed", visualModeTitle(state.visualMode));
      renderDashboard();
      renderCompare();
      renderTesterPage();
      scheduleSessionPersist();
    }));
    bindCalibrationUi(conceptHost);
  }
  const todaySummary = $("dashboardTodaySummary");
  if (todaySummary) {
    const todayTitle = state.analysisComplete ? profile.label : "Waiting for one photo or self-test";
    const todayPlain = state.analysisComplete
      ? scenarioDiagnosis(profile)
      : smartNextPlan().detail;
    const sourceCheck = photoSourceCheckHtml();
    todaySummary.innerHTML = `<div class="today-readable"><span class="mini-label">What VerdeAI sees</span><b>${escapeHtml(todayTitle)}</b><p>${escapeHtml(todayPlain)}</p></div><div class="calibration-summary"><b>${state.calibration?.customised ? "Placement adjusted for this photo" : "Conservative starting placement"}</b><span>Usable ground, protected areas, access and marker 5 are stored with this project.</span></div><details class="visual-edit-disclosure"><summary>Edit photo or clues</summary><div class="visual-edit-actions"><label class="secondary replace-photo-external" for="photoInput">Replace photo</label><button type="button" class="secondary" data-edit-photo-clues>Open photo and clue settings</button></div>${sourceCheck}<p class="privacy-note compact"><b>Private static beta:</b> your photo and calibration remain in this browser unless you deliberately export or share them.</p></details><details class="visual-detail-disclosure"><summary>Why this concept fits</summary><p>${escapeHtml(boardGenerationSummary(profile))}</p></details>`;
    todaySummary.querySelector("[data-edit-photo-clues]")?.addEventListener("click", () => { activateTab("explore", { scroll: true }); window.setTimeout(() => scrollBelowStickyTabs($("uploadDrop") || $("explore")), 60); });
  }
  const resultSummary = $("dashboardResultSummary");
  if (resultSummary) {
    const firstMove = state.analysisComplete ? firstMoveFor(profile, recommended) : smartNextPlan().detail;
    const summaryTitle = state.analysisComplete ? `${recommended.title} is VerdeAI’s best fit.` : "Create your result.";
    const why = state.analysisComplete
      ? `${scenarioFutureFit(recommended)} ${state.selectedFutureId !== state.recommendedFutureId ? `You are currently exploring ${f.title}.` : ""}`.trim()
      : "Upload a photo, use demo mode, or run the self-test to generate a specific board.";
    resultSummary.innerHTML = `<div class="result-summary-copy"><p class="eyebrow">VerdeAI recommendation</p><h2>${state.analysisComplete ? `${recommended.icon} ${escapeHtml(recommended.title)}` : escapeHtml(summaryTitle)}</h2><p class="result-fit-reason">${escapeHtml(why)}</p><div class="result-top-actions"><button id="resultAdjustConceptBtn" type="button" class="concept-adjust-hotfix" ${boardReady ? "" : "disabled aria-disabled=true"}>${boardReady ? "Adjust concept placement" : "Adjust after analysis"}</button><button id="resultViewFuturesBtn" type="button">Compare futures</button><button id="resultShowPhotoBtn" class="secondary" type="button">Show on photo</button><button id="resultCopyTopBtn" class="secondary" type="button">Copy result</button></div></div><div class="result-summary-answer"><span>First move · marker 5</span><p>${escapeHtml(firstMove)}</p><small>Use the highlighted area on the concept image before committing to a full redesign.</small></div>`;
    resultSummary.querySelector("#resultCopyTopBtn")?.addEventListener("click", () => { copyText(cleanTesterResultText(), "Tester result copied"); addHistory("Top result copied", selectedFuture().title); });
    resultSummary.querySelector("#resultViewFuturesBtn")?.addEventListener("click", () => { scrollBelowStickyTabs($("dashboardFutureCards")); addHistory("Six futures viewed", selectedFuture().title); });
    resultSummary.querySelector("#resultShowPhotoBtn")?.addEventListener("click", () => { state.visualMode = "recommended"; renderDashboard(); scrollToMainVisual(); });
    resultSummary.querySelector("#resultAdjustConceptBtn")?.addEventListener("click", () => openConceptCalibration("Recommendation control"));
  }

  const futurePanel = ensureFutureSelectionPanel();
  const futureStatus = $("futureSelectionStatus");
  if (futureStatus) futureStatus.innerHTML = `<b>Currently selected:</b> ${f.icon} ${escapeHtml(f.title)}${f.id === recommended.id ? " · VerdeAI recommendation" : ""}`;
  const futureGrid = $("dashboardFutureCards");
  if (futureGrid) {
    futureGrid.innerHTML = ranked.map((future, index) => dashboardFutureCardHtml(future, index)).join("");
    $$('[data-dashboard-future]', futureGrid).forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("[data-view-future]")) return;
        state.selectedFutureId = card.dataset.dashboardFuture;
        state.visualMode = "selected";
        addHistory("Dashboard future selected", selectedFuture().title);
        toast(`${selectedFuture().title} selected`);
        renderAll();
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          card.click();
        }
      });
      card.querySelector("[data-view-future]")?.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        state.selectedFutureId = card.dataset.dashboardFuture;
        state.visualMode = "selected";
        addHistory("Future viewed on property photo", selectedFuture().title);
        renderAll();
        window.setTimeout(scrollToMainVisual, 40);
      });
    });
    $("returnToVisualBtn")?.addEventListener("click", () => { state.visualMode = state.selectedFutureId === state.recommendedFutureId ? "recommended" : "selected"; renderDashboard(); scrollToMainVisual(); });
  }
  const reco = $("dashboardRecommendation");
  if (reco) {
    const recommendedScore = ranked.find((x) => x.id === recommended.id)?.score || 74;
    const recoWhy = state.analysisComplete ? recommendationWhy(recommended, profile) : "Upload a photo, use demo mode, or run the self-test to generate this board.";
    const selectionNote = state.analysisComplete && f.id !== recommended.id ? `<div class="selection-note"><b>Your selected future</b><span>${f.icon} ${escapeHtml(f.title)} remains selected for overlays, reports, and refinements.</span></div>` : "";
    reco.innerHTML = `<div class="reco-kicker">VerdeAI recommendation</div><h2>${recommended.icon} ${escapeHtml(recommended.title)}</h2><b class="recommendation-why-label">Why this for you?</b><p>${escapeHtml(recoWhy)}</p><div class="recommendation-proof"><span>${escapeHtml(profile.pattern)}</span><span>${escapeHtml(constraintLabel(state.constraint))}</span><span>${escapeHtml(preferenceLabel(state.preference))}</span></div>${selectionNote}<div class="recommendation-action"><b>Best first move</b><span>${escapeHtml(state.analysisComplete ? firstMoveFor(profile, recommended) : smartNextPlan().detail)}</span></div><div class="confidence-chip">${recommendedScore}% match • ${state.analysisComplete ? "property-specific from current clues" : "starter preview"}</div>`;
  }
  const compass = $("dashboardCompass");
  if (compass) {
    const dna = state.analysisComplete ? state.dna : buildDna(profile, [], { label: "" });
    const keys = ["identity", "flow", "habitat", "utility", "maintenance", "potential"];
    const labels = { identity: "Belonging", flow: "Flow", habitat: "Nature", utility: "Function", maintenance: "Ease", potential: "Possibility" };
    compass.innerHTML = keys.map((key) => {
      const value = Math.max(0, Math.min(100, Number(dna[key] || 50)));
      return `<div class="board-compass-row"><b>${escapeHtml(labels[key] || titleCase(key))}</b><span class="board-compass-meter" aria-label="${escapeHtml(labels[key] || key)} ${value} percent"><i style="--score:${value}%"></i></span><small>${value}%</small></div>`;
    }).join("");
  }
  const oracle = $("dashboardOracle");
  if (oracle) oracle.textContent = state.analysisComplete ? oracleReading(recommended, profile) : "A clearer role usually matters more than adding more stuff.";
  const next = $("dashboardNextStep");
  if (next) {
    const nextTask = state.analysisComplete ? roadmapData()[0].task : smartNextPlan().detail;
    const steps = [
      "Review all six futures",
      `Choose ${f.title} or return to ${recommended.title}`,
      `Test marker 5: ${nextTask}`,
      "Watch the five-year direction before buying"
    ];
    next.innerHTML = `<ol class="board-next-list">${steps.map((item, index) => `<li><span>${index + 1}</span>${escapeHtml(item)}</li>`).join("")}</ol><div class="next-step-focus"><span>Best first move · marker 5</span><p>${escapeHtml(nextTask)}</p><small>Keep it reversible. Test with hose, chalk, rope, pots, or stakes before buying.</small></div><button class="secondary" type="button" data-dashboard-action="overlay">Show marker 5 full size</button>`;
    next.querySelector('[data-dashboard-action="overlay"]')?.addEventListener("click", () => { state.visualMode = "recommended"; renderDashboard(); scrollToMainVisual(); });
  }
  const evolution = $("dashboardEvolution");
  if (evolution) {
    const steps = propertyMovieSteps();
    const photoLayer = state.photoDataUrl
      ? `<img class="evolution-photo" src="${escapeHtml(state.photoDataUrl)}" alt="" />`
      : `<span class="evolution-photo evolution-demo" style="${demoBackgroundStyle()}" aria-hidden="true"></span>`;
    evolution.innerHTML = steps.map((step, index) => {
      const progress = index === 0 ? 0 : Math.min(1, .25 + index * .18);
      const concept = index === 0 ? "" : `<span class="evolution-concept" style="--evolution-progress:${progress}">${overlayHtml(f, { showTrust: false, mode: "selected" })}</span>`;
      return `<article class="evolution-step"><div class="evolution-visual">${photoLayer}${concept}<span class="evolution-year-chip">${escapeHtml(step.when)}</span></div><p>${escapeHtml(step.text)}</p></article>`;
    }).join("");
  }
  $("boardOpenConceptBtn")?.addEventListener("click", () => { state.visualMode = state.selectedFutureId === state.recommendedFutureId ? "recommended" : "selected"; renderDashboard(); scrollToMainVisual(); });
}

function dashboardFutureCardHtml(future, index) {
  const isSelected = future.id === state.selectedFutureId;
  const isRecommended = future.id === state.recommendedFutureId;
  const score = future.score || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note)).find((x) => x.id === future.id)?.score || 72;
  const status = isRecommended && isSelected
    ? `<span class="future-ribbon future-ribbon-inline combined-status-pill">Recommended · Selected</span>`
    : `${isRecommended ? `<span class="future-ribbon future-ribbon-inline">Recommended</span>` : ""}${isSelected ? `<span class="selected-status-pill">Selected</span>` : ""}`;
  const tag = dashboardFutureTag(future);
  const intent = futureSceneIntent(future);
  const adaptive = futureAdaptiveTags(future);
  const quickTags = [...new Set([adaptive[0], tag].filter(Boolean))].slice(0, 2);
  const photo = state.photoDataUrl
    ? `<img class="future-property-photo" src="${escapeHtml(state.photoDataUrl)}" alt="Property photograph with ${escapeHtml(future.title)} planting concept" />`
    : `<span class="future-property-photo demo-photo" style="${demoBackgroundStyle()}" aria-hidden="true"></span>`;
  return `<article class="dashboard-future-card future-photo-option future-${future.id} ${isSelected ? "active" : ""}" data-dashboard-future="${future.id}" style="--future-color:${future.color}; --overlay-tint:${future.tint}" role="button" tabindex="0" aria-pressed="${isSelected}" aria-label="Select ${escapeHtml(future.title)} future">
    <div class="future-card-status-row"><span class="concept-status-pill">Concept</span><span class="future-card-status-group">${status}</span></div>
    <div class="dashboard-future-visual future-photo-preview" aria-label="${escapeHtml(future.title)} on this property photo">${photo}${overlayHtml(future, { showTrust: false, mode: "selected" })}<span class="concept-preview-note">On your photo</span></div>
    <div class="dashboard-future-copy">
      <div class="future-title-row"><div><div class="future-number">${index + 1} · ${isRecommended ? "Recommended" : "Possibility"}</div><h3>${future.icon} ${escapeHtml(future.title)}</h3></div><strong aria-label="${score} percent match">${score}%</strong></div>
      <p class="future-card-summary">${escapeHtml(future.subtitle)}</p>
      <div class="future-intent-line"><b>What changes</b><span>${escapeHtml(intent)}</span></div>
      <div class="future-quick-tags">${quickTags.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      <button type="button" class="secondary view-future-photo" data-view-future="${future.id}">View this future on my photo</button>
    </div>
  </article>`;
}
function boardGenerationSummary(profile) {
  if (!state.analysisComplete) return "The board is waiting for one photo, demo, or self-test analysis before it becomes specific.";
  const clues = [profile.pattern, constraintLabel(state.constraint), recommendedFuture().title].filter(Boolean);
  return `Built from ${clues.join(" + ")}. Concept boards stay honest until real AI rendering is connected.`;
}

function futureAdaptiveTags(future) {
  const tags = [];
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  if (state.propertyType === "under-building" || state.constraint === "shade-dark") tags.push(future.id === "minimal" ? "best shade response" : "adapt to low light");
  if (state.constraint === "access-awkward") tags.push(future.id === "maker" ? "protect work route" : "keep access clear");
  if (state.constraint === "messy-edge") tags.push("clean edge first");
  if (state.preference === "low-maintenance") tags.push(future.id === "minimal" ? "lowest upkeep" : "keep it simple");
  if (state.preference === "food" && future.id === "productive") tags.push("best useful option");
  if (state.preference === "maker" && future.id === "maker") tags.push("matches practical use");
  if (!tags.length) tags.push(future.tags?.[0] || "property fit", dashboardFutureTag(future));
  return [...new Set(tags)].slice(0, 3);
}

function dashboardFutureTag(future) {
  const base = {
    belonging: "arrival + welcome",
    minimal: "calm shade retreat",
    gathering: "outdoor room",
    productive: "useful edible edge",
    maker: "work + storage flow",
    wildlife: "signature habitat"
  };
  if (state.propertyType === "under-building" && future.id === "minimal") return "best shade fit";
  if (state.constraint === "access-awkward" && future.id === "maker") return "strong access logic";
  if (state.preference === "low-maintenance" && future.id === "minimal") return "lowest upkeep";
  return base[future.id] || future.tags[0] || "future option";
}

function futureSceneIntent(future) {
  return scenarioFutureFit(future);
}

function futureSceneBullets(future) {
  return tailoredLabels(future).slice(0, 3);
}

function futureSceneHtml(future) {
  const label = tailoredLabels(future)[0];
  const safeLabel = escapeHtml(label);
  const photoTreatment = `<span class="photo-concept-layer" aria-hidden="true"><i class="photo-mass mass-one"></i><i class="photo-mass mass-two"></i><i class="photo-route-line"></i><i class="photo-focus-dot"></i></span>`;
  const photoLayer = state.photoDataUrl
    ? `<span class="mood-photo" style="background-image:url('${state.photoDataUrl}')">${photoTreatment}</span>`
    : `<span class="mood-photo mood-photo-empty"><b>property photo</b><small>visual anchor</small>${photoTreatment}</span>`;
  const sets = {
    belonging: {
      intent: "warm arrival",
      materials: ["warm gravel", "soft edge", "path light"],
      swatches: ["leaf", "cream", "gold"],
      icons: ["entry", "light", "seat"],
      marks: `<span class="mood-route route-entry"></span><span class="mood-zone zone-front"></span><span class="mood-pin pin-entry">arrival</span><span class="mood-pin pin-light">lighting</span>`
    },
    minimal: {
      intent: "quiet retreat",
      materials: ["mulch", "fern texture", "shade edge"],
      swatches: ["sage", "deep", "bark"],
      icons: ["shade", "texture", "rest"],
      marks: `<span class="mood-route route-soft"></span><span class="mood-zone zone-shade"></span><span class="mood-pin pin-plant">low light</span><span class="mood-pin pin-calm">calm pocket</span>`
    },
    gathering: {
      intent: "outdoor room",
      materials: ["seating", "warm lights", "fire bowl"],
      swatches: ["ember", "charcoal", "linen"],
      icons: ["seat", "fire", "lights"],
      marks: `<span class="mood-route route-room"></span><span class="mood-zone zone-patio"></span><span class="mood-pin pin-seat">seating</span><span class="mood-pin pin-fire">warmth</span>`
    },
    productive: {
      intent: "useful harvest",
      materials: ["raised bed", "herbs", "service path"],
      swatches: ["herb", "soil", "straw"],
      icons: ["herbs", "bed", "water"],
      marks: `<span class="mood-route route-service"></span><span class="mood-zone zone-bed"></span><span class="mood-pin pin-herb">herbs</span><span class="mood-pin pin-bed">edible bed</span>`
    },
    maker: {
      intent: "practical maker zone",
      materials: ["work pad", "storage", "clear access"],
      swatches: ["steel", "timber", "gravel"],
      icons: ["bench", "storage", "access"],
      marks: `<span class="mood-route route-maker"></span><span class="mood-zone zone-work"></span><span class="mood-pin pin-store">storage</span><span class="mood-pin pin-work">work zone</span>`
    },
    wildlife: {
      intent: "signature habitat",
      materials: ["water bowl", "pollinator strip", "feature"],
      swatches: ["meadow", "water", "stone"],
      icons: ["butterfly", "water", "feature"],
      marks: `<span class="mood-route route-feature"></span><span class="mood-zone zone-water"></span><span class="mood-pin pin-habitat">habitat</span><span class="mood-pin pin-star">feature</span>`
    }
  };
  const data = sets[future.id] || sets.belonging;
  const swatches = data.swatches.map((swatch) => `<span class="mood-swatch swatch-${swatch}"></span>`).join("");
  const materials = data.materials.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  const icons = data.icons.map((item) => `<span class="mood-icon icon-${item}"></span>`).join("");
  return `<div class="mood-board mood-${future.id} mood-board-v37 mood-board-v38">
    ${photoLayer}
    <span class="mood-board-label">concept board · not AI render</span>
    <div class="mood-plan" aria-hidden="true">${data.marks}</div>
    <div class="mood-palette" aria-label="Plant and material palette">${swatches}</div>
    <div class="mood-icons" aria-hidden="true">${icons}</div>
    <div class="mood-materials">${materials}</div>
    <div class="mood-intent"><b>${escapeHtml(data.intent)}</b><span>${safeLabel}</span></div>
  </div>`;
}

function propertyMovieSteps() {
  const f = selectedFuture();
  const first = roadmapData()[0].task;
  return [
    { when: "Today", text: state.analysisComplete ? `${TYPE_PROFILES[state.propertyType]?.pattern || "Current state"}: choose the strongest direction.` : "Upload a photo or run the shaded self-test." },
    { when: "Weekend test", text: first },
    { when: "3 months", text: `Repeat the best small move into a clearer ${f.title.toLowerCase()} structure.` },
    { when: "1 year", text: "Commit to the edges, access route, planting palette, and one focal point." },
    { when: "5 years", text: `A mature ${f.title.toLowerCase()} that feels intentional instead of accidental.` }
  ];
}

function cleanTesterResultText() {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const selected = selectedFuture();
  const recommended = recommendedFuture();
  const selectionLine = selected.id !== recommended.id ? `\nExploring instead: ${selected.icon} ${selected.title}` : "";
  return `VERDEAI v${state.version} — ${profile.label}

Best fit: ${recommended.icon} ${recommended.title}${selectionLine}
Why: ${scenarioFutureFit(recommended)}
First move: ${firstMoveFor(profile, recommended)}
Overlay: ${tailoredLabels(selected).slice(0, 3).join(" • ")}

Would you try that first move?
Reply: USEFUL / CONFUSING / NOT BELIEVABLE + one reason.

Concept board only — not a final AI render.`;
}
function renderTesterHealth() {
  const plan = smartNextPlan();
  const items = [["➡️", `Next: ${plan.label}. ${plan.detail}`], ...readinessChecklist().map((item) => [item.done ? "✅" : "⬜", `${item.label}: ${item.detail}`])];
  items.push(["⚠️", "Real AI rendering is optional and Worker-controlled"]);
  $("testerHealth").innerHTML = items.map(([icon, text]) => `<div class="health-item">${icon} ${escapeHtml(text)}</div>`).join("");
}

function renderHistory() {
  const history = state.history.slice(-12).reverse();
  $("historyList").innerHTML = history.length ? history.map((item) => `<li><b>${escapeHtml(item.title)}</b> — ${escapeHtml(item.detail)} <small>${new Date(item.at).toLocaleString()}</small></li>`).join("") : "<li>No actions recorded yet.</li>";
  setText("climateProfile", state.climate?.label ? `${state.climate.label}. ${state.climate.notes.join(" ")}` : "Add a postcode and run analysis to generate a basic climate clue.");
  const seasons = maintenanceCalendar();
  $("maintenanceCalendar").innerHTML = seasons.map(([season, task]) => `<article class="calendar-card"><b>${escapeHtml(season)}</b><p>${escapeHtml(task)}</p></article>`).join("");
}

function maintenanceCalendar() {
  const f = selectedFuture();
  if (f.id === "minimal") return [["Summer", "Water new plants deeply and keep mulch topped."], ["Autumn", "Plant tough structure and fix edges."], ["Winter", "Build paths, edging, and drainage fixes."], ["Spring", "Weed early and repeat the simple palette."]];
  if (f.id === "wildlife") return [["Summer", "Maintain water and shelter points."], ["Autumn", "Plant habitat shrubs and flowering layers."], ["Winter", "Place logs, rocks, and nesting shelter."], ["Spring", "Add pollinator plants and avoid over-tidying."]];
  return [["Summer", "Protect new work from heat and dry periods."], ["Autumn", "Plant and test layout changes."], ["Winter", "Do structure, paths, drainage, and hard work."], ["Spring", "Refresh mulch, prune lightly, and review the next experiment."]];
}

function renderVisionBoard() {
  restoreAnalysisSnapshot();
  const f = selectedFuture();
  const cards = state.analysisComplete ? [
    [f.title, f.subtitle],
    ["Overlay labels", tailoredLabels(f).join(" • ")],
    ["Prompt direction", state.designRefinements.length ? state.designRefinements.map(labelForRefinement).join(", ") : "Balanced, practical, staged"],
    ["First experiment", roadmapData()[0].task],
    ["Tester handoff", "Screenshot one overlay card, then copy the tester summary from Export."]
  ] : [
    ["No analysis yet", "Upload a photo, tap one starter clue, and VerdeAI will build this board."],
    ["What appears here", "Selected future, overlay labels, prompt direction, and first experiment."]
  ];
  $("visionBoard").innerHTML = cards.map(([title, text]) => `<article class="vision-card"><b>${escapeHtml(title)}</b><small>${escapeHtml(text)}</small></article>`).join("");
}

function renderSavedProjects() {
  const items = getSavedProjects();
  const container = $("savedProjects");
  if (!container) return;
  const hasAutoSession = Boolean(state.photoDataUrl || state.demoMode || state.analysisComplete || state.starterCue);
  const autoCard = hasAutoSession ? `<article class="saved-card autosave-card"><b>Current session autosaved</b><small>Recovered automatically when this page reopens on the same browser/domain.</small><p>${escapeHtml(state.analysisComplete ? `${TYPE_PROFILES[state.propertyType]?.pattern || "Analysis"} → ${selectedFuture().title}. ${roadmapData()[0].task}` : smartNextPlan().detail)}</p><div class="button-row"><button type="button" class="secondary" data-save-current="true">Save Project Card</button></div></article>` : "";
  if (!items.length) {
    container.innerHTML = `${autoCard}<p>${hasAutoSession ? "No manual project cards yet. The current session is already auto-saved; tap Save Project Card to keep a named copy." : "No saved projects yet. Run one analysis, then tap Save Project to keep it in this browser."}</p>`;
  } else {
    container.innerHTML = `${autoCard}${items.map((item, index) => `<article class="saved-card"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(new Date(item.savedAt).toLocaleString())}</small><p>${escapeHtml(item.summary)}</p><div class="button-row"><button type="button" class="secondary" data-load="${index}">Load</button><button type="button" class="secondary" data-delete="${index}">Delete</button></div></article>`).join("")}`;
  }
  $$('[data-save-current]', container).forEach((btn) => btn.addEventListener("click", saveProject));
  $$('[data-load]', container).forEach((btn) => btn.addEventListener("click", () => loadSavedProject(Number(btn.dataset.load))));
  $$('[data-delete]', container).forEach((btn) => btn.addEventListener("click", () => deleteSavedProject(Number(btn.dataset.delete))));
}

function saveProject() {
  syncStateFromForm();
  if (!state.analysisComplete) runAnalysis({ quiet: true });
  const f = selectedFuture();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  const items = getSavedProjects();
  items.unshift({
    title: `${profile.pattern} → ${f.title}`,
    summary: `${profile.label}. ${roadmapData()[0].task}`,
    savedAt: new Date().toISOString(),
    state: serialiseState()
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 20)));
  addHistory("Project saved", `${profile.pattern} → ${f.title}`);
  toast("Project saved locally");
  persistCurrentSessionNow();
  renderSavedProjects();
}

function serialiseState() {
  const clone = { ...state, photoDataUrl: state.photoDataUrl && state.photoDataUrl.length > 900000 ? "" : state.photoDataUrl };
  return clone;
}

function getSavedProjects() {
  return readStoredArray(STORAGE_KEY, LEGACY_STORAGE_KEYS);
}

function loadSavedProject(index) {
  const item = getSavedProjects()[index];
  if (!item) return;
  Object.assign(state, item.state || {});
  state.constraint = state.constraint || "unsure";
  state.propertyType = state.propertyType || "needs-review";
  state.starterCue = state.starterCue || "";
  state.recommendedFutureId = state.recommendedFutureId || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note || ""))[0]?.id || "belonging";
  state.visualMode = normaliseVisualMode(state.visualMode);
  state.photoMeta = state.photoMeta || {};
  state.aiRender = normaliseRenderSettings(state.aiRender);
  state.version = BUILD_VERSION;
  synchroniseAnalysedBoardState("manual project load");
  if (state.analysisComplete && !state.analysisSnapshot) captureAnalysisSnapshot();
  setFormFromState();
  if (state.photoDataUrl) {
    $("photoPreview").src = state.photoDataUrl;
    $("uploadDrop")?.classList.add("has-image");
  } else {
    $("uploadDrop")?.classList.remove("has-image");
  }
  toast("Project loaded");
  persistCurrentSessionNow();
  renderAll();
}

function deleteSavedProject(index) {
  const items = getSavedProjects();
  items.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  toast("Saved project deleted");
  persistCurrentSessionNow();
  renderSavedProjects();
}

function clearSavedProjects() {
  [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].forEach((key) => localStorage.removeItem(key));
  toast("Saved projects cleared");
  persistCurrentSessionNow();
  renderSavedProjects();
}

const FEEDBACK_EVIDENCE_LABELS = {
  tester: "Tester response",
  internal: "Owner / internal check",
  unclassified: "Unclassified legacy"
};
const FEEDBACK_ISSUE_LABELS = {
  specificity: "Result felt generic",
  overlay: "Photo or overlay",
  recommendation: "Recommended vs selected",
  futures: "Six futures",
  "first-move": "First move",
  navigation: "Navigation or mobile layout",
  "save-share": "Save, copy, or export",
  other: "Other"
};
function feedbackEvidenceLabel(value) { return FEEDBACK_EVIDENCE_LABELS[value] || FEEDBACK_EVIDENCE_LABELS.unclassified; }
function feedbackIssueLabel(value) { return FEEDBACK_ISSUE_LABELS[value] || "Not specified"; }
function inferredFeedbackEvidenceKind() {
  return state.selfTestMode || state.demoMode || !state.photoDataUrl ? "internal" : "tester";
}
function feedbackEvidenceContextKey() {
  return [state.lastRunAt || "unrun", feedbackSourceLabel()].join("|");
}
function syncFeedbackEvidenceControls() {
  const boardKey = feedbackEvidenceContextKey();
  if (boardKey !== feedbackEvidenceBoardKey) {
    feedbackEvidenceBoardKey = boardKey;
    feedbackEvidenceOverride = "";
    feedbackIssueStageOverride = "";
  }
  const evidenceKind = feedbackEvidenceOverride || inferredFeedbackEvidenceKind();
  $$('[data-feedback-evidence-kind]').forEach((control) => { control.value = evidenceKind; });
  $$('[data-feedback-issue-stage]').forEach((control) => { control.value = feedbackIssueStageOverride; });
}
function normaliseEvidenceKindKey(value, item = {}) {
  const clean = String(value || "").trim().toLowerCase();
  if (clean.includes("tester")) return "tester";
  if (clean.includes("internal") || clean.includes("owner")) return "internal";
  if (clean.includes("unclassified")) return "unclassified";
  const source = String(item.source || "").toLowerCase();
  if (source.includes("self-test") || source.includes("demo") || source.includes("owner") || source.includes("internal")) return "internal";
  return "unclassified";
}
function normaliseIssueStageKey(value) {
  const clean = String(value || "").trim().toLowerCase();
  if (FEEDBACK_ISSUE_LABELS[clean]) return clean;
  const match = Object.entries(FEEDBACK_ISSUE_LABELS).find(([, label]) => label.toLowerCase() === clean);
  return match?.[0] || "";
}
function testerEvidenceItems(items = getFeedback()) { return items.filter((item) => item.evidenceKindKey === "tester"); }

function feedbackReactionLabel(value) {
  return ({ useful: "Useful", confusing: "Confusing", "not-believable": "Not believable", detailed: "Detailed feedback" })[value] || String(value || "Detailed feedback");
}
function feedbackReactionFromScore(score = "") {
  const number = Number.parseInt(String(score), 10);
  if (number >= 4) return "useful";
  if (number === 3) return "confusing";
  if (number > 0) return "not-believable";
  return "detailed";
}
function feedbackSourceLabel() {
  if (state.selfTestMode) return "Shaded self-test";
  if (state.demoMode) return "Demo mode";
  if (state.photoDataUrl) return "Uploaded photo";
  return "Clue-guided test";
}
function feedbackContextId() {
  return [state.lastRunAt || "unrun", state.propertyType, state.recommendedFutureId, state.selectedFutureId, feedbackSourceLabel()].join("|");
}
function normaliseFeedbackItem(item = {}, index = 0) {
  const reactionKey = item.reactionKey || ({ "Useful": "useful", "Confusing": "confusing", "Not believable": "not-believable", "Not believable yet": "not-believable" })[item.reaction] || String(item.reaction || "").toLowerCase().replace(/\s+/g, "-") || feedbackReactionFromScore(item.score);
  const timestamp = item.timestamp || item.at || new Date(0).toISOString();
  const evidenceKindKey = normaliseEvidenceKindKey(item.evidenceKindKey || item.evidenceKind || item.evidenceType, item);
  const issueStageKey = normaliseIssueStageKey(item.issueStageKey || item.issueStage || item.issueArea);
  return {
    id: item.id || `legacy-${timestamp}-${index}`, timestamp,
    buildVersion: item.buildVersion || item.build || "Legacy build",
    propertySituation: item.propertySituation || item.propertyType || "Not recorded",
    propertyPattern: item.propertyPattern || item.pattern || "Not recorded",
    recommendedFuture: item.recommendedFuture || item.future || "Not recorded",
    selectedFuture: item.selectedFuture || item.future || "Not recorded",
    reactionKey, reaction: feedbackReactionLabel(reactionKey), score: item.score || "",
    optionalNote: item.optionalNote ?? item.notes ?? "", preference: item.preference || "",
    mainProblem: item.mainProblem || item.constraint || "", starterClue: item.starterClue || "",
    source: item.source || "Earlier local beta",
    evidenceOrigin: item.evidenceOrigin || (item.source === "Imported CSV" ? "Imported CSV" : "Local browser"),
    evidenceKindKey, evidenceKind: feedbackEvidenceLabel(evidenceKindKey),
    issueStageKey, issueStage: feedbackIssueLabel(issueStageKey),
    contextId: item.contextId || ""
  };
}
function saveQuickFeedback(reaction) {
  const scoreMap = { useful: "5 - Very useful", confusing: "3 - Somewhat useful", "not-believable": "1 - Not useful" };
  if (!scoreMap[reaction]) return;
  if ($("feedbackScore")) $("feedbackScore").value = scoreMap[reaction];
  saveFeedback(reaction);
}
function saveFeedback(reaction = "") {
  if (!state.analysisComplete) runAnalysis({ quiet: true });
  const score = $("feedbackScore")?.value || "";
  const reactionKey = reaction || feedbackReactionFromScore(score);
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const selected = selectedFuture(); const recommended = recommendedFuture();
  const timestamp = new Date().toISOString();
  const evidenceKindKey = feedbackEvidenceOverride || inferredFeedbackEvidenceKind();
  const issueStageKey = feedbackIssueStageOverride || "";
  const record = {
    id: globalThis.crypto?.randomUUID?.() || `feedback-${Date.now()}`, timestamp,
    buildVersion: `v${state.version}`, propertySituation: profile.label, propertyPattern: profile.pattern,
    recommendedFuture: recommended.title, selectedFuture: selected.title,
    reactionKey, reaction: feedbackReactionLabel(reactionKey), score,
    optionalNote: ($("feedbackNotes")?.value || "").trim(), preference: preferenceLabel(state.preference),
    mainProblem: constraintLabel(state.constraint), starterClue: state.starterCue ? starterLabel(state.starterCue) : "Not recorded",
    source: feedbackSourceLabel(), evidenceOrigin: "Local browser",
    evidenceKindKey, evidenceKind: feedbackEvidenceLabel(evidenceKindKey),
    issueStageKey, issueStage: feedbackIssueLabel(issueStageKey),
    contextId: `${feedbackContextId()}|${evidenceKindKey}`
  };
  const items = getFeedback();
  const duplicateIndex = items.findIndex((item) => item.contextId && item.contextId === record.contextId && Math.abs(Date.parse(timestamp) - Date.parse(item.timestamp)) < 300000);
  const updated = duplicateIndex >= 0;
  if (updated) {
    record.id = items[duplicateIndex].id;
    items.splice(duplicateIndex, 1);
  }
  items.unshift(record);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(items.slice(0, 500)));
  addHistory(updated ? "Feedback updated" : "Feedback saved", `${feedbackReactionLabel(reactionKey)} · ${selected.title} · ${feedbackEvidenceLabel(evidenceKindKey)}`);
  setFeedbackReactionState(reactionKey);
  $$(".feedback-saved-status").forEach((el) => { el.textContent = `${feedbackReactionLabel(reactionKey)} ${updated ? "updated" : "saved"} as ${feedbackEvidenceLabel(evidenceKindKey).toLowerCase()}.`; });
  toast(updated ? "Feedback updated locally" : "Feedback saved locally"); renderFeedbackReview(); renderHistory();
}
function setFeedbackReactionState(reactionKey = "") {
  $$('[data-feedback-reaction]').forEach((button) => button.setAttribute("aria-pressed", button.dataset.feedbackReaction === reactionKey ? "true" : "false"));
}
function getFeedback() {
  return readStoredArray(FEEDBACK_KEY, LEGACY_FEEDBACK_KEYS).map(normaliseFeedbackItem).sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
function feedbackCounts(items = getFeedback()) {
  return items.reduce((c,item) => {
    c.total++;
    if(item.reactionKey==="useful") c.useful++; else if(item.reactionKey==="confusing") c.confusing++; else if(item.reactionKey==="not-believable") c.notBelievable++; else c.detailed++;
    if(item.evidenceKindKey==="tester") c.tester++; else if(item.evidenceKindKey==="internal") c.internal++; else c.unclassified++;
    return c;
  }, {total:0,useful:0,confusing:0,notBelievable:0,detailed:0,tester:0,internal:0,unclassified:0});
}
function feedbackDisagreementStats(items = getFeedback()) {
  const comparable = items.filter((item) => item.recommendedFuture && item.selectedFuture && ![item.recommendedFuture, item.selectedFuture].includes("Not recorded"));
  const different = comparable.filter((item) => item.recommendedFuture !== item.selectedFuture).length;
  return { comparable: comparable.length, different, same: comparable.length - different, percent: comparable.length ? Math.round((different / comparable.length) * 100) : 0 };
}
function groupFeedback(items, key) {
  const counts = new Map();
  items.forEach((item) => {
    const value = String(item[key] || "Not recorded").trim() || "Not recorded";
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  return Array.from(counts, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
function populateFeedbackFilter(id, values, allLabel, selected) {
  const select = $(id); if (!select) return "all";
  const cleanValues = unique(values.filter(Boolean)).sort((a, b) => String(a).localeCompare(String(b)));
  const valid = selected === "all" || cleanValues.includes(selected) ? selected : "all";
  select.innerHTML = `<option value="all">${escapeHtml(allLabel)}</option>${cleanValues.map((value) => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("")}`;
  select.value = valid;
  return valid;
}
function syncFeedbackFilterOptions(items) {
  feedbackReviewFilters.reaction = populateFeedbackFilter("feedbackReactionFilter", unique(items.map((item) => item.reaction)), "All reactions", feedbackReviewFilters.reaction);
  feedbackReviewFilters.situation = populateFeedbackFilter("feedbackSituationFilter", unique(items.map((item) => item.propertySituation)), "All situations", feedbackReviewFilters.situation);
  feedbackReviewFilters.build = populateFeedbackFilter("feedbackBuildFilter", unique(items.map((item) => item.buildVersion)), "All builds", feedbackReviewFilters.build);
  feedbackReviewFilters.evidence = populateFeedbackFilter("feedbackEvidenceFilter", unique(items.map((item) => item.evidenceKind)), "All evidence", feedbackReviewFilters.evidence);
}
function filteredFeedback(items = getFeedback()) {
  return items.filter((item) => {
    if (feedbackReviewFilters.reaction !== "all" && item.reaction !== feedbackReviewFilters.reaction) return false;
    if (feedbackReviewFilters.situation !== "all" && item.propertySituation !== feedbackReviewFilters.situation) return false;
    if (feedbackReviewFilters.build !== "all" && item.buildVersion !== feedbackReviewFilters.build) return false;
    if (feedbackReviewFilters.evidence !== "all" && item.evidenceKind !== feedbackReviewFilters.evidence) return false;
    return true;
  });
}
function resetFeedbackFilters() {
  Object.assign(feedbackReviewFilters, { reaction: "all", situation: "all", build: "all", evidence: "all" });
  renderFeedbackReview();
  toast("Feedback filters reset");
}
function evidenceInsight(items) {
  if (!items.length) return { title: "No evidence yet", body: "No conclusion is supported until a response is saved or imported.", tone: "neutral" };
  const testerItems = testerEvidenceItems(items);
  if (!testerItems.length) return { title: "No genuine tester evidence in this view", body: "Owner/internal checks and unclassified older records are useful for debugging, but they are excluded from tester trends.", tone: "neutral" };
  if (testerItems.length === 1) return { title: "One tester response only", body: "Useful as a clue, but not enough to call a repeated problem or success.", tone: "neutral" };
  const negative = testerItems.filter((item) => item.reactionKey === "confusing" || item.reactionKey === "not-believable");
  const negativeIssues = groupFeedback(negative.filter((item) => item.issueStageKey), "issueStage");
  if (negativeIssues[0]?.count >= 2) return { title: "Repeated issue area supported", body: `${negativeIssues[0].count} negative tester responses point to ${negativeIssues[0].label}. Review that area first.`, tone: "warning" };
  const negativeSituations = groupFeedback(negative, "propertySituation");
  if (negativeSituations[0]?.count >= 2) return { title: "Repeated scenario issue supported", body: `${negativeSituations[0].count} confusing or not-believable tester responses came from ${negativeSituations[0].label}. Review that scenario first.`, tone: "warning" };
  const reactionCounts = feedbackCounts(testerItems);
  if (reactionCounts.notBelievable >= 2) return { title: "Credibility issue supported", body: `${reactionCounts.notBelievable} testers marked a result Not believable. Read those notes before changing unrelated scenarios.`, tone: "warning" };
  if (reactionCounts.confusing >= 2) return { title: "Clarity issue supported", body: `${reactionCounts.confusing} testers marked a result Confusing. Check the issue area and repeated wording below.`, tone: "warning" };
  if (reactionCounts.useful >= 2 && negative.length === 0) return { title: "Early positive tester signal", body: `${reactionCounts.useful} genuine tester responses were Useful, with no negative reaction in this filtered view. The sample is still small, so keep testing.`, tone: "positive" };
  return { title: "No repeated tester issue yet", body: "The genuine tester records are mixed or too few to support one priority. Keep the next change narrow and collect more evidence.", tone: "neutral" };
}
function feedbackBreakdownHtml(items) {
  const testerItems = testerEvidenceItems(items);
  const groups = [
    ["Evidence types", items, "evidenceKind"],
    ["Tester reactions", testerItems, "reaction"],
    ["Tester situations", testerItems, "propertySituation"],
    ["Tester recommendations", testerItems, "recommendedFuture"],
    ["Tester selections", testerItems, "selectedFuture"]
  ];
  return groups.map(([title, sourceItems, key]) => {
    const rows = groupFeedback(sourceItems, key).slice(0, 3);
    const body = rows.length ? rows.map((row) => `<li><span>${escapeHtml(row.label)}</span><b>${row.count}</b></li>`).join("") : '<li class="empty">No records</li>';
    return `<article><h3>${escapeHtml(title)}</h3><ul>${body}</ul></article>`;
  }).join("");
}
function repeatedTesterNoteLanguage(items) {
  const stop = new Set(["about","after","again","also","because","been","before","being","could","didnt","doesnt","from","have","into","just","like","more","much","only","other","really","result","should","some","than","that","their","there","these","they","this","very","what","when","where","which","with","would","your"]);
  const counts = new Map();
  testerEvidenceItems(items).forEach((item) => {
    const words = String(item.optionalNote || "").toLowerCase().replace(/[^a-z0-9\s-]/g, " ").split(/\s+/).filter((word) => word.length >= 4 && !stop.has(word));
    const phrases = new Set(words);
    for (let i = 0; i < words.length - 1; i++) phrases.add(`${words[i]} ${words[i + 1]}`);
    phrases.forEach((phrase) => counts.set(phrase, (counts.get(phrase) || 0) + 1));
  });
  return Array.from(counts, ([label, count]) => ({ label, count }))
    .filter((row) => row.count >= 2)
    .sort((a, b) => b.count - a.count || b.label.split(" ").length - a.label.split(" ").length || a.label.localeCompare(b.label))
    .slice(0, 6);
}
function feedbackNoteThemesHtml(items) {
  const testerNotes = testerEvidenceItems(items).filter((item) => item.optionalNote);
  const repeated = repeatedTesterNoteLanguage(items);
  if (!testerNotes.length) return '<b>No tester note wording yet</b><p>Optional notes remain optional. Repeated wording appears here only after genuine tester comments are saved or imported.</p>';
  if (!repeated.length) return `<b>No repeated tester wording yet</b><p>${testerNotes.length} tester note${testerNotes.length === 1 ? " is" : "s are"} available, but no phrase appears across at least two separate responses.</p>`;
  return `<b>Repeated tester wording</b><p>Shown only when the same word or phrase appears in at least two genuine tester notes.</p><div>${repeated.map((row) => `<span>${escapeHtml(row.label)} <strong>${row.count}</strong></span>`).join("")}</div>`;
}
function renderFeedbackReview() {
  const summary = $("feedbackReviewSummary"), list = $("feedbackReviewList"); if (!summary || !list) return;
  const allItems = getFeedback();
  syncFeedbackFilterOptions(allItems);
  const items = filteredFeedback(allItems), allCounts = feedbackCounts(items), testerItems = testerEvidenceItems(items), testerCounts = feedbackCounts(testerItems), disagreement = feedbackDisagreementStats(testerItems);
  const activeFilters = Object.values(feedbackReviewFilters).filter((value) => value !== "all").length;
  setText("feedbackReviewCountStatus", `Showing ${items.length} of ${allItems.length} saved response${allItems.length === 1 ? "" : "s"} · ${testerItems.length} genuine tester response${testerItems.length === 1 ? "" : "s"}${activeFilters ? ` · ${activeFilters} filter${activeFilters === 1 ? "" : "s"} active` : ""}.`);
  summary.innerHTML = [["Records", allCounts.total], ["Tester", allCounts.tester], ["Internal", allCounts.internal], ["Tester useful", testerCounts.useful], ["Tester negative", testerCounts.confusing + testerCounts.notBelievable], ["Different choice", disagreement.different]].map(([label, value]) => `<article><b>${value}</b><span>${escapeHtml(label)}</span></article>`).join("");
  const boundary = $("feedbackEvidenceBoundary");
  if (boundary) boundary.innerHTML = `<b>${testerItems.length ? `${testerItems.length} genuine tester response${testerItems.length === 1 ? "" : "s"}` : "No genuine tester responses yet"}</b><span>${allCounts.internal} internal check${allCounts.internal === 1 ? "" : "s"} and ${allCounts.unclassified} unclassified older record${allCounts.unclassified === 1 ? "" : "s"} are visible but excluded from tester conclusions.</span>`;
  const disagreementEl = $("feedbackDisagreementSummary");
  if (disagreementEl) disagreementEl.innerHTML = disagreement.comparable ? `<b>${disagreement.percent}% of testers chose differently</b><span>${disagreement.different} of ${disagreement.comparable} comparable genuine tester response${disagreement.comparable === 1 ? "" : "s"} selected a future other than VerdeAI’s recommendation.</span>` : '<b>No tester comparison yet</b><span>Recommendation-versus-selection evidence appears after a genuine tester response is saved or imported.</span>';
  const insight = evidenceInsight(items), insightEl = $("feedbackEvidenceInsight");
  if (insightEl) insightEl.className = `feedback-evidence-insight ${insight.tone}`;
  if (insightEl) insightEl.innerHTML = `<b>${escapeHtml(insight.title)}</b><p>${escapeHtml(insight.body)}</p>`;
  const groupEl = $("feedbackGroupSummary"); if (groupEl) groupEl.innerHTML = feedbackBreakdownHtml(items);
  const noteEl = $("feedbackNoteThemes"); if (noteEl) noteEl.innerHTML = feedbackNoteThemesHtml(items);
  if (!items.length) {
    list.innerHTML = `<div class="feedback-empty"><b>${allItems.length ? "No records match these filters." : "No tester feedback saved yet."}</b><p>${allItems.length ? "Reset one filter to widen the evidence view." : "Run a board and save feedback—or import a tester CSV. Self-tests default to internal checks."}</p></div>`;
    return;
  }
  list.innerHTML = items.slice(0, 30).map((item) => {
    const changed = item.selectedFuture !== item.recommendedFuture;
    const chosen = `<span>Selected: ${escapeHtml(item.selectedFuture)}</span>`;
    const choice = `<span class="choice-${changed ? "different" : "same"}">${changed ? "Different from recommendation" : "Matched recommendation"}</span>`;
    const note = item.optionalNote ? `<p>“${escapeHtml(item.optionalNote)}”</p>` : '<p class="muted-note">No optional note.</p>';
    const evidenceClass = item.evidenceKindKey === "tester" ? "evidence-tester" : item.evidenceKindKey === "internal" ? "evidence-internal" : "evidence-unclassified";
    return `<article class="feedback-review-item ${evidenceClass}"><div class="feedback-review-top"><span class="reaction-badge reaction-${escapeHtml(item.reactionKey)}">${escapeHtml(item.reaction)}</span><time datetime="${escapeHtml(item.timestamp)}">${escapeHtml(formatFeedbackTime(item.timestamp))}</time></div><h3>${escapeHtml(item.propertySituation)}</h3><div class="feedback-review-meta"><span class="evidence-kind-badge">${escapeHtml(item.evidenceKind)}</span><span>Build: ${escapeHtml(item.buildVersion)}</span><span>Recommended: ${escapeHtml(item.recommendedFuture)}</span>${chosen}${choice}<span>Issue area: ${escapeHtml(item.issueStage)}</span><span>Problem: ${escapeHtml(item.mainProblem || "Not recorded")}</span><span>Origin: ${escapeHtml(item.evidenceOrigin)}</span></div>${note}<button type="button" class="secondary feedback-delete" data-delete-feedback="${escapeHtml(item.id)}" aria-label="Delete this feedback record">Delete</button></article>`;
  }).join("");
  $$('[data-delete-feedback]', list).forEach((button) => button.addEventListener("click", () => deleteFeedback(button.dataset.deleteFeedback)));
}
function formatFeedbackTime(value) { const d = new Date(value); return Number.isNaN(d.getTime()) ? "Unknown time" : d.toLocaleString([], { dateStyle: "medium", timeStyle: "short" }); }
function deleteFeedback(id) { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(getFeedback().filter((item) => item.id !== id))); toast("Feedback record deleted"); renderFeedbackReview(); }
function clearFeedback() {
  if (getFeedback().length && !window.confirm("Clear all locally saved tester feedback from this browser?")) return;
  [FEEDBACK_KEY, ...LEGACY_FEEDBACK_KEYS].forEach((key) => localStorage.removeItem(key));
  Object.assign(feedbackReviewFilters, { reaction: "all", situation: "all", build: "all", evidence: "all" });
  setFeedbackReactionState(""); $$(".feedback-saved-status").forEach((el) => el.textContent = "");
  toast("Local feedback cleared"); renderFeedbackReview();
}
function exportFeedbackCsv() {
  const items = getFeedback();
  const columns = [["Timestamp ISO", "timestamp"], ["Local time", "localTime"], ["Build version", "buildVersion"], ["Property situation", "propertySituation"], ["Property pattern", "propertyPattern"], ["Recommended future", "recommendedFuture"], ["Selected future", "selectedFuture"], ["Selected different from recommendation", "differentChoice"], ["Reaction", "reaction"], ["Score", "score"], ["Optional note", "optionalNote"], ["Preferred direction", "preference"], ["Main problem", "mainProblem"], ["Starter clue", "starterClue"], ["Test source", "source"], ["Evidence origin", "evidenceOrigin"], ["Evidence type", "evidenceKind"], ["Issue area", "issueStage"], ["Context ID", "contextId"], ["Record ID", "id"]];
  const rows = [columns.map(([header]) => csvCell(header)).join(",")];
  items.forEach((item) => {
    const comparable = item.recommendedFuture !== "Not recorded" && item.selectedFuture !== "Not recorded";
    const rec = { ...item, localTime: formatFeedbackTime(item.timestamp), differentChoice: comparable ? (item.recommendedFuture !== item.selectedFuture ? "Yes" : "No") : "Unknown" };
    rows.push(columns.map(([, key]) => csvCell(rec[key] || "")).join(","));
  });
  downloadText("verdeai-v9-2-feedback.csv", `\ufeff${rows.join("\r\n")}`, "text/csv;charset=utf-8");
  addHistory("Feedback CSV exported", `${items.length} record${items.length === 1 ? "" : "s"}`); toast(items.length ? "Feedback CSV exported" : "Empty feedback CSV exported");
}
function parseCsvRows(text) {
  const rows = []; let row = [], field = "", quoted = false;
  const clean = String(text || "").replace(/^\ufeff/, "");
  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];
    if (quoted) {
      if (char === '"' && clean[i + 1] === '"') { field += '"'; i++; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') { row.push(field); field = ""; }
    else if (char === '\n') { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += char;
  }
  if (field || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  return rows.filter((cells) => cells.some((cell) => String(cell).trim()));
}
function simpleHash(value) {
  let hash = 0; for (const char of String(value)) hash = ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  return Math.abs(hash).toString(36);
}
async function importFeedbackCsvFile(file) {
  const input = $("feedbackCsvInput");
  if (!file) return;
  if (file.size > 2_000_000) { toast("CSV is too large; keep it under 2 MB"); if (input) input.value = ""; return; }
  try {
    const rows = parseCsvRows(await file.text());
    if (rows.length < 2) throw new Error("No feedback rows found");
    const headers = rows[0].map((header) => String(header).trim());
    const headerIndex = new Map(headers.map((header, index) => [header, index]));
    const value = (row, name) => row[headerIndex.get(name)] ?? "";
    if (!headerIndex.has("Build version") || !headerIndex.has("Reaction")) throw new Error("Not a VerdeAI feedback CSV");
    const imported = rows.slice(1, 1001).map((row, index) => {
      const signature = [value(row, "Timestamp ISO"), value(row, "Build version"), value(row, "Property situation"), value(row, "Recommended future"), value(row, "Selected future"), value(row, "Reaction"), value(row, "Optional note")].join("|");
      return normaliseFeedbackItem({
        id: value(row, "Record ID") || `import-${simpleHash(signature)}-${index}`,
        timestamp: value(row, "Timestamp ISO") || new Date().toISOString(),
        buildVersion: value(row, "Build version"), propertySituation: value(row, "Property situation"), propertyPattern: value(row, "Property pattern"),
        recommendedFuture: value(row, "Recommended future"), selectedFuture: value(row, "Selected future"), reaction: value(row, "Reaction"), score: value(row, "Score"),
        optionalNote: value(row, "Optional note"), preference: value(row, "Preferred direction"), mainProblem: value(row, "Main problem"), starterClue: value(row, "Starter clue"),
        source: value(row, "Test source") || "Imported CSV", evidenceOrigin: "Imported CSV", evidenceKind: value(row, "Evidence type"), issueStage: value(row, "Issue area"), contextId: value(row, "Context ID")
      }, index);
    });
    const existing = getFeedback(), ids = new Set(existing.map((item) => item.id));
    const additions = imported.filter((item) => !ids.has(item.id));
    localStorage.setItem(FEEDBACK_KEY, JSON.stringify([...additions, ...existing].sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp)).slice(0, 500)));
    toast(`${additions.length} feedback record${additions.length === 1 ? "" : "s"} imported`);
    addHistory("Feedback CSV imported", `${additions.length} new · ${imported.length - additions.length} duplicate`);
    renderFeedbackReview(); renderHistory();
  } catch (error) {
    toast(error?.message || "Feedback CSV could not be imported");
  } finally {
    if (input) input.value = "";
  }
}

function resetProject() {
  const keepHistory = state.history;
  feedbackEvidenceOverride = "";
  feedbackIssueStageOverride = "";
  feedbackEvidenceBoardKey = "";
  calibrationUi.open = false;
  calibrationUi.undo = [];
  Object.assign(state, {
    photoDataUrl: "", photoName: "", photoMeta: {}, demoMode: false, selfTestMode: false, propertyType: "needs-review", preference: "balanced", postcode: "", budget: "weekend", maintenance: "low", constraint: "unsure", note: "", analysisComplete: false, selectedFutureId: "belonging", recommendedFutureId: "belonging", visualMode: "recommended", calibration: null, designRefinements: [], intensity: 3, dna: {}, noticed: [], climate: {}, lastRunAt: null, starterCue: "", analysisSnapshot: null, history: keepHistory
  });
  setFormFromState();
  $$(".design-toggle").forEach((input) => { input.checked = false; });
  if ($("photoInput")) $("photoInput").value = "";
  if ($("photoPreview")) $("photoPreview").removeAttribute("src");
  $("uploadDrop")?.classList.remove("has-image");
  setProgress(0, "Ready", "Upload a photo or use demo mode to begin.");
  localStorage.removeItem(SESSION_KEY);
  addHistory("Project reset", "Started fresh local session");
  persistCurrentSessionNow();
  renderAll();
}

function renderStarterSuggestions() {
  const container = $("starterSuggestions");
  if (!container) return;
  const hasPhoto = Boolean(state.photoDataUrl || state.demoMode);
  if (!hasPhoto) {
    container.innerHTML = `<span class="starter-empty">Upload a photo and VerdeAI will offer fast starter clues here.</span>`;
    return;
  }
  container.innerHTML = STARTER_PRESETS.map((preset) => {
    const active = state.starterCue === preset.id ? " active" : "";
    return `<button type="button" class="starter-chip${active}" data-starter="${escapeHtml(preset.id)}">${escapeHtml(preset.label)}</button>`;
  }).join("");
  $$('[data-starter]', container).forEach((btn) => btn.addEventListener("click", () => applyStarterPreset(btn.dataset.starter)));
}

function applyStarterPreset(id) {
  const preset = STARTER_PRESETS.find((item) => item.id === id);
  if (!preset) return;
  state.starterCue = preset.id;
  state.propertyType = preset.propertyType;
  state.constraint = preset.constraint;
  state.analysisComplete = false;
  clearAnalysisSnapshot();
  if (!state.note || state.note.startsWith("Photo clue:")) state.note = preset.note;
  setFormFromState();
  setProgress(60, "Starter clue applied", `${preset.label}. Running the first useful analysis now.`);
  addHistory("Starter clue applied", preset.label);
  runAnalysis({ starter: true });
  toast("Starter clue applied and analysed");
}

function clueCoachMessage() {
  const hasPhoto = Boolean(state.photoDataUrl || state.demoMode);
  if (!hasPhoto) return "Upload a photo first. The image will become the overlay base.";
  if (state.propertyType === "needs-review") return "Pick the closest situation or tap a starter suggestion. This prevents the app from making a lazy blank-canvas guess.";
  if (state.constraint === "unsure") return "Good: situation selected. Now choose the main problem so the first move is practical, not generic.";
  return `Good: ${TYPE_PROFILES[state.propertyType]?.label || "situation"} + ${constraintLabel(state.constraint)}. Press Analyse Property.`;
}

function visibleSiteLanguage(profile, noteSignals = extractNoteSignals(state.note)) {
  const lines = [];
  const add = (line) => { if (line && !lines.includes(line)) lines.push(line); };
  if (state.photoDataUrl || state.demoMode) add("Photo is used as the visual overlay base; site interpretation is still guided by selected clues, not full AI vision.");
  if (state.propertyType === "under-building") {
    add("Treat overhead cover, concrete columns, hard surfaces, and low light as design constraints.");
    add("Use shade-tolerant structure, mulch, clear edges, and a protected access route before feature planting.");
  }
  if (state.propertyType === "overgrown") add("Existing plants, rocks, bare soil, and hidden edges may be useful once the area is selectively cleared.");
  if (state.propertyType === "utility") add("Utility items, tanks, taps, pipes, or service access need a clean frame rather than a permanent cover-up.");
  if (state.propertyType === "foundation") add("The building edge, hard surface, bare soil line, and planting depth need to read as one tidy edge.");
  if (state.propertyType === "side-yard") add("Narrow access and wall/fence edges matter more than filling the floor with features.");
  if (state.constraint === "shade-dark" || noteSignals.includes("shade")) add("Shade/low-light clues mean low-care groundcover, mulch, leaf texture, and light-coloured edges are safer than sun-hungry plants.");
  if (state.constraint === "access-awkward" || noteSignals.includes("access")) add("Access is a visible priority: protect one clean walking line before placing plants, pots, screens, or seating.");
  if (state.constraint === "messy-edge" || noteSignals.includes("edge")) add("Messy edges or bare soil should be simplified with one clear boundary line before adding decorative detail.");
  if (noteSignals.includes("utility")) add("Utility/service clues mean every screen or planting idea must stay removable or reachable.");
  return lines.slice(0, 7);
}

function visibleSiteSummary(profile) {
  const lines = visibleSiteLanguage(profile).filter((line) => !line.startsWith("Photo is used"));
  if (!lines.length) return "";
  const labels = [];
  if (state.propertyType === "under-building" || state.constraint === "shade-dark" || extractNoteSignals(state.note).includes("shade")) labels.push("shade / low light");
  if (state.constraint === "access-awkward" || extractNoteSignals(state.note).includes("access")) labels.push("access route");
  if (state.propertyType === "utility" || extractNoteSignals(state.note).includes("utility")) labels.push("service access");
  if (state.constraint === "messy-edge" || extractNoteSignals(state.note).includes("edge")) labels.push("edges / bare soil");
  if (labels.length) return `Visible clues considered: ${unique(labels).join(", ")}.`;
  return lines[0];
}

function cleanPropertyNote(note = "") {
  let text = String(note).trim();
  if (!text) return "";
  text = text.replace(/^Photo clue:\s*/i, "").trim();
  text = text.replace(/\s+/g, " ");
  if (text.length <= 118) return text;
  const cut = text.slice(0, 118);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 70 ? lastSpace : 118).trim()}...`;
}

function renderQuickStatus() {
  const hasPhoto = Boolean(state.photoDataUrl || state.demoMode);
  const hasSituation = state.propertyType !== "needs-review";
  const hasProblem = state.constraint !== "unsure";
  const situation = TYPE_PROFILES[state.propertyType]?.label || "Situation selected";
  setText("quickStartTitle", state.analysisComplete ? "Result ready." : "Create your result board.");
  setText("quickStartStatus", state.analysisComplete
    ? `${recommendedFuture().title} · recommendation ready${state.selectedFutureId !== state.recommendedFutureId ? `; exploring ${selectedFuture().title}.` : "."}`
    : hasPhoto
      ? `${clueCoachMessage()}`
      : "Upload a photo or use demo mode, then press Analyse Property. The first useful result should appear without needing instructions.");
  setText("stepPhoto", `${hasPhoto ? "✅" : "⬜"} Photo`);
  setText("stepSituation", `${hasSituation ? "✅" : "⬜"} Situation`);
  setText("stepProblem", `${hasProblem ? "✅" : "⬜"} Main problem`);
  setText("stepAnalysis", `${state.analysisComplete ? "✅" : "⬜"} Analysis`);
  const photoMeta = photoMetaSummary();
  setText("photoReadiness", hasPhoto
    ? `${state.demoMode ? "Demo image" : state.photoName || "Uploaded image"} loaded${photoMeta ? ` (${photoMeta})` : ""}. Overlays use this image as the base; analysis stays clue-guided until real vision is connected.`
    : "No image loaded yet. Demo mode is available for a quick test.");
  setText("clueCoachText", clueCoachMessage());
}

function renderPublicBetaChecklist() {
  const el = $("publicBetaChecklist");
  if (!el) return;
  const checks = readinessChecklist().slice(0, 4);
  el.innerHTML = checks.map((item) => `<li class="${item.done ? "done" : ""}">${item.done ? "✅" : "⬜"} ${escapeHtml(item.label)}</li>`).join("");
}

function photoMetaSummary() {
  const meta = state.photoMeta || {};
  if (state.selfTestMode || meta.selfTest) return "self-test";
  if (state.demoMode || meta.demo) return "demo";
  if (!meta.originalBytes && !meta.storedBytes) return "";
  const saved = meta.originalBytes && meta.storedBytes ? Math.max(0, Math.round((1 - meta.storedBytes / meta.originalBytes) * 100)) : 0;
  if (meta.compressed && saved > 5) return `compressed ${saved}% smaller`;
  if (meta.storedSize) return `prepared ${meta.storedSize}`;
  return "prepared";
}

function renderSiteClues(profile) {
  const clues = siteClues(profile);
  $("siteCluePills").innerHTML = clues.map((clue) => `<span>${escapeHtml(clue)}</span>`).join("");
  setText("specificityText", state.analysisComplete ? `${specificityScore()}% specificity from the chosen clues. The photo is used for overlays; full AI vision is not connected yet.` : "Pick a starter suggestion, main problem, or property note to make the result sharper.");
}

function siteClues(profile) {
  const signals = extractNoteSignals(state.note).filter((signal) => signal !== "needs-input");
  const clues = [profile.pattern, preferenceLabel(state.preference), constraintLabel(state.constraint), budgetLabel(state.budget), maintenanceLabel(state.maintenance)];
  if (state.postcode) clues.push(state.climate?.label || climateFromPostcode(state.postcode).label);
  signals.slice(0, 3).forEach((signal) => clues.push(`note: ${signal}`));
  return unique(clues).slice(0, 9);
}

function analysisBrief(profile) {
  if (!state.analysisComplete) return "Waiting for a photo or demo run.";
  return `${profile.pattern} + ${constraintLabel(state.constraint)} → ${recommendedFuture().title}. Confidence ${specificityScore()}%.`;
}

function specificityScore() {
  let score = 56;
  if (state.photoDataUrl || state.demoMode) score += 10;
  if (state.constraint !== "unsure") score += 12;
  if (state.note.length > 18) score += 10;
  if (state.postcode) score += 6;
  if (state.designRefinements.length) score += 3;
  return clamp(score, 40, 94);
}

function specificityReasons(future, profile) {
  const reasons = [];
  if (state.photoDataUrl || state.demoMode) reasons.push("Photo loaded and used as the visual base for overlays.");
  reasons.push(`Situation: ${profile.label} → ${profile.pattern}.`);
  reasons.push(`Goal: ${preferenceLabel(state.preference)}.`);
  if (state.constraint !== "unsure") reasons.push(`Problem: ${constraintLabel(state.constraint)}.`);
  const visibleSummary = visibleSiteSummary(profile);
  if (visibleSummary) reasons.push(visibleSummary);
  const note = cleanPropertyNote(state.note);
  if (note) reasons.push(`Property note: ${note}`);
  if (state.postcode) reasons.push(`Climate clue: ${state.climate?.label || climateFromPostcode(state.postcode).label}.`);
  reasons.push(`${future.title} scored highest after matching goal, problem, budget, and maintenance tolerance.`);
  return unique(reasons);
}

function riskNotes() {
  const notes = [
    `Confidence ${specificityScore()}%: based on tester clues and rule logic; not full AI image recognition yet.`,
    constraintProfile().nudge
  ];
  if (!state.photoDataUrl && !state.demoMode) notes.unshift("Upload a real photo before trusting overlay positions.");
  if (state.propertyType === "needs-review") notes.push("Choose a starter clue before treating the analysis as useful.");
  if (state.constraint === "shade-dark" || state.propertyType === "under-building") notes.push("Use shade-tolerant, tough plants/materials and keep service/access routes clear.");
  if (state.constraint === "water-risk" || state.propertyType === "slope") notes.push("Check drainage and stability before cosmetic planting.");
  if (state.maintenance === "low") notes.push("Avoid high-maintenance feature creep. Future you deserves peace.");
  if (!state.note) notes.push("A short property note will make the next result feel less generic.");
  return unique(notes).slice(0, 6);
}

function overlayStyleClass(future) {
  return `overlay-${future.id} type-${state.propertyType} constraint-${state.constraint}`;
}

function constraintProfile() {
  return CONSTRAINT_PROFILES[state.constraint] || CONSTRAINT_PROFILES.unsure;
}

function selectedFuture() {
  return FUTURES.find((f) => f.id === state.selectedFutureId) || FUTURES[0];
}

function normaliseVisualMode(value = state.visualMode) {
  return ["original", "recommended", "selected"].includes(value) ? value : "recommended";
}

function hasAnalysisEvidence(candidate = state) {
  if (!candidate || typeof candidate !== "object") return false;
  if (candidate.analysisComplete === true) return true;
  const snapshot = candidate.analysisSnapshot;
  if (snapshot && typeof snapshot === "object") {
    if (snapshot.lastRunAt || snapshot.recommendedFutureId || (snapshot.dna && Object.keys(snapshot.dna).length)) return true;
  }
  const hasPhotoSource = Boolean(candidate.photoDataUrl || candidate.photoName || candidate.demoMode || candidate.selfTestMode);
  const hasScenario = Boolean(candidate.propertyType && candidate.propertyType !== "needs-review");
  const hasRecommendation = FUTURES.some((future) => future.id === candidate.recommendedFutureId);
  const hasGeneratedData = Boolean(
    candidate.lastRunAt ||
    (candidate.dna && Object.values(candidate.dna).filter((value) => Number.isFinite(Number(value))).length >= 3) ||
    (Array.isArray(candidate.noticed) && candidate.noticed.length >= 1)
  );
  return hasPhotoSource && hasScenario && hasRecommendation && hasGeneratedData;
}

function synchroniseAnalysedBoardState(source = "runtime") {
  const ready = hasAnalysisEvidence(state);
  if (!ready) return false;
  const wasIncomplete = !state.analysisComplete;
  state.analysisComplete = true;
  const ranked = rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note || ""));
  if (!FUTURES.some((future) => future.id === state.recommendedFutureId)) state.recommendedFutureId = ranked[0]?.id || "belonging";
  if (!FUTURES.some((future) => future.id === state.selectedFutureId)) state.selectedFutureId = state.recommendedFutureId;
  state.visualMode = normaliseVisualMode(state.visualMode || "recommended");
  state.calibration = normaliseCalibration(state.calibration);
  ensureCalibration({ resetIfUncustomised: false });
  if (!state.analysisSnapshot) captureAnalysisSnapshot();
  if (wasIncomplete) {
    state.analysisRecoverySource = source;
    scheduleSessionPersist();
  }
  return true;
}

function visualFutureForMode(mode = normaliseVisualMode()) {
  if (mode === "selected") return selectedFuture();
  return recommendedFuture();
}

function visualModeTitle(mode = normaliseVisualMode()) {
  if (mode === "original") return "Original photo";
  if (mode === "selected") return `Selected Future · ${selectedFuture().title}`;
  return `VerdeAI Concept · ${recommendedFuture().title}`;
}

function openConceptCalibration(source = "Concept placement control") {
  const boardReady = synchroniseAnalysedBoardState(source);
  if (!boardReady) {
    toast("Create a board first, then adjust its placement");
    activateTab("explore");
    window.setTimeout(() => scrollBelowStickyTabs($("uploadDrop") || $("explore")), 40);
    return;
  }
  activateTab("dashboard");
  state.visualMode = "recommended";
  calibrationUi.open = true;
  calibrationUi.tool = "usable";
  renderDashboard();
  renderCompare();
  renderTesterPage();
  scheduleSessionPersist();
  addHistory("Concept placement opened", source);
  announce("Concept placement controls opened. Start with the usable ground handles.");
  toast("Concept placement controls opened");
  window.requestAnimationFrame(() => {
    window.setTimeout(() => {
      scrollToMainVisual();
      $("dashboardTodayVisual")?.setAttribute("tabindex", "-1");
      $("dashboardTodayVisual")?.focus({ preventScroll: true });
    }, 80);
  });
}

function scrollToMainVisual() {
  const target = $("dashboardTodayVisual") || $("boardResultTop");
  if (!target) return;
  window.requestAnimationFrame(() => scrollBelowStickyTabs(target));
}

function setProgress(percent, label, detail) {
  setText("progressLabel", label);
  setText("progressPercent", `${percent}%`);
  setText("progressDetail", detail);
  if ($("progressFill")) $("progressFill").style.width = `${percent}%`;
}

function addHistory(title, detail) {
  const item = { title, detail, at: new Date().toISOString() };
  state.history.push(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(state.history.slice(-50)));
  scheduleSessionPersist();
}

function loadHistory() {
  state.history = readStoredArray(HISTORY_KEY, LEGACY_HISTORY_KEYS);
}

function scheduleSessionPersist() {
  window.clearTimeout(scheduleSessionPersist._timer);
  scheduleSessionPersist._timer = window.setTimeout(persistCurrentSessionNow, SESSION_SAVE_DELAY_MS);
}

function persistCurrentSessionNow() {
  try {
    const payload = {
      savedAt: new Date().toISOString(),
      version: state.version,
      state: serialiseState()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(payload));
  } catch {
    // If localStorage is full, keep the app running. Manual share/export still works.
  }
}

function restoreCurrentSession() {
  const payload = readStoredObject(SESSION_KEY, LEGACY_SESSION_KEYS);
  const saved = payload?.state || payload;
  if (!saved || typeof saved !== "object") return false;
  const hasUsefulSession = Boolean(saved.photoDataUrl || saved.photoName || saved.demoMode || saved.analysisComplete || saved.starterCue || saved.propertyType !== "needs-review");
  if (!hasUsefulSession) return false;
  const currentHistory = state.history;
  Object.assign(state, saved);
  state.version = BUILD_VERSION;
  state.history = Array.isArray(saved.history) && saved.history.length ? saved.history : currentHistory;
  state.designRefinements = Array.isArray(state.designRefinements) ? state.designRefinements : [];
  state.aiRender = normaliseRenderSettings(state.aiRender);
  state.photoMeta = state.photoMeta || {};
  state.constraint = state.constraint || "unsure";
  state.propertyType = state.propertyType || "needs-review";
  state.starterCue = state.starterCue || "";
  state.recommendedFutureId = state.recommendedFutureId || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note || ""))[0]?.id || "belonging";
  state.visualMode = normaliseVisualMode(state.visualMode);
  state.calibration = normaliseCalibration(state.calibration);
  synchroniseAnalysedBoardState("autosave recovery");
  if (state.analysisComplete && !state.analysisSnapshot) captureAnalysisSnapshot();
  setFormFromState();
  if (state.photoDataUrl) {
    if ($("photoPreview")) $("photoPreview").src = state.photoDataUrl;
    $("uploadDrop")?.classList.add("has-image");
  }
  return true;
}

function readStoredObject(primaryKey, legacyKeys = []) {
  for (const key of [primaryKey, ...legacyKeys]) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      const value = JSON.parse(raw || "{}");
      if (value && typeof value === "object" && !Array.isArray(value)) return value;
    } catch { /* ignore broken local object */ }
  }
  return null;
}

function renderSessionRecovery() {
  const el = $("sessionRecovery");
  if (!el) return;
  const hasWork = Boolean(state.photoDataUrl || state.demoMode || state.analysisComplete || state.starterCue);
  if (!hasWork) {
    el.innerHTML = `<b>Autosave is ready.</b><p>v9.4 keeps a local recovery copy while you test, so closing the page should not mean starting from zero.</p>`;
    return;
  }
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const title = state.analysisComplete ? `${profile.pattern} → ${selectedFuture().title}` : "Current photo/clues in progress";
  const detail = state.analysisComplete ? roadmapData()[0].task : smartNextPlan().detail;
  el.innerHTML = `<b>Autosaved current session</b><p><strong>${escapeHtml(title)}</strong><br>${escapeHtml(detail)}</p><small>Stored only in this browser/domain. Use Save Project or Share Code before switching browsers.</small>`;
}

function readStoredArray(primaryKey, legacyKeys = []) {
  try {
    const primaryRaw = localStorage.getItem(primaryKey);
    if (primaryRaw !== null) {
      const primaryValue = JSON.parse(primaryRaw || "[]");
      return Array.isArray(primaryValue) ? primaryValue : [];
    }
  } catch { /* ignore broken primary local data */ }
  for (const key of legacyKeys) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) continue;
      const value = JSON.parse(raw || "[]");
      if (Array.isArray(value)) return value;
    } catch { /* ignore broken legacy local data */ }
  }
  return [];
}

function sharePayload() {
  const data = serialiseState();
  delete data.photoDataUrl;
  data.photoName = data.photoName ? `${data.photoName} (photo not included in share code)` : "";
  data.shareVersion = BUILD_VERSION;
  return data;
}

function makeShareCode() {
  const json = JSON.stringify(sharePayload());
  return `VERDEAI920:${btoa(unescape(encodeURIComponent(json)))}`;
}

function copyShareCode() {
  if (!state.analysisComplete) runAnalysis({ quiet: true });
  copyText(makeShareCode(), "Share code copied");
  addHistory("Share code copied", selectedFuture().title);
  renderAll();
}

function importShareCode() {
  const raw = ($("shareCodeInput")?.value || "").trim();
  if (!raw) return toast("Paste a share code first");
  try {
    const encoded = raw.replace(/^VERDEAI(?:920|92|911|91|90|89|88|87|86|85|84|32|31|30|29|28|27|26):/, "");
    const data = JSON.parse(decodeURIComponent(escape(atob(encoded))));
    Object.assign(state, data, { version: BUILD_VERSION, photoDataUrl: "", photoMeta: {}, demoMode: false, selfTestMode: false });
    state.designRefinements = Array.isArray(state.designRefinements) ? state.designRefinements : [];
    state.history = state.history || [];
    state.recommendedFutureId = state.recommendedFutureId || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note || ""))[0]?.id || "belonging";
    state.visualMode = normaliseVisualMode(state.visualMode);
    state.calibration = normaliseCalibration(state.calibration);
    synchroniseAnalysedBoardState("share-code import");
    if (state.analysisComplete) captureAnalysisSnapshot();
    setFormFromState();
    $("uploadDrop")?.classList.remove("has-image");
    if ($("photoPreview")) $("photoPreview").removeAttribute("src");
    addHistory("Share code imported", selectedFuture().title);
    toast("Share code imported");
    renderAll();
  } catch {
    toast("That share code did not import");
  }
}

function downloadProjectJson() {
  const data = { ...serialiseState(), report: reportText({ full: true }), testerSummary: testerSummaryText(), exportedAt: new Date().toISOString() };
  downloadText("verdeai-v9-2-project.json", JSON.stringify(data, null, 2), "application/json");
}

function downloadText(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    toast(message);
  }
}

function toast(message) {
  const el = $("toast");
  if (!el) return;
  el.textContent = message;
  const live = $("appStatus");
  if (live) { live.textContent = ""; window.setTimeout(() => { live.textContent = message; }, 10); }
  el.classList.add("show");
  window.clearTimeout(toast._timer);
  toast._timer = window.setTimeout(() => el.classList.remove("show"), 2200);
}

function setText(id, value) {
  const el = $(id);
  if (el) el.textContent = value;
}

function unique(items) { return Array.from(new Set(items)); }
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)); }
function titleCase(text) { return String(text).replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c])); }
function csvCell(value) { return `"${String(value).replace(/"/g, '""')}"`; }

function preferenceLabel(value) {
  return ({ balanced: "Balanced", minimal: "Minimal and clean", "low-maintenance": "Low maintenance", wildlife: "Wildlife / native habitat", "outdoor-living": "Outdoor living", food: "Food garden", privacy: "Privacy", income: "Street appeal / value", maker: "Workshop / practical use" })[value] || value;
}
function budgetLabel(value) { return ({ weekend: "Weekend cheap fixes", modest: "Modest staged upgrade", serious: "Serious transformation" })[value] || value; }
function maintenanceLabel(value) { return ({ low: "Keep maintenance low", medium: "Some work is fine", high: "Enjoys ongoing projects" })[value] || value; }
function constraintLabel(value) { return CONSTRAINT_PROFILES[value]?.label || value || "Not sure yet"; }
function labelForRefinement(value) { return ({ native: "more native plants", colour: "more colour", privacy: "more privacy", seating: "more seating", lighting: "more lighting", budget: "lower budget", minimal: "cleaner minimal styling", wildlife: "wildlife focus", balanced: "balanced design" })[value] || value; }
function demoGradient() { return "linear-gradient(135deg, #386348, #9dbb91)"; }
function demoBackgroundStyle() {
  return state.demoMode
    ? "background-image:url('assets/demo-overgrown-garden.jpg')"
    : `background-image:${demoGradient()}`;
}

init();
