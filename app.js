// ==========================
// Hybrid Master 51 — app.js
// ==========================

// --- Données principales du programme ---
const PROGRAM = {
  weeks: 26,
  deloads: [6, 12, 18, 24, 26],
  sessions: {
    dimanche: {
      name: "DOS + JAMBES LOURDES + BRAS",
      duration: 68,
      exercises: [
        { id: 1, name: "Trap Bar Deadlift", sets: 5, reps: "6-8", rest: 120, startWeight: 75, progression: 5, progressionWeeks: 3 },
        { id: 2, name: "Goblet Squat", sets: 4, reps: "10", rest: 75, startWeight: 25, progression: 2.5, progressionWeeks: 2 },
        { id: 3, name: "Leg Press", sets: 4, reps: "10", rest: 75, startWeight: 110, progression: 10, progressionWeeks: 2 },
        { id: 4, name: "Lat Pulldown (prise large)", sets: 4, reps: "10", rest: 90, startWeight: 60, progression: 2.5, progressionWeeks: 2 },
        { id: 5, name: "Landmine Press", sets: 4, reps: "10", rest: 90, startWeight: 35, progression: 2.5, progressionWeeks: 2 },
        { id: 6, name: "Rowing Machine (prise large)", sets: 4, reps: "10", rest: 75, startWeight: 50, progression: 2.5, progressionWeeks: 2 },
        { id: 7, name: "Spider/Incline Curl", sets: 4, reps: "12", rest: 75, startWeight: 12, progression: 2.5, progressionWeeks: 3 },
        { id: 8, name: "Cable Pushdown", sets: 3, reps: "12", rest: 75, startWeight: 20, progression: 2.5, progressionWeeks: 3 }
      ]
    },
    mardi: {
      name: "PECS + ÉPAULES + TRICEPS",
      duration: 70,
      exercises: [
        { id: 9, name: "Dumbbell Press", sets: 5, reps: "10", rest: 105, startWeight: 22, progression: 2.5, progressionWeeks: 3 },
        { id: 10, name: "Cable Fly (poulies moyennes)", sets: 4, reps: "12", rest: 60, startWeight: 10, progression: 2.5, progressionWeeks: 3 },
        { id: 11, name: "Leg Press léger", sets: 3, reps: "15", rest: 60, startWeight: 80, progression: 10, progressionWeeks: 3 },
        { id: 12, name: "Extension Triceps Corde", sets: 5, reps: "12", rest: 75, startWeight: 20, progression: 2.5, progressionWeeks: 3 },
        { id: 13, name: "Lateral Raises", sets: 5, reps: "15", rest: 75, startWeight: 8, progression: 2.5, progressionWeeks: 4 },
        { id: 14, name: "Face Pull", sets: 5, reps: "15", rest: 60, startWeight: 20, progression: 2.5, progressionWeeks: 3 },
        { id: 15, name: "Rowing Machine (prise serrée)", sets: 4, reps: "12", rest: 75, startWeight: 50, progression: 2.5, progressionWeeks: 2 },
        { id: 16, name: "Overhead Extension", sets: 4, reps: "12", rest: 60, startWeight: 15, progression: 2.5, progressionWeeks: 3 }
      ]
    },
    vendredi: {
      name: "DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES",
      duration: 73,
      exercises: [
        { id: 17, name: "Landmine Row", sets: 5, reps: "10", rest: 105, startWeight: 55, progression: 2.5, progressionWeeks: 2 },
        { id: 18, name: "Leg Curl", sets: 5, reps: "12", rest: 75, startWeight: 40, progression: 5, progressionWeeks: 3 },
        { id: 19, name: "Leg Extension", sets: 4, reps: "15", rest: 75, startWeight: 35, progression: 5, progressionWeeks: 3 },
        { id: 20, name: "Cable Fly", sets: 4, reps: "15", rest: 60, startWeight: 10, progression: 2.5, progressionWeeks: 3 },
        { id: 21, name: "Dumbbell Fly", sets: 4, reps: "12", rest: 60, startWeight: 10, progression: 2.5, progressionWeeks: 3 },
        { id: 22, name: "EZ Bar Curl", sets: 5, reps: "12", rest: 75, startWeight: 25, progression: 2.5, progressionWeeks: 3 },
        { id: 23, name: "Overhead Extension", sets: 3, reps: "12", rest: 75, startWeight: 15, progression: 2.5, progressionWeeks: 3 },
        { id: 24, name: "Lateral Raises", sets: 3, reps: "15", rest: 60, startWeight: 8, progression: 2.5, progressionWeeks: 4 },
        { id: 25, name: "Wrist Curl", sets: 3, reps: "20", rest: 45, startWeight: 30, progression: 2.5, progressionWeeks: 4 }
      ]
    }
  },
  blocks: {
    1: { weeks: [1, 2, 3, 4, 5], name: "FONDATION TECHNIQUE", rpe: "6-7", tempo: "3-1-2", techniques: "Pauses stratégiques" },
    2: { weeks: [7, 8, 9, 10, 11], name: "SURCHARGE PROGRESSIVE", rpe: "7-8", tempo: "2-1-2", techniques: "Rest-Pause" },
    3: { weeks: [13, 14, 15, 16, 17], name: "SURCOMPENSATION", rpe: "8", tempo: "2-1-2", techniques: "Drop-sets + Myo-reps" },
    4: { weeks: [19, 20, 21, 22, 23, 25], name: "INTENSIFICATION MAX", rpe: "8-9", tempo: "2-1-2", techniques: "Clusters + Myo-reps + Partials" }
  }
};

// --- Variables globales ---
let currentWeek = 1;
let activeTab = "workout";
let workoutData = {};
let completedSets = {};
let timerInterval = null;

// --- Fonctions utilitaires ---
function getCurrentBlock() {
  for (const [n, block] of Object.entries(PROGRAM.blocks)) {
    if (block.weeks.includes(currentWeek)) return { num: Number(n), ...block };
  }
  return { num: 1, ...PROGRAM.blocks[1] };
}
function isDeloadWeek() {
  return PROGRAM.deloads.includes(currentWeek);
}
function calculateWeight(ex) {
  const cycles = Math.floor((currentWeek - 1) / ex.progressionWeeks);
  let w = ex.startWeight + cycles * ex.progression;
  if (isDeloadWeek()) w = Math.round(w * 0.6 * 10) / 10;
  return w;
}
function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

// --- Sauvegarde & restauration ---
function saveData() {
  const payload = { week: currentWeek, completedSets, workoutData };
  localStorage.setItem("hybridMaster51", JSON.stringify(payload));
  localStorage.setItem("lastSaved", new Date().toISOString());
  const el = document.getElementById("last-saved");
  if (el)
    el.textContent =
      "Dernière sauvegarde : " +
      new Date().toLocaleString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}
function loadData() {
  try {
    const data = localStorage.getItem("hybridMaster51");
    if (data) {
      const parsed = JSON.parse(data);
      currentWeek = parsed.week || 1;
      completedSets = parsed.completedSets || {};
      workoutData = parsed.workoutData || {};
    }
    const ls = localStorage.getItem("lastSaved");
    if (ls) {
      const el = document.getElementById("last-saved");
      if (el)
        el.textContent =
          "Dernière sauvegarde : " +
          new Date(ls).toLocaleString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          });
    }
  } catch (err) {
    console.warn("Erreur chargement données", err);
  }
}

// --- Navigation semaine ---
function nextWeek() {
  if (currentWeek < PROGRAM.weeks) {
    currentWeek++;
    renderAll();
    saveData();
  }
}
function prevWeek() {
  if (currentWeek > 1) {
    currentWeek--;
    renderAll();
    saveData();
  }
}

// --- Initialisation ---
window.addEventListener("load", () => {
  loadData();
  renderAll();
});
// --- Rendu principal ---
function renderAll() {
  renderHeader();
  if (activeTab === "workout") renderWorkouts();
  if (activeTab === "stats") renderStats();
  if (activeTab === "progress") renderProgression();
  highlightTabs();
}

// --- En-tête dynamique ---
function renderHeader() {
  const block = getCurrentBlock();
  const head = document.getElementById("header-sub");
  if (head)
    head.textContent = `Semaine ${currentWeek}/26 • Bloc ${block.num} - ${block.name}`;
  const pill = document.getElementById("deload-pill");
  if (pill) {
    if (isDeloadWeek()) {
      pill.textContent = "🔄 DELOAD";
      pill.style.background = "#ff6b35";
    } else {
      pill.textContent = `🎯 RPE ${block.rpe}`;
      pill.style.background =
        "linear-gradient(90deg,var(--accent1),var(--accent2))";
    }
  }
}

// --- Séances ---
function renderWorkouts() {
  const main = document.getElementById("content");
  main.innerHTML = "";
  const block = getCurrentBlock();

  const top = document.createElement("div");
  top.className = "week-controls";
  top.innerHTML = `
    <button class="wk-btn" id="prevW">◀</button>
    <div>Semaine ${currentWeek}</div>
    <button class="wk-btn" id="nextW">▶</button>
  `;
  main.appendChild(top);

  for (const [day, session] of Object.entries(PROGRAM.sessions)) {
    const card = document.createElement("div");
    card.className = "card session-card";
    card.innerHTML = `
      <h3>${day.toUpperCase()} — ${session.name}</h3>
      <p class="small-pill">${session.exercises.length} exos • ${session.duration} min</p>
    `;
    card.onclick = () => renderSession(day);
    main.appendChild(card);
  }

  document.getElementById("prevW").onclick = prevWeek;
  document.getElementById("nextW").onclick = nextWeek;
}

// --- Détails séance ---
function renderSession(day) {
  const main = document.getElementById("content");
  main.innerHTML = "";
  const s = PROGRAM.sessions[day];

  const back = document.createElement("button");
  back.className = "wk-btn";
  back.textContent = "← Retour";
  back.onclick = renderWorkouts;
  main.appendChild(back);

  const title = document.createElement("h2");
  title.textContent = `${day.toUpperCase()} — ${s.name}`;
  main.appendChild(title);

  s.exercises.forEach((ex) => {
    const exDiv = document.createElement("div");
    exDiv.className = "ex-card";
    const w = calculateWeight(ex);
    exDiv.innerHTML = `<strong>${ex.name}</strong><br><small>${ex.sets}x${ex.reps} — ${w} kg</small>`;

    for (let i = 1; i <= ex.sets; i++) {
      const b = document.createElement("button");
      b.className = "set-btn";
      const key = `${day}-${ex.id}-${i}-w${currentWeek}`;
      if (completedSets[key]) b.classList.add("completed");
      b.textContent = `Série ${i}`;
      b.onclick = () => {
        completedSets[key] = !completedSets[key];
        b.classList.toggle("completed");
        saveData();
      };
      exDiv.appendChild(b);
    }
    main.appendChild(exDiv);
  });
}

// --- Statistiques globales ---
function renderStats() {
  const main = document.getElementById("content");
  main.innerHTML = "<h2>📊 Statistiques</h2>";

  const totalSessions = Object.keys(PROGRAM.sessions).length * currentWeek;
  const totalSets = Object.values(PROGRAM.sessions)
    .flatMap((s) => s.exercises)
    .reduce((a, b) => a + b.sets, 0);
  const totalCompleted = Object.keys(completedSets).length;

  const grid = document.createElement("div");
  grid.className = "stats-grid";
  grid.innerHTML = `
    <div class="card"><h3>${totalCompleted}</h3><p>Séries complétées</p></div>
    <div class="card"><h3>${totalSessions}</h3><p>Séances possibles</p></div>
    <div class="card"><h3>${totalSets}</h3><p>Séries / semaine</p></div>
  `;
  main.appendChild(grid);

  const note = document.createElement("p");
  note.className = "note";
  note.textContent =
    "Ces statistiques sont basées sur vos séries validées. Elles se mettent à jour automatiquement.";
  main.appendChild(note);
}

// --- Progression (Chart.js) ---
function renderProgression() {
  const main = document.getElementById("content");
  main.innerHTML = "<h2>📈 Progression des charges</h2>";
  const canvas = document.createElement("canvas");
  canvas.id = "chart";
  main.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const labels = Array.from({ length: PROGRAM.weeks }, (_, i) => i + 1);
  const data = labels.map((w) => (PROGRAM.deloads.includes(w) ? 60 : 100));

  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Progression relative (%)",
          data,
          borderColor: "#667eea",
          backgroundColor: "rgba(102,126,234,0.3)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: {
      scales: {
        y: { beginAtZero: true, max: 120 },
      },
      plugins: {
        legend: { labels: { color: "#fff" } },
      },
    },
  });
}

// --- Navigation et onglets ---
document.querySelectorAll(".tab-btn, .icon-label").forEach((el) => {
  el.addEventListener("click", () => {
    activeTab = el.dataset.tab;
    renderAll();
  });
});
function highlightTabs() {
  document
    .querySelectorAll(".tab-btn, .icon-label")
    .forEach((el) => el.classList.toggle("active", el.dataset.tab === activeTab));
}

// --- Reset complet ---
function resetProgression() {
  if (confirm("Réinitialiser toutes les données ?")) {
    localStorage.clear();
    currentWeek = 1;
    completedSets = {};
    workoutData = {};
    renderAll();
  }
}

// --- Exécution initiale ---
window.addEventListener("load", () => {
  loadData();
  renderAll();
});
