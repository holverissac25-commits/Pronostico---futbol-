import { useState } from "react";
const LIGAS = ["Premier League","La Liga","Serie A","Bundesliga","Ligue 1","Liga BetPlay","Liga MX","Champions League","Copa Libertadores","Mundial de Clubes 2026"];
function ProbBar({label,pct,color}){return(<div style={{marginBottom:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:6}}><span style={{color:"#8899aa",fontFamily:"monospace"}}>{label}</span><span style={{color,fontWeight:700}}>{pct}%</span></div><div style={{height:8,background:"#0d1520",borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:4}}/></div></div>)}
function StatBar({label,home,away}){const total=(home+away)||1;const h=Math.round((home/total)*100);return(<div style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#667788",marginBottom:5,fontFamily:"monospace"}}><span style={{color:"#4fc3f7"}}>{home}</span><span>{label}</span><span style={{color:"#ef5350"}}>{away}</span></div><div style={{display:"flex",height:6,borderRadius:3,overflow:"hidden",background:"#111820"}}><div style={{width:`${h}%`,background:"linear-gradient(90deg,#0d47a1,#4fc3f7)"}}/><div style={{width:`${100-h}%`,background:"linear-gradient(90deg,#ef5350,#b71c1c)"}}/></div></div>)}
export default function App(){
const [liga,setLiga]=useState("");
const [local,setLocal]=useState("");
const [visitante,setVisitante]=useState("");
const [contexto,setContexto]=useState("");
const [loading,setLoading]=useState(false);
const [resultado,setResultado]=useState(null);
const [error,setError]=useState("");
const analizar=async()=>{
if(!local.trim()||!visitante.trim()){setError("⚠️ Ingresa los dos equipos.");return;}
setError("");setLoading(true);setResultado(null);
const prompt=`Eres analista de fútbol experto. Responde SOLO con JSON válido sin texto extra ni backticks.\nPartido: ${local} vs ${visitante}\nLiga: ${liga||"No especificada"}\nContexto: ${contexto||"Partido regular"}\nDevuelve exactamente:\n{"titulo":"texto","pronostico":"Victoria Local","resultado_probable":"2-1","confianza":72,"probabilidades":{"local":55,"empate":25,"visitante":20},"estadisticas":{"posesion_local":58,"posesion_visitante":42,"tiros_local":14,"tiros_visitante":9,"corners_local":6,"corners_visitante":4},"factores_clave":["factor1","factor2","factor3"],"analisis":"Análisis de 3 líneas.","jugador_clave_local":"Nombre","jugador_clave_visitante":"Nombre","cuotas_sugeridas":{"local":"1.85","empate":"3.40","visitante":"4.20"},"nivel_riesgo":"Medio"}\npronostico debe ser exactamente "Victoria Local", "Empate" o "Victoria Visitante". Probabilidades suman 100.`;
try{
const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1024,messages:[{role:"user",content:prompt}]})});
if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(`API ${r.status}: ${e?.error?.message||r.statusText}`);}
const d=await r.json();
const t=d.content?.map(b=>b.text||"").join("").trim()||"";
const m=t.match(/\{[\s\S]*\}/);
if(!m)throw new Error("JSON inválido");
setResultado(JSON.parse(m[0]));
}catch(e){setError(`❌ ${e.message}`);}
finally{setLoading(false);}};
const cp=p=>{if(!p)return"#4fc3f7";if(p.includes("Local"))return"#4fc3f7";if(p.includes("Visitante"))return"#ef5350";return"#ffd54f";};
const cr=r=>{if(r==="Bajo")return"#66bb6a";if(r==="Alto")return"#ef5350";return"#ffd54f";};
const inp={width:"100%",background:"#0d1a2a",border:"1px solid #1e3050",color:"#e0ecf8",borderRadius:4,padding:"12px 14px",fontSize:15,outline:"none",fontFamily:"Georgia,serif",boxSizing:"border-box"};
return(<div style={{minHeight:"100vh",background:"#060c16",backgroundImage:"radial-gradient(ellipse at 15% 0%,#0a1f40 0%,transparent 55%)",color:"#e0ecf8",fontFamily:"Georgia,serif",paddingBottom:60}}>
<div style={{background:"linear-gradient(180deg,#0a1628,#060c16)",borderBottom:"1px solid #1a3050",padding:"32px 24px 26px",textAlign:"center"}}>
<div style={{fontSize:10,letterSpacing:4,color:"#4fc3f7",fontFamily:"monospace",marginBottom:10}}>⚽ ANÁLISIS TÁCTICO · IA</div>
<h1 style={{margin:0,fontWeight:900,fontSize:"clamp(30px,7vw,52px)",lineHeight:1,background:"linear-gradient(135deg,#e0ecf8 40%,#4fc3f7)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>PRONÓSTICOS</h1>
<div style={{fontSize:11,color:"#2a4a60",fontFamily:"monospace",letterSpacing:3,marginTop:6}}>FÚTBOL · INTELIGENCIA ARTIFICIAL</div>
</div>
<div style={{maxWidth:580,margin:"0 auto",padding:"32px 20px 0"}}>
<div style={{marginBottom:18}}><label style={{display:"block",fontSize:10,letterSpacing:3,fontFamily:"monospace",marginBottom:7,color:"#4a6a7a"}}>LIGA</label>
<select value={liga} onChange={e=>{setLiga(e.target.value);setResultado(null);setError("");}} style={{...inp,color:liga?"#e0ecf8":"#3d5a6a"}}>
<option value="">Selecciona una liga...</option>{LIGAS.map(l=><option key={l} value={l}>{l}</option>)}</select></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 36px 1fr",gap:10,alignItems:"end",marginBottom:18}}>
<div><label style={{display:"block",fontSize:10,letterSpacing:3,fontFamily:"monospace",marginBottom:7,color:"#4fc3f7"}}>LOCAL</label><input placeholder="Ej: Nacional" value={local} onChange={e=>{setLocal(e.target.value);setResultado(null);setError("");}} style={inp}/></div>
<div style={{textAlign:"center",paddingBottom:10,color:"#2a4060",fontSize:14,fontFamily:"monospace"}}>VS</div>
<div><label style={{display:"block",fontSize:10,letterSpacing:3,fontFamily:"monospace",marginBottom:7,color:"#ef5350"}}>VISITANTE</label><input placeholder="Ej: América" value={visitante} onChange={e=>{setVisitante(e.target.value);setResultado(null);setError("");}} style={inp}/></div>
</div>
<div style={{marginBottom:22}}><label style={{display:"block",fontSize:10,letterSpacing:3,fontFamily:"monospace",marginBottom:7,color:"#4a6a7a"}}>CONTEXTO (opcional)</label><textarea placeholder="Ej: Final de copa, baja por lesión..." value={contexto} onChange={e=>{setContexto(e.target.value);setResultado(null);setError("");}} rows={2} style={{...inp,resize:"vertical"}}/></div>
{error&&<div style={{background:"#1a0808",border:"1px solid #ef535044",borderRadius:4,padding:"12px 16px",color:"#ef9090",fontSize:13,marginBottom:16,fontFamily:"monospace"}}>{error}</div>}
<button onClick={analizar} disabled={loading} style={{width:"100%",padding:"15px",background:loading?"#0d1a2a":"linear-gradient(135deg,#0d47a1,#1976d2,#0d47a1)",border:"1px solid #1565c0",borderRadius:4,color:loading?"#3a5a7a":"#e0ecf8",fontSize:12,fontFamily:"monospace",letterSpacing:3,textTransform:"uppercase",cursor:loading?"not-allowed":"pointer"}}>
{loading?"⏳  Analizando...":"⚡  Generar Pronóstico"}</button>
{loading&&<div style={{textAlign:"center",padding:"40px 0 10px",color:"#3d5a6a"}}><div style={{fontSize:36,display:"inline-block",animation:"spin 1.4s linear infinite"}}>⚽</div><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>}
{resultado&&!loading&&<div style={{marginTop:32}}>
<div style={{background:"linear-gradient(135deg,#0a1628,#0d1f10)",border:"1px solid #1a3050",borderRadius:6,padding:"22px 20px",textAlign:"center",marginBottom:14}}>
<div style={{fontSize:10,color:"#3a5a6a",fontFamily:"monospace",letterSpacing:2,marginBottom:12}}>{liga||"FÚTBOL"} · ANÁLISIS IA</div>
<div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:20,marginBottom:16}}>
<div><div style={{fontSize:20,fontWeight:900,color:"#4fc3f7"}}>{local.toUpperCase()}</div><div style={{fontSize:9,color:"#2a4a60",fontFamily:"monospace",marginTop:3}}>LOCAL</div></div>
<div style={{fontSize:20,color:"#1a3050",fontWeight:900}}>–</div>
<div><div style={{fontSize:20,fontWeight:900,color:"#ef5350"}}>{visitante.toUpperCase()}</div><div style={{fontSize:9,color:"#3a2020",fontFamily:"monospace",marginTop:3}}>VISITANTE</div></div>
</div>
<div style={{display:"inline-block",background:"#060c16",border:`2px solid ${cp(resultado.pronostico)}`,borderRadius:8,padding:"12px 32px",boxShadow:`0 0 24px ${cp(resultado.pronostico)}33`}}>
<div style={{fontSize:36,fontWeight:900,letterSpacing:6,color:cp(resultado.pronostico)}}>{resultado.resultado_probable}</div>
<div style={{fontSize:9,color:"#3a5a6a",fontFamily:"monospace",letterSpacing:2,marginTop:4}}>RESULTADO PROBABLE</div>
</div></div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
<div style={{background:"#0a1628",border:`1px solid ${cp(resultado.pronostico)}33`,borderRadius:6,padding:"16px",textAlign:"center"}}><div style={{fontSize:9,color:"#3a5a6a",fontFamily:"monospace",letterSpacing:2,marginBottom:8}}>PRONÓSTICO</div><div style={{fontSize:15,fontWeight:700,color:cp(resultado.pronostico)}}>{resultado.pronostico}</div></div>
<div style={{background:"#0a1628",border:"1px solid #1a3050",borderRadius:6,padding:"16px",textAlign:"center"}}><div style={{fontSize:9,color:"#3a5a6a",fontFamily:"monospace",letterSpacing:2,marginBottom:8}}>CONFIANZA</div><div style={{fontSize:15,fontWeight:700,color:resultado.confianza>70?"#66bb6a":resultado.confianza>55?"#ffd54f":"#ef5350"}}>{resultado.confianza}%</div></div>
</div>
<div style={{background:"#0a1628",border:"1px solid #1a3050",borderRadius:6,padding:"20px",marginBottom:14}}>
<div style={{fontSize:9,letterSpacing:3,color:"#3a5a6a",fontFamily:"monospace",marginBottom:16}}>PROBABILIDADES</div>
<ProbBar label="Victoria Local" pct={resultado.probabilidades?.local||0} color="#4fc3f7"/>
<ProbBar label="Empate" pct={resultado.probabilidades?.empate||0} color="#ffd54f"/>
<ProbBar label="Victoria Visitante" pct={resultado.probabilidades?.visitante||0} color="#ef5350"/>
</div>
{resultado.estadisticas&&<div style={{background:"#0a1628",border:"1px solid #1a3050",borderRadius:6,padding:"20px",marginBottom:14}}>
<div style={{fontSize:9,letterSpacing:3,color:"#3a5a6a",fontFamily:"monospace",marginBottom:16}}>ESTADÍSTICAS PROYECTADAS</div>
<StatBar label="POSESIÓN %" home={resultado.estadisticas.posesion_local} away={resultado.estadisticas.posesion_visitante}/>
<StatBar label="TIROS" home={resultado.estadisticas.tiros_local} away={resultado.estadisticas.tiros_visitante}/>
<StatBar label="CÓRNERS" home={resultado.estadisticas.corners_local} away={resultado.estadisticas.corners_visitante}/>
</div>}
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
<div style={{background:"#08121e",border:"1px solid #1a4060",borderRadius:6,padding:"14px"}}><div style={{fontSize:9,color:"#4fc3f7",fontFamily:"monospace",letterSpacing:2,marginBottom:7}}>⭐ CLAVE LOCAL</div><div style={{fontSize:14,fontWeight:600}}>{resultado.jugador_clave_local}</div></div>
<div style={{background:"#180808",border:"1px solid #402020",borderRadius:6,padding:"14px"}}><div style={{fontSize:9,color:"#ef5350",fontFamily:"monospace",letterSpacing:2,marginBottom:7}}>⭐ CLAVE VISITANTE</div><div style={{fontSize:14,fontWeight:600}}>{resultado.jugador_clave_visitante}</div></div>
</div>
{resultado.factores_clave?.length>0&&<div style={{background:"#0a1628",border:"1px solid #1a3050",borderRadius:6,padding:"20px",marginBottom:14}}>
<div style={{fontSize:9,letterSpacing:3,color:"#3a5a6a",fontFamily:"monospace",marginBottom:14}}>FACTORES DETERMINANTES</div>
{resultado.factores_clave.map((f,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:10,alignItems:"flex-start"}}><span style={{color:"#4fc3f7",fontSize:10,marginTop:3}}>▶</span><span style={{fontSize:14,color:"#8899aa",lineHeight:1.6}}>{f}</span></div>)}
</div>}
<div style={{background:"#0a1628",border:"1px solid #1a3050",borderRadius:6,padding:"20px",marginBottom:14}}>
<div style={{fontSize:9,letterSpacing:3,color:"#3a5a6a",fontFamily:"monospace",marginBottom:12}}>ANÁLISIS TÁCTICO</div>
<p style={{fontSize:14,color:"#8899aa",lineHeight:1.8,margin:0,fontStyle:"italic"}}>{resultado.analisis}</p>
</div>
<div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:20}}>
<div style={{background:"#0a1628",border:"1px solid #1a3050",borderRadius:6,padding:"18px"}}>
<div style={{fontSize:9,letterSpacing:3,color:"#3a5a6a",fontFamily:"monospace",marginBottom:12}}>CUOTAS ESTIMADAS</div>
<div style={{display:"flex",gap:8}}>
{[{label:"1 LOCAL",val:resultado.cuotas_sugeridas?.local,color:"#4fc3f7"},{label:"X EMPATE",val:resultado.cuotas_sugeridas?.empate,color:"#ffd54f"},{label:"2 VISIT.",val:resultado.cuotas_sugeridas?.visitante,color:"#ef5350"}].map(c=><div key={c.label} style={{flex:1,textAlign:"center",background:"#060c16",borderRadius:4,padding:"10px 6px"}}><div style={{fontSize:8,color:"#3a5a6a",fontFamily:"monospace",marginBottom:5}}>{c.label}</div><div style={{fontSize:18,fontWeight:700,color:c.color}}>{c.val}</div></div>)}
</div></div>
<div style={{background:"#0a1628",border:`1px solid ${cr(resultado.nivel_riesgo)}33`,borderRadius:6,padding:"18px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
<div style={{fontSize:9,color:"#3a5a6a",fontFamily:"monospace",letterSpacing:2,marginBottom:8}}>RIESGO</div>
<div style={{fontSize:20,fontWeight:700,color:cr(resultado.nivel_riesgo)}}>{resultado.nivel_riesgo}</div>
</div></div>
<div style={{textAlign:"center",fontSize:10,color:"#1a2a3a",fontFamily:"monospace",marginBottom:16}}>ANÁLISIS IA · SOLO ENTRETENIMIENTO · NO ES CONSEJO DE APUESTAS</div>
<button onClick={()=>{setResultado(null);setLocal("");setVisitante("");setLiga("");setContexto("");setError("");}} style={{width:"100%",padding:"13px",background:"transparent",border:"1px solid #1a3050",borderRadius:4,color:"#3a5a6a",fontSize:11,fontFamily:"monospace",letterSpacing:3,cursor:"pointer"}}>↩ NUEVO ANÁLISIS</button>
</div>}
</div></div>);}
