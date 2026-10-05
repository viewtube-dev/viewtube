# ViewTube Glass Lab

Experimental Liquid Glass design and component system for ViewTube.

## Run

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
```

## Vercel

Configure a Vercel project against the ViewTube repository and use:

- Root Directory: `apps/liquid-glass-lab`
- Build Command: `npm run build`
- Output Directory: `dist`

The project is intentionally isolated from the production ViewTube application.

## What it explores

- independent Liquid Glass component concepts;
- material parameters;
- performance tiers;
- semantic component contracts;
- renderer/fallback separation;
- responsive and reduced-motion behavior;
- future promotion into ViewTube.

## Design rule

There is no global Liquid Glass visual-family taxonomy. A component earns its own visual construction from its job.
