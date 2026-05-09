import React, { useState } from "react";

// --- Sub-Components ---
const ServiceCard = ({ title, subtitle, port, icon, colorClass, onClick, hasRepo }) => (
  <div onClick={onClick} className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer overflow-hidden h-full">
    {/* Orange Repo Indicator Dot */}
    {hasRepo && <div className="absolute top-3 left-3 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)] z-30"></div>}
    
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
  <div onClick={onClick} className="flex flex-col items-center p-4 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 cursor-pointer group">
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

// --- Extended Data Layer ---
const componentData = {
  "GitHub Source": {
    title: "GitHub Organization",
    subtitle: "Version Control Hub",
    icon: "🐙",
    description: "Multi-repo management for all primary services. Code changes trigger automated staging/production deployments.",
    specs: ["Pidgiemon Repo", "iAMLegendary Repo", "M.I.T.C.H Core", "MitchMesh Firmware"]
  },
  "Productivity": {
    title: "Productivity Suites",
    subtitle: "SaaS & Cloud Storage",
    icon: "💼",
    description: "Core productivity stack. Integrated with local storage for automated cloud-to-local backups.",
    specs: ["Google Workspace / GDrive", "M365 Business / OneDrive", "Automated Off-site Sync"]
  },
  "LDAP SSO": {
    title: "LDAP Integration",
    subtitle: "SSO Auth Bridge",
    icon: "🔐",
    description: "Bridges Active Directory to the Proxmox cluster, ensuring administrative access is synced across the domain.",
    specs: ["Active Directory Backend", "Proxmox Realm Auth", "Role-Based Access"]
  }
};

export default function HomelabLanding() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCardClick = (name) => {
    const data = componentData[name] || { 
        title: name, 
        subtitle: "Infrastructure Component", 
        description: "Configuration details managed via Proxmox and Hybrid Sync." 
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
          
          {/* Public Internet + Identity */}
          <div className="flex flex-col items-center mb-0 relative">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(59,130,246,0.1)]">🌐</div>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Public Internet</span>
            
            {/* Identity & Productivity Branch */}
            <div className="hidden lg:block absolute left-[55%] top-6 w-[200px] h-px bg-gradient-to-r from-blue-500/50 to-purple-500/50"></div>
            
            {/* Identity Box */}
            <div onClick={() => handleCardClick("Identity Providers")} className="hidden lg:block absolute left-[55%] top-[-15px] ml-[200px] w-64 text-left bg-white/5 border border-purple-500/40 p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer z-50">
                <p className="text-[9px] font-black uppercase text-purple-400 tracking-[0.2em] mb-3">Identity & MFA</p>
                <div className="flex gap-4 items-center h-5">
                   <img src="/entraid.svg" alt="Entra" className="h-full w-auto" />
                   <img src="/google.svg" alt="Google" className="h-full w-auto" />
                   <img src="/duo.svg" alt="Duo" className="h-full w-auto" />
                </div>
                
                {/* Productivity Integration Card */}
                <div onClick={(e) => { e.stopPropagation(); handleCardClick("Productivity"); }} className="mt-4 pt-4 border-t border-white/10 hover:bg-white/5 transition-colors">
                   <p className="text-[9px] font-black uppercase text-blue-400 tracking-[0.2em] mb-2">Productivity</p>
                   <div className="flex gap-4 items-center text-[10px] text-white/80 font-bold">
                      <span>GDrive</span>
                      <span className="w-px h-2 bg-white/20"></span>
                      <span>OneDrive</span>
                   </div>
                </div>
            </div>

            <div className="w-px h-8 bg-blue-500/30 mt-2"></div>
          </div>

          {/* Fasthosts */}
          <div className="relative flex flex-col items-center">
            <div onClick={() => handleCardClick("Fasthosts Registrar")} className="w-56 group relative cursor-pointer bg-white/5 border border-slate-700 py-4 rounded-xl transition-all hover:scale-105 hover:border-blue-500/50">
               <div className="h-6 flex items-center justify-center px-4">
                  <img src="/fasthosts.svg" alt="Fasthosts" className="max-h-full max-w-[140px] brightness-0 invert group-hover:invert-0 group-hover:brightness-100 transition-all duration-300" />
               </div>
               <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-1">Registrar</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-blue-500/50 to-orange-500/50"></div>
          </div>

          {/* Cloudflare + Source Branch */}
          <div className="relative flex flex-col items-center">
            <div className="hidden lg:block absolute right-[100%] top-8 w-[120px] h-px bg-orange-500/50"></div>
            
            <div onClick={() => handleCardClick("GitHub Source")} className="hidden lg:block absolute right-[100%] top-[-10px] mr-4 w-48 bg-white/5 border border-orange-500/30 p-4 rounded-xl hover:bg-white/10 transition-all cursor-pointer">
                <div className="flex items-center gap-3 justify-center mb-1">
                   <span className="text-xl">🐙</span>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Source Repos</span>
                </div>
                <p className="text-[7px] text-orange-400 font-mono uppercase tracking-[0.2em] font-bold">Version Control Hub</p>
            </div>

            <div onClick={() => handleCardClick("Cloudflare DNS")} className="w-56 bg-white/5 border border-slate-700 py-4 rounded-xl">
               <div className="h-6 flex items-center justify-center px-4">
                  <img src="/cloudflare.svg" alt="Cloudflare" className="max-h-full max-w-[140px]" />
               </div>
               <p className="text-[8px] text-slate-500 font-mono uppercase tracking-widest mt-1">DNS & WEBPAGE HOST</p>
            </div>
            <div className="w-px h-8 bg-gradient-to-b from-orange-500/50 to-red-500/50"></div>
          </div>

          {/* YouFibre */}
          <div className="relative flex flex-col items-center">
            <div onClick={() => handleCardClick("YouFibre Gateway")} className="w-56 group relative bg-white/5 border border-slate-700 py-4 rounded-xl">
               <div className="h-6 flex items-center justify-center px-4">
                  <img src="/youfibre.png" alt="YouFibre" className="max-h-full max-w-[140px] grayscale object-contain" />
               </div>
               <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest mt-1">Static IP <span className="text-red-500 font-bold italic">PAID</span></p>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-red-500/50 to-emerald-500"></div>
          </div>

          {/* Nginx Proxy */}
          <div className="relative flex flex-col items-center">
            <div onClick={() => handleCardClick("Nginx Reverse Proxy")} className="w-56 bg-white/5 border border-emerald-500/50 py-4 rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.1)]">
              <div className="text-emerald-500 text-sm font-black leading-none uppercase italic">Nginx Proxy</div>
              <p className="font-bold uppercase tracking-widest text-[8px] text-slate-500 mt-1">Central Routing</p>
            </div>
            <div className="w-px h-8 bg-emerald-500"></div>
          </div>
        </div>

        {/* --- ORANGE REPO BUS BAR (Links to Cards) --- */}
        <div className="relative w-full max-w-7xl mx-auto">
           {/* Primary Horizontal Orange Line */}
           <div className="absolute top-[-265px] left-[5%] w-[3px] h-[330px] bg-orange-500/20 z-0"></div>
           <div className="absolute top-[65px] left-[5%] right-[8%] h-px bg-orange-500/30 z-0"></div>
           
           {/* Vertical Drop-offs into Grid */}
           <div className="flex justify-between w-full px-[8%] relative z-0">
              {[0, 1, 3, 5].map((i) => (
                <div key={i} className="w-px h-16 bg-orange-500/30" style={{ marginLeft: i === 0 ? '0' : 'auto', marginRight: i === 5 ? '0' : 'auto' }}></div>
              ))}
           </div>
        </div>

        {/* --- SERVICE GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 relative z-20 mt-[-64px]">
          <ServiceCard hasRepo title="Pidgiemon" subtitle="Minecraft VM" port="Port: 25565" icon="🧱" colorClass="bg-green-500" onClick={() => handleCardClick("Minecraft Server")} />
          <ServiceCard hasRepo title="iAMLegendary" subtitle="DayZ VM" port="Port: 2302" icon="🧟" colorClass="bg-slate-400" onClick={() => handleCardClick("DayZ Server")} />
          
          {/* Active Directory with LDAP Downward Connector */}
          <div className="relative flex flex-col items-center">
            <ServiceCard title="Active Directory" subtitle="Hybrid Windows Domain" port="RDS / AD DS" icon="🪟" colorClass="bg-blue-600" onClick={() => handleCardClick("Windows Domain")} />
            <div className="absolute top-[100%] w-px h-16 bg-red-500/50 z-0">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020617] px-2 text-[8px] font-black text-red-400 uppercase border border-red-500/30 rounded">SSO</div>
            </div>
          </div>

          <ServiceCard hasRepo title="M.I.T.C.H" subtitle="Custom Local AI" port="Port: 8080" icon="🤖" colorClass="bg-orange-500" onClick={() => handleCardClick("Mitch AI")} />
          <ServiceCard title="FileBrowser" subtitle="Public File Share" port="Port: Various" icon="📁" colorClass="bg-blue-400" onClick={() => handleCardClick("Home Services")} />
          <ServiceCard hasRepo title="MitchMesh" subtitle="LoRa Drone Network" port="Isolated" icon="📡" colorClass="bg-cyan-500" onClick={() => handleCardClick("Docker Containers")} />
        </div>

        {/* --- HARDWARE + BACKUP FLOW --- */}
        <div className="mt-20 p-6 border border-white/10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden backdrop-blur-sm">
          
          {/* GREEN BACKUP LINE: From Productivity to ZFS */}
          <div className="hidden lg:block absolute top-[-350px] right-[50px] w-px h-[350px] bg-emerald-500/30"></div>
          <div className="hidden lg:block absolute top-0 right-[50px] w-px h-full bg-emerald-500/30"></div>
          <div className="hidden lg:block absolute bottom-[55px] right-[50px] left-[85%] h-px bg-emerald-500/40"></div>

          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-left max-w-xs cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500 font-black text-2xl">X</span>
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">Proxmox Cluster</h2>
              </div>
              <p className="text-slate-500 text-xs uppercase tracking-wider font-semibold opacity-70">HA • ZFS • Cloud Sync</p>
            </div>

            <div className="flex items-center gap-6">
               <div onClick={() => handleCardClick("LDAP SSO")} className="group bg-red-500/5 border border-red-500/20 px-6 py-4 rounded-2xl text-center min-w-[120px] transition-all hover:bg-red-500/10 cursor-pointer">
                  <div className="text-xl mb-1 group-hover:scale-110 transition-transform">🔐</div>
                  <p className="text-red-400 font-black text-[10px] uppercase tracking-widest">LDAP SSO</p>
               </div>

               <div className="flex flex-wrap justify-center gap-4">
                 <ProxmoxNode nodeName="Node 1" status="Online" />
                 <ProxmoxNode nodeName="Node 2" status="Online" />
                 <ProxmoxNode nodeName="Node 3" status="Online" />
               </div>
            </div>

            <div className="group bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl text-center min-w-[140px] transition-all hover:bg-emerald-600/20 cursor-pointer" onClick={() => handleCardClick("Storage Pool")}>
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛢️</div>
              <p className="text-white font-bold text-xs uppercase tracking-tighter">ZFS STORAGE</p>
              <p className="text-emerald-400 text-[10px] font-bold italic mt-1">Cloud Backup Enabled</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}