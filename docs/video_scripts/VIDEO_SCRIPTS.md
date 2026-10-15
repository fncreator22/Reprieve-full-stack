# Reprieve — Video Scripts (Hackathon & Product Marketing)
> **Edition:** Hackathon Production Launch (October 15, 2026)  
> **Status:** Production Ready  

---

# 🎬 VIDEO 1: The Social Media Launch Ad & Teaser
**Format:** High-Energy Product Commercial (X / Twitter, LinkedIn, TikTok, Shorts)  
**Target Duration:** 60–75 Seconds  
**Vibe:** Kinetic, cinematic, dark-mode developer aesthetic (Linear / Vercel style). Punchy cuts, low-frequency bass hits, terminal clatter, zero fluff.

---

### [00:00 – 00:15] The Hook: The Illusion of "Harmless"
* **Visual:** Fast montage. Dark room, glowing monitor. Close-up on Slack: *"Hey, need a quick 48h bypass on the payment service"*. Cut to a Pull Request showing `// FIXME: bypass auth check for load test`. Cut to Jira: Ticket marked `Closed / Approved`.
* **SFX:** Subtle clock ticking $\rightarrow$ muffled heartbeat.
* **Voiceover (Fast, direct, conversational):**  
  *"On Friday at 4:30 PM, an engineer adds a `#nosec` comment to bypass an auth check for a load test. Totally reasonable.*  
  *On Tuesday, another team extends an expired feature flag past Black Friday. Standard procedure.*  
  *And last month, the only senior engineer who understood the billing gateway left the company."*
* **On-Screen Text (Flash cuts):**  
  `TICKET APPROVED` · `WAIVER EXTENDED` · `OWNER: UNASSIGNED`
* **SFX:** Sudden server-down alarm sound $\rightarrow$ instant silence.

---

### [00:15 – 00:30] The Agitation: Sprint Boards Lie
* **Visual:** Zoom out into a sea of isolated Jira tickets and linear spreadsheets. Red warning banners erupt across all of them.
* **Voiceover:**  
  *"To Jira, ServiceNow, and your sprint board, those were three completely unrelated, harmless tickets.*  
  *To your microservice mesh... they just aligned in a straight line to take down checkout for eight hours.*  
  *Modern engineering teams don’t suffer catastrophic outages because of one giant bug. They fail because individually harmless exceptions compound in silence across your architecture."*

---

### [00:30 – 00:50] The Reveal: Reprieve + FalkorDB
* **Visual:** Bass drop. Screen explodes into Reprieve’s live dark-mode graph canvas. Neon violet nodes representing `checkout-api`, `payments-gateway`, and `auth-cluster` pulsing with live dependency vectors.
* **Music:** Punchy electronic synth groove kicks in (60 FPS kinetic energy).
* **Voiceover:**  
  *"Meet **Reprieve** — the world’s first graph-native architecture safety engine.*  
  *Instead of treating risk as flat checklist rows, Reprieve models every waiver, skipped test, and expired certificate as a **living promise** on your FalkorDB knowledge graph."*
* **Visual:** Split screen showing 3 developer workflows:
  1. **Terminal:** `npx reprieve scan --strict` finishes in **< 15ms**.
  2. **GitHub Action:** Bot comments on a PR: *“Blocked: 3-hop compound collision with Auth Service.”*
  3. **Cursor / Claude IDE:** Agent calls Reprieve's Model Context Protocol (MCP) tools.
* **Voiceover:**  
  *"Running eight deterministic topological rules at sub-15 millisecond latency, Reprieve scans your blast radius, calculates 30-day avalanche centrality, and blocks compound failures directly in your pull request."*

---

### [00:50 – 01:05] The Steward AI Agent & Zero-Login Proof
* **Visual:** Live chat window with **Steward** (the FalkorDB-backed AI agent). The user types: *"Can we extend the settlement bypass for 14 days?"*  
Steward streams back tokens instantly: *"Blocked by Rule R4: Creates a single point of failure on the Checkout customer path. Shortest proof path: payments-gateway $\rightarrow$ card-token $\rightarrow$ stripe."*
* **Voiceover:**  
  *"And with our tri-planar memory model, our on-call AI agent **Steward** remembers every past decision, grounded strictly in graph proof paths with zero AI hallucinations."*

---

### [01:05 – 01:15] The Call to Action
* **Visual:** High-contrast final card. URL typed in monospace: `frontend-six-neon-97.vercel.app`. Zero-login badge glowing.
* **Voiceover:**  
  *"No sign-up. No credit card. Zero login required to test.*  
  *Run `npx reprieve scan` or explore the Northwind Pay sandbox today.*  
  ***Reprieve. Intercept compound risk before merge.***"*
* **On-Screen Text:**  
  **REPRIEVE**  
  `npx reprieve scan --strict`  
  *Live Demo: frontend-six-neon-97.vercel.app*

---

<br/>

---

# 🎥 VIDEO 2: Official Hackathon Submission & Technical Walkthrough
**Format:** YouTube Presentation & Deep Technical Demo (Screen share + Facecam PIP)  
**Target Duration:** ~4 to 5 Minutes  
**Audience:** WeMakeDevs & FalkorDB Judges, Lead Engineers, Architects  
**Tone:** Confident, technically precise, authoritative, storytelling-driven.

---

## Part 1: The Origin Story & Problem Statement (00:00 – 00:45)
* **Visual:** High-resolution facecam or clear voiceover with Reprieve architecture hero graphic in the background.
* **Spoken Script:**
  > *"Hello judges, developers, and the WeMakeDevs & FalkorDB community! My name is Sagar Mahajan, and this is **Reprieve** — an autonomous, graph-native architecture safety engine and pre-merge circuit breaker.*
  >
  > *If you examine the post-mortems of history’s most expensive tech disasters — from Knight Capital losing $440M in 45 minutes to the CrowdStrike sensor crash or the Change Healthcare blackout — they all share a single hidden truth:*
  >
  > *Disasters don't happen because of a single syntax error. They happen because engineers approve individually harmless, temporary exceptions: a skipped integration test, an unowned service waiver, or an expired feature flag. In a spreadsheet or Jira board, each ticket looks completely benign. But in the microservice topology, these temporary waivers overlap, compounding into catastrophic multi-hop failure paths.*
  >
  > *We built Reprieve to answer one fundamental question: **What if your CI/CD pipeline and your AI agents could understand your entire architecture graph before code ever merges?**"*

---

## Part 2: Architecture & FalkorDB Tri-Planar Memory (00:45 – 01:40)
* **Visual:** Cut to full-screen technical diagram from `README.md` showing the three graphs: `platform`, `org_<ws_id>`, and `mem_<ws_id>`.
* **Spoken Script:**
  > *"At the heart of Reprieve is **FalkorDB**, which powers our three-graph architecture across the three competition tracks:*
  >
  > 1. *First, the **Company Brain** (`org_<ws_id>`): A live domain graph tracking services, teams, owners, controls, and active waivers across your company. We run eight deterministic topological rules — R1 through R8 — written in pre-compiled, parameterized Cypher. **The LLM never generates Cypher**. It is 100% deterministic, running traversals in under 2 milliseconds.*
  >
  > 2. *Second, the **Tri-Planar Agent Memory** (`mem_<ws_id>`): When our autonomous agent **Steward** interacts with engineers, it writes episodic `Turn` nodes and semantic `Fact` nodes. When critical alerts fire, it writes `HandoffTask` nodes so the next on-call agent inherits full historical context.*
  >
  > 3. *Third, **Agents Acting on Connected Data**: Reprieve exposes 14 read-only Model Context Protocol (MCP) tools that Cursor, Claude Desktop, and our CLI consume to reason over graph reachability, temporal expiry collisions, and avalanche centrality ($P = p_0^h$)."*

---

## Part 3: Live Interactive Demo (01:40 – 03:30)

### Scene A: The Northwind Pay Living Graph (01:40 – 02:15)
* **Visual:** Open `https://frontend-six-neon-97.vercel.app/w/northwind-pay/home`.
* **Spoken Script:**
  > *"Let's see it in action on our production platform. Here is **Northwind Pay**, our enterprise fintech ground-truth environment containing 25 microservices, 8 teams, 60 exceptions, and 24 live alerts.*
  >
  > *(Navigate to the Graph Canvas: `/w/northwind-pay/graph`)*  
  > *Notice this interactive dependency canvas. Unlike a static diagram, this graph recalculates risk dynamically. When I drag the **30-Day Temporal Horizon Scrubber** at the bottom, Reprieve projects the graph into the future, identifying date collision windows where multiple waivers expire simultaneously on the same critical customer path.*
  >
  > *(Click on an Alert card: `/w/northwind-pay/alerts`)*  
  > *Look at Alert #1: An R4 Service Concentration alert on `checkout-api`. Reprieve doesn't just give you a warning; it computes the **Shortest Proof Path** through the graph — proving exactly which compensating controls are broken and which downstream services are exposed."*

### Scene B: The Zero-Login CLI Pre-Merge Gate (02:15 – 02:45)
* **Visual:** Switch to a split terminal screen showing `bin/reprieve.mjs`.
* **Spoken Script:**
  > *"Now let's look at developer ergonomics. A safety engine is useless if it requires engineers to log in to another dashboard. That's why Reprieve includes a **Zero-Login AST Scanner**.*
  >
  > *(Type: `node bin/reprieve.mjs scan --strict`)*  
  > *In under 15 milliseconds, it parses local source files for temporary `#nosec` or bypass tags, checks against the FalkorDB topology, and prints the exact dependency chain. In GitHub Actions, this workflow runs as a pull-request gate, blocking merges that introduce multi-hop cascading outages."*

### Scene C: The Steward Conversational Agent (02:45 – 03:30)
* **Visual:** Navigate to the Steward Live Chat tab (`/w/northwind-pay/steward`).
* **Spoken Script:**
  > *"Next, let's look at our agent layer: **Steward**.  
  > Steward is an SSE streaming conversational assistant backed by our 14 MCP graph tools.  
  >
  > *(Type in chat: 'Can we approve a 30-day TLS waiver for payments-gateway?')*  
  >
  > *Watch the inspection panel: Steward executes `get_service`, runs `predict_avalanche`, and calls `recall_precedent` on the FalkorDB memory graph.*
  >
  > *Notice that Steward never hallucinates entity IDs. Our regex **Groundedness Guard** interceptor inspects the tool response payload, stripping any unverified node before the answer reaches the user. It explains clearly: 'Denied. Extending this waiver creates a high-blast wave affecting settlement-service and ledger-core.'*
  >
  > *And because tools are strictly **read-only**, any write operation is returned as a `ProposedAction` that requires explicit human approval."*

---

## Part 4: Production Deployment & Verification Suite (03:30 – 04:15)
* **Visual:** Show GitHub Actions green CI badge (`Run 38727319869`), Render dashboard, and Vercel production dashboard.
* **Spoken Script:**
  > *"Reprieve is not a prototype; it is running live in production right now:
  > - **Frontend**: Deployed on **Vercel** with Next.js 16 and Turbopack.
  > - **Backend**: Deployed on **Render** via Docker and FastAPI.
  > - **Database**: High-performance **FalkorDB Cloud** cluster.
  > - **Integrations**: Live notification dispatch via Maileroo transactional emails, Slack webhooks, and signed HMAC enterprise webhooks.
  >
  > *Our evaluation harness runs automated benchmarks with 100% recall on planted outage scenarios, 0.00% false positive rates on control services, and sub-2.5 millisecond p95 graph query latencies."*

---

## Part 5: Conclusion & Vision (04:15 – 04:45)
* **Visual:** Facecam returns. Overlay of the repository URL and live app link.
* **Spoken Script:**
  > *"Modern cloud systems are graphs, not lists. By combining the speed of FalkorDB with deterministic topological rules and grounded AI agent memory, Reprieve prevents compound failures before code ever reaches production.*
  >
  > *The codebase is 100% open source under the MIT license on GitHub at `fncreator22/wemakedevs-hackathon`.*
  >
  > *Thank you to WeMakeDevs and FalkorDB for organizing this hackathon. Try the live sandbox today at `frontend-six-neon-97.vercel.app`!"*
