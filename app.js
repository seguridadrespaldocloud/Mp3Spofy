// Simple Spotify-like player logic
// Songs from the current folder
const SONGS = [
  "47.mp3",
  "Anuel AA - Qué Nos Pasó_ (Video Oficial).mp3",
  "Aventura.mp3",
  "Bebe.mp3",
  "Como Ex.mp3",
  "Funeral.mp3",
  "McGregor.mp3",
  "Mix Ojitos.mp3",
  "Numb.mp3",
  "Or Nah.mp3",
  "Pa Ti.mp3",
  "PORTATE BONITO.mp3",
  "The Emptiness Machine.mp3",
  "YOGURCITO REMIX.mp3"
];

let currentIndex = 0;
let isPlaying = false;
let isShuffle = false;
let isRepeat = false;

// Elements
const audio = new Audio();
const playlistEl = document.getElementById("playlist");
const playBtn = document.getElementById("btn-play");
const prevBtn = document.getElementById("btn-prev");
const nextBtn = document.getElementById("btn-next");
const shuffleBtn = document.getElementById("btn-shuffle");
const repeatBtn = document.getElementById("btn-repeat");
const progress = document.getElementById("progress");
const timeCurrent = document.getElementById("time-current");
const timeTotal = document.getElementById("time-total");
const volume = document.getElementById("volume");
const searchInput = document.getElementById("search");
const nowTitle = document.getElementById("now-title");

function formatTime(sec) {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function setSource(index) {
  currentIndex = (index + SONGS.length) % SONGS.length;
  audio.src = SONGS[currentIndex];
  nowTitle.textContent = SONGS[currentIndex];
  highlightActive();
}

function play() {
  audio.play();
  isPlaying = true;
  playBtn.textContent = "⏸";
}

function pause() {
  audio.pause();
  isPlaying = false;
  playBtn.textContent = "▶";
}

function togglePlay() {
  if (isPlaying) pause(); else play();
}

function next() {
  if (isShuffle) {
    let n;
    do {
      n = Math.floor(Math.random() * SONGS.length);
    } while (n === currentIndex && SONGS.length > 1);
    setSource(n);
  } else {
    setSource(currentIndex + 1);
  }
  play();
}

function prev() {
  setSource(currentIndex - 1);
  play();
}

function highlightActive() {
  [...playlistEl.children].forEach((li, i) => {
    if (li.dataset.filename === SONGS[currentIndex]) li.classList.add("active");
    else li.classList.remove("active");
  });
}

function renderPlaylist(filter = "") {
  playlistEl.innerHTML = "";
  const norm = (s) => s.toLowerCase();
  SONGS.filter(s => norm(s).includes(norm(filter))).forEach((song, index) => {
    const li = document.createElement("li");
    li.dataset.filename = song;
    const left = document.createElement("div");
    left.className = "name";
    left.textContent = song;

    const right = document.createElement("div");
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "▶";

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const realIndex = SONGS.indexOf(song);
      setSource(realIndex);
      play();
    });

    li.addEventListener("click", () => {
      const realIndex = SONGS.indexOf(song);
      setSource(realIndex);
      play();
    });

    right.appendChild(btn);
    li.appendChild(left);
    li.appendChild(right);
    playlistEl.appendChild(li);
  });
  highlightActive();
}

// Events
playBtn.addEventListener("click", togglePlay);
prevBtn.addEventListener("click", prev);
nextBtn.addEventListener("click", next);
shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "var(--accent)" : "inherit";
});
repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "var(--accent)" : "inherit";
});

volume.addEventListener("input", () => {
  audio.volume = volume.value;
});

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 1000) * audio.duration;
  }
});

audio.addEventListener("timeupdate", () => {
  timeCurrent.textContent = formatTime(audio.currentTime);
  timeTotal.textContent = formatTime(audio.duration || 0);
  if (audio.duration) {
    progress.value = Math.floor((audio.currentTime / audio.duration) * 1000);
  }
});

audio.addEventListener("ended", () => {
  if (isRepeat) {
    audio.currentTime = 0;
    play();
  } else {
    next();
  }
});

searchInput.addEventListener("input", () => {
  renderPlaylist(searchInput.value);
});

// Init
setSource(0);
renderPlaylist();
playBtn.textContent = "▶";
audio.preload = "metadata";
