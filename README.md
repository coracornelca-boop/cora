# CORA Startup — Site vitrine

## Structure du projet
```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── images/
    ├── logo.jpg
    ├── dev-team.jpg
    └── cyber-security.jpg
```

## Déploiement sur Netlify

### Option 1 — Glisser-déposer (le plus simple)
1. Va sur https://app.netlify.com
2. Glisse le dossier complet (ou le zip dézippé) sur la zone "Deploy manually"
3. Le site est en ligne en quelques secondes

### Option 2 — Via Git
1. Pousse ce dossier sur un repo GitHub/GitLab
2. Sur Netlify : "Add new site" → "Import an existing project"
3. Connecte le repo — aucun build command n'est nécessaire (site 100% statique)
4. Publish directory : `/` (racine)

Aucune étape de build, aucune dépendance : c'est du HTML/CSS/JS pur.
