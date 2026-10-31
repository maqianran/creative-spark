# PROCESS — Creative Spark

## 1. Starting point and project intention

I began this project on **24 October 2026**. I used that first session to brainstorm possible directions for the individual assignment and choose a creative prompt generator as my project idea. I wanted to make a small interactive tool for students and content creators who have an idea of what they want to make but are not sure how to begin.

I decided to focus on three creative formats: short video, photography, and poster design. A user chooses a format, a visual style, and a time budget. The website then combines those choices with other prompt ingredients to create a specific task. I chose this idea because it gave me a manageable scope as a programming beginner while still allowing me to demonstrate a complete interaction loop: **user input → program response → visible feedback → next action**.

## 2. Design and implementation iterations

### Version 1: Basic interaction

I built the first version with HTML, CSS, and JavaScript. It included three creative formats, a small set of moods, three time budgets (5, 15, and 30 minutes), a result card, and controls to draw another card, copy the task, and reset the choices.

I added validation so the page would explain which required choices were missing instead of generating an empty result. I also added a fallback message for cases where clipboard access was unavailable.

### Version 2: Bilingual interface and more prompt choices

After the first friend tried the early version on **25 October 2026**, I received three suggestions: add a Chinese/English interface toggle, provide more style choices, and offer more varied task descriptions.

I kept these suggestions and expanded the interface. I added the language toggle, increased the available mood/style choices from three to nine, and expanded the built-in prompt content. I also made sure the main controls and generated result could be displayed in both Chinese and English.

### Version 3: A larger style library and combinatorial prompts

After the second friend tried Version 2 on **28 October 2026**, I received feedback that the cards still felt repetitive. I realised that simply adding more fixed descriptions did not fully address the problem because users could still cycle through a relatively predictable set of tasks.

I therefore changed the generation approach instead of only adding more fixed cards. I made the following changes:

- I created a library of **100 bilingual visual-style keywords**, covering art movements, illustration approaches, printmaking, photography aesthetics, and digital visual styles. I documented the list in `STYLE-LIBRARY.md`.
- I designed the style picker to show eight keywords at a time and added a **Shuffle styles** button so users can refresh the visible group.
- I expanded the prompt ingredients to include subjects, creative approaches, visual techniques, constraints, and extra challenges.
- I changed the generator to combine the selected format, style, and time budget with randomly selected prompt ingredients.
- I added used-combination tracking so the generator can avoid returning the same complete combination during the current browser-tab session.

This approach gave the project a much larger range of possible prompts while keeping the interface simple. Showing eight styles at a time also made the choice area easier to scan than displaying all 100 keywords at once.

### Feedback from the third friend and the access issue

A third friend tried the final version on **30 October 2026**. They praised the clean, simple interface and the variety of the style labels. They did not request any changes to the interface or the prompt-generation features.

The friend did point out that accessing the website was somewhat inconvenient at that stage. I was still asking people to open the project folder, start the local server through Terminal, and then open the local address in a browser. I explained that I had not prepared a direct public link because I was still finishing the website. I kept the interaction design unchanged because the friend did not identify another problem with the interface or the generated content. I noted that publishing a direct link would make the experience easier to share and access, without requiring a change to the core prompt generator.

In response to this feedback, I configured GitHub Pages to deploy the project. Users can now access the experience directly via a live URL without needing to start a local server.

## 3. User-trial record

I asked three friends to try different versions of Creative Spark. All three used their own Mac computers. The first two used **Safari**, and the third used **Google Chrome**. I retained the dates, devices, browsers, and main feedback described below. I did not keep a detailed click-by-click observation sheet or exact quotations, so I have not invented specific button sequences or points where a friend paused.

| Trial | Date | Device and browser | Feedback I retained | My response |
|---|---|---|---|---|
| First friend | 25 October 2026 | Their own Mac computer; Safari | They suggested adding a Chinese/English toggle, increasing the variety of style choices, and expanding the task descriptions. | I added bilingual interface text, expanded the style options, and increased the prompt content. |
| Second friend | 28 October 2026 | Their own Mac computer; Safari | They felt that the generated cards were still too repetitive. | I replaced the small fixed prompt approach with a 100-keyword style library and a generator that combines multiple prompt ingredients. |
| Third friend | 30 October 2026 | Their own Mac computer; Google Chrome | They praised the clean interface and variety of the style labels, and did not request changes to the interaction. They noted that starting a local server in Terminal and then opening the local browser address was inconvenient. | I kept the interface and prompt-generation design because no further feature changes were requested. I explained that I had not yet prepared a direct public link while I was finishing the website. |

These trials influenced the direction of the project. The first two rounds led to specific changes in the interface and prompt-generation logic. The third round gave me positive feedback about the final visual design and style variety, while also identifying that a public direct link would improve access. I did not preserve a detailed observation log, so this record focuses on the feedback and decisions I can accurately report.

## 4. How the main interaction works

The user selects a creative format, a visual style, and a time budget. The form checks that all required choices are present. If a choice is missing, the page displays a message explaining what still needs to be selected.

When the user generates a task, the program randomly selects a subject, a creative approach, a visual technique, a constraint, an extra challenge, and a title pattern. It combines these ingredients with the user's selected format, style, and time budget. The result card then displays the generated title, task description, selected style, time limit, and a short tip.

The main functions I can explain are:

- **`createPrompt()`** selects the prompt ingredients and builds a key from the selected format, style, time budget, and ingredient identifiers. It returns the generated prompt and its key.
- **`usedPromptKeys`** is a JavaScript `Set` that stores keys for combinations that have already been generated. `rememberPromptKey()` adds each new key to the set and attempts to save the list in `sessionStorage`.
- **`drawPrompt()`** generates a candidate prompt and checks its key. If the key has already been used, the function tries again. When it finds an unused combination, it records the key and updates the current result state.
- **`renderResult()`** reads the current prompt and updates the visible result card. It uses the selected language to display the correct Chinese or English text.

The number of possible combinations is very large but finite. Based on the current data arrays, the theoretical combination count is approximately **25.8 billion** before wording variations. The generator does not create literally unlimited results. It tracks used combinations during the current tab session and starts a fresh round only after the available combination pool has been exhausted.

## 5. Use of AI tools

I used ChatGPT to help me interpret the assignment brief, brainstorm and narrow down the project idea, plan a manageable feature scope, draft and understand HTML/CSS/JavaScript, prepare bilingual prompt text and style labels, and review possible edge cases. I also used it to help organise the project documentation. The website itself does not call a live AI model or an external prompt-generation API; it assembles prompts locally from the built-in data arrays.

- **One suggestion I kept:** I kept the recommendation to make the interaction loop clear: the user makes a small number of choices, the program responds with a task, and the result card makes the next action understandable. I also kept the offline approach so the project would not depend on API keys, paid services, or a remote model.
- **One suggestion I changed:** The early approach relied on a small set of fixed mood categories and a limited prompt collection. After the second friend's feedback about repetition, I changed the structure rather than just adding more fixed cards. I introduced 100 bilingual style keywords and several independently selected prompt dimensions.
- **Code I can explain:** I can explain how `createPrompt()` selects and combines prompt ingredients, how `usedPromptKeys` and `sessionStorage` help prevent repeated combinations in the current tab session, and how `renderResult()` updates the result card in the selected language.

## 6. Limitations and what I learned

- I assemble the task text from a built-in bilingual phrase library; the website does not generate text by calling a live AI model.
- The number of possible combinations is very large but finite, not literally infinite.
- I store used-combination history in `sessionStorage` for the current browser tab. It normally remains available after a page reload in the same tab and clears when the tab session ends. If browser storage is unavailable, repeat prevention falls back to in-memory storage.
- I show eight style keywords at a time rather than displaying all 100 choices simultaneously.
- Clipboard access depends on browser permissions and the runtime environment, so I provide a fallback message if copying is blocked.
- During the three user trials, I served the website locally. This required starting a static server in Terminal and opening the local address in a browser. I had not prepared a public direct link at the time of the third trial. This made me realise that deployment and ease of access are also part of the overall user experience.

## 7. Checks I completed

- [x] I switched between Chinese and English and checked the interface, style labels, result cards, messages, and copied task text.
- [x] I refreshed the style choices several times and checked that each displayed group contained eight unique styles.
- [x] I checked that the style library contained 100 bilingual entries.
- [x] I generated multiple tasks and checked that subjects, approaches, techniques, constraints, and extra challenges varied.
- [x] I drew cards repeatedly and checked that the same full combination was not repeated during ordinary use in the current page session.
- [x] I checked missing-selection messages, draw-again, copy/paste, and reset.
- [x] I checked the narrow/mobile layout for horizontal overflow.
- [x] I asked three friends to try different versions of the experience and recorded their feedback and my design responses above.
- [x] I kept the current Version 3 interface and result screenshots in `docs/`.
- [x] I included the source files, README, PROCESS, credits, and style library in the project folder.
