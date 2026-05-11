import React, { useMemo, useState } from "react";

const components = {
  cloudflare: {
    title: "Cloudflare DNS & DDNS",
    subtitle: "Domain Management",
    accent: "orange",
    icon: "CF",
    description:
      "Cloudflare fronts the domain, keeps public records tidy, and points traffic at the single public IP for the lab.",
    bullets: ["DNS records", "DDNS automation", "Proxy and WAF rules", "TLS edge security"],
  },
  nginx: {
    title: "Nginx Reverse Proxy",
    subtitle: "All Incoming Traffic",
    accent: "green",
    icon: "NX",
    description:
      "Nginx receives public traffic and routes requests to the correct internal service by hostname.",
    bullets: ["SSL handoff", "Host-based routing", "Force HTTPS", "Health checks"],
  },
  entra: {
    title: "Microsoft Entra ID",
    subtitle: "Authentication",
    accent: "blue",
    icon: "ID",
    description:
      "Entra handles single sign-on and access controls for services that need identity-aware access.",
    bullets: ["SSO and access policies", "MFA support", "External identity", "Conditional access"],
  },
  minecraft: {
    title: "Minecraft Server",
    subtitle: "Game Hosting",
    accent: "green",
    icon: "MC",
    description:
      "A dedicated game service exposed through the home lab route with its own VM boundary.",
    bullets: ["Port 25565", "Dedicated VM", "Backups enabled", "Resource limits"],
  },
  dayz: {
    title: "DayZ Server",
    subtitle: "Game Hosting",
    accent: "slate",
    icon: "DZ",
    description:
      "DayZ hosting runs as an isolated service with public ingress routed through the same public IP.",
    bullets: ["Port 2302", "Dedicated VM", "Isolated configs", "Scheduled restarts"],
  },
  mitch: {
    title: "Mitch AI Assistant",
    subtitle: "Local AI Services",
    accent: "orange",
    icon: "AI",
    description:
      "Local AI workloads sit behind the reverse proxy so private tools can be reached securely.",
    bullets: ["Port 8080", "Local inference", "Private tools", "Controlled access"],
  },
  home: {
    title: "Home Services",
    subtitle: "Utilities & Tools",
    accent: "blue",
    icon: "HS",
    description:
      "Utility services for the household live together behind routed hostnames and consistent TLS.",
    bullets: ["Dashboards", "File tools", "Automation", "Monitoring"],
  },
  docker: {
    title: "Docker Containers",
    subtitle: "Apps & Services",
    accent: "cyan",
    icon: "DC",
    description:
      "Containerized apps are isolated from core infrastructure while still being reachable through Nginx.",
    bullets: ["App containers", "Private networks", "Compose stacks", "Easy rollbacks"],
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
  },
  raspberry: {
    title: "Raspberry Pi",
    subtitle: "The Home Core",
    accent: "red",
    icon: "PI",
    description:
      "A small always-on controller for low-power jobs and the basic home core services.",
    bullets: ["Always on", "Low power", "Local utilities", "Fallback control"],
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
          <a href="#how">How It Works</a>
          <a href="#connect">Connect</a>
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

function ServiceCard({ id, onSelect }) {
  const item = components[id];
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="relative rounded-lg border border-slate-200 bg-white px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      <LogoBadge className={`mx-auto mb-3 h-10 w-10 ${accent[item.accent]}`}>{item.icon}</LogoBadge>
      <div className="text-xs font-black text-slate-900">{item.title}</div>
      <div className="mt-1 text-[10px] font-semibold text-slate-500">{item.subtitle}</div>
      <div className="mt-1 text-[10px] font-bold text-emerald-600">
        {id === "minecraft" ? "Port: 25565" : id === "dayz" ? "Port: 2302" : id === "mitch" ? "Port: 8080" : id === "docker" ? "Isolated" : "Private"}
      </div>
    </button>
  );
}

function DetailPanel({ selected, onClose }) {
  const item = components[selected];

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
          This cluster runs all core services including game servers, AI tools, and self-hosted applications.
        </div>
        <button className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-500">
          Read More →
        </button>
      </div>
    </aside>
  );
}

function ConnectionStep({ number, label, sub }) {
  return (
    <div className="flex min-w-[96px] flex-1 flex-col items-center text-center">
      <div className="grid h-12 w-12 place-items-center rounded-full border border-blue-400/25 bg-blue-500/10 text-sm font-black text-blue-300">
        {number}
      </div>
      <div className="mt-3 text-xs font-bold text-white">{label}</div>
      <div className="mt-1 text-[10px] text-slate-400">{sub}</div>
    </div>
  );
}

function Diagram({ onSelect }) {
  const services = ["minecraft", "dayz", "mitch", "home", "docker"];

  return (
    <section className="rounded-xl bg-slate-50 p-7 text-slate-900 shadow-2xl ring-1 ring-white/20">
      <div className="relative mx-auto max-w-[900px]">
        <div className="flex flex-col items-center">
          <LogoBadge className="border-blue-200 text-blue-600">WEB</LogoBadge>
          <div className="mt-2 text-[10px] font-black">Public Internet</div>
          <div className="mt-2 h-6 w-px bg-blue-400" />
          <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black text-emerald-700">
            1 Public IP
          </div>
          <div className="h-6 w-px bg-blue-400" />
        </div>

        <div className="grid items-center gap-6 md:grid-cols-[150px_1fr_150px]">
          <ExternalCard id="cloudflare" onSelect={onSelect}>
            <img src="/cloudflare.svg" alt="" className="mx-auto h-10" />
          </ExternalCard>

          <button
            type="button"
            onClick={() => onSelect("nginx")}
            className="relative rounded-lg border border-slate-200 bg-white px-8 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
          >
            <div className="text-3xl font-black tracking-tight text-emerald-600">NGINX</div>
            <div className="mt-1 text-xs font-black text-slate-950">Nginx Reverse Proxy</div>
            <div className="mt-1 text-[10px] text-slate-500">All incoming traffic routed by hostname</div>
            <span className="absolute left-[-96px] top-1/2 hidden h-px w-24 border-t border-dashed border-blue-400 md:block" />
            <span className="absolute right-[-96px] top-1/2 hidden h-px w-24 border-t border-dashed border-blue-400 md:block" />
          </button>

          <ExternalCard id="entra" onSelect={onSelect}>
            <img src="/entraid.svg" alt="" className="mx-auto h-10" />
          </ExternalCard>
        </div>

        <div className="mx-auto mt-7 h-9 w-px bg-blue-400" />
        <div className="mx-auto h-px max-w-[720px] bg-blue-400" />

        <div className="relative grid gap-4 pt-5 md:grid-cols-5">
          {services.map((service) => (
            <div key={service} className="relative">
              <span className="absolute left-1/2 top-[-20px] hidden h-5 w-px bg-blue-400 md:block" />
              <ServiceCard id={service} onSelect={onSelect} />
            </div>
          ))}
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
            {["Node 1", "Node 2", "Node 3"].map((node) => (
              <div key={node} className="flex items-center gap-3 rounded-md bg-white/70 p-3">
                <div className="h-9 w-12 rounded bg-slate-700 shadow-inner" />
                <div>
                  <div className="text-[10px] font-black">HP ProLiant</div>
                  <div className="text-[10px]">ML350 Gen9</div>
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

        <button
          type="button"
          onClick={() => onSelect("raspberry")}
          className="mx-auto mt-7 flex max-w-[300px] items-center gap-4 rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-rose-300 hover:shadow-md"
        >
          <LogoBadge className="rounded-lg border-rose-200 bg-rose-50 text-rose-700">PI</LogoBadge>
          <div>
            <div className="text-sm font-black">Raspberry Pi</div>
            <div className="text-[10px] font-semibold">The Home Core</div>
            <div className="mt-1 text-[10px] text-slate-500">Always on. Always here.</div>
          </div>
        </button>
      </div>
    </section>
  );
}

export default function App() {
  const [selected, setSelected] = useState("proxmox");
  const current = useMemo(() => components[selected], [selected]);

  return (
    <div className="min-h-screen bg-[#081421] text-slate-200">
      <div className="mx-auto min-h-screen max-w-[1420px] overflow-hidden rounded-none border border-slate-700/60 bg-[#0b1828] shadow-2xl lg:my-1 lg:rounded-xl">
        <Nav />
        <main id="overview" className="bg-[radial-gradient(circle_at_35%_0%,rgba(37,99,235,0.22),transparent_38%),linear-gradient(180deg,#0c1c2f_0%,#07111f_100%)] px-6 py-8">
          <section className="mx-auto max-w-[1320px]">
            <div className="mb-7">
              <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
                One Home. <span className="italic">One IP.</span> Endless Possibilities.
              </h1>
              <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">
                A self-hosted infrastructure running 24/7 from home, built with open source and zero cloud costs.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
              <Diagram onSelect={setSelected} />
              <div>
                <DetailPanel selected={selected} onClose={() => setSelected("proxmox")} />
                <p className="mt-5 px-4 text-center text-xs leading-5 text-slate-400">
                  Hover over or click any component to learn more about how it works.
                </p>
              </div>
            </div>

            <section id="connect" className="mt-8 rounded-xl border border-white/10 bg-[#0a1726]/80 p-5">
              <h2 className="mb-5 text-sm font-black text-white">How to Connect</h2>
              <div className="grid gap-7 lg:grid-cols-[1fr_290px]">
                <div className="flex flex-col items-center gap-5 md:flex-row">
                  <ConnectionStep number="1" label="Visit" sub="homelabos.com" />
                  <div className="hidden h-px w-10 bg-slate-500 md:block" />
                  <ConnectionStep number="2" label="Secure Access" sub="SSL via Nginx" />
                  <div className="hidden h-px w-10 bg-slate-500 md:block" />
                  <ConnectionStep number="3" label="Choose a Service" sub="Minecraft, Mitch, tools" />
                  <div className="hidden h-px w-10 bg-slate-500 md:block" />
                  <ConnectionStep number="4" label="Authenticate" sub="Entra ID SSO" />
                  <div className="hidden h-px w-10 bg-slate-500 md:block" />
                  <ConnectionStep number="5" label="You're In" sub="Enjoy the experience" />
                </div>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-lg font-black text-emerald-400">Zero Cost. Full Control.</div>
                  <p className="mt-4 text-sm leading-6 text-slate-300">
                    Built with open source. Hosted at home. Available to the world.
                  </p>
                  <p className="mt-4 text-sm font-semibold text-white">This is what's possible.</p>
                </div>
              </div>
            </section>
          </section>
        </main>
      </div>
      <span className="sr-only">{current.title}</span>
    </div>
  );
}
