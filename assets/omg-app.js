(function(){
  var O=window.__omg;
  var toast=document.getElementById("pullToast");
  var metaTC=document.getElementById("metaThemeColor");

  function pad(n,len){n=String(n);while(n.length<len)n="0"+n;return n}
  function getSeen(){ try{var v=JSON.parse(localStorage.getItem("omgSkinsSeen")||"[]");return Array.isArray(v)?v:[]}catch(e){return []} }
  function markSeen(id){
    try{
      var seen=getSeen();
      if(seen.indexOf(id)<0){seen.push(id);localStorage.setItem("omgSkinsSeen",JSON.stringify(seen));}
    }catch(e){}
  }

  function renderRates(){
    var seen=getSeen(), rows="";
    for(var i=0;i<O.SKINS.length;i++){
      var s=O.SKINS[i], got=seen.indexOf(s.id)>=0;
      rows+="<tr><td><button class='skin-try' data-id='"+s.id+"'>"+(got?"<span class='got'>✓</span> ":"· ")+s.name+"</button></td><td>"+s.rarity+"</td><td>"+s.pct+"</td></tr>";
    }
    document.getElementById("ratesBody").innerHTML=rows;
  }

  function show(s,fresh,previewing){
    var name=s.name, label=previewing?"Trying on":"You pulled";
    if(s.id==="serial"){
      var serial="№ "+pad(1+Math.floor(Math.random()*500),4)+"/0500";
      name="Serialized "+serial;
      var _sf=document.getElementById("serialFixed"); if(_sf)_sf.textContent="OMG "+serial;
      var _si=document.getElementById("serialInline"); if(_si)_si.textContent="OMG "+serial;
    }
    if(s.id==="nexus"){ if(!previewing)label="⚡ One-of-one pull"; name="The Nexus · 1/1"; }
    if(s.id==="karp"){ if(!previewing)label="✨ SHINY PULL ✨"; name="Golden Karp"; }
    document.getElementById("ptLabel").textContent=label;
    document.getElementById("ptName").textContent=name;
    var r=document.getElementById("ptRarity");
    r.textContent=s.rarity+" · "+s.pct;
    r.className="pt-rarity "+s.cls;
    toast.classList.remove("hidden");
    if(fresh){toast.classList.remove("fresh");void toast.offsetWidth;toast.classList.add("fresh");}
  }

  function apply(s,fresh){
    O.current=s;
    document.documentElement.dataset.skin=s.id;
    if(metaTC)metaTC.setAttribute("content",s.tc);
    markSeen(s.id);
    show(s,fresh);
    renderRates();
    try{ if(localStorage.getItem("omgSkin")) localStorage.setItem("omgSkin",s.id); }catch(e){}
    try{ sessionStorage.setItem("omgVisitSkin",s.id); }catch(e){}   // carry this visit's skin across pages
  }

  /* Try-on: equips the look, counts for nothing. */
  function tryOn(s){
    O.current=s;
    document.documentElement.dataset.skin=s.id;
    if(metaTC)metaTC.setAttribute("content",s.tc);
    show(s,true,true);
  }
  document.getElementById("ratesBody").addEventListener("click",function(ev){
    var b=ev.target.closest("button.skin-try"); if(!b)return;
    var s=O.byId(b.getAttribute("data-id")); if(s)tryOn(s);
  });

  if(metaTC)metaTC.setAttribute("content",O.current.tc);
  if(!O.forced)markSeen(O.current.id);
  if(O.rolled||O.forced)show(O.current,true,O.forced);   // only pop the toast on a genuine pull, not on carry-over navigation
  renderRates();

  function reroll(){ apply(O.roll(O.current.id),true); }
  document.getElementById("ptReroll").addEventListener("click",reroll);
  document.getElementById("footerReroll").addEventListener("click",function(){reroll();});
  document.getElementById("ptClose").addEventListener("click",function(){toast.classList.add("hidden")});
  document.getElementById("ptPin").addEventListener("click",function(){
    var ok=false;
    try{localStorage.setItem("omgSkin",O.current.id);ok=true;}catch(e){}
    this.textContent=ok?"Pinned ✓":"Can't pin here";
    var self=this;setTimeout(function(){self.textContent="Pin this skin"},1800);
  });

  // ===== owner-editable facts (config.json committed by the admin page) =====
  var DAYKEY={1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat",0:"sun"};
  var HOURS={mon:{closed:true},tue:{open:13,close:18},wed:{open:13,close:21},thu:{open:13,close:21},fri:{open:13,close:21},sat:{open:13,close:21},sun:{open:13,close:18}};
  function h12(h){var x=h%12;return x===0?12:x}
  function hlabel(d){return d.closed?"Closed":h12(d.open)+"–"+h12(d.close)+" PM"}
  function renderHours(){
    try{
      for(var wd=0;wd<7;wd++){
        var row=document.querySelector('#hoursTable tr[data-day="'+wd+'"]'); if(!row)continue;
        var d=HOURS[DAYKEY[wd]]||{closed:true};
        row.cells[1].textContent=hlabel(d);
        row.classList.toggle("closed",!!d.closed);
      }
    }catch(e){}
  }
  function openNow(){
    try{
      var fmt=new Intl.DateTimeFormat("en-US",{timeZone:"America/Chicago",weekday:"short",hour:"numeric",hour12:false});
      var parts=fmt.formatToParts(new Date());
      var wd={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[parts.find(function(p){return p.type==="weekday"}).value];
      var hr=parseInt(parts.find(function(p){return p.type==="hour"}).value,10);
      var row=document.querySelector('#hoursTable tr[data-day="'+wd+'"]');
      if(row)row.classList.add("today");
      var d=HOURS[DAYKEY[wd]]||{closed:true};
      var note=document.getElementById("openNote");
      if(note){
      if(!d.closed&&hr>=d.open&&hr<d.close){note.classList.add("open");note.innerHTML='<span class="dot" aria-hidden="true"></span>Open now until '+h12(d.close)+' PM tonight';}
      else if(!d.closed&&hr<d.open){note.classList.remove("open");note.innerHTML='<span class="dot" aria-hidden="true"></span>Opening at '+h12(d.open)+' PM today';}
      }
    }catch(e){}
  }
  function esc(t){var d=document.createElement("div");d.textContent=t==null?"":String(t);return d.innerHTML}
  function renderGallery(list,fbUrl){
    try{
      var _ge=document.getElementById("galleryEmpty");
      if(!list||!list.length){ if(_ge)_ge.style.display=""; return; }
      if(_ge)_ge.style.display="none";
      var grid=document.getElementById("galleryGrid");
      grid.innerHTML=list.map(function(g){
        var cap=esc(g.caption||"");
        return '<img class="gtile" loading="lazy" src="/assets/gallery/'+encodeURIComponent(g.file)+'" alt="'+(cap||"Photo of the shop")+'" data-cap="'+cap+'">';
      }).join("");
      document.getElementById("gallery").style.display="";
      var nav=document.getElementById("navPhotos"); if(nav)nav.style.display="";
      if(fbUrl){var fb=document.getElementById("galleryFb");fb.style.display="";document.getElementById("galleryFbLink").setAttribute("href",fbUrl);}
      grid.onclick=function(ev){
        var t=ev.target.closest(".gtile"); if(!t)return;
        document.getElementById("lbImg").src=t.src;
        document.getElementById("lbImg").alt=t.alt;
        document.getElementById("lbCap").textContent=t.getAttribute("data-cap")||"";
        document.getElementById("lightbox").classList.add("show");
      };
    }catch(e){}
  }
  (function(){
    var lb=document.getElementById("lightbox");
    if(!lb)return;   // lightbox only exists on the Photos page
    lb.addEventListener("click",function(){lb.classList.remove("show")});
    document.addEventListener("keydown",function(ev){if(ev.key==="Escape")lb.classList.remove("show")});
  })();
  function applyFacts(cfg){
    try{
      if(cfg.hours){for(var k in HOURS)if(cfg.hours[k])HOURS[k]=cfg.hours[k];renderHours();}
      if(cfg.phone){
        var digits=String(cfg.phone).replace(/[^0-9]/g,"");
        document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
          a.setAttribute("href","tel:+1"+digits.replace(/^1/,""));
          if(/[0-9]/.test(a.textContent))a.textContent=cfg.phone;
        });
      }
      if(cfg.socials){
        document.querySelectorAll("[data-net]").forEach(function(a){
          var u=cfg.socials[a.getAttribute("data-net")]; if(u)a.setAttribute("href",u);
        });
      }
      if(cfg.events&&cfg.events.length){
        var wrap=document.querySelector(".events");
        if(wrap){wrap.innerHTML=cfg.events.map(function(ev){
          return '<div class="event'+(ev.live?' live':'')+'"><div class="when">'+esc(ev.when)+'</div><h3>'+esc(ev.name)+'</h3><p>'+esc(ev.desc)+'</p></div>';
        }).join("");}
      }
      if(cfg.gallery)renderGallery(cfg.gallery,cfg.socials&&cfg.socials.facebook);
      var an=cfg.announcement;
      if(an&&an.enabled&&an.text){
        var seen=null; try{seen=localStorage.getItem("omgAnnounceDismissed")}catch(e){}
        if(seen!==String(an.updatedAt||an.text)){
          document.getElementById("announceText").textContent=an.text;
          document.getElementById("announceWrap").classList.add("show");
          document.getElementById("announceClose").onclick=function(){
            document.getElementById("announceWrap").classList.remove("show");
            try{localStorage.setItem("omgAnnounceDismissed",String(an.updatedAt||an.text))}catch(e){}
          };
        }
      }
    }catch(e){}
  }
  renderHours(); openNow();
  var isPreview=false;
  try{
    if(new URLSearchParams(location.search).get("preview")==="admin"){
      var pc=localStorage.getItem("omgPreviewCfg");
      if(pc){
        isPreview=true; applyFacts(JSON.parse(pc)); openNow();
        var rb=document.createElement("div");
        rb.style.cssText="position:fixed;top:0;left:0;right:0;z-index:70;background:#B03A2E;color:#fff;font:800 13px 'Nunito Sans',sans-serif;text-align:center;padding:8px 12px;letter-spacing:.05em";
        rb.textContent="PREVIEW: not published yet. Only you can see this. Go back to the admin tab to publish.";
        document.body.appendChild(rb);
      }
    }
  }catch(e){}
  if(!isPreview){
    fetch("config.json",{cache:"no-store"}).then(function(r){
      if(r.ok)return r.json();
      return fetch("/config.json",{cache:"no-store"}).then(function(r2){return r2.ok?r2.json():null});
    }).then(function(cfg){
      if(cfg){applyFacts(cfg); openNow();}
    }).catch(function(){});
  }
})();
