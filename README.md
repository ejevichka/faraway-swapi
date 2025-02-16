Starwars SWAPI
Starwars SWAPI is a Single Page Application (SPA) built with React and TypeScript that uses the Star Wars API as its data source. The application consists of two main pages:

# Features

# Character Detail Page:

Detailed view for each character.
Local editing of character details (using Material UI components and Emotion-styled components).
Dynamic favorite management and caching via localStorage.

# User Interface & Styling:

Tailwind CSS for layout, spacing, positioning, colors, and effects.
Material UI for core UI components (buttons, cards, inputs, etc.), with custom styling via Emotion.
A cosmic, minimalistic design inspired by the Star Wars aesthetic.
Animations & Visual Effects:

Smooth UI transitions and animations with GSAP (gsap-trial) and ScrollTrigger.
Three.js cosmic background experience.

# Static Generation & Incremental Static Regeneration (ISR):

Pages are pre-rendered using Next.js getStaticPaths and getStaticProps, ensuring fast load times and SEO benefits.
ISR updates pages in the background at a set interval (every 60 seconds), serving stale content initially for faster response times.


# Caching:
Edited character data is cached using a custom utility module (cache), which wraps around localStorage. This approach saves favorite data and user edits across sessions without additional server requests.


Justification for Generating Paths:

Performance:
Pages are pre-rendered during build time and served as static HTML. Pre-generating paths for a subset of tokens ensures near-instant load times for frequently accessed pages.

Scalability:
Using ISR with a subset of pre-generated paths allows the application to scale effectively. New or infrequently accessed tokens are rendered on-demand without impacting the performance of the pre-generated pages.


TODO:
add turbopack
add i18n
vercel setups (linters)
Testing - playright e2e testing (error on run)
Unit testing


