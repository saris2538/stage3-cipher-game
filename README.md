# One-to-One Substitution Cipher Game (Vanilla JS)

A small web puzzle where you solve a **one-to-one substitution cipher** by filling a letter-mapping table (a–z).  
As you type, the decoded text updates instantly. Once you crack the mapping, you can decode the secret code at the bottom.

🔗 **Live Demo:**  
[https://saris2538.github.io/substitution-cipher-game/](https://saris2538.github.io/stage3-cipher-game/)

---

## Demo / How to Play

1. **Goal:** decode the secret phrase from the previous stage — but first, crack the substitution map.
2. Read the **Encoded Paragraph** section.
4. Fill in the mapping table on the right (`a → ?`, `b → ?`, …).
   - Leave a box blank if you’re unsure.
   - Each cipher letter should map to **exactly one** plaintext letter.
5. The **Decoded Paragraph** section updates live as you type. When it becomes readable, your mapping is correct.
6. Paste the secret phrase in **Enter secret phrase here** to decode it using your current mapping.
7. Optional buttons:
   - **Reset**: clears everything.

## Features

- ✅ Live decoding (updates on every keystroke)
- ✅ One-to-one letter mapping table (a–z)
- ✅ Preserves punctuation / spacing in the text
- ✅ Warning banner when wrong guesses exceed a threshold (to prevent “going off the rails”)
- ✅ Reveal / Reset controls

## Project Structure

.   
├── index.html   
├── styles.css   
└── script.js   


## Run Locally
1. Clone this repository
2. Open the project folder
3. Run with a local server (recommended)  
   - Use **Live Server** in VS Code
   - or open `index.html` directly (works for this project because there are no external dependencies).


## Customization

### Change the puzzle text
Edit `puzzle_text` in `script.js`:

`const puzzle_text = " ... ";`

### Change the answer key (substitution key)

Edit `keymap` in `script.js`:

`keymap[i]` is the plaintext mapping for cipher letter  
`String.fromCharCode(97 + i)` (a–z).

`const keymap = "kxvmcnoph*rszyijadlegwbuft";`

### Change the secret code phrase

Edit `keycode` in `script.js`:

`const keycode = "soyt q wtqxzoyxs soyt";`

### Change the warning threshold

Edit `MAX_WRONG` in `script.js`:

`const MAX_WRONG = 7;`
