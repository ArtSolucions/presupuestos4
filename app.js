const { useState, useCallback, useRef, useEffect } = React;

// ─── TARIFAS ─────────────────────────────────────────────────────────────────
const TIPIFIED = [
  { code:"ARTSER010A", name:"Arranque máquina láser",         cat:"Maquinaria",       coste:36.60, pvp:73.20, unit:"arranque" },
  { code:"ARTSER010",  name:"Trabajo máquina láser",          cat:"Maquinaria",       coste:12.20, pvp:25.00, unit:"hora"     },
  { code:"ARTSER016A", name:"Arranque máquina CNC",           cat:"Maquinaria",       coste:60.00, pvp:120.00,unit:"arranque" },
  { code:"ARTSER016",  name:"Trabajo CNC fresadora",          cat:"Maquinaria",       coste:20.00, pvp:35.00, unit:"hora"     },
  { code:"ARTSER014",  name:"Plotter vinilo (m²)",            cat:"Maquinaria",       coste:10.00, pvp:20.00, unit:"m²"      },
  { code:"ARTSER034",  name:"Máquinas varios",                cat:"Maquinaria",       coste:10.00, pvp:20.00, unit:"hora"     },
  { code:"ARTSER033",  name:"Escuadradora",                   cat:"Maquinaria",       coste:15.00, pvp:25.00, unit:"hora"     },
  { code:"ARTSER049",  name:"Soldadura TIG Argón",            cat:"Maquinaria",       coste:12.00, pvp:24.00, unit:"hora"     },
  { code:"ARTSER038",  name:"MO Madera",                      cat:"MO Taller",        coste:18, pvp:25, unit:"hora" },
  { code:"ARTSER039",  name:"MO Metal",                       cat:"MO Taller",        coste:18, pvp:25, unit:"hora" },
  { code:"ARTSER040",  name:"MO Pintura / barniz / lacado",   cat:"MO Taller",        coste:18, pvp:25, unit:"hora" },
  { code:"ARTSER041",  name:"MO Acabado",                     cat:"MO Taller",        coste:18, pvp:25, unit:"hora" },
  { code:"ARTSER045",  name:"MO Montaje eléctrico",           cat:"MO Taller",        coste:18, pvp:25, unit:"hora" },
  { code:"ARTSER043",  name:"MO Embalaje",                    cat:"MO Taller",        coste:15, pvp:25, unit:"hora" },
  { code:"ARTSER044",  name:"MO Soldadura",                   cat:"MO Taller",        coste:18, pvp:25, unit:"hora" },
  { code:"ARTSER007",  name:"Montaje laboral",                cat:"Montaje",          coste:18, pvp:35, unit:"hora" },
  { code:"ARTSER048",  name:"Montaje nocturno",               cat:"Montaje",          coste:35, pvp:50, unit:"hora" },
  { code:"ARTSER031",  name:"Montaje fin de semana",          cat:"Montaje",          coste:30, pvp:47, unit:"hora" },
  { code:"ARTSER004",  name:"Coche (ud=100km)",               cat:"Desplazamiento",   coste:25, pvp:40,  unit:"ud"   },
  { code:"ARTSER022",  name:"Coche centro Madrid (ud=100km)", cat:"Desplazamiento",   coste:35, pvp:55,  unit:"ud"   },
  { code:"ARTSER015",  name:"Furgo pequeña (ud=100km)",       cat:"Desplazamiento",   coste:25, pvp:40,  unit:"ud"   },
  { code:"ARTSER020",  name:"Furgo pequeña Madrid (ud=100km)",cat:"Desplazamiento",   coste:35, pvp:55,  unit:"ud"   },
  { code:"ARTSER003",  name:"Furgoneta (ud=100km)",           cat:"Desplazamiento",   coste:36, pvp:75,  unit:"ud"   },
  { code:"ARTSER021",  name:"Furgoneta Madrid (ud=100km)",    cat:"Desplazamiento",   coste:65, pvp:100, unit:"ud"   },
  { code:"ARTSER047",  name:"Camión 18T (ud=100km)",          cat:"Desplazamiento",   coste:95, pvp:140, unit:"ud"   },
  { code:"ARTSER025",  name:"Alojamiento (noche/persona)",    cat:"Gastos Viaje",     coste:60, pvp:80,  unit:"noche"},
  { code:"ARTSER036",  name:"Desayuno",                       cat:"Gastos Viaje",     coste:6,  pvp:10,  unit:"ud"   },
  { code:"ARTSER026",  name:"Dieta día completo",             cat:"Gastos Viaje",     coste:30, pvp:50,  unit:"ud"   },
  { code:"ARTSER027",  name:"Dieta comida o cena",            cat:"Gastos Viaje",     coste:12, pvp:20,  unit:"ud"   },
  { code:"ARTSER018",  name:"Palet europeo 120x80 /mes",      cat:"Almacén",          coste:3,  pvp:7,   unit:"mes"  },
  { code:"ARTSER018A", name:"Palet americano 120x100 /mes",   cat:"Almacén",          coste:5,  pvp:9,   unit:"mes"  },
  { code:"ARTSER005",  name:"Diseño / 3D / renders / planos", cat:"Diseño y Gestión", coste:25, pvp:50,  unit:"hora" },
  { code:"ARTSER001",  name:"Artes finales",                  cat:"Diseño y Gestión", coste:25, pvp:50,  unit:"hora" },
  { code:"ARTSER002",  name:"Briefing",                       cat:"Diseño y Gestión", coste:25, pvp:50,  unit:"hora" },
  { code:"ARTSER035",  name:"Gestión proyecto",               cat:"Diseño y Gestión", coste:25, pvp:50,  unit:"hora" },
  { code:"ARTSER011",  name:"Visita / mediciones / fotos",    cat:"Diseño y Gestión", coste:25, pvp:50,  unit:"hora" },
];

const CAT_COLORS = {"Maquinaria":"#6366f1","MO Taller":"#8b5cf6","Montaje":"#f59e0b","Desplazamiento":"#06b6d4","Gastos Viaje":"#10b981","Almacén":"#f97316","Diseño y Gestión":"#ec4899"};
const catsBySection = {fabricacion:["Maquinaria","MO Taller"],montaje:["Montaje","Desplazamiento","Gastos Viaje","Almacén"],diseno:["Diseño y Gestión"],transporte:["Desplazamiento"]};
const PROD_TABS = [{key:"materiales",label:"Materiales",icon:"📦"},{key:"fabricacion",label:"Fabricación",icon:"⚙️"},{key:"diseno",label:"Diseño y Gestión",icon:"✏️"}];
const PROJECT_SECS = [{key:"montaje",label:"Montaje y Servicios",icon:"🔧",cats:["Montaje","Gastos Viaje","Almacén"]},{key:"transporte",label:"Transporte",icon:"🚚",cats:["Desplazamiento"]},{key:"diseno_global",label:"Diseño y Gestión",icon:"✏️",cats:["Diseño y Gestión"]}];

const gid=()=>Math.random().toString(36).substr(2,9);
const fNum=v=>parseFloat(String(v??'').replace(',','.'))||0;
const fmt=n=>(Number(n)||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
const pct=n=>(Number(n)||0).toFixed(1)+'%';
const hmToDec=(h,m)=>fNum(h)+fNum(m)/60;

const newMaterial=()=>({id:gid(),proveedor:'',ref:'',descripcion:'',cantidad:1,pvpProv:0,dto:0,margen:45,obs:''});
const newTipified=()=>({id:gid(),code:'',descripcion:'',cat:'',unit:'',horas:0,minutos:0,usaHM:false,cantidad:1,costeUnit:0,pvpUnit:0,margenEdit:0,dto:0,obs:''});
const newProduct=n=>({id:gid(),nombre:`Elemento ${n}`,sku:'',descripcion:'',cantidad:1,sections:{materiales:[],fabricacion:[],diseno:[]}});

function calcMat(r){
  const costeUnit=fNum(r.pvpProv)*(1-fNum(r.dto)/100);
  const m=fNum(r.margen)/100;
  const pvpUnit=m<1?costeUnit/(1-m):costeUnit;
  const cant=fNum(r.cantidad);
  return{...r,costeUnit,pvpUnit,costeTotal:costeUnit*cant,pvpTotal:pvpUnit*cant};
}
function calcTip(r){
  const cant=r.usaHM?hmToDec(r.horas,r.minutos):fNum(r.cantidad);
  const dto=fNum(r.dto)||0;
  const costeTotal=fNum(r.costeUnit)*cant;
  const pvpBruto=fNum(r.pvpUnit)*cant;
  const pvpTotal=pvpBruto*(1-dto/100);
  return{...r,cantDecimal:cant,costeTotal,pvpTotal,beneficio:pvpTotal-costeTotal,margenPct:pvpTotal>0?(pvpTotal-costeTotal)/pvpTotal*100:0};
}
function applyRate(r,code,rates){
  const rt=(rates||TIPIFIED).find(t=>t.code===code);
  if(!rt)return{...r,code};
  const mg=parseFloat(((rt.pvp-rt.coste)/rt.pvp*100).toFixed(2));
  return{...r,code,descripcion:rt.name,cat:rt.cat,unit:rt.unit,costeUnit:String(rt.coste),pvpUnit:String(rt.pvp),margenEdit:String(mg),usaHM:rt.unit==='hora'};
}
function applyMargen(r,m){const mf=fNum(m);const pvp=mf<100&&mf>0?fNum(r.costeUnit)/(1-mf/100):fNum(r.pvpUnit);return{...r,margenEdit:m,pvpUnit:String(parseFloat(pvp.toFixed(4)))};}
function applyPvp(r,pvp){const p=fNum(pvp);return{...r,pvpUnit:pvp,margenEdit:String(p>0?parseFloat(((p-fNum(r.costeUnit))/p*100).toFixed(2)):0)};}
function applyCoste(r,c){const mf=fNum(r.margenEdit);const pvp=mf>0&&mf<100?fNum(c)/(1-mf/100):fNum(r.pvpUnit);return{...r,costeUnit:c,pvpUnit:String(parseFloat(pvp.toFixed(4)))};}

function productTotals(p){
  const all=[...p.sections.materiales.map(calcMat),...p.sections.fabricacion.map(calcTip),...p.sections.diseno.map(calcTip)];
  const coste=all.reduce((a,r)=>a+(r.costeTotal||0),0),pvp=all.reduce((a,r)=>a+(r.pvpTotal||0),0);
  const cant=fNum(p.cantidad)||1;
  return{coste,pvp,beneficio:pvp-coste,margen:pvp>0?(pvp-coste)/pvp*100:0,cant};
}
function secTotals(rows,tipo){
  const calc=tipo==='material'?calcMat:calcTip;
  const c=rows.map(calc).reduce((a,r)=>a+(r.costeTotal||0),0),pv=rows.map(calc).reduce((a,r)=>a+(r.pvpTotal||0),0);
  return{coste:c,pvp:pv,beneficio:pv-c,margen:pv>0?(pv-c)/pv*100:0,count:rows.length};
}

// ─── COLORES Y ESTILOS ───────────────────────────────────────────────────────
const C={bg:'#f4f6f9',card:'#fff',border:'#e2e8f0',side:'#1e293b',amber:'#d97706',text:'#1e293b',muted:'#94a3b8',green:'#16a34a',red:'#dc2626'};
const S={
  app:{fontFamily:"'DM Sans',system-ui,sans-serif",background:C.bg,color:C.text,minHeight:'100vh',fontSize:13},
  hdr:{background:C.card,borderBottom:`1px solid ${C.border}`,padding:'12px 18px',display:'flex',alignItems:'center',gap:12,boxShadow:'0 1px 3px rgba(0,0,0,.08)'},
  logo:{fontSize:18,fontWeight:800,color:C.amber},
  body:{display:'flex',height:'calc(100vh - 54px)'},
  side:{width:215,background:C.side,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',overflowY:'auto'},
  nav:a=>({display:'flex',alignItems:'center',gap:8,padding:'9px 12px',cursor:'pointer',border:'none',background:a?'#dbeafe':'transparent',color:a?'#1d4ed8':C.muted,fontWeight:a?700:400,fontSize:12,width:'100%',textAlign:'left',borderLeft:a?'3px solid #1d4ed8':'3px solid transparent'}),
  main:{flex:1,overflow:'auto',padding:15,display:'flex',flexDirection:'column',gap:12},
  card:{background:C.card,border:`1px solid ${C.border}`,borderRadius:7,overflow:'hidden',boxShadow:'0 1px 3px rgba(0,0,0,.05)'},
  ch:{padding:'9px 13px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',background:'#f8fafc'},
  ct:{fontSize:11,fontWeight:700,color:'#475569',letterSpacing:.5,textTransform:'uppercase'},
  tbl:{width:'100%',borderCollapse:'collapse'},
  th:{padding:'6px 8px',textAlign:'left',fontSize:10,fontWeight:700,color:'#64748b',textTransform:'uppercase',letterSpacing:.3,borderBottom:`1px solid ${C.border}`,background:'#f8fafc'},
  td:{padding:'5px 7px',fontSize:12,borderBottom:'1px solid #f1f5f9',verticalAlign:'middle'},
  inp:{background:'#f8fafc',border:'1px solid #cbd5e1',borderRadius:4,color:C.text,padding:'4px 6px',fontSize:12,width:'100%',outline:'none'},
  sel:{background:'#f8fafc',border:'1px solid #cbd5e1',borderRadius:4,color:C.text,padding:'4px 6px',fontSize:12,outline:'none'},
  btnA:{background:C.amber,color:'#fff',border:'none',borderRadius:4,padding:'5px 12px',fontSize:12,fontWeight:700,cursor:'pointer'},
  btnB:{background:'#1d4ed8',color:'#fff',border:'none',borderRadius:4,padding:'5px 12px',fontSize:12,fontWeight:700,cursor:'pointer'},
  btnG:{background:'#e2e8f0',color:'#475569',border:'none',borderRadius:4,padding:'5px 10px',fontSize:11,cursor:'pointer'},
  btnD:{background:'transparent',border:'none',color:'#ef4444',cursor:'pointer',fontSize:13,padding:'1px 4px'},
  badge:c=>({display:'inline-block',padding:'1px 5px',borderRadius:3,fontSize:10,fontWeight:700,background:c+'22',color:c}),
  g3:{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12},
  lbl:{fontSize:10,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:.4,marginBottom:3},
  nr:{textAlign:'right'},
};

function Inp({style,type,...p}){
  const isNum=type==='number';
  return <input type="text" inputMode={isNum?'decimal':'text'} autoComplete="off" style={{...S.inp,...style}} {...p}/>;
}

function MiniBar({coste,pvp}){
  if(!pvp&&!coste)return null;
  const ben=pvp-coste,mg=pvp>0?ben/pvp*100:0;
  return(
    <div style={{display:'flex',gap:16,fontSize:11,padding:'5px 13px',background:'#f0f4f8',borderTop:`1px solid ${C.border}`}}>
      <span style={{color:C.muted}}>Coste <b style={{color:'#475569'}}>{fmt(coste)} €</b></span>
      <span style={{color:C.muted}}>PVP <b style={{color:C.amber}}>{fmt(pvp)} €</b></span>
      <span style={{color:C.muted}}>Beneficio <b style={{color:ben>=0?C.green:C.red}}>{fmt(ben)} €</b></span>
      <span style={{color:C.muted}}>Margen <b style={{color:mg>=30?C.green:mg>=15?C.amber:C.red}}>{pct(mg)}</b></span>
    </div>
  );
}

// ─── SECCIÓN MATERIALES ───────────────────────────────────────────────────────
function MatSection({rows,onChange}){
  const upd=(id,f,v)=>onChange(rows.map(r=>r.id!==id?r:{...r,[f]:v}));
  const tots=rows.map(calcMat).reduce((a,r)=>({c:a.c+(r.costeTotal||0),p:a.p+(r.pvpTotal||0)}),{c:0,p:0});
  return(
    <div style={S.card}>
      <div style={S.ch}><span style={S.ct}>📦 Materiales — Compras a proveedor</span><button style={S.btnA} onClick={()=>onChange([...rows,newMaterial()])}>+ Línea</button></div>
      <div style={{overflowX:'auto'}}>
        <table style={S.tbl}>
          <thead><tr>{['Proveedor','Ref.','Descripción','Cant.','PVP Prov.','Dto %','Coste Unit.','Margen %','PVP Unit.','Coste Total','PVP Total','Obs.',''].map((h,i)=><th key={i} style={{...S.th,minWidth:i===2?150:i===0?80:65}}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.length===0&&<tr><td colSpan={13} style={{...S.td,color:C.muted,textAlign:'center',padding:14}}>Sin materiales.</td></tr>}
            {rows.map(r=>{const c=calcMat(r);return(
              <tr key={r.id}>
                <td style={S.td}><Inp value={r.proveedor} onChange={e=>upd(r.id,'proveedor',e.target.value)} style={{width:78}}/></td>
                <td style={S.td}><Inp value={r.ref} onChange={e=>upd(r.id,'ref',e.target.value)} style={{width:58}}/></td>
                <td style={S.td}><Inp value={r.descripcion} onChange={e=>upd(r.id,'descripcion',e.target.value)} style={{width:140}}/></td>
                <td style={S.td}><Inp type="number" value={r.cantidad} onChange={e=>upd(r.id,'cantidad',e.target.value)} style={{width:46}}/></td>
                <td style={S.td}><Inp type="number" value={r.pvpProv} onChange={e=>upd(r.id,'pvpProv',e.target.value)} style={{width:65}}/></td>
                <td style={S.td}><Inp type="number" value={r.dto} onChange={e=>upd(r.id,'dto',e.target.value)} style={{width:42}}/></td>
                <td style={{...S.td,...S.nr,color:'#475569'}}>{fmt(c.costeUnit)}</td>
                <td style={S.td}><Inp type="number" value={r.margen} onChange={e=>upd(r.id,'margen',e.target.value)} style={{width:46}}/></td>
                <td style={{...S.td,...S.nr,color:'#475569'}}>{fmt(c.pvpUnit)}</td>
                <td style={{...S.td,...S.nr,color:C.amber,fontWeight:600}}>{fmt(c.costeTotal)}</td>
                <td style={{...S.td,...S.nr,color:C.green,fontWeight:600}}>{fmt(c.pvpTotal)}</td>
                <td style={S.td}><Inp value={r.obs} onChange={e=>upd(r.id,'obs',e.target.value)} style={{width:80}}/></td>
                <td style={S.td}><button style={S.btnD} onClick={()=>onChange(rows.filter(x=>x.id!==r.id))}>✕</button></td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
      <MiniBar coste={tots.c} pvp={tots.p}/>
    </div>
  );
}

// ─── SECCIÓN TIPIFICADA ───────────────────────────────────────────────────────
function TipSection({label,icon,cats,rows,onChange,rates}){
  const opts=(rates||TIPIFIED).filter(t=>cats.includes(t.cat));
  const upd=(id,f,v)=>onChange(rows.map(r=>{
    if(r.id!==id)return r;
    let u={...r};
    if(f==='code')u=applyRate(u,v,rates);
    else if(f==='margenEdit')u=applyMargen(u,v);
    else if(f==='pvpUnit')u=applyPvp(u,v);
    else if(f==='costeUnit')u=applyCoste(u,v);
    else u={...u,[f]:v};
    return calcTip(u);
  }));
  const tots=rows.map(calcTip).reduce((a,r)=>({c:a.c+(r.costeTotal||0),p:a.p+(r.pvpTotal||0)}),{c:0,p:0});
  return(
    <div style={S.card}>
      <div style={S.ch}><span style={S.ct}>{icon} {label.toUpperCase()}</span><button style={S.btnA} onClick={()=>onChange([...rows,calcTip(newTipified())])}>+ Línea</button></div>
      <div style={{overflowX:'auto'}}>
        <table style={S.tbl}>
          <thead><tr>{['Servicio','Descripción','Cat.','Ud.','Cantidad / H:M','Coste U.','Margen %','PVP U.','Coste Total','PVP Total','Obs.',''].map((h,i)=><th key={i} style={{...S.th,minWidth:i===0?190:i===1?145:65}}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.length===0&&<tr><td colSpan={12} style={{...S.td,color:C.muted,textAlign:'center',padding:14}}>Sin líneas.</td></tr>}
            {rows.map(r=>{
              const c=calcTip(r);const col=CAT_COLORS[r.cat]||'#6b7280';const mg=fNum(r.margenEdit);
              return(
                <tr key={r.id}>
                  <td style={S.td}>
                    <select style={{...S.sel,width:185}} value={r.code} onChange={e=>upd(r.id,'code',e.target.value)}>
                      <option value="">— Selecciona —</option>
                      {cats.map(cat=>(
                        <optgroup key={cat} label={cat}>
                          {opts.filter(o=>o.cat===cat).sort((a,b)=>a.code.localeCompare(b.code)).map(o=><option key={o.code} value={o.code}>[{o.code}] {o.name}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </td>
                  <td style={S.td}><Inp value={r.descripcion} onChange={e=>upd(r.id,'descripcion',e.target.value)} style={{width:135}}/></td>
                  <td style={S.td}>{r.cat&&<span style={S.badge(col)}>{r.cat}</span>}</td>
                  <td style={{...S.td,color:C.muted,fontSize:11}}>{r.unit}</td>
                  <td style={S.td}>
                    <div style={{display:'flex',alignItems:'center',gap:4}}>
                      <button onClick={()=>upd(r.id,'usaHM',!r.usaHM)} title="Activar/desactivar Horas:Minutos"
                        style={{background:r.usaHM?'#dbeafe':'#f1f5f9',border:`1px solid ${r.usaHM?'#93c5fd':'#cbd5e1'}`,borderRadius:3,color:r.usaHM?'#1d4ed8':'#94a3b8',fontSize:10,fontWeight:700,padding:'2px 5px',cursor:'pointer'}}>H:M</button>
                      {r.usaHM?(
                        <>
                          <Inp type="number" placeholder="h" value={r.horas} onChange={e=>upd(r.id,'horas',e.target.value)} style={{width:38}}/>
                          <span style={{color:C.muted}}>:</span>
                          <Inp type="number" placeholder="m" value={r.minutos} onChange={e=>upd(r.id,'minutos',e.target.value)} style={{width:38}}/>
                          <span style={{color:C.amber,fontSize:11,minWidth:36}}>={fmt(c.cantDecimal||0)}</span>
                        </>
                      ):(
                        <Inp type="number" value={r.cantidad} onChange={e=>upd(r.id,'cantidad',e.target.value)} style={{width:60}}/>
                      )}
                    </div>
                  </td>
                  <td style={S.td}><Inp type="number" value={r.costeUnit} onChange={e=>upd(r.id,'costeUnit',e.target.value)} style={{width:63}}/></td>
                  <td style={S.td}>
                    <div style={{display:'flex',alignItems:'center',gap:3}}>
                      <Inp type="number" value={r.margenEdit??0} onChange={e=>upd(r.id,'margenEdit',e.target.value)} style={{width:46,color:mg>=30?C.green:mg>=15?C.amber:C.red}}/>
                      <span style={{color:C.muted,fontSize:11}}>%</span>
                    </div>
                  </td>
                  <td style={S.td}><Inp type="number" value={r.pvpUnit} onChange={e=>upd(r.id,'pvpUnit',e.target.value)} style={{width:63}}/></td>
                  <td style={S.td}><Inp type="number" value={r.dto||0} onChange={e=>upd(r.id,'dto',e.target.value)} style={{width:46}}/></td>
                  <td style={{...S.td,...S.nr,color:C.amber,fontWeight:600}}>{fmt(c.costeTotal)}</td>
                  <td style={{...S.td,...S.nr,color:C.green,fontWeight:600}}>{fmt(c.pvpTotal)}</td>
                  <td style={S.td}><Inp value={r.obs} onChange={e=>upd(r.id,'obs',e.target.value)} style={{width:80}}/></td>
                  <td style={S.td}><button style={S.btnD} onClick={()=>onChange(rows.filter(x=>x.id!==r.id))}>✕</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <MiniBar coste={tots.c} pvp={tots.p}/>
    </div>
  );
}

// ─── VISTA ELEMENTO ───────────────────────────────────────────────────────────
function ProductoView({producto,onChange,rates}){
  const [tab,setTab]=useState('materiales');
  const setSec=(key,rows)=>onChange({...producto,sections:{...producto.sections,[key]:rows}});
  const tots=productTotals(producto);
  return(
    <div style={{display:'flex',flexDirection:'column',gap:11}}>
      <div style={S.card}>
        <div style={{padding:'11px 13px',display:'flex',gap:14,alignItems:'flex-end',flexWrap:'wrap'}}>
          <div style={{flex:1}}><div style={S.lbl}>Nombre del elemento</div><Inp value={producto.nombre} onChange={e=>onChange({...producto,nombre:e.target.value})} style={{fontSize:14,fontWeight:600}}/></div>
          <div style={{width:90}}><div style={S.lbl}>SKU (código)</div><Inp value={producto.sku||''} onChange={e=>onChange({...producto,sku:e.target.value})} placeholder="Ej: SLH-001"/></div>
          <div style={{width:105}}><div style={S.lbl}>Cantidad (unidades)</div><Inp type="number" value={producto.cantidad} onChange={e=>onChange({...producto,cantidad:e.target.value})}/></div>
          <div style={{flex:'0 0 100%',marginTop:8}}>
            <div style={S.lbl}>Descripción del elemento (se sincroniza con Holded)</div>
            <Inp value={producto.descripcion||''} onChange={e=>onChange({...producto,descripcion:e.target.value})} placeholder="Descripción detallada del elemento..."/>
          </div>
      <div style={{textAlign:'right',minWidth:210}}>
            <div style={{fontSize:11,color:C.muted}}>PVP unit. · PVP total (×{fNum(producto.cantidad)||1})</div>
            <div style={{fontSize:17,fontWeight:800,color:C.amber}}>{fmt(tots.pvp)} € · {fmt(tots.pvp*(fNum(producto.cantidad)||1))} €</div>
            <div style={{fontSize:12}}><span style={{color:C.muted}}>Coste </span><span style={{color:'#475569'}}>{fmt(tots.coste)} €</span><span style={{color:C.muted,marginLeft:10}}>Margen </span><span style={{color:tots.margen>=30?C.green:tots.margen>=15?C.amber:C.red,fontWeight:700}}>{pct(tots.margen)}</span></div>
          </div>
        </div>
      </div>
      <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
        {PROD_TABS.map(t=>{const st=secTotals(producto.sections[t.key],t.key==='materiales'?'material':'tip');const a=tab===t.key;return(
          <button key={t.key} onClick={()=>setTab(t.key)} style={{background:a?'#dbeafe':C.card,border:`1px solid ${a?'#93c5fd':C.border}`,borderRadius:5,padding:'6px 13px',cursor:'pointer',color:a?'#1d4ed8':C.muted,fontSize:12,fontWeight:a?600:400,display:'flex',alignItems:'center',gap:6}}>
            <span>{t.icon}</span><span>{t.label}</span>
            {st.count>0&&<span style={{background:a?'#bfdbfe':'#f1f5f9',borderRadius:10,padding:'0 6px',fontSize:10,color:a?'#1d4ed8':'#64748b'}}>{fmt(st.pvp)} €</span>}
          </button>
        );})}
      </div>
      {tab==='materiales'&&<MatSection rows={producto.sections.materiales} onChange={r=>setSec('materiales',r)}/>}
      {tab==='fabricacion'&&<TipSection label="Fabricación" icon="⚙️" cats={['Maquinaria','MO Taller']} rows={producto.sections.fabricacion} onChange={r=>setSec('fabricacion',r)} rates={rates}/>}
      {tab==='diseno'&&<TipSection label="Diseño y Gestión" icon="✏️" cats={['Diseño y Gestión']} rows={producto.sections.diseno} onChange={r=>setSec('diseno',r)} rates={rates}/>}
    </div>
  );
}

// ─── RESUMEN ─────────────────────────────────────────────────────────────────
function ResumenView({productos,projectSecs,info}){
  const elemRows=productos.map(p=>{const t=productTotals(p);return{nombre:p.nombre,cantidad:t.cant,costeUnit:t.coste,pvpUnit:t.pvp,costeTotal:t.coste*t.cant,pvpTotal:t.pvp*t.cant,margen:t.margen};});
  const projRows=PROJECT_SECS.map(s=>{const t=secTotals(projectSecs[s.key]||[],'tip');return{...s,...t};});
  const gc=elemRows.reduce((a,r)=>a+r.costeTotal,0)+projRows.reduce((a,r)=>a+r.coste,0);
  const gp=elemRows.reduce((a,r)=>a+r.pvpTotal,0)+projRows.reduce((a,r)=>a+r.pvp,0);
  const gb=gp-gc,gm=gp>0?gb/gp*100:0,obj=fNum(info.objPrecio),desv=obj>0?gp-obj:0;
  return(
    <div style={{display:'flex',flexDirection:'column',gap:12}}>
      <div style={S.card}>
        <div style={S.ch}><span style={S.ct}>📊 Elementos fabricados</span></div>
        <table style={S.tbl}>
          <thead><tr>{['Elemento','Ud.','Coste unit.','PVP unit.','Coste total','PVP total','Beneficio','Margen %'].map((h,i)=><th key={i} style={{...S.th,textAlign:i>1?'right':'left'}}>{h}</th>)}</tr></thead>
          <tbody>
            {elemRows.length===0&&<tr><td colSpan={8} style={{...S.td,color:C.muted,textAlign:'center',padding:14}}>Sin elementos.</td></tr>}
            {elemRows.map((r,i)=>(
              <tr key={i}>
                <td style={S.td}><strong>{r.nombre}</strong></td>
                <td style={{...S.td,color:C.muted}}>{r.cantidad}</td>
                <td style={{...S.td,...S.nr}}>{fmt(r.costeUnit)} €</td>
                <td style={{...S.td,...S.nr,color:C.amber}}>{fmt(r.pvpUnit)} €</td>
                <td style={{...S.td,...S.nr}}>{fmt(r.costeTotal)} €</td>
                <td style={{...S.td,...S.nr,color:C.amber,fontWeight:600}}>{fmt(r.pvpTotal)} €</td>
                <td style={{...S.td,...S.nr,color:(r.pvpTotal-r.costeTotal)>=0?C.green:C.red}}>{fmt(r.pvpTotal-r.costeTotal)} €</td>
                <td style={{...S.td,textAlign:'right',color:r.margen>=30?C.green:r.margen>=15?C.amber:C.red,fontWeight:700}}>{pct(r.margen)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={S.card}>
        <div style={S.ch}><span style={S.ct}>🔧 Montaje y servicios del proyecto</span></div>
        <table style={S.tbl}>
          <thead><tr>{['Sección','Coste','PVP','Beneficio','Margen'].map((h,i)=><th key={i} style={{...S.th,textAlign:i>0?'right':'left'}}>{h}</th>)}</tr></thead>
          <tbody>{projRows.map(r=>(
            <tr key={r.key}><td style={S.td}>{r.icon} {r.label}</td><td style={{...S.td,...S.nr}}>{fmt(r.coste)} €</td><td style={{...S.td,...S.nr,color:C.amber}}>{fmt(r.pvp)} €</td><td style={{...S.td,...S.nr,color:r.beneficio>=0?C.green:C.red}}>{fmt(r.beneficio)} €</td><td style={{...S.td,textAlign:'right',color:r.margen>=30?C.green:r.margen>=15?C.amber:C.red}}>{pct(r.margen)}</td></tr>
          ))}</tbody>
        </table>
      </div>
      {gp>0&&(
        <>
          <div style={S.card}>
            <div style={S.ch}><span style={S.ct}>📋 Total del proyecto</span></div>
            <table style={S.tbl}>
              <thead><tr>{['Partida','Coste','PVP','Beneficio','Margen'].map((h,i)=><th key={i} style={{...S.th,textAlign:i>0?'right':'left'}}>{h}</th>)}</tr></thead>
              <tbody>
                {[{l:'Elementos fabricados',c:elemRows.reduce((a,r)=>a+r.costeTotal,0),p:elemRows.reduce((a,r)=>a+r.pvpTotal,0)},...projRows.map(r=>({l:r.label,c:r.coste,p:r.pvp}))].map(({l,c,p})=>{const b=p-c,m=p>0?b/p*100:0;return(
                  <tr key={l}><td style={S.td}>{l}</td><td style={{...S.td,...S.nr}}>{fmt(c)} €</td><td style={{...S.td,...S.nr,color:C.amber}}>{fmt(p)} €</td><td style={{...S.td,...S.nr,color:b>=0?C.green:C.red}}>{fmt(b)} €</td><td style={{...S.td,textAlign:'right',color:m>=30?C.green:m>=15?C.amber:C.red}}>{pct(m)}</td></tr>
                );})}
                <tr style={{background:'#f8fafc',borderTop:`2px solid ${C.border}`}}>
                  <td style={{...S.td,fontWeight:800,color:C.amber}}>TOTAL PROYECTO</td>
                  <td style={{...S.td,...S.nr,fontWeight:700}}>{fmt(gc)} €</td>
                  <td style={{...S.td,...S.nr,color:C.amber,fontWeight:800,fontSize:14}}>{fmt(gp)} €</td>
                  <td style={{...S.td,...S.nr,color:gb>=0?C.green:C.red,fontWeight:700}}>{fmt(gb)} €</td>
                  <td style={{...S.td,textAlign:'right',color:gm>=30?C.green:gm>=15?C.amber:C.red,fontWeight:800}}>{pct(gm)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {(()=>{
            const comPct=fNum(info.comision);
            const comEur=gb*(comPct/100);
            const benNeto=gb-comEur;
            const margenFinal=gp>0?benNeto/gp*100:0;
            const kpis=[
              {l:'Coste total',v:`${fmt(gc)} €`,c:'#475569'},
              {l:'PVP total',v:`${fmt(gp)} €`,c:C.amber},
              {l:'Beneficio bruto',v:`${fmt(gb)} €`,c:gb>=0?C.green:C.red},
              {l:'Margen global',v:pct(gm),c:gm>=30?C.green:gm>=15?C.amber:C.red},
              {l:'Objetivo precio',v:obj?`${fmt(obj)} €`:'—',c:C.muted},
              {l:'Desviación vs. obj.',v:obj?`${desv>=0?'+':''}${fmt(desv)} €`:'—',c:desv>=0?C.green:C.red},
            ];
            if(comPct>0){
              kpis.push(
                {l:`Comisión ${info.comisionista||''} (${comPct}%)`,v:`- ${fmt(comEur)} €`,c:'#dc2626'},
                {l:'Beneficio neto (tras comisión)',v:`${fmt(benNeto)} €`,c:benNeto>=0?C.green:C.red},
                {l:'Margen final (tras comisión)',v:pct(margenFinal),c:margenFinal>=30?C.green:margenFinal>=15?C.amber:C.red},
              );
            }
            return(
              <div style={{background:'#fffbeb',border:`1px solid ${C.amber}`,borderRadius:7,padding:15,display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                {kpis.map(({l,v,c})=>(
                  <div key={l} style={{borderBottom:`1px solid #fde68a`,paddingBottom:10}}>
                    <div style={{fontSize:10,color:C.muted,marginBottom:3}}>{l}</div>
                    <div style={{fontSize:16,fontWeight:700,color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            );
          })()}
        </>
      )}
    </div>
  );
}

// ─── EXPORTS ─────────────────────────────────────────────────────────────────


// ─── ALMACENAMIENTO PRESUPUESTOS (Netlify Blobs + localStorage fallback) ────────
const STORAGE_PREFIX = 'as_pres_';

// localStorage como fallback cuando no hay servidor (drag-and-drop deploy)
const localStorageCall = (action, key, data) => {
  if (action === 'save') {
    const entry = { data, savedAt: new Date().toISOString(), numero: data?.info?.numero || key, cliente: data?.info?.cliente || '' };
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(entry));
    return { ok: true, local: true };
  }
  if (action === 'load') {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    if (!raw) return { data: null };
    return { data: JSON.parse(raw).data };
  }
  if (action === 'list') {
    const list = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k.startsWith(STORAGE_PREFIX)) continue;
      try {
        const entry = JSON.parse(localStorage.getItem(k));
        list.push({ key: k.replace(STORAGE_PREFIX,''), savedAt:entry.savedAt||'', numero:entry.numero||k, cliente:entry.cliente||'', local:true });
      } catch {}
    }
    list.sort((a,b)=>b.savedAt.localeCompare(a.savedAt));
    return { list };
  }
  if (action === 'delete') {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return { ok: true };
  }
  return { error: 'Acción desconocida' };
};

// Llamada principal: intenta servidor (Netlify Blobs), cae a localStorage si no disponible
const storageCall = async (action, key, data) => {
  try {
    const password = localStorage.getItem('as_password') || 'artsolucions2025';
    const resp = await fetch('/api/storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-app-password': password },
      body: JSON.stringify({ action, key, data })
    });
    if (!resp.ok) throw new Error('Server error');
    const result = await resp.json();
    if (result.error) throw new Error(result.error);
    return { ...result, centralized: true };
  } catch (e) {
    // Fallback a localStorage (modo drag-and-drop sin GitHub)
    return localStorageCall(action, key, data);
  }
};

// Detecta si el guardado es centralizado o local
const checkStorageMode = async () => {
  try {
    const password = localStorage.getItem('as_password') || 'artsolucions2025';
    const resp = await fetch('/api/storage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-app-password': password },
      body: JSON.stringify({ action: 'list' })
    });
    return resp.ok ? 'centralized' : 'local';
  } catch { return 'local'; }
};

// ─── IMPORTAR DESDE EXCEL ─────────────────────────────────────────────────────
const parseEuro = v => {
  if(typeof v==='number')return v;
  const s=String(v).trim().replace(/\s*€\s*$/,'').trim();
  // Detect format: if has comma → Spanish format (1.234,56) → strip dots, comma to dot
  // If no comma but has dot → JS/English format (25.5) → use as-is
  if(s.includes(',')){
    return parseFloat(s.replace(/\./g,'').replace(',','.'))||0;
  }
  return parseFloat(s)||0;
};
const parsePct2 = v => {
  const s=String(v||'').replace('%','').replace(',','.').trim();
  return parseFloat(s)||0;
};

function parseTipSection(rows){
  // Skip until we find the data (after label row, empty row, header row)
  const items=[];
  let dataStart=-1;
  for(let i=0;i<rows.length;i++){
    const r=rows[i];
    // Header row has "Código" as first cell
    if(String(r[0]||'').trim()==='Código'){dataStart=i+1;break;}
  }
  if(dataStart<0)return items;
  for(let i=dataStart;i<rows.length;i++){
    const row=rows[i];
    // Stop at TOTAL row
    if(row.some(c=>String(c||'').includes('TOTAL')))break;
    const c0=String(row[0]||'').trim();
    if(!c0&&!row[1])continue; // skip empty rows
    const horas=parseFloat(row[4])||0, mins=parseFloat(row[5])||0;
    const usaHM=horas>0||mins>0;
    const cant=usaHM?1:(parseFloat(row[6])||1);
    const costeU=parseEuro(row[7]), pvpU=parseEuro(row[8]);
    const mg=pvpU>0?((pvpU-costeU)/pvpU*100):parsePct2(row[9]);
    items.push({
      id:gid(), code:c0, descripcion:String(row[1]||''), cat:String(row[2]||''),
      unit:String(row[3]||''), usaHM, horas:usaHM?horas:0, minutos:usaHM?mins:0,
      cantidad:cant, costeUnit:String(costeU), pvpUnit:String(pvpU),
      margenEdit:String(parseFloat(mg.toFixed(2))), dto:0, obs:''
    });
  }
  return items;
}

function parseElementSheet(rows){
  if(!rows.length)return null;
  // Row 0: ELEMENTO + cantidad
  const nombre=String(rows[0][0]||'').replace(/^ELEMENTO:\s*/i,'').trim();
  const cantidad=parseFloat(String(rows[0][1]||'').replace(/^Cantidad:\s*/i,''))||1;
  // Row 1: SKU + descripción (new format) or empty (old format)
  let sku='', desc='', dataOffset=2;
  if(String(rows[1]?.[0]||'').trim()==='SKU:'){
    sku=String(rows[1][1]||'').trim();
    desc=String(rows[1][3]||'').trim();
    dataOffset=3; // skip SKU row + empty row
  }
  const sections={materiales:[],fabricacion:[],diseno:[]};
  let sec=null;
  for(let i=dataOffset;i<rows.length;i++){
    const row=rows[i];
    const c0=String(row[0]||'').trim();
    // Detect section markers
    if(c0.includes('MATERIALES')){sec='materiales';continue;}
    if(c0.includes('FABRICACI')){sec='fabricacion';continue;}
    if(c0.includes('DISE')){sec='diseno';continue;}
    // Skip header rows (first cell is "Proveedor" or "Código")
    if(c0==='Proveedor'||c0==='Código')continue;
    // Skip SUBTOTAL / TOTAL rows (check all cells)
    if(row.some(c=>String(c||'').match(/SUBTOTAL|TOTAL ELEMENTO/)))continue;
    // Skip empty rows
    if(!c0&&!row[1]&&!row[2])continue;
    if(!sec)continue;
    if(sec==='materiales'){
      sections.materiales.push({
        id:gid(), proveedor:String(row[0]||''), ref:String(row[1]||''),
        descripcion:String(row[2]||''), cantidad:parseFloat(row[3])||1,
        pvpProv:parseEuro(row[4]), dto:parseFloat(row[5])||0,
        margen:parseFloat(row[7])||45, obs:''
      });
    } else {
      const horas=parseFloat(row[4])||0, mins=parseFloat(row[5])||0;
      const usaHM=horas>0||mins>0;
      const cant=usaHM?1:(parseFloat(row[6])||1);
      const costeU=parseEuro(row[7]), pvpU=parseEuro(row[8]);
      const mg=pvpU>0?((pvpU-costeU)/pvpU*100):parsePct2(row[9]);
      sections[sec].push({
        id:gid(), code:String(row[0]||''), descripcion:String(row[1]||''),
        cat:String(row[2]||''), unit:String(row[3]||''),
        usaHM, horas:usaHM?horas:0, minutos:usaHM?mins:0, cantidad:cant,
        costeUnit:String(costeU), pvpUnit:String(pvpU),
        margenEdit:String(parseFloat(mg.toFixed(2))), dto:0, obs:''
      });
    }
  }
  return{id:gid(),nombre,sku,descripcion:desc,cantidad,sections};
}

function importWorkbook(wb){
  const PROJ_SECS={
    'Montaje y Servicios':'montaje',
    'Transporte':'transporte',
    'Diseño y Gestión':'diseno_global',
  };
  const rs=XLSX.utils.sheet_to_json(wb.Sheets['Resumen Final']||wb.Sheets[wb.SheetNames[0]],{header:1,defval:''});
  const info={
    numero:  String(rs[1]?.[1]||''),
    cliente: String(rs[1]?.[3]||''),
    responsable: String(rs[2]?.[1]||''),
    fecha:   String(rs[2]?.[3]||new Date().toISOString().split('T')[0]),
    descripcion: String(rs[3]?.[1]||''),
    cif:     String(rs[4]?.[1]||''),
    email:   String(rs[4]?.[3]||''),
    tel:     String(rs[5]?.[1]||''),
    objPrecio: String(rs[5]?.[3]||''),
    comisionista: String(rs[6]?.[1]||''),
    comision: String(rs[6]?.[3]||''),
    contacto:''
  };
  const productos=[];
  const projectSecs={montaje:[],transporte:[],diseno_global:[]};
  wb.SheetNames.forEach(name=>{
    if(name==='Resumen Final')return;
    const sheet=wb.Sheets[name];
    const rows=XLSX.utils.sheet_to_json(sheet,{header:1,defval:''});
    if(!rows.length)return;
    const secKey=Object.keys(PROJ_SECS).find(k=>name===k||name.startsWith(k.slice(0,10)));
    if(secKey){
      projectSecs[PROJ_SECS[secKey]]=parseTipSection(rows);
    } else {
      const prod=parseElementSheet(rows);
      if(prod&&prod.nombre)productos.push(prod);
    }
  });
  return{info,productos,projectSecs};
}

function doExcel(productos,projectSecs,info){
  const wb=XLSX.utils.book_new();
  const e=n=>`${(Number(n)||0).toLocaleString('es-ES',{minimumFractionDigits:2,maximumFractionDigits:2})} €`;
  const comPct=fNum(info.comision);
  const res=[['PRESUPUESTO ART SOLUCIONS'],['Nº Proyecto:',info.numero,'Cliente:',info.cliente],['Responsable:',info.responsable,'Fecha:',info.fecha],['Descripción:',info.descripcion],['CIF:',info.cif,'Email:',info.email],['Teléfono:',info.tel,'Objetivo precio:',info.objPrecio],['Comisionista:',info.comisionista,'Comisión %:',info.comision],[],['ELEMENTO','UNIDADES','COSTE UNIT.','PVP UNIT.','COSTE TOTAL','PVP TOTAL','BENEFICIO','MARGEN %']];
  let gc=0,gp=0;
  productos.forEach(p=>{const t=productTotals(p);const ct=t.coste*t.cant,pt=t.pvp*t.cant;gc+=ct;gp+=pt;res.push([p.nombre,t.cant,e(t.coste),e(t.pvp),e(ct),e(pt),e(pt-ct),t.margen>0?t.margen.toFixed(1)+'%':'0%']);});
  PROJECT_SECS.forEach(s=>{const t=secTotals(projectSecs[s.key]||[],'tip');gc+=t.coste;gp+=t.pvp;res.push([s.label,'—',e(t.coste),e(t.pvp),e(t.coste),e(t.pvp),e(t.beneficio),t.margen>0?t.margen.toFixed(1)+'%':'0%']);});
  res.push([],['TOTAL FINAL','','','',e(gc),e(gp),e(gp-gc),gp>0?((gp-gc)/gp*100).toFixed(1)+'%':'']);
  if(comPct>0){const gbLocal=gp-gc;const comEur=gbLocal*(comPct/100);const benNeto=gbLocal-comEur;res.push(['Comisión '+info.comisionista,'','','','','',e(-comEur),'-'+comPct+'%']);res.push(['Beneficio neto (tras comisión)','','','','','',e(benNeto),gp>0?((benNeto/gp)*100).toFixed(1)+'%':'0%']);}
  XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(res),'Resumen Final');
  productos.forEach((p,idx)=>{
    const h=[[`ELEMENTO: ${p.nombre}`,`Cantidad: ${p.cantidad}`],['SKU:',p.sku||'','Descripción:',p.descripcion||''],[]];
    [['materiales','Materiales','mat'],['fabricacion','Fabricación','tip'],['diseno','Diseño y Gestión','tip']].forEach(([key,lbl,tipo])=>{
      const rows=tipo==='mat'?p.sections[key].map(calcMat):p.sections[key].map(calcTip);
      if(!rows.length)return;
      h.push([`── ${lbl.toUpperCase()} ──`]);
      if(tipo==='mat'){h.push(['Proveedor','Ref','Descripción','Cant.','PVP Prov.','Dto%','Coste U.','Margen%','PVP U.','Coste Total','PVP Total']);rows.forEach(r=>h.push([r.proveedor,r.ref,r.descripcion,fNum(r.cantidad),fNum(r.pvpProv),fNum(r.dto),parseFloat((r.costeUnit||0).toFixed(4)),fNum(r.margen),parseFloat((r.pvpUnit||0).toFixed(4)),parseFloat((r.costeTotal||0).toFixed(4)),parseFloat((r.pvpTotal||0).toFixed(4))]));}
      else{h.push(['Código','Descripción','Cat.','Ud.','Horas','Min.','Cant.','Coste U.','PVP U.','Margen%','Coste Total','PVP Total']);rows.forEach(r=>h.push([r.code,r.descripcion,r.cat,r.unit,r.usaHM?fNum(r.horas):0,r.usaHM?fNum(r.minutos):0,parseFloat((r.cantDecimal||fNum(r.cantidad)||1).toFixed(4)),fNum(r.costeUnit),fNum(r.pvpUnit),parseFloat((r.margenPct||0).toFixed(2)),parseFloat((r.costeTotal||0).toFixed(4)),parseFloat((r.pvpTotal||0).toFixed(4))]));}
      const c=rows.reduce((a,r)=>a+(r.costeTotal||0),0),pv=rows.reduce((a,r)=>a+(r.pvpTotal||0),0);
      h.push(['','','','','','','','','','SUBTOTAL:',e(c),e(pv)],[]);
    });
    const t=productTotals(p);h.push(['','','','','','','','','','TOTAL ELEMENTO:',e(t.coste),e(t.pvp)]);
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(h),`${idx+1}_${p.nombre}`.replace(/[^a-zA-Z0-9_ ]/g,'').slice(0,31)||`Elem_${idx+1}`);
  });
  PROJECT_SECS.forEach(s=>{
    const rows=(projectSecs[s.key]||[]).map(calcTip);if(!rows.length)return;
    const h=[[s.label],[]];
    h.push(['Código','Descripción','Cat.','Ud.','Horas','Min.','Cant.','Coste U.','PVP U.','Margen%','Coste Total','PVP Total']);
    rows.forEach(r=>h.push([r.code,r.descripcion,r.cat,r.unit,r.usaHM?fNum(r.horas):0,r.usaHM?fNum(r.minutos):0,parseFloat((r.cantDecimal||fNum(r.cantidad)||1).toFixed(4)),fNum(r.costeUnit),fNum(r.pvpUnit),parseFloat((r.margenPct||0).toFixed(2)),parseFloat((r.costeTotal||0).toFixed(4)),parseFloat((r.pvpTotal||0).toFixed(4))]));
    const c=rows.reduce((a,r)=>a+(r.costeTotal||0),0),pv=rows.reduce((a,r)=>a+(r.pvpTotal||0),0);
    h.push(['','','','','','','','','','TOTAL:',e(c),e(pv)]);
    XLSX.utils.book_append_sheet(wb,XLSX.utils.aoa_to_sheet(h),s.label.slice(0,31));
  });
  XLSX.writeFile(wb,`${info.numero||'borrador'}_${info.cliente||'cliente'}_Presupuesto.xlsx`);
}

function doPdf(productos,projectSecs,info){
  let gc=0,gp=0;
  const thead=`<thead><tr><th>Descripción</th><th>Cant.</th><th>Coste U.</th><th>PVP U.</th><th>Coste Total</th><th>PVP Total</th></tr></thead>`;
  const rowsH=rows=>rows.map(r=>`<tr><td>${r.descripcion||r.code||'—'}</td><td>${fmt(r.cantDecimal||r.cantidad)}</td><td>${fmt(r.costeUnit||0)} €</td><td>${fmt(r.pvpUnit||0)} €</td><td>${fmt(r.costeTotal||0)} €</td><td>${fmt(r.pvpTotal||0)} €</td></tr>`).join('');
  const eH=productos.map(p=>{
    const t=productTotals(p);const ct=t.coste*t.cant,pt=t.pvp*t.cant;gc+=ct;gp+=pt;
    const sH=['materiales','fabricacion','diseno'].map(key=>{
      const rows=key==='materiales'?p.sections[key].map(calcMat):p.sections[key].map(calcTip);
      if(!rows.length)return'';
      const lbl={materiales:'Materiales',fabricacion:'Fabricación',diseno:'Diseño y Gestión'}[key];
      return`<h4>${lbl}</h4><table>${thead}<tbody>${rowsH(rows)}</tbody></table>`;
    }).join('');
    return`<div class="prod"><h3>${p.nombre} — ${t.cant} ud.</h3>${sH}<p class="stot">PVP unitario: ${fmt(t.pvp)} € &nbsp;·&nbsp; PVP total: <strong>${fmt(pt)} €</strong> &nbsp;·&nbsp; Margen: ${pct(t.margen)}</p></div>`;
  }).join('');
  const prH=PROJECT_SECS.map(s=>{
    const rows=(projectSecs[s.key]||[]).map(calcTip);if(!rows.length)return'';
    const t=secTotals(projectSecs[s.key]||[],'tip');gc+=t.coste;gp+=t.pvp;
    return`<h3>${s.label}</h3><table>${thead}<tbody>${rowsH(rows)}</tbody></table><p class="stot">Total: ${fmt(t.pvp)} € · Margen: ${pct(t.margen)}</p>`;
  }).join('');
  const html=`<h1>Art Solucions — Presupuesto ${info.numero}</h1>
<p style="color:#666;font-size:10px;margin:0 0 10px">Generado ${new Date().toLocaleDateString('es-ES')}</p>
<div class="info">
  <div><span>Cliente: </span><strong>${info.cliente||'—'}</strong></div>
  <div><span>Contacto: </span>${info.contacto||'—'}</div>
  <div><span>CIF: </span>${info.cif||'—'}</div>
  <div><span>Responsable: </span>${info.responsable||'—'}</div>
  <div><span>Fecha: </span>${info.fecha}</div>
  <div><span>Email: </span>${info.email||'—'}</div>
</div>
${info.descripcion?`<p><strong>Objeto:</strong> ${info.descripcion}</p>`:''}
<h2>Elementos fabricados</h2>${eH}
<h2>Montaje y servicios</h2>${prH}
${(()=>{
  const gbP=gp-gc;const comPctP=fNum(info.comision);const comEurP=gbP*(comPctP/100);
  const benNetoP=gbP-comEurP;const mfP=gp>0?benNetoP/gp*100:0;
  const comRow=comPctP>0
    ?'<div style="margin-top:8px;padding-top:8px;border-top:1px solid #f59e0b;font-size:11px">'
     +'<span style="color:#dc2626">Comisión <strong>'+info.comisionista+'</strong> ('+comPctP+'%): <strong>- '+fmt(comEurP)+' €</strong></span>'
     +' &nbsp;|&nbsp; Beneficio neto: <strong>'+fmt(benNetoP)+' €</strong>'
     +' &nbsp;|&nbsp; Margen final: <strong>'+pct(mfP)+'</strong></div>'
    :'';
  return '<div class="grand">TOTAL — Coste: '+fmt(gc)+' € &nbsp;|&nbsp; PVP: <strong>'+fmt(gp)+' €</strong> &nbsp;|&nbsp; Beneficio bruto: '+fmt(gbP)+' € &nbsp;|&nbsp; Margen: '+(gp>0?pct(gbP/gp*100):'0%')+comRow+'</div>';
})()}`;
  document.getElementById('print-area').innerHTML=html;
  window.print();
}

// ─── HOLDED API ───────────────────────────────────────────────────────────────
async function crearProductoHolded(apiKey, producto, info){
  const t=productTotals(producto);
  const autoSku=`${info.numero?info.numero+'-':''}${producto.nombre}`.replace(/[^a-zA-Z0-9-_]/g,'-').slice(0,50);
  const body={
    kind:'simple',
    name:producto.nombre,
    sku:producto.sku||autoSku,
    desc:producto.descripcion||`Proyecto: ${info.numero||''} | Cliente: ${info.cliente||''}`.trim(),
    price:parseFloat(t.pvp.toFixed(2)),
    cost:parseFloat(t.coste.toFixed(2)),
    purchasePrice:parseFloat(t.coste.toFixed(2)),
  };
  const resp=await fetch('/api/holded/api/invoicing/v1/products',{method:'POST',headers:{'x-holded-key':apiKey,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return resp.json();
}

async function enviarAHolded(apiKey,contactId,productos,projectSecs,info,productMap,onProgress,existingId){
  const items=[];
  const createdProducts=[];

  // 1. Crear cada elemento como producto en Holded
  onProgress&&onProgress(`Creando ${productos.length} productos en Holded...`);
  for(let i=0;i<productos.length;i++){
    const p=productos[i];
    onProgress&&onProgress(`Creando producto ${i+1}/${productos.length}: ${p.nombre}...`);
    const result=await crearProductoHolded(apiKey,p,info);
    if(result&&result.id){
      createdProducts.push({producto:p,holdedId:result.id});
      // Línea del presupuesto: producto creado × unidades
      items.push({
        productId:result.id,
        name:p.nombre,
        sku:p.sku||'',
        desc:p.descripcion||`Proyecto ${info.numero||''} · ${info.cliente||''}`.trim(),
        units:parseFloat((fNum(p.cantidad)||1).toFixed(4)),
        subtotal:parseFloat(productTotals(p).pvp.toFixed(2)),
        tax:0, discount:0
      });
    } else {
      // Si falla la creación, añadir como línea custom
      const t=productTotals(p);
      items.push({name:p.nombre,sku:p.sku||'',desc:p.descripcion||`${info.descripcion||''}`.trim(),units:parseFloat((fNum(p.cantidad)||1).toFixed(4)),subtotal:parseFloat(t.pvp.toFixed(2)),tax:0,discount:0});
    }
  }

  // 2. Añadir servicios de montaje/transporte (ARTSER vinculados o custom)
  onProgress&&onProgress('Añadiendo servicios de montaje y transporte...');
  const lineMap={};
  const addTip=(r)=>{
    if(!fNum(r.pvpUnit))return;
    const units=parseFloat((r.cantDecimal||fNum(r.cantidad)||1).toFixed(4));
    const key=r.code||r.descripcion||'svc';
    if(lineMap[key]){lineMap[key].units=parseFloat((lineMap[key].units+units).toFixed(4));}
    else{lineMap[key]={...(r.code&&productMap[r.code]?{productId:productMap[r.code]}:{}),name:r.descripcion||r.code||'Servicio',sku:r.code||'',desc:r.cat||'',units,subtotal:parseFloat(fNum(r.pvpUnit).toFixed(2)),tax:0,discount:parseFloat(fNum(r.dto||0).toFixed(2))};}
  };
  PROJECT_SECS.forEach(s=>(projectSecs[s.key]||[]).map(calcTip).forEach(r=>addTip(r)));
  items.push(...Object.values(lineMap).filter(i=>i.units>0).map(i=>({
    ...(i.productId?{productId:i.productId}:{}),
    name:i.name||'', sku:i.sku||'', desc:i.desc||'',
    units:i.units, subtotal:i.subtotal, tax:0, discount:i.discount||0
  })));

  // 3. Crear o actualizar presupuesto en Holded
  const isUpdate=!!existingId;
  onProgress&&onProgress(isUpdate?'Actualizando presupuesto en Holded...':'Creando presupuesto en Holded...');
  const body={
    desc:info.descripcion||`Presupuesto ${info.numero}`,
    date:Math.floor(Date.now()/1000),
    notes:`Nº Proyecto: ${info.numero} | Responsable: ${info.responsable}`,
    currency:'EUR',
    items
  };
  if(contactId)body.contactId=contactId;
  const url=isUpdate
    ?`/api/holded/api/invoicing/v1/documents/estimate/${existingId}`
    :'/api/holded/api/invoicing/v1/documents/estimate';
  const resp=await fetch(url,{method:isUpdate?'PUT':'POST',headers:{'x-holded-key':apiKey,'Content-Type':'application/json'},body:JSON.stringify(body)});
  const estimate=await resp.json();
  return{estimate,createdProducts,updated:isUpdate};
}


// ─── AUTH GATE ────────────────────────────────────────────────────────────────
// Contraseña de acceso — cámbiala aquí antes de subir a Netlify
const DEFAULT_PASSWORD = "artsolucions2025";
const getPassword = ()=>localStorage.getItem('as_password')||DEFAULT_PASSWORD;

function AuthGate({ children }) {
  const [ok, setOk]     = useState(()=>sessionStorage.getItem('as_auth')==='1');
  const [pwd, setPwd]   = useState('');
  const [err, setErr]   = useState(false);
  const [show, setShow] = useState(false);

  const login = () => {
    if (pwd === getPassword()) {
      sessionStorage.setItem('as_auth','1');
      setOk(true); setErr(false);
    } else {
      setErr(true); setPwd('');
    }
  };

  const logout = () => { sessionStorage.removeItem('as_auth'); setOk(false); setPwd(''); };

  if (!ok) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#f4f6f9'}}>
      <div style={{background:'#fff',borderRadius:12,padding:40,boxShadow:'0 8px 40px rgba(0,0,0,.12)',textAlign:'center',maxWidth:360,width:'90%'}}>
        <div style={{fontSize:13,color:'#94a3b8',fontWeight:600,letterSpacing:1,marginBottom:8}}>ART SIGNAGE, S.L.</div>
        <div style={{fontSize:28,fontWeight:800,color:'#d97706',marginBottom:4}}>Art Solucions</div>
        <div style={{fontSize:13,color:'#64748b',marginBottom:28}}>Herramienta interna de presupuestos</div>
        <div style={{marginBottom:12,textAlign:'left'}}>
          <div style={{fontSize:11,color:'#64748b',fontWeight:700,textTransform:'uppercase',letterSpacing:.4,marginBottom:4}}>Contraseña</div>
          <div style={{display:'flex',gap:8}}>
            <input
              type={show?'text':'password'}
              value={pwd}
              onChange={e=>{setPwd(e.target.value);setErr(false);}}
              onKeyDown={e=>e.key==='Enter'&&login()}
              placeholder="Introduce la contraseña..."
              autoFocus
              style={{flex:1,padding:'10px 12px',border:`1px solid ${err?'#fca5a5':'#e2e8f0'}`,borderRadius:6,fontSize:14,outline:'none'}}
            />
            <button onClick={()=>setShow(!show)} style={{background:'#f1f5f9',border:'1px solid #e2e8f0',borderRadius:6,padding:'0 12px',cursor:'pointer',fontSize:14,color:'#64748b'}}>{show?'🙈':'👁'}</button>
          </div>
          {err&&<div style={{color:'#dc2626',fontSize:12,marginTop:5}}>Contraseña incorrecta. Inténtalo de nuevo.</div>}
        </div>
        <button onClick={login} style={{background:'#d97706',color:'#fff',border:'none',borderRadius:6,padding:'11px 0',fontSize:14,fontWeight:700,cursor:'pointer',width:'100%',marginBottom:14}}>
          Acceder →
        </button>
        <div style={{fontSize:11,color:'#94a3b8'}}>Acceso restringido al equipo de Art Solucions.</div>
      </div>
    </div>
  );

  return (
    <>
      {children}
      <div style={{position:'fixed',bottom:12,right:12,zIndex:999,display:'flex',alignItems:'center',gap:8,background:'#fff',border:'1px solid #e2e8f0',borderRadius:6,padding:'5px 10px',boxShadow:'0 2px 8px rgba(0,0,0,.08)',fontSize:11}}>
        <span style={{color:'#94a3b8'}}>🔒 Art Solucions</span>
        <button onClick={logout} style={{background:'transparent',border:'none',color:'#dc2626',cursor:'pointer',fontSize:11,fontWeight:600,padding:0}}>Cerrar sesión</button>
      </div>
    </>
  );
}


function ChangePassword() {
  const [current,setCurrent] = useState('');
  const [nuevo,setNuevo]     = useState('');
  const [confirm,setConfirm] = useState('');
  const [msg,setMsg]         = useState(null);

  const cambiar = () => {
    if(current !== getPassword()){setMsg({ok:false,text:'La contraseña actual no es correcta.'});return;}
    if(nuevo.length < 6){setMsg({ok:false,text:'La nueva contraseña debe tener al menos 6 caracteres.'});return;}
    if(nuevo !== confirm){setMsg({ok:false,text:'Las contraseñas nuevas no coinciden.'});return;}
    localStorage.setItem('as_password', nuevo);
    setCurrent('');setNuevo('');setConfirm('');
    setMsg({ok:true,text:'Contraseña cambiada correctamente. Compártela con tu equipo.'});
  };

  return(
    <div style={{display:'flex',flexDirection:'column',gap:8}}>
      {[['Contraseña actual',current,setCurrent],['Nueva contraseña',nuevo,setNuevo],['Confirmar nueva',confirm,setConfirm]].map(([lbl,val,set])=>(
        <div key={lbl} style={{display:'flex',gap:8,alignItems:'center'}}>
          <span style={{fontSize:11,color:'#64748b',minWidth:130}}>{lbl}</span>
          <input type="password" value={val} onChange={e=>{set(e.target.value);setMsg(null);}} style={{...S.inp,flex:1}}/>
        </div>
      ))}
      <button onClick={cambiar} style={{...S.btnA,fontSize:11,alignSelf:'flex-start'}}>Cambiar contraseña</button>
      {msg&&<div style={{fontSize:11,color:msg.ok?'#16a34a':'#dc2626',padding:'4px 0'}}>{msg.ok?'✓':'⚠'} {msg.text}</div>}
      <div style={{fontSize:10,color:'#94a3b8'}}>La nueva contraseña se guarda en este navegador. Cuando la cambies, avisa al equipo para que todos actualicen la suya en ⚙️.</div>
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
function App(){
  const [nav,setNav]=useState('datos');
  const [info,setInfo]=useState({numero:'',cliente:'',contacto:'',cif:'',email:'',tel:'',fecha:new Date().toISOString().split('T')[0],responsable:'',descripcion:'',objPrecio:'',comisionista:'',comision:''});
  const [productos,setProductos]=useState([]);
  const [projectSecs,setProjectSecs]=useState({montaje:[],transporte:[],diseno_global:[]});
  const [holdedKey,setHoldedKey]=useState(localStorage.getItem('holdedKey')||'');
  const [customRates,setCustomRates]=useState(()=>{try{const s=localStorage.getItem('artsolucions_rates');return s?JSON.parse(s):TIPIFIED;}catch{return TIPIFIED;}});
  const [ratesTab,setRatesTab]=useState(false);
  const [suffixInput,setSuffixInput]=useState('');
  const [permanentSuffixes,setPermanentSuffixes]=useState(()=>{try{return JSON.parse(localStorage.getItem('as_permanent_suf')||'[]');}catch{return [];}});
  const importRef=useRef(null);
  const [importStatus,setImportStatus]=useState(null);
  const [holdedEstimateId,setHoldedEstimateId]=useState(null);
  const [showPresupuestos,setShowPresupuestos]=useState(false);
  const [presupuestosList,setPresupuestosList]=useState([]);
  const [listLoading,setListLoading]=useState(false);
  const [saveStatus,setSaveStatus]=useState(null);
  const [storageMode,setStorageMode]=useState('local'); // 'local' | 'centralized'
  const [userName,setUserName]=useState(()=>localStorage.getItem('as_username')||'');
  const [suffixStatus,setSuffixStatus]=useState(null);
  const [ratesSyncStatus,setRatesSyncStatus]=useState(null);
  const [holdedContact,setHoldedContact]=useState('');
  const [productMap,setProductMap]=useState(()=>{try{return JSON.parse(localStorage.getItem('holdedProductMap')||'{}');}catch{return {};}});
  const [syncStatus,setSyncStatus]=useState(null);
  const [holdedContactName,setHoldedContactName]=useState('');
  const [holdedStatus,setHoldedStatus]=useState(null);
  const [showHolded,setShowHolded]=useState(false);
  const [contactSearch,setContactSearch]=useState('');
  const [contactResults,setContactResults]=useState([]);
  const [contactLoading,setContactLoading]=useState(false);
  const [contactError,setContactError]=useState('');
  const searchTimeout=useRef(null);

  const updInfo=(f,v)=>setInfo(p=>({...p,[f]:v}));
  const addProd=()=>{const p=newProduct(productos.length+1);setProductos(ps=>[...ps,p]);setNav(p.id);};
  const delProd=(id)=>{setProductos(ps=>ps.filter(p=>p.id!==id));if(nav===id)setNav('datos');};
  const updProd=useCallback((id,upd)=>setProductos(ps=>ps.map(p=>p.id===id?upd:p)),[]);
  const updProjSec=(key,rows)=>setProjectSecs(s=>({...s,[key]:rows}));

  const fetchNextProjectNumber=async()=>{
    if(!holdedKey){alert('Configura primero tu API Key de Holded (⚙️).');return;}
    try{
      let page=1,allDocs=[],more=true;
      while(more&&page<=10){
        const r=await fetch(`/api/holded/api/invoicing/v1/documents/estimate?page=${page}`,{headers:{'x-holded-key':holdedKey}});
        const data=await r.json();
        const list=Array.isArray(data)?data:(data.list||data.docs||[]);
        if(!list.length){more=false;}else{allDocs=[...allDocs,...list];page++;}
        if(list.length<50)more=false;
      }
      const numbers=[];
      allDocs.forEach(d=>{
        // Buscar en todos los campos posibles: notes, desc, docNumber, number, ref
        const fields=[d.notes,d.desc,d.docNumber,d.number,d.ref,d.numRef,d.customId].filter(Boolean).join(' ');
        // Extraer cualquier secuencia que empiece por 26 seguido de exactamente 3 dígitos
        // Ej: "26084MBJC" -> captura 26084; "26084" -> captura 26084
        const matches=fields.matchAll(/(26[0-9]{3})[A-Za-z]*/g);
        for(const m of matches){
          const n=parseInt(m[1]);
          if(n>=26000&&n<=26998)numbers.push(n);
        }
      });
      if(numbers.length){
        const next=Math.max(...numbers)+1;
        updInfo('numero',String(next));
        alert('Nº de proyecto asignado: '+next);
      } else {
        alert('No se encontraron proyectos anteriores con formato 26XXX en Holded. Introduce el número manualmente.');
      }
    }catch(e){alert('Error al conectar con Holded: '+e.message);}
  };

  // Auto-fill responsable from saved username if field is empty
  const autoResponsable=()=>{
    if(!info.responsable&&userName)updInfo('responsable',userName);
  };
  React.useEffect(()=>{autoResponsable();},[userName]);

  useEffect(()=>{
    checkStorageMode().then(mode=>setStorageMode(mode));
  },[]);

  const savePresupuesto=async()=>{
    const key=info.numero||('pres_'+Date.now());
    setSaveStatus('saving');
    try{
      const stateData={info,productos,projectSecs,holdedEstimateId};
      const r=await storageCall('save',key,stateData);
      if(r.ok){setSaveStatus(r.centralized?'ok_server':'ok_local');setTimeout(()=>setSaveStatus(null),3000);}
      else{setSaveStatus('error');}
    }catch(e){setSaveStatus('error');console.error(e);}
  };

  const loadPresupuestosList=async()=>{
    setListLoading(true);setShowPresupuestos(true);
    try{
      const r=await storageCall('list');
      setPresupuestosList(r.list||[]);
    }catch(e){setPresupuestosList([]);}
    setListLoading(false);
  };

  const loadPresupuesto=async(key)=>{
    if(!window.confirm('¿Cargar este presupuesto? Se reemplazarán los datos actuales.'))return;
    try{
      const r=await storageCall('load',key);
      if(r.data){
        const {info:i,productos:p,projectSecs:ps,holdedEstimateId:hid}=r.data;
        if(i)setInfo(i); if(p)setProductos(p); if(ps)setProjectSecs(ps);
        setHoldedEstimateId(hid!==undefined?hid:null);
        setNav('datos'); setShowPresupuestos(false);
      }
    }catch(e){alert('Error al cargar: '+e.message);}
  };

  const deletePresupuesto=async(key,e)=>{
    e.stopPropagation();
    if(!window.confirm('¿Eliminar el presupuesto "'+key+'"? Esta acción no se puede deshacer.'))return;
    await storageCall('delete',key);
    setPresupuestosList(l=>l.filter(x=>x.key!==key));
  };

  const handleImport=async(e)=>{
    const file=e.target.files?.[0]; if(!file)return;
    e.target.value='';
    if(!window.confirm('Esto reemplazará el proyecto actual con los datos del Excel. ¿Continuar?'))return;
    setImportStatus('loading');
    try{
      const buf=await file.arrayBuffer();
      const wb=XLSX.read(buf,{type:'array'});
      const {info:newInfo,productos:newProds,projectSecs:newSecs}=importWorkbook(wb);
      setInfo(newInfo); setProductos(newProds); setProjectSecs(newSecs);
      setNav('datos'); setImportStatus('ok');
      setTimeout(()=>setImportStatus(null),3000);
    }catch(err){
      setImportStatus('error');
      alert('Error al leer el Excel: '+err.message);
      setTimeout(()=>setImportStatus(null),3000);
    }
  };

  const resetProyecto=()=>{
    if(!window.confirm('¿Borrar todos los datos del proyecto actual y empezar de nuevo?'))return;
    setInfo({numero:'',cliente:'',contacto:'',cif:'',email:'',tel:'',fecha:new Date().toISOString().split('T')[0],responsable:'',descripcion:'',objPrecio:'',comisionista:'',comision:''});
    setProductos([]);
    setProjectSecs({montaje:[],transporte:[],diseno_global:[]});
    setNav('datos');
    setHoldedStatus(null);
    setHoldedProgress('');
    setHoldedEstimateId(null);
  };

  const gp=productos.reduce((a,p)=>{const t=productTotals(p);return a+t.pvp*t.cant;},0)+PROJECT_SECS.reduce((a,s)=>a+secTotals(projectSecs[s.key]||[],'tip').pvp,0);
  const gc=productos.reduce((a,p)=>{const t=productTotals(p);return a+t.coste*t.cant;},0)+PROJECT_SECS.reduce((a,s)=>a+secTotals(projectSecs[s.key]||[],'tip').coste,0);
  const gm=gp>0?(gp-gc)/gp*100:0;
  const actProd=productos.find(p=>p.id===nav);
  const actProj=PROJECT_SECS.find(s=>s.key===nav);

  const syncProducts=async()=>{
    if(!holdedKey){alert('Guarda primero tu API Key.');return;}
    setSyncStatus('syncing');
    try{
      let page=1,allProducts=[],hasMore=true;
      while(hasMore){
        const r=await fetch(`/api/holded/api/invoicing/v1/products?page=${page}`,{headers:{'x-holded-key':holdedKey}});
        const data=await r.json();
        const list=Array.isArray(data)?data:(data.products||data.list||[]);
        if(!list.length){hasMore=false;}else{allProducts=[...allProducts,...list];page++;}
        if(list.length<50)hasMore=false;
      }
      const map={};
      allProducts.forEach(p=>{
        if(p.sku)map[p.sku.trim()]=p.id;
        // también intentar por nombre si contiene el código ARTSER
        if(p.name){const m=p.name.match(/ARTSER\w+/i);if(m&&!map[m[0]])map[m[0].toUpperCase()]=p.id;}
      });
      const matched=Object.keys(map).filter(k=>k.startsWith('ARTSER')).length;
      setProductMap(map);
      localStorage.setItem('holdedProductMap',JSON.stringify(map));
      setSyncStatus({ok:true,total:allProducts.length,matched});
    }catch(e){setSyncStatus({ok:false,error:e.message});}
  };

  const saveRates=(updated)=>{setCustomRates(updated);localStorage.setItem('artsolucions_rates',JSON.stringify(updated));};
  const updateRate=(code,field,val)=>{
    const updated=customRates.map(r=>r.code===code?{...r,[field]:parseFloat(String(val).replace(',','.'))||0}:r);
    saveRates(updated);
  };
  const resetRates=()=>{if(window.confirm('¿Restaurar todas las tarifas a los valores por defecto?')){saveRates(TIPIFIED);setRatesSyncStatus(null);}};

  const loadPvpFromHolded=async()=>{
    if(!holdedKey){alert('Guarda tu API Key primero.');return;}
    setRatesSyncStatus('loading');
    try{
      let page=1,all=[],more=true;
      while(more){
        const r=await fetch(`/api/holded/api/invoicing/v1/products?page=${page}`,{headers:{'x-holded-key':holdedKey}});
        const d=await r.json();const list=Array.isArray(d)?d:(d.products||d.list||[]);
        if(!list.length){more=false;}else{all=[...all,...list];page++;}
        if(list.length<50)more=false;
      }
      const priceMap={};
      all.forEach(p=>{if(p.sku&&p.price!=null)priceMap[p.sku.trim()]=p.price;});
      const updated=customRates.map(r=>priceMap[r.code]!=null?{...r,pvp:priceMap[r.code]}:r);
      const changed=updated.filter((r,i)=>r.pvp!==customRates[i].pvp).length;
      saveRates(updated);
      setRatesSyncStatus({ok:true,dir:'from',changed});
    }catch(e){setRatesSyncStatus({ok:false,error:e.message});}
  };

  const pushPricesToHolded=async()=>{
    if(!holdedKey){alert('Guarda tu API Key primero.');return;}
    const toUpdate=customRates.filter(r=>productMap[r.code]);
    if(!toUpdate.length){alert('No hay productos ARTSER vinculados en Holded. Sincroniza el catálogo primero (botón 🔄).');return;}
    setRatesSyncStatus('pushing');
    let ok=0,err=0;
    for(const r of toUpdate){
      try{
        const res=await fetch(`/api/holded/api/invoicing/v1/products/${productMap[r.code]}`,{method:'PUT',headers:{'x-holded-key':holdedKey,'Content-Type':'application/json'},body:JSON.stringify({price:r.pvp,cost:r.coste})});
        const d=await res.json();
        if(d&&(d.id||d.status==='ok'||res.ok))ok++;else err++;
      }catch{err++;}
    }
    setRatesSyncStatus({ok:true,dir:'to',changed:ok,errors:err});
  };

  const togglePermanent=(suf)=>{
    const current=JSON.parse(localStorage.getItem('as_permanent_suf')||'[]');
    const updated=current.includes(suf)?current.filter(s=>s!==suf):[...current,suf];
    localStorage.setItem('as_permanent_suf',JSON.stringify(updated));
    setPermanentSuffixes(updated);
  };

  // Auto-carga sufijos permanentes al arrancar si no están ya en customRates
  useEffect(()=>{
    const stored=JSON.parse(localStorage.getItem('as_permanent_suf')||'[]');
    if(!stored.length||!holdedKey)return;
    stored.forEach(suf=>{
      const alreadyLoaded=customRates.some(r=>r.clientSuffix===suf);
      if(alreadyLoaded)return;
      fetch('/api/holded/api/invoicing/v1/products?page=1',{headers:{'x-holded-key':holdedKey}})
        .then(r=>r.json()).then(data=>{
          const list=Array.isArray(data)?data:(data.products||data.list||[]);
          const baseMap={};TIPIFIED.forEach(t=>baseMap[t.code]=t);
          const newRates=[];
          list.forEach(p=>{
            if(!p.sku)return;
            const sku=p.sku.trim().toUpperCase();
            if(!sku.endsWith(suf))return;
            const baseCode=sku.slice(0,-suf.length);
            const base=baseMap[baseCode];
            if(!base)return;
            if(!customRates.some(r=>r.code===sku)){
              newRates.push({id:gid(),code:sku,name:`${base.name} [${suf}]`,cat:base.cat,unit:base.unit,coste:base.coste,pvp:p.price||base.pvp,isClient:true,clientSuffix:suf});
            }
          });
          if(newRates.length){
            setCustomRates(prev=>{
              const updated=[...prev,...newRates];
              localStorage.setItem('artsolucions_rates',JSON.stringify(updated));
              return updated;
            });
          }
        }).catch(()=>{});
    });
  },[holdedKey]);

  const loadSuffixRates=async(suffix)=>{
    if(!holdedKey){alert('Guarda tu API Key primero.');return;}
    if(!suffix.trim()){alert('Introduce un sufijo, ej: MB');return;}
    const suf=suffix.trim().toUpperCase();
    setSuffixStatus('loading');
    try{
      let page=1,all=[],more=true;
      while(more){
        const r=await fetch(`/api/holded/api/invoicing/v1/products?page=${page}`,{headers:{'x-holded-key':holdedKey}});
        const d=await r.json();const list=Array.isArray(d)?d:(d.products||d.list||[]);
        if(!list.length){more=false;}else{all=[...all,...list];page++;}
        if(list.length<50)more=false;
      }
      // Códigos base disponibles en TIPIFIED
      const baseMap={};TIPIFIED.forEach(t=>baseMap[t.code]=t);
      const newRates=[];
      all.forEach(p=>{
        if(!p.sku)return;
        const sku=p.sku.trim().toUpperCase();
        if(!sku.endsWith(suf))return;
        const baseCode=sku.slice(0,-suf.length);
        const base=baseMap[baseCode];
        if(!base)return;
        // Añadir como nueva tarifa si no existe ya
        if(!customRates.some(r=>r.code===sku)){
          newRates.push({
            code:sku,
            name:`${base.name} [${suf}]`,
            cat:base.cat,
            unit:base.unit,
            coste:base.coste,       // coste interno = igual que el estándar
            pvp:p.price||base.pvp,  // PVP especial de Holded
            isClient:true,
            clientSuffix:suf,
          });
        }
      });
      if(!newRates.length){
        // Check if already loaded
        const alreadyLoaded=customRates.filter(r=>r.clientSuffix===suf).length;
        if(alreadyLoaded){setSuffixStatus({ok:true,suffix:suf,count:alreadyLoaded,alreadyLoaded:true});}
        else{setSuffixStatus({ok:false,error:`No se encontraron productos con sufijo "${suf}" en Holded. Verifica los SKUs.`});}
        return;
      }
      const updated=[...customRates,...newRates];
      saveRates(updated);
      setSuffixStatus({ok:true,suffix:suf,count:newRates.length});
    }catch(e){setSuffixStatus({ok:false,error:e.message});}
  };

  const deleteSuffixRates=(suf)=>{
    if(!window.confirm(`¿Eliminar todas las tarifas con sufijo "${suf}"?`))return;
    const updated=customRates.filter(r=>r.clientSuffix!==suf);
    saveRates(updated);
    setSuffixStatus(null);
  };

    const searchContacts=async(query)=>{
    if(!holdedKey){setContactError('Guarda primero tu API Key');return;}
    if(query.length<2){setContactResults([]);return;}
    setContactLoading(true);setContactError('');
    try{
      const r=await fetch(`/api/holded/api/invoicing/v1/contacts?page=1`,{headers:{'x-holded-key':holdedKey}});
      if(!r.ok){setContactError('Error al conectar con Holded. Verifica la API Key.');setContactLoading(false);return;}
      const data=await r.json();
      const lista=Array.isArray(data)?data:(data.contacts||data.list||[]);
      const filtrados=lista.filter(c=>(c.name||'').toLowerCase().includes(query.toLowerCase())||((c.tradeName||'').toLowerCase().includes(query.toLowerCase()))).slice(0,8);
      setContactResults(filtrados);
      if(filtrados.length===0)setContactError('Sin resultados para "'+query+'"');
    }catch(e){setContactError('Error de red. ¿Estás online?');}
    setContactLoading(false);
  };

  const onContactSearchChange=(val)=>{
    setContactSearch(val);setContactError('');
    if(searchTimeout.current)clearTimeout(searchTimeout.current);
    searchTimeout.current=setTimeout(()=>searchContacts(val),400);
  };

  const [holdedProgress,setHoldedProgress]=useState('');
  const handleHolded=async()=>{
    if(!holdedKey){alert('Introduce tu API Key de Holded en Configuración.');return;}
    if(productos.length===0){alert('Añade al menos un elemento al presupuesto.');return;}
    setHoldedStatus('enviando');setHoldedProgress('');
    try{
      const onProgress=(msg)=>setHoldedProgress(msg);
      const r=await enviarAHolded(holdedKey,holdedContact,productos,projectSecs,info,productMap,onProgress,holdedEstimateId);
      if(r&&r.estimate&&r.estimate.id){
        setHoldedEstimateId(r.estimate.id);
        setHoldedStatus({ok:true,created:r.createdProducts.length,updated:r.updated||false});
        localStorage.setItem('holdedKey',holdedKey);
      } else {setHoldedStatus('error');console.error(r);}
    }catch(e){setHoldedStatus('error');console.error(e);}
    setHoldedProgress('');
  };

  return(
    <div id="app-root" style={S.app}>

      {/* MODAL TARIFAS */}
      {ratesTab&&(
        <div style={{position:'fixed',inset:0,zIndex:2000,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:8,width:'min(96vw,900px)',maxHeight:'90vh',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            {/* Header */}
            <div style={{padding:'14px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:12,background:'#f8fafc',borderRadius:'8px 8px 0 0'}}>
              <span style={{fontWeight:800,fontSize:15,color:C.text}}>💰 Gestión de Tarifas</span>
              <div style={{flex:1}}/>
              <button onClick={loadPvpFromHolded} disabled={ratesSyncStatus==='loading'||ratesSyncStatus==='pushing'} style={{...S.btnG,fontSize:11}}>
                {ratesSyncStatus==='loading'?'Cargando...':'↓ Cargar PVP desde Holded'}
              </button>
              <button onClick={pushPricesToHolded} disabled={ratesSyncStatus==='loading'||ratesSyncStatus==='pushing'||!Object.keys(productMap).length} style={{...S.btnB,fontSize:11}}>
                {ratesSyncStatus==='pushing'?'Actualizando...':'↑ Actualizar Holded'}
              </button>
              <button onClick={resetRates} style={{...S.btnG,fontSize:11,color:'#dc2626'}}>Restaurar defaults</button>
              <button onClick={()=>{setRatesTab(false);setRatesSyncStatus(null);}} style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:C.muted}}>✕</button>
            </div>
            {/* Sync status */}
            {ratesSyncStatus&&ratesSyncStatus.ok&&(
              <div style={{padding:'8px 18px',background:ratesSyncStatus.dir==='from'?'#eff6ff':'#dcfce7',fontSize:12,color:ratesSyncStatus.dir==='from'?'#1d4ed8':'#15803d',borderBottom:`1px solid ${C.border}`}}>
                {ratesSyncStatus.dir==='from'?`↓ ${ratesSyncStatus.changed} precios actualizados desde Holded`:`↑ ${ratesSyncStatus.changed} productos actualizados en Holded${ratesSyncStatus.errors?` (${ratesSyncStatus.errors} errores)`:''}`}
              </div>
            )}
            {ratesSyncStatus&&!ratesSyncStatus.ok&&ratesSyncStatus!=='loading'&&ratesSyncStatus!=='pushing'&&(
              <div style={{padding:'8px 18px',background:'#fef2f2',fontSize:12,color:'#dc2626',borderBottom:`1px solid ${C.border}`}}>Error: {ratesSyncStatus.error}</div>
            )}
            {!Object.keys(productMap).length&&(
              <div style={{padding:'8px 18px',background:'#fffbeb',fontSize:11,color:'#92400e',borderBottom:`1px solid ${C.border}`}}>
                ⚠ Para sincronizar con Holded, primero sincroniza el catálogo en ⚙️ → "Sincronizar catálogo"
              </div>
            )}
            {/* Cargar tarifas de cliente por sufijo */}
            <div style={{padding:'12px 18px',borderBottom:`1px solid ${C.border}`,background:'#f8fafc'}}>
              <div style={{fontWeight:700,fontSize:12,color:C.text,marginBottom:6}}>Cargar tarifas de cliente desde Holded</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Carga los códigos especiales de cliente (ej: <strong>MB</strong> → <strong>ARTSERXXXMB</strong>). Pulsa ⭐ para que se cargue <strong>automáticamente</strong> siempre al arrancar la app.</div>
              <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
                <input value={suffixInput} onChange={e=>setSuffixInput(e.target.value.toUpperCase())} placeholder="Sufijo cliente, ej: MB" maxLength={10}
                  style={{...S.inp,width:160,fontFamily:'monospace',fontWeight:700,letterSpacing:1}}
                  onKeyDown={e=>{if(e.key==='Enter')loadSuffixRates(suffixInput);}}/>
                <button onClick={()=>loadSuffixRates(suffixInput)} disabled={suffixStatus==='loading'} style={{...S.btnB,fontSize:11}}>
                  {suffixStatus==='loading'?'Buscando en Holded...':'↓ Añadir tarifas de cliente'}
                </button>
                {suffixStatus&&suffixStatus.ok&&!suffixStatus.alreadyLoaded&&<span style={{fontSize:11,color:C.green}}>✓ {suffixStatus.count} tarifas {suffixStatus.suffix} añadidas</span>}
                {suffixStatus&&suffixStatus.ok&&suffixStatus.alreadyLoaded&&<span style={{fontSize:11,color:'#92400e'}}>⚠ Tarifas {suffixStatus.suffix} ya estaban cargadas ({suffixStatus.count} líneas)</span>}
                {suffixStatus&&!suffixStatus.ok&&suffixStatus!=='loading'&&<span style={{fontSize:11,color:C.red}}>{suffixStatus.error}</span>}
              </div>
              {/* Sufijos cargados */}
              {(()=>{const sufixes=[...new Set(customRates.filter(r=>r.clientSuffix).map(r=>r.clientSuffix))];return sufixes.length>0&&(
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:8,alignItems:'center'}}>
                  <span style={{fontSize:11,color:C.muted}}>Cargados:</span>
                  {sufixes.map(s=>{
                    const count=customRates.filter(r=>r.clientSuffix===s).length;
                    const isPerm=permanentSuffixes.includes(s);
                    return(
                      <div key={s} style={{display:'flex',alignItems:'center',gap:4,background:isPerm?'#dcfce7':'#dbeafe',border:`1px solid ${isPerm?'#86efac':'#93c5fd'}`,borderRadius:4,padding:'3px 8px',fontSize:11}}>
                        <strong style={{color:isPerm?'#15803d':'#1d4ed8'}}>{s}</strong>
                        <span style={{color:'#64748b'}}>{count} tarifas</span>
                        <button onClick={()=>togglePermanent(s)} title={isPerm?'Clic para dejar de cargar automáticamente':'Clic para cargar siempre al arrancar'}
                          style={{background:'transparent',border:'none',cursor:'pointer',fontSize:13,padding:'0 1px'}}>{isPerm?'⭐':'☆'}</button>
                        <button onClick={()=>deleteSuffixRates(s)} style={{background:'transparent',border:'none',cursor:'pointer',color:'#94a3b8',fontSize:12,padding:'0 2px',lineHeight:1}} title={`Eliminar tarifas ${s}`}>✕</button>
                      </div>
                    );
                  })}
                </div>
              );})()}
            </div>

            {/* Table */}
            <div style={{overflow:'auto',flex:1}}>
              <table style={{...S.tbl,fontSize:12}}>
                <thead style={{position:'sticky',top:0,zIndex:1}}>
                  <tr>
                    {['Código','Descripción','Categoría','Unidad','Coste €','PVP €','Margen %','Cliente','Holded'].map((h,i)=>
                      <th key={i} style={{...S.th,whiteSpace:'nowrap',minWidth:i===1?200:i===2?110:80}}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {customRates.map(r=>{
                    const mg=fNum(r.pvp)>0?((fNum(r.pvp)-fNum(r.coste))/fNum(r.pvp)*100):0;
                    const linked=productMap[r.code];
                    // Check if any suffix overrides this rate
                    const isClient=!TIPIFIED.some(t=>t.code===r.code);
                    return(
                      <tr key={r.code} style={{background:isClient?'#f0f9ff':'#fff',borderBottom:`1px solid #f1f5f9`}}>
                        <td style={{...S.td,fontFamily:'monospace',fontSize:11,color:'#64748b',whiteSpace:'nowrap'}}>{r.code}</td>
                        <td style={S.td}>{r.name}</td>
                        <td style={S.td}><span style={S.badge(CAT_COLORS[r.cat]||'#6b7280')}>{r.cat}</span></td>
                        <td style={{...S.td,color:C.muted}}>{r.unit}</td>
                        <td style={S.td}>
                          <div style={{display:'flex',alignItems:'center',gap:4}}>
                            <input type="text" inputMode="decimal" value={r.coste} onChange={e=>updateRate(r.code,'coste',e.target.value)}
                              style={{...S.inp,width:65,color:'#475569'}}/>
                            <span style={{fontSize:10,color:C.muted}}>€</span>
                          </div>
                        </td>
                        <td style={S.td}>
                          <div style={{display:'flex',alignItems:'center',gap:4,flexWrap:'wrap'}}>
                            <input type="text" inputMode="decimal" value={r.pvp} onChange={e=>updateRate(r.code,'pvp',e.target.value)}
                              style={{...S.inp,width:65,color:C.amber,fontWeight:600}}/>
                            <span style={{fontSize:10,color:C.muted}}>€</span>
{isClient&&<span style={{fontSize:10,background:'#dbeafe',color:'#1d4ed8',borderRadius:3,padding:'1px 5px'}}>cliente</span>}
                          </div>
                        </td>
                        <td style={{...S.td,textAlign:'right',color:mg>=30?C.green:mg>=15?C.amber:C.red,fontWeight:600}}>{mg.toFixed(1)}%</td>
                        <td style={{...S.td,textAlign:'center'}}>
                          {r.clientSuffix?<span style={{background:'#dbeafe',color:'#1d4ed8',borderRadius:3,padding:'1px 6px',fontSize:10,fontWeight:700}}>{r.clientSuffix}</span>:<span style={{color:'#cbd5e1'}}>—</span>}
                        </td>
                        <td style={{...S.td,textAlign:'center'}}>
                          {linked?<span style={{color:C.green,fontSize:14}} title="Vinculado a producto en Holded">✓</span>
                                 :<span style={{color:'#cbd5e1',fontSize:14}} title="No vinculado">—</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{padding:'10px 18px',borderTop:`1px solid ${C.border}`,fontSize:11,color:C.muted,background:'#f8fafc',borderRadius:'0 0 8px 8px'}}>
              Los cambios en coste y PVP se guardan automáticamente en este navegador. Usa "↑ Actualizar Holded" para empujar los PVP a tu catálogo de Holded.
            </div>
          </div>
        </div>
      )}

      {/* MODAL HOLDED */}}
      {showHolded&&(
        <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,.4)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:8,padding:24,width:'min(90vw,480px)',display:'flex',flexDirection:'column',gap:14,boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
              <span style={{fontWeight:700,fontSize:15,color:'#1d4ed8'}}>⚙️ Configuración Holded</span>
              <button onClick={()=>setShowHolded(false)} style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:C.muted}}>✕</button>
            </div>
            <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:6,padding:'10px 14px',fontSize:12,color:'#1e40af',lineHeight:1.6}}>
              Obtén tu API Key en Holded: <strong>Configuración → Desarrolladores → API Key</strong>
            </div>
            <div><div style={S.lbl}>API Key de Holded</div><input type="password" value={holdedKey} onChange={e=>setHoldedKey(e.target.value)} style={{...S.inp,fontFamily:'monospace'}} placeholder="Pega aquí tu API Key..."/></div>
            <div>
              <div style={S.lbl}>Buscar cliente en Holded</div>
              {holdedContactName&&(
                <div style={{background:'#dcfce7',border:'1px solid #86efac',borderRadius:5,padding:'6px 10px',fontSize:12,color:'#15803d',marginBottom:6,display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <span>✓ <strong>{holdedContactName}</strong></span>
                  <button onClick={()=>{setHoldedContact('');setHoldedContactName('');setContactSearch('');setContactResults([]);}} style={{background:'transparent',border:'none',cursor:'pointer',color:'#15803d',fontSize:14}}>✕</button>
                </div>
              )}
              {!holdedContactName&&(
                <div style={{position:'relative'}}>
                  <div style={{display:'flex',gap:6}}>
                    <input value={contactSearch} onChange={e=>onContactSearchChange(e.target.value)} style={{...S.inp,flex:1}} placeholder="Escribe el nombre del cliente..."/>
                    {contactLoading&&<span style={{padding:'4px 8px',fontSize:11,color:C.muted}}>Buscando...</span>}
                  </div>
                  {contactResults.length>0&&(
                    <div style={{position:'absolute',top:'100%',left:0,right:0,background:'#fff',border:`1px solid ${C.border}`,borderRadius:5,boxShadow:'0 4px 12px rgba(0,0,0,.1)',zIndex:10,maxHeight:200,overflowY:'auto',marginTop:2}}>
                      {contactResults.map(c=>(
                        <div key={c.id} onClick={()=>{
                            setHoldedContact(c.id);
                            setHoldedContactName(c.name||c.tradeName||c.id);
                            setContactSearch('');setContactResults([]);
                            // Auto-fill all client fields
                            updInfo('cliente', c.name||c.tradeName||'');
                            updInfo('cif', c.vatnumber||c.fiscalId||c.code||'');
                            updInfo('email', c.email||'');
                            updInfo('tel', c.mobile||c.phone||c.telephone||'');
                          }} style={{padding:'8px 12px',cursor:'pointer',borderBottom:`1px solid #f1f5f9`,fontSize:12,display:'flex',flexDirection:'column',gap:2}} onMouseEnter={e=>e.currentTarget.style.background='#f0f9ff'} onMouseLeave={e=>e.currentTarget.style.background='#fff'}>
                          <strong style={{color:C.text}}>{c.name||c.tradeName||'Sin nombre'}</strong>
                          {c.email&&<span style={{color:C.muted,fontSize:11}}>{c.email}</span>}
                          {c.vatnumber&&<span style={{color:C.muted,fontSize:11}}>CIF: {c.vatnumber}</span>}
                        </div>
                      ))}
                    </div>
                  )}
                  {contactError&&<div style={{fontSize:11,color:'#dc2626',marginTop:4}}>{contactError}</div>}
                  <div style={{fontSize:10,color:C.muted,marginTop:4}}>Escribe mínimo 2 letras · requiere API Key guardada</div>
                </div>
              )}
            </div>
            {/* Sincronizar productos */}
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
              <div style={S.lbl}>Vinculación con productos de Holded</div>
              <div style={{fontSize:11,color:C.muted,marginBottom:8}}>Sincroniza tu catálogo para que cada servicio ARTSER se vincule al producto real en Holded al crear el presupuesto.</div>
              <div style={{display:'flex',alignItems:'center',gap:10}}>
                <button onClick={syncProducts} disabled={syncStatus==='syncing'} style={{...S.btnB,fontSize:11}}>
                  {syncStatus==='syncing'?'Sincronizando...':'🔄 Sincronizar catálogo'}
                </button>
                {syncStatus&&syncStatus.ok&&<span style={{fontSize:11,color:C.green}}>✓ {syncStatus.total} productos · {syncStatus.matched} códigos ARTSER vinculados</span>}
                {syncStatus&&!syncStatus.ok&&syncStatus!=='syncing'&&<span style={{fontSize:11,color:C.red}}>Error: {syncStatus.error}</span>}
                {Object.keys(productMap).length>0&&!(syncStatus&&syncStatus.ok)&&<span style={{fontSize:11,color:C.green}}>✓ {Object.keys(productMap).filter(k=>k.startsWith('ARTSER')).length} códigos vinculados</span>}
              </div>
            </div>
            {/* Mi perfil */}
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
              <div style={S.lbl}>Mi nombre (se usa como Responsable en nuevos proyectos)</div>
              <div style={{display:'flex',gap:8}}>
                <input value={userName} onChange={e=>setUserName(e.target.value)} placeholder="Tu nombre completo..." style={{...S.inp,flex:1}}/>
                <button onClick={()=>{localStorage.setItem('as_username',userName);updInfo('responsable',userName);}} style={{...S.btnA,fontSize:11,whiteSpace:'nowrap'}}>Guardar nombre</button>
              </div>
            </div>
            {/* Cambiar contraseña */}
            <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12}}>
              <div style={S.lbl}>Contraseña de acceso a la app</div>
              <ChangePassword/>
            </div>
            <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
              <button onClick={()=>setShowHolded(false)} style={S.btnG}>Cerrar</button>
              <button onClick={()=>{localStorage.setItem('holdedKey',holdedKey);setShowHolded(false);}} style={S.btnA}>Guardar configuración</button>
            </div>
          </div>
        </div>
      )}


      {/* ── PANEL MIS PRESUPUESTOS ──────────────────────────────────────────── */}
      {showPresupuestos&&(
        <div style={{position:'fixed',inset:0,zIndex:1000,background:'rgba(0,0,0,.5)',display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',border:`1px solid ${C.border}`,borderRadius:8,width:'min(92vw,640px)',maxHeight:'80vh',display:'flex',flexDirection:'column',boxShadow:'0 20px 60px rgba(0,0,0,.2)'}}>
            <div style={{padding:'13px 18px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',gap:10,background:'#f8fafc',borderRadius:'8px 8px 0 0'}}>
              <span style={{fontWeight:800,fontSize:14,color:C.text}}>📋 Presupuestos guardados</span>
              <span style={{fontSize:10,padding:'2px 8px',borderRadius:10,fontWeight:700,background:storageMode==='centralized'?'#dcfce7':'#fef3c7',color:storageMode==='centralized'?'#15803d':'#92400e'}}>
                {storageMode==='centralized'?'🌐 Compartido con el equipo':'💻 Solo este navegador'}
              </span>
              <div style={{flex:1}}/>
              <button onClick={()=>setShowPresupuestos(false)} style={{background:'transparent',border:'none',fontSize:18,cursor:'pointer',color:C.muted}}>✕</button>
            </div>
            <div style={{flex:1,overflow:'auto',padding:16}}>
              {listLoading&&<div style={{textAlign:'center',padding:30,color:C.muted}}>Cargando...</div>}
              {!listLoading&&presupuestosList.length===0&&(
                <div style={{textAlign:'center',padding:30,color:C.muted}}>
                  <div style={{fontSize:28,marginBottom:8}}>📭</div>
                  <div style={{fontSize:13,marginBottom:4}}>No hay presupuestos guardados todavía.</div>
                  <div style={{fontSize:11,color:'#94a3b8'}}>Usa el botón 💾 Guardar para guardar el presupuesto actual.</div>
                </div>
              )}
              {!listLoading&&presupuestosList.map(p=>(
                <div key={p.key} onClick={()=>loadPresupuesto(p.key)}
                  style={{display:'flex',alignItems:'center',gap:12,padding:'12px 14px',background:'#f8fafc',border:`1px solid ${C.border}`,borderRadius:6,marginBottom:8,cursor:'pointer'}}
                  onMouseEnter={e=>e.currentTarget.style.background='#eff6ff'}
                  onMouseLeave={e=>e.currentTarget.style.background='#f8fafc'}>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:700,fontSize:13,color:C.text}}>{p.numero||p.key}</div>
                    <div style={{fontSize:12,color:'#64748b',marginTop:2}}>{p.cliente||'Sin cliente'}</div>
                    <div style={{fontSize:10,color:C.muted,marginTop:2}}>
                      {p.savedAt?new Date(p.savedAt).toLocaleString('es-ES'):''}
                      {p.local&&<span style={{marginLeft:6,background:'#fef3c7',color:'#92400e',borderRadius:3,padding:'0 4px',fontSize:9}}>local</span>}
                    </div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span style={{fontSize:12,color:'#1d4ed8',fontWeight:600}}>Cargar →</span>
                    <button onClick={e=>{e.stopPropagation();deletePresupuesto(p.key,e);}} style={{background:'transparent',border:'1px solid #fca5a5',borderRadius:4,color:'#dc2626',cursor:'pointer',fontSize:11,padding:'3px 8px'}}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div style={S.hdr}>
        <div><div style={S.logo}>ART SOLUCIONS</div><div style={{fontSize:10,color:C.muted}}>Generador de presupuestos</div></div>
        {info.cliente&&<div style={{fontSize:12,color:'#64748b',marginLeft:6}}>· {info.cliente}{info.numero?' · #'+info.numero:''}</div>}
        <div style={{flex:1}}/>
        {gp>0&&<div style={{textAlign:'right',marginRight:10}}><div style={{fontSize:15,fontWeight:800,color:C.amber}}>{fmt(gp)} €</div><div style={{fontSize:11,color:gm>=30?C.green:gm>=15?C.amber:C.red}}>Margen {pct(gm)} · Coste {fmt(gc)} €</div></div>}
        <button style={{...S.btnG,marginRight:6,color:'#dc2626',border:'1px solid #fca5a5'}} onClick={resetProyecto} title="Borrar proyecto actual y empezar de nuevo">🗑 Nuevo proyecto</button>
        <input ref={importRef} type="file" accept=".xlsx" style={{display:'none'}} onChange={handleImport}/>
        <button onClick={loadPresupuestosList} style={{...S.btnG,marginRight:6}}>📋 Mis presupuestos</button>
        <button onClick={savePresupuesto} style={{...S.btnG,marginRight:6,color:saveStatus==='ok'?'#16a34a':saveStatus==='error'?'#dc2626':saveStatus==='saving'?C.amber:'inherit'}}>
          {saveStatus==='saving'?'⏳ Guardando...':saveStatus==='ok_server'?'✓ Guardado (equipo)':saveStatus==='ok_local'?'✓ Guardado (local)':saveStatus==='error'?'⚠ Error':`💾 Guardar ${storageMode==='centralized'?'(equipo)':'(local)'}`}
        </button>
        <button style={{...S.btnG,marginRight:6,color:importStatus==='ok'?'#16a34a':importStatus==='loading'?C.amber:'inherit'}} onClick={()=>importRef.current?.click()}>
          {importStatus==='loading'?'⏳ Importando...':importStatus==='ok'?'✓ Importado':'📂 Importar Excel'}
        </button>
        <button style={{...S.btnG,marginRight:6}} onClick={()=>doExcel(productos,projectSecs,info)}>⬇ Exportar Excel</button>
        <button style={{...S.btnG,marginRight:6}} onClick={()=>doPdf(productos,projectSecs,info)}>🖨 PDF</button>
        <button style={{...S.btnB,marginRight:6}} onClick={handleHolded} disabled={holdedStatus==='enviando'}>
          {holdedStatus==='enviando'?'⏳ Procesando...':holdedStatus&&holdedStatus.ok?(holdedEstimateId?'✓ Sincronizado':'✓ Creado en Holded'):holdedStatus==='error'?'⚠ Error':(holdedEstimateId?'🔄 Sincronizar Holded':'📤 Crear en Holded')}
        </button>
        <button style={{...S.btnG,marginRight:6}} onClick={()=>{setRatesTab(true);setRatesSyncStatus(null);}} title="Gestionar tarifas">💰 Tarifas</button>
        <button style={S.btnG} onClick={()=>setShowHolded(true)} title="Configurar Holded">⚙️</button>
      </div>

      <div style={S.body}>
        {/* SIDEBAR */}
        <div style={S.side}>
          <button style={S.nav(nav==='datos')} onClick={()=>setNav('datos')}>📋 Datos del proyecto</button>
          <div style={{padding:'8px 12px 3px',fontSize:10,fontWeight:700,color:'#475569',letterSpacing:.7}}>ELEMENTOS FABRICADOS</div>
          {productos.map(p=>{const t=productTotals(p);return(
            <div key={p.id} style={{position:'relative'}}>
              <button style={S.nav(nav===p.id)} onClick={()=>setNav(p.id)}>
                <span style={{flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{p.nombre}</span>
                {t.pvp>0&&<span style={{fontSize:10,color:nav===p.id?'#1d4ed8':'#64748b'}}>{fmt(t.pvp*t.cant)}€</span>}
              </button>
              {nav===p.id&&<button onClick={()=>delProd(p.id)} style={{position:'absolute',right:5,top:'50%',transform:'translateY(-50%)',background:'transparent',border:'none',color:'#ef4444',cursor:'pointer',fontSize:11,padding:'2px 4px'}}>✕</button>}
            </div>
          );})}
          <button style={{...S.nav(false),color:C.amber,borderLeft:'3px solid #fde68a'}} onClick={addProd}>+ Nuevo elemento</button>
          <div style={{height:1,background:'#334155',margin:'6px 0'}}/>
          <div style={{padding:'4px 12px 3px',fontSize:10,fontWeight:700,color:'#475569',letterSpacing:.7}}>PROYECTO GLOBAL</div>
          {PROJECT_SECS.map(s=>{const t=secTotals(projectSecs[s.key]||[],'tip');return(
            <button key={s.key} style={S.nav(nav===s.key)} onClick={()=>setNav(s.key)}>
              <span style={{flex:1}}>{s.icon} {s.label}</span>
              {t.pvp>0&&<span style={{fontSize:10,color:nav===s.key?'#1d4ed8':'#64748b'}}>{fmt(t.pvp)}€</span>}
            </button>
          );})}
          {(productos.length>0||Object.values(projectSecs).some(r=>r.length>0))&&(
            <><div style={{height:1,background:'#334155',margin:'6px 0'}}/><button style={S.nav(nav==='resumen')} onClick={()=>setNav('resumen')}>📊 Resumen final</button></>
          )}
        </div>

        {/* MAIN */}
        <div style={S.main}>
          {holdedStatus&&holdedStatus.ok&&(
            <div style={{background:'#dcfce7',border:'1px solid #86efac',borderRadius:6,padding:'10px 14px',fontSize:12,color:'#15803d',display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
              ✓ <strong>{holdedStatus.updated?'Presupuesto actualizado':''+holdedStatus.created+' producto'+(holdedStatus.created!==1?'s':'')+' creado'+(holdedStatus.created!==1?'s':'')+' en inventario + presupuesto generado'} en Holded.</strong> Ya puedes abrirlo, editarlo y descargarlo como PDF desde Holded.
              <button onClick={()=>setHoldedStatus(null)} style={{marginLeft:'auto',background:'transparent',border:'none',cursor:'pointer',color:'#15803d',fontSize:16}}>✕</button>
            </div>
          )}
          {holdedStatus==='enviando'&&holdedProgress&&(
            <div style={{background:'#eff6ff',border:'1px solid #bfdbfe',borderRadius:6,padding:'10px 14px',fontSize:12,color:'#1d4ed8',display:'flex',alignItems:'center',gap:8}}>
              ⏳ {holdedProgress}
            </div>
          )}
          {holdedStatus==='error'&&(
            <div style={{background:'#fef2f2',border:'1px solid #fca5a5',borderRadius:6,padding:'10px 14px',fontSize:12,color:'#dc2626',display:'flex',alignItems:'center',gap:8}}>
              ⚠ Error al conectar con Holded. Comprueba tu API Key en ⚙️ y la consola del navegador.
              <button onClick={()=>setHoldedStatus(null)} style={{marginLeft:'auto',background:'transparent',border:'none',cursor:'pointer',color:'#dc2626',fontSize:16}}>✕</button>
            </div>
          )}

          {nav==='datos'&&(
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>📋 Datos del proyecto</span></div>
                <div style={{padding:13,display:'flex',flexDirection:'column',gap:11}}>
                  <div style={S.g3}>
                    <div>
                      <div style={S.lbl}>Nº Proyecto</div>
                      <div style={{display:'flex',gap:6}}>
                        <Inp value={info.numero} onChange={e=>updInfo('numero',e.target.value)} style={{flex:1}}/>
                        <button onClick={fetchNextProjectNumber} style={{...S.btnB,fontSize:11,whiteSpace:'nowrap'}} title="Obtener siguiente número desde Holded">↓ Auto</button>
                      </div>
                    </div>
                    <div><div style={S.lbl}>Fecha</div><Inp type="date" value={info.fecha} onChange={e=>updInfo('fecha',e.target.value)}/></div>
                    <div><div style={S.lbl}>Responsable</div><Inp value={info.responsable} onChange={e=>updInfo('responsable',e.target.value)}/></div>
                  </div>
                  <div><div style={S.lbl}>Descripción / Objeto</div><Inp value={info.descripcion} onChange={e=>updInfo('descripcion',e.target.value)}/></div>
                  <div style={S.g3}>
                    {[['objPrecio','Objetivo precio (€)'],['comisionista','Comisionista'],['comision','Comisión %']].map(([f,l])=><div key={f}><div style={S.lbl}>{l}</div><Inp value={info[f]} onChange={e=>updInfo(f,e.target.value)}/></div>)}
                  </div>

                </div>
              </div>
              <div style={S.card}>
                <div style={S.ch}><span style={S.ct}>👤 Datos del cliente</span></div>
                <div style={{padding:13,display:'flex',flexDirection:'column',gap:11}}>
                  <div style={S.g3}>{[['cliente','Empresa / Cliente'],['contacto','Persona de contacto'],['cif','CIF / NIF']].map(([f,l])=><div key={f}><div style={S.lbl}>{l}</div><Inp value={info[f]} onChange={e=>updInfo(f,e.target.value)}/></div>)}</div>
                  <div style={S.g3}>{[['email','Email'],['tel','Teléfono']].map(([f,l])=><div key={f}><div style={S.lbl}>{l}</div><Inp value={info[f]} onChange={e=>updInfo(f,e.target.value)}/></div>)}</div>
                </div>
              </div>
              {productos.length===0&&(
                <div style={{textAlign:'center',padding:24,color:C.muted,background:C.card,border:`1px dashed ${C.border}`,borderRadius:7}}>
                  <div style={{fontSize:24,marginBottom:6}}>📦</div>
                  <div style={{fontSize:13,marginBottom:4}}>Sin elementos todavía</div>
                  <div style={{fontSize:12,marginBottom:12,color:'#94a3b8'}}>Añade los elementos del proyecto (sillas, mesas, muebles...)</div>
                  <button style={S.btnA} onClick={addProd}>+ Añadir primer elemento</button>
                </div>
              )}
            </div>
          )}
          {actProd&&<ProductoView key={actProd.id} producto={actProd} onChange={upd=>updProd(actProd.id,upd)} rates={customRates}/>}
          {actProj&&<TipSection label={actProj.label} icon={actProj.icon} cats={actProj.cats} rows={projectSecs[actProj.key]||[]} onChange={rows=>updProjSec(actProj.key,rows)} rates={customRates}/>}
          {nav==='resumen'&&<ResumenView productos={productos} projectSecs={projectSecs} info={info}/>}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app-root')).render(React.createElement(AuthGate,null,React.createElement(App)));