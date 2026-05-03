import icebearImg from '../assets/icebear.jpeg'
import bearComputerImg from '../assets/bearcomputer.jpg'
import bearGoalsImg from '../assets/beargoals.jpg'
import bearBallImg from '../assets/bearball.jpg'
import bearGlassesImg from '../assets/bearglasses.jpg'
import pandaFaceImg from '../assets/pandaface.png'

// Each entry is a 3D screen anchored to a waypoint along the 120-point path.
// The screen lives at a fixed 3D position; opacity eases in as the camera
// approaches the anchor waypoint and eases out as it leaves.
//
// Fields:
//   id              - unique key
//   anchorWaypoint  - 1-indexed (matches the top-left UI), 1..120
//   fadeBand        - how many waypoints around the anchor over which to fade
//   position        - 3D world position. If null, defaults to the camera's
//                     LOOK target at that waypoint (so it lands center-of-view).
//   offset          - optional [x,y,z] nudge added to position
//   scale           - world-space scale multiplier (default 1)
//   title           - title bar text
//   icon            - JSX shown in title bar
//   iconColor       - background color of icon box
//   content         - JSX rendered inside the screen body
export const SCREENS = [
  {
    id: 'icebear',
    anchorWaypoint: 6,
    fadeBand: 6,
    position: null,           // auto = camera's look-at target at waypoint 6
    offset: [0, 0, 0],
    scale: 1,
    title: 'About Me',
    icon: <img src={icebearImg} alt="Ice Bear" draggable={false} />,
    iconColor: '#aee0ff',
    content: (
      <>
        <p>
          Hey, I'm Edison. I'm currently as CS major at Sac State.
        </p>
        <p>
          I like games, anime, basketball, music, and building things like this site.
          I relate to Ice Bear from We Bare Bears as he's chill, thoughtful, and into many hobbies.
        </p>
        <p>
          Scroll around the world to find more screens like this one. Each tells some stuff about me.
            Btw you have to scoll outside these screens to continue.
        </p>
        <p>
          Try using the chat at the bottom. Use your questions wisely since everybody
          is limited on how much they can ask!
        </p>

      </>
    ),
  },
  {
    id: 'projects',
    anchorWaypoint: 20,
    fadeBand: 6,
    position: null,
    offset: [0, 0, 0],
    scale: 1,
    title: 'Projects',
    icon: <img src={bearComputerImg} alt="Projects" draggable={false} />,
    iconColor: '#7ec850',
    content: (
      <>
        <p>
          I've built a good amount of projects but heres a few.
        </p>
        <p>
          <strong>Lattice Labs / ALEMS EHR</strong> — HIPAA-compliant electronic health
          record system for a senior care home. React + Spring Boot + AWS. I worked with 8 other devs
          and handle most of the backend and security work!
        </p>
        <p>
          <strong>Persephone</strong> — AI desktop companion with a 9-subsystem
          psychology engine. Fine-tuned a 14B LLM and ran it locally via Ollama. Inspired by Neurosama!
          Demo: <a href="https://youtu.be/4OeOP96TvUI" target="_blank" rel="noreferrer">youtu.be/4OeOP96TvUI</a>
        </p>
        <p>
          <strong>This Portfolio</strong> — React + Three.js + Blender. The world is a
          Minecraft scene I baked. This was one of the more personal projects I've made.
            The chat is powered from gpt-4o-mini. I did not purchase many tokens so please be
          mindful on the questions asked. The amount of calls are also limited for security reasons.
        </p>
        <p>
          More on my GitHub, LinkedIn, and Email.
        </p>
        <p>
          <a href="https://github.com/hyemdanu" target="_blank" rel="noreferrer">github.com/hyemdanu</a>
          <br />
          <a href="https://www.linkedin.com/in/edison-ho-a3a91228a" target="_blank" rel="noreferrer">linkedin.com/in/edison-ho</a>
          <br />
            <a href="mailto:hoedison2003@gmail.com">hoedison2003@gmail.com</a>
          <br />
          <a href="/Edison_Ho_Resume.pdf" target="_blank" rel="noreferrer">Open Resume</a>
        </p>
          <p>
             I have another 3D website already made but that's more of secret.
          </p>
          <p>
            <img src={pandaFaceImg} alt="" style={{ width: '120px', display: 'block', margin: '0 auto' }} />
          </p>
      </>
    ),
  },
  {
    id: 'hobbies',
    anchorWaypoint: 78,
    fadeBand: 6,
    position: null,
    offset: [0, 0, 0],
    scale: 1.15,
    title: 'Hobbies',
    icon: <img src={bearBallImg} alt="Hobbies" draggable={false} />,
    iconColor: '#f4a3c2',
    content: (
      <>
        <p>Some hobbies here</p>
        <p>
          <strong>Anime</strong> — I watched a good amount of anime. I mainly like action shounen but I try a lot
            different genres. I like AOT, Fate, HxH, Frieren, and a lot others. Been to Sac Anime like 3 times.
        </p>
        <p>
          <strong>Music</strong> — Japanese music like Ado, Aimer, etc. I like Kpop like Cortis, Stray Kids, and
            Le Sserafim. These are just a few. Also listen to rap when in a basketball mood.
        </p>
        <p>
          <strong>Gaming</strong> — Favorite game is Minecraft lol. I used to play a lot of competitive games like
            Overwatch, Fortnite, and Valorant. Now I just play anything if I find it fun.
        </p>
        <p>
          <strong>Basketball</strong> — I love hooping. Also a sad kings fan.
        </p>
        <p>
          <strong>Food</strong> — Really like eating food and cooking. My feed is essentially all cooking videos and
            people eating.
        </p>
        <p>
            <strong>Random Collections</strong> I have over 15 gaming mice, 6 keyboards, and tons of anime figures (that I need
            to sell). Also have tons of random merch from Ado, Pokemon, and NBA. I have like 12 pairs of basketball shoes.
        </p>
      </>
    ),
  },
  {
    id: 'thanks',
    anchorWaypoint: 102,
    fadeBand: 6,
    position: null,
    offset: [0, 0, 0],
    scale: 1.2,
    title: 'Thanks for visiting',
    icon: <img src={bearGlassesImg} alt="Thanks" draggable={false} />,
    iconColor: '#ffd25c',
    content: (
      <>
        <p>Thanks for scrolling through my world</p>
        <p>
          Not sure if I wanted to keep this professional or casual lol. I kept it casual. Here is my links and contacts.
        </p>
        <p>
          <a href="mailto:hoedison2003@gmail.com">hoedison2003@gmail.com</a>
          <br />
          <a href="https://www.linkedin.com/in/edison-ho-a3a91228a" target="_blank" rel="noreferrer">LinkedIn</a>
          <br />
          <a href="https://github.com/hyemdanu" target="_blank" rel="noreferrer">GitHub</a>
        </p>
      </>
    ),
  },
  {
    id: 'goals',
    anchorWaypoint: 42,
    fadeBand: 6,
    position: null,
    offset: [0, 0, 0],
    scale: 0.8,
    title: 'Goals',
    icon: <img src={bearGoalsImg} alt="Goals" draggable={false} />,
    iconColor: '#ffd25c',
    content: (
      <>
        <p>Some of my goals</p>
        <p>
          <strong>Career</strong> — getting into cybersecurity would be my main goal. I am interested in
            SOC Analysts, Penetrating Testing, and AI security. Being a developer would be
            be fun as well. At the moment, I would be fine with any technical role.
        </p>
        <p>
            <strong>Languages</strong> — I want to learn Japanese and Mandarin. Japanese because I like anime and Japanese
            songs. Mandarin since my family is from China.
        </p>
        <p>
          <strong>Music</strong> — I used to play the guitar a little pretty much everything. I am going to try
            to commit learning the piano.
        </p>
        <p>
          <strong>Fitness</strong> — Been trying to cosplay as Inosuke since forever. Still need to learn to do a backflip
            and muscle up. Also want to be better at basketball.
        </p>
        <p>
          <strong>Travel</strong> — Visit Japan hopefully soon.
        </p>
        <p>
          <strong>Tech</strong> — Want to build more stuff involving hardware.
        </p>
      </>
    ),
  },
]