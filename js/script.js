// ============================================
// CONFIGURACIÓN INICIAL
// ============================================

// ⚠️ CAMBIA ESTA FECHA por la fecha real en que empezaron
const FECHA_INICIO = new Date("2023-01-01T00:00:00");

// ============================================
// BARRA DE PROGRESO
// ============================================
const progressBar = document.getElementById("progressBar");

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progreso = height > 0 ? (scrollTop / height) * 100 : 0;
  progressBar.style.width = progreso + "%";
});

// ============================================
// FADE IN ON SCROLL
// ============================================
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        observer.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 },
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// ============================================
// CONTADOR EN VIVO
// ============================================
function actualizarContador() {
  const ahora = new Date();
  const diff = ahora - FECHA_INICIO;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}

actualizarContador();
setInterval(actualizarContador, 1000);

// ============================================
// MÚSICA
// ============================================
const musica = document.getElementById("musica");
const musicBtn = document.getElementById("musicBtn");
let playing = false;

function reproducirMusica() {
  if (playing) return;
  musica.volume = 0.4;
  musica
    .play()
    .then(() => {
      playing = true;
      musicBtn.classList.add("playing");
      musicBtn.textContent = "🔊";
    })
    .catch(() => {
      // El navegador puede bloquearlo si no hubo interacción
    });
}

function pausarMusica() {
  musica.pause();
  playing = false;
  musicBtn.classList.remove("playing");
  musicBtn.textContent = "🎵";
}

musicBtn.addEventListener("click", () => {
  if (playing) pausarMusica();
  else reproducirMusica();
});

// ============================================
// INTRO: PARTÍCULAS FLOTANTES
// ============================================
const introParticles = document.getElementById("introParticles");
const introEmojis = ["❤", "💕", "✨", "💖", "🌸", "💫"];

for (let i = 0; i < 25; i++) {
  const p = document.createElement("span");
  p.textContent = introEmojis[Math.floor(Math.random() * introEmojis.length)];
  p.style.left = Math.random() * 100 + "%";
  p.style.fontSize = 10 + Math.random() * 18 + "px";
  p.style.animationDuration = 8 + Math.random() * 8 + "s";
  p.style.animationDelay = Math.random() * 8 + "s";
  p.style.opacity = 0.3 + Math.random() * 0.5;
  introParticles.appendChild(p);
}

// ============================================
// INTRO: SOBRE + CARTA CON MÁQUINA DE ESCRIBIR
// ============================================
const sobre = document.getElementById("sobre");
const btnAbrir = document.getElementById("btnAbrir");
const sobreStage = document.getElementById("sobreStage");
const cartaStage = document.getElementById("cartaStage");
const btnScroll = document.getElementById("btnScroll");

// ⚠️ PERSONALIZA ESTAS 3 FRASES
const LINEA1 = "Para la persona más especial del mundo...";
const LINEA2 = "Feliz Cumpleaños, [SU NOMBRE] ❤";
const LINEA3 = "Te escribí algo que quiero que leas.";

let introYaAbierta = false;

// --- Máquina de escribir ---
function escribirLinea(el, texto, velocidad = 55) {
  return new Promise((resolve) => {
    let i = 0;
    el.textContent = "";
    const intervalo = setInterval(() => {
      el.textContent += texto.charAt(i);
      i++;
      if (i >= texto.length) {
        clearInterval(intervalo);
        resolve();
      }
    }, velocidad);
  });
}

async function reproducirCarta() {
  const l1 = document.getElementById("linea1");
  const l2 = document.getElementById("linea2");
  const l3 = document.getElementById("linea3");
  const cursor = document.getElementById("cursor");

  await escribirLinea(l1, LINEA1, 55);
  await new Promise((r) => setTimeout(r, 400));

  cursor.style.display = "none";
  await escribirLinea(l2, LINEA2, 75);
  await new Promise((r) => setTimeout(r, 400));

  cursor.style.display = "inline-block";
  await escribirLinea(l3, LINEA3, 50);

  await new Promise((r) => setTimeout(r, 500));
  cursor.style.display = "none";
  btnScroll.style.opacity = "1";
  btnScroll.style.pointerEvents = "auto";
}

// --- Abrir sobre (y arrancar música) ---
function abrirSobre() {
  if (introYaAbierta) return;
  introYaAbierta = true;

  // Arranca la música justo aquí (momento emotivo y permitido por el navegador)
  reproducirMusica();

  sobre.classList.add("abierto");
  btnAbrir.style.opacity = "0";
  btnAbrir.style.pointerEvents = "none";

  setTimeout(() => {
    sobreStage.classList.add("hidden");
    cartaStage.classList.add("visible");
    setTimeout(reproducirCarta, 400);
  }, 700);
}

sobre.addEventListener("click", abrirSobre);
btnAbrir.addEventListener("click", abrirSobre);

// --- Botón "Abrir mi regalo" → scroll suave ---
btnScroll.addEventListener("click", () => {
  document.querySelector(".contador-section").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
});

// ============================================
// CARRUSELES
// ============================================
document.querySelectorAll("[data-carrusel]").forEach((carrusel) => {
  const track = carrusel.querySelector(".carrusel-track");
  const imgs = carrusel.querySelectorAll(".carrusel-img");
  const btnPrev = carrusel.querySelector(".prev");
  const btnNext = carrusel.querySelector(".next");
  const dotsContainer = carrusel.querySelector(".carrusel-dots");
  let index = 0;

  // Crear dots
  imgs.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => ir(i));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll("span");

  function actualizar() {
    track.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
    btnPrev.disabled = index === 0;
    btnNext.disabled = index === imgs.length - 1;
  }

  function ir(i) {
    index = Math.max(0, Math.min(i, imgs.length - 1));
    actualizar();
  }

  btnPrev.addEventListener("click", () => ir(index - 1));
  btnNext.addEventListener("click", () => ir(index + 1));

  // Swipe en móvil
  let startX = 0;
  let moviendo = false;

  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
      moviendo = true;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      if (!moviendo) return;
      const diff = e.touches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        if (diff < 0) ir(index + 1);
        else ir(index - 1);
        moviendo = false;
      }
    },
    { passive: true },
  );

  track.addEventListener("touchend", () => {
    moviendo = false;
  });

  // Flechas del teclado
  carrusel.setAttribute("tabindex", "0");
  carrusel.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") ir(index - 1);
    if (e.key === "ArrowRight") ir(index + 1);
  });

  actualizar();

  // Click en imagen → abrir lightbox
  imgs.forEach((img) => {
    img.addEventListener("click", (e) => {
      if (Math.abs(e.clientX - startX) < 5) {
        abrirLightbox(img.dataset.img, img.alt);
      }
    });
  });
});

// ============================================
// LIGHTBOX
// ============================================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

function abrirLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt || "";
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
  setTimeout(() => {
    lightboxImg.src = "";
  }, 350);
}

lightboxClose.addEventListener("click", cerrarLightbox);
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) cerrarLightbox();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("active")) {
    cerrarLightbox();
  }
});

// Click en imágenes de la galería → abrir lightbox también
document.querySelectorAll(".galeria img").forEach((img) => {
  img.addEventListener("click", () => {
    abrirLightbox(img.src, img.alt);
  });
});

// ============================================
// CONFETI (SIN LIBRERÍAS)
// ============================================
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let confettis = [];
let animando = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function lanzarConfetti() {
  confettis = [];
  const colores = ["#ff6b9d", "#ffc2d6", "#ffe5ec", "#ffffff", "#ff477e"];

  for (let i = 0; i < 150; i++) {
    confettis.push({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 8 + 4,
      color: colores[Math.floor(Math.random() * colores.length)],
      rot: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 10,
    });
  }

  if (!animando) {
    animando = true;
    animarConfetti();
  }
}

function animarConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  confettis.forEach((c) => {
    c.x += c.vx;
    c.y += c.vy;
    c.rot += c.vrot;

    ctx.save();
    ctx.translate(c.x, c.y);
    ctx.rotate((c.rot * Math.PI) / 180);
    ctx.fillStyle = c.color;
    ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
    ctx.restore();
  });

  confettis = confettis.filter((c) => c.y < canvas.height + 20);

  if (confettis.length > 0) {
    requestAnimationFrame(animarConfetti);
  } else {
    animando = false;
  }
}

// Botón "Te amo" → lanza confeti
document.getElementById("btnAmor").addEventListener("click", () => {
  lanzarConfetti();
  setTimeout(lanzarConfetti, 400);
});

// ============================================
// EXTRAS: CONFETI AL SALIR DE LA INTRO
// ============================================
// (Opcional: un pequeño estallido al pulsar "Abrir mi regalo")
btnScroll.addEventListener("click", () => {
  lanzarConfetti();
});
