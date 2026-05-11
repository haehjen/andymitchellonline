import React, { useMemo, useState } from "react";

const components = {
  fasthosts: {
    title: "Fasthosts",
    subtitle: "Domain Registrar",
    accent: "blue",
    icon: "FH",
    description:
      "Fasthosts is the domain registrar for the public domain before DNS and website traffic are handled by Cloudflare.",
    bullets: ["Domain registration", "Renewal management", "Nameserver delegation", "Registrar control"],
  },
  cloudflare: {
    title: "Cloudflare",
    subtitle: "Website & DNS",
    accent: "orange",
    icon: "CF",
    description:
      "Cloudflare handles public DNS, edge protection, and Cloudflare Pages hosting for this site before traffic reaches the home lab.",
    bullets: ["Cloudflare Pages hosts this site", "DNS records", "DDNS automation", "Proxy and WAF rules", "TLS edge security"],
  },
  youfibre: {
    title: "YouFibre",
    subtitle: "ISP & Static IP",
    accent: "red",
    icon: "YF",
    description:
      "YouFibre provides the internet connection. CGNAT is the default, so a paid static IP is used as the mitigation for reliable inbound access.",
    bullets: ["CGNAT by default", "Paid static IP mitigation", "Home fibre connection", "Inbound route", "WAN handoff"],
  },
  nginx: {
    title: "Nginx Reverse Proxy",
    subtitle: "All Incoming Traffic",
    accent: "green",
    icon: "NX",
    description:
      "Nginx receives public traffic, routes requests to the correct internal service by hostname, and keeps free SSL certificates renewed automatically for each host.",
    bullets: ["Automated free SSL renewal per host", "SSL handoff", "Host-based routing", "Force HTTPS", "Health checks"],
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

const publicRepoComponents = new Set(["cloudflare", "minecraft", "dayz", "mitch", "mitchmesh"]);

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

  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="relative rounded-lg border border-slate-200 bg-white px-4 py-5 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
    >
      {hasPublicRepo && <GitHubBadge />}
      <LogoBadge className={`mx-auto mb-3 h-10 w-10 ${accent[item.accent]}`}>{item.icon}</LogoBadge>
      <div className="text-xs font-black text-slate-900">{item.title}</div>
      <div className="mt-1 text-[10px] font-semibold text-slate-500">{item.subtitle}</div>
      <div className="mt-1 text-[10px] font-bold text-emerald-600">
        {id === "minecraft"
          ? "Port: 25565"
          : id === "dayz"
            ? "Port: 2302"
            : id === "mitch"
              ? "Port: 8080"
              : id === "filebrowser"
                ? "fileshare.andymitchell.online"
                : id === "mitchmesh"
                  ? "LoRa + GPS"
                  : id === "raspberry"
                    ? "Wearable"
                  : "Private"}
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
          This cluster runs all core services including game servers, AI tools, and self-hosted applications.
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

function Diagram({ onSelect }) {
  const services = ["minecraft", "dayz", "mitch", "filebrowser", "mitchmesh", "raspberry"];
  const ingressFlow = [
    { id: "fasthosts", image: "/fasthosts.svg", imageClass: "h-6" },
    { id: "cloudflare", image: "/cloudflare.svg", imageClass: "h-9" },
    { id: "youfibre", image: "/youfibre.png", imageClass: "h-6" },
  ];

  return (
    <section className="rounded-xl bg-slate-50 p-7 text-slate-900 shadow-2xl ring-1 ring-white/20">
      <div className="relative mx-auto max-w-[900px]">
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

        <div className="relative mx-auto h-14 max-w-[720px]">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-blue-400" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-blue-400" />
        </div>

        <div className="relative grid gap-4 pt-5 md:grid-cols-3 xl:grid-cols-6">
          {services.map((service) => (
            <div key={service} className="relative">
              <span className="absolute left-1/2 top-[-20px] hidden h-5 w-px -translate-x-1/2 bg-blue-400 md:block" />
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
                <ServerIcon />
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
          </section>
        </main>
      </div>
      <span className="sr-only">{current.title}</span>
    </div>
  );
}
