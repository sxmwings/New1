// Hybrid Master 51 — app.js (vanilla JS)
// Uses Chart.js (loaded via CDN in index.html)

// --- Data (program) ---
const PROGRAM = {
  weeks: 26,
  deloads: [6,12,18,24,26],
  sessions: {
    dimanche: {
      name: "DOS + JAMBES LOURDES + BRAS",
      duration: 68,
      exercises: [
        { id:1, name:"Trap Bar Deadlift", sets:5, reps:"6-8", rest:120, startWeight:75, progression:5, progressionWeeks:3, type:"compound" },
        { id:2, name:"Goblet Squat", sets:4, reps:"10", rest:75, startWeight:25, progression:2.5, progressionWeeks:2, type:"compound" },
        { id:3, name:"Leg Press", sets:4, reps:"10", rest:75, startWeight:110, progression:10, progressionWeeks:2, type:"compound" },
        { id:4, name:"Lat Pulldown (prise large)", sets:4, reps:"10", rest:90, startWeight:60, progression:2.5, progressionWeeks:2, type:"superset", supersetWith:5 },
        { id:5, name:"Landmine Press", sets:4, reps:"10", rest:90, startWeight:35, progression:2.5, progressionWeeks:2, type:"superset" },
        { id:6, name:"Rowing Machine (prise large)", sets:4, reps:"10", rest:75, startWeight:50, progression:2.5, progressionWeeks:2, type:"compound" },
        { id:7, name:"Spider/Incline Curl", sets:4, reps:"12", rest:75, startWeight:12, progression:2.5, progressionWeeks:3, type:"superset", supersetWith:8 },
        { id:8, name:"Cable Pushdown", sets:3, reps:"12", rest:75, startWeight:20, progression:2.5, progressionWeeks:3, type:"superset" }
      ]
    },
    mardi: {
      name: "PECS + ÉPAULES + TRICEPS",
      duration: 70,
      exercises: [
        { id:9, name:"Dumbbell Press", sets:5, reps:"10", rest:105, startWeight:22, progression:2.5, progressionWeeks:3, type:"compound" },
        { id:10, name:"Cable Fly (poulies moyennes)", sets:4, reps:"12", rest:60, startWeight:10, progression:2.5, progressionWeeks:3, type:"isolation" },
        { id:11, name:"Leg Press léger", sets:3, reps:"15", rest:60, startWeight:80, progression:10, progressionWeeks:3, type:"compound" },
        { id:12, name:"Extension Triceps Corde", sets:5, reps:"12", rest:75, startWeight:20, progression:2.5, progressionWeeks:3, type:"superset", supersetWith:13 },
        { id:13, name:"Lateral Raises", sets:5, reps:"15", rest:75, startWeight:8, progression:2.5, progressionWeeks:4, type:"superset" },
        { id:14, name:"Face Pull", sets:5, reps:"15", rest:60, startWeight:20, progression:2.5, progressionWeeks:3, type:"isolation" },
        { id:15, name:"Rowing Machine (prise serrée)", sets:4, reps:"12", rest:75, startWeight:50, progression:2.5, progressionWeeks:2, type:"compound" },
        { id:16, name:"Overhead Extension", sets:4, reps:"12", rest:60, startWeight:15, progression:2.5, progressionWeeks:3, type:"isolation" }
      ]
    },
    vendredi: {
      name: "DOS + JAMBES LÉGÈRES + BRAS + ÉPAULES",
      duration: 73,
      exercises: [
        { id:17, name:"Landmine Row", sets:5, reps:"10", rest:105, startWeight:55, progression:2.5, progressionWeeks:2, type:"compound" },
        { id:18, name:"Leg Curl", sets:5, reps:"12", rest:75, startWeight:40, progression:5, progressionWeeks:3, type:"superset", supersetWith:19 },
        { id:19, name:"Leg Extension", sets:4, reps:"15", rest:75, startWeight:35, progression:5, progressionWeeks:3, type:"superset" },
        { id:20, name:"Cable Fly", sets:4, reps:"15", rest:60, startWeight:10, progression:2.5, progressionWeeks:3, type:"superset", supersetWith:21 },
        { id:21, name:"Dumbbell Fly", sets:4, reps:"12", rest:60, startWeight:10, progression:2.5, progressionWeeks:3, type:"superset" },
        { id:22, name:"EZ Bar Curl", sets:5, reps:"12", rest:75, startWeight:25, progression:2.5, progressionWeeks:3, type:"superset", supersetWith:23 },
        { id:23, name:"Overhead Extension", sets:3, reps:"12", rest:75, startWeight:15, progression:2.5, progressionWeeks:3, type:"superset" },
        { id:24, name:"Lateral Raises", sets:3, reps:"15", rest:60, startWeight:8, progression:2.5, progressionWeeks:4, type:"isolation" },
        { id:25, name:"Wrist Curl", sets:3, reps:"20", rest:45, startWeight:30, progression:2.5, progressionWeeks:4, type:"isolation" }
      ]
    }
  },
  blocks: {
    1:{ weeks:[1,2,3,4,5], name:"FONDATION TECHNIQUE", rpe:"6-7", tempo:"3-1-2", techniques:"Pauses stratégiques" },
    2:{ weeks:[7,8,9,10,11], name:"SURCHARGE PROGRESSIVE", rpe:"7-8", tempo:"2-1-2", techniques:"Rest-Pause" },
    3:{ weeks:[13,14,15,16,17], name:"SURCOMPENSATION", rpe:"8", tempo:"2-1-2", techniques:"Drop-sets + Myo-reps" },
    4:{ weeks:[19,20,21,22,23,25], name:"INTENSIFICATION MAX", rpe:"8-9", tempo:"2-1-2", techniques:"Clusters + Myo-reps + Partials" }
  }
};

// --- App state ---
let currentWeek = 1;
let activeTab = 'workout';
let activeSession = null;
let workoutData = {};
let completedSets = {};
let timer = 0;
let timerInterval = null;
let timerRunning = false;
let currentExerciseIndex = 0;

// --- Helpers ---
function getCurrentBlock(){
  for(const [num, block] of Object.entries(PROGRAM.blocks)){
    if(block.weeks.includes(currentWeek)) return { num: Number(num), ...block };
  }
  return { num:1, ...PROGRAM.blocks[1] };
}
function isDeloadWeek(){ return PROGRAM.deloads.includes(currentWeek); }
function formatTime(s){ const m=Math.floor(s/60); const sec=s%60; return `${m}:${String(sec).padStart(2,'0')}`; }
function calculateWeight(ex){
  const weeksPassed = currentWeek - 1;
  const cycles = Math.floor(weeksPassed / ex.progressionWeeks);
  let w = ex.startWeight + (cycles * ex.progression);
  if(isDeloadWeek()) w = Math.round(w * 0.6 * 10) / 10;
  return w;
}

// --- Persistence ---
async function saveAll(){
  try{
    localStorage.setItem('hm_workoutData', JSON.stringify(workoutData));
    localStorage.setItem('hm_currentWeek', String(currentWeek));
    localStorage.setItem('hm_completedSets', JSON.stringify(completedSets));
    const now = new Date().toISOString();
    localStorage.setItem('hm_lastSaved', now);
    const el = document.getElementById('last-saved');
    if(el) el.textContent = 'Dernière sauvegarde : ' + new Date(now).toLocaleString();
  }catch(e){ console.warn('save fail', e); }
}
async function loadAll(){
  try{
    const sd = localStorage.getItem('hm_workoutData');
    const sw = localStorage.getItem('hm_currentWeek');
    const ss = localStorage.getItem('hm_completedSets');
    const ls = localStorage.getItem('hm_lastSaved');
    if(sd) workoutData = JSON.parse(sd);
    if(sw) currentWeek = parseInt(sw,10);
    if(ss) completedSets = JSON.parse(ss);
    if(ls){
      const el = document.getElementById('last-saved');
      if(el) el.textContent = 'Dernière sauvegarde : ' + new Date(ls).toLocaleString();
    }
  }catch(e){ console.warn('load fail', e); }
}

// --- Rendering ---
const contentEl = () => document.getElementById('content');
const navEl = () => document.getElementById('nav');
const bottomEl = () => document.getElementById('bottom');

function renderHeader(){
  const b = getCurrentBlock();
  const hs = document.getElementById('header-sub');
  if(hs) hs.textContent = `Semaine ${currentWeek}/26 • Bloc ${b.num} - ${b.name}`;
  const dp = document.getElementById('deload-pill');
  if(dp){
    if(isDeloadWeek()){ dp.textContent = '🔄 DELOAD'; dp.style.background = '#ff6b35'; }
    else { dp.textContent = `🎯 RPE ${b.rpe}`; dp.style.background = 'linear-gradient(90deg,var(--accent1),var(--accent2))'; }
  }
}

def write_files(): pass
