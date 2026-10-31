# Creative Spark: Combinatorial Creative Prompt Generator

I created Creative Spark as a bilingual interactive website that helps students and content creators turn a vague idea into a concrete, time-boxed creative challenge. I began the project on **24 October 2026** by brainstorming possible directions for the assignment and choosing the creative prompt generator idea.

## Project idea

- **Intended users:** I designed the tool for students and content creators who want to make a short video, a photography exercise, or a poster but need a starting point.
- **Main interaction:** Users choose one of three creative formats, select a visual style from a rotating set, and choose a time budget. The program combines these choices with several prompt ingredients to produce a task.
- **Bilingual experience:** I added a language toggle in the top-right corner to switch between English and Chinese. Interface text, style labels, result cards, status messages, and copied task text follow the selected language.
- **Style library:** I prepared 100 bilingual art and visual-aesthetic keywords. The website shows eight at a time; users can click **Shuffle styles** to reveal another batch.
- **Combinatorial prompt generator:** Each card combines the selected format, style, subject, creative direction, visual technique, constraint, extra challenge, title pattern, and time budget. The prompt ingredients are selected locally in the browser.
- **Repeat avoidance:** I added a key for each full combination. The generator checks used keys and retries when it finds a match. The key history is stored in `sessionStorage` for the current browser tab. The current prompt dimensions provide approximately 25.8 billion theoretical combinations before wording variations. This is a very large but finite number, not literal infinity.
- **Feedback and controls:** Each result card displays the challenge, selected style, time limit, and an action suggestion. Users can draw another card, copy the task, shuffle the style choices, or reset the experience.
- **Error handling:** I added prompts for missing required choices and a fallback message if clipboard access is unavailable.

## User feedback and iteration

I refined Creative Spark through feedback from three friends, each using their own Mac computer:

| Date | Device and browser | Feedback | What I changed or decided |
|---|---|---|---|
| 25 October 2026 | Mac; Safari | The first friend suggested a Chinese/English toggle, more style choices, and more varied task descriptions. | I added the bilingual interface, expanded the available styles, and increased the prompt content. |
| 28 October 2026 | Mac; Safari | The second friend felt that the cards still seemed repetitive. | I expanded the style library to 100 bilingual keywords and changed the generator to combine multiple prompt ingredients. |
| 30 October 2026 | Mac; Google Chrome | The third friend praised the clean interface and variety of the style labels and did not request feature changes. They noted that starting the local server through Terminal and opening the local browser address was inconvenient. | I kept the interface and prompt-generation features unchanged. I explained that I had not prepared a direct public link because I was still finishing the website. |

I did not retain a step-by-step click log or verbatim quotations from the trials, so I have recorded the dates, devices, browsers, feedback, and decisions that I can confirm. More detail about the design decisions and user trials is in `PROCESS.md`.

## How to run

I built the website with plain HTML, CSS, and JavaScript. It has no third-party package dependencies, API keys, database, or backend service.

### Option A: Open the HTML file directly

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.
3. Choose a format, a visual style, and a time budget, then generate a prompt.

### Option B: Run a local static server (recommended)

Open a terminal in the project folder (the folder that directly contains `index.html`, `style.css`, and `script.js`) and run:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` in your browser. To stop the server, return to the terminal and press `Control+C` on macOS or Linux.

I use Python here only to serve the static website locally. I wrote the website itself in HTML, CSS, and JavaScript.

## Project structure

```text
creative-spark/
├── index.html          # Page structure and controls
├── style.css           # Colours, layout, and responsive styles
├── script.js           # Language switching, style library, prompt generation, and controls
├── README.md           # Project overview and run instructions
├── PROCESS.md          # My design decisions, iterations, and user-trial records
├── CREDITS.md          # Code and asset credits
├── STYLE-LIBRARY.md    # The 100 bilingual visual-style keywords
└── docs/
    ├── screenshot.png
    ├── example-result.png
    └── mobile-screenshot.png
```

## Screenshots and live demo

- Main interface: `docs/screenshot.png`
- Example result card: `docs/example-result.png`
- Narrow/mobile layout: `docs/mobile-screenshot.png`

At the time of the third user trial, I had not yet configured a public live-demo link. I was running the website locally with a static server. I can add a live-demo URL here after I deploy the site and verify that the link is publicly accessible.

## Known limitations

- I assemble prompts from a built-in bilingual phrase library; I do not call a live AI model or external generation service.
- The available combinations are finite, although the current prompt ingredients create a very large combination space.
- I store used-combination history in `sessionStorage` for the current browser tab. It normally survives a page reload in the same tab and clears when the tab session ends. If browser storage is unavailable, repeat prevention falls back to in-memory storage until the page is reloaded.
- I show eight style keywords at a time rather than placing all 100 on the page simultaneously.
- Clipboard behaviour depends on browser permissions and the runtime environment. I provide a fallback message if copying is blocked.
- During my user trials, the website was accessed through a local server started from Terminal. I had not yet published a direct public link at that point.

## Testing checklist

I completed the following checks on the submitted version:

- [x] I switched between English and Chinese and confirmed that controls, style labels, result cards, messages, and copied prompt text used the selected language.
- [x] I clicked **Shuffle styles** several times and confirmed that the visible keywords changed and each displayed group contained no duplicate style.
- [x] I verified that the library contained 100 bilingual visual-style keywords.
- [x] I selected each creative format and generated multiple cards; I checked that subjects and visual instructions varied.
- [x] I drew cards repeatedly and confirmed that the same full combination was not repeated during ordinary use in the current page session.
- [x] I tried generating a card with missing selections and confirmed that a helpful message appeared.
- [x] I copied a task and pasted it into a text editor to check the copied content and language.
- [x] I reset the page and confirmed that the selections and result were cleared.
- [x] I checked a narrow/mobile viewport for horizontal overflow.
- [x] I asked three friends to try different versions of the experience and used their feedback to guide the design; I recorded their trial dates as 25, 28, and 30 October 2026.

## Use of AI tools

I used ChatGPT to help me interpret the assignment brief, brainstorm and narrow down the project idea, plan the feature scope, draft and understand HTML/CSS/JavaScript, prepare bilingual prompt ingredients and style labels, and review possible edge cases. The prompt generator runs locally and does not call a live AI model. I describe the suggestions I kept or changed and the code I can explain in `PROCESS.md`.

## Repository

I maintain the source code and project documentation in this public GitHub repository:

[https://github.com/maqianran/creative-spark](https://github.com/maqianran/creative-spark)

I have not listed a live-demo URL here because I had not yet verified a hosted deployment when I prepared this README. The website can be run locally using the instructions above.
