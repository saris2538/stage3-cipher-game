// ================== AUTOSAVE CODE, CAN BE REUSED IN OTHER PROJECTS ==================
const STORAGE_KEY = "cipher_autosave_v1";

function getAutosaveElements() {
  return Array.from(document.querySelectorAll("[data-autosave='1']"));
}

function saveState() {
  const state = {};
  for (const el of getAutosaveElements()) {
    const key = el.id || el.name;
    if (!key) continue;

    if (el.type === "checkbox") state[key] = el.checked;
    else state[key] = el.value;
  }
  // Save unsure flags
  const unsureFlags = [];
  document.querySelectorAll('.unsure-toggle.active').forEach(btn => {
    unsureFlags.push(btn.getAttribute('data-letter'));
  });
  if (unsureFlags.length > 0) state['__unsure_flags__'] = unsureFlags;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function applyState(state) {
  for (const el of getAutosaveElements()) {
    const key = el.id || el.name;
    if (!key || !(key in state)) continue;

    if (el.type === "checkbox") el.checked = !!state[key];
    else el.value = state[key];
  }
  // Restore unsure flags
  if (state['__unsure_flags__'] && Array.isArray(state['__unsure_flags__'])) {
    state['__unsure_flags__'].forEach(letter => {
      const btn = document.querySelector(`.unsure-toggle[data-letter="${letter}"]`);
      if (btn) btn.classList.add('active');
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try { applyState(JSON.parse(raw)); } catch {}
  }

  for (const el of getAutosaveElements()) {
    el.addEventListener("input", saveState);
    el.addEventListener("change", saveState);
  }
  renderAll();
});
// ================== END OF AUTOSAVE CODE ==================

// ================== Modal elements and functions for restore autosave state ==================
let restoreBackdrop, confirmRestoreBtn, discardRestoreBtn;

function openRestoreModal(){
  restoreBackdrop.classList.add("show");
  restoreBackdrop.setAttribute("aria-hidden","false");
}
function closeRestoreModal(){
  restoreBackdrop.classList.remove("show");
  restoreBackdrop.setAttribute("aria-hidden","true");
}

function loadSavedState(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

function clearSavedState(){
  localStorage.removeItem(STORAGE_KEY);
}

// ใช้เช็คว่า state มีค่าอะไรจริง ๆ ไม่ใช่ object ว่าง
function hasAnyValue(state){
  if (!state || typeof state !== "object") return false;
  return Object.values(state).some(v => v !== "" && v !== null && v !== false);
}

/* 
  IMPORTANT:
  คุณต้องมีฟังก์ชันนี้ในโปรเจคอยู่แล้ว:
  function applyState(state) { ... } 
  เพื่อเอา state ไปใส่กลับ inputs
*/

document.addEventListener("DOMContentLoaded", () => {
  // Query modal elements here so the DOM is fully parsed
  restoreBackdrop  = document.getElementById("restoreBackdrop");
  confirmRestoreBtn = document.getElementById("confirmRestoreBtn");
  discardRestoreBtn = document.getElementById("discardRestoreBtn");

  const saved = loadSavedState();

  if (saved && hasAnyValue(saved)) {
    openRestoreModal();

    confirmRestoreBtn.onclick = () => {
      applyState(saved);      // << restore inputs
      closeRestoreModal();
      renderAll();
    };

    discardRestoreBtn.onclick = () => {
      clearSavedState();      // << delete saved
      closeRestoreModal();
    };
  }
});
// ================== END OF Modal and restore autosave state code ==================

const puzzle_text = "Hkgptez ztkdofqztr: zit lxw-stcts hgkzqs ol q yqosxkt. Zit sgeqs yqwkoe ol zgg lzqwst. Zit tftkun gxzhxz tbettrl egfzqofdtfz. Vt iqct vqlztr dgfzil of ziol wqltdtfz. Vt qkt qwqfrgfofu zit dqofztfqfet ltezgk oddtroqztsn. Zit ixw ol fgv egsr. Vt ltta zit ftv ygeqs hgofz vitkt zit ctos ol ziofftk. Rqzq lxuutlzl zit lgxket ol fgz ofrxlzkoqs, wxz ktlortfzoqs. Hqea zit tjxohdtfz. Vt dgct zg zit hkodqkn ktlortfet."
const keymap = 'kxvmcnophqrszyijadlegwbuft'; // substitution key
const keycode = 'Gf q ioss, zitkt ol qf gsr Coezgkoqf igxlt, gzitkvolt afgvf ql zit Ektts Igxlt.'
const MAX_WRONG = 5;

const code = document.getElementById("code");
const decode = document.getElementById("decode");
const puzzle_paragraph = document.getElementById("puzzle-paragraph");
const answer_paragraph = document.getElementById("answer-paragraph");
puzzle_paragraph.innerText = puzzle_text;

const warningEl = document.getElementById("warning");


function emptyToStar(char) { // "" -> "*"
    char = (char ?? "").trim();
    return char === "" ? "*" : char;
}

function buildMaps() {
    // a -> from-a, b -> from-b, ..., z -> from-z 
  const m = {};
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(97 + i); // a..z
    const input = document.getElementById(`from-${c}`);
    const v = emptyToStar(input.value).toLowerCase(); // "" -> "*"
    m[c] = v;
  }
  return m;
}

function decodeWithMaps(text, maps) {
  return text.split("").map(ch => {
    if (!/[a-z]/i.test(ch)) return ch; // space/fullstop/punctuation/etc unchanged
    const lower = ch.toLowerCase();
    const mapped = maps[lower];        // "*" or letter
    return ch === lower ? mapped : mapped.toUpperCase();
  }).join("");
}

function escapeHTML(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getUnsureSet() {
  const s = new Set();
  document.querySelectorAll('.unsure-toggle.active').forEach(btn => {
    s.add(btn.getAttribute('data-letter'));
  });
  return s;
}

function decodeWithMapsHTML(text, maps, unsureSet) {
  return text.split("").map(ch => {
    if (!/[a-z]/i.test(ch)) return escapeHTML(ch);
    const lower = ch.toLowerCase();
    const mapped = maps[lower];
    const display = ch === lower ? mapped : mapped.toUpperCase();
    if (unsureSet.has(lower)) {
      return '<span class="unsure-letter">' + escapeHTML(display) + '</span>';
    }
    return escapeHTML(display);
  }).join("");
}

function renderAll() {
  const maps = buildMaps();
  const unsureSet = getUnsureSet();
  answer_paragraph.innerHTML = decodeWithMapsHTML(puzzle_text, maps, unsureSet);
  decode.innerHTML = '<div class="decode-inner">' + decodeWithMapsHTML(code.value, maps, unsureSet) + '</div>';

  // Color mapping inputs based on unsure flags
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(97 + i);
    const input = document.getElementById(`from-${c}`);
    const toggle = document.querySelector(`.unsure-toggle[data-letter="${c}"]`);
    input.style.color = (toggle && toggle.classList.contains('active')) ? '#d32f2f' : '';
  }

// Show warning if wrong mappings exceed MAX_WRONG
  const wrongCount = countWrongAgainstKey(keymap);
  warningEl.classList.toggle("hidden", wrongCount < MAX_WRONG);
  warningEl.innerText = `⚠️ There are ${wrongCount} wrong pairs! Please check your mapping. ⚠️`;

  syncBoxes();
}

function syncBoxes() {
  const basePad = 10;

  // Reset to measure natural heights
  code.style.height = 'auto';
  code.style.paddingTop = basePad + 'px';
  code.style.paddingBottom = basePad + 'px';
  decode.style.height = 'auto';

  const tNatural = code.scrollHeight;
  const oNatural = decode.scrollHeight;
  const maxH = Math.max(tNatural, oNatural);

  // Set both to the max height
  code.style.height = maxH + 'px';
  decode.style.height = maxH + 'px';

  // Vertically center textarea content via padding
  const contentH = tNatural - 2 * basePad;
  const totalPadding = maxH - contentH;
  if (totalPadding > 2 * basePad) {
    code.style.paddingTop = (totalPadding / 2) + 'px';
    code.style.paddingBottom = (totalPadding / 2) + 'px';
  }
}

// Listen to all input fields with 'from-' prefix for changes
document.querySelectorAll('input[id^="from-"]').forEach(inp => {
  inp.addEventListener("input", renderAll);
});

// When code input changes, re-render the output
code.addEventListener("input", renderAll);

// Initial render
renderAll();

// Create unsure toggle buttons for each mapping pair
document.querySelectorAll('.pairs').forEach(pair => {
    const input = pair.querySelector('input');
    if (!input) return;
    const letter = input.id.replace('from-', '');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'unsure-toggle';
    btn.setAttribute('data-letter', letter);
    btn.textContent = '?';
    btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        renderAll();
        saveState();
    });
    pair.insertBefore(btn, input);
});

const revealMapButton = document.getElementById("reveal-map-button");
const revealCodeButton = document.getElementById("reveal-code-button");
const resetButton = document.getElementById("reset-button");

function fillFromKey(keymap) {
    // a -> from-a, b -> from-b, ..., z -> from-z 
  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(97 + i); // a..z
    const input = document.getElementById(`from-${c}`);
    input.value = keymap[i];
  }
}

revealMapButton.addEventListener("click", () => {
    fillFromKey(keymap);
    renderAll();
})

revealCodeButton.addEventListener("click", () => {
    code.value = keycode;
    renderAll();
})

resetButton.addEventListener("click", () => {
    // Clear all inputs
    document.querySelectorAll('input[id^="from-"]').forEach(inp => {
        inp.value = "";
    });
    // Clear unsure flags
    document.querySelectorAll('.unsure-toggle.active').forEach(btn => {
        btn.classList.remove('active');
    });
    code.value = "";
    renderAll();
    saveState();
})

function countWrongAgainstKey(keymap) {
  let wrong = 0;

  for (let i = 0; i < 26; i++) {
    const c = String.fromCharCode(97 + i);         // a..z
    const input = document.getElementById(`from-${c}`);
    
    const guess = input.value.toLowerCase();
    if(guess === "" || guess === "*") continue; // "" or "*" are not considered as wrong        

    const correct = keymap[i].toLowerCase();
    // If the keymap uses '*', it means that letter has no mapping, so skip checking it
    if (correct === "*") continue;

    if (guess !== correct) wrong++;
  }

  return wrong;
}