import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const BUSINESS_QUOTES = [
  "Let's circle back on that 🔄",
  "Let's get all our ducks in a row 🦆",
  "Okej, men vad är ROI:n? 📊",
  "Have you updated your LinkedIn?",
  "Let's take this offline",
  "Synergising our value streams",
  "Per my last email...",
  "Let's leverage the learnings!",
  "Moving the needle forward 📈",
  "Pivot! PIVOT!",
  "Let's align on next steps",
  "This is a real value-add",
  "Crush Q4! 📈",
  "Bandwidth permitting...",
  "Low-hanging fruit first",
  "Let's blue-sky this",
  "Passion + Excel = profit",
  "Think outside the box",
  "Jag tar det på firman",
  "Den här kvartalet ska bli bra",
  "Det är inte en kostnad, det är en investering",
  "KPIs are through the roof!",
  "We need to boil the ocean here",
  "Let's run it up the flagpole",
  "Proactive, not reactive 💪",
  "Lots of moving parts on this one",
];

const PERKS = [
  { id:"intern",      name:"Intern",              desc:"Honoured to be here",                              emoji:"☕", baseCost:50,      baseDpk:1,    color:"#74B9FF", face:"intern"   },
  { id:"analyst",     name:"Business Analyst",     desc:"3-5 years of experience", emoji:"📊", baseCost:500,     baseDpk:6,    color:"#A29BFE", face:"analyst"  },
  { id:"lecturer",    name:"Lecturer",             desc:"Knowledge sharer, idea inspirer",                  emoji:"📚", baseCost:3000,    baseDpk:25,   color:"#FDCB6E", face:"lecturer" },
  { id:"alumni",      name:"Alumni Network",       desc:"Your network is your net worth",                   emoji:"🤝", baseCost:15000,   baseDpk:80,   color:"#55EFC4", face:"alumni"   },
  { id:"professor",   name:"Professor",            desc:"Turning research into results",                    emoji:"🎓", baseCost:60000,   baseDpk:220,  color:"#FF7675", face:"professor"},
  { id:"ai_prog",     name:"Agentic AI Programme", desc:"The future is automated",                          emoji:"🤖", baseCost:220000,  baseDpk:650,  color:"#00CEC9", face:"ai"       },
  { id:"hankai",      name:"HankAI Partnership",   desc:"AI-powered everything, apparently",                emoji:"⚡", baseCost:800000,  baseDpk:1800, color:"#FD79A8", face:"hankai"   },
  { id:"startup",     name:"Student Startup",      desc:"Disrupting something, somewhere",                  emoji:"🚀", baseCost:3000000, baseDpk:6000, color:"#E17055", face:"startup"  },
];

const UPGRADES = [
  { id:"lunch",    name:"Premium School Lunch",     desc:"Beef and roast potatoes",              emoji:"🥗", baseCost:400,      baseDps:0.6,   color:"#55EFC4" },
  { id:"linkedin", name:"LinkedIn Update",          desc:"Open to opportunities 👀",             emoji:"💼", baseCost:4000,     baseDps:3.5,   color:"#74B9FF" },
  { id:"vest",     name:"Patagonia Vest",           desc:"The uniform of ambition",              emoji:"🧥", baseCost:20000,    baseDps:14,    color:"#FDCB6E" },
  { id:"sailboat", name:"Archipelago Sailboat",     desc:"Networking on the high seas",          emoji:"⛵", baseCost:90000,    baseDps:55,    color:"#A29BFE" },
  { id:"casa",     name:"Casa Refurbishment",       desc:"Marble countertops, obviously",        emoji:"🏠", baseCost:380000,   baseDps:180,   color:"#FF7675" },
  { id:"villa",    name:"Ekenäs Summer Villa",      desc:"Midsommar in style",                   emoji:"🌅", baseCost:1400000,  baseDps:580,   color:"#FD79A8" },
  { id:"regatta",  name:"Hanko Regatta VIP Table",  desc:"Rosé, sun, spreadsheets",              emoji:"🥂", baseCost:5500000,  baseDps:1800,  color:"#E17055" },
  { id:"ceo",      name:"Fortune 500 CEO",          desc:"Corner office. Corner of Europe.",     emoji:"🏆", baseCost:20000000, baseDps:6000,  color:"#FFD700" },
];

const FINAL_COST = 150000000;

// UI themes: id, crownsNeeded, label, bg gradient, accent color, card bg, text color
const THEMES = {
  default:   { bg:"#080814", grad:"linear-gradient(170deg,#080814 0%,#0d0d20 100%)", accent:"#FFD700", cardBg:"rgba(255,255,255,0.06)", headerBg:"rgba(0,0,0,0.7)", tabBg:"rgba(0,0,0,0.5)" },
  briefcase: { bg:"#0a0f1e", grad:"linear-gradient(170deg,#0a0f1e 0%,#1a2a4a 100%)", accent:"#74B9FF", cardBg:"rgba(116,185,255,0.07)", headerBg:"rgba(10,15,30,0.85)", tabBg:"rgba(10,15,30,0.6)" },
  yacht:     { bg:"#001a2e", grad:"linear-gradient(170deg,#001a2e 0%,#003d5c 100%)", accent:"#00CEC9", cardBg:"rgba(0,206,201,0.07)", headerBg:"rgba(0,26,46,0.85)", tabBg:"rgba(0,26,46,0.6)" },
  rocket:    { bg:"#1a0030", grad:"linear-gradient(170deg,#1a0030 0%,#3d0070 100%)", accent:"#A29BFE", cardBg:"rgba(162,155,254,0.07)", headerBg:"rgba(26,0,48,0.85)", tabBg:"rgba(26,0,48,0.6)" },
  diamond:   { bg:"#001428", grad:"linear-gradient(170deg,#001428 0%,#003060 100%)", accent:"#55EFC4", cardBg:"rgba(85,239,196,0.07)", headerBg:"rgba(0,20,40,0.85)", tabBg:"rgba(0,20,40,0.6)" },
  crown_skin:{ bg:"#1a1000", grad:"linear-gradient(170deg,#1a1000 0%,#3d2800 100%)", accent:"#FFD700", cardBg:"rgba(255,215,0,0.07)", headerBg:"rgba(26,16,0,0.85)", tabBg:"rgba(26,16,0,0.6)" },
  neon:      { bg:"#000a00", grad:"linear-gradient(170deg,#000a00 0%,#001a10 100%)", accent:"#5CE65C", cardBg:"rgba(92,230,92,0.07)", headerBg:"rgba(0,10,0,0.85)", tabBg:"rgba(0,10,0,0.6)" },
  sunset:    { bg:"#1a0000", grad:"linear-gradient(170deg,#1a0000 0%,#3d1000 100%)", accent:"#FF7675", cardBg:"rgba(255,118,117,0.07)", headerBg:"rgba(26,0,0,0.85)", tabBg:"rgba(26,0,0,0.6)" },
};

const RESKINS = [
  { id:"default",    name:"Euro Bill",           crownsNeeded:0,  desc:"The original hustle",                   centerEmoji:null,  themeId:"default",    fullUi:false },
  { id:"briefcase",  name:"Power Briefcase",      crownsNeeded:1,  desc:"Peak hustle energy",                    centerEmoji:"💼",  themeId:"default",    fullUi:false },
  { id:"yacht",      name:"Yacht Mode",           crownsNeeded:2,  desc:"We're on the boat",                     centerEmoji:"🛥️",  themeId:"default",    fullUi:false },
  { id:"rocket",     name:"Series A Rocket",      crownsNeeded:3,  desc:"To the moon (IPO pending)",             centerEmoji:"🚀",  themeId:"default",    fullUi:false },
  { id:"diamond",    name:"Diamond Hands",        crownsNeeded:4,  desc:"Never selling",                         centerEmoji:"💎",  themeId:"default",    fullUi:false },
  { id:"crown_skin", name:"Golden Crown",         crownsNeeded:5,  desc:"Reserved for legends only",             centerEmoji:"👑",  themeId:"default",    fullUi:false },
  { id:"wolf",       name:"Wolf of Helsinki St",  crownsNeeded:6,  desc:"Sell me this sailboat",                 centerEmoji:"🐺",  themeId:"default",    fullUi:false },
  { id:"trading",    name:"Trading Floor",        crownsNeeded:7,  desc:"Buy! Sell! Repeat!",                    centerEmoji:"📈",  themeId:"default",    fullUi:false },
  { id:"nordic",     name:"Nordic Noir",          crownsNeeded:8,  desc:"Mysterious, profitable",                centerEmoji:"🌑",  themeId:"default",    fullUi:false },
  { id:"archipelago",name:"Archipelago Dawn",     crownsNeeded:9,  desc:"Midsommar money vibes",                 centerEmoji:"🌅",  themeId:"default",    fullUi:false },
  { id:"neon_theme", name:"Neon Helsinki",        crownsNeeded:10, desc:"Full UI reskin — neon green",           centerEmoji:"💹",  themeId:"neon",       fullUi:true  },
  { id:"sunset_theme",name:"Baltic Sunset",       crownsNeeded:11, desc:"Full UI reskin — warm reds",            centerEmoji:"🌇",  themeId:"sunset",     fullUi:true  },
  { id:"yacht_theme",name:"Deep Ocean Mode",      crownsNeeded:12, desc:"Full UI reskin — deep sea blue",        centerEmoji:"🌊",  themeId:"yacht",      fullUi:true  },
  { id:"rocket_theme",name:"Cosmic Founder",      crownsNeeded:13, desc:"Full UI reskin — deep purple",          centerEmoji:"🌌",  themeId:"rocket",     fullUi:true  },
  { id:"diamond_thm",name:"Ice Cold CEO",         crownsNeeded:14, desc:"Full UI reskin — arctic teal",          centerEmoji:"🧊",  themeId:"diamond",    fullUi:true  },
  { id:"briefcase_th",name:"Corporate Elite",     crownsNeeded:15, desc:"Full UI reskin — steel blue",           centerEmoji:"🏛️",  themeId:"briefcase",  fullUi:true  },
  { id:"gold_theme", name:"Gilded Empire",        crownsNeeded:16, desc:"Full UI reskin — pure gold",            centerEmoji:"✨",  themeId:"crown_skin", fullUi:true  },
  { id:"crown17",    name:"The Penthouse",        crownsNeeded:17, desc:"Views from the very top",               centerEmoji:"🏙️",  themeId:"crown_skin", fullUi:true  },
  { id:"crown18",    name:"Legacy Mode",          crownsNeeded:18, desc:"Your name echoes through the halls",    centerEmoji:"🗿",  themeId:"crown_skin", fullUi:true  },
  { id:"crown19",    name:"Final Form",           crownsNeeded:19, desc:"The ultimate prestige skin",            centerEmoji:"🔱",  themeId:"crown_skin", fullUi:true  },
  { id:"hankai20",   name:"HankAI Legend",        crownsNeeded:20, desc:"🎉 We'll feature you on LinkedIn & Instagram — reach out to claim!", centerEmoji:"🤝", themeId:"crown_skin", fullUi:true, special:true },
];

function getUpgradeCost(item, owned) {
  return Math.floor(item.baseCost * Math.pow(1.22, owned));
}

function formatNum(n) {
  if (n >= 1e12) return (n/1e12).toFixed(2)+"T";
  if (n >= 1e9)  return (n/1e9).toFixed(2)+"B";
  if (n >= 1e6)  return (n/1e6).toFixed(2)+"M";
  if (n >= 1e3)  return (n/1e3).toFixed(1)+"K";
  return Math.floor(n).toString();
}

function FaceChar({ type, size=44 }) {
  const configs = {
    intern:   { bg:"#2a5298", hair:"#3e2723", shirt:"#1565c0", acc:"☕",  smile:true  },
    analyst:  { bg:"#4527a0", hair:"#212121", shirt:"#311b92", acc:"📊",  smile:true  },
    lecturer: { bg:"#e65100", hair:"#8d6e63", shirt:"#bf360c", acc:"📚",  smile:true  },
    alumni:   { bg:"#00695c", hair:"#3e2723", shirt:"#004d40", acc:"🤝",  smile:true  },
    professor:{ bg:"#880e4f", hair:"#bdbdbd", shirt:"#6a1b9a", acc:"🎓",  smile:true  },
    ai:       { bg:"#006064", hair:null,      shirt:"#00838f", acc:"🤖",  smile:true  },
    hankai:   { bg:"#ad1457", hair:"#1a237e", shirt:"#880e4f", acc:"⚡",  smile:true  },
    startup:  { bg:"#bf360c", hair:"#212121", shirt:"#e64a19", acc:"🚀",  smile:true  },
  };
  const c = configs[type] || configs.intern;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="23" fill={c.bg}/>
      <ellipse cx="24" cy="22" rx="10" ry="11" fill="#FFDAB9"/>
      {c.hair && <ellipse cx="24" cy="12" rx="10.5" ry="5.5" fill={c.hair}/>}
      {!c.hair && <ellipse cx="24" cy="12" rx="10" ry="4" fill="#37474f" opacity="0.6"/>}
      <circle cx="20" cy="21" r="1.8" fill="#1a1a1a"/>
      <circle cx="28" cy="21" r="1.8" fill="#1a1a1a"/>
      <circle cx="20.6" cy="20.4" r="0.6" fill="#fff"/>
      <circle cx="28.6" cy="20.4" r="0.6" fill="#fff"/>
      <ellipse cx="19.5" cy="23.5" rx="2" ry="1.2" fill="#ffb3b3" opacity="0.5"/>
      <ellipse cx="28.5" cy="23.5" rx="2" ry="1.2" fill="#ffb3b3" opacity="0.5"/>
      <path d="M20 27 Q24 31 28 27" stroke="#c0705a" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
      <ellipse cx="24" cy="37" rx="9.5" ry="7" fill={c.shirt}/>
      <text x="38" y="40" fontSize="9" textAnchor="middle">{c.acc}</text>
    </svg>
  );
}

export default function EuroHustle() {
  const navigate = useNavigate();
  const eurosRef       = useRef(0);
  const totalEarnedRef = useRef(0);
  const allTimeRef     = useRef(0);
  const clicksRef      = useRef(0);
  const powerFillRef   = useRef(0);
  const dpkRef         = useRef(1);
  const dpsRef         = useRef(0);
  const powerRef       = useRef(false);
  const nextId         = useRef(0);
  const billRef        = useRef(null);
  const rafDirty       = useRef(false);

  const [displayEuros, setDisplayEuros]       = useState(0);
  const [displayTotal, setDisplayTotal]        = useState(0);
  const [displayAllTime, setDisplayAllTime]    = useState(0);
  const [displayClicks, setDisplayClicks]      = useState(0);
  const [displayPowerFill, setDisplayPowerFill] = useState(0);
  const [allTimePerks, setAllTimePerks]     = useState(0);
  const [allTimeUpgrades, setAllTimeUpgrades] = useState(0);
  const [ownedPerks, setOwnedPerks]         = useState({});
  const [ownedUpgrades, setOwnedUpgrades]   = useState({});
  const [dpk, setDpk]                       = useState(1);
  const [dps, setDps]                       = useState(0);
  const [crowns, setCrowns]                 = useState(0);
  const [activeSkin, setActiveSkin]         = useState("default");
  const [tab, setTab]                       = useState("perks");
  const [floats, setFloats]                 = useState([]);
  const [moneyRain, setMoneyRain]           = useState([]);
  const [confetti, setConfetti]             = useState([]);
  const [quotePopup, setQuotePopup]         = useState(null);
  const [powerActive, setPowerActive]       = useState(false);
  const [powerTimer, setPowerTimer]         = useState(0);
  const [showCrownModal, setShowCrownModal] = useState(false);
  const [purchaseFlash, setPurchaseFlash]   = useState(null);

  const euros = displayEuros;
  const totalEarned = displayTotal;
  const allTimeEarned = displayAllTime;
  const allTimeClicks = displayClicks;
  const powerFill = displayPowerFill;

  useEffect(() => {
    let raf;
    const sync = () => {
      if (rafDirty.current) {
        rafDirty.current = false;
        setDisplayEuros(eurosRef.current);
        setDisplayTotal(totalEarnedRef.current);
        setDisplayAllTime(allTimeRef.current);
        setDisplayClicks(clicksRef.current);
        setDisplayPowerFill(powerFillRef.current);
      }
      raf = requestAnimationFrame(sync);
    };
    raf = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(raf);
  }, []);

  const currentSkinDef = RESKINS.find(r => r.id === activeSkin) || RESKINS[0];
  const theme = THEMES[currentSkinDef.themeId] || THEMES.default;
  const accentColor = theme.accent;

  useEffect(() => {
    let v = 1;
    PERKS.forEach(p => { v += p.baseDpk * (ownedPerks[p.id] || 0); });
    dpkRef.current = v;
    setDpk(v);
  }, [ownedPerks]);

  useEffect(() => {
    let v = 0;
    UPGRADES.forEach(u => { v += u.baseDps * (ownedUpgrades[u.id] || 0); });
    dpsRef.current = v;
    setDps(v);
  }, [ownedUpgrades]);

  useEffect(() => {
    const iv = setInterval(() => {
      if (dpsRef.current > 0) {
        const g = dpsRef.current / 20;
        eurosRef.current += g;
        totalEarnedRef.current += g;
        allTimeRef.current += g;
        rafDirty.current = true;
      }
    }, 50);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!powerActive) return;
    if (powerTimer <= 0) { setPowerActive(false); return; }
    const t = setTimeout(() => setPowerTimer(p => p-1), 1000);
    return () => clearTimeout(t);
  }, [powerActive, powerTimer]);

  const addRain = useCallback(() => {
    const count = Math.min(2 + Math.floor(dpkRef.current / 2000), 5);
    const drops = Array.from({ length: count }, () => ({
      id: nextId.current++,
      x: Math.random() * 100,
      size: 18 + Math.random() * 22,
      dur: 1.0 + Math.random() * 0.7,
    }));
    setMoneyRain(prev => [...prev.slice(-25), ...drops]);
    drops.forEach(d => setTimeout(() => setMoneyRain(prev => prev.filter(r => r.id !== d.id)), (d.dur+0.2)*1000));
  }, []);

  const lastTapRef = useRef(0);
  const handleClick = useCallback((e) => {
    const now = performance.now();
    if (now - lastTapRef.current < 40) return;
    lastTapRef.current = now;
    if (e.type === "touchstart") e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const touch = e.touches?.[0];
    const x = (touch ? touch.clientX : e.clientX) - rect.left;
    const y = (touch ? touch.clientY : e.clientY) - rect.top;
    const mult = powerRef.current ? 3 : 1;
    const earned = Math.max(1, Math.floor(dpkRef.current * mult));

    eurosRef.current += earned;
    totalEarnedRef.current += earned;
    allTimeRef.current += earned;
    clicksRef.current += 1;

    powerFillRef.current += 0.056;
    if (powerFillRef.current >= 100) {
      powerFillRef.current = 0;
      setPowerActive(true);
      setPowerTimer(8);
    }
    rafDirty.current = true;

    if (billRef.current) {
      billRef.current.style.transform = "scale(0.9)";
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (billRef.current) billRef.current.style.transform = "scale(1)";
        });
      });
    }

    addRain();
    const id = nextId.current++;
    setFloats(prev => [...prev.slice(-12), { id, x, y, val: earned, big: mult > 1 }]);
    setTimeout(() => setFloats(prev => prev.filter(f => f.id !== id)), 1200);
  }, [addRain]);

  const boom = useCallback((ex, ey) => {
    const pieces = Array.from({ length: 30 }, () => ({
      id: nextId.current++,
      x: ex, y: ey,
      vx: (Math.random()-0.5)*200,
      vy: -(50 + Math.random()*170),
      color: ["#FFD700","#FF6B6B","#74B9FF","#55EFC4","#A29BFE","#FD79A8","#FDCB6E"][Math.floor(Math.random()*7)],
      size: 5 + Math.random()*9,
      rot: Math.random()*720,
      isCircle: Math.random()>0.5,
    }));
    setConfetti(prev => [...prev.slice(-80), ...pieces]);
    pieces.forEach(p => setTimeout(() => setConfetti(prev => prev.filter(c => c.id !== p.id)), 1900));
  }, []);

  const popQuote = useCallback(() => {
    const q = BUSINESS_QUOTES[Math.floor(Math.random() * BUSINESS_QUOTES.length)];
    const id = nextId.current++;
    setQuotePopup({ id, text: q, x: 8 + Math.random()*50 });
    setTimeout(() => setQuotePopup(p => p?.id === id ? null : p), 2500);
  }, []);

  const buyPerk = useCallback((perk, e) => {
    const c = ownedPerks[perk.id] || 0;
    const cost = getUpgradeCost(perk, c);
    if (eurosRef.current < cost) return;
    eurosRef.current -= cost;
    rafDirty.current = true;
    setOwnedPerks(prev => ({ ...prev, [perk.id]: c+1 }));
    setAllTimePerks(n => n+1);
    setPurchaseFlash(perk.id);
    setTimeout(() => setPurchaseFlash(null), 700);
    const r = e.currentTarget.getBoundingClientRect();
    boom(r.left+r.width/2, r.top+r.height/2);
    popQuote();
  }, [ownedPerks, boom, popQuote]);

  const buyUpgrade = useCallback((upg, e) => {
    const c = ownedUpgrades[upg.id] || 0;
    const cost = getUpgradeCost(upg, c);
    if (eurosRef.current < cost) return;
    eurosRef.current -= cost;
    rafDirty.current = true;
    setOwnedUpgrades(prev => ({ ...prev, [upg.id]: c+1 }));
    setAllTimeUpgrades(n => n+1);
    setPurchaseFlash(upg.id);
    setTimeout(() => setPurchaseFlash(null), 700);
    const r = e.currentTarget.getBoundingClientRect();
    boom(r.left+r.width/2, r.top+r.height/2);
    popQuote();
  }, [ownedUpgrades, boom, popQuote]);

  const buyCrown = useCallback((e) => {
    if (eurosRef.current < FINAL_COST) return;
    const r = e.currentTarget.getBoundingClientRect();
    boom(r.left+r.width/2, r.top+r.height/2);
    eurosRef.current = 0; totalEarnedRef.current = 0;
    powerFillRef.current = 0; dpkRef.current = 1; dpsRef.current = 0;
    rafDirty.current = true;
    setOwnedPerks({}); setOwnedUpgrades({});
    setDpk(1); setDps(0); setPowerActive(false);
    setCrowns(c => c+1);
    setShowCrownModal(true);
  }, [boom]);

  const spawnedFaces = [];
  PERKS.forEach(p => {
    const n = Math.min(ownedPerks[p.id]||0, 2);
    for (let i=0; i<n; i++) spawnedFaces.push({ face:p.face, color:p.color, key:`${p.id}-${i}` });
  });
  const facePositions = [[8,15],[82,15],[4,42],[88,42],[10,68],[80,68],[18,25],[74,25],[14,55],[78,55],[20,78],[72,78]];

  const billLabel = `€${formatNum(Math.max(1, Math.floor(dpk)))}`;

  return (
    <div style={{ background:theme.bg, minHeight:"100vh", fontFamily:"'SF Pro Display',-apple-system,sans-serif", color:"#fff", display:"flex", flexDirection:"column", maxWidth:"420px", margin:"0 auto", position:"relative", overflow:"hidden" }}>
      <style>{`
        @keyframes floatUp{0%{transform:translateY(0) scale(1);opacity:1}100%{transform:translateY(-110px) scale(1.5);opacity:0}}
        @keyframes rainFall{0%{transform:translateY(-30px) rotate(-12deg);opacity:0.9}100%{transform:translateY(460px) rotate(18deg);opacity:0}}
        @keyframes confBurst{0%{transform:translate(0,0) rotate(0) scale(1);opacity:1}100%{transform:translate(var(--cx),var(--cy)) rotate(var(--cr)) scale(0);opacity:0}}
        @keyframes quoteRise{0%{transform:translateY(0);opacity:1}85%{opacity:1}100%{transform:translateY(-60px);opacity:0}}
        @keyframes crownDrop{0%{transform:translateY(-80px) rotate(-15deg) scale(0.5);opacity:0}60%{transform:translateY(8px) rotate(5deg) scale(1.1)}100%{transform:translateY(0) rotate(0) scale(1);opacity:1}}
        @keyframes powerGlow{0%,100%{opacity:0.8}50%{opacity:1}}
        @keyframes flashPurchase{0%{box-shadow:0 0 0 0 rgba(255,215,0,0)}50%{box-shadow:0 0 0 8px rgba(255,215,0,0.45)}100%{box-shadow:0 0 0 0 rgba(255,215,0,0)}}
        .buy-row{transition:all 0.15s;cursor:pointer}
        .buy-row:active{transform:scale(0.97)}
        .tap-zone:active{filter:brightness(1.15)}
      `}</style>

      {/* confetti layer */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
        {confetti.map(c => (
          <div key={c.id} style={{ position:"absolute", left:c.x, top:c.y, width:c.size, height:c.size, background:c.color, borderRadius:c.isCircle?"50%":"2px", "--cx":`${c.vx}px`, "--cy":`${c.vy}px`, "--cr":`${c.rot}deg`, animation:"confBurst 1.8s cubic-bezier(.25,.46,.45,.94) forwards", pointerEvents:"none" }} />
        ))}
      </div>

      {/* floating quote */}
      {quotePopup && (
        <div style={{ position:"fixed", bottom:175, left:`${quotePopup.x}%`, background:"rgba(10,10,30,0.92)", border:`1px solid ${accentColor}66`, borderRadius:"12px", padding:"8px 13px", fontSize:"11.5px", color:accentColor, animation:"quoteRise 2.5s ease forwards", zIndex:9990, pointerEvents:"none", maxWidth:"190px", textAlign:"center", backdropFilter:"blur(8px)" }}>
          {quotePopup.text}
        </div>
      )}

      {/* crown modal */}
      {showCrownModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.93)", zIndex:10000, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"18px", padding:"24px" }}>
          <div style={{ fontSize:"80px", animation:"crownDrop 0.8s cubic-bezier(.34,1.56,.64,1) forwards" }}>👑</div>
          <div style={{ fontSize:"26px", fontWeight:"700", color:"#FFD700", textAlign:"center" }}>Crown #{crowns} Earned!</div>
          <div style={{ fontSize:"14px", color:"rgba(255,255,255,0.55)", textAlign:"center", maxWidth:"270px", lineHeight:1.7 }}>
            The empire resets. The legacy doesn't.{"\n"}
            {crowns >= 20
              ? "🎉 You've reached 20 crowns! Contact us to claim your LinkedIn & Instagram feature!"
              : `New skins unlocked — check the Store!`}
          </div>
          {crowns >= 20 && (
            <div style={{ background:"rgba(255,215,0,0.15)", border:"2px solid #FFD700", borderRadius:"16px", padding:"14px 20px", textAlign:"center", maxWidth:"280px" }}>
              <div style={{ fontSize:"14px", color:"#FFD700", fontWeight:"600" }}>🤝 HankAI Legend Status</div>
              <div style={{ fontSize:"12px", color:"rgba(255,255,255,0.6)", marginTop:"6px" }}>Reach out via Instagram or LinkedIn to claim your feature post. You've genuinely earned it.</div>
            </div>
          )}
          <button onClick={() => setShowCrownModal(false)} style={{ marginTop:"8px", padding:"15px 50px", background:"#FFD700", color:"#000", border:"none", borderRadius:"16px", fontSize:"17px", fontWeight:"700", cursor:"pointer" }}>
            Build Again 🚀
          </button>
        </div>
      )}

      {/* power banner */}
      {powerActive && (
        <div style={{ position:"fixed", top:76, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#ff9800,#ffc107)", color:"#000", padding:"7px 22px", borderRadius:"20px", fontSize:"13px", fontWeight:"700", zIndex:500, animation:"powerGlow 0.5s ease infinite", whiteSpace:"nowrap", boxShadow:"0 4px 20px rgba(255,165,0,0.5)" }}>
          ⚡ TRIPLE EUROS — {powerTimer}s
        </div>
      )}

      {/* header */}
      <div style={{ background:theme.headerBg, padding:"14px 16px 10px", borderBottom:"1px solid rgba(255,255,255,0.07)", backdropFilter:"blur(14px)", flexShrink:0, zIndex:10 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
            <button
              onClick={() => navigate("/home")}
              aria-label="Back to home"
              title="Back to home"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                border: `1px solid ${accentColor}66`,
                background: `${accentColor}18`,
                color: accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                fontWeight: "700",
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              ←
            </button>
            <div>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", letterSpacing:"0.12em", textTransform:"uppercase" }}>Euro Hustle</div>
              <div style={{ fontSize:"28px", fontWeight:"700", color:accentColor, lineHeight:1.1, letterSpacing:"-0.5px" }}>
                €{formatNum(euros)}
                {powerActive && <span style={{ fontSize:"13px", color:"#FFA500", marginLeft:"6px" }}>×3</span>}
              </div>
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            {crowns > 0 && <div style={{ fontSize:"14px", marginBottom:"2px", letterSpacing:"2px" }}>{"👑".repeat(Math.min(crowns,8))}{crowns>8&&`+${crowns-8}`}</div>}
            <div style={{ fontSize:"11px", color:"#5CE65C", fontWeight:"600" }}>€{dps.toFixed(1)}/s</div>
            <div style={{ fontSize:"11px", color:"#74B9FF" }}>€{formatNum(dpk)}/tap</div>
          </div>
        </div>
        <div style={{ marginTop:"8px", background:"rgba(255,255,255,0.07)", borderRadius:"6px", height:"3px", overflow:"hidden" }}>
          <div style={{ height:"100%", background:`linear-gradient(90deg,${accentColor},#FF6B6B)`, width:`${Math.min(100,(totalEarned/FINAL_COST)*100)}%`, transition:"width 0.6s ease", borderRadius:"6px" }} />
        </div>
        <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.2)", marginTop:"3px" }}>
          €{formatNum(Math.max(0, FINAL_COST - totalEarned))} to crown
        </div>
      </div>

      {/* tap zone */}
      <div className="tap-zone" onClick={handleClick} onTouchStart={handleClick} style={{ position:"relative", height:"42vh", minHeight:"300px", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", userSelect:"none", overflow:"hidden", flexShrink:0, touchAction:"manipulation", WebkitTapHighlightColor:"transparent" }}>

        {/* power fill bar */}
        <div style={{ position:"absolute", left:"10px", top:"8%", bottom:"8%", width:"10px", background:"rgba(255,255,255,0.07)", borderRadius:"5px", overflow:"visible", zIndex:20 }}>
          <div style={{ position:"absolute", bottom:0, width:"100%", height:`${powerFill}%`, background:powerFill>75?`linear-gradient(0deg,${accentColor},#FFA500)`:"linear-gradient(0deg,#74B9FF,#A29BFE)", borderRadius:"5px", transition:"height 0.15s, background 0.3s" }} />
          <div style={{ position:"absolute", top:"-16px", left:"50%", transform:"translateX(-50%)", fontSize:"9px", color:"rgba(255,255,255,0.4)" }}>⚡</div>
        </div>

        {/* rain */}
        {moneyRain.map(d => (
          <div key={d.id} style={{ position:"absolute", left:`${d.x}%`, top:"-5%", fontSize:`${d.size}px`, animation:`rainFall ${d.dur}s linear forwards`, pointerEvents:"none", zIndex:5, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}>💶</div>
        ))}

        {/* spawned faces */}
        {spawnedFaces.slice(0,12).map((f,i) => {
          const [lp,tp] = facePositions[i]||[50,50];
          return (
            <div key={f.key} style={{ position:"absolute", left:`${lp}%`, top:`${tp}%`, transform:"translate(-50%,-50%)", zIndex:8, filter:`drop-shadow(0 2px 6px ${f.color}66)` }}>
              <FaceChar type={f.face} size={38}/>
            </div>
          );
        })}

        {/* center */}
        <div ref={billRef} style={{ transform:"scale(1)", transition:"transform 80ms cubic-bezier(.34,1.56,.64,1)", zIndex:10, position:"relative", willChange:"transform", filter:powerActive?`drop-shadow(0 0 22px ${accentColor}aa)`:`drop-shadow(0 6px 20px rgba(0,0,0,0.7))` }}>
          {currentSkinDef.centerEmoji ? (
            <div style={{ width:"150px", height:"150px", borderRadius:"50%", background:`radial-gradient(circle,${theme.bg} 0%,${theme.bg}ee 100%)`, border:`4px solid ${accentColor}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", boxShadow:`0 0 40px ${accentColor}44` }}>
              {crowns>0 && <div style={{ fontSize:"12px", letterSpacing:"3px", marginBottom:"4px" }}>{"👑".repeat(Math.min(crowns,4))}</div>}
              <div style={{ fontSize:"54px" }}>{currentSkinDef.centerEmoji}</div>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"4px" }}>{currentSkinDef.name}</div>
            </div>
          ) : (
            <div style={{ width:"200px", height:"100px", background:"linear-gradient(135deg,#145214 0%,#1e7a1e 40%,#0f4a0f 100%)", borderRadius:"14px", border:`3px solid ${accentColor}`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", boxShadow:"0 8px 40px rgba(0,0,0,0.8)" }}>
              {crowns>0 && <div style={{ position:"absolute", top:"3px", left:"50%", transform:"translateX(-50%)", fontSize:"11px", letterSpacing:"2px" }}>{"👑".repeat(Math.min(crowns,5))}</div>}
              <div style={{ position:"absolute", inset:0, background:"repeating-linear-gradient(45deg,transparent,transparent 5px,rgba(255,255,255,0.012) 5px,rgba(255,255,255,0.012) 6px)" }}/>
              <div style={{ fontSize:"30px", fontWeight:"900", color:accentColor, textShadow:"0 2px 8px rgba(0,0,0,0.7)", zIndex:1, letterSpacing:"-1px" }}>{billLabel}</div>
              <div style={{ fontSize:"9px", color:"rgba(255,255,255,0.4)", letterSpacing:"0.18em", zIndex:1 }}>EURO HUSTLE</div>
              <div style={{ position:"absolute", top:"8px", left:"10px", fontSize:"10px", color:`${accentColor}77`, fontWeight:"700" }}>€</div>
              <div style={{ position:"absolute", bottom:"8px", right:"10px", fontSize:"10px", color:`${accentColor}77`, fontWeight:"700" }}>€</div>
            </div>
          )}
        </div>

        {/* floating +€ */}
        {floats.map(f => (
          <div key={f.id} style={{ position:"absolute", left:f.x-22, top:f.y-22, color:f.big?"#FFA500":accentColor, fontWeight:"800", fontSize:f.big?"22px":"17px", textShadow:"0 1px 8px rgba(0,0,0,0.9)", animation:"floatUp 1.4s ease-out forwards", pointerEvents:"none", zIndex:30, fontFamily:"monospace", whiteSpace:"nowrap" }}>
            +€{formatNum(f.val)}{f.big?" ×3!":""}
          </div>
        ))}

        <div style={{ position:"absolute", bottom:"9px", left:"50%", transform:"translateX(-50%)", fontSize:"9px", color:"rgba(255,255,255,0.18)", letterSpacing:"0.1em", whiteSpace:"nowrap" }}>
          TAP · FILL BAR FOR ×3 BOOST
        </div>
      </div>

      {/* tabs */}
      <div style={{ display:"flex", background:theme.tabBg, borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", flexShrink:0 }}>
        {[["perks","Perks"],["upgrades","Upgrades"],["store","Store"],["stats","Stats"]].map(([id,label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex:1, padding:"9px 2px", background:tab===id?`${accentColor}14`:"transparent", border:"none", borderBottom:tab===id?`2px solid ${accentColor}`:"2px solid transparent", color:tab===id?accentColor:"rgba(255,255,255,0.38)", fontSize:"11px", fontWeight:tab===id?"600":"400", cursor:"pointer", textTransform:"capitalize", letterSpacing:"0.04em", transition:"all 0.15s" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"10px 12px 24px" }}>

        {tab==="perks" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"4px" }}>Perks — boost €/tap</div>
            {PERKS.map(perk => {
              const c = ownedPerks[perk.id]||0;
              const cost = getUpgradeCost(perk, c);
              const can = euros >= cost;
              const fl = purchaseFlash===perk.id;
              return (
                <div key={perk.id} className="buy-row" onClick={e=>buyPerk(perk,e)} style={{ background:fl?"rgba(255,215,0,0.2)":can?theme.cardBg:"rgba(255,255,255,0.03)", border:`1px solid ${can?`${accentColor}44`:"rgba(255,255,255,0.06)"}`, borderRadius:"14px", padding:"10px 12px", display:"flex", alignItems:"center", gap:"10px", opacity:can?1:0.5, animation:fl?"flashPurchase 0.6s ease":"none" }}>
                  <div style={{ width:"42px", height:"42px", borderRadius:"10px", background:`${perk.color}16`, border:`1px solid ${perk.color}38`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <FaceChar type={perk.face} size={36}/>
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                      <span style={{ fontWeight:"600", fontSize:"13px" }}>{perk.name}</span>
                      <span style={{ fontSize:"12px", fontWeight:"700", color:can?accentColor:"rgba(255,255,255,0.3)" }}>€{formatNum(cost)}</span>
                    </div>
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.38)", marginTop:"1px" }}>{perk.desc}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
                      <span style={{ fontSize:"10px", color:perk.color }}>+{perk.baseDpk} €/tap each</span>
                      <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)" }}>Owned: <b style={{ color:"#fff" }}>{c}</b>{c>0&&<span style={{ color:"#5CE65C", marginLeft:"4px" }}>= {perk.baseDpk*c}/tap</span>}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="upgrades" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"7px" }}>
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"4px" }}>Upgrades — passive income</div>
            {UPGRADES.map(upg => {
              const c = ownedUpgrades[upg.id]||0;
              const cost = getUpgradeCost(upg, c);
              const can = euros >= cost;
              const fl = purchaseFlash===upg.id;
              return (
                <div key={upg.id} className="buy-row" onClick={e=>buyUpgrade(upg,e)} style={{ background:fl?"rgba(255,215,0,0.2)":can?theme.cardBg:"rgba(255,255,255,0.03)", border:`1px solid ${can?`${accentColor}44`:"rgba(255,255,255,0.06)"}`, borderRadius:"14px", padding:"10px 12px", display:"flex", alignItems:"center", gap:"10px", opacity:can?1:0.5, animation:fl?"flashPurchase 0.6s ease":"none" }}>
                  <div style={{ width:"42px", height:"42px", borderRadius:"10px", background:`${upg.color}16`, border:`1px solid ${upg.color}38`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:"22px" }}>
                    {upg.emoji}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline" }}>
                      <span style={{ fontWeight:"600", fontSize:"13px" }}>{upg.name}</span>
                      <span style={{ fontSize:"12px", fontWeight:"700", color:can?accentColor:"rgba(255,255,255,0.3)" }}>€{formatNum(cost)}</span>
                    </div>
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.38)", marginTop:"1px" }}>{upg.desc}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:"3px" }}>
                      <span style={{ fontSize:"10px", color:upg.color }}>+{upg.baseDps}/s each</span>
                      <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)" }}>Owned: <b style={{ color:"#fff" }}>{c}</b>{c>0&&<span style={{ color:"#5CE65C", marginLeft:"4px" }}>= {(upg.baseDps*c).toFixed(1)}/s</span>}</span>
                    </div>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop:"12px", background:`${accentColor}0f`, border:`2px solid ${accentColor}66`, borderRadius:"16px", padding:"14px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"10px" }}>
                <span style={{ fontSize:"30px" }}>👑</span>
                <div>
                  <div style={{ fontWeight:"700", fontSize:"15px", color:accentColor }}>The Crown</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.45)", marginTop:"2px" }}>You've made it. Truly. Reset and do it again.</div>
                </div>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div>
                  <div style={{ fontSize:"15px", fontWeight:"700", color:accentColor }}>€{formatNum(FINAL_COST)}</div>
                  <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)" }}>Resets everything</div>
                </div>
                <button onClick={buyCrown} disabled={euros<FINAL_COST} style={{ padding:"10px 20px", background:euros>=FINAL_COST?accentColor:"rgba(255,255,255,0.08)", color:euros>=FINAL_COST?"#000":"rgba(255,255,255,0.3)", border:"none", borderRadius:"12px", fontSize:"13px", fontWeight:"700", cursor:euros>=FINAL_COST?"pointer":"not-allowed", transition:"all 0.2s" }}>
                  {euros>=FINAL_COST?"CLAIM 👑":`€${formatNum(FINAL_COST-euros)} away`}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab==="store" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"4px" }}>Store — spend crowns 👑</div>
            <div style={{ background:`${accentColor}0f`, border:`1px solid ${accentColor}33`, borderRadius:"12px", padding:"10px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <span style={{ fontSize:"12px", color:"rgba(255,255,255,0.5)" }}>Your crowns</span>
              <span style={{ fontSize:"17px", fontWeight:"700", color:accentColor }}>{crowns} 👑</span>
            </div>
            {RESKINS.map(sk => {
              const unlocked = crowns >= sk.crownsNeeded;
              const isActive = activeSkin === sk.id;
              return (
                <div key={sk.id} style={{ background:isActive?`${accentColor}18`:unlocked?theme.cardBg:"rgba(255,255,255,0.02)", border:`1px solid ${isActive?`${accentColor}66`:unlocked?"rgba(255,255,255,0.1)":"rgba(255,255,255,0.04)"}`, borderRadius:"14px", padding:"11px 13px", display:"flex", alignItems:"center", gap:"11px", opacity:unlocked?1:0.38 }}>
                  <div style={{ fontSize:"26px", width:"36px", textAlign:"center" }}>{sk.centerEmoji||"💶"}</div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                      <span style={{ fontWeight:"600", fontSize:"13px", color:isActive?accentColor:"#fff" }}>{sk.name}</span>
                      {sk.fullUi && <span style={{ fontSize:"9px", background:`${accentColor}22`, color:accentColor, padding:"1px 5px", borderRadius:"4px", letterSpacing:"0.06em" }}>FULL UI</span>}
                      {sk.special && <span style={{ fontSize:"9px", background:"rgba(255,100,100,0.2)", color:"#FF6B6B", padding:"1px 5px", borderRadius:"4px" }}>SPECIAL</span>}
                    </div>
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.38)", marginTop:"2px", lineHeight:1.4 }}>{sk.desc}</div>
                    <div style={{ fontSize:"10px", color:`${accentColor}88`, marginTop:"2px" }}>{sk.crownsNeeded===0?"Free":`Requires ${sk.crownsNeeded} 👑`}</div>
                  </div>
                  {unlocked ? (
                    <button onClick={() => setActiveSkin(sk.id)} style={{ flexShrink:0, padding:"7px 12px", background:isActive?accentColor:`${accentColor}18`, color:isActive?"#000":accentColor, border:`1px solid ${accentColor}44`, borderRadius:"10px", fontSize:"11px", fontWeight:"700", cursor:"pointer" }}>
                      {isActive?"Active":"Use"}
                    </button>
                  ) : (
                    <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.2)", textAlign:"center", flexShrink:0 }}>🔒<br/>{sk.crownsNeeded}👑</div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab==="stats" && (
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>

            {/* current run */}
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"2px" }}>This run</div>
            <div style={{ background:`${accentColor}12`, border:`1px solid ${accentColor}28`, borderRadius:"14px", padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"4px" }}>Run earnings</div>
              <div style={{ fontSize:"32px", fontWeight:"700", color:accentColor }}>€{formatNum(totalEarned)}</div>
            </div>
            {[
              { label:"Current balance",   val:`€${formatNum(euros)}`,      color:"#fff"    },
              { label:"€ per second",      val:`€${dps.toFixed(2)}/s`,      color:"#5CE65C" },
              { label:"€ per tap",         val:`€${formatNum(dpk)}`,         color:"#74B9FF" },
              { label:"Perks owned",       val:Object.values(ownedPerks).reduce((a,b)=>a+b,0),   color:"#A29BFE" },
              { label:"Upgrades owned",    val:Object.values(ownedUpgrades).reduce((a,b)=>a+b,0), color:"#FDCB6E" },
            ].map(s => (
              <div key={s.label} style={{ background:theme.cardBg, border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"11px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)" }}>{s.label}</span>
                <span style={{ fontSize:"14px", fontWeight:"600", color:s.color }}>{s.val}</span>
              </div>
            ))}

            {/* all time */}
            <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.3)", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:"8px", marginBottom:"2px" }}>All-time career</div>
            <div style={{ background:"rgba(255,215,0,0.07)", border:"1px solid rgba(255,215,0,0.2)", borderRadius:"14px", padding:"16px", textAlign:"center" }}>
              <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"4px" }}>Total career earnings</div>
              <div style={{ fontSize:"28px", fontWeight:"700", color:"#FFD700" }}>€{formatNum(allTimeEarned)}</div>
            </div>
            {[
              { label:"Crowns earned 👑",        val:crowns,          color:"#FFD700" },
              { label:"Total taps",              val:formatNum(allTimeClicks), color:"#74B9FF" },
              { label:"Total perks purchased",   val:allTimePerks,    color:"#A29BFE" },
              { label:"Total upgrades purchased",val:allTimeUpgrades, color:"#FDCB6E" },
            ].map(s => (
              <div key={s.label} style={{ background:theme.cardBg, border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", padding:"11px 14px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:"13px", color:"rgba(255,255,255,0.5)" }}>{s.label}</span>
                <span style={{ fontSize:"14px", fontWeight:"600", color:s.color }}>{s.val}</span>
              </div>
            ))}

            {crowns > 0 && (
              <div style={{ background:"rgba(255,215,0,0.07)", border:"1px solid rgba(255,215,0,0.2)", borderRadius:"14px", padding:"14px", marginTop:"4px" }}>
                <div style={{ fontSize:"10px", color:"rgba(255,255,255,0.35)", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"8px" }}>Crown collection</div>
                <div style={{ fontSize:"22px", letterSpacing:"3px", wordBreak:"break-all", lineHeight:1.6 }}>{"👑".repeat(Math.min(crowns,20))}</div>
                <div style={{ fontSize:"12px", color:"rgba(255,215,0,0.55)", marginTop:"6px" }}>
                  {crowns>=20?"HankAI Legend. A feature post awaits you.":crowns>=10?"You're building a dynasty.":crowns>=5?"Seriously dedicated.":crowns>=2?"Two crowns. The grind continues.":"First crown. The empire begins."}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
