// Para adicionar perguntas, inclua outro objeto na lista. Tipos: "options" ou "easterEgg".
const questions = [
  { level: 'Fácil', type: 'options', text: 'Que dia a gente se conheceu?', choices: ['5 de janeiro', '6 de janeiro', '7 de janeiro', '8 de janeiro'], answer: '6 de janeiro' },
  { level: 'Fácil', type: 'options', text: 'Qual é a minha banda favorita?', choices: ['MCR', 'Radiohead', 'Avenged Sevenfold', 'The Strokes'], answer: 'The Strokes' },
  { level: 'Fácil', type: 'options', text: 'Que dia começamos a namorar oficialmente?', choices: ['23/05', '24/05', '25/05', '26/05'], answer: '24/05' },
  { level: 'Médio', type: 'easterEgg', text: 'Qual foi o apelido que dei pra atriz principal do primeiro filme que assistimos?', choices: ['Sidney System', 'Sidney Flinston', 'Sidney Magal', 'Sydney Simpsons'], answer: 'Todos', footerText: 'Todos' },
  { level: 'Fácil', type: 'options', text: 'Quem você seria em Zootopia?', choices: ['O prefeito', 'O gato fdp', 'A coelha', 'O Nick'], answer: 'A coelha' },
  { level: 'Médio', type: 'options', text: 'Quem falou “eu te amo” primeiro?', choices: ['Nina', 'Luanny, pois é a mais romântica', 'As duas juntas', 'Ninguém lembra'], answer: 'Luanny, pois é a mais romântica' },
  { level: 'Médio', type: 'easterEgg', text: 'Quem a Marina Sena ficaria primeiro?', choices: ['Juliano Floss', 'Sabrina Chagas', 'Arthur Poli', 'Gabriel Chagas'], answer: 'Fodanny', footerText: 'Fodanny' },
  { level: 'Difícil', type: 'counterEgg', text: 'Calcule o valor exato da expressão:', equation: '[(9! ÷ 8!) − 1] × [√4096 + log₂(256) − ∛512] ÷ 64', choices: ['12', '21', '35', '47'], answer: '8' },
  { level: 'Difícil', type: 'options', text: 'Qual era o número que faltava na cartela do seu bingo pra fazer o bingo e você me dar o pinto que eu queria?', choices: ['23', '17', '22', '35'], answer: '23' }
];

const game = document.querySelector('#game');
const musicToggle = document.querySelector('#music-toggle');
const musicSlot = document.querySelector('#music-slot');
const youtubeVideoUrl = 'https://www.youtube.com/watch?v=SEU_ID_DO_VIDEO'; // Troque pelo link do vídeo publicado.
let current = -1;
let score = 0;
let locked = false;
let musicStarted = false;
let musicSoundEnabled = false;

musicToggle.addEventListener('click', () => {
  if (!musicStarted) {
    startMusic();
  }
  if (!musicSoundEnabled) {
    enableMusicSound();
    return;
  }
  const frame = musicSlot.querySelector('iframe');
  const paused = musicToggle.dataset.paused === 'true';
  if (frame) frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: paused ? 'playVideo' : 'pauseVideo' }), '*');
  musicToggle.dataset.paused = String(!paused);
  musicToggle.querySelector('span').textContent = paused ? 'Pausar Amiúde' : 'Tocar Amiúde';
});

function startMusic() {
  if (musicStarted) return;
  musicStarted = true;
  musicSlot.hidden = false;
  musicSlot.innerHTML = '<iframe title="Amiúde, de Marina Sena" width="240" height="135" src="https://www.youtube-nocookie.com/embed/z6MQ5KRujmo?autoplay=1&mute=1&enablejsapi=1&controls=0&rel=0" allow="autoplay; encrypted-media; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe>';
  window.setTimeout(() => {
    const frame = musicSlot.querySelector('iframe');
    if (frame) {
      frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [8] }), '*');
      frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute' }), '*');
    }
  }, 1200);
}

function enableMusicSound(event) {
  if (event?.target?.closest?.('#music-toggle') || !musicStarted || musicSoundEnabled) return;
  const frame = musicSlot.querySelector('iframe');
  if (frame) {
    frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [8] }), '*');
    frame.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'unMute' }), '*');
  }
  musicSoundEnabled = true;
  musicToggle.dataset.paused = 'false';
  musicToggle.querySelector('span').textContent = 'Pausar Amiúde';
}

document.addEventListener('pointerdown', enableMusicSound);
document.addEventListener('keydown', enableMusicSound);

function start() {
  current = 0; score = 0; renderQuestion();
}

function renderIntro() {
  game.innerHTML = `<div class="eyebrow">um quiz pra ver se vc é pika amor</div><h1 class="title">Quanto você conhece<br>o casal mais foda<br>do Brasil?</h1><p class="sub">responda as perguntas pra ver se vc me ama de vdd.</p><img class="pixel-art-image" src="pixelart/nina-luanny-pixelart.jpg" alt="Ilustração pixel art das duas de mãos dadas"><button class="button" id="start">Começar o quiz <span class="arrow">→</span></button>`;
  document.querySelector('#start').addEventListener('click', start);
}

function renderQuestion() {
  locked = false;
  const q = questions[current];
  const footer = document.querySelector('.copyright');
  footer.innerHTML = 'Todos os direitos reservados <span class="copyright-name">@FodannyFodrielle</span>';
  const letters = ['A', 'B', 'C', 'D'];
  const questionIndex = q.type === 'counterEgg' ? `<button class="counter-answer" type="button" aria-label="Resposta surpresa: 8">${current + 1}</button>` : `${current + 1}`;
  game.innerHTML = `<div class="progress-row"><div class="progress-track"><div class="progress-fill" style="width:${(current / questions.length) * 100}%"></div></div><span class="progress-label">${questionIndex} / ${questions.length}</span></div><div class="eyebrow">Nível ${q.level}</div><h2 class="question">${q.text}</h2>${q.equation ? `<div class="equation">${q.equation}</div>` : ''}<div class="answers">${q.choices.map((choice, i) => `<button class="answer" data-answer="${choice.replaceAll('&','&amp;').replaceAll('"','&quot;')}"><span class="letter">${letters[i]}</span>${choice}</button>`).join('')}</div><p class="feedback" id="feedback" aria-live="polite"></p><div class="next-wrap"><button class="button next" id="next">Próxima pergunta <span class="arrow">→</span></button></div>`;
  game.querySelectorAll('.answer').forEach(button => button.addEventListener('click', () => submit(button.dataset.answer, button)));
  if (q.type === 'counterEgg') {
    const counter = game.querySelector('.counter-answer');
    counter.addEventListener('click', () => { counter.classList.add('revealed'); submit(q.answer, counter); });
  }
  if (q.type === 'easterEgg') {
    const egg = document.createElement('button');
    egg.className = 'footer-answer'; egg.type = 'button'; egg.textContent = q.footerText;
    egg.setAttribute('aria-label', `Resposta surpresa: ${q.footerText}`);
    egg.title = 'Psst... toca aqui!';
    egg.addEventListener('click', () => { egg.classList.add('revealed'); submit(q.answer, egg); });
    if (q.footerText === 'Todos') {
      footer.innerHTML = '';
      footer.append(egg, ' os direitos reservados ');
      const name = document.createElement('span'); name.className = 'copyright-name'; name.textContent = '@FodannyFodrielle'; footer.append(name);
    } else {
      footer.innerHTML = 'Todos os direitos reservados @';
      footer.append(egg, 'Fodrielle');
    }
  }
}

function submit(value, button) {
  if (locked) return;
  locked = true;
  const q = questions[current];
  const correct = value === q.answer;
  if (correct) score++;
  const feedback = document.querySelector('#feedback');
  feedback.textContent = correct ? 'pabens acertou' : 'ERROOOOOOU';
  feedback.className = `feedback ${correct ? 'good' : 'bad'}`;
  if (button.classList.contains('answer')) button.classList.add(correct ? 'correct' : 'wrong');
  game.querySelectorAll('.answer').forEach(el => { if (el.dataset.answer === q.answer) el.classList.add('correct'); });
  const next = document.querySelector('#next');
  next.classList.add('show');
  next.innerHTML = current === questions.length - 1 ? 'Ver resultado <span class="arrow">→</span>' : 'Próxima pergunta <span class="arrow">→</span>';
  next.addEventListener('click', () => { current++; current < questions.length ? renderQuestion() : renderResult(); }, { once: true });
}

function renderResult() {
  const perfect = score === questions.length;
  const resultTitle = perfect ? 'AEEEEEEE VC ME AMAAAA' : score <= 3 ? 'mds vc me odeia' : 'ate que vc me ama mesmo';
  const resultMessage = perfect ? 'te amo meu amor.' : 'Acerte todas pra ganhar um prêmio muito pika!';
  game.innerHTML = `<div class="result"><span class="score-badge">QUIZ CONCLUÍDO · ${score} DE ${questions.length}</span><div class="result-icon">${perfect ? '&#x1F498;' : '&#x1F48C;'}</div><h1 class="title">${resultTitle}</h1><p class="sub">${resultMessage}</p>${perfect ? '<p class="last-question-intro">Agora que você terminou o quiz, tem a última pergunta...</p><button class="button" id="proposal-next">Próximo <span class="arrow">→</span></button>' : '<button class="button" id="restart">Tentar de novo <span class="arrow">→</span></button>'}</div>`;
  if (perfect) document.querySelector('#proposal-next').addEventListener('click', renderProposal);
  else document.querySelector('#restart').addEventListener('click', start);
}
function renderProposal() {
  game.classList.add('proposal-screen');
  game.innerHTML = `<div class="proposal"><div class="proposal-heart" aria-hidden="true">💍</div><h1 class="title">Mononina Chagas,<br>você aceita casar com Monokanny?</h1><div class="proposal-actions"><button class="button proposal-yes" id="proposal-yes">Sim</button><button class="button proposal-no" id="proposal-no">Não</button></div></div>`;
  const noButton = document.querySelector('#proposal-no');
  const runAway = () => {
    const bounds = noButton.getBoundingClientRect();
    const maxLeft = Math.max(12, window.innerWidth - bounds.width - 12);
    const maxTop = Math.max(12, window.innerHeight - bounds.height - 12);
    noButton.style.position = 'fixed';
    noButton.style.left = `${12 + Math.random() * (maxLeft - 12)}px`;
    noButton.style.top = `${12 + Math.random() * (maxTop - 12)}px`;
  };
  noButton.addEventListener('pointerenter', runAway);
  noButton.addEventListener('pointerdown', event => { event.preventDefault(); runAway(); });
  noButton.addEventListener('click', event => { event.preventDefault(); runAway(); });
  noButton.addEventListener('focus', runAway);
  document.querySelector('#proposal-yes').addEventListener('click', renderAccepted);
}

function renderAccepted() {
  game.classList.remove('proposal-screen');
  game.innerHTML = `<div class="result accepted"><div class="result-icon">&#x1F496;</div><h1 class="title">AEEE AGORA ESTAMOS CASADAS</h1><p class="sub">Agora escaneie pra ver a surpresa:</p><img class="qr-code" src="qrcode/BsovHT.png" alt="QR code da surpresa"></div>`;
}
renderIntro();
startMusic();
