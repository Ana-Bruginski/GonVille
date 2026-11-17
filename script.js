// Hotel GonVille
const WHATSAPP = "5544998584040";
const calmo = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Fotos com legenda do que aparece em cada uma
const fotos = {
  standard: {
    nome: "Quarto Standard",
    itens: [
      ["img/standard/quarto-4.jpg", "Cama de solteiro e ventilador de teto"],
      ["img/standard/quarto-2.jpg", "Quarto de solteiro, com o banheiro ao lado"],
      ["img/standard/quarto-3.jpg", "Bancada com TV e cadeira"],
      ["img/standard/quarto-1.jpg", "Banheiro com box de vidro e chuveiro a gás"],
    ],
  },
  luxo: {
    nome: "Quarto Luxo",
    itens: [
      ["img/luxo/quarto-6.jpg", "Quarto para família: uma cama de casal e duas de solteiro"],
      ["img/luxo/quarto-3.jpg", "Cama de casal, cama de solteiro e ar-condicionado"],
      ["img/luxo/quarto-5.jpg", "Bancada com TV, frigobar e poltrona"],
      ["img/luxo/quarto-2.jpg", "Quarto de solteiro com ar-condicionado"],
      ["img/luxo/quarto-7.jpg", "Entrada do quarto, com bancada e frigobar"],
      ["img/luxo/quarto-4.jpg", "Da porta: banheiro à esquerda, cama ao fundo"],
      ["img/luxo/quarto-1.jpg", "Banheiro com box de vidro e chuveiro a gás"],
    ],
  },
  cafe: {
    nome: "Café da manhã",
    itens: [
      ["img/cafe/cafe-1.jpg", "A mesa do café: bolos, frios, queijo e frutas"],
      ["img/cafe/cafe-2.jpg", "Bolo de chocolate"],
      ["img/cafe/cafe-3.jpg", "Bolo de fubá"],
      ["img/cafe/cafe-4.jpg", "Presunto"],
      ["img/cafe/cafe-5.jpg", "Pão de queijo"],
      ["img/cafe/cafe-6.jpg", "Muçarela"],
      ["img/cafe/cafe-7.jpg", "Bolo de chocolate com granulado"],
      ["img/cafe/cafe-8.jpg", "Banana e maçã"],
      ["img/cafe/cafe-9.jpg", "Bolo de coco"],
      ["img/cafe/cafe-10.jpg", "Pão francês"],
      ["img/cafe/cafe-11.jpg", "Pão de forma, integral e de leite"],
      ["img/cafe/cafe-12.jpg", "Maçãs"],
      ["img/cafe/cafe-13.jpg", "Caqui"],
      ["img/cafe/cafe-14.jpg", "Abacaxi"],
      ["img/cafe/cafe-15.jpg", "Mamão"],
      ["img/cafe/cafe-16.jpg", "Melancia e melão"],
      ["img/cafe/cafe-17.jpg", "Mamão, melancia e melão"],
    ],
  },
};

/* ---------- Cabeçalho, páginas e marcador ---------- */
const header = document.getElementById("header");
const nav = document.getElementById("menu");
const burger = document.querySelector(".burger");
const mobileBar = document.querySelector(".mobile-bar");
const paginas = [...document.querySelectorAll(".page")];

function marcar(id) {
  const secao = id === "standard" ? "quartos" : id;
  nav.querySelectorAll("a").forEach((a) => a.classList.toggle("is-active", a.hash === "#" + secao));
}

// marca a página que está no meio da tela
const observador = new IntersectionObserver(
  (entradas) => entradas.forEach((e) => e.isIntersecting && marcar(e.target.id)),
  { rootMargin: "-45% 0px -45% 0px" }
);
// o conteúdo começa a aparecer quando a página ainda está entrando
const entrando = new IntersectionObserver(
  (entradas) => entradas.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
  { threshold: 0.25 }
);
paginas.forEach((p) => { observador.observe(p); entrando.observe(p); });
paginas[0].classList.add("is-in");

/* ---------- Troca de página suave (computador) ---------- */
const telaGrande = matchMedia("(min-width: 900px) and (min-height: 600px)");
let animando = false, fimAnim = 0, ultimaRoda = 0;

const suave = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const paginaAtual = () => {
  const meio = scrollY + innerHeight / 2;
  let i = 0;
  paginas.forEach((p, k) => { if (p.offsetTop <= meio) i = k; });
  return i;
};

function irPara(i) {
  i = Math.max(0, Math.min(paginas.length - 1, i));
  const fim = document.documentElement.scrollHeight - innerHeight;
  rolarAte(i === paginas.length - 1 ? fim : Math.min(paginas[i].offsetTop, fim));
}

// Avança ou volta. Se a página for mais alta que a tela, primeiro mostra o resto dela.
function passoPagina(dir) {
  const i = paginaAtual(), p = paginas[i];
  const topo = p.offsetTop, base = topo + p.offsetHeight;
  if (dir > 0 && base > scrollY + innerHeight + 2) return rolarAte(Math.min(base - innerHeight, scrollY + innerHeight * 0.8));
  if (dir < 0 && topo < scrollY - 2) return rolarAte(Math.max(topo, scrollY - innerHeight * 0.8));
  irPara(i + dir);
}

function rolarAte(para) {
  const de = scrollY, dist = para - de;
  if (Math.abs(dist) < 2) return;
  if (calmo) return scrollTo(0, para);
  const dur = Math.min(1300, 750 + Math.abs(dist) / innerHeight * 120);
  const t0 = performance.now();
  animando = true;
  (function quadro(t) {
    const p = Math.min((t - t0) / dur, 1);
    scrollTo(0, de + dist * suave(p));
    if (p < 1) requestAnimationFrame(quadro);
    else { animando = false; fimAnim = performance.now(); }
  })(t0);
}

function ativo() { return telaGrande.matches && !nav.classList.contains("open") && !document.querySelector("dialog[open]"); }
document.documentElement.classList.toggle("paged", telaGrande.matches);
telaGrande.addEventListener("change", () => document.documentElement.classList.toggle("paged", telaGrande.matches));

addEventListener("wheel", (e) => {
  if (!ativo() || e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
  e.preventDefault();
  const agora = performance.now();
  const restoDoGesto = agora - ultimaRoda < 220 && agora - fimAnim < 900;
  ultimaRoda = agora;
  if (animando || restoDoGesto || Math.abs(e.deltaY) < 4) return;
  passoPagina(e.deltaY > 0 ? 1 : -1);
}, { passive: false });

addEventListener("keydown", (e) => {
  if (!ativo() || e.target.closest("input, select, textarea, summary, details")) return;
  const mapa = { ArrowDown: 1, PageDown: 1, " ": 1, ArrowUp: -1, PageUp: -1 };
  if (e.key in mapa) { e.preventDefault(); if (!animando) passoPagina(e.shiftKey && e.key === " " ? -1 : mapa[e.key]); }
  if (e.key === "Home") { e.preventDefault(); irPara(0); }
  if (e.key === "End") { e.preventDefault(); irPara(paginas.length - 1); }
});

// links internos (#quartos, bolinhas, botões "Consultar") também deslizam
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || !ativo()) return;
  const alvo = document.querySelector(a.hash);
  const i = paginas.indexOf(alvo);
  if (i < 0) return;
  e.preventDefault();
  irPara(i);
  history.replaceState(null, "", a.hash);
});

// ao redimensionar, volta para o início da página atual
let rz;
addEventListener("resize", () => {
  clearTimeout(rz);
  rz = setTimeout(() => ativo() && scrollTo(0, paginas[paginaAtual()].offsetTop), 150);
});

function aoRolar() {
  const y = scrollY;
  header.classList.toggle("is-solid", y > innerHeight * 0.6);
  mobileBar.classList.toggle("show", y > innerHeight * 0.6);
}
addEventListener("scroll", aoRolar, { passive: true });

/* ---------- Menu do celular ---------- */
function fecharMenu() {
  nav.classList.remove("open");
  header.classList.remove("menu-open");
  burger.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}
burger.addEventListener("click", () => {
  const aberto = nav.classList.toggle("open");
  header.classList.toggle("menu-open", aberto);
  burger.setAttribute("aria-expanded", aberto);
  document.body.style.overflow = aberto ? "hidden" : "";
});
nav.addEventListener("click", (e) => {
  const a = e.target.closest("a");
  if (!a || !nav.classList.contains("open")) return;
  e.preventDefault();
  fecharMenu();
  document.querySelector(a.hash).scrollIntoView({ behavior: calmo ? "auto" : "smooth" });
  history.replaceState(null, "", a.hash);
});

/* ---------- Sliders dos quartos ---------- */
document.querySelectorAll(".slider").forEach((box) => {
  const chave = box.dataset.gallery;
  const g = fotos[chave];
  box.innerHTML =
    g.itens.map(([src, leg], i) =>
      `<button class="slide${i === 0 ? " is-on" : ""}" data-open="${chave}" data-index="${i}" aria-label="Ampliar: ${leg}">
         <img src="${src}" alt="${leg}" ${i ? 'loading="lazy"' : ""}>
       </button>`).join("") +
    `<div class="slider__bar"></div>
     <div class="slider__ui">
       <span class="slider__cap"></span>
       <div class="slider__btns">
         <button class="s-prev" aria-label="Foto anterior">‹</button>
         <button class="s-next" aria-label="Próxima foto">›</button>
       </div>
     </div>`;

  const slides = box.querySelectorAll(".slide");
  const cap = box.querySelector(".slider__cap");
  const bar = box.querySelector(".slider__bar");
  let i = 0, timer = null, visivel = false, parado = false;

  function ir(n) {
    slides[i].classList.remove("is-on");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("is-on");
    cap.textContent = `${i + 1} de ${slides.length}: ${g.itens[i][1]}`;
    reiniciar();
  }
  function reiniciar() {
    clearTimeout(timer);
    bar.classList.remove("run");
    if (calmo || !visivel || parado) return;
    void bar.offsetWidth;
    bar.classList.add("run");
    timer = setTimeout(() => ir(i + 1), 5000);
  }
  box.querySelector(".s-prev").addEventListener("click", () => ir(i - 1));
  box.querySelector(".s-next").addEventListener("click", () => ir(i + 1));
  box.addEventListener("mouseenter", () => { parado = true; reiniciar(); });
  box.addEventListener("mouseleave", () => { parado = false; reiniciar(); });

  let x0 = null;
  box.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  box.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) ir(dx < 0 ? i + 1 : i - 1);
    x0 = null;
  });

  new IntersectionObserver(([e]) => { visivel = e.isIntersecting; reiniciar(); }, { threshold: 0.5 }).observe(box);
  ir(0);
});

/* ---------- Faixa de fotos do café ---------- */
const trilho = document.getElementById("marquee");
const botoesCafe = fotos.cafe.itens
  .map(([src, leg], i) => `<button data-open="cafe" data-index="${i}" tabindex="-1"><img src="${src}" alt="${leg}" loading="lazy"></button>`)
  .join("");
trilho.innerHTML = botoesCafe + botoesCafe;

/* ---------- Avaliações ---------- */
const quotes = document.querySelectorAll(".quote");
const dots = document.getElementById("dots");
let q = 0, qTimer;
quotes.forEach((_, n) => {
  const b = document.createElement("button");
  b.setAttribute("role", "tab");
  b.setAttribute("aria-label", `Avaliação ${n + 1}`);
  b.addEventListener("click", () => mostrarQuote(n));
  dots.append(b);
});
function mostrarQuote(n) {
  quotes[q].classList.remove("is-on");
  q = n % quotes.length;
  quotes[q].classList.add("is-on");
  dots.querySelectorAll("button").forEach((b, k) => b.setAttribute("aria-selected", k === q));
  clearTimeout(qTimer);
  if (!calmo) qTimer = setTimeout(() => mostrarQuote(q + 1), 7000);
}
mostrarQuote(0);

/* ---------- Reserva pelo WhatsApp ---------- */
const form = document.getElementById("reservar");
const msg = document.getElementById("booking-msg");
const entrada = form.elements.checkin;
const saida = form.elements.checkout;

const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const hoje = new Date();
entrada.min = iso(hoje);
saida.min = iso(new Date(hoje.getTime() + 864e5));

entrada.addEventListener("change", () => {
  if (!entrada.value) return;
  const dia = new Date(entrada.value + "T12:00");
  dia.setDate(dia.getDate() + 1);
  saida.min = iso(dia);
  if (!saida.value || saida.value <= entrada.value) saida.value = iso(dia);
});

// "Consultar o Luxo" / "Consultar o Standard" já escolhem o quarto
document.querySelectorAll("[data-quarto]").forEach((a) =>
  a.addEventListener("click", () => { form.elements.quarto.value = a.dataset.quarto; })
);

const br = (v) => v.split("-").reverse().join("/");
function erro(campo, texto) {
  campo.closest(".field").classList.add("invalid");
  msg.textContent = texto;
  msg.classList.add("error");
  campo.focus({ preventScroll: true });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  form.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  msg.classList.remove("error");
  msg.textContent = "";

  if (!entrada.value) return erro(entrada, "Escolha o dia de chegada.");
  if (!saida.value) return erro(saida, "Escolha o dia de saída.");
  if (saida.value <= entrada.value) return erro(saida, "A saída precisa ser depois da chegada.");

  const f = form.elements;
  const noites = Math.round((new Date(saida.value) - new Date(entrada.value)) / 864e5);
  const linhas = [
    "Olá! Quero saber se tem vaga e o valor da diária.",
    "",
    `Chegada: ${br(entrada.value)}`,
    `Saída: ${br(saida.value)} (${noites} ${noites === 1 ? "noite" : "noites"})`,
    `Adultos: ${f.adultos.value}`,
    `Crianças: ${f.criancas.value}`,
    `Quarto: ${f.quarto.value}`,
  ];
  if (f.pet.checked) linhas.push("Vou levar animal de estimação.");
  if (f.pedido.value.trim()) linhas.push("", `Pedido: ${f.pedido.value.trim()}`);

  msg.textContent = "Abrindo o WhatsApp…";
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(linhas.join("\n"))}`, "_blank", "noopener");
});

/* ---------- Visualizador de fotos ---------- */
const lb = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCap = document.getElementById("lb-cap");
const lbNum = document.getElementById("lb-num");
let atual = { chave: "luxo", i: 0 };

function mostrar() {
  const g = fotos[atual.chave];
  const [src, legenda] = g.itens[atual.i];
  lbImg.src = src;
  lbImg.alt = legenda;
  lbImg.style.animation = "none";
  void lbImg.offsetWidth;
  lbImg.style.animation = "";
  lbCap.textContent = `${g.nome}: ${legenda}`;
  lbNum.textContent = `${atual.i + 1} / ${g.itens.length}`;
}
function passo(d) {
  const n = fotos[atual.chave].itens.length;
  atual.i = (atual.i + d + n) % n;
  mostrar();
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-open]");
  if (!b) return;
  atual = { chave: b.dataset.open, i: +b.dataset.index || 0 };
  mostrar();
  lb.showModal();
});
lb.querySelector(".lb-close").addEventListener("click", () => lb.close());
lb.querySelector(".lb-prev").addEventListener("click", () => passo(-1));
lb.querySelector(".lb-next").addEventListener("click", () => passo(1));
lb.addEventListener("click", (e) => { if (e.target === lb || e.target.tagName === "FIGURE") lb.close(); });
lb.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") passo(-1);
  if (e.key === "ArrowRight") passo(1);
});
let lx = null;
lb.addEventListener("touchstart", (e) => (lx = e.touches[0].clientX), { passive: true });
lb.addEventListener("touchend", (e) => {
  if (lx === null) return;
  const dx = e.changedTouches[0].clientX - lx;
  if (Math.abs(dx) > 40) passo(dx < 0 ? 1 : -1);
  lx = null;
});

document.getElementById("ano").textContent = new Date().getFullYear();
aoRolar();
