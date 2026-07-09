const $ = (id) => document.getElementById(id);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

const STORAGE_KEY = "verdeai_v2_4_projects";
const FEEDBACK_KEY = "verdeai_v2_4_feedback";
const HISTORY_KEY = "verdeai_v2_4_history";
const LEGACY_STORAGE_KEYS = ["verdeai_v2_3_projects", "verdeai_v2_2_projects"];
const LEGACY_FEEDBACK_KEYS = ["verdeai_v2_3_feedback", "verdeai_v2_2_feedback"];
const LEGACY_HISTORY_KEYS = ["verdeai_v2_3_history", "verdeai_v2_2_history"];

const FUTURES = [
  {
    id: "belonging",
    icon: "🏡",
    title: "Belonging Garden",
    subtitle: "Make the place feel welcoming and intentional.",
    color: "#0b5c40",
    tint: "rgba(11, 92, 64, .30)",
    tags: ["arrival", "identity", "comfort"],
    bestFor: ["balanced", "income", "front-yard", "foundation", "needs-review", "under-building"],
    visualLabels: ["strong arrival point", "soft planting edge", "one clear feature"],
    baseWhy: "This future gives the property a clearer identity before it gets more bits added to it."
  },
  {
    id: "minimal",
    icon: "🌾",
    title: "Low-Maintenance Haven",
    subtitle: "Simple structure, repeated planting, fewer chores.",
    color: "#6b7f2a",
    tint: "rgba(107, 127, 42, .28)",
    tags: ["minimal", "easy care", "clean"],
    bestFor: ["minimal", "low-maintenance", "blank", "backyard", "under-building"],
    visualLabels: ["repeat one plant mass", "clean edge line", "mulched low-care zone"],
    baseWhy: "This future reduces decision fatigue and makes the space easier to keep tidy."
  },
  {
    id: "wildlife",
    icon: "🦋",
    title: "Wildlife Haven",
    subtitle: "Habitat, flowers, shelter, and life in the garden.",
    color: "#2f714a",
    tint: "rgba(47, 113, 74, .34)",
    tags: ["native", "birds", "pollinators"],
    bestFor: ["wildlife", "overgrown", "side-yard", "backyard", "under-building"],
    visualLabels: ["layered habitat", "pollinator strip", "small water/shelter point"],
    baseWhy: "This future turns unused edges into habitat instead of just decoration."
  },
  {
    id: "gathering",
    icon: "🔥",
    title: "Gathering Grove",
    subtitle: "A comfortable place to sit, talk, eat, or pause.",
    color: "#a34c05",
    tint: "rgba(163, 76, 5, .28)",
    tags: ["seating", "lighting", "people"],
    bestFor: ["outdoor-living", "courtyard", "backyard"],
    visualLabels: ["seating circle", "evening lighting", "defined outdoor room"],
    baseWhy: "This future gives the space a reason to be used, not just looked at."
  },
  {
    id: "productive",
    icon: "🍋",
    title: "Productive Patch",
    subtitle: "Food, herbs, compost, and practical garden value.",
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
    title: "Maker Territory",
    subtitle: "A practical outdoor zone for building, repair, and storage control.",
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
  version: "2.4",
  photoDataUrl: "",
  photoName: "",
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
  designRefinements: [],
  intensity: 3,
  dna: {},
  noticed: [],
  climate: {},
  history: [],
  lastRunAt: null,
  starterCue: ""
};

const STARTER_PRESETS = [
  { id: "shade", label: "Looks shaded / under cover", propertyType: "under-building", constraint: "shade-dark", note: "Photo clue: shaded or under-building area with low light. Keep access clear and use tough low-light planting or mulch." },
  { id: "access", label: "Path/access feels awkward", propertyType: "overgrown", constraint: "access-awkward", note: "Photo clue: movement through the area feels awkward. Protect a clear walking route before adding features." },
  { id: "tired", label: "Overgrown or tired", propertyType: "overgrown", constraint: "maintenance-drag", note: "Photo clue: tired or overgrown planting. Reveal what is worth keeping before redesigning." },
  { id: "utility", label: "Utility object / tank / services", propertyType: "utility", constraint: "access-awkward", note: "Photo clue: utility or service object nearby. Improve appearance without blocking future access." },
  { id: "edge", label: "Messy edges / bare soil", propertyType: "foundation", constraint: "messy-edge", note: "Photo clue: bare soil, messy edges, or hard surface meeting planting. Fix the edge line first." }
];

function init() {
  wireTabs();
  wireInputs();
  wireButtons();
  loadHistory();
  renderAll();
  setProgress(0, "Ready", "Upload a photo or use demo mode to begin.");
}

function wireTabs() {
  $$(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      $$(".tab").forEach((b) => b.classList.remove("active"));
      $$(".screen").forEach((s) => s.classList.remove("active"));
      btn.classList.add("active");
      $(btn.dataset.tab)?.classList.add("active");
      renderAll();
    });
  });
}

function wireInputs() {
  const photoInput = $("photoInput");
  photoInput?.addEventListener("change", handlePhotoInput);

  ["propertyType", "preferenceSelect", "postcodeInput", "budgetSelect", "maintenanceSelect", "constraintSelect", "propertyNote", "feedbackScore", "feedbackNotes", "styleIntensity"].forEach((id) => {
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
    renderAll();
  }));
}

function wireButtons() {
  $("analyseBtn")?.addEventListener("click", () => runAnalysis());
  $("demoBtn")?.addEventListener("click", enableDemoMode);
  $("saveProjectBtn")?.addEventListener("click", saveProject);
  $("resetBtn")?.addEventListener("click", resetProject);
  $("copyReportBtn")?.addEventListener("click", () => copyText(reportText(), "Report copied"));
  $("copyFullReportBtn")?.addEventListener("click", () => copyText(reportText({ full: true }), "Full report copied"));
  $("copyTesterSummaryBtn")?.addEventListener("click", () => copyText(testerSummaryText(), "Tester summary copied"));
  $("printBtn")?.addEventListener("click", () => window.print());
  $("printFullReportBtn")?.addEventListener("click", () => window.print());
  $("downloadJsonBtn")?.addEventListener("click", downloadProjectJson);
  $("saveFeedbackBtn")?.addEventListener("click", saveFeedback);
  $("clearSavedBtn")?.addEventListener("click", clearSavedProjects);
  $("exportFeedbackBtn")?.addEventListener("click", exportFeedbackCsv);
  $("applyDesignBtn")?.addEventListener("click", () => {
    state.designRefinements = $$(".design-toggle:checked").map((x) => x.value);
    state.intensity = Number($("styleIntensity")?.value || 3);
    toast("Refinement applied");
    addHistory("Design refinement applied", `Refinements: ${state.designRefinements.map(labelForRefinement).join(", ") || "balanced"}`);
    renderAll();
  });
  $("clearDesignBtn")?.addEventListener("click", () => {
    $$(".design-toggle").forEach((input) => { input.checked = false; });
    state.designRefinements = [];
    state.intensity = 3;
    if ($("styleIntensity")) $("styleIntensity").value = "3";
    toast("Refinements cleared");
    renderAll();
  });
}

function handlePhotoInput(event) {
  const file = event.target.files?.[0];
  if (file) readPhoto(file);
}

function readPhoto(file) {
  if (!file.type.startsWith("image/")) {
    toast("Please choose an image file");
    return;
  }
  const reader = new FileReader();
  reader.onload = (event) => {
    state.photoDataUrl = String(event.target?.result || "");
    state.photoName = file.name;
    state.demoMode = false;
    state.analysisComplete = false;
    state.selectedFutureId = "belonging";
    if (state.propertyType === "blank") state.propertyType = "needs-review";
    if (!state.starterCue) state.constraint = "unsure";
    setFormFromState();
    $("photoPreview").src = state.photoDataUrl;
    $("uploadDrop")?.classList.add("has-image");
    setProgress(25, "Photo loaded", "Now pick a starter suggestion or choose the closest situation and main problem.");
    addHistory("Photo uploaded", file.name);
    toast("Photo loaded — pick one clue before analysing");
    renderAll();
  };
  reader.readAsDataURL(file);
}

function enableDemoMode() {
  state.demoMode = true;
  state.photoDataUrl = "";
  state.photoName = "Demo property photo";
  state.propertyType = "front-yard";
  state.preference = "low-maintenance";
  state.postcode = "3941";
  state.budget = "weekend";
  state.maintenance = "low";
  state.constraint = "too-open";
  state.note = "Open front area, want it simpler, cleaner, and more useful without spending heaps.";
  state.starterCue = "demo";
  setFormFromState();
  $("uploadDrop")?.classList.remove("has-image");
  runAnalysis();
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
}

function runAnalysis(options = {}) {
  syncStateFromForm();
  if (state.propertyType === "needs-review" && state.photoDataUrl && state.constraint === "unsure") {
    setProgress(55, "Guided first pass", "Photo loaded. Because no clue was chosen, VerdeAI is using a cautious first pass instead of guessing blank canvas.");
  }
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const climate = climateFromPostcode(state.postcode);
  const noteSignals = extractNoteSignals(state.note);
  const ranked = rankFutures(profile, noteSignals);
  state.selectedFutureId = ranked[0]?.id || "belonging";
  state.dna = buildDna(profile, noteSignals, climate);
  state.noticed = buildNoticed(profile, noteSignals, climate);
  state.climate = climate;
  state.analysisComplete = true;
  state.lastRunAt = new Date().toISOString();
  if (!options.quiet) {
    setProgress(100, "Analysis complete", `${profile.label}: ${profile.pattern}. Top future: ${selectedFuture().title}.`);
    addHistory("Analysis generated", `${profile.pattern} → ${selectedFuture().title}`);
    toast("Analysis complete");
  }
  renderAll();
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
    if (profile.pattern === "Landscape Systems" && future.id === "productive") score -= 8;
    return { ...future, score: clamp(score, 1, 99) };
  });
  return scores.sort((a, b) => b.score - a.score);
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
  visibleSiteLanguage(profile, noteSignals).slice(0, 3).forEach((line) => lines.push(line));
  const constraint = constraintProfile();
  if (state.constraint !== "unsure") lines.push(`Main problem selected: ${constraint.label}. ${constraint.nudge}`);
  if (noteSignals.includes("privacy")) lines.push("Your note points to privacy or screening as a real pressure.");
  if (noteSignals.includes("low-maintenance")) lines.push("You are asking for less friction, so repeated simple choices matter.");
  if (noteSignals.includes("maker")) lines.push("The space needs workflow and access, not just visual polish.");
  if (noteSignals.includes("water")) lines.push("Water or drainage may need checking before planting decisions.");
  if (noteSignals.includes("shade")) lines.push("Shade or overhead cover means plant choice and mulch/edge quality matter more than flower-heavy detail.");
  if (noteSignals.includes("access")) lines.push("Access language appears in the clues, so the overlay protects a clear route first.");
  if (state.postcode) lines.push(`Postcode clue: ${climate.label}.`);
  return unique(lines).slice(0, 6);
}

function renderAll() {
  renderPhotoSurfaces();
  renderStarterSuggestions();
  renderQuickStatus();
  renderInsights();
  renderFutures();
  renderRecommendation();
  renderNextSteps();
  renderReports();
  renderCompare();
  renderPlan();
  renderDesign();
  renderExport();
  renderDashboard();
  renderTesterHealth();
  renderHistory();
  renderVisionBoard();
  renderSavedProjects();
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
  setText("firstMoveBanner", state.analysisComplete ? roadmapData()[0].task : "Run the analysis and VerdeAI will choose one cheap, reversible action to test.");
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
    <div class="future-body"><p>${escapeHtml(specificWhy(future))}</p><div class="overlay-caption">Concept overlay, not a rendered redesign yet</div><div class="future-tags">${future.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("")}<span class="tag">match ${future.score || rankFutures(TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank, extractNoteSignals(state.note)).find((x) => x.id === future.id)?.score || 72}%</span></div></div>
  </article>`;
}

function overlayHtml(future) {
  const labels = tailoredLabels(future);
  return `<span class="overlay-badge">concept overlay</span><span class="overlay-zone zone-a"></span><span class="overlay-zone zone-b"></span><span class="overlay-zone zone-c"></span><span class="overlay-line"></span>
    <span class="overlay-label label-a">${escapeHtml(labels[0])}</span><span class="overlay-label label-b">${escapeHtml(labels[1])}</span><span class="overlay-label label-c">${escapeHtml(labels[2])}</span><span class="overlay-label label-d">${escapeHtml(labels[3])}</span>`;
}

function tailoredLabels(future) {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  const labels = [...future.visualLabels, "main viewing line"];
  const constraint = state.constraint;
  if (state.propertyType === "side-yard") labels[0] = "keep access clear";
  if (state.propertyType === "under-building") { labels[0] = "shade-safe low-care zone"; labels[1] = "keep column/service access"; labels[2] = "soften hard surface edge"; }
  if (state.propertyType === "foundation") labels[1] = "repeat planting masses";
  if (state.propertyType === "slope") labels[2] = "check drainage first";
  if (constraint === "shade-dark") labels[0] = "low-light planting zone";
  if (constraint === "water-risk") labels[2] = "drainage check zone";
  if (constraint === "privacy-gap" || extractNoteSignals(state.note).includes("privacy")) labels[1] = "privacy screen zone";
  if (constraint === "storage-creep") labels[2] = "contained storage edge";
  if (constraint === "access-awkward") labels[0] = "clear access route";
  if (constraint === "messy-edge") labels[1] = "repair boundary rhythm";
  if (state.preference === "minimal") labels[0] = "clean simple structure";
  if (state.designRefinements.includes("seating")) labels[0] = "test seating position";
  if (state.designRefinements.includes("lighting")) labels[3] = "evening light cue";
  if (profile.pattern === "Maker Territory") labels[2] = "tool flow line";
  return labels.slice(0, 4);
}

function specificWhy(future) {
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const bits = [future.baseWhy];
  if (state.analysisComplete) bits.push(`${profile.pattern}: ${constraintLabel(state.constraint)}.`);
  const visible = visibleSiteLanguage(profile).filter((line) => !line.startsWith("Photo is used"))[0];
  if (visible) bits.push(visible);
  if (state.note) {
    const shortened = state.note.length > 76 ? `${state.note.slice(0, 73)}…` : state.note;
    bits.push(`Note: “${shortened}”`);
  }
  return bits.join(" ");
}

function renderRecommendation() {
  const f = selectedFuture();
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
  const reasons = [];
  if (profile.pattern === "Guided First Pass") {
    reasons.push("The app is deliberately staying cautious because the photo needs human clues before a fair analysis.");
  } else {
    reasons.push(`${profile.pattern} suggests the first move should create role and structure before decoration.`);
  }
  reasons.push(`${future.title} best matches the goal: ${preferenceLabel(state.preference)}.`);
  if (state.constraint !== "unsure") reasons.push(`Main problem: ${constraintLabel(state.constraint)}. Start with: ${constraintProfile().nudge}`);
  if (visibleSiteLanguage(profile).length) reasons.push("The report now adds visible-site language from the selected clues so it feels less generic.");
  if (state.budget === "weekend") reasons.push("Keep the first move small enough for a weekend test.");
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
  if (state.constraint === "water-risk") return "Pour a bucket or hose-test a small area and watch where water collects before designing around it.";
  if (state.constraint === "privacy-gap") return "Stand where you feel exposed and mark one screen line with temporary pots, stakes, or cardboard before planting.";
  if (state.constraint === "storage-creep") return "Sort the space into keep, move, and contain piles, then mark one storage boundary that cannot expand.";
  if (state.constraint === "maintenance-drag") return "Pick the worst maintenance trap and replace it with one repeated low-care edge or mulch zone.";
  if (state.constraint === "access-awkward") return "Walk the route with tools or a wheelbarrow and mark the path that must stay clear.";
  if (state.constraint === "shade-dark") return "Check where the shade is strongest, then mark one low-light planting or mulch zone that will not block access.";
  if (profile.pattern === "Guided First Pass") return "Choose one starter clue that matches the photo before trusting the result.";
  if (profile.pattern === "Landscape Systems") return "Check water movement, drainage, base stability, and soil erosion before adding plants.";
  if (profile.pattern === "Maker Territory") return "Clear one permanent work rectangle and protect access so it cannot become storage again.";
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
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES["needs-review"];
  const f = selectedFuture();
  const signals = extractNoteSignals(state.note);
  const dnaLines = Object.entries(state.dna || {}).slice(0, options.full ? 9 : 5).map(([key, value]) => `- ${titleCase(key)}: ${value}/100`).join("\n");
  const noticed = (state.noticed.length ? state.noticed : buildNoticed(profile, signals, state.climate || {})).map((line) => `- ${line}`).join("\n");
  const visibleLanguage = visibleSiteLanguage(profile, signals).map((line) => `- ${line}`).join("\n");
  const steps = roadmapData().map((step) => `- ${step.when}: ${step.task}`).join("\n");
  return `VERDEAI PROPERTY REPORT — v${state.version}

Property situation:
${profile.label}

Primary pattern:
${profile.pattern}

Secondary pattern:
${profile.secondary}

Main problem:
${constraintLabel(state.constraint)} — ${constraintProfile().problem}

Selected future:
${f.icon} ${f.title} — ${f.subtitle}

Best first move:
${roadmapData()[0].task}

Why this direction:
${recommendationWhy(f, profile)}

Visible-site language:
${visibleLanguage || "- Add a starter clue or property note to make this section more specific."}

Why it feels specific:
${specificityReasons(f, profile).map((line) => `- ${line}`).join("\n")}

What VerdeAI noticed:
${noticed}

Warning:
${profile.warning}

Property DNA:
${dnaLines || "- Run analysis to generate Property DNA."}

Overlay ideas:
- ${tailoredLabels(f).join("\n- ")}

First actions:
${steps}

Climate clue:
${state.climate?.label || "No postcode supplied"}
${state.climate?.notes?.map((n) => `- ${n}`).join("\n") || "- Add a postcode for a basic climate clue."}

Tester note:
${$("feedbackNotes")?.value || "No tester note yet."}${options.full ? `

Design refinements:
${state.designRefinements.length ? state.designRefinements.map(labelForRefinement).join(", ") : "Balanced / none selected"}

Generated:
${state.lastRunAt || new Date().toISOString()}

Important limitation:
This v2.4 build uses the uploaded photo for overlays, but site interpretation is still clue-guided rule logic. Real AI vision/rendering is scaffolded but not connected yet.` : ""}`;
}

function renderCompare() {
  const original = $("compareOriginal");
  const future = $("compareFuture");
  const f = selectedFuture();
  const bg = state.photoDataUrl ? `url('${state.photoDataUrl}')` : demoGradient();
  [original, future].forEach((el) => {
    if (!el) return;
    el.style.backgroundImage = bg;
    el.classList.toggle("no-photo", !state.photoDataUrl && !state.demoMode);
  });
  if (future) {
    future.style.setProperty("--overlay-tint", f.tint);
    future.className = `compare-image future-overlay-preview ${overlayStyleClass(f)}${!state.photoDataUrl && !state.demoMode ? " no-photo" : ""}`;
    future.innerHTML = overlayHtml(f);
  }
  $("overlayLegend").innerHTML = tailoredLabels(f).map((label) => `<span>${escapeHtml(label)}</span>`).join("");
  if (original) original.innerHTML = "";
  $("scorecard").innerHTML = scorecardHtml(f);
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

function renderExport() {
  setText("testerSummary", testerSummaryText());
  const checks = [
    ["✅", "Upload flow", state.photoDataUrl || state.demoMode ? "Photo/demo loaded." : "Ready; needs tester photo."],
    ["✅", "Six futures", "Clickable cards with overlay labels."],
    ["✅", "Property-specific text", "Uses situation, goal, note, postcode, budget, and maintenance."],
    ["✅", "Report/export", "Copy, print, JSON export, local save."],
    ["⚠️", "Real AI renders", "Not connected; overlay prototype only."],
    ["⚠️", "Cloud accounts", "Not connected; local browser storage only."]
  ];
  $("alphaReadiness").innerHTML = checks.map(([icon, title, text]) => `<div class="readiness-item"><span>${icon}</span> <b>${escapeHtml(title)}</b><br><small>${escapeHtml(text)}</small></div>`).join("");
}

function testerSummaryText() {
  const f = selectedFuture();
  const profile = TYPE_PROFILES[state.propertyType] || TYPE_PROFILES.blank;
  return `VERDEAI v2.4 TEST SUMMARY

Selected future: ${f.icon} ${f.title}
Property pattern: ${profile.pattern}
Preferred direction: ${preferenceLabel(state.preference)}
Main problem: ${constraintLabel(state.constraint)}
Postcode/climate clue: ${state.climate?.label || "not supplied"}
Usefulness score: ${$("feedbackScore")?.value || "not selected"}

What VerdeAI suggested:
${recommendationWhy(f, profile)}

First action:
${roadmapData()[0].task}

Tester note:
${$("feedbackNotes")?.value || "-"}`;
}

function renderDashboard() {
  const cards = [
    ["Current version", "v2.4 Workshop Build"],
    ["Primary module", state.analysisComplete ? TYPE_PROFILES[state.propertyType].pattern : "Awaiting analysis"],
    ["Selected future", selectedFuture().title],
    ["Main problem", constraintLabel(state.constraint)],
    ["Storage", "Local browser save"],
    ["AI status", "Mock backend + frontend overlay engine"],
    ["Release readiness", state.analysisComplete ? "Ready for manual tester pass" : "Needs one analysis run"]
  ];
  $("dashboardCards").innerHTML = cards.map(([title, text]) => `<article class="dashboard-card"><b>${escapeHtml(title)}</b><small>${escapeHtml(text)}</small></article>`).join("");
}

function renderTesterHealth() {
  const items = [
    [state.photoDataUrl || state.demoMode ? "✅" : "⬜", "Photo or demo loaded"],
    [state.constraint !== "unsure" ? "✅" : "⬜", "Main problem selected"],
    [state.analysisComplete ? "✅" : "⬜", "Analysis run"],
    [state.selectedFutureId ? "✅" : "⬜", "Future selected"],
    [$("feedbackNotes")?.value ? "✅" : "⬜", "Tester note added"],
    ["⚠️", "Real AI rendering not connected yet"]
  ];
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
  const f = selectedFuture();
  const cards = [
    [f.title, f.subtitle],
    ["Overlay labels", tailoredLabels(f).join(" • ")],
    ["Prompt direction", state.designRefinements.length ? state.designRefinements.map(labelForRefinement).join(", ") : "Balanced, practical, staged"],
    ["First experiment", roadmapData()[0].task]
  ];
  $("visionBoard").innerHTML = cards.map(([title, text]) => `<article class="vision-card"><b>${escapeHtml(title)}</b><small>${escapeHtml(text)}</small></article>`).join("");
}

function renderSavedProjects() {
  const items = getSavedProjects();
  const container = $("savedProjects");
  if (!container) return;
  if (!items.length) {
    container.innerHTML = "<p>No saved projects yet.</p>";
    return;
  }
  container.innerHTML = items.map((item, index) => `<article class="saved-card"><b>${escapeHtml(item.title)}</b><small>${escapeHtml(new Date(item.savedAt).toLocaleString())}</small><p>${escapeHtml(item.summary)}</p><div class="button-row"><button type="button" class="secondary" data-load="${index}">Load</button><button type="button" class="secondary" data-delete="${index}">Delete</button></div></article>`).join("");
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
  state.version = "2.4";
  setFormFromState();
  if (state.photoDataUrl) {
    $("photoPreview").src = state.photoDataUrl;
    $("uploadDrop")?.classList.add("has-image");
  } else {
    $("uploadDrop")?.classList.remove("has-image");
  }
  toast("Project loaded");
  renderAll();
}

function deleteSavedProject(index) {
  const items = getSavedProjects();
  items.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  toast("Saved project deleted");
  renderSavedProjects();
}

function clearSavedProjects() {
  [STORAGE_KEY, ...LEGACY_STORAGE_KEYS].forEach((key) => localStorage.removeItem(key));
  toast("Saved projects cleared");
  renderSavedProjects();
}

function saveFeedback() {
  if (!state.analysisComplete) runAnalysis({ quiet: true });
  const items = getFeedback();
  items.unshift({
    at: new Date().toISOString(),
    score: $("feedbackScore")?.value || "",
    notes: $("feedbackNotes")?.value || "",
    future: selectedFuture().title,
    propertyType: TYPE_PROFILES[state.propertyType]?.label || state.propertyType,
    preference: preferenceLabel(state.preference),
    constraint: constraintLabel(state.constraint)
  });
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(items.slice(0, 100)));
  addHistory("Feedback saved", `${selectedFuture().title}: ${$("feedbackScore")?.value || "no score"}`);
  toast("Feedback saved locally");
  renderAll();
}

function getFeedback() {
  return readStoredArray(FEEDBACK_KEY, LEGACY_FEEDBACK_KEYS);
}

function exportFeedbackCsv() {
  const items = getFeedback();
  const header = ["at", "score", "future", "propertyType", "preference", "constraint", "notes"];
  const rows = [header.join(","), ...items.map((item) => header.map((key) => csvCell(item[key] || "")).join(","))];
  downloadText("verdeai-v2-4-feedback.csv", rows.join("\n"), "text/csv");
}

function resetProject() {
  const keepHistory = state.history;
  Object.assign(state, {
    photoDataUrl: "", photoName: "", demoMode: false, propertyType: "needs-review", preference: "balanced", postcode: "", budget: "weekend", maintenance: "low", constraint: "unsure", note: "", analysisComplete: false, selectedFutureId: "belonging", designRefinements: [], intensity: 3, dna: {}, noticed: [], climate: {}, lastRunAt: null, starterCue: "", history: keepHistory
  });
  setFormFromState();
  $$(".design-toggle").forEach((input) => { input.checked = false; });
  if ($("photoInput")) $("photoInput").value = "";
  if ($("photoPreview")) $("photoPreview").removeAttribute("src");
  $("uploadDrop")?.classList.remove("has-image");
  setProgress(0, "Ready", "Upload a photo or use demo mode to begin.");
  addHistory("Project reset", "Started fresh local session");
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
  if (!state.note || state.note.startsWith("Photo clue:")) state.note = preset.note;
  setFormFromState();
  setProgress(45, "Starter clue applied", `${preset.label}. Review the dropdowns, then analyse.`);
  addHistory("Starter clue applied", preset.label);
  toast("Starter clue applied");
  renderAll();
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

function renderQuickStatus() {
  const hasPhoto = Boolean(state.photoDataUrl || state.demoMode);
  const hasSituation = state.propertyType !== "needs-review";
  const hasProblem = state.constraint !== "unsure";
  const situation = TYPE_PROFILES[state.propertyType]?.label || "Situation selected";
  setText("quickStartStatus", state.analysisComplete
    ? `Result ready: ${selectedFuture().title}. Review the overlay, then check the first move.`
    : hasPhoto
      ? `${clueCoachMessage()}`
      : "Upload a photo or use demo mode, then press Analyse Property. The first useful result should appear without needing instructions.");
  setText("stepPhoto", `${hasPhoto ? "✅" : "⬜"} Photo`);
  setText("stepSituation", `${hasSituation ? "✅" : "⬜"} Situation`);
  setText("stepProblem", `${hasProblem ? "✅" : "⬜"} Main problem`);
  setText("stepAnalysis", `${state.analysisComplete ? "✅" : "⬜"} Analysis`);
  setText("photoReadiness", hasPhoto
    ? `${state.demoMode ? "Demo image" : state.photoName || "Uploaded image"} loaded. Overlays will use the image as the base; analysis is clue-guided until real vision is connected.`
    : "No image loaded yet. Demo mode is available for a quick test.");
  setText("clueCoachText", clueCoachMessage());
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
  return `${profile.pattern} + ${constraintLabel(state.constraint)} → ${selectedFuture().title}. Confidence ${specificityScore()}%.`;
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
  visibleSiteLanguage(profile).filter((line) => !line.startsWith("Photo is used")).slice(0, 2).forEach((line) => reasons.push(line));
  if (state.note) reasons.push(`Property note: ${state.note.slice(0, 95)}${state.note.length > 95 ? "…" : ""}`);
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
}

function loadHistory() {
  state.history = readStoredArray(HISTORY_KEY, LEGACY_HISTORY_KEYS);
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

function downloadProjectJson() {
  const data = { ...serialiseState(), report: reportText({ full: true }), testerSummary: testerSummaryText(), exportedAt: new Date().toISOString() };
  downloadText("verdeai-v2-4-project.json", JSON.stringify(data, null, 2), "application/json");
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
function demoBackgroundStyle() { return `background-image:${demoGradient()}`; }

init();
