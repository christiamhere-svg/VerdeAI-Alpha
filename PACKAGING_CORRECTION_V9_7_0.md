# Packaging correction — VerdeAI v9.7.0

The first v9.7.0 ZIP contained the new source files, but `index.html` still loaded the old v9.6.5 versioned JavaScript, CSS, and config files.

This corrected package now loads:
- `styles/main.v9.7.0.css`
- `config.v9.7.0.js`
- `js/app.v9.7.0.js`

The visible build label is also updated to `Build v9.7.0`.
