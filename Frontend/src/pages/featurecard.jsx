import { useNavigate } from "react-router-dom";

export default function FeatureCards() {
  const navigate = useNavigate();
  const isLoggedIn = false;

  const features = [
    {
      title: "LogixAI Chat",
      description: "Advanced AI conversational assistant — understands context, answers technical queries, and assists across learning, development, and productivity tasks.",
      tags: ["AI", "Chat", "React", "LLM"],
      route: "/chat",
      image: "/chat.jpeg",
      codeUrl: "https://github.com/ayushi48",
      accent: "#9333ea", accentEnd: "#c026d3", label: "Conversational AI", number: "01",
    },
    {
      title: "AI Website Builder",
      description: "Automatically generates complete, responsive websites from prompts — clean HTML, CSS, and React components with modern UI/UX standards.",
      tags: ["React", "Website", "AI", "Automation"],
      route: "/website-builder",
      image: "/web.jpeg",
      codeUrl: "https://github.com/ayushi48",
      accent: "#ec4899", accentEnd: "#f43f5e", label: "Web Generation", number: "02",
    },
    {
      title: "AI Image Converter",
      description: "High-performance conversion supporting PNG, JPG, JPEG, WEBP, and AVIF — optimized quality, smart compression, and fast processing.",
      tags: ["Image Processing", "Conversion", "Optimization"],
      route: "/imageconverter",
      image: "/img.jpeg",
      codeUrl: "https://github.com/ayushi48",
      accent: "#d946ef", accentEnd: "#a855f7", label: "Image Processing", number: "03",
    },
    {
      title: "AI Background Remover",
      description: "Computer vision-powered background removal — precise subject detection and clean cutouts for design, e-commerce, and professional content.",
      tags: ["Computer Vision", "Deep Learning", "Design"],
      route: "/backgroundremover",
      image: "/bg.jpeg",
      codeUrl: "https://github.com/ayushi48",
      accent: "#6366f1", accentEnd: "#9333ea", label: "Vision AI", number: "04",
    },
  ];

  const handleCodeClick = (url) => window.open(url, "_blank", "noopener,noreferrer");
  const handleLiveDemo = (route) => navigate(isLoggedIn ? route : "/login");

  return (
    <section style={{ padding:"72px 20px", position:"relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        .fc-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        @media (max-width: 860px) { .fc-grid { grid-template-columns: 1fr !important; max-width: 560px !important; } }

        .fc-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.45s cubic-bezier(0.23,1,0.32,1);
        }
        .fc-card:hover { transform: translateY(-6px); border-color: rgba(255,255,255,0.11); }

        .fc-img-wrap { position:relative; overflow:hidden; height:clamp(160px,20vw,220px); }
        .fc-img-wrap img { width:100%; height:100%; object-fit:cover; transition:transform 0.55s cubic-bezier(0.23,1,0.32,1); }
        .fc-card:hover .fc-img-wrap img { transform:scale(1.06); }
        .fc-img-overlay { position:absolute; inset:0; background:linear-gradient(to bottom,transparent 35%,rgba(5,1,13,0.9) 100%); }

        .fc-num { position:absolute; top:14px; right:14px; width:40px; height:40px; border-radius:10px; background:rgba(0,0,0,0.45); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); display:flex; align-items:center; justify-content:center; font-family:'Syne',sans-serif; font-weight:800; font-size:12px; color:rgba(255,255,255,0.55); }
        .fc-cat { position:absolute; bottom:14px; left:14px; padding:4px 11px; border-radius:999px; font-size:10.5px; font-weight:600; letter-spacing:0.07em; text-transform:uppercase; backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.12); }

        .fc-body { padding:22px 22px 26px; }
        .fc-title { font-family:'Syne',sans-serif; font-weight:700; font-size:19px; color:#fff; margin-bottom:10px; letter-spacing:-0.01em; }
        .fc-desc { color:rgba(255,255,255,0.44); font-size:13.5px; line-height:1.72; margin-bottom:18px; }

        .fc-tags { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:22px; }
        .fc-tag { padding:3px 11px; border-radius:999px; font-size:11px; font-weight:500; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.48); }

        .fc-btns { display:flex; gap:10px; flex-wrap:wrap; }
        .fc-btn-p { display:inline-flex; align-items:center; gap:5px; padding:10px 22px; border-radius:11px; font-weight:600; font-size:13.5px; color:#fff; border:none; cursor:pointer; transition:all 0.22s; white-space:nowrap; }
        .fc-btn-p:hover { transform:scale(1.03); }
        .fc-btn-s { display:inline-flex; align-items:center; gap:5px; padding:10px 20px; border-radius:11px; font-weight:500; font-size:13.5px; color:rgba(255,255,255,0.6); background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); cursor:pointer; transition:all 0.2s; white-space:nowrap; }
        .fc-btn-s:hover { background:rgba(255,255,255,0.1); color:rgba(255,255,255,0.9); }

        .fc-accent-bar { position:absolute; bottom:0; left:0; right:0; height:2px; opacity:0; transition:opacity 0.35s; }
        .fc-card:hover .fc-accent-bar { opacity:1; }

        .fc-section-label { display:inline-flex; align-items:center; gap:7px; padding:5px 13px; border-radius:999px; background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.25); font-size:10.5px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#c084fc; margin-bottom:14px; }

        @media (max-width:480px) {
          .fc-body { padding:18px 16px 20px; }
          .fc-title { font-size:17px; }
          .fc-btn-p, .fc-btn-s { padding:9px 16px; font-size:13px; }
        }
      `}</style>

      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        {/* Heading */}
        <div style={{ textAlign:"center", marginBottom:56 }}>
          <div className="fc-section-label">
            <span style={{ color:"#a855f7", fontSize:"7px" }}>●</span>Core Features
          </div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(26px,3.5vw,44px)", lineHeight:1.15, letterSpacing:"-0.025em" }}>
            <span style={{ background:"linear-gradient(135deg,#c084fc 0%,#e879f9 45%,#f472b6 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              LogixAI Core Features
            </span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:15, maxWidth:420, margin:"12px auto 0", lineHeight:1.65 }}>
            Four powerful AI tools, one unified platform.
          </p>
        </div>

        {/* Grid */}
        <div className="fc-grid">
          {features.map((item,i)=>(
            <div key={i} className="fc-card"
              onMouseEnter={e=>{e.currentTarget.style.boxShadow=`0 20px 60px rgba(0,0,0,0.45), 0 0 50px ${item.accent}28`}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="none"}}>

              {/* Image */}
              <div className="fc-img-wrap">
                <img src={item.image} alt={item.title} loading="lazy" />
                <div className="fc-img-overlay" />
                <div className="fc-num">{item.number}</div>
                <div className="fc-cat" style={{ background:`${item.accent}22`, color:item.accent }}>{item.label}</div>
              </div>

              {/* Body */}
              <div className="fc-body">
                <h3 className="fc-title">{item.title}</h3>
                <p className="fc-desc">{item.description}</p>

                <div className="fc-tags">
                  {item.tags.map((t,j)=><span key={j} className="fc-tag">{t}</span>)}
                </div>

                <div className="fc-btns">
                  <button onClick={()=>handleLiveDemo(item.route)} className="fc-btn-p"
                    style={{ background:`linear-gradient(135deg,${item.accent},${item.accentEnd})`, boxShadow:`0 5px 20px ${item.accent}40` }}>
                    Live Demo ↗
                  </button>
                  <button onClick={()=>handleCodeClick(item.codeUrl)} className="fc-btn-s">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                    Code
                  </button>
                </div>
              </div>

              <div className="fc-accent-bar" style={{ background:`linear-gradient(90deg,${item.accent},${item.accentEnd})` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

