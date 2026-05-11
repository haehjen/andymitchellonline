import React, { useMemo, useRef, useState } from "react";

const components = {
  fasthosts: {
    title: "Fasthosts",
    subtitle: "Domain Registrar",
    accent: "blue",
    icon: "FH",
    description:
      "Fasthosts is the domain registrar for the public domain before DNS and website traffic are handled by Cloudflare.",
    bullets: ["Domain registration", "Renewal management", "Nameserver delegation", "Registrar control"],
    note: "Fasthosts owns the registrar layer only. Runtime traffic moves on to Cloudflare and the home-hosted stack.",
  },
  cloudflare: {
    title: "Cloudflare",
    subtitle: "Website & DNS",
    accent: "orange",
    icon: "CF",
    description:
      "Cloudflare handles public DNS, edge protection, and Cloudflare Pages hosting for this site before traffic reaches the home lab.",
    bullets: ["Cloudflare Pages hosts this site", "DNS records", "DDNS automation", "Proxy and WAF rules", "TLS edge security"],
    note: "This page is built from GitHub and deployed on Cloudflare Pages, while DNS also routes homelab hostnames.",
  },
  youfibre: {
    title: "YouFibre",
    subtitle: "ISP & Static IP",
    accent: "red",
    icon: "YF",
    description:
      "YouFibre provides the internet connection. CGNAT is the default, so a paid static IP is used as the mitigation for reliable inbound access.",
    bullets: ["CGNAT by default", "Paid static IP mitigation", "Home fibre connection", "Inbound route", "WAN handoff"],
    note: "The static IP is what makes direct inbound routing to the home lab predictable despite consumer CGNAT defaults.",
  },
  nginx: {
    title: "Nginx Reverse Proxy",
    subtitle: "All Incoming Traffic",
    accent: "green",
    icon: "NX",
    description:
      "Nginx receives public traffic, routes requests to the correct internal service by hostname, and keeps free SSL certificates renewed automatically for each host.",
    bullets: ["Automated free SSL renewal per host", "SSL handoff", "Host-based routing", "Force HTTPS", "Health checks"],
    note: "Nginx is the internal front door, mapping hostnames to the right service while keeping certificates current.",
  },
  entra: {
    title: "Microsoft Entra ID",
    subtitle: "Authentication",
    accent: "blue",
    icon: "ID",
    description:
      "Entra handles single sign-on and access controls for services that need identity-aware access.",
    bullets: ["SSO and access policies", "MFA support", "External identity", "Conditional access"],
    note: "Identity-aware services can lean on Entra rather than each app carrying its own access model.",
  },
  minecraft: {
    title: "Minecraft Server",
    subtitle: "Game Hosting",
    accent: "green",
    icon: "MC",
    description:
      "A dedicated game service exposed through the home lab route with its own VM boundary.",
    bullets: ["Port 25565", "Dedicated VM", "Backups enabled", "Resource limits"],
    note: "Minecraft runs as a public game workload behind the same ingress model as the rest of the lab.",
  },
  dayz: {
    title: "DayZ Server",
    subtitle: "Game Hosting",
    accent: "slate",
    icon: "DZ",
    description:
      "DayZ hosting runs as an isolated service with public ingress routed through the same public IP.",
    bullets: ["Port 2302", "Dedicated VM", "Isolated configs", "Scheduled restarts"],
    note: "DayZ is isolated as its own public game service so config, mods, and restarts stay contained.",
  },
  mitch: {
    title: "Mitch AI Assistant",
    subtitle: "Local AI Services",
    accent: "orange",
    icon: "AI",
    description:
      "Local AI workloads sit behind the reverse proxy so private tools can be reached securely.",
    bullets: ["Port 8080", "Local inference", "Private tools", "Controlled access"],
    note: "Mitch is the local intelligence layer that other systems can call into through a controlled API boundary.",
    readMoreHref: "/mitch",
  },
  filebrowser: {
    title: "FileBrowser",
    subtitle: "Public File Share",
    accent: "blue",
    icon: "FB",
    description:
      "FileBrowser is a Linux-hosted public file share exposed at fileshare.andymitchell.online and routed securely through Nginx.",
    bullets: [
      "fileshare.andymitchell.online",
      "Linux-hosted deployment",
      "Routed through Nginx",
      "Automated SSL renewal",
      "Dedicated public file share",
    ],
    readMoreHref: "/fileshare",
    note: "FileBrowser gives the lab a public file-share surface without exposing the underlying Linux host directly.",
  },
  mitchmesh: {
    title: "MitchMesh",
    subtitle: "Autonomous Drone Mesh",
    accent: "cyan",
    icon: "MM",
    description:
      "MitchMesh connects Mitch to six ESP32-based automated drone nodes using LoRa radio and GPS positioning.",
    bullets: [
      "Six automated ESP32 drone nodes",
      "RA-02 LoRa radio link",
      "NEO-3M GPS positioning",
      "Mitch API publishes target coordinates",
      "Motor controllers and power regulation onboard",
    ],
    readMoreHref: "/mitchmesh",
    note: "MitchMesh extends the lab into physical hardware, letting Mitch coordinate GPS-aware field nodes.",
  },
  proxmox: {
    title: "Proxmox VE Cluster",
    subtitle: "Virtualization Platform",
    accent: "orange",
    icon: "PX",
    description:
      "A three-node Proxmox cluster running on HP ProLiant ML350 Gen9 servers with matching specifications and ZFS storage.",
    bullets: [
      "3x HP ProLiant ML350 Gen9",
      "3-node high availability cluster",
      "ZFS for storage and snapshots",
      "Live migration and failover",
      "Backups and redundancy",
    ],
    note: "The Proxmox cluster is the compute foundation for the self-hosted workloads and storage-backed VM estate.",
  },
  raspberry: {
    title: "House Wearable",
    subtitle: "Field Base Station",
    accent: "red",
    icon: "PI",
    description:
      "A wearable Raspberry Pi carried by House, the architect. It talks to the Mitch API, passes text into the system, checks for instructions left by Mitch, and acts as a field base station for MitchMesh.",
    bullets: [
      "Wearable Raspberry Pi carried by House",
      "Passes text to the Mitch API",
      "Checks in for Mitch instructions",
      "Field base station for MitchMesh",
      "Mobile bridge between operator and mesh",
    ],
    note: "House Wearable is the human-field interface between House, Mitch, and the MitchMesh hardware network.",
  },
};

const accent = {
  orange: "border-orange-200 text-orange-600 bg-orange-50",
  green: "border-emerald-200 text-emerald-700 bg-emerald-50",
  blue: "border-sky-200 text-sky-700 bg-sky-50",
  cyan: "border-cyan-200 text-cyan-700 bg-cyan-50",
  slate: "border-slate-200 text-slate-700 bg-slate-50",
  red: "border-rose-200 text-rose-700 bg-rose-50",
};

const publicRepoComponents = new Set(["cloudflare", "minecraft", "dayz", "mitch", "mitchmesh", "raspberry"]);

const mitchModules = [
  {
    name: "gpt_handler.py",
    role: "LLM Router",
    text: "Builds system prompts from persona, memory, and active injections. Streams through Ollama or OpenAI, emits token events, and bridges normal chat into contextual event streams.",
  },
  {
    name: "event_bus.py",
    role: "Event Spine",
    text: "Central pub/sub layer for EMIT_* traffic. It normalizes common payloads, records emitter/subscriber relationships, and keeps modules decoupled.",
  },
  {
    name: "event_registry.py",
    role: "Intent Map",
    text: "Tracks emitted/subscribed events and scores human text against registered intents. Guards against vague keywords so actions do not trigger on weak matches.",
  },
  {
    name: "interpreter.py",
    role: "Input Brainstem",
    text: "Receives text from users and HouseCore, deduplicates prompts, matches intents first, then escalates ambiguous input to chat generation.",
  },
  {
    name: "dispatcher.py",
    role: "Action Dispatcher",
    text: "Handles structured user intents such as drone launch and visual inspection. Unknown dynamic intents are routed through injection-defined events.",
  },
  {
    name: "memory.py",
    role: "Continuity Store",
    text: "Persists conversation turns to JSONL and stores tagged knowledge facts. Recent memory and identity facts are recalled into prompt context.",
  },
  {
    name: "persona.py",
    role: "Identity Kernel",
    text: "Loads the locked persona, emotion state, recent memory, known facts, and event summaries. Produces the system prompt that keeps Mitch consistent.",
  },
  {
    name: "ears.py",
    role: "Audio Intake",
    text: "Continuously captures microphone audio, pauses while Mitch speaks, and emits audio files into the event bus for transcription.",
  },
  {
    name: "transcriber.py",
    role: "Speech to Text",
    text: "Processes captured WAV files with speech recognition, rejects duplicate phrases, cleans up temp files, and emits clean user input.",
  },
  {
    name: "stream_mouth.py",
    role: "Voice Output",
    text: "Buffers streamed text chunks, synthesizes speech with Piper, plays audio through PyAudio, and emits browser audio chunks when enabled.",
  },
  {
    name: "vision.py",
    role: "Camera Capture",
    text: "Controls host camera exposure with v4l2 settings, captures frames through OpenCV, and writes the latest image for visual modules.",
  },
  {
    name: "vision_ai.py",
    role: "Visual Reasoning",
    text: "Uses fresh browser camera frames or host capture fallback, then asks GPT-4o to describe scenes or identify objects from the camera URL.",
  },
  {
    name: "module_editor.py",
    role: "Code Mutation Guard",
    text: "Creates, reads, and edits modules only inside MITCH_ROOT. Edits are backed up and path checks prevent writes outside the project boundary.",
  },
  {
    name: "peterjones.py",
    role: "Inner Log",
    text: "Creates shared rotating/file loggers and wildcard event logging. Noisy events and modules are suppressed unless debug mode is enabled.",
  },
  {
    name: "keys_loader.py",
    role: "Secret Loader",
    text: "Loads environment keys from the local mitchskeys file, supporting shell-style exports without overwriting variables already present.",
  },
  {
    name: "config.py",
    role: "Runtime Config",
    text: "Defines MITCH_ROOT and debug flags from environment variables so modules share the same runtime base path and diagnostics mode.",
  },
];

const mitchCapabilityModules = [
  {
    name: "automated_flight_tracker.py",
    role: "Airspace Watcher",
    text: "Polls flight state data, filters contacts by region and interest, then publishes a decluttered JSON view for visual overlays.",
  },
  {
    name: "flight_tracker.py",
    role: "Flight Query",
    text: "Answers user flight questions from the published contact cache. It hooks normal input so aviation status can be queried conversationally.",
  },
  {
    name: "proxmon.py",
    role: "Proxmox Control",
    text: "Talks to the Proxmox API for VM status and restart actions. Registered intents turn natural requests into infrastructure operations.",
  },
  {
    name: "weather_fetcher.py",
    role: "Weather Skill",
    text: "Fetches weather data for spoken or typed locations and emits concise responses back through Mitch's event and speech pipeline.",
  },
  {
    name: "web_search.py",
    role: "Web Search",
    text: "Provides a search tool surface for current information. Results can be emitted as tool output or fed back into chat context.",
  },
  {
    name: "news_digester.py",
    role: "News Digest",
    text: "Tracks conversation and heartbeat events, refreshes topic searches, and produces digest-style summaries instead of raw article dumps.",
  },
  {
    name: "protest_tracker.py",
    role: "Civic Monitor",
    text: "Runs on heartbeat and maintains a watch layer for protest-related information, making public activity available to the assistant.",
  },
  {
    name: "file_ingestor.py",
    role: "File Intake",
    text: "Classifies uploaded files, extracts text from PDFs, HTML, images, and plain text, then converts files into usable context.",
  },
  {
    name: "folder_access.py",
    role: "Folder Access",
    text: "Provides a controlled file-system access module so Mitch can inspect known folders without exposing the whole host casually.",
  },
  {
    name: "system_interaction_enhancer.py",
    role: "File Operations",
    text: "Implements directory listing, file creation, and deletion events. Actions are logged as context changes for traceability.",
  },
  {
    name: "module_editor.py",
    role: "Core Edit Bridge",
    text: "The core editor handles bounded code changes; this module layer uses that pattern for controlled self-extension workflows.",
  },
  {
    name: "dynamic_intent_creator.py",
    role: "Intent Creation",
    text: "Watches failed intent matches and can create new dynamic intent definitions so repeated unknown commands become routable.",
  },
  {
    name: "dynamic_intent_updater.py",
    role: "Intent Refinement",
    text: "Listens for failed matches and updates intent data, improving how Mitch maps future user language onto actions.",
  },
  {
    name: "skills_catalog.py",
    role: "Skill Index",
    text: "Collects user-facing registered intents and renders a summary of what Mitch can do, giving the assistant a discoverable command surface.",
  },
  {
    name: "goal_tracker.py",
    role: "Goals",
    text: "Stores goals, progress updates, status checks, and clears. Each operation is exposed through registered intent handlers.",
  },
  {
    name: "task_automator.py",
    role: "Tasks",
    text: "Creates and manages task-style actions through event handlers, turning spoken planning requests into structured system state.",
  },
  {
    name: "task_scheduler.py",
    role: "Scheduler",
    text: "Schedules task events and adjusts timing through the event bus, giving Mitch a lightweight background automation loop.",
  },
  {
    name: "personalized_scheduler.py",
    role: "Personal Timing",
    text: "Consumes user activity signals and adapts recommendations around observed usage, rather than treating every reminder as static.",
  },
  {
    name: "habit_inspector.py",
    role: "Habits",
    text: "Logs habit events and runs simple habit analysis, making behavioural patterns available to the assistant.",
  },
  {
    name: "user_engagement_tracker.py",
    role: "Engagement",
    text: "Tracks user interaction signals that other modules can use to decide whether to speak, wait, summarize, or stay quiet.",
  },
  {
    name: "user_feedback_collector.py",
    role: "Feedback",
    text: "Captures user feedback as structured data so future responses and behaviours can be tuned from real interaction.",
  },
  {
    name: "user_prompt_inbox.py",
    role: "Prompt Inbox",
    text: "Stores and processes inbound prompts as a queue, giving remote or deferred inputs a place to wait before handling.",
  },
  {
    name: "proactive_notifier.py",
    role: "Proactive Alerts",
    text: "Combines heartbeat, alert, and digest events to decide when Mitch should interrupt with a useful notification.",
  },
  {
    name: "on_heartbeat_inactive.py",
    role: "Idle Awareness",
    text: "Tracks last input and heartbeat state so Mitch can respond differently when the system has been quiet for a while.",
  },
  {
    name: "publish_logs.py",
    role: "Digest Publisher",
    text: "Tails logs, memory, knowledge, and inner monologue into compact published digests for the visual layer and notifier modules.",
  },
  {
    name: "inspection_log_digester.py",
    role: "Inspection Digest",
    text: "Summarizes inspection logs into smaller digest records that can be reused by reflective and visual systems.",
  },
  {
    name: "reflective_analyzer.py",
    role: "Reflection",
    text: "Consumes inspection digest events and turns them into analysis, giving Mitch a lightweight self-review loop.",
  },
  {
    name: "decision_maker.py",
    role: "Decision Helper",
    text: "Handles explicit decision requests, scoring options and emitting a decision response through the event bus.",
  },
  {
    name: "resource_optimizer.py",
    role: "Resource Advice",
    text: "Responds to system health events and suggests optimizations when resources or operating conditions look poor.",
  },
  {
    name: "system_health_monitor.py",
    role: "Health Monitor",
    text: "Checks system health on demand and exposes that check as an intent so Mitch can report operational status.",
  },
  {
    name: "route_planner.py",
    role: "Route Planning",
    text: "Accepts coordinate route events and produces route geometry, a useful primitive for field systems like MitchMesh.",
  },
  {
    name: "geocode.py",
    role: "Geocoding",
    text: "Converts place names into coordinates so human language can become location data for routes, weather, and field actions.",
  },
  {
    name: "rtsp_stream.py",
    role: "RTSP Video",
    text: "Maintains an RTSP stream module with start and shutdown hooks, giving Mitch a live-video source when enabled.",
  },
  {
    name: "visual/visual_web.py",
    role: "Visual Server",
    text: "Serves the browser-based visual interface and static camera/map assets used by the orb and situational displays.",
  },
  {
    name: "visual/orb.html + main.js",
    role: "Orb Interface",
    text: "Implements the visual front-end for Mitch: animated orb, browser-side state, audio hooks, and live presentation surfaces.",
  },
  {
    name: "nssr_designer.py",
    role: "NSSR Designer",
    text: "Processes file-ready and speech-end events to support a design workflow module with its own internal state machine.",
  },
  {
    name: "youtube_music_skill.py",
    role: "Music Skill",
    text: "Registers music intents and drives YouTube-based playback behaviour from conversational commands.",
  },
  {
    name: "imdb_intent.py",
    role: "IMDb Skill",
    text: "Searches IMDb-style pages, extracts structured metadata and relevant excerpts, then augments chat with focused film context.",
  },
  {
    name: "pokemon_wiki_intent.py",
    role: "Pokemon Wiki",
    text: "Searches wiki content, strips markup, extracts relevant lines, and feeds concise Pokemon context back into chat.",
  },
  {
    name: "tarkov_wiki_intent.py",
    role: "Tarkov Wiki",
    text: "Searches Tarkov wiki pages and pulls focused quest/objective excerpts so Mitch can answer game-specific questions.",
  },
  {
    name: "bannerlord_wiki_intent.py",
    role: "Bannerlord Wiki",
    text: "Runs a Bannerlord-specific wiki search and excerpt pipeline, turning fandom/wiki pages into useful chat context.",
  },
];

function Nav() {
  return (
    <header className="border-b border-white/5 bg-[#07111f]/90">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded border border-blue-400/40 bg-blue-500/10 text-sm font-black text-blue-300">
            H
          </div>
          <div>
            <div className="text-sm font-bold text-white">Homelab OS</div>
            <div className="text-[10px] text-slate-400">Self-Hosted. Zero Cost. Unlimited Potential.</div>
          </div>
        </div>
        <nav className="hidden items-center gap-9 text-xs font-semibold text-slate-300 md:flex">
          <a className="border-b-2 border-blue-500 pb-3 text-blue-300" href="#overview">Overview</a>
          <a href="https://mitch.andymitchell.online">M.I.T.C.H</a>
          <a href="#blog">Blog</a>
          <a href="#about">About</a>
        </nav>
      </div>
    </header>
  );
}

function LogoBadge({ children, className = "" }) {
  return (
    <div className={`grid h-12 w-12 place-items-center rounded-full border bg-white text-[11px] font-black shadow-md ${className}`}>
      {children}
    </div>
  );
}

function GitHubBadge() {
  return (
    <span
      className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border border-slate-200 bg-white shadow-sm"
      title="Public GitHub repository"
      aria-label="Public GitHub repository"
    >
      <img src="/github.svg" alt="" className="h-3.5 w-3.5" />
    </span>
  );
}

function ExternalCard({ id, children, onSelect }) {
  const item = components[id];
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      {children}
      <div className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-900">{item.title.split(" ")[0]}</div>
      <div className="mt-1 text-[9px] font-semibold text-slate-500">{item.subtitle}</div>
    </button>
  );
}

function FlowCard({ id, image, imageClass, onSelect }) {
  const item = components[id];
  const hasPublicRepo = publicRepoComponents.has(id);

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="relative w-full rounded-lg border border-slate-200 bg-white px-6 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      {hasPublicRepo && <GitHubBadge />}
      <img src={image} alt="" className={`mx-auto object-contain ${imageClass}`} />
      <div className="mt-3 text-[10px] font-black uppercase tracking-wide text-slate-900">{item.title}</div>
      <div className="mt-1 text-[9px] font-semibold text-slate-500">{item.subtitle}</div>
    </button>
  );
}

function FlowConnector() {
  return (
    <div className="flex h-7 items-center justify-center">
      <div className="h-full w-px bg-blue-400" />
    </div>
  );
}

function ServerIcon() {
  return (
    <div className="relative h-10 w-14 rounded-md border border-slate-500 bg-gradient-to-b from-slate-700 to-slate-900 shadow-md">
      <div className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
      <div className="absolute left-5 top-2 h-1 w-6 rounded bg-slate-500" />
      <div className="absolute left-2 right-2 top-5 h-px bg-slate-600" />
      <div className="absolute bottom-2 left-2 h-1 w-9 rounded bg-slate-600" />
    </div>
  );
}

function ServiceCard({ id, onSelect }) {
  const item = components[id];
  const hasPublicRepo = publicRepoComponents.has(id);
  const meta =
    id === "minecraft"
      ? "Port: 25565"
      : id === "dayz"
        ? "Port: 2302"
        : id === "mitch"
          ? "Port: 8080"
          : id === "filebrowser"
            ? "Public Share"
            : id === "mitchmesh"
              ? "LoRa + GPS"
              : id === "raspberry"
                ? "Wearable"
                : "Private";

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="relative flex min-h-[128px] flex-col items-center rounded-lg border border-slate-200 bg-white px-3 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      {hasPublicRepo && <GitHubBadge />}
      <LogoBadge className={`mx-auto mb-2 h-9 w-9 ${accent[item.accent]}`}>{item.icon}</LogoBadge>
      <div className="max-w-full text-[12px] font-black leading-4 text-slate-900">{item.title}</div>
      <div className="mt-1 max-w-full text-[10px] font-semibold leading-4 text-slate-500">{item.subtitle}</div>
      <div className="mt-auto max-w-full whitespace-nowrap pt-2 text-[10px] font-bold leading-3 text-emerald-600">
        {meta}
      </div>
    </button>
  );
}

function DetailPanel({ selected, onClose }) {
  const item = components[selected];
  const showReadMore = selected !== "fasthosts";

  return (
    <aside className="rounded-xl bg-white p-5 text-slate-800 shadow-2xl ring-1 ring-slate-200">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-black">Component Details</h2>
        <button
          type="button"
          onClick={onClose}
          className="grid h-7 w-7 place-items-center rounded-full text-lg leading-none text-slate-500 hover:bg-slate-100"
          aria-label="Close details"
        >
          x
        </button>
      </div>
      <div className="rounded-lg border border-slate-100 bg-slate-50/70 p-5">
        <LogoBadge className={`mb-3 h-16 w-16 rounded-xl text-lg ${accent[item.accent]}`}>{item.icon}</LogoBadge>
        <h3 className="text-lg font-black text-slate-950">{item.title}</h3>
        <div className="mb-4 text-xs font-bold text-blue-600">{item.subtitle}</div>
        <p className="text-sm leading-6 text-slate-700">{item.description}</p>
        <ul className="mt-5 space-y-2 text-sm">
          {item.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2 text-slate-700">
              <span className="font-black text-emerald-500">✓</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 rounded-lg bg-blue-50 p-4 text-xs leading-5 text-slate-700">
          {item.note}
        </div>
        {showReadMore && (
          <a
            href={item.readMoreHref || "#"}
            className="mt-5 block w-full rounded-lg bg-blue-600 px-4 py-3 text-center text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500"
          >
            Read More →
          </a>
        )}
      </div>
    </aside>
  );
}

function Diagram({ selected, onSelect }) {
  const services = ["minecraft", "dayz", "mitch", "filebrowser", "mitchmesh", "raspberry"];
  const serviceRailRef = useRef(null);
  const serviceRefs = useRef({});
  const ingressFlow = [
    { id: "fasthosts", image: "/fasthosts.svg", imageClass: "h-6" },
    { id: "cloudflare", image: "/cloudflare.svg", imageClass: "h-9" },
    { id: "youfibre", image: "/youfibre.png", imageClass: "h-6" },
  ];
  const scrollServices = (direction) => {
    const rail = serviceRailRef.current;
    if (!rail) return;

    rail.scrollBy({
      left: direction * rail.clientWidth,
      behavior: "smooth",
    });
  };
  const handleServiceScroll = () => {
    const rail = serviceRailRef.current;
    if (!rail || window.matchMedia("(min-width: 768px)").matches) return;

    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    let nearestService = services[0];
    let nearestDistance = Number.POSITIVE_INFINITY;

    services.forEach((service) => {
      const node = serviceRefs.current[service];
      if (!node) return;

      const nodeCenter = node.offsetLeft + node.offsetWidth / 2;
      const distance = Math.abs(nodeCenter - railCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestService = service;
      }
    });

    if (nearestService !== selected) {
      onSelect(nearestService);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl bg-slate-50 p-4 text-slate-900 shadow-2xl ring-1 ring-white/20 sm:p-7">
      <div className="relative mx-auto min-w-0 max-w-[900px]">
        <div className="flex flex-col items-center">
          <div className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-[10px] font-black uppercase tracking-wide text-blue-700">
            Public Internet
          </div>
          <FlowConnector />
          <div className="flex w-full max-w-[300px] flex-col items-center">
            {ingressFlow.map((item) => (
              <React.Fragment key={item.id}>
                <FlowCard id={item.id} image={item.image} imageClass={item.imageClass} onSelect={onSelect} />
                <FlowConnector />
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="mx-auto max-w-[360px]">
          <button
            type="button"
            onClick={() => onSelect("nginx")}
            className="w-full rounded-lg border border-slate-200 bg-white px-8 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="text-3xl font-black tracking-tight text-emerald-600">NGINX</div>
            <div className="mt-1 text-xs font-black text-slate-950">Nginx Reverse Proxy</div>
            <div className="mt-1 text-[10px] text-slate-500">All incoming traffic routed by hostname</div>
          </button>
        </div>

        <div className="relative mx-auto h-14 max-w-[840px]">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-blue-400" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-400" />
        </div>

        <div className="relative pt-5">
          <button
            type="button"
            onClick={() => scrollServices(-1)}
            className="absolute left-0 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-700 shadow-md md:hidden"
            aria-label="Previous service"
          >
            ‹
          </button>
          <div className="px-11 md:px-0">
            <div
              ref={serviceRailRef}
              onScroll={handleServiceScroll}
              className="flex min-w-0 snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] md:grid md:overflow-visible md:pb-0 md:grid-cols-3 xl:grid-cols-6"
            >
              {services.map((service) => (
                <div
                  key={service}
                  ref={(node) => {
                    serviceRefs.current[service] = node;
                  }}
                  className="relative min-w-0 flex-[0_0_100%] snap-center md:flex-auto"
                >
                  <span className="absolute left-1/2 top-[-20px] hidden h-5 w-px -translate-x-1/2 bg-blue-400 md:block" />
                  <ServiceCard id={service} onSelect={onSelect} />
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            onClick={() => scrollServices(1)}
            className="absolute right-0 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border border-slate-200 bg-white text-lg font-black text-slate-700 shadow-md md:hidden"
            aria-label="Next service"
          >
            ›
          </button>
        </div>

        <div className="mt-6 lg:hidden">
          <DetailPanel selected={selected} onClose={() => onSelect("proxmox")} />
        </div>

        <button
          type="button"
          onClick={() => onSelect("proxmox")}
          className="mt-8 grid w-full gap-5 rounded-lg border border-emerald-300 bg-emerald-50/70 p-5 text-left transition hover:border-emerald-500 md:grid-cols-[220px_1fr_120px]"
        >
          <div className="flex items-center gap-4">
            <LogoBadge className="rounded-lg border-orange-200 bg-orange-50 text-orange-600">PX</LogoBadge>
            <div>
              <div className="text-sm font-black text-slate-950">Proxmox VE Cluster</div>
              <div className="mt-1 text-[10px] text-slate-600">3-node cluster</div>
              <div className="text-[10px] text-slate-600">Virtualization platform</div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["McGregor", "Node 1"],
              ["Pereira", "Node 2"],
              ["Strickland", "Node 3"],
            ].map(([name, node]) => (
              <div key={name} className="flex items-center gap-3 rounded-md bg-white/70 p-3">
                <ServerIcon />
                <div>
                  <div className="text-[10px] font-black">HP ProLiant</div>
                  <div className="text-[10px]">ML350 Gen9</div>
                  <div className="text-[10px] font-black text-slate-900">{name}</div>
                  <div className="text-[10px] font-bold text-emerald-600">{node}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 rounded-md bg-white/70 p-3">
            <div className="h-10 w-10 rounded-full bg-blue-500" />
            <div>
              <div className="text-[10px] font-black">ZFS Storage</div>
              <div className="text-[10px]">Redundant</div>
              <div className="text-[10px] font-bold text-emerald-600">Fast</div>
            </div>
          </div>
        </button>

      </div>
    </section>
  );
}

function MitchModuleCard({ module, index }) {
  return (
    <article className="relative rounded-lg border border-slate-700/70 bg-[#0d1a2a]/95 p-4 shadow-xl shadow-black/10">
      <div className="absolute left-1/2 top-[-28px] hidden h-7 w-px -translate-x-1/2 bg-cyan-400/50 lg:block" />
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="font-mono text-[11px] font-bold text-cyan-300">{module.name}</div>
          <h3 className="mt-1 text-sm font-black text-white">{module.role}</h3>
        </div>
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-cyan-400/30 bg-cyan-400/10 text-[10px] font-black text-cyan-200">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="text-xs leading-5 text-slate-300">{module.text}</p>
    </article>
  );
}

function MitchPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#081421] text-slate-200">
      <div className="mx-auto min-h-screen max-w-[1420px] overflow-hidden rounded-none border border-slate-700/60 bg-[#0b1828] shadow-2xl lg:my-1 lg:rounded-xl">
        <Nav />
        <main className="bg-[radial-gradient(circle_at_50%_12%,rgba(14,165,233,0.26),transparent_34%),linear-gradient(180deg,#0c1c2f_0%,#07111f_100%)] px-4 py-6 sm:px-6 sm:py-8">
          <section className="mx-auto max-w-[1180px]">
            <a href="/" className="mb-6 inline-flex items-center text-xs font-bold text-blue-300 hover:text-blue-200">
              Back to infrastructure
            </a>

            <div className="max-w-3xl">
              <p className="text-xs font-black uppercase tracking-[0.24em] text-cyan-300">Mitch AI Assistant</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">
                A local intelligence layer built from small event-driven modules.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 md:text-base">
                Mitch is not a single script around an LLM. It is a local assistant architecture where input, memory,
                persona, tools, voice, vision, and field hardware communicate through a shared event spine.
              </p>
            </div>

            <section className="mt-10 rounded-xl border border-white/10 bg-slate-950/40 p-4 shadow-2xl sm:p-7">
              <div className="relative mx-auto max-w-5xl">
                <div className="mx-auto flex h-52 w-52 flex-col items-center justify-center rounded-full border border-cyan-300/50 bg-[radial-gradient(circle,rgba(34,211,238,0.28),rgba(37,99,235,0.12)_46%,rgba(15,23,42,0.95)_72%)] text-center shadow-[0_0_70px_rgba(34,211,238,0.24)]">
                  <div className="text-[11px] font-black uppercase tracking-[0.26em] text-cyan-200">LLM Core</div>
                  <div className="mt-2 text-3xl font-black text-white">MITCH</div>
                  <div className="mt-2 max-w-[150px] text-[10px] leading-4 text-slate-300">
                    Persona, memory, tools, events, speech, and vision converge here.
                  </div>
                </div>

                <div className="mx-auto mt-8 hidden h-12 max-w-[860px] lg:block">
                  <div className="mx-auto h-full w-px bg-cyan-400/50" />
                  <div className="h-px w-full bg-cyan-400/50" />
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-0 lg:grid-cols-4">
                  {mitchModules.map((module, index) => (
                    <MitchModuleCard key={module.name} module={module} index={index} />
                  ))}
                </div>
              </div>
            </section>

            <section className="mt-8 rounded-xl border border-white/10 bg-[#0a1726]/80 p-4 shadow-2xl sm:p-7">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-orange-300">Capability Modules</p>
                  <h2 className="mt-2 text-2xl font-black text-white">The skills Mitch can run around the core.</h2>
                </div>
                <p className="max-w-xl text-xs leading-5 text-slate-400">
                  Core modules make Mitch think, speak, listen, remember, and route events. These modules are the practical tools:
                  infrastructure control, search, file intake, monitoring, game knowledge, schedules, and visual systems.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {mitchCapabilityModules.map((module, index) => (
                  <MitchModuleCard key={module.name} module={module} index={index} />
                ))}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState("proxmox");
  const current = useMemo(() => components[selected], [selected]);
  const path = window.location.pathname;

  if (path === "/mitch" || path === "/mitch/") {
    return <MitchPage />;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#081421] text-slate-200">
      <div className="mx-auto min-h-screen max-w-[1420px] overflow-hidden rounded-none border border-slate-700/60 bg-[#0b1828] shadow-2xl lg:my-1 lg:rounded-xl">
        <Nav />
        <main id="overview" className="bg-[radial-gradient(circle_at_35%_0%,rgba(37,99,235,0.22),transparent_38%),linear-gradient(180deg,#0c1c2f_0%,#07111f_100%)] px-4 py-6 sm:px-6 sm:py-8">
          <section className="mx-auto min-w-0 max-w-[1320px]">
            <div className="mb-7">
              <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                One Home. <span className="italic">One IP.</span> Endless Possibilities.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                A self-hosted infrastructure running 24/7 from home, built with open source and zero cloud costs.
              </p>
            </div>

            <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
              <Diagram selected={selected} onSelect={setSelected} />
              <div className="hidden min-w-0 lg:block">
                <DetailPanel selected={selected} onClose={() => setSelected("proxmox")} />
                <p className="mt-5 px-4 text-center text-xs leading-5 text-slate-400">
                  Hover over or click any component to learn more about how it works.
                </p>
              </div>
            </div>
          </section>
        </main>
      </div>
      <span className="sr-only">{current.title}</span>
    </div>
  );
}
