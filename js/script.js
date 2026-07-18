  /* ---------- Réseau de nœuds (trafic) ---------- */
  const netCanvas = document.getElementById('network');
  const nctx = netCanvas.getContext('2d');
  let netNodes = [];
  let netPackets = [];

  function resizeNetwork(){
    netCanvas.width = window.innerWidth * devicePixelRatio;
    netCanvas.height = window.innerHeight * devicePixelRatio;
    netCanvas.style.width = window.innerWidth + 'px';
    netCanvas.style.height = window.innerHeight + 'px';
    nctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
    initNetwork();
  }
  window.addEventListener('resize', resizeNetwork);

  function initNetwork(){
    const w = window.innerWidth, h = window.innerHeight;
    const density = Math.min(70, Math.round((w*h)/22000));
    netNodes = [];
    for(let i=0;i<density;i++){
      netNodes.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.18,
        vy: (Math.random()-0.5)*0.18,
        r: 1.4 + Math.random()*1.6
      });
    }
    netPackets = [];
  }

  const NET_LINK_DIST = 150;

  function maybeSpawnPacket(){
    if(netNodes.length < 2) return;
    if(Math.random() < 0.035 && netPackets.length < 8){
      // trouve une paire de nœuds proches pour un "paquet" crédible
      const a = netNodes[Math.floor(Math.random()*netNodes.length)];
      let closest = null, bestD = Infinity;
      for(const b of netNodes){
        if(b === a) continue;
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d < NET_LINK_DIST && d < bestD){ bestD = d; closest = b; }
      }
      if(closest){
        netPackets.push({ a, b: closest, t: 0, speed: 0.012 + Math.random()*0.012, orange: Math.random() < 0.3 });
      }
    }
  }

  const netReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function drawNetwork(){
    if(netReduceMotion){
      const w = window.innerWidth, h = window.innerHeight;
      nctx.clearRect(0,0,w,h);
      for(let i=0;i<netNodes.length;i++){
        for(let j=i+1;j<netNodes.length;j++){
          const a = netNodes[i], b = netNodes[j];
          const d = Math.hypot(a.x-b.x, a.y-b.y);
          if(d < NET_LINK_DIST){
            const alpha = (1 - d/NET_LINK_DIST) * 0.3;
            nctx.strokeStyle = `rgba(96,165,250,${alpha})`;
            nctx.lineWidth = 1;
            nctx.beginPath();
            nctx.moveTo(a.x, a.y);
            nctx.lineTo(b.x, b.y);
            nctx.stroke();
          }
        }
      }
      for(const n of netNodes){
        nctx.beginPath();
        nctx.fillStyle = 'rgba(219,234,254,0.5)';
        nctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
        nctx.fill();
      }
      return;
    }
    const w = window.innerWidth, h = window.innerHeight;
    nctx.clearRect(0,0,w,h);

    // mise à jour des positions
    for(const n of netNodes){
      n.x += n.vx; n.y += n.vy;
      if(n.x < 0 || n.x > w) n.vx *= -1;
      if(n.y < 0 || n.y > h) n.vy *= -1;
    }

    // liens entre nœuds proches
    for(let i=0;i<netNodes.length;i++){
      for(let j=i+1;j<netNodes.length;j++){
        const a = netNodes[i], b = netNodes[j];
        const d = Math.hypot(a.x-b.x, a.y-b.y);
        if(d < NET_LINK_DIST){
          const alpha = (1 - d/NET_LINK_DIST) * 0.35;
          nctx.strokeStyle = `rgba(96,165,250,${alpha})`;
          nctx.lineWidth = 1;
          nctx.beginPath();
          nctx.moveTo(a.x, a.y);
          nctx.lineTo(b.x, b.y);
          nctx.stroke();
        }
      }
    }

    // nœuds
    for(const n of netNodes){
      nctx.beginPath();
      nctx.fillStyle = 'rgba(219,234,254,0.55)';
      nctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      nctx.fill();
    }

    // paquets de données voyageant sur les liens (trafic)
    maybeSpawnPacket();
    netPackets = netPackets.filter(p => p.t <= 1);
    for(const p of netPackets){
      p.t += p.speed;
      const x = p.a.x + (p.b.x - p.a.x) * p.t;
      const y = p.a.y + (p.b.y - p.a.y) * p.t;
      const color = p.orange ? '251,146,60' : '96,165,250';
      nctx.beginPath();
      nctx.fillStyle = `rgba(${color},0.95)`;
      nctx.shadowColor = `rgba(${color},0.9)`;
      nctx.shadowBlur = 8;
      nctx.arc(x, y, 2.4, 0, Math.PI*2);
      nctx.fill();
      nctx.shadowBlur = 0;
    }

    requestAnimationFrame(drawNetwork);
  }

  resizeNetwork();
  drawNetwork();

  /* ---------- Modal Contact ---------- */
  let currentChannel = 'whatsapp';

  function openContactModal(channel) {
    currentChannel = channel;
    const modal = document.getElementById('contact-modal');
    const icon = document.getElementById('modal-icon');
    const title = document.getElementById('modal-title');
    const subtitle = document.getElementById('modal-subtitle');
    const submitBtn = document.getElementById('cf-submit-btn');

    if (channel === 'whatsapp') {
      icon.className = 'modal-icon wa-icon';
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.79 14.09c-.24.68-1.4 1.3-1.93 1.34-.5.04-1.02.24-3.44-.72-2.9-1.16-4.77-4.06-4.91-4.25-.14-.19-1.18-1.57-1.18-3 0-1.42.75-2.12 1.01-2.41.27-.29.58-.36.78-.36.19 0 .39 0 .56.01.18.01.42-.07.66.5.24.58.83 1.99.9 2.14.07.14.11.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.13-.28.28-.12.55.16.27.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.21 1.37.27.14.43.12.59-.07.16-.19.68-.79.86-1.06.18-.27.36-.22.61-.13.24.09 1.55.73 1.82.86.27.14.44.2.51.31.07.11.07.65-.17 1.34z"/></svg>';
      title.textContent = 'Envoyer un message';
      subtitle.textContent = 'via WhatsApp — 06 46 74 314';
      submitBtn.textContent = 'Envoyer via WhatsApp';
      submitBtn.style.background = 'linear-gradient(135deg, #25D366, #128C7E)';
    } else {
      icon.className = 'modal-icon mail-icon';
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z" stroke="none"/><path d="M22 6l-10 7L2 6"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>';
      title.textContent = 'Envoyer un email';
      subtitle.textContent = 'à coracornelca@gmail.com';
      submitBtn.textContent = 'Envoyer par Email';
      submitBtn.style.background = 'linear-gradient(135deg, var(--blue), var(--orange))';
    }

    document.getElementById('contact-form').reset();
    document.getElementById('contact-form').style.display = '';
    document.querySelector('.modal-header').style.display = '';
    document.getElementById('success-msg').classList.remove('show');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeContactModal() {
    document.getElementById('contact-modal').classList.remove('open');
    document.body.style.overflow = '';
  }

  document.getElementById('contact-modal').addEventListener('click', function(e) {
    if (e.target === this) closeContactModal();
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeContactModal();
  });

  function submitContactForm(e) {
    e.preventDefault();
    const name = document.getElementById('cf-name').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const subject = document.getElementById('cf-subject').value.trim();
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !phone || !subject || !message) return;

    if (currentChannel === 'whatsapp') {
      let text = 'Bonjour CORA Startup !\n\n';
      text += 'Nom : ' + name + '\n';
      text += 'Téléphone : ' + phone + '\n';
      if (email) text += 'Email : ' + email + '\n';
      text += 'Sujet : ' + subject + '\n\n';
      text += message;
      const url = 'https://wa.me/24264674314?text=' + encodeURIComponent(text);
      window.open(url, '_blank');
    } else {
      let body = 'Bonjour CORA Startup,\n\n';
      body += 'Nom : ' + name + '\n';
      body += 'Téléphone : ' + phone + '\n';
      if (email) body += 'Email : ' + email + '\n';
      body += 'Sujet : ' + subject + '\n\n';
      body += message;
      const url = 'https://mail.google.com/mail/?view=cm&fs=1&to=coracornelca@gmail.com&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      window.open(url, '_blank');
    }

    document.getElementById('contact-form').style.display = 'none';
    document.querySelector('.modal-header').style.display = 'none';
    document.getElementById('success-msg').classList.add('show');
  }
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const revealObserver = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Éclairs de fond ---------- */
  const canvas = document.getElementById('bolts');
  const ctx = canvas.getContext('2d');
  const flashEl = document.getElementById('flash');

  function resize(){
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  window.addEventListener('resize', resize);
  resize();

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function generateBolt(x1, y1, x2, y2, displace, segments){
    let points = [{x:x1,y:y1}, {x:x2,y:y2}];
    for(let i=0;i<segments;i++){
      const newPoints = [points[0]];
      for(let j=0;j<points.length-1;j++){
        const a = points[j], b = points[j+1];
        const mx = (a.x+b.x)/2 + (Math.random()-0.5)*displace;
        const my = (a.y+b.y)/2 + (Math.random()-0.5)*displace*0.4;
        newPoints.push({x:mx,y:my});
        newPoints.push(b);
      }
      points = newPoints;
      displace *= 0.55;
    }
    return points;
  }

  function drawBoltPath(points, width, color, alpha){
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.shadowColor = color;
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for(let i=1;i<points.length;i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.stroke();
    ctx.restore();
  }

  function spawnBranch(points, chance){
    const branches = [];
    points.forEach((p,i)=>{
      if(i>2 && i<points.length-4 && Math.random() < chance){
        const endX = p.x + (Math.random()-0.5)*140;
        const endY = p.y + Math.random()*160 + 40;
        branches.push(generateBolt(p.x, p.y, endX, endY, 40, 3));
      }
    });
    return branches;
  }

  function strike(){
    const w = window.innerWidth, h = window.innerHeight;
    const startX = w*(0.1 + Math.random()*0.8);
    const endX = startX + (Math.random()-0.5)*220;
    const endY = h*(0.35 + Math.random()*0.4);

    const main = generateBolt(startX, -10, endX, endY, 170, 6);
    const branches = spawnBranch(main, 0.12);
    const isOrange = Math.random() < 0.25;
    const boltColor = isOrange ? '#fed7aa' : '#dbeafe';
    const branchColor = isOrange ? '#fb923c' : '#60a5fa';

    ctx.clearRect(0,0,w,h);

    flashEl.style.transition = 'none';
    flashEl.style.opacity = 0.26 + Math.random()*0.16;
    requestAnimationFrame(()=>{
      flashEl.style.transition = 'opacity 450ms ease-out';
      flashEl.style.opacity = 0;
    });

    let holdFrames = 12;
    let fade = 1;
    const fadeInterval = setInterval(()=>{
      if(holdFrames > 0){ holdFrames--; }
      else { fade -= 0.035; }
      ctx.clearRect(0,0,w,h);
      if(fade > 0){
        drawBoltPath(main, 2.2, boltColor, fade);
        branches.forEach(b => drawBoltPath(b, 1.1, branchColor, fade*0.8));
      } else {
        clearInterval(fadeInterval);
        ctx.clearRect(0,0,w,h);
      }
    }, 40);
  }

  function scheduleNextStrike(){
    const delay = reduceMotion ? 7000 + Math.random()*6000 : 2600 + Math.random()*4600;
    setTimeout(()=>{
      strike();
      if(!reduceMotion && Math.random() < 0.2){
        setTimeout(strike, 200 + Math.random()*200);
      }
      scheduleNextStrike();
    }, delay);
  }
  scheduleNextStrike();