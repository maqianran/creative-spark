# PROCESS — Creative Spark

> Keep this document in English. Record actual work and observations. Do not describe a planned test as completed or invent participant behaviour.

## 1. Starting idea

I wanted to build a small interactive tool for students and content creators who need a starting point for a creative task. A user chooses a creative format, a mood, and a time budget; the program returns a task they can try.

## 2. Initial design decisions

- **Core interaction loop:** Choose preferences → generate a task → review the result → draw another card, copy the task, or reset.
- **Built-in task library:** The first version works offline and does not need an API key or external service.
- **Visual direction:** Warm off-white background, deep blue as the main colour, and orange accents.
- **Error handling:** Missing choices prompt a helpful message; clipboard failure produces a fallback message.

## 3. Initial version

The first version includes three creative formats (short video, photography, and poster design), three moods (retro, calming, and mysterious), three time budgets (5, 15, and 30 minutes), a result card, draw-again, copy, and reset controls.

| Date | Change | Reason / result |
|---|---|---|
| 27 October 2026 | Created the first working page and checked the main interaction in a browser. | Established the input → response → feedback loop and a small scope that can be tested. |

## 4. User feedback and next iteration

A friend tried the first version and suggested adding a Chinese/English language toggle, more style choices, and a wider range of task descriptions. The next version addresses these suggestions.

Complete the details below from the actual trial notes:

- **Trial date:** [confirm the actual date]
- **Device and browser:** [record what was actually used]
- **What the person tried:** [record observed actions]
- **Where they hesitated or what felt limited:** [record actual observations]
- **Decision:** Add a bilingual interface, expand style choices, and diversify the task content.

## 5. Use of AI tools

ChatGPT was used to help interpret the assignment, plan the first feature scope, draft and explain HTML/CSS/JavaScript, and review likely edge cases.

- **Suggestion kept:** Use a clear input → response → feedback loop with a helpful message when required choices are missing.
- **Suggestion changed or rejected:** The first version does not use a live AI API. It uses a small built-in task library to avoid API keys and external-service dependencies.
- **Code I can explain:** [in your own words, explain how the selected values are read and how the result card is updated]

## 6. Limitations

- Task variety is limited in this first version.
- The website does not use a database.
- Clipboard behaviour depends on browser permissions and context.

## 7. Pre-submission checklist

- [x] Basic browser checks: missing-choice feedback, task generation, draw-again, and reset.
- [ ] Copy a task and verify the pasted text.
- [ ] Ask a person to try the first version before explaining the controls.
- [ ] Update this log with actual trial observations.
- [ ] Follow the run instructions from a fresh terminal.
- [ ] Check that the public repository has no secrets or unlicensed media.
