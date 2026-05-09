import React, { useState } from "react";

// --- Sub-Components ---
const ServiceCard = ({ title, subtitle, port, icon, colorClass, onClick, hasRepo }) => (
  <div onClick={onClick} className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer overflow-hidden h-full">
    {hasRepo && <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] z-30"></div>}
    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity ${colorClass}`}></div>
    <div className="relative z-10 text-center">
      <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-bold text-white tracking-tight text-sm uppercase">{title}</h3>
      <p className="text-slate-500 text-[10px] mb-2 uppercase tracking-[0.2em] font-black">{subtitle}</p>
      <p className={`text-[10px] font-mono font-bold ${colorClass.replace("bg-", "text-")}`}>{port}</p>
    </div>
  </div>
);

const ProxmoxNode = ({ nodeName, status }) => (
  <div className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl group transition-all">
    <div className="w-16 h-10 bg-slate-800 rounded-md border-t-2 border-slate-600 mb-3 flex flex-col justify-center gap-1 px-2 shadow-inner group-hover:border-blue-400 transition-colors text-center">
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
  <div className={`fixed top-0 right-0 h-full w-80 bg-[#020617] border-l border-white/10 z-[100] transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} shadow-2xl p-8 overflow-y-auto`}>
    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white text-xl">✕</button>
    <div className="mt-8 text-left">
      <div className="text-4xl mb-4">{details?.icon || '⚙️'}</div>
      <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-tighter">{details?.title}</h2>
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

export default function HomelabLanding() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCardClick = (name, details) => {
    setSelectedComponent(details || { title: name, subtitle: "Infrastructure Component", description: "Details managed via Proxmox." });
    setIsSidebarOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]" onClick={() => setIsSidebarOpen(false)} />}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} details={selectedComponent} />

      <nav className="flex justify-center px-8 py-6 max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg">🏠</div>
          <span className="font-bold text-white tracking-tighter text-xl">Homelab OS</span>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pb-24 text-center">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-tight">One Home. <span className="italic font-light text-slate-500 font-serif">One IP.</span></h1>
          <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.4em]">Endless Possibilities</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start relative max-w-6xl mx-auto mb-16">
          <div className="relative flex flex-col items-center pt-24">
            <div onClick={() => handleCardClick("Source Repos", { title: "GitHub Organization", subtitle: "Version Control Hub", icon: "🐙", specs: ["Pidgiemon", "iAMLegendary", "MITCH Core", "MitchMesh Firmware"] })} 
                 className="w-48 bg-white/5 border border-orange-500/30 p-5 rounded-2xl hover:bg-white/10 cursor-pointer z-20 text-center relative">
                <div className="font-black text-white text-[10px] uppercase">🐙 Source Repos</div>
                <p className="text-[7px] text-orange-400 font-mono uppercase tracking-[0.2em] font-black mt-2">Version Control Hub</p>
                <div className="absolute top-1/2 left-0 w-px h-[610px] bg-orange-500/40 -translate-x-12"></div>
                <div className="absolute top-1/2 left-0 w-12 h-px bg-orange-500/40 -translate-x-12"></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl">🌐</div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Public Internet</span>
            <div className="w-px h-8 bg-blue-500/30 mt-2"></div>
            <div className="w-56 bg-white/5 border border-slate-700 py-4 rounded-xl mb-4 text-center">
               <img src="/fasthosts.svg" alt="Fasthosts" className="h-4 mx-auto brightness-0 invert" />
               <p className="text-[7px] text-slate-500 font-mono uppercase tracking-widest mt-2">Registrar</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-orange-500/50"></div>
            <div className="w-56 bg-white/5 border border-slate-700 py-4 rounded-xl mb-4 text-center">
               <img src="/cloudflare.svg" alt="Cloudflare" className="h-4 mx-auto" />
               <p className="text-[7px] text-slate-500 font-mono uppercase tracking-widest mt-2">DNS & Webpage Host</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-orange-500/50 to-red-500/50"></div>
            <div className="w-56 bg-white/5 border border-slate-700 py-4 rounded-xl mb-4 text-center h-[60px] flex flex-col justify-center">
               <img src="/youfibre.png" alt="YouFibre" className="h-4 mx-auto grayscale mb-1" />
               <p className="text-[7px] text-slate-500 font-mono uppercase tracking-widest">ISP Infrastructure</p>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-red-500/50 to-emerald-500"></div>
            <div className="w-56 bg-white/5 border border-emerald-500/50 py-5 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="text-emerald-500 text-sm font-black leading-none uppercase italic">Nginx Proxy</div>
              <p className="font-bold uppercase tracking-[0.2em] text-[8px] text-slate-500 mt-2">Central Routing</p>
            </div>
          </div>

          <div className="relative flex flex-col items-center pt-4 space-y-8">
            <div className="w-64 bg-white/5 border border-purple-500/40 p-5 rounded-3xl text-left">
                <p className="text-[9px] font-black uppercase text-purple-400 tracking-[0.2em] mb-4">Identity & MFA</p>
                <div className="flex gap-4 items-center h-5">
                   <img src="/entraid.svg" alt="Entra" className="h-full opacity-80" />
                   <img src="/google.svg" alt="Google" className="h-full opacity-80" />
                   <img src="/duo.svg" alt="Duo" className="h-full opacity-80" />
                </div>
            </div>
            <div className="w-px h-8 bg-purple-500/30"></div>
            <div onClick={() => handleCardClick("Productivity", { title: "Productivity", subtitle: "Enterprise Cloud Sync", specs: ["Google Workspace & GDrive", "M365 & OneDrive"] })}
                 className="w-64 bg-white/5 border border-blue-500/40 p-5 rounded-2xl text-left hover:bg-white/10 cursor-pointer relative group">
                <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em] mb-3 text-center">Productivity</p>
                <div className="text-[9px] font-bold text-white/90 space-y-2 font-mono uppercase tracking-tighter text-center">
                   <div>Google Workspace & GDrive</div>
                   <div>M365 & OneDrive</div>
                </div>
                <div className="absolute top-1/2 right-0 w-[55px] h-px bg-emerald-500/40 translate-x-full"></div>
                <div className="absolute top-1/2 right-0 w-px h-[680px] bg-emerald-500/40 translate-x-[55px]"></div>
            </div>
          </div>
        </div>

        <div className="relative w-full max-w-6xl mx-auto h-12 mb-2">
           <div className="absolute top-0 left-[8%] right-[8%] h-px bg-emerald-500/40 z-0"></div>
           <div className="grid grid-cols-6 h-full px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-center relative"><div className="w-px h-full bg-emerald-500/40"></div></div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-20">
          <ServiceCard hasRepo title="Pidgiemon" subtitle="Minecraft VM" port="Port: 25565" icon="🧱" colorClass="bg-green-500" />
          <ServiceCard hasRepo title="iAMLegendary" subtitle="DayZ VM" port="Port: 2302" icon="🧟" colorClass="bg-slate-400" />
          <div className="relative flex flex-col items-center">
            <ServiceCard title="Active Directory" subtitle="Hybrid Domain" port="RDS / AD DS" icon="🪟" colorClass="bg-blue-600" />
            <div className="absolute top-[100%] w-px h-[250px] bg-red-500/40 z-0">
               <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-[#020617] px-2 text-[8px] font-black text-red-400 border border-red-500/30 rounded uppercase tracking-tighter">SSO</div>
            </div>
          </div>
          <ServiceCard hasRepo title="M.I.T.C.H" subtitle="Local AI" port="Port: 8080" icon="🤖" colorClass="bg-orange-500" />
          <ServiceCard title="FileBrowser" subtitle="Public Share" port="Port: Various" icon="📁" colorClass="bg-blue-400" />
          <ServiceCard hasRepo title="MitchMesh" subtitle="LoRa Drone" port="Isolated" icon="📡" colorClass="bg-cyan-500" />
        </div>

        <div className="relative w-full max-w-6xl mx-auto h-12 mb-16">
           <div className="absolute bottom-0 left-[4%] right-[10%] h-px bg-orange-500/40 z-0"></div>
           <div className="grid grid-cols-6 h-full px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-center relative">
                   { (i === 0 || i === 1 || i === 3 || i === 5) && <div className="w-px h-full bg-orange-500/40"></div> }
                </div>
              ))}
           </div>
        </div>

        <div className="p-10 border border-white/10 rounded-[3rem] bg-gradient-to-b from-white/[0.03] to-transparent relative mt-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="text-left max-w-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-orange-500 font-black text-2xl">X</span>
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">Proxmox Cluster</h2>
              </div>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-black opacity-70">HA • ZFS • Cloud Backup</p>
            </div>
            <div className="flex items-center gap-8">
               <div className="bg-red-500/10 border border-red-500/40 px-6 py-4 rounded-3xl text-center relative">
                  <div className="text-xl mb-1">🔐</div>
                  <p className="text-red-400 font-black text-[10px] uppercase tracking-widest">LDAP SSO</p>
                  <div className="absolute top-0 left-1/2 w-px h-4 bg-red-500/40 -translate-y-full"></div>
               </div>
               <div className="flex gap-4">
                 <ProxmoxNode nodeName="Node 1" status="Online" />
                 <ProxmoxNode nodeName="Node 2" status="Online" />
                 <ProxmoxNode nodeName="Node 3" status="Online" />
               </div>
            </div>
            <div className="group bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center min-w-[180px] relative">
              <div className="text-2xl mb-1">🛢️</div>
              <p className="text-white font-bold text-xs uppercase tracking-tighter">ZFS STORAGE</p>
              <p className="text-emerald-400 text-[10px] font-bold italic mt-2">Sync Active</p>
              <div className="absolute top-1/2 right-0 w-[55px] h-px bg-emerald-500/40 translate-x-full"></div>
            </div>
          </div>
        </div>

        <div className="mt-12 max-w-5xl mx-auto pt-8 border-t border-white/5">
          <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 mb-8">The Connection Journey</h3>
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 relative">
            <div className="hidden md:block absolute top-6 left-0 w-full h-px bg-gradient-to-r from-blue-500/10 via-emerald-500/40 to-blue-500/10"></div>
            {[
              { step: "01", label: "DNS Lookup", desc: "andymitchell.online", color: "text-blue-400" },
              { step: "02", label: "WAF Filter", desc: "Cloudflare Edge", color: "text-orange-400" },
              { step: "03", label: "ISP Entry", desc: "YouFibre Static IP", color: "text-red-400" },
              { step: "04", label: "Routing", desc: "Nginx SSL Handoff", color: "text-emerald-400" },
              { step: "05", label: "Service", desc: "Proxmox VM/LXC", color: "text-blue-400" }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center group flex-1">
                <div className={`w-12 h-12 rounded-full bg-[#020617] border border-white/20 flex items-center justify-center text-[11px] font-black mb-3 group-hover:border-white/50 transition-all ${item.color} shadow-lg`}>{item.step}</div>
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