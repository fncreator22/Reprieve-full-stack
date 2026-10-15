# Reprieve — Production Video Directing & Master Storyboard
> **Edition:** WeMakeDevs & FalkorDB Hackathon (Official Release)  
> **Aesthetic Standard:** Apple Design System · WWDC Studio Presentation · High-Craft Engineering Motion  
> **Motion Physics Engine:** Deterministic 60 FPS Mass-Spring-Damper (`stiffness: 240, damping: 25, mass: 1`)  
> **Audio Architecture:** Warm Rhodes Pad (-18 dB), Sub-Bass Accent (-12 dB), Real Haptic Foley (-6 dB), VO Ducking (-3 dB)  
> **Status:** Fully Audited by Internal Creative Council · Pending Human-in-the-Loop (HITL) Sign-off

---

# 🎬 VIDEO 1: The Social Media Launch Film (60–75s)
* **Target Duration:** 70.0 Seconds (4,200 frames @ 60 FPS)  
* **Resolution:** 1920 × 1080p @ 60.00 FPS  
* **Pacing:** Calm, confident, authoritative, 130–135 words per minute (Total spoken word count: 148 words across 70 seconds)  
* **Visual Direction:** Three-point soft studio lighting on dark gray obsidian cards (`#0c0d12`), simulated 85mm shallow depth-of-field, continuous camera push-in ($1.00\times \to 1.08\times$), tactile button depression (`scale: 0.95`), zero frantic cuts.

---

### Master Shot & Storyboard Table (60 FPS Frame-Accurate)

| Frame Range | Timestamp | Scene & Camera Movement | Visual Framing (Apple Studio) | Audio & Foley Design | Spoken Voiceover (Calm, Confident) |
|---|---|---|---|---|---|
| **0000–0420** | `00:00 – 00:07` | **The Macro Opening:** Subtle push-in ($1.00\times \to 1.03\times$). Soft ambient floor glow at 12% opacity. | Macro close-up on a dark graphite code waiver card: `// FIXME: bypass auth check for load test`. Ambient soft rim light grazes the top bevel. | Warm analog Rhodes electric piano chord fades in. Low-pass filtered sub-bass drone (-20 dB). | *"A temporary waiver approved on Friday afternoon. To your sprint board, it's just another ticket."* |
| **0421–0960** | `00:07 – 00:16` | **Spatial Pull-Out to Topology:** Camera tracks smoothly back ($1.03\times \to 0.95\times$) using spring dynamics (`damping: 28`). | The single ticket recedes into a dark, multi-layered microservice dependency canvas. Three seemingly harmless waivers light up in soft amber across `checkout-api` and `payments-core`. | Subtle haptic click (mechanical switch foley at -8 dB) as nodes snap into place. | *"To your microservice mesh, it's a silent multi-hop failure path waiting to take down checkout."* |
| **0961–1800** | `00:16 – 00:30` | **The Shift to Reprieve:** Camera glides horizontally with subtle inertia (`easeOutQuart`). | Studio lighting expands. Reprieve's living dependency canvas reveals FalkorDB's real-time risk engine. Critical edges turn luminous violet (`#8b7dff`). | Deep cinematic 40Hz sub-bass hit (-12 dB). Music swells with clean rhythmic warmth (no chaotic percussion). | *"Meet Reprieve. The graph-native architecture safety engine. We model every waiver, test skip, and orphan control as a living promise in FalkorDB."* |
| **1801–2700** | `00:30 – 00:45` | **Developer Ergonomics & Local CLI:** Split macro view. Camera pans into terminal window with simulated 50mm focus. | Terminal cursor blinks smoothly. Command runs: `npx reprieve scan --strict`. Execution completes in `< 15ms`. Instant green checkmark with zero login required. | Crisp tactile keyboard clacks (Keychron mechanical foley at -10 dB). Crisp chime on 15ms finish. | *"Run it locally with zero login in under fifteen milliseconds. Or let it block compound failure paths directly in your pull request."* |
| **2701–3600** | `00:45 – 01:00` | **The Steward Agent Interaction:** Cursor glides on a natural cubic bezier curve toward the Steward Live Chat panel. | Realistic cursor arrives at chat input, presses button (`scale: 0.95`, spring recoil). Steward streams graph-grounded response with shortest proof path. | Soft haptic bubble pop on send. Smooth ambient token streaming soundscape (-16 dB). | *"Steward, our on-call AI agent, recalls historical precedents across our three-graph memory — grounded strictly in mathematical proof paths."* |
| **3601–4200** | `01:00 – 01:10` | **The Resolution & Minimal Brand Mark:** Camera centers on the obsidian lockup. Soft ambient bloom behind logo. | Clean typography: `REPRIEVE`. Monospace subtitle: `npx reprieve scan --strict` · `frontend-six-neon-97.vercel.app`. Subtle glass reflection sweep across the wordmark. | Warm sustained Rhodes chord resolves to root key. Foley: soft physical switch click as lights extinguish. | *"Intercept compound risk before merge. Try the live sandbox today."* |

---

<br/>

# 🎥 VIDEO 2: Official Hackathon Submission & Technical Walkthrough (4–5 Mins)
* **Format:** Authoritative Engineering Demo & Architecture Masterclass (Screen share + Facecam PIP)  
* **Target Duration:** ~4 Minutes 30 Seconds  
* **Audience:** WeMakeDevs & FalkorDB Evaluation Panel, Staff Architects, SRE Leads  
* **Narrator:** Sagar Mahajan (fncreator22)

---

### Detailed Section Breakdown

#### Scene 1: The Thesis — Disasters Are Multi-Hop Graphs (00:00 – 00:50)
* **Visual:** High-definition video feed with clean dark studio backdrop. Seamless cut to the real-world post-mortem breakdown (CrowdStrike $8.5M systems, Knight Capital $440M in 45m).
* **Key Voiceover Points:**
  - Introduce Reprieve as an autonomous, graph-native architecture safety engine and pre-merge circuit breaker.
  - Explain why existing tools fail: Jira, spreadsheets, and scanners evaluate changes in isolation (flat rows). Real cloud disasters occur when individually approved, temporary exceptions compound across architectural boundaries.
  - State the mission: Bringing deterministic graph intelligence to the pre-merge gate.

#### Scene 2: The Three-Graph Architecture in FalkorDB (00:50 – 01:45)
* **Visual:** Full-screen high-contrast architectural schematic of the FalkorDB database cluster:
  1. `platform`: Multi-tenant identity, workspaces, notification dispatch channels.
  2. `org_<ws_id>`: Enterprise domain topology (services, teams, compensating controls, active waivers, dependency edges).
  3. `mem_<ws_id>`: Tri-planar agent memory (`Turn` episodic, `Fact` semantic, `Playbook` procedural, `HandoffTask` state transfers).
* **Key Voiceover Points:**
  - Zero Cypher generation by LLM: All 8 detection rules (R1 to R8) execute pre-compiled, parameterized Cypher queries in under 2ms.
  - 14 read-only Model Context Protocol (MCP) tools for AI IDEs (Cursor, Claude Desktop).
  - Mathematical avalanche centrality ($P = p_0^h$) and sliding temporal collision windows.

#### Scene 3: Live Interactive Platform Walkthrough (01:45 – 03:15)
* **Visual:** Direct browser capture of production environment at `frontend-six-neon-97.vercel.app`.
* **Action Flow:**
  1. **Graph Canvas:** Drag the 30-Day Temporal Horizon Scrubber. Highlight how overlapping waiver expirations light up critical failure vectors.
  2. **Alert Detail & Proof Path:** Click an active R4 Service Concentration alert. Walk through the computed Shortest Proof Path (`payments-gateway` $\to$ `card-token` $\to$ `stripe`).
  3. **Zero-Login CLI Execution:** Split to terminal. Run `node bin/reprieve.mjs scan --strict`. Show the instant 12ms AST scan catching a `#nosec` bypass locally.
  4. **Steward Conversational AI:** Open `/w/northwind-pay/steward`. Ask to extend a critical bypass. Highlight the regex **Groundedness Guard** stripping ungrounded hallucinated IDs in real-time.

#### Scene 4: Production Deployment & Verification Suite (03:15 – 04:00)
* **Visual:** Production dashboards showcasing live infrastructure:
  - Vercel Next.js 16 frontend (`● Ready`)
  - Render FastAPI backend with Redis background tasks
  - FalkorDB Cloud low-latency graph cluster
  - Maileroo & Slack webhook live integration testing
  - Green GitHub Actions CI suite (`Run 38727319869`) with 96/96 passing tests.

#### Scene 5: Conclusion & Open-Source Vision (04:00 – 04:30)
* **Visual:** Closing screen showing MIT License, GitHub repository (`fncreator22/wemakedevs-hackathon`), and live demo link.
* **Closing Line:** *"Modern cloud architectures are living graphs. Reprieve ensures compound risks never make it past your pull request."*
