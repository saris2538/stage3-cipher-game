const puzzle_text = "Q egflztssqzogf ol qf qktq gf zit etstlzoqs lhitkt of vioei q ukgxh gy colowst lzqkl ygkdl q htketoctr hqzztkf gk gxzsoft , znhoeqssn kthktltfzofu qf qfodqs, dnzigsguoeqs lxwptez, gk ofqfodqzt gwptez.[1]\n\nZit gkouofl gy zit tqksotlz egflztssqzogfl soatsn ug wqea zg hktiolzgkn. Htghst xltr zitd zg ktsqzt lzgkotl gy zitok wtsotyl, tbhtkotfetl, ektqzogf, gk dnzigsgun. Royytktfz exszxktl qfr egxfzkotl ofctfztr zitok gvf egflztssqzogfl, lgdt gy vioei sqlztr ofzg zit tqksn 20zi etfzxkn wtygkt zgrqn'l egflztssqzogfl vtkt ofztkfqzogfqssn ktegufomtr. Zit ktegufozogf gy egflztssqzogfl iql eiqfutr loufoyoeqfzsn gctk zodt. Dqfn eiqfutr of lomt gk liqht. Lgdt wteqdt hghxsqk, gfsn zg rkgh ofzg gwlexkozn. Lgdt vtkt sodoztr zg q lofust exszxkt gk fqzogf. Fqdofu egflztssqzogfl qslg itshtr qlzkgfgdtkl qfr fqcouqzgkl ortfzoyn lzqkl dgkt tqlosn.[2]"
const keymap = 'kxvmcnoph*rszyijadlegwbuft'; // substitution key
const keycode = 'soct q wtqxzoyxs soyt'
const MAX_WRONG = 7;

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

function renderAll() {
  const maps = buildMaps();
  answer_paragraph.innerText = decodeWithMaps(puzzle_paragraph.innerText, maps);
  decode.value = decodeWithMaps(code.value, maps);

// Show warning if wrong mappings exceed MAX_WRONG
  const wrongCount = countWrongAgainstKey(keymap);
  warningEl.classList.toggle("hidden", wrongCount < MAX_WRONG);
  warningEl.innerText = `⚠️ There are ${wrongCount} wrong pairs! Please check your mapping. ⚠️`;
}

// Listen to all input fields with 'from-' prefix for changes
document.querySelectorAll('input[id^="from-"]').forEach(inp => {
  inp.addEventListener("input", renderAll);
});

// When code input changes, re-render the output
code.addEventListener("input", renderAll);

// Initial render
renderAll();

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
    code.value = "";
    renderAll();
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