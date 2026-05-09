import React from 'react'
    import ReactDOM from 'react-dom/client'
    import App from './App.jsx'
    import './index.css'

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
        <App/>
      </React.StrictMode>,
    )
import React from "react";

// --- Sub-Components for Uniformity ---

const ServiceCard = ({ title, subtitle, port, icon, colorClass, onClick }) => (
  <div
    onClick={onClick}
    className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 cursor-pointer overflow-hidden"
  >
    <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity ${colorClass}`}></div>
    <div className="relative z-10">
      <div className="text-3xl mb-4 transition-transform duration-300 group-hover:scale-110">{icon}</div>
      <h3 className="font-bold text-white tracking-tight">{title}</h3>
      <p className="text-slate-500 text-[10px] mb-2 uppercase tracking-widest">{subtitle}</p>
      <p className={`text-xs font-mono font-bold ${colorClass.replace("bg-", "text-")}`}>{port}</p>
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

// --- Main Page Component ---

export default function HomelabLanding() {
  const handleCardClick = (name) => {
    console.log(`Opening details for: ${name}`);
    // This is where we will hook in the sidebar state later
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* 1. Header Navigation */}
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">🏠</div>
          <span className="font-bold text-white tracking-tighter text-xl">Homelab OS</span>
        </div>
        <div className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest">
          <a href="#" className="text-blue-400 border-b-2 border-blue-400 pb-1">Overview</a>
          <a href="#" className="hover:text-white transition-colors">How It Works</a>
          <a href="#" className="hover:text-white transition-colors text-slate-500">Connect</a>
          <a href="#" className="hover:text-white transition-colors text-slate-500">Blog</a>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 pt-12 pb-24 text-center">
        
        {/* Hero Section */}
        <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
          One Home. <span className="italic font-light text-slate-500">One IP.</span><br />
          <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Endless Possibilities.
          </span>
        </h1>
        <p className="max-w-2xl mx-auto text-slate-400 mb-16 leading-relaxed">
          A self-hosted infrastructure running 24/7 from home,<br className="hidden md:block" />
          built with open source and <span className="text-emerald-400 font-bold">zero cloud costs</span>.
        </p>

        {/* 3. The Central Flow Column */}
        <div className="relative mb-20 flex flex-col items-center">
          
          {/* Public Internet Symbol */}
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(59,130,246,0.2)]">🌐</div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mt-2">Public Internet</span>
          </div>

          {/* YouFibre Gateway (Interactive Card) */}
          <div className="relative mb-16 flex flex-col items-center">
            <div
              className="group relative cursor-pointer bg-white/5 border border-slate-700 px-10 py-6 rounded-2xl transition-all duration-300 hover:scale-105 hover:border-red-500/50 hover:bg-white/10 shadow-[0_0_20px_rgba(227,6,19,0.05)]"
              onClick={() => handleCardClick("YouFibre Gateway")}
            >
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity bg-[#E30613]"></div>
              <div className="relative z-10 flex flex-col items-center">
                <img
                  src="https://www.youfibre.com/images/logo.svg"
                  alt="YouFibre"
                  className="h-6 mb-4 brightness-125 grayscale group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#E30613] animate-ping"></div>
                  <div className="text-center">
                    <h4 className="text-white font-bold text-[10px] tracking-widest uppercase">Fiber Gateway</h4>
                    <p className="text-[9px] text-slate-500 font-mono mt-1 group-hover:text-red-400 transition-colors uppercase">
                      Port Forwarding <span className="font-bold text-red-500">Active</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Red to Green handoff line */}
            <div className="absolute left-1/2 top-full w-px h-16 bg-gradient-to-b from-[#E30613] to-[#009639]"></div>
          </div>

          {/* Nginx Central Hub */}
          <div className="relative z-10">
            <div 
              className="group bg-white rounded-2xl p-8 text-slate-900 shadow-[0_0_50px_rgba(59,130,246,0.15)] border border-white/20 inline-block transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleCardClick("Nginx Reverse Proxy")}
            >
              <div className="text-[#009639] text-3xl font-black mb-1 leading-none uppercase">Nginx</div>
              <p className="font-bold uppercase tracking-tighter text-sm">Reverse Proxy</p>
              <div className="flex gap-2 justify-center mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <span>SSL</span> • <span>Routing</span> • <span>Headers</span>
              </div>
            </div>
            {/* Line leading from Nginx to the Grid */}
            <div className="absolute left-1/2 top-full w-px h-20 bg-gradient-to-b from-emerald-500 to-transparent"></div>
          </div>
        </div>

        {/* 4. Service Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-20">
          <ServiceCard title="Minecraft" subtitle="Game Hosting" port="Port: 25565" icon="🧱" colorClass="bg-green-500" onClick={() => handleCardClick("Minecraft Server")} />
          <ServiceCard title="DayZ Server" subtitle="Game Hosting" port="Port: 2302" icon="🧟" colorClass="bg-slate-400" onClick={() => handleCardClick("DayZ Server")} />
          <ServiceCard title="Mitch AI" subtitle="Local AI" port="Port: 8080" icon="🤖" colorClass="bg-orange-500" onClick={() => handleCardClick("Mitch AI")} />
          <ServiceCard title="Home Services" subtitle="Utilities" port="Port: Various" icon="🏠" colorClass="bg-blue-400" onClick={() => handleCardClick("Home Services")} />
          <ServiceCard title="Docker" subtitle="Apps" port="Isolated" icon="🐳" colorClass="bg-cyan-500" onClick={() => handleCardClick("Docker Containers")} />
        </div>

        {/* 5. Hardware Foundation Section */}
        <div className="mt-20 p-8 border border-white/10 rounded-[2.5rem] bg-gradient-to-b from-white/[0.03] to-transparent relative overflow-hidden backdrop-blur-sm">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-left max-w-xs cursor-default">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-500 font-black text-2xl tracking-tighter">X</span>
                <h2 className="text-xl font-bold text-white tracking-tight uppercase">Proxmox VE Cluster</h2>
              </div>
              <p className="text-slate-500 text-xs leading-relaxed uppercase tracking-wider font-semibold opacity-70">
                3-Node High Availability Cluster providing ZFS Storage & Virtualization.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <ProxmoxNode nodeName="Node 1" status="Online" onClick={() => handleCardClick("HP ProLiant Node 1")} />
              <ProxmoxNode nodeName="Node 2" status="Online" onClick={() => handleCardClick("HP ProLiant Node 2")} />
              <ProxmoxNode nodeName="Node 3" status="Online" onClick={() => handleCardClick("HP ProLiant Node 3")} />
            </div>

            <div 
              className="group bg-blue-600/10 border border-blue-500/20 p-5 rounded-2xl text-center min-w-[140px] transition-all hover:bg-blue-600/20 hover:border-blue-500/50 cursor-pointer"
              onClick={() => handleCardClick("ZFS Storage Pool")}
            >
              <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">🛢️</div>
              <p className="text-white font-bold text-xs uppercase tracking-tighter">ZFS Storage</p>
              <p className="text-blue-400 text-[10px] font-bold italic mt-1">Fault Tolerant</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}