/* Roll the site skin BEFORE first paint. Weights are basis points (of 10,000).
   One pull per visit: a fresh roll is saved in sessionStorage and carried across pages
   until the tab closes or the visitor hits "Pull again". A pinned skin (localStorage) or a
   ?skin= override still wins. Loaded synchronously in <head> so there is no wrong-skin flash. */
(function(){
  var SKINS=[
    {id:"classic", name:"Classic",        rarity:"Common",      cls:"r-common",   w:3290, pct:"32.9%",  tc:"#2F6B4E"},
    {id:"sakura",  name:"Sakura",         rarity:"Uncommon",    cls:"r-uncommon", w:2300, pct:"23%",    tc:"#E85D8A"},
    {id:"beach",   name:"Beach Day",      rarity:"Uncommon",    cls:"r-uncommon", w:1200, pct:"12%",    tc:"#1FA5A0"},
    {id:"retro",   name:"Retro '99",      rarity:"Uncommon",    cls:"r-uncommon", w:1000, pct:"10%",    tc:"#F5C518"},
    {id:"manga",   name:"Manga",          rarity:"Rare",        cls:"r-rare",     w:500,  pct:"5%",     tc:"#111111"},
    {id:"halloween",name:"Halloween",     rarity:"Rare",        cls:"r-rare",     w:300,  pct:"3%",     tc:"#0B0E22"},
    {id:"midnight",name:"Midnight Etched",rarity:"Rare",        cls:"r-rare",     w:800,  pct:"8%",     tc:"#0B0C14"},
    {id:"surge",   name:"Surge Foil",     rarity:"Rare",        cls:"r-rare",     w:400,  pct:"4%",     tc:"#0E1230"},
    {id:"gold",    name:"Gold Holo",      rarity:"Secret Rare", cls:"r-secret",   w:150,  pct:"1.5%",   tc:"#C9A227"},
    {id:"serial",  name:"Serialized",     rarity:"Serialized",  cls:"r-serial",   w:45,   pct:"0.45%",  tc:"#0F0F0F"},
    {id:"karp",    name:"Golden Karp",    rarity:"Shiny",       cls:"r-shiny",    w:10,   pct:"0.1%",   tc:"#F5C33B"},
    {id:"nexus",   name:"The Nexus",      rarity:"One of One",  cls:"r-one",      w:5,    pct:"0.05%",  tc:"#05040F"}
  ];
  function byId(id){for(var i=0;i<SKINS.length;i++)if(SKINS[i].id===id)return SKINS[i];return null}
  var RARE={manga:1,halloween:1,midnight:1,surge:1,gold:1,serial:1,nexus:1,karp:1};
  function loadPity(){try{return parseInt(localStorage.getItem("omgPity")||"0",10)||0}catch(e){return 0}}
  function savePity(n){try{localStorage.setItem("omgPity",String(n))}catch(e){}}
  /* Real pull. Pity rule: 6 dry pulls without a Rare+ guarantee the next is Rare+. */
  function roll(excludeId){
    var pity=loadPity();
    var pool=SKINS.filter(function(s){return s.id!==excludeId});
    if(pity>=5){ var rp=pool.filter(function(s){return RARE[s.id]}); if(rp.length)pool=rp; }
    var total=pool.reduce(function(a,s){return a+s.w},0), r=Math.random()*total, pick=pool[pool.length-1];
    for(var i=0;i<pool.length;i++){ if((r-=pool[i].w)<0){ pick=pool[i]; break; } }
    savePity(RARE[pick.id]?0:pity+1);
    return pick;
  }
  var chosen=null,forced=false,rolled=false;
  try{
    var qs=new URLSearchParams(location.search).get("skin");
    if(qs&&byId(qs)){ chosen=byId(qs); forced=true; }
    if(!chosen){ var pinned=localStorage.getItem("omgSkin"); if(pinned&&byId(pinned)) chosen=byId(pinned); }
    if(!chosen){ var visit=sessionStorage.getItem("omgVisitSkin"); if(visit&&byId(visit)) chosen=byId(visit); }
  }catch(e){}
  if(!chosen){ chosen=roll(null); rolled=true; }
  try{
    document.documentElement.dataset.skin=chosen.id;
    document.documentElement.classList.add("js");
    if(rolled) sessionStorage.setItem("omgVisitSkin",chosen.id);
  }catch(e){}
  window.__omg={SKINS:SKINS, current:chosen, roll:roll, byId:byId, forced:forced, rolled:rolled};
})();
