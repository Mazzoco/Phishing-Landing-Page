/* ============================================================
   BACKGROUND CANVAS — Partículas digitais animadas
============================================================ */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 60 }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - .5) * .4,
    vy: (Math.random() - .5) * .4,
    r:  Math.random() * 1.5 + .5,
    a:  Math.random(),
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,191,255,0.03)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width;  x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Particles
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0)             p.x = canvas.width;
      if (p.x > canvas.width)  p.x = 0;
      if (p.y < 0)             p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,191,255,${p.a * 0.5})`;
      ctx.fill();
    });

    // Connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,191,255,${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ============================================================
   LOADER — Fake System Check
============================================================ */
(function initLoader() {
  const lines = [
    { text: '> Inicializando verificação de segurança...', delay: 100,  cls: '' },
    { text: '> Analisando origem da requisição...',        delay: 700,  cls: '' },
    { text: '> IP detectado: 192.168.x.x',                delay: 1300, cls: '' },
    { text: '⚠ Link suspeito identificado na cadeia!',    delay: 1900, cls: 'warn' },
    { text: '⚠ Tentativa de phishing catalogada.',        delay: 2500, cls: 'warn' },
    { text: '...',                                         delay: 3000, cls: '' },
    { text: '✓ SIMULAÇÃO EDUCATIVA DETECTADA',            delay: 3600, cls: 'ok' },
    { text: '✓ Página segura. Bem-vindo ao treinamento.', delay: 4100, cls: 'ok blink' },
  ];

  const body   = document.getElementById('terminal-body');
  const bar    = document.getElementById('loader-bar');
  const loader = document.getElementById('loader');

  lines.forEach(({ text, delay, cls }) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'line ' + cls;
      div.textContent = text;
      body.appendChild(div);
      bar.style.width = ((delay / 4100) * 100) + '%';
    }, delay);
  });

  setTimeout(() => {
    bar.style.width = '100%';
    setTimeout(() => {
      loader.classList.add('hide');
      setTimeout(() => loader.remove(), 700);
      // Dispara reveal inicial do hero
      document.querySelectorAll('.reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 120);
      });
    }, 600);
  }, 4800);
})();


/* ============================================================
   SCROLL REVEAL
============================================================ */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ============================================================
   STAT COUNTERS — Animação de contagem
============================================================ */
function animateCounter(el) {
  if (el.dataset.animated) return;
  el.dataset.animated = '1';

  const target   = parseFloat(el.dataset.target);
  const suffix   = el.dataset.suffix !== undefined ? el.dataset.suffix : '%';
  const duration = 1800;
  const start    = performance.now();

  function step(now) {
    const p     = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val   = Math.round(eased * target);
    el.textContent = val + suffix;
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-target]').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-card').forEach(card => counterObserver.observe(card));


/* ============================================================
   TOOLTIP MOBILE — toque para abrir/fechar
============================================================ */
document.querySelectorAll('.annotated').forEach(el => {
  el.addEventListener('click', (e) => {
    e.stopPropagation();
    // Fecha todos os outros
    document.querySelectorAll('.annotated.active').forEach(a => {
      if (a !== el) a.classList.remove('active');
    });
    el.classList.toggle('active');
  });
});
document.addEventListener('click', () => {
  document.querySelectorAll('.annotated.active').forEach(a => a.classList.remove('active'));
});


/* ============================================================
   QUIZ — Dados e lógica
============================================================ */
const quizData = [
  {
    q: 'Você recebeu este e-mail. Qual elemento mais indica que é um golpe?',
    preview: `De: <span class="highlight-bad">noreply@netflix-conta-segura.xyz</span>
Para: voce@email.com
Assunto: ⚠️ SUA CONTA FOI SUSPENSA — AÇÃO NECESSÁRIA

Clique aqui para reativar: <span class="highlight-bad">netflix-verificar-conta.click/reativar</span>`,
    opts: [
      'A mensagem foi enviada de manhã',
      'O e-mail tem o nome "Netflix" no texto',
      'O domínio do remetente é ".xyz" e o link é suspeito',
      'O assunto está em letras maiúsculas',
    ],
    correct: 2,
    feedback: {
      ok:   '✓ Correto! Domínios desconhecidos (.xyz, .click) e remetentes que não correspondem à empresa oficial são os maiores sinais de phishing.',
      fail: '✗ O principal sinal é o domínio falso (.xyz) e o link suspeito. Empresas sérias usam seus próprios domínios (@netflix.com).',
    }
  },
  {
    q: 'Seu banco envia uma mensagem dizendo: "Verificamos acesso irregular. Informe sua senha agora para proteger sua conta." O que você faz?',
    preview: null,
    opts: [
      'Informo a senha, pois parece urgente e é meu banco',
      'Ignoro completamente e não faço nada',
      'Nunca forneço a senha. Ligo para o banco pelo número oficial para confirmar',
      'Respondo o e-mail pedindo mais informações',
    ],
    correct: 2,
    feedback: {
      ok:   '✓ Perfeito! Nenhuma instituição legítima pedirá sua senha por e-mail ou mensagem. Sempre entre em contato pelo número oficial no verso do cartão.',
      fail: '✗ Bancos NUNCA pedem sua senha por e-mail ou mensagem. Sempre ligue pelo número oficial no verso do cartão.',
    }
  },
  {
    q: 'Qual destes links leva para o site oficial do Bradesco?',
    preview: `A: <span class="highlight-bad">bradesco.conta-segura.com</span>
B: <span class="highlight-ok">bradesco.com.br</span>
C: <span class="highlight-bad">www-bradesco.net/login</span>
D: <span class="highlight-bad">bradesco-online.xyz</span>`,
    opts: [
      'A — bradesco.conta-segura.com',
      'B — bradesco.com.br',
      'C — www-bradesco.net/login',
      'D — bradesco-online.xyz',
    ],
    correct: 1,
    feedback: {
      ok:   '✓ Correto! O domínio oficial do Bradesco é bradesco.com.br. Qualquer variação (.xyz, .net, subdomínios estranhos) é falsa.',
      fail: '✗ Somente "bradesco.com.br" é o site oficial. Golpistas colocam o nome da empresa em domínios alternativos para enganar.',
    }
  },
  {
    q: 'Você recebe: "PARABÉNS! Você ganhou um iPhone 15 Pro! Clique agora e resgate seu prêmio antes que expire!" O que isso indica?',
    preview: null,
    opts: [
      'Provavelmente é verdade, pois sorteios acontecem',
      'É definitivamente um golpe — prêmios inesperados via e-mail são sempre phishing',
      'Pode ser real se vier de uma loja conhecida',
      'Devo clicar para ver se é verdade',
    ],
    correct: 1,
    feedback: {
      ok:   '✓ Exato! Prêmio inesperado + urgência + pedido de clique = receita clássica de phishing. Se você não participou de nada, não ganhou nada.',
      fail: '✗ Prêmios inesperados em e-mails são SEMPRE golpes. Nunca clique em links de "prêmios" que você não esperava.',
    }
  },
  {
    q: 'Qual é a melhor prática ao receber um e-mail suspeito de uma empresa ou serviço?',
    preview: null,
    opts: [
      'Clicar no link para ver se o site parece legítimo',
      'Responder o e-mail perguntando se é verdadeiro',
      'Abrir o site digitando o endereço diretamente no navegador, sem clicar em nenhum link',
      'Encaminhar para amigos para ver se eles conhecem',
    ],
    correct: 2,
    feedback: {
      ok:   '✓ Perfeito! Sempre acesse o site digitando o endereço você mesmo no navegador. Links em e-mails suspeitos podem levar a páginas clonadas idênticas às reais.',
      fail: '✗ A forma mais segura é digitar o endereço no navegador. Links suspeitos podem levar a páginas falsas idênticas às originais.',
    }
  },
];

let currentQ = 0, score = 0, answered = false;

function startQuiz() {
  currentQ = 0; score = 0; answered = false;
  document.getElementById('quiz-result').classList.remove('show');
  renderQuestion();
}

function renderQuestion() {
  const q    = quizData[currentQ];
  const main = document.getElementById('quiz-main');
  const prog = document.getElementById('quiz-progress');

  // Barra de progresso
  prog.innerHTML = quizData.map((_, i) =>
    `<div class="quiz-progress-dot ${i < currentQ ? 'done' : i === currentQ ? 'active' : ''}"></div>`
  ).join('');

  const previewHTML = q.preview
    ? `<div class="quiz-img">${q.preview}</div>`
    : '';

  main.innerHTML = `
    <div class="quiz-q">PERGUNTA ${currentQ + 1}</div>
    <div class="quiz-num">${currentQ + 1} de ${quizData.length}</div>
    <div class="quiz-question">${q.q}</div>
    ${previewHTML}
    <div class="quiz-options" id="quiz-opts">
      ${q.opts.map((o, i) => `
        <div class="quiz-opt" onclick="answer(${i})" data-idx="${i}">
          <div class="opt-letter">${String.fromCharCode(65 + i)}</div>
          ${o}
        </div>
      `).join('')}
    </div>
    <div class="quiz-feedback" id="quiz-fb"></div>
    <button class="quiz-next" id="quiz-next" onclick="nextQuestion()">
      ${currentQ < quizData.length - 1 ? 'PRÓXIMA →' : 'VER RESULTADO →'}
    </button>
  `;
}

function answer(idx) {
  if (answered) return;
  answered = true;

  const q    = quizData[currentQ];
  const opts = document.querySelectorAll('.quiz-opt');
  const fb   = document.getElementById('quiz-fb');
  const next = document.getElementById('quiz-next');

  opts.forEach(o => o.classList.add('disabled'));
  opts[idx].classList.add(idx === q.correct ? 'correct' : 'wrong');
  if (idx !== q.correct) opts[q.correct].classList.add('correct');

  if (idx === q.correct) {
    score++;
    fb.className  = 'quiz-feedback show ok';
    fb.textContent = q.feedback.ok;
  } else {
    fb.className  = 'quiz-feedback show fail';
    fb.textContent = q.feedback.fail;
  }

  next.classList.add('show');
}

function nextQuestion() {
  currentQ++;
  answered = false;
  if (currentQ >= quizData.length) {
    showResult();
  } else {
    renderQuestion();
  }
}

function showResult() {
  document.getElementById('quiz-main').innerHTML = '';
  document.getElementById('quiz-progress').innerHTML =
    quizData.map(() => `<div class="quiz-progress-dot done"></div>`).join('');

  const pct = Math.round((score / quizData.length) * 100);
  let title, sub;

  if (pct === 100) {
    title = '🏆 Expert em Segurança Digital!';
    sub   = 'Incrível! Você acertou tudo. Está preparado para identificar golpes de phishing e proteger seus dados.';
  } else if (pct >= 60) {
    title = '✅ Bom Trabalho!';
    sub   = `Você acertou ${score} de ${quizData.length} perguntas. Revise os conceitos que errou e compartilhe o aprendizado.`;
  } else {
    title = '📚 Continue Aprendendo';
    sub   = 'Sem preocupações! O importante é aprender. Releia as seções acima e tente novamente para fixar o conteúdo.';
  }

  document.getElementById('result-score').textContent = score + '/' + quizData.length;
  document.getElementById('result-title').textContent = title;
  document.getElementById('result-sub').textContent   = sub;
  document.getElementById('quiz-result').classList.add('show');
}

// Inicia quiz ao carregar
startQuiz();
