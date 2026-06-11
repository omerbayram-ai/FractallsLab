(function() {
    'use strict';
    
    // ===== LOADER =====
    window.addEventListener('load', () => { setTimeout(() => document.getElementById('loader').classList.add('hidden'), 600); });
    
// ===== PARTICLES (PERFORMANS OPTİMİZASYONLU) =====
    (function() {
        const c = document.getElementById('particles-canvas'), ctx = c.getContext('2d');
        let w, h, isVisible = true; const P = [], N = 50;
        function resize() { w = c.width = innerWidth; h = c.height = innerHeight; }
        resize(); addEventListener('resize', resize);
        for (let i = 0; i < N; i++) P.push({ x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.5+0.5, dx: (Math.random()-0.5)*0.3, dy: (Math.random()-0.5)*0.3, a: Math.random()*0.4+0.1 });
        
        const observer = new IntersectionObserver(entries => { isVisible = entries[0].isIntersecting; });
        observer.observe(document.getElementById('hero')); // Sadece Hero görünürken çalıştır
        
        (function draw() {
            if(isVisible) {
                ctx.clearRect(0,0,w,h);
                P.forEach(p => { p.x+=p.dx; p.y+=p.dy; if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0; ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle=`rgba(102,252,241,${p.a})`; ctx.fill(); });
                for(let i=0;i<P.length;i++) for(let j=i+1;j<P.length;j++) { const dx=P[i].x-P[j].x, dy=P[i].y-P[j].y, d=Math.sqrt(dx*dx+dy*dy); if(d<150){ctx.beginPath();ctx.moveTo(P[i].x,P[i].y);ctx.lineTo(P[j].x,P[j].y);ctx.strokeStyle=`rgba(102,252,241,${0.04*(1-d/150)})`;ctx.lineWidth=0.5;ctx.stroke();}}
            }
            requestAnimationFrame(draw);
        })();
    })();

    // ===== NAVIGATION =====
    const nav = document.getElementById('main-nav');
    const hamburger = document.getElementById('nav-hamburger');
    const navLinks = document.getElementById('nav-links');
    const navTabs = document.querySelectorAll('.nav-tab');
    const navGroups = document.querySelectorAll('.nav-group');
    const backToTop = document.getElementById('back-to-top');

    function setActiveGroup(groupName) {
        navTabs.forEach(btn => btn.classList.toggle('active', btn.dataset.group === groupName));
        navGroups.forEach(group => group.classList.toggle('active', group.dataset.group === groupName));
    }

    if(navTabs.length) {
        navTabs.forEach(tab => tab.addEventListener('click', () => {
            setActiveGroup(tab.dataset.group);
        }));
    }

    addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('visible', scrollY > 600);
        if(navLinks) {
            document.querySelectorAll('section[id]').forEach(s => {
                const link = navLinks.querySelector(`a[href="#${s.id}"]`);
                if (link) link.classList.toggle('active', scrollY + 120 >= s.offsetTop && scrollY + 120 < s.offsetTop + s.offsetHeight);
            });
        }
    });
    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => { navLinks.classList.toggle('open'); hamburger.classList.toggle('active'); });
        navLinks.querySelectorAll('a').forEach(l => l.addEventListener('click', () => { navLinks.classList.remove('open'); hamburger.classList.remove('active'); }));
    }
    backToTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    
    // ===== SCROLL REVEAL =====
    const ro = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => ro.observe(el));
    
    // ===== HERO JULIA SET =====
    (function() {
        const canvas = document.getElementById('hero-canvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, sw, sh, running = false, af = null, time = 0;
        const off = document.createElement('canvas'), oc = off.getContext('2d'), S = 4;
        function resize() { W=canvas.width=innerWidth; H=canvas.height=innerHeight; sw=Math.max(1,Math.ceil(W/S)); sh=Math.max(1,Math.ceil(H/S)); off.width=sw; off.height=sh; }
        resize(); addEventListener('resize', resize);
        function draw() {
            if(!running) return;
            const img = oc.createImageData(sw,sh), d = img.data;
            const cR=-0.7+0.1*Math.sin(time*0.0003), cI=0.27015+0.05*Math.cos(time*0.0004), mx=50, z=1.2+0.15*Math.sin(time*0.0002), ar=sw/sh;
            for(let py=0;py<sh;py++) for(let px=0;px<sw;px++) {
                let zR=((px/sw)-0.5)*4*ar/z, zI=((py/sh)-0.5)*4/z, i=0;
                while(zR*zR+zI*zI<4&&i<mx){const t=zR*zR-zI*zI+cR;zI=2*zR*zI+cI;zR=t;i++;}
                const idx=(py*sw+px)*4;
                if(i===mx){d[idx]=11;d[idx+1]=12;d[idx+2]=16;d[idx+3]=255;}
                else{const t=i/mx;d[idx]=Math.floor(10+90*t);d[idx+1]=Math.floor(20+200*t*t);d[idx+2]=Math.floor(80+170*t);d[idx+3]=255;}
            }
            oc.putImageData(img,0,0); ctx.imageSmoothingEnabled=true; ctx.drawImage(off,0,0,W,H);
            time+=16; af=requestAnimationFrame(draw);
        }
        function start(){if(running)return;running=true;draw();}
        function stop(){running=false;if(af){cancelAnimationFrame(af);af=null;}}
        start();
        new IntersectionObserver(es=>{es[0].isIntersecting?start():stop();},{threshold:0.05}).observe(canvas);
    })();
   
    // ===== MATRIX PLAYGROUND =====
    (function() {
        const canvas = document.getElementById('matrixCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
        const inp = { a11:document.getElementById('a11'), a12:document.getElementById('a12'), a21:document.getElementById('a21'), a22:document.getElementById('a22'), bx:document.getElementById('bx'), by:document.getElementById('by') };
        function drawEigenViz(a11, a12, a21, a22) {
            const eCanvas = document.getElementById('eigenCanvas');
            if (!eCanvas) return;
            const eCtx = eCanvas.getContext('2d');
            const ew = eCanvas.width, eh = eCanvas.height;
            eCtx.clearRect(0, 0, ew, eh);
            eCtx.strokeStyle = 'rgba(102,252,241,0.05)';
            eCtx.lineWidth = 1;
            for (let i = 0; i <= ew; i += 30) { eCtx.beginPath(); eCtx.moveTo(i, 0); eCtx.lineTo(i, eh); eCtx.stroke(); eCtx.beginPath(); eCtx.moveTo(0, i); eCtx.lineTo(ew, i); eCtx.stroke(); }
            const cx = ew/2, cy = eh/2, scale = 55;
            eCtx.beginPath();
            for (let ang = 0; ang <= 360; ang++) {
                const rad = ang * Math.PI / 180;
                const x = Math.cos(rad), y = Math.sin(rad);
                const x2 = a11*x + a12*y, y2 = a21*x + a22*y;
                const px = cx + x2 * scale, py = cy - y2 * scale;
                if (ang === 0) eCtx.moveTo(px, py); else eCtx.lineTo(px, py);
            }
            eCtx.closePath();
            eCtx.strokeStyle = '#66fcf1'; eCtx.lineWidth = 2; eCtx.stroke();
            eCtx.fillStyle = 'rgba(102,252,241,0.08)'; eCtx.fill();
            const tr = a11 + a22, det = a11*a22 - a12*a21, delta = tr*tr - 4*det;
            eCtx.font = '12px Inter, sans-serif'; eCtx.fillStyle = '#a0a8b4';
            if (delta >= 0) {
                const sqrtD = Math.sqrt(delta);
                const l1 = (tr + sqrtD)/2, l2 = (tr - sqrtD)/2;
                let vx1, vy1, vx2, vy2;
                if (Math.abs(a12) > 0.001) { vx1 = a12; vy1 = l1 - a11; vx2 = a12; vy2 = l2 - a11; }
                else if (Math.abs(a21) > 0.001) { vx1 = l1 - a22; vy1 = a21; vx2 = l2 - a22; vy2 = a21; }
                else { vx1 = 1; vy1 = 0; vx2 = 0; vy2 = 1; }
                let len1 = Math.hypot(vx1, vy1), len2 = Math.hypot(vx2, vy2);
                if (len1 > 0.001) { vx1 /= len1; vy1 /= len1; }
                if (len2 > 0.001) { vx2 /= len2; vy2 /= len2; }
                eCtx.beginPath(); eCtx.moveTo(cx, cy); eCtx.lineTo(cx + vx1 * l1 * scale, cy - vy1 * l1 * scale); eCtx.strokeStyle = '#ff4757'; eCtx.lineWidth = 2.5; eCtx.stroke();
                eCtx.beginPath(); eCtx.moveTo(cx, cy); eCtx.lineTo(cx + vx2 * l2 * scale, cy - vy2 * l2 * scale); eCtx.strokeStyle = '#ffa502'; eCtx.stroke();
                eCtx.fillText(`λ₁ = ${l1.toFixed(2)}`, 10, 20);
                eCtx.fillText(`λ₂ = ${l2.toFixed(2)}`, 10, 40);
            } else {
                eCtx.fillText('Complex eigenvalues', 10, 20);
                eCtx.fillText('(Rotation dominant)', 10, 40);
            }
            eCtx.beginPath(); eCtx.arc(cx, cy, 3, 0, 2*Math.PI); eCtx.fillStyle = '#e8e8e8'; eCtx.fill();
        }
        function updateAnalysis(a, b, c, d) {
            const tr = a + d, det = (a * d - b * c), delta = tr * tr - 4 * det;
            let l1, l2;
            if (delta >= 0) { l1 = ((tr + Math.sqrt(delta)) / 2).toFixed(2); l2 = ((tr - Math.sqrt(delta)) / 2).toFixed(2); }
            else { l1 = (tr/2).toFixed(2) + "±" + (Math.sqrt(-delta)/2).toFixed(2) + "i"; l2 = ""; }
            const isStable = (Math.abs(det) < 1) ? "Attractor" : "Divergent";
            const eig1 = document.getElementById('eig1');
            const eig2 = document.getElementById('eig2');
            const detA = document.getElementById('detA');
            const stabEl = document.getElementById('stab');
            if(eig1) eig1.textContent = l1;
            if(eig2) eig2.textContent = l2;
            if(detA) detA.textContent = det.toFixed(2);
            if(stabEl) {
                stabEl.textContent = isStable;
                stabEl.style.color = (isStable === "Attractor") ? "#66fcf1" : "#ff4757";
            }
        }
        const presets = { rotate:{a11:0.6,a12:-0.4,a21:0.4,a22:0.6,bx:0.5,by:0.5}, scale:{a11:0.5,a12:0,a21:0,a22:0.5,bx:0.25,by:0.25}, shear:{a11:0.5,a12:0.3,a21:0,a22:0.5,bx:0.2,by:0.3}, spiral:{a11:0.7,a12:-0.3,a21:0.3,a22:0.7,bx:0.15,by:0.15}, sierpinski:{a11:0.5,a12:0,a21:0,a22:0.5,bx:0.5,by:0} };
        function setP(n){const p=presets[n];if(!p)return;Object.keys(p).forEach(k=>{if(inp[k]) inp[k].value=p[k];});}
        setP('spiral');
        function gv(){return{a11:parseFloat(inp.a11?inp.a11.value:0)||0,a12:parseFloat(inp.a12?inp.a12.value:0)||0,a21:parseFloat(inp.a21?inp.a21.value:0)||0,a22:parseFloat(inp.a22?inp.a22.value:0)||0,bx:parseFloat(inp.bx?inp.bx.value:0)||0,by:parseFloat(inp.by?inp.by.value:0)||0};}
        function draw() {
            const v = gv();
            updateAnalysis(v.a11, v.a12, v.a21, v.a22); 
            drawEigenViz(v.a11, v.a12, v.a21, v.a22); 
            ctx.clearRect(0,0,w,h);
            ctx.strokeStyle='rgba(102,252,241,0.04)';ctx.lineWidth=1;
            for(let i=0;i<=w;i+=50){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,i);ctx.lineTo(w,i);ctx.stroke();}
            ctx.strokeStyle='rgba(102,252,241,0.1)';ctx.beginPath();ctx.moveTo(w/2,0);ctx.lineTo(w/2,h);ctx.stroke();ctx.beginPath();ctx.moveTo(0,h/2);ctx.lineTo(w,h/2);ctx.stroke();
            const it=80000,skip=20;
            const T=[{a:v.a11,b:v.a12,c:v.a21,d:v.a22,e:v.bx,f:v.by,p:0.5},{a:v.a11*0.8,b:-v.a12*0.6,c:-v.a21*0.6,d:v.a22*0.8,e:1-v.bx,f:v.by*0.8,p:0.3},{a:0.3,b:0,c:0,d:0.3,e:0.5,f:0.05,p:0.2}];
            const id=ctx.createImageData(w,h),dt=id.data;let x=Math.random(),y=Math.random();
            for(let i=0;i<it;i++){const r=Math.random();let t;if(r<T[0].p)t=T[0];else if(r<T[0].p+T[1].p)t=T[1];else t=T[2];const nx=t.a*x+t.b*y+t.e,ny=t.c*x+t.d*y+t.f;x=nx;y=ny;if(i<skip)continue;if(x<-5||x>5||y<-5||y>5){x=Math.random();y=Math.random();continue;}
            const m=40,dW=w-2*m,dH=h-2*m,px=Math.floor(m+x*dW),py=Math.floor(m+y*dH);
            if(px>=0&&px<w&&py>=0&&py<h){const idx=(py*w+px)*4,bl=(i%600)/600;dt[idx]=Math.floor(102*(1-bl)+69*bl);dt[idx+1]=Math.floor(252*(1-bl)+162*bl);dt[idx+2]=Math.floor(241*(1-bl)+158*bl);dt[idx+3]=Math.min(255,dt[idx+3]+100);}}
            ctx.putImageData(id,0,0);
        }
        Object.values(inp).forEach(i=>{if(i) i.addEventListener('input',draw);});
        document.querySelectorAll('.preset-btn').forEach(b=>b.addEventListener('click',()=>{setP(b.dataset.preset);draw();}));
        draw();
    })();
    
    // ===== BARNSLEY FERN =====
    (function() {
        const c = document.getElementById('fernCanvas');
        if(!c) return;
        const ctx = c.getContext('2d'), w=c.width, h=c.height;
        const id = ctx.createImageData(w,h), d = id.data;
        for(let i=0;i<d.length;i+=4){d[i]=11;d[i+1]=12;d[i+2]=16;d[i+3]=255;}
        let x=0,y=0; const it=100000, pT=15,pB=20,pS=30,dH=h-pT-pB,dW=w-2*pS,fmx=-2.5,fMx=2.8,fmy=0,fMy=10.2;
        for(let i=0;i<it;i++){const r=Math.random();let nx,ny;if(r<0.01){nx=0;ny=0.16*y;}else if(r<0.86){nx=0.85*x+0.04*y;ny=-0.04*x+0.85*y+1.6;}else if(r<0.93){nx=0.2*x-0.26*y;ny=0.23*x+0.22*y+1.6;}else{nx=-0.15*x+0.28*y;ny=0.26*x+0.24*y+0.44;}x=nx;y=ny;
        const px=Math.floor(pS+((x-fmx)/(fMx-fmx))*dW),py=Math.floor(pT+dH-((y-fmy)/(fMy-fmy))*dH);
        if(px>=0&&px<w&&py>=0&&py<h){const idx=(py*w+px)*4,t=Math.min(1,i/(it*0.25));d[idx]=Math.floor(20+50*t);d[idx+1]=Math.floor(160+92*t);d[idx+2]=Math.floor(70+80*t);d[idx+3]=255;}}
        ctx.putImageData(id,0,0);
    })();
    
    // ===== SIERPINSKI TRIANGLE =====
    (function() {
        const c = document.getElementById('sierpinskiCanvas');
        if(!c) return;
        const ctx = c.getContext('2d'), w=c.width, h=c.height;
        const id = ctx.createImageData(w,h), d = id.data;
        for(let i=0;i<d.length;i+=4){d[i]=11;d[i+1]=12;d[i+2]=16;d[i+3]=255;}
        const verts = [[w/2, 20],[30, h-20],[w-30, h-20]];
        let x = Math.random()*w, y = Math.random()*h;
        for(let i=0;i<100000;i++){
            const v = verts[Math.floor(Math.random()*3)];
            x = (x+v[0])/2; y = (y+v[1])/2;
            if(i<10) continue;
            const px=Math.floor(x), py=Math.floor(y);
            if(px>=0&&px<w&&py>=0&&py<h){const idx=(py*w+px)*4;const t=Math.min(1,i/25000);d[idx]=Math.floor(102*(1-t*0.3));d[idx+1]=Math.floor(200+52*t);d[idx+2]=Math.floor(200+41*t);d[idx+3]=255;}
        }
        ctx.putImageData(id,0,0);
    })();
    
    // ===== WEIERSTRASS FUNCTION =====
    (function() {
        const canvas = document.getElementById('weierstrassCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const sliderA = document.getElementById('w-slider-a'), sliderB = document.getElementById('w-slider-b');
        const valA = document.getElementById('weierstrass-a-val'), valB = document.getElementById('weierstrass-b-val');
        function drawWeierstrass() {
            const w = canvas.width, h = canvas.height;
            ctx.clearRect(0, 0, w, h);
            const cx = w/2, cy = h/2;
            ctx.strokeStyle = 'rgba(102,252,241,0.05)'; ctx.lineWidth = 1;
            for(let i = 0; i <= w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
            for(let i = 0; i <= h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }
            ctx.strokeStyle = 'rgba(102,252,241,0.3)'; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(w, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, h); ctx.stroke();
            ctx.fillStyle = 'rgba(102,252,241,0.5)'; ctx.font = '10px Inter, sans-serif';
            ctx.fillText("x", w - 12, cy - 6); ctx.fillText("f(x)", cx + 6, 12);
            const a = parseFloat(sliderA.value), b = parseInt(sliderB.value);
            valA.textContent = a.toFixed(1); valB.textContent = b;
            ctx.beginPath(); ctx.strokeStyle = 'rgba(102,252,241,0.95)'; ctx.lineWidth = 1.5;
            for (let px = 0; px < w; px++) {
                const x = (px / w) * 4 - 2;
                let y = 0;
                for (let n = 0; n < 40; n++) y += Math.pow(a, n) * Math.cos(Math.pow(b, n) * Math.PI * x);
                const py = cy - (y * (h/4));
                if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.stroke();
        }
        sliderA.addEventListener('input', drawWeierstrass); sliderB.addEventListener('input', drawWeierstrass);
        drawWeierstrass();
    })();

    // ===== INTERACTIVE COASTLINE PARADOX =====
    (function() {
        const c = document.getElementById('coastlineCanvas');
        if(!c) return;
        const ctx = c.getContext('2d'), w = c.width, h = c.height;
        const countrySelect = document.getElementById('coast-country'), rulerSlider = document.getElementById('coast-ruler');
        const rulerValText = document.getElementById('ruler-val'), resultText = document.getElementById('coast-result');
        const shapeUK = [[180,180],[160,120],[170,50],[210,30],[230,90],[220,180],[180,180]];
        const shapeTR = [[70,80],[110,90],[190,65],[280,75],[340,90],[350,130],[320,160],[260,155],[230,185],[210,160],[140,170],[90,155],[70,120],[70,80]];
        const shapeNO = [[160,190],[170,110],[230,30],[260,40],[190,130],[190,190],[160,190]];
        const shapeAU = [[100,110],[200,50],[300,80],[320,160],[220,190],[120,170],[100,110]];
        const shapeJP = [[120,180],[160,130],[250,60],[300,40],[280,70],[210,150],[150,190],[120,180]];
        const countries = { uk:{baseLen:2800,D:1.25,rough:35,baseShape:shapeUK}, tr:{baseLen:8333,D:1.18,rough:25,baseShape:shapeTR}, norway:{baseLen:25000,D:1.52,rough:60,baseShape:shapeNO}, australia:{baseLen:25760,D:1.13,rough:15,baseShape:shapeAU}, japan:{baseLen:29751,D:1.22,rough:30,baseShape:shapeJP} };
        let seed = 1;
        function random() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
        function midpointDisplace(points, roughness, iterations) {
            let pts = [...points];
            for(let iter=0; iter<iterations; iter++){
                const newPts = [pts[0]];
                for(let i=0; i<pts.length-1; i++){
                    const mx = (pts[i][0]+pts[i+1][0])/2 + (random()-0.5)*roughness;
                    const my = (pts[i][1]+pts[i+1][1])/2 + (random()-0.5)*roughness;
                    newPts.push([mx, my], pts[i+1]);
                }
                pts = newPts;
                roughness *= 0.55;
            }
            return pts;
        }
        function drawCoast(countryData, rulerScale) {
            ctx.clearRect(0,0,w,h); ctx.fillStyle = 'rgba(20,60,120,0.4)'; ctx.fillRect(0,0,w,h);
            const detailLevel = Math.floor(5 + (1 - rulerScale) * 3);
            seed = countryData.baseLen;
            const coast = midpointDisplace(countryData.baseShape, countryData.rough, detailLevel);
            ctx.beginPath(); coast.forEach((p,i) => { if(i===0) ctx.moveTo(p[0],p[1]); else ctx.lineTo(p[0],p[1]); }); ctx.closePath();
            ctx.fillStyle = 'rgba(40,70,50,0.6)'; ctx.fill();
            ctx.strokeStyle = 'rgba(102,252,241,0.9)'; ctx.lineWidth = 1.5; ctx.shadowColor = 'rgba(102,252,241,0.4)'; ctx.shadowBlur = 8; ctx.stroke(); ctx.shadowBlur = 0;
        }
        function updateAll() {
            const cKey = countrySelect.value, data = countries[cKey], rulerSize = parseInt(rulerSlider.value);
            rulerValText.textContent = rulerSize + " km";
            const scaleRatio = 100 / rulerSize, calculatedLength = data.baseLen * Math.pow(scaleRatio, data.D - 1);
            resultText.textContent = Math.round(calculatedLength).toLocaleString() + " km";
            drawCoast(data, rulerSize / 100);
        }
        countrySelect.addEventListener('change', updateAll); rulerSlider.addEventListener('input', updateAll);
        updateAll();
    })();
    
    // ===== KOCH FRACTAL EXPLORER =====
    (function() {
        const canvas = document.getElementById('kochCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d');
        const slider = document.getElementById('koch-slider'), valDisp = document.getElementById('koch-value');
        const w = canvas.width, h = canvas.height;
        let currentShape = 'snowflake';
        document.querySelectorAll('.shape-btn').forEach(btn => {
            if(btn.id === 'animateKochBtn') return;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.shape-btn:not(#animateKochBtn)').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentShape = btn.dataset.shape;
                drawFractal(parseInt(slider.value));
            });
        });
        function kochIterateOnce(points, angle, closed) {
            const out = []; const len = closed ? points.length : points.length - 1;
            for (let i = 0; i < len; i++) {
                const p1 = points[i], p2 = points[(i + 1) % points.length];
                const dx = p2[0] - p1[0], dy = p2[1] - p1[1];
                const a = [p1[0] + dx/3, p1[1] + dy/3], b = [p1[0] + 2*dx/3, p1[1] + 2*dy/3];
                const peak = [ a[0] + (b[0]-a[0])*Math.cos(angle) - (b[1]-a[1])*Math.sin(angle), a[1] + (b[0]-a[0])*Math.sin(angle) + (b[1]-a[1])*Math.cos(angle) ];
                out.push(p1, a, peak, b);
            }
            if (!closed) out.push(points[points.length-1]);
            return out;
        }
        function quadIterateOnce(points, closed) {
            const out = []; const len = closed ? points.length : points.length - 1;
            for (let i = 0; i < len; i++) {
                const p1 = points[i], p2 = points[(i+1)%points.length];
                const dx = p2[0]-p1[0], dy = p2[1]-p1[1];
                const a = [p1[0]+dx/3, p1[1]+dy/3], b = [p1[0]+2*dx/3, p1[1]+2*dy/3];
                const nx = -dy/3, ny = dx/3;
                out.push(p1, a, [a[0]+nx, a[1]+ny], [b[0]+nx, b[1]+ny], b);
            }
            if (!closed) out.push(points[points.length-1]);
            return out;
        }
        function getBasePoints(shape) {
            const m=80, side=w-2*m, triH=(Math.sqrt(3)/2)*side, cy=h/2, topY=cy-triH/2+20;
            const v1=[m, topY+triH], v2=[m+side, topY+triH], v3=[m+side/2, topY];
            switch(shape){
                case 'snowflake': return { pts:[v1,v2,v3], closed:true, angle:-Math.PI/3 };
                case 'antisnowflake': return { pts:[v1,v2,v3], closed:true, angle:Math.PI/3 };
                case 'cesaro': return { pts:[v1,v2,v3], closed:true, angle:-85*Math.PI/180 };
                case 'quadratic': return { pts:[[100,(h-(w-200))/2],[w-100,(h-(w-200))/2],[w-100,(h-(w-200))/2+(w-200)],[100,(h-(w-200))/2+(w-200)]], closed:true, quad:true };
                case 'curve': return { pts:[v1,v2], closed:false, angle:-Math.PI/3 };
                default: return { pts:[v1,v2,v3], closed:true, angle:-Math.PI/3 };
            }
        }
        function drawFractal(requestedDepth) {
            ctx.clearRect(0,0,w,h); ctx.fillStyle='rgba(11,12,16,0.8)'; ctx.fillRect(0,0,w,h);
            if(currentShape==='mandelbrot'){
                const id=ctx.createImageData(w,h), d=id.data, maxIter=requestedDepth===0?1:(requestedDepth*requestedDepth*2+5), zoom=1.6, offsetX=-0.5, offsetY=0;
                for(let py=0;py<h;py++) for(let px=0;px<w;px++){
                    const cR=offsetX+(px-w/2)/(w/4)/zoom, cI=offsetY+(py-h/2)/(h/4)/zoom;
                    let zR=0,zI=0,i=0;
                    while(zR*zR+zI*zI<4&&i<maxIter){const t=zR*zR-zI*zI+cR; zI=2*zR*zI+cI; zR=t; i++;}
                    const idx=(py*w+px)*4;
                    if(i===maxIter){ d[idx]=11; d[idx+1]=12; d[idx+2]=16; d[idx+3]=255; }
                    else{ const t=i/maxIter, s=Math.sqrt(t); d[idx]=Math.floor(9+80*s); d[idx+1]=Math.floor(20+232*t*t); d[idx+2]=Math.floor(60+196*s); d[idx+3]=255; }
                }
                ctx.putImageData(id,0,0);
                ctx.fillStyle='rgba(160,168,180,0.6)'; ctx.font='12px Inter,sans-serif'; ctx.textAlign='center';
                ctx.fillText(`Mandelbrot Set · Max Iterations: ${maxIter}`, w/2, h-14);
                return;
            }
            const base=getBasePoints(currentShape);
            const maxD=currentShape==='quadratic'?8:10;
            const depth=Math.min(requestedDepth,maxD);
            let points=[...base.pts];
            for(let iter=0;iter<depth;iter++) points=base.quad?quadIterateOnce(points,base.closed):kochIterateOnce(points,base.angle,base.closed);
            if(points.length===0) return;
            if(base.closed && points.length<100000){
                ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
                for(let i=1;i<points.length;i++) ctx.lineTo(points[i][0],points[i][1]);
                ctx.closePath();
                const ys=points.map(p=>p[1]), minY=Math.min(...ys), maxY=Math.max(...ys);
                const grad=ctx.createLinearGradient(0,minY,0,maxY);
                grad.addColorStop(0,'rgba(102,252,241,0.15)'); grad.addColorStop(0.5,'rgba(69,162,158,0.08)'); grad.addColorStop(1,'rgba(102,252,241,0.1)');
                ctx.fillStyle=grad; ctx.fill();
            }
            ctx.strokeStyle='rgba(102,252,241,0.9)';
            if(depth>=9) ctx.lineWidth=0.5; else if(depth>=7) ctx.lineWidth=0.8; else if(depth>=5) ctx.lineWidth=1.0; else if(depth>=3) ctx.lineWidth=1.5; else ctx.lineWidth=2.0;
            if(depth<=6){ ctx.shadowColor='rgba(102,252,241,0.35)'; ctx.shadowBlur=10; } else ctx.shadowBlur=0;
            const CHUNK_SIZE=50000;
            ctx.beginPath(); ctx.moveTo(points[0][0],points[0][1]);
            for(let i=1;i<points.length;i++){ ctx.lineTo(points[i][0],points[i][1]); if(i%CHUNK_SIZE===0){ ctx.stroke(); ctx.beginPath(); ctx.moveTo(points[i][0],points[i][1]); } }
            ctx.stroke(); ctx.shadowBlur=0;
            const edgeCount=base.pts.length, multiplier=base.quad?5:4;
            const segments=(base.closed?edgeCount:edgeCount-1)*Math.pow(multiplier,depth);
            const shapeNames={ snowflake:'Koch Snowflake', antisnowflake:'Anti-Snowflake', cesaro:'Cesàro Fractal', quadratic:'Quadratic Koch', curve:'Koch Curve' };
            ctx.fillStyle='rgba(160,168,180,0.6)'; ctx.font='12px Inter,sans-serif'; ctx.textAlign='center';
            let label=`${shapeNames[currentShape]} · Iteration ${depth} · ${segments.toLocaleString()} segments`;
            if(depth<requestedDepth) label+=` (Capped at step ${depth} for performance!)`;
            ctx.fillText(label,w/2,h-14);
        }
        let debounceTimer;
        slider.addEventListener('input',()=>{ const v=parseInt(slider.value); valDisp.textContent=v; clearTimeout(debounceTimer); if(v>=8 && currentShape!=='mandelbrot'){ ctx.clearRect(0,0,w,h); ctx.fillStyle='rgba(11,12,16,0.8)'; ctx.fillRect(0,0,w,h); ctx.fillStyle='rgba(102,252,241,0.8)'; ctx.font='13px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(`Heavy computation... Rendering step ${v}`,w/2,h/2); debounceTimer=setTimeout(()=>{ drawFractal(v); },400); } else { drawFractal(v); } });
        let isAnimating=false, animTimeout=null, animBtn=document.getElementById('animateKochBtn');
        function stopAnimation(){ isAnimating=false; animBtn.innerHTML='▶ Auto Play'; animBtn.style.background='var(--accent-cyan)'; animBtn.style.color='var(--bg-deep)'; clearTimeout(animTimeout); }
        animBtn.addEventListener('click',()=>{ if(isAnimating) stopAnimation(); else{ isAnimating=true; animBtn.innerHTML='⏹ Stop'; animBtn.style.background='#ff4757'; animBtn.style.color='#fff'; animBtn.style.borderColor='#ff4757'; let currentStep=parseInt(slider.value); const maxStep=currentShape==='quadratic'?8:10; if(currentStep>=maxStep){ currentStep=0; slider.value=0; valDisp.textContent=0; drawFractal(0); } function nextFrame(){ if(!isAnimating) return; currentStep++; if(currentStep>maxStep){ stopAnimation(); return; } slider.value=currentStep; valDisp.textContent=currentStep; if(currentStep>=8 && currentShape!=='mandelbrot'){ ctx.clearRect(0,0,w,h); ctx.fillStyle='rgba(11,12,16,0.8)'; ctx.fillRect(0,0,w,h); ctx.fillStyle='rgba(102,252,241,0.8)'; ctx.font='13px Inter,sans-serif'; ctx.textAlign='center'; ctx.fillText(`Heavy computation... Rendering step ${currentStep}`,w/2,h/2); animTimeout=setTimeout(()=>{ drawFractal(currentStep); animTimeout=setTimeout(nextFrame,1200); },100); } else{ drawFractal(currentStep); animTimeout=setTimeout(nextFrame,500); } } animTimeout=setTimeout(nextFrame,500); } });
        drawFractal(0);
    })();
    
    // ===== TRANSFORM CALCULATOR =====
    (function() {
        const btn = document.getElementById('calcTransformBtn');
        if (btn) {
            btn.addEventListener('click', () => {
                const cx = parseFloat(document.getElementById('calcX').value) || 0;
                const cy = parseFloat(document.getElementById('calcY').value) || 0;
                const transf = document.getElementById('calcTransform').value;
                
                let xNext = 0, yNext = 0;
                
                if (transf === 'f1') {
                    xNext = 0;
                    yNext = 0.16 * cy;
                } else if (transf === 'f2') {
                    xNext = 0.85 * cx + 0.04 * cy;
                    yNext = -0.04 * cx + 0.85 * cy + 1.6;
                } else if (transf === 'f3') {
                    xNext = 0.2 * cx - 0.26 * cy;
                    yNext = 0.23 * cx + 0.22 * cy + 1.6;
                } else if (transf === 'f4') {
                    xNext = -0.15 * cx + 0.28 * cy;
                    yNext = 0.26 * cx + 0.24 * cy + 0.44;
                }
                
                const resultDiv = document.getElementById('calcResult');
                if (resultDiv) {
                    resultDiv.innerHTML = `Mapped Result: <span style="color:#2ed573; font-weight:bold;">[X': ${xNext.toFixed(3)}, Y': ${yNext.toFixed(3)}]</span>`;
                }
            });
        }
    })();

    // ===== FRACTAL LABORATORY (MANDELBROT & JULIA) =====
    (function() {
        const mCanvas = document.getElementById('labMandelbrot'), jCanvas = document.getElementById('labJulia');
        if(!mCanvas || !jCanvas) return;
        const mCtx = mCanvas.getContext('2d'), jCtx = jCanvas.getContext('2d'), cValText = document.getElementById('lab-c-val');
        const mw = mCanvas.width, mh = mCanvas.height, jw = jCanvas.width, jh = jCanvas.height;
        let currentC_R = -0.7, currentC_I = 0.27015;
        
        function drawLabMandelbrot(){
            const id = mCtx.createImageData(mw,mh), d = id.data, zoom = 1.2, cx = -0.5, cy = 0, maxIter = 80;
            for(let py=0; py<mh; py++) for(let px=0; px<mw; px++){
                const cR = cx + (px - mw/2) / (mw/4) / zoom, cI = cy + (py - mh/2) / (mh/4) / zoom;
                let zR=0, zI=0, i=0;
                while(zR*zR + zI*zI < 4 && i < maxIter){ const t = zR*zR - zI*zI + cR; zI = 2*zR*zI + cI; zR = t; i++; }
                const idx = (py*mw + px) * 4;
                if(i === maxIter){ d[idx]=11; d[idx+1]=12; d[idx+2]=16; d[idx+3]=255; }
                else{ const t = i/maxIter, s = Math.sqrt(t); d[idx]=Math.floor(9+50*s); d[idx+1]=Math.floor(20+180*t*t); d[idx+2]=Math.floor(60+230*s); d[idx+3]=255; }
            }
            mCtx.putImageData(id, 0, 0);
        }
        
        function drawLabJulia(cR, cI){
            const id = jCtx.createImageData(jw,jh), d = id.data, zoom = 1.1, maxIter = 100;
            for(let py=0; py<jh; py++) for(let px=0; px<jw; px++){
                let zR = ((px/jw) - 0.5) * 3 / zoom, zI = ((py/jh) - 0.5) * 3 / zoom, i=0;
                while(zR*zR + zI*zI < 4 && i < maxIter){ const t = zR*zR - zI*zI + cR; zI = 2*zR*zI + cI; zR = t; i++; }
                const idx = (py*jw + px) * 4;
                if(i === maxIter){ d[idx]=11; d[idx+1]=12; d[idx+2]=16; d[idx+3]=255; }
                else{ const t = i/maxIter, s = Math.sqrt(t); d[idx]=Math.floor(20+82*t); d[idx+1]=Math.floor(150+102*s); d[idx+2]=Math.floor(140+101*s); d[idx+3]=255; }
            }
            jCtx.putImageData(id, 0, 0);
            const sign = cI >= 0 ? "+" : "-"; 
            cValText.textContent = `c = ${cR.toFixed(4)} ${sign} ${Math.abs(cI).toFixed(4)}i`;
        }
        
        mCanvas.addEventListener('click', function(e){
            const rect = mCanvas.getBoundingClientRect();
            const scaleX = mCanvas.width / rect.width;
            const scaleY = mCanvas.height / rect.height;
            const canvasX = (e.clientX - rect.left) * scaleX;
            const canvasY = (e.clientY - rect.top) * scaleY;
            const zoom=1.2, cx=-0.5, cy=0;
            currentC_R = cx + (canvasX - mCanvas.width/2) / (mCanvas.width/4) / zoom;
            currentC_I = cy + (canvasY - mCanvas.height/2) / (mCanvas.height/4) / zoom;
            
            drawLabJulia(currentC_R, currentC_I);
            drawLabMandelbrot();
            
            mCtx.strokeStyle = '#ff4757'; 
            mCtx.lineWidth = 2.5; 
            mCtx.beginPath(); 
            mCtx.arc(canvasX, canvasY, 4, 0, 2*Math.PI); 
            mCtx.stroke();
        });
        
setTimeout(() => { 
            drawLabMandelbrot(); 
            drawLabJulia(currentC_R, currentC_I); 
            const zoom = 1.2, cx = -0.5, cy = 0;
            const initX = (currentC_R - cx) * (mw/4) * zoom + mw/2;
            const initY = (currentC_I - cy) * (mh/4) * zoom + mh/2;
            mCtx.strokeStyle = '#ff4757'; 
            mCtx.lineWidth = 2.5; 
            mCtx.beginPath(); 
            mCtx.arc(initX, initY, 4, 0, 2*Math.PI); 
            mCtx.stroke();
        }, 300);
    })();
    // ===== INTERACTIVE NEWTON FRACTAL (Z³ - 1 = 0) + LIVE CALCULATION =====
    (function() {
        const c = document.getElementById('newtonCanvas');
        const logBox = document.getElementById('newton-log');
        const resetBtn = document.getElementById('newton-reset');
        if(!c || !logBox) return;
        
        const ctx = c.getContext('2d');
        const w = c.width, h = c.height;
        const id = ctx.createImageData(w, h), d = id.data;
        
        // Renk Paleti (Cyan, Turuncu, Kırmızı) ve Hex karşılıkları (Log için)
        const colors = [ [102, 252, 241], [255, 165, 2], [255, 71, 87] ];
        const hexColors = [ "#66fcf1", "#ffa502", "#ff4757" ];
        const roots = [ {r: 1, i: 0}, {r: -0.5, i: Math.sqrt(3)/2}, {r: -0.5, i: -Math.sqrt(3)/2} ];
        
        const maxIter = 40;
        const tol = 1e-6;
        let baseImage = null;
        
        function computeFractal() {
            // Arka planı hesapla ve boya
            for(let y = 0; y < h; y++) {
                for(let x = 0; x < w; x++) {
                    let zR = (x / w - 0.5) * 3.5, zI = (0.5 - y / h) * 3.5; 
                    let iter = 0, rootIdx = -1;
                    
                    for(; iter < maxIter; iter++) {
                        const zR2 = zR * zR, zI2 = zI * zI;
                        if(zR2 + zI2 < tol) break;
                        const zR3 = zR * (zR2 - 3*zI2) - 1, zI3 = zI * (3*zR2 - zI2);
                        const dfR = 3*(zR2 - zI2), dfI = 6*zR*zI;
                        const dfMag2 = dfR*dfR + dfI*dfI;
                        if(dfMag2 < tol) break;
                        
                        const inv = 1 / dfMag2;
                        zR -= (zR3*dfR + zI3*dfI) * inv; zI -= (zI3*dfR - zR3*dfI) * inv;
                        
                        for(let k = 0; k < 3; k++) {
                            const dR = zR - roots[k].r, dI = zI - roots[k].i;
                            if(dR*dR + dI*dI < 0.001) { rootIdx = k; break; }
                        }
                        if(rootIdx !== -1) break;
                    }
                    
                    const idx = (y * w + x) * 4;
                    if(rootIdx !== -1) {
                        const shade = 1.0 - (iter / maxIter) * 0.7;
                        const col = colors[rootIdx];
                        d[idx] = col[0] * shade; d[idx+1] = col[1] * shade; d[idx+2] = col[2] * shade; d[idx+3] = 255;
                    } else {
                        d[idx] = 11; d[idx+1] = 12; d[idx+2] = 16; d[idx+3] = 255;
                    }
                }
            }
            ctx.putImageData(id, 0, 0);

            // 3 Ana Kökü (Root) Belirgin Beyaz Noktalarla İşaretle
            roots.forEach(root => {
                let px = (root.r / 3.5 + 0.5) * w;
                let py = (0.5 - root.i / 3.5) * h;
                ctx.beginPath(); ctx.arc(px, py, 6, 0, Math.PI*2);
                ctx.fillStyle = '#ffffff'; ctx.fill();
                ctx.lineWidth = 2; ctx.strokeStyle = '#000000'; ctx.stroke();
            });

            baseImage = ctx.getImageData(0, 0, w, h);
        }

        const observer = new IntersectionObserver(entries => {
            if(entries[0].isIntersecting) { computeFractal(); observer.disconnect(); }
        });
        observer.observe(c);

        // Reset Butonu İşlevi
        if(resetBtn) {
            resetBtn.addEventListener('click', () => {
                if(baseImage) ctx.putImageData(baseImage, 0, 0);
                logBox.innerHTML = '<span style="color:var(--text-muted);">[System Reset]</span> Awaiting new input...';
            });
        }

        // Tıklama ile Canlı Newton İterasyonu
        c.addEventListener('click', (e) => {
            if(!baseImage) return;
            const rect = c.getBoundingClientRect();
            const scaleX = w / rect.width, scaleY = h / rect.height;
            const mx = (e.clientX - rect.left) * scaleX, my = (e.clientY - rect.top) * scaleY;
            
            ctx.putImageData(baseImage, 0, 0); // Eski çizgileri temizle, ana ekrana dön
            
            let zR = (mx / w - 0.5) * 3.5, zI = (0.5 - my / h) * 3.5;
            
            ctx.beginPath(); ctx.moveTo(mx, my);
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5;
            ctx.shadowColor = '#000'; ctx.shadowBlur = 4;
            
            // Log ekranı başlangıç metni
            let logHtml = `<div style="color:#fff; border-bottom:1px dashed rgba(102,252,241,0.3); padding-bottom:5px; margin-bottom:5px;">
                <strong>Input:</strong> z₀ = ${zR.toFixed(3)} ${zI>=0?'+':''}${zI.toFixed(3)}i
            </div>`;
            
            let convergedRoot = -1;
            let stepCount = 0;

            for(let i = 0; i < 25; i++) {
                const zR2 = zR*zR, zI2 = zI*zI;
                const zR3 = zR*(zR2 - 3*zI2) - 1, zI3 = zI*(3*zR2 - zI2);
                const dfR = 3*(zR2 - zI2), dfI = 6*zR*zI;
                const dfMag2 = dfR*dfR + dfI*dfI;
                if(dfMag2 < 1e-10) break;
                
                const inv = 1/dfMag2;
                zR -= (zR3*dfR + zI3*dfI)*inv; zI -= (zI3*dfR - zR3*dfI)*inv;
                
                const px = (zR / 3.5 + 0.5) * w, py = (0.5 - zI / 3.5) * h;
                ctx.lineTo(px, py);
                ctx.fillStyle = '#ffffff'; ctx.fillRect(px-2, py-2, 4, 4);
                
                stepCount++;
                // Sadece ilk 5 adımı log'a yazdır (çok kalabalık olmasın)
                if(i < 5) {
                    logHtml += `<div style="color:var(--text-secondary);">↳ Step ${i+1}: z = ${zR.toFixed(3)} ${zI>=0?'+':''}${zI.toFixed(3)}i</div>`;
                } else if(i === 5) {
                    logHtml += `<div style="color:var(--text-muted);">↳ ... iterating ...</div>`;
                }

                for(let k=0; k<3; k++) {
                    if(Math.hypot(zR-roots[k].r, zI-roots[k].i) < 0.005) { convergedRoot = k; break; }
                }
                if(convergedRoot !== -1) break;
            }
            ctx.stroke(); ctx.shadowBlur = 0;

            // Sonucu Log'a Ekle
            if(convergedRoot !== -1) {
                logHtml += `<div style="margin-top:8px; padding:6px; background:rgba(0,0,0,0.5); border-radius:4px; color:${hexColors[convergedRoot]}; font-weight:bold;">
                    ✓ Converged to Root ${convergedRoot + 1} in ${stepCount} steps!
                </div>`;
            } else {
                logHtml += `<div style="margin-top:8px; color:#ff4757;">❌ Failed to converge within limit.</div>`;
            }

            logBox.innerHTML = logHtml;
            // Scroll'u en aşağı kaydır
            logBox.scrollTop = logBox.scrollHeight;
        });
    })();
    // ===== STATS COUNTER =====
    (function() {
        const counters=document.querySelectorAll('.stat-number[data-target]'); let done=false;
        function anim(){ if(done) return; done=true; counters.forEach(c=>{ const target=parseInt(c.dataset.target), dur=2000, start=performance.now(); (function up(now){ const p=Math.min((now-start)/dur,1), e=1-Math.pow(1-p,3); c.textContent=Math.floor(target*e).toLocaleString(); if(p<1) requestAnimationFrame(up); else c.textContent=target.toLocaleString(); })(performance.now()); }); }
        const so=new IntersectionObserver(es=>{if(es[0].isIntersecting)anim();},{threshold:0.3}); const sg=document.querySelector('.stats-grid'); if(sg) so.observe(sg);
    })();

    // ===== FRACTAL AUDIO LAB =====
    (function() {
        let audioCtx = null, oscillator = null, gainNode = null, isPlaying = false;
        const playBtn = document.getElementById('playBtn'), pauseBtn = document.getElementById('pauseBtn');
        const selector = document.getElementById('fractalSelector'), status = document.getElementById('playing-status');
        if(!playBtn) return;
        function stopSound() {
            if (!isPlaying) return;
            if (gainNode && audioCtx) {
                gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1);
                setTimeout(() => { if (oscillator) oscillator.stop(); if (audioCtx) audioCtx.close(); audioCtx = null; }, 1000);
            }
            isPlaying = false; status.innerText = "Fade Out... Stopped";
        }
        function startSound() {
            if (isPlaying) stopSound(); 
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            oscillator = audioCtx.createOscillator(); gainNode = audioCtx.createGain();
            const type = selector.value;
            status.innerText = `Harmonizing: ${type.toUpperCase()}`;
            const profiles = {
                buddhabrot: { freq: 108, type: 'sine' }, mandelbrot: { freq: 110, type: 'sine' },
                sierpinski: { freq: 440, type: 'triangle' }, koch: { freq: 330, type: 'sine' },
                fern: { freq: 220, type: 'sawtooth' }, dragon: { freq: 550, type: 'triangle' }
            };
            const config = profiles[type];
            oscillator.frequency.value = config.freq; oscillator.type = config.type;
            oscillator.connect(gainNode); gainNode.connect(audioCtx.destination);
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 1.5);
            oscillator.start(); isPlaying = true;
        }
        selector.addEventListener('change', () => { if(isPlaying) startSound(); });
        playBtn.addEventListener('click', startSound); pauseBtn.addEventListener('click', stopSound);
    })();

    // ===== FRACTAL DIMENSION CALCULATOR + ANIMATION =====
    (function() {
        const canvas = document.getElementById('fd-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d'), select = document.getElementById('fd-select');
        const calcBtn = document.getElementById('fd-calc-btn'), animateBtn = document.getElementById('fd-animate-btn');
        const resultSpan = document.getElementById('fd-value'), qualitySpan = document.getElementById('fd-quality');
        const logDiv = document.getElementById('fd-log-log'), animStatus = document.getElementById('fd-animation-status');
        const w = canvas.width, h = canvas.height;
        function drawSierpinski() {
            ctx.clearRect(0, 0, w, h); ctx.fillStyle = '#1a1c23'; ctx.fillRect(0, 0, w, h); ctx.fillStyle = '#66fcf1';
            function drawTriangle(x1,y1,x2,y2,x3,y3,depth){
                if(depth===0){ ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.lineTo(x3,y3); ctx.fill(); return; }
                const mx1=(x1+x2)/2, my1=(y1+y2)/2, mx2=(x2+x3)/2, my2=(y2+y3)/2, mx3=(x3+x1)/2, my3=(y3+y1)/2;
                drawTriangle(x1,y1,mx1,my1,mx3,my3,depth-1); drawTriangle(mx1,my1,x2,y2,mx2,my2,depth-1); drawTriangle(mx3,my3,mx2,my2,x3,y3,depth-1);
            }
            drawTriangle(0, h, w/2, 0, w, h, 6);
        }
        function drawKochCurve() {
            ctx.clearRect(0,0,w,h); ctx.fillStyle='#1a1c23'; ctx.fillRect(0,0,w,h); ctx.strokeStyle='#66fcf1'; ctx.lineWidth=2;
            function koch(p1,p2,depth){
                if(depth===0){ ctx.beginPath(); ctx.moveTo(p1[0],p1[1]); ctx.lineTo(p2[0],p2[1]); ctx.stroke(); return; }
                const dx=p2[0]-p1[0], dy=p2[1]-p1[1];
                const a=[p1[0]+dx/3, p1[1]+dy/3], b=[p1[0]+2*dx/3, p1[1]+2*dy/3]; const angle=-Math.PI/3;
                const peak=[ a[0]+(b[0]-a[0])*Math.cos(angle)-(b[1]-a[1])*Math.sin(angle), a[1]+(b[0]-a[0])*Math.sin(angle)+(b[1]-a[1])*Math.cos(angle) ];
                koch(p1,a,depth-1); koch(a,peak,depth-1); koch(peak,b,depth-1); koch(b,p2,depth-1);
            }
            koch([50,h-50],[w-50,h-50],5);
        }
        function drawFern() {
            ctx.clearRect(0,0,w,h); ctx.fillStyle='#1a1c23'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#66fcf1';
            let x=0,y=0;
            for(let i=0;i<120000;i++){
                const r=Math.random(); let nx,ny;
                if(r<0.01){ nx=0; ny=0.16*y; } else if(r<0.86){ nx=0.85*x+0.04*y; ny=-0.04*x+0.85*y+1.6; } else if(r<0.93){ nx=0.2*x-0.26*y; ny=0.23*x+0.22*y+1.6; } else{ nx=-0.15*x+0.28*y; ny=0.26*x+0.24*y+0.44; }
                x=nx; y=ny; const px=Math.floor(w/2+x*45), py=Math.floor(h-10-y*40);
                if(px>=0 && px<w && py>=0 && py<h) ctx.fillRect(px,py,1,1);
            }
        }
        function drawCarpet() {
            ctx.clearRect(0,0,w,h); ctx.fillStyle='#1a1c23'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#66fcf1';
            function drawSquare(x,y,size,depth){
                if(depth===0){ ctx.fillRect(x,y,size,size); return; }
                const newSize=size/3;
                for(let i=0;i<3;i++) for(let j=0;j<3;j++) if(!(i===1&&j===1)) drawSquare(x+i*newSize,y+j*newSize,newSize,depth-1);
            }
            const side=Math.min(w,h)-40, startX=(w-side)/2, startY=(h-side)/2; drawSquare(startX,startY,side,4);
        }
        function drawDragon() {
            ctx.clearRect(0,0,w,h); ctx.fillStyle='#1a1c23'; ctx.fillRect(0,0,w,h); ctx.strokeStyle='#66fcf1'; ctx.lineWidth=1.5;
            let points=[[0,0],[1,0]];
            for(let iter=0;iter<12;iter++){
                const newPoints=[];
                for(let i=0;i<points.length-1;i++){
                    const p1=points[i], p2=points[i+1];
                    const dx=p2[0]-p1[0], dy=p2[1]-p1[1];
                    const mid=[p1[0]+dx/2, p1[1]+dy/2], perp=[-dy/2, dx/2];
                    if(i%2===0) newPoints.push(p1, [mid[0]+perp[0], mid[1]+perp[1]]); else newPoints.push(p1, [mid[0]-perp[0], mid[1]-perp[1]]);
                }
                newPoints.push(points[points.length-1]); points=newPoints;
            }
            let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
            points.forEach(p=>{ minX=Math.min(minX,p[0]); maxX=Math.max(maxX,p[0]); minY=Math.min(minY,p[1]); maxY=Math.max(maxY,p[1]); });
            const scaleX=(w-80)/(maxX-minX), scaleY=(h-80)/(maxY-minY), scale=Math.min(scaleX,scaleY);
            const offsetX=(w-(maxX-minX)*scale)/2, offsetY=(h-(maxY-minY)*scale)/2;
            ctx.beginPath(); points.forEach((p,idx)=>{ const x=offsetX+(p[0]-minX)*scale, y=offsetY+(p[1]-minY)*scale; if(idx===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); }); ctx.stroke();
        }
        function drawCantor() {
            ctx.clearRect(0,0,w,h); ctx.fillStyle='#1a1c23'; ctx.fillRect(0,0,w,h); ctx.fillStyle='#66fcf1';
            const margin=50, yStart=h/2-40;
            function drawLine(x,y,len,depth){
                if(depth===0||len<2){ ctx.fillRect(x,y,len,6); return; }
                const newLen=len/3; drawLine(x,y,newLen,depth-1); drawLine(x+2*newLen,y,newLen,depth-1);
            }
            drawLine(margin,yStart,w-2*margin,6);
        }
        function simpleBoxCounting(binary, boxSize){
            let boxes=0;
            for(let y=0;y<h;y+=boxSize) for(let x=0;x<w;x+=boxSize){
                let occupied=false;
                outer: for(let dy=0;dy<boxSize;dy++){ const yy=y+dy; if(yy>=h) break; for(let dx=0;dx<boxSize;dx++){ const xx=x+dx; if(xx>=w) break; if(binary[yy*w+xx]===255){ occupied=true; break outer; } } }
                if(occupied) boxes++;
            }
            return boxes;
        }
        function drawGridAndBoxes(binary, boxSize){
            updatePreview(); ctx.save(); ctx.strokeStyle='rgba(255,255,255,0.3)'; ctx.lineWidth=1;
            for(let y=0;y<h;y+=boxSize){ ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
            for(let x=0;x<w;x+=boxSize){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
            let boxCount=0;
            for(let y=0;y<h;y+=boxSize) for(let x=0;x<w;x+=boxSize){
                let occupied=false;
                outer: for(let dy=0;dy<boxSize;dy++){ const yy=y+dy; if(yy>=h) break; for(let dx=0;dx<boxSize;dx++){ const xx=x+dx; if(xx>=w) break; if(binary[yy*w+xx]===255){ occupied=true; break outer; } } }
                if(occupied){ ctx.fillStyle='rgba(255,165,0,0.25)'; ctx.fillRect(x,y,boxSize,boxSize); boxCount++; }
            }
            ctx.restore(); return boxCount;
        }
        function computeDimension(){
            const imgData=ctx.getImageData(0,0,w,h), data=imgData.data, binary=new Uint8ClampedArray(w*h);
            for(let i=0;i<w*h;i++){ const r=data[i*4], g=data[i*4+1], b=data[i*4+2]; binary[i]=(r>50||g>50||b>50)?255:0; }
            const boxSizes=[2,4,8,16,32,64,128], counts=[];
            for(let sz of boxSizes) counts.push(simpleBoxCounting(binary,sz));
            let sumX=0,sumY=0,sumXY=0,sumX2=0,n=0;
            for(let i=0;i<boxSizes.length;i++){ const eps=boxSizes[i], N=counts[i]; if(N===0) continue; const logEps=Math.log(1/eps), logN=Math.log(N); sumX+=logEps; sumY+=logN; sumXY+=logEps*logN; sumX2+=logEps*logEps; n++; }
            const D=(n*sumXY-sumX*sumY)/(n*sumX2-sumX*sumX);
            resultSpan.textContent=D.toFixed(4);
            let expected=0; const selected=select.value;
            switch(selected){ case"sierpinski":expected=1.585; break; case"koch":expected=1.262; break; case"fern":expected=1.900; break; case"carpet":expected=1.893; break; case"dragon":expected=1.523; break; case"cantor":expected=0.631; break; }
            const error=Math.abs(D-expected);
            if(error<0.05) qualitySpan.textContent=`✓ Excellent match! (Theoretical ${expected.toFixed(3)})`;
            else if(error<0.12) qualitySpan.textContent=`✓ Good approximation (Theoretical ${expected.toFixed(3)}). Small deviation due to grid resolution.`;
            else qualitySpan.textContent=`✓ Reasonable estimate (Theoretical ${expected.toFixed(3)}). Increase canvas size for better accuracy.`;
            let logText="Log calculations: \n";
            for(let i=0;i<boxSizes.length;i++) if(counts[i]>0) logText+=`[1/${boxSizes[i]}] → N:${counts[i]}\n`;
            logDiv.innerText=logText;
        }
        function updatePreview(){
            const val=select.value;
            switch(val){ case"sierpinski": drawSierpinski(); break; case"koch": drawKochCurve(); break; case"fern": drawFern(); break; case"carpet": drawCarpet(); break; case"dragon": drawDragon(); break; case"cantor": drawCantor(); break; }
            computeDimension();
        }
        let animationActive = false, isPaused = false;
        async function animateBoxCounting() {
            if (animationActive && !isPaused) {
                isPaused = true; animateBtn.textContent = '▶ Resume'; animateBtn.style.background = '#ffa502'; animateBtn.style.color = '#0b0c10'; animStatus.textContent = 'Animation paused...'; return;
            }
            if (isPaused) {
                isPaused = false; animateBtn.textContent = '⏹ Pause'; animateBtn.style.background = '#ff4757'; animateBtn.style.color = '#fff'; animStatus.textContent = 'Resuming...'; return;
            }
            animationActive = true; isPaused = false;
            animateBtn.textContent = '⏹ Pause'; animateBtn.style.background = '#ff4757'; animateBtn.style.color = '#fff'; animStatus.textContent = 'Starting animation...';
            updatePreview();
            const imgData = ctx.getImageData(0,0,w,h), data = imgData.data, binary = new Uint8ClampedArray(w*h);
            for(let i=0; i<w*h; i++){ const r=data[i*4], g=data[i*4+1], b=data[i*4+2]; binary[i] = (r>50 || g>50 || b>50) ? 255 : 0; }
            const boxSizes = [128, 64, 32, 16, 8, 4, 2], counts = [];
            for (let idx = 0; idx < boxSizes.length; idx++) {
                while (isPaused) await new Promise(r => setTimeout(r, 100));
                const size = boxSizes[idx];
                animStatus.textContent = `Grid size: ${size}px — counting boxes...`;
                updatePreview(); const boxCount = drawGridAndBoxes(binary, size); counts.push(boxCount);
                const logEps = Math.log(1/size).toFixed(2), logN = Math.log(boxCount).toFixed(2);
                animStatus.innerHTML = `Grid: ${size}px | Boxes: ${boxCount} | log(1/ε)=${logEps} | log(N)=${logN}`;
                await new Promise(r => setTimeout(r, 1200));
            }
            animStatus.innerHTML = 'Animation completed. Computing final dimension...';
            computeDimension(); animStatus.innerHTML = '✓ Animation done. Dimension updated above.';
            animationActive = false; animateBtn.textContent = '▶ Animate Box-Counting'; animateBtn.style.background = '#ffa502'; animateBtn.style.color = '#0b0c10'; updatePreview();
        }
        select.addEventListener('change',updatePreview); calcBtn.addEventListener('click',computeDimension);
        if(animateBtn) animateBtn.addEventListener('click',animateBoxCounting);
        updatePreview();
    })();

    // ===== L-SYSTEM GENERATOR & PNG EXPORT ENGINE =====
    (function() {
        const canvas = document.getElementById('lsysCanvas');
        if(!canvas) return;
        const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
        const presetSelect = document.getElementById('lsysPreset'), inpAxiom = document.getElementById('lsysAxiom'), inpRule1 = document.getElementById('lsysRule1'), inpRule2 = document.getElementById('lsysRule2'), inpAngle = document.getElementById('lsysAngle'), inpIter = document.getElementById('lsysIter'), btnDraw = document.getElementById('lsysDrawBtn'), btnExport = document.getElementById('lsysExportBtn'), statusDiv = document.getElementById('lsysStatus');
        const presets = {
            plant: { a: "X", r1: "X=F+[[X]-X]-F[-FX]+X", r2: "F=FF", ang: 25, it: 6 }, dragon: { a: "FX", r1: "X=X+YF+", r2: "Y=-FX-Y", ang: 90, it: 10 },
            sierpinski: { a: "YF", r1: "X=YF+XF+Y", r2: "Y=XF-YF-X", ang: 60, it: 6 }, koch: { a: "F", r1: "F=F+F-F-F+F", r2: "", ang: 90, it: 4 },
            tree: { a: "F", r1: "F=FF-[-F+F+F]+[+F-F-F]", r2: "", ang: 22.5, it: 4 }
        };
        function loadPreset(key) { const p = presets[key]; if(!p) return; inpAxiom.value = p.a; inpRule1.value = p.r1; inpRule2.value = p.r2; inpAngle.value = p.ang; inpIter.value = p.it; generateAndDraw(); }
        presetSelect.addEventListener('change', (e) => { if(e.target.value !== 'custom') loadPreset(e.target.value); });
        function parseRules() { let rules = {}; const r1 = inpRule1.value.split('='); if(r1.length === 2) rules[r1[0].trim()] = r1[1].trim(); const r2 = inpRule2.value.split('='); if(r2.length === 2) rules[r2[0].trim()] = r2[1].trim(); return rules; }
        function generateAndDraw() {
            statusDiv.textContent = "Computing grammar..."; btnDraw.textContent = "⏳ Processing...";
            setTimeout(() => {
                let sentence = inpAxiom.value; const rules = parseRules(), iters = Math.min(parseInt(inpIter.value) || 1, 10), angle = (parseFloat(inpAngle.value) || 0) * Math.PI / 180;
                for(let i=0; i<iters; i++) { let next = ""; for(let char of sentence) { next += rules[char] || char; } sentence = next; }
                statusDiv.textContent = `Drawing ${sentence.length.toLocaleString()} segments...`;
                let x=0, y=0, dir = -Math.PI/2, minX=0, maxX=0, minY=0, maxY=0, stack = [];
                for(let c of sentence) {
                    if(c === 'F' || c === 'G') { x += Math.cos(dir); y += Math.sin(dir); minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y); }
                    else if(c === '+') dir += angle; else if(c === '-') dir -= angle; else if(c === '[') stack.push({x,y,dir}); else if(c === ']') { let st = stack.pop(); x=st.x; y=st.y; dir=st.dir; }
                }
                const margin = 40, scale = Math.min((w - margin*2) / (maxX - minX || 1), (h - margin*2) / (maxY - minY || 1));
                const offsetX = (w - (maxX - minX)*scale)/2 - minX*scale, offsetY = (h - (maxY - minY)*scale)/2 - minY*scale;
                ctx.fillStyle = '#0b0c10'; ctx.fillRect(0, 0, w, h); ctx.strokeStyle = '#66fcf1'; ctx.lineWidth = iters > 6 ? 0.8 : (iters > 4 ? 1.2 : 2); ctx.lineCap = 'round';
                ctx.shadowColor = 'rgba(102,252,241,0.5)'; ctx.shadowBlur = iters > 6 ? 0 : 5;
                x = 0; y = 0; dir = -Math.PI/2; stack = []; ctx.beginPath(); ctx.moveTo(offsetX + x*scale, offsetY + y*scale);
                for(let c of sentence) {
                    if(c === 'F' || c === 'G') { x += Math.cos(dir); y += Math.sin(dir); ctx.lineTo(offsetX + x*scale, offsetY + y*scale); }
                    else if(c === '+') dir += angle; else if(c === '-') dir -= angle; else if(c === '[') stack.push({x,y,dir}); else if(c === ']') { let st = stack.pop(); x=st.x; y=st.y; dir=st.dir; ctx.moveTo(offsetX + x*scale, offsetY + y*scale); }
                }
                ctx.stroke(); ctx.shadowBlur = 0; btnDraw.textContent = "⚙️ Generate L-System"; statusDiv.textContent = `✓ Rendered perfectly. Axiom depth: ${iters}, Lines: ${sentence.length.toLocaleString()}`;
            }, 50);
        }
        btnExport.addEventListener('click', () => {
            const link = document.createElement('a'); link.download = `Fractal_LSystem_${inpIter.value}Iters.png`; link.href = canvas.toDataURL('image/png'); link.click();
            const originalText = btnExport.innerHTML; btnExport.innerHTML = "✅ Downloaded Successfully!"; btnExport.style.background = "rgba(46, 213, 115, 0.2)"; btnExport.style.color = "#2ed573"; btnExport.style.borderColor = "#2ed573";
            setTimeout(() => { btnExport.innerHTML = originalText; btnExport.style.background = "rgba(102,252,241,0.1)"; btnExport.style.color = "var(--accent-cyan)"; btnExport.style.borderColor = "var(--accent-cyan)"; }, 2000);
        });
        btnDraw.addEventListener('click', generateAndDraw); setTimeout(generateAndDraw, 800);
    })();

   // ===== FRACTAL GALLERY (LOCAL IMAGES - 4x2) =====
    (function() {
        const container = document.getElementById('gallery-container');
        if (!container) return;

   
       
      // ===== FRACTAL GALLERY (LOCAL IMAGES - EXACT CONTENT MATCH) =====
        const galleries = {
            nature: [
                { title: "Lightning Branches", img: "images/nature1.jpeg", desc: "Dielectric breakdown fractal patterns" },
                { title: "Romanesco Broccoli", img: "images/nature2.jpg", desc: "Logarithmic spiral phyllotaxis in nature" },
                { title: "River Delta Networks", img: "images/nature3.jpg", desc: "Recursive branching in hydrology" },
                { title: "Spiral Galaxies", img: "images/nature4.jpg", desc: "Logarithmic spiral arms in galaxies" },
                { title: "Peacock Feathers", img: "images/nature5.jpg", desc: "Eye-spot patterns with microscopic self-similarity" },
                { title: "Human Lungs", img: "images/nature6.jpg", desc: "Fractal branching of human alveoli networks" },
                { title: "Ice Snowflakes", img: "images/nature7.jpg", desc: "Dendritic crystal growth patterns" },
                { title: "Nautilus Shell", img: "images/nature8.jpg", desc: "Logarithmic golden spiral expansion" }
            ],
            famous: [
                { title: "Cantor Dust Set", img: "images/famous1.png", desc: "Recursive middle-third removal boundary" },
                { title: "Mandelbrot Set", img: "images/famous2.jpg", desc: "z² + c iteration boundary map (D = 2)" },
                { title: "Sierpiński Carpet", img: "images/famous3.jpg", desc: "Recursive square removal plane (D ≈ 1.893)" },
                { title: "Lorenz Attractor (Chaos)", img: "images/famous4.jpg", desc: "Non-linear dynamical system strange attractor" },
                { title: "Barnsley Fern", img: "images/famous5.jpg", desc: "4-affine IFS generating biological form" },
                { title: "Mandelbulb (3D)", img: "images/famous6.jpg", desc: "3D extension of Mandelbrot in ℝ³" },
                { title: "Menger Sponge", img: "images/famous7.jpg", desc: "Infinite surface area with zero volume in 3D" },
                { title: "Sierpiński Triangle", img: "images/famous8.png", desc: "Fractal triangle with log(3)/log(2) ≈ 1.585 dimension" }
            ]
        };
    

        function renderGallery(type) {
            const items = galleries[type] || galleries.nature;
            container.innerHTML = '';
            items.forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'gallery-item reveal';
                card.style.transitionDelay = `${index * 0.05}s`;
                card.innerHTML = `
                    <div class="gallery-img-wrap">
                        <img src="${item.img}" alt="${item.title}" loading="lazy">
                        <div class="gallery-overlay"></div>
                    </div>
                    <div class="gallery-caption">
                        <strong>${item.title}</strong>
                        <span class="gallery-desc">${item.desc}</span>
                    </div>
                `;
                container.appendChild(card);
                requestAnimationFrame(() => card.classList.add('visible'));
            });
        }

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderGallery(btn.dataset.gallery);
            });
        });
        renderGallery('nature');
    })();

    // ===== REFERENCES ACCORDION =====
    (function() {
        const toggle = document.getElementById('references-toggle');
        const content = document.getElementById('references-content');
        if (!toggle || !content) return;

        toggle.addEventListener('click', () => {
            const isOpen = content.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
    })();
   // ===== LIVE SEARCH & GUIDED LEARNING ENGINE =====
    (function() {
        // ==========================================
        // 1. LIVE SEARCH LOGIC (Arama Motoru)
        // ==========================================
        const searchInput = document.getElementById('conceptSearch');
        const searchResults = document.getElementById('searchResults');
        
        const dictionary = [
            { k: "Eigenvalue & Eigenvector", t: "math-background" },
            { k: "Iterated Function Systems (IFS)", t: "math-background" },
            { k: "Mandelbrot & Julia Sets", t: "famous-problems" },
            { k: "Barnsley Fern", t: "barnsley-fern" },
            { k: "Sierpiński Triangle", t: "famous-problems" },
            { k: "Koch Snowflake", t: "koch-snowflake" },
            { k: "L-System (Lindenmayer)", t: "lsystem-lab" },
            { k: "Fractal Dimension (Box-Counting)", t: "fractal-dimension" },
            { k: "Coastline Paradox", t: "famous-problems" },
            { k: "Audio Sonification", t: "audio-lab" }
        ];

        if(searchInput && searchResults) {
            searchInput.addEventListener('input', (e) => {
                const val = e.target.value.toLowerCase().trim();
                searchResults.innerHTML = '';
                if(val.length < 2) { searchResults.classList.remove('active'); return; }
                
                const matches = dictionary.filter(item => item.k.toLowerCase().includes(val));
                
                if(matches.length > 0) {
                    matches.forEach(match => {
                        const div = document.createElement('div');
                        div.className = 'search-item';
                        div.innerHTML = `<span style="color:var(--accent-teal);">⚲</span> ${match.k}`;
                        div.addEventListener('click', () => {
                            const section = document.getElementById(match.t);
                            if(section) {
                                section.scrollIntoView({ behavior: 'smooth' });
                                searchInput.value = ''; searchResults.classList.remove('active');
                            }
                        });
                        searchResults.appendChild(div);
                    });
                    searchResults.classList.add('active');
                }
            });
            // Ekranda boş bir yere tıklayınca arama menüsünü kapat
            document.addEventListener('click', (e) => {
                if(!searchInput.contains(e.target) && !searchResults.contains(e.target)) searchResults.classList.remove('active');
            });
        }

        // ==========================================
        // 2. LIGHTBOX LOGIC (Tıklayınca Büyüyen Resim)
        // ==========================================
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxCaption = document.getElementById('lightbox-caption');
        const lightboxLink = document.getElementById('lightbox-link');
        const lightboxClose = document.getElementById('lightbox-close');

        const galleryContainer = document.getElementById('gallery-container');
        
        // Event Delegation: Galerideki herhangi bir 'IMG' (resim) etiketine tıklanırsa çalışır
        if(galleryContainer && lightbox) {
            galleryContainer.addEventListener('click', function(e) {
                if(e.target.tagName === 'IMG') {
                    lightbox.classList.add('show'); // Siyah arka planı aç
                    lightboxImg.src = e.target.src; // Tıklanan resmin linkini büyüyen resme aktar
                    lightboxCaption.textContent = e.target.alt; // Resmin alt metnini başlık yap
                    if(lightboxLink) lightboxLink.href = e.target.src; // "Yeni sekmede aç" butonuna linki ver
                }
            });
        }
        
        // Kapatma tuşuna (X) veya siyah arka plana tıklayınca lightbox'ı kapat
        if(lightboxClose) lightboxClose.addEventListener('click', () => lightbox.classList.remove('show'));
        if(lightbox) lightbox.addEventListener('click', (e) => { if(e.target === lightbox) lightbox.classList.remove('show'); });


        // ==========================================
        // 3. GUIDED MODE LOGIC (Gelişmiş Eğitim Asistanı)
        // ==========================================
        const toggle = document.getElementById('guidedToggle');
        const contentBox = document.getElementById('guided-content');
        
        // Hocalara ve jüriye hitap eden, daha ciddi ve meydan okuyucu yeni metinler
        const guideSteps = {
            'timeline': { step: 1, text: "Euclidean math failed to describe nature. A cloud is not a perfect sphere.", box: "<div class='g-task'><strong>Goal:</strong><br>Understand why mathematics needed a new language for 'roughness'.</div>" },
            'math-background': { step: 2, text: "Here is the secret engine: <strong>Linear Algebra</strong>. We use Affine Transformations to map space into itself.", box: "<div class='g-task'>Pay attention to:<br>✓ Matrix A (Rotation/Scale)<br>✓ Vector b (Translation)<br>✓ Contractive mappings</div>" },
            'matrix-playground': { step: 3, text: "Now you are the creator. The shape on the right is an 'Attractor' formed by 80,000 matrix multiplications.", box: "<div class='g-challenge'><strong>Challenge:</strong><br>Set det(A) to 0 (e.g., a11=0, a22=0). What happens to the 2D shape? It collapses into a line or point!</div>" },
            'famous-problems': { step: 4, text: "Let's move from Linear to <strong>Complex Dynamics</strong> (z² + c). The Mandelbrot set acts as a map for all Julia sets.", box: "<div class='g-challenge'><strong>Challenge:</strong><br>Click the edge of the Mandelbrot map. Watch how the Julia set instantly mutates!</div>" },
            'fractal-dimension': { step: 5, text: "How do we measure a fractal? Using the Box-Counting method, we calculate the slope of log(N) vs log(1/ε).", box: "<div class='g-task'><strong>Theoretical Formula:</strong><br>D = log(N) / log(1/r).<br>For Sierpinski: D = log(3)/log(2) ≈ 1.585</div>" },
            'lsystem-lab': { step: 6, text: "Biology meets Computer Science. Formal grammars (strings of text) can be parsed to grow infinite botanical trees.", box: "<div class='g-challenge'><strong>Challenge:</strong><br>Change the Angle to 90° on the Fractal Plant. You'll see a geometric grid instead of an organic plant.</div>" }
        };

        let isGuided = false;

        if(toggle && contentBox) {
            // Şalter açılıp kapandığında
            toggle.addEventListener('change', (e) => {
                isGuided = e.target.checked;
                if(isGuided) {
                    contentBox.classList.add('active');
                    updateGuideStep(); // Şalter açılır açılmaz bulunduğun yerin metnini getir
                } else {
                    contentBox.classList.remove('active');
                }
            });

            // Kullanıcı sayfayı kaydırdıkça hangi bölümde olduğunu algılayan sensör (IntersectionObserver)
            const observer = new IntersectionObserver((entries) => {
                if(!isGuided) return;
                entries.forEach(entry => {
                    if(entry.isIntersecting && guideSteps[entry.target.id]) {
                        const data = guideSteps[entry.target.id];
                        // Ekrandaki kutunun içeriğini dinamik olarak değiştir
                        contentBox.innerHTML = `
                            <span class="g-step">Step ${data.step} / 6</span>
                            <div class="g-text">${data.text}</div>
                            ${data.box}
                            <button class="g-btn" onclick="window.scrollBy({top: 800, behavior: 'smooth'})">Continue →</button>
                        `;
                    }
                });
            }, { threshold: 0.4 }); // Bölümün en az %40'ı ekrana girdiğinde tetikle

            // Yukarıdaki sensörü tüm eğitim bölümlerine bağla
            Object.keys(guideSteps).forEach(id => {
                const el = document.getElementById(id);
                if(el) observer.observe(el);
            });

            // Sayfa yüklendiğinde kullanıcının tam olarak nerede olduğunu bulan yardımcı fonksiyon
            function updateGuideStep() {
                const sections = Object.keys(guideSteps).map(id => document.getElementById(id)).filter(el => el);
                for(let s of sections) {
                    const rect = s.getBoundingClientRect();
                    if(rect.top >= 0 && rect.top <= window.innerHeight/2) {
                        const data = guideSteps[s.id];
                        contentBox.innerHTML = `<span class="g-step">Step ${data.step} / 6</span><div class="g-text">${data.text}</div>${data.box}<button class="g-btn" onclick="window.scrollBy({top: 800, behavior: 'smooth'})">Continue →</button>`;
                        break;
                    }
                }
            }
        }
    })();
})(); // <-- DOSYANIN EN SON KAPANIŞ PARANTEZİ