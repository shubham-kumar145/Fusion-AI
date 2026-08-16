import { Link } from "react-router-dom";
import { Github, Linkedin, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  const tools   = [{ label:"AI Chat", to:"/chat" },{ label:"Website Builder", to:"/website-builder" },{ label:"Image Converter", to:"/imageconverter" },{ label:"Background Remover", to:"/backgroundremover" }];
  const company = [{ label:"About", to:"/about" },{ label:"Features", to:"/features" },{ label:"Contact", to:"/contact" },{ label:"Privacy Policy", to:"/privacy" }];
  const socials  = [
    { icon:<Github size={17}/>, href:"https://github.com/ayushi48", label:"GitHub" },
    { icon:<Linkedin size={17}/>, href:"https://www.linkedin.com/in/ayushi-kumari48/", label:"LinkedIn" },
    { icon:<Instagram size={17}/>, href:"#", label:"Instagram" },
    { icon:<Twitter size={17}/>, href:"#", label:"Twitter" },
    { icon:<Mail size={17}/>, href:"mailto:hello@logixai.com", label:"Email" },
  ];

  return (
    <footer style={{ position:"relative", overflow:"hidden", background:"linear-gradient(180deg,#0d0520 0%,#080112 45%,#05010d 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');

        /* Glows */
        .ft-glow-t { position:absolute; top:-180px; left:50%; transform:translateX(-50%); width:min(700px,90vw); height:350px; background:radial-gradient(ellipse,rgba(88,28,135,0.1) 0%,transparent 70%); pointer-events:none; }
        .ft-glow-br { position:absolute; bottom:-80px; right:-80px; width:min(400px,50vw); height:min(400px,50vw); background:radial-gradient(circle,rgba(236,72,153,0.07) 0%,transparent 70%); filter:blur(70px); pointer-events:none; }

        /* CTA banner */
        .ft-cta { position:relative; border-radius:20px; padding:clamp(32px,5vw,56px) clamp(20px,4vw,48px); overflow:hidden; text-align:center; margin-bottom:64px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); }
        .ft-cta::before { content:''; position:absolute; inset:0; background:linear-gradient(135deg,rgba(147,51,234,0.1) 0%,rgba(217,70,239,0.06) 50%,rgba(236,72,153,0.08) 100%); border-radius:20px; }
        .ft-cta-glow { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:min(500px,80vw); height:200px; background:radial-gradient(ellipse,rgba(168,85,247,0.13) 0%,transparent 70%); filter:blur(50px); pointer-events:none; }

        /* Grid */
        .ft-grid { display:grid; grid-template-columns:1.8fr 1fr 1fr 1.1fr; gap:40px; }
        @media (max-width:900px)  { .ft-grid { grid-template-columns:1fr 1fr !important; gap:32px !important; } }
        @media (max-width:500px)  { .ft-grid { grid-template-columns:1fr !important; gap:28px !important; } }

        .ft-link { color:rgba(255,255,255,0.42); text-decoration:none; font-size:14px; line-height:1; transition:color 0.2s; display:inline-block; }
        .ft-link:hover { color:#c084fc; }

        .ft-social { width:40px; height:40px; border-radius:11px; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:rgba(255,255,255,0.44); text-decoration:none; transition:all 0.22s; flex-shrink:0; }
        .ft-social:hover { background:rgba(168,85,247,0.12); border-color:rgba(168,85,247,0.3); color:#c084fc; transform:translateY(-2px); box-shadow:0 6px 20px rgba(168,85,247,0.2); }

        .ft-col-h { font-size:10.5px; font-weight:600; letter-spacing:0.12em; text-transform:uppercase; color:rgba(255,255,255,0.22); margin-bottom:18px; }

        .ft-top-line { height:1px; background:linear-gradient(90deg,transparent,rgba(168,85,247,0.3),rgba(236,72,153,0.3),transparent); margin-bottom:56px; }
        .ft-bot-line  { height:1px; background:linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent); margin-bottom:24px; }

        .ft-cta-btns { display:flex; gap:12px; justify-content:center; flex-wrap:wrap; }

        .ft-pill { display:inline-flex; align-items:center; gap:7px; padding:5px 13px; border-radius:999px; background:rgba(168,85,247,0.1); border:1px solid rgba(168,85,247,0.25); font-size:10.5px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:#c084fc; margin-bottom:14px; }

        .btn-primary-ft { display:inline-flex; align-items:center; gap:6px; padding:11px 26px; border-radius:11px; background:linear-gradient(135deg,#9333ea,#ec4899); color:#fff; font-weight:600; font-size:14px; text-decoration:none; box-shadow:0 6px 24px rgba(147,51,234,0.38); transition:all 0.22s; white-space:nowrap; }
        .btn-primary-ft:hover { transform:scale(1.03); box-shadow:0 10px 36px rgba(236,72,153,0.48); }
        .btn-sec-ft { display:inline-flex; align-items:center; padding:11px 22px; border-radius:11px; border:1px solid rgba(255,255,255,0.11); color:rgba(255,255,255,0.68); font-weight:500; font-size:14px; text-decoration:none; background:rgba(255,255,255,0.04); transition:all 0.2s; white-space:nowrap; }
        .btn-sec-ft:hover { background:rgba(255,255,255,0.08); }

        @media (max-width:480px) {
          .ft-cta { padding:28px 16px !important; }
          .btn-primary-ft, .btn-sec-ft { font-size:13px; padding:10px 18px; }
        }
      `}</style>

      <div className="ft-glow-t" />
      <div className="ft-glow-br" />

      <div style={{ position:"relative", zIndex:1, maxWidth:1200, margin:"0 auto", padding:"72px 20px 36px" }}>

        {/* ── CTA Banner ── */}
        <div className="ft-cta">
          <div className="ft-cta-glow" />
          <div style={{ position:"relative", zIndex:1 }}>
            <div className="ft-pill" style={{ display:"inline-flex" }}>
              <span style={{ color:"#a855f7", fontSize:"7px" }}>●</span>Start Today
            </div>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"clamp(22px,4vw,38px)", color:"#fff", letterSpacing:"-0.02em", marginBottom:12, lineHeight:1.2 }}>
              Ready to Build with AI?
            </h3>
            <p style={{ color:"rgba(255,255,255,0.38)", fontSize:14.5, marginBottom:28, maxWidth:400, margin:"0 auto 28px", lineHeight:1.65 }}>
              Join creators and developers already using LogixAI to build, design, and automate.
            </p>
            <div className="ft-cta-btns">
              <Link to="/signup" className="btn-primary-ft">Get Started Free ✦</Link>
              <Link to="/chat" className="btn-sec-ft">Try AI Chat →</Link>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="ft-top-line" />

        {/* ── Grid ── */}
        <div className="ft-grid">

          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:9, marginBottom:16 }}>
              <div style={{ width:34, height:34, borderRadius:9, background:"linear-gradient(135deg,#9333ea,#ec4899)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:16, boxShadow:"0 0 16px rgba(147,51,234,0.38)", flexShrink:0 }}>🚀</div>
              <span style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:20, background:"linear-gradient(135deg,#c084fc,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>LogixAI</span>
            </div>
            <p style={{ color:"rgba(255,255,255,0.33)", fontSize:13.5, lineHeight:1.75, maxWidth:260, marginBottom:28 }}>
              A next-gen AI platform for intelligent conversations, website generation, image processing, and automation.
            </p>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {socials.map((s,i)=>(
                <a key={i} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="ft-social">{s.icon}</a>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <div className="ft-col-h">Tools</div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {tools.map((t,i)=><Link key={i} to={t.to} className="ft-link">{t.label}</Link>)}
            </div>
          </div>

          {/* Company */}
          <div>
            <div className="ft-col-h">Company</div>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {company.map((c,i)=><Link key={i} to={c.to} className="ft-link">{c.label}</Link>)}
            </div>
          </div>

          {/* Stack */}
          <div>
            <div className="ft-col-h">Built With</div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {["React + Vite","Node.js + Express","MongoDB","Tailwind CSS","AI APIs"].map((t,i)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", gap:7, fontSize:13, color:"rgba(255,255,255,0.33)" }}>
                  <span style={{ color:"#a855f7", fontSize:"7px" }}>◆</span>{t}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ marginTop:52 }}>
          <div className="ft-bot-line" />
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
            <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12.5 }}>© {year} LogixAI. All rights reserved.</p>
            <p style={{ color:"rgba(255,255,255,0.2)", fontSize:12.5, display:"flex", alignItems:"center", gap:5 }}>
              Crafted with <span style={{ color:"#ec4899" }}>❤️</span> using MERN Stack &amp; AI
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
