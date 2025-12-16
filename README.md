# EOY Review - Vue Radar Level V3 (Next.js)

Application Next.js moderne avec Tailwind CSS pour créer votre vue radar d'auto-évaluation basée sur le framework Level V3.

## Installation

1. Installez les dépendances :
```bash
npm install
```

2. Lancez le serveur de développement :
```bash
npm run dev
```

3. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur

## Structure du projet

```
nextjs/
├── app/
│   ├── page.tsx          # Page principale
│   ├── layout.tsx        # Layout de l'application
│   └── globals.css       # Styles globaux avec Tailwind
├── components/
│   ├── RadarDiagram.tsx  # Composant SVG du diagramme radar
│   └── SlidersPanel.tsx  # Panneau de contrôles avec sliders
├── lib/
│   └── export.ts         # Fonctions d'export SVG/PNG
├── types.ts              # Types TypeScript et configuration des échelles
└── package.json
```

## Fonctionnalités

- **Diagramme radar interactif** avec les 4 axes du framework Level V3
- **Contrôles avec sliders** pour ajuster vos niveaux (1-5)
- **Overlay Manager** : Affichez la perception de votre manager pour comparaison
- **Export SVG/PNG** : Téléchargez votre diagramme pour votre auto-évaluation
- **Design moderne** avec Tailwind CSS et thème sombre

## Les 4 Axes

1. **Engineering Excellence** (Haut-Gauche) : Learns → Applies → Masters → Advances → Pioneers
2. **Delivery & Impact** (Haut-Droite) : Tasks → Features → Projects → Initiatives → Strategy
3. **People** (Bas-Droite) : Absorbs → Supports → Mentors → Guides → Elevates
4. **Innovation & Strategy** (Bas-Gauche) : Follows → Improves → Innovates → Architects → Envisions

## Personnalisation

### Modifier les échelles (Ladders)

Éditez le fichier `types.ts` pour modifier les labels de progression :

```typescript
export const LADDERS = {
  engineering: ['Learns', 'Applies', 'Masters', 'Advances', 'Pioneers'],
  // ... autres axes
}
```

### Modifier les données par défaut

Dans `app/page.tsx`, modifiez `INITIAL_DATA` et `MANAGER_DATA` pour vos valeurs par défaut.

## Scripts disponibles

- `npm run dev` : Lance le serveur de développement
- `npm run build` : Compile l'application pour la production
- `npm start` : Lance le serveur de production
- `npm run lint` : Vérifie le code avec ESLint

## Technologies utilisées

- **Next.js 14** : Framework React
- **TypeScript** : Typage statique
- **Tailwind CSS** : Styles utilitaires
- **SVG** : Rendu du diagramme radar
