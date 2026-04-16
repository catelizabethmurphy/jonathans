# 328T628T Starter Repo

Vue 3 sandbox with Vite for optional Lab 8 module.

## What this repo includes

- **Vue 3** with Composition API (setup syntax)
- **Vite** for fast local development
- **D3.js** for data visualization
- **Public directory** for assets (images, data files)
- **GitHub Pages** auto-deployment ready

## Requirements

- Node.js 18+ (or newer LTS)
- npm
- A GitHub account

## Setup Instructions

### 1. Install Node.js and npm (local development only)

1. Download and install [Node.js](https://nodejs.org/en/download). Ensure npm is included.
   - **macOS**: Alternatively run `brew install node`

2. Verify installation by running:
```bash
node -v
npm -v
```

### 2. Create a new repository from this template

1. Click the green **Use this template** button at the top of this repository
2. Select **Create a new repository**
3. Name your repository and choose your visibility settings
4. Click **Create repository from template**

### 3. Make a new repo and run locally

#### Option A: Local IDE

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
npm run dev
```

#### Option B: GitHub Codespaces

1. Go to your new repository on GitHub
2. Click **Code → Codespaces → Create codespace on [branch]**
3. Wait for Codespaces to load, then open a terminal
4. Run:

```bash
npm install
npm run dev
```

Open the local URL shown in your terminal (usually `http://localhost:5173`).

### 3. Project structure

```
src/
  App.vue          - Main Vue component
  main.js          - App entry point
  styles.css       - Global styles
public/
  data.json        - Your data files (served at /)
  image.png        - Your images (served at /)
docs/              - Built output for GitHub Pages
```

## Publishing to GitHub Pages

### One-time setup

1. Go to your repository **Settings → Pages**
2. Under "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: Select your current branch
   - **Folder**: `/docs`
3. Click **Save**

### Deploy updates

After making changes, run:

```bash
npm run build
git add docs/
git commit -m "Deploy to GitHub Pages"
git push
```

Wait 1-2 minutes for GitHub Pages to update, then refresh your site.

### Your live site URL

```
https://<your-username>.github.io/<your-repo-name>/
```

(Find the exact URL in Settings → Pages)

## Development commands

- `npm run dev` - Start local dev server
- `npm run build` - Build for production (outputs to `docs/`)
- `npm run preview` - Preview production build locally

## Troubleshooting

**Page shows old version**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (macOS)
- Confirm latest commit includes updated `docs/` folder
- Wait 1-2 minutes for Pages to rebuild

**Assets show 404 errors**
- Make sure vite.config.js has correct `base` path
- Reference assets from `public/` folder as `/filename`
- Run `npm run build` again

**Pages not deploying**
- Verify Settings → Pages is set to correct branch + `/docs` folder
- Confirm commit was pushed to the correct branch

