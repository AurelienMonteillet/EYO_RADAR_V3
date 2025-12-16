# EOY Review - Radar View Level V3 (Next.js)

Modern Next.js application with Tailwind CSS to create your radar view self-assessment based on the Level V3 framework.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
nextjs/
├── app/
│   ├── page.tsx          # Main page
│   ├── layout.tsx        # Application layout
│   └── globals.css       # Global styles with Tailwind
├── components/
│   ├── RadarDiagram.tsx  # SVG radar diagram component
│   └── SlidersPanel.tsx  # Control panel with sliders
├── lib/
│   └── export.ts         # SVG/PNG export functions
├── types.ts              # TypeScript types and ladder configuration
└── package.json
```

## Features

- **Interactive radar diagram** with the 4 axes of the Level V3 framework
- **Slider controls** to adjust your levels (1-5)
- **Manager overlay**: Display your manager's perception for comparison
- **SVG/PNG export**: Download your diagram for your self-assessment
- **Modern design** with Tailwind CSS and dark theme

## The 4 Axes

1. **Engineering Excellence** (Top-Left) : Learns → Applies → Masters → Advances → Pioneers
2. **Delivery & Impact** (Top-Right) : Tasks → Features → Projects → Initiatives → Strategy
3. **People** (Bottom-Right) : Absorbs → Supports → Mentors → Guides → Elevates
4. **Innovation & Strategy** (Bottom-Left) : Follows → Improves → Innovates → Architects → Envisions

## Available Scripts

- `npm run dev` : Start the development server
- `npm run build` : Build the application for production
- `npm start` : Start the production server
- `npm run lint` : Check code with ESLint

## Technologies Used

- **Next.js 14** : React framework
- **TypeScript** : Static typing
- **Tailwind CSS** : Utility-first CSS
- **SVG** : Radar diagram rendering
