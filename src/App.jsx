import React, { useState } from "react";

// --- Sub-Components ---

const ServiceCard = ({ title, subtitle, port, icon, colorClass, onClick }) => (
  <div
    onClick={onClick}
    className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer overflow-hidden h-full"
  >
    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity ${colorClass}`}></div>
    <div className="relative z-10">
      <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-bold text-white tracking-tight text-sm">{title}</h3>
      <p className="text-slate-500 text-[10px] mb-2 uppercase tracking-widest">{subtitle}</p>
      <p className={`text-[10px] font-mono font-bold ${colorClass.replace("bg-", "text-")}`}>{port}</p>
    </div>
  </div>
);

const ProxmoxNode = ({ nodeName, status, onClick }) => (
  <div 
    onClick={onClick}
    className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer group"
  >
    <div className="w-16 h-10 bg-slate-800 rounded-md border-t-2 border-slate-600 mb-3 flex flex-col justify-center gap-1 px-2 shadow-inner group-hover:border-blue-400 transition-colors">
      <div className="flex justify-between">
        <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></div>
        <div className="w-4 h-0.5 bg-slate-600 rounded"></div>
      </div>
      <div className="w-full h-0.5 bg-slate-700 rounded"></div>
    </div>
    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{nodeName}</span>
    <span className="text-[9px] text-emerald-500 font-mono mt-1">{status}</span>
  </div>
);

const Sidebar = ({ isOpen, onClose, details }) => (
  <div className={`fixed top-0 right-0 h-full w-80 bg-[#020617] border-l border-white/10 z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl p-8 overflow-y-auto`}>
    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl">✕</button>
    <div className="mt-8">
      <div className="text-4xl mb-4">{details?.icon || '⚙️'}</div>
      <h2 className="text-2xl font-bold text-white mb-2">{details?.title}</h2>
      <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">{details?.subtitle}</p>
      <div className="space-y-4 text-sm border-t border-white/5 pt-6">
        <p className="text-slate-400 leading-relaxed">{details?.description}</p>
        {details?.specs && (
          <div className="bg-white/5 p-4 rounded-xl">
            <h4 className="text-[10px] uppercase font-black text-slate-500 mb-2">Technical Specs</h4>
            <ul className="space-y-1 font-mono text-[11px] text-slate-300">
              {details.specs.map((spec, i) => <li key={i}>• {spec}</li>)}
            </ul>
          </div>
        )}
      </div>
    </div>
  </div>
);

// --- Data Layer ---

const componentData = {
  "Fasthosts Registrar": {
    title: "Fasthosts",
    subtitle: "Domain Registration",
    icon: "🌐",
    description: "The primary domain registrar managing andymitchell.online. Provides the authoritative name server handoff to Cloudflare.",
    specs: ["UK Based Data Centers", "Domain Privacy Active", "Glue Records Configured"]
  },
  "Cloudflare DNS": {
    title: "Cloudflare",
    subtitle: "Edge Security, DNS and CDN",
    icon: "☁️",
    description: "Cloudflare provides the WAF (Web Application Firewall) and high-speed DNS resolution. It hides the home IP behind a proxy layer. It also hosts a simple landing page for the root domain and handles SSL termination before forwarding to the home network.",
    specs: ["Full HSTS Encryption", "DDoS Protection", "Edge Caching"]
  },
  "YouFibre Gateway": {
    title: "YouFibre",
    subtitle: "ISP Infrastructure",
    icon: "📡",
    description: "Gigabit symmetrical fiber connection. A dedicated static IP was purchased specifically to bypass CGNAT and allow direct routing.",
    specs: ["1Gbps Up/Down", "Static IPv4", "No CGNAT Restrictions"]
  },
  "Nginx Reverse Proxy": {
    title: "Nginx Proxy Manager",
    subtitle: "Traffic Management",
    icon: "🛡️",
    description: "The central hub. It receives traffic on ports 80/443 and routes it to the correct internal service based on subdomains.",
    specs: ["Wildcard SSL", "Websockets Enabled", "Access Lists Active"]
  }
};

export default function HomelabLanding() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCardClick = (name) => {
    const data = componentData[name] || { 
        title: name, 
        subtitle: "Infrastructure Component", 
        description: "Configuration details managed via Proxmox and Nginx Proxy Manager." 
    };
    setSelectedComponent(data);
    setIsSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setIsSidebarOpen(false)} />
      )}
      
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} details={selectedComponent} />

      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">🏠</div>
          <span className="font-bold text-white tracking-tighter text-xl">Homelab OS</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-4 pb-24 text-center">
        
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">
          One Home. <span className="italic font-light text-slate-500 font-serif">One IP.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-500 mb-10 text-[10px] uppercase font-bold tracking-[0.4em]">
          Endless Possibilities
        </p>

        {/* --- Central Flow Chain --- */}
        <div className="relative flex flex-col items-center">
          <div className="flex flex-col items-center mb-0 relative">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">🌐</div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Public Internet</span>
            <div className="w-px h-6 bg-blue-500/30 mt-2"></div>
          </div>

          <div className="relative flex flex-col items-center">
            <div onClick={() => handleCardClick("Fasthosts Registrar")} className="w-56 group relative cursor-pointer bg-white/5 border border-slate-700 py-4 rounded-xl transition-all hover:scale-105 hover:border-blue-500/50">
               <div className="h-6 flex items-center justify-center px-4">
                  <img src="/fasthosts.svg" alt="Fasthosts" className="max-h-full max-w-[140px] brightness-0 invert group-hover:invert-0 group-hover:brightness-100 transition-all duration-300" 
                       onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <span className="hidden text-white font-black tracking-tighter text-sm italic">FASTHOSTS</span>
               </div>
               <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-1">Registrar</p>
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-blue-500/50 to-orange-500/50"></div>
          </div>

          <div className="relative flex flex-col items-center">
            <div onClick={() => handleCardClick("Cloudflare DNS")} className="w-56 group relative cursor-pointer bg-white/5 border border-slate-700 py-4 rounded-xl transition-all hover:scale-105 hover:border-orange-500/50">
               <div className="h-6 flex items-center justify-center px-4">
                  <img src="/cloudflare.svg" alt="Cloudflare" className="max-h-full max-w-[140px]" 
                       onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <span className="hidden text-[#f38020] font-black tracking-tighter text-sm italic">CLOUDFLARE</span>
               </div>
               <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-1">DNS & WEBPAGE HOST</p>
            </div>
            <div className="w-px h-6 bg-gradient-to-b from-orange-500/50 to-red-500/50"></div>
          </div>

          <div className="relative flex flex-col items-center">
            <div onClick={() => handleCardClick("YouFibre Gateway")} className="w-56 group relative cursor-pointer bg-white/5 border border-slate-700 py-4 rounded-xl transition-all hover:scale-105 hover:border-red-500/50">
               <div className="h-6 flex items-center justify-center px-4">
                  <img src="/youfibre.png" alt="YouFibre" className="max-h-full max-w-[140px] grayscale group-hover:grayscale-0 transition-all duration-300 object-contain" 
                       onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                  <span className="hidden text-white font-black tracking-tighter text-sm italic uppercase">YOUFIBRE</span>
               </div>
               <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mt-1">Static IP <span className="text-red-500 font-bold italic">PAID</span></p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-red-500/50 to-emerald-500"></div>
          </div>

          <div className="relative flex flex-col items-center mb-0">
            <div 
              className="w-56 group relative cursor-pointer bg-white/5 border border-emerald-500/50 py-4 rounded-xl transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.1)]"
              onClick={() => handleCardClick("Nginx Reverse Proxy")}
            >
              <div className="text-emerald-500 text-sm font-black leading-none uppercase italic">Nginx Proxy</div>
              <p className="font-bold uppercase tracking-widest text-[8px] text-slate-500 mt-1">Central Routing</p>
            </div>
            <div className="w-px h-8 bg-emerald-500"></div>
          </div>
        </div>

        {/* Wide Bus Bar Section */}
        <div className="relative w-full max-w-7xl mx-auto mb-4">
           <div className="absolute top-0 left-[10.5%] right-[10.5%] h-px bg-emerald-500/40"></div>
           <div className="flex justify-between w-full px-[10.5%]">
              {[...Array(5)].map((_, i) => <div key={i} className="w-px h-6 bg-emerald-500/40"></div>)}
           </div>
        </div>

        {/* Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-20">
          <ServiceCard title="Pidgiemon" subtitle="Custom Minecraft Server" port="Port: 25565" icon="🧱" colorClass="bg-green-500" onClick={() => handleCardClick("Minecraft Server")} />
          <ServiceCard title="iAMLegendary" subtitle="Custom DayZ Server" port="Port: 2302" icon="🧟" colorClass="bg-slate-400" onClick={() => handleCardClick("DayZ Server")} />
          <ServiceCard title="M.I.T.C.H" subtitle="Custom Local AI" port="Port: 8080" icon="🤖" colorClass="bg-orange-500" onClick={() => handleCardClick("Mitch AI")} />
          <ServiceCard title="FileBrowser" subtitle="Self Hosted Public File Share" port="Port: Various" icon="📁" colorClass="bg-blue-400" onClick={() => handleCardClick("Home Services")} />
          <ServiceCard title="MitchMesh" subtitle="Autonomous LoRa Drone Network" port="Isolated" icon="📡" colorClass="bg-cyan-500" onClick={() => handleCardClick("Docker Containers")} />
        </div>

        {/* Hardware Footer */}
        <div className="mt-16 p-6 border border-white/10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-left max-w-xs cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500 font-black text-2xl">X</span>
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">Proxmox Cluster</h2>
              </div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold opacity-70">
                High Availability • ZFS Storage • 24/7 Virtualization
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <ProxmoxNode nodeName="Node 1" status="Online" onClick={() => handleCardClick("Node 1 Details")} />
              <ProxmoxNode nodeName="Node 2" status="Online" onClick={() => handleCardClick("Node 2 Details")} />
              <ProxmoxNode nodeName="Node 3" status="Online" onClick={() => handleCardClick("Node 3 Details")} />
            </div>
            <div className="group bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl text-center min-w-[140px] transition-all hover:bg-blue-600/20 cursor-pointer" onClick={() => handleCardClick("Storage Pool")}>
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛢️</div>
              <p className="text-white font-bold text-xs uppercase tracking-tighter">ZFS Storage</p>
              <p className="text-blue-400 text-[10px] font-bold italic mt-1">Fault Tolerant</p>
            </div>
          </div>
        </div>

        {/* COMPACT CONNECTION JOURNEY FOOTER */}
        <div className="mt-12 max-w-5xl mx-auto pt-8 border-t border-white/5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 mb-8">The Connection Journey</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-blue-500/10 via-emerald-500/40 to-blue-500/10"></div>

            {[
              { step: "01", label: "DNS Lookup", desc: "andymitchell.online", color: "text-blue-400" },
              { step: "02", label: "WAF Filter", desc: "Cloudflare Edge", color: "text-orange-400" },
              { step: "03", label: "ISP Entry", desc: "YouFibre Static IP", color: "text-red-400" },
              { step: "04", label: "Routing", desc: "Nginx SSL Handoff", color: "text-emerald-400" },
              { step: "05", label: "Service", desc: "Proxmox VM/LXC", color: "text-blue-400" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center group flex-1">
                <div className={`w-12 h-12 rounded-full bg-[#020617] border border-white/20 flex items-center justify-center text-[11px] font-black mb-3 group-hover:border-white/50 transition-all ${item.color} shadow-lg`}>
                  {item.step}
                </div>
                <p className="text-white font-bold text-sm mb-1 uppercase tracking-tight">{item.label}</p>
                <p className="text-[10px] text-slate-500 font-mono italic uppercase tracking-tighter whitespace-nowrap">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}