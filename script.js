// ==========================================
// MAKATAONG KILOS
// INTERACTIVE PRESENTATION
// ==========================================

const slides = Array.from(document.querySelectorAll(".slide"));

let currentIndex = 0;
let soundEnabled = true;
let audioContext = null;
let quizIndex = 0;
let score = 0;
let answered = false;

const totalSlides = slides.length;

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const currentSlide = document.getElementById("currentSlide");
const totalSlidesDisplay = document.getElementById("totalSlides");
const indicatorFill = document.getElementById("indicatorFill");

totalSlidesDisplay.textContent =
  String(totalSlides).padStart(2, "0");

// ==========================================
// PARTICLES
// ==========================================

const particleContainer = document.getElementById("particles");

for (let i = 0; i < 35; i++) {
  const particle = document.createElement("div");

  particle.className = "particle";
  particle.style.left = Math.random() * 100 + "%";
  particle.style.animationDuration =
    (8 + Math.random() * 15) + "s";

  particle.style.animationDelay =
    (-Math.random() * 20) + "s";

  particleContainer.appendChild(particle);
}

// ==========================================
// SOUND ENGINE
// ==========================================

function getAudio() {
  if (!audioContext) {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) return null;

    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  return audioContext;
}

function playTone(frequency, duration, type = "sine", volume = 0.08) {
  if (!soundEnabled) return;

  const ctx = getAudio();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + duration
  );

  oscillator.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}

function playClick() {
  playTone(650, 0.09, "sine", 0.05);
}

function playTransition() {
  playTone(400, 0.12, "sine", 0.04);

  setTimeout(() => {
    playTone(620, 0.16, "sine", 0.04);
  }, 100);
}

function playCorrect() {
  playTone(523, 0.16, "sine", 0.08);

  setTimeout(() => playTone(659, 0.16, "sine", 0.08), 120);

  setTimeout(() => playTone(784, 0.25, "sine", 0.08), 240);
}

function playWrong() {
  playTone(260, 0.2, "triangle", 0.07);

  setTimeout(() => {
    playTone(190, 0.25, "triangle", 0.06);
  }, 160);
}

function playVictory() {
  [523, 659, 784, 1046].forEach((frequency, index) => {
    setTimeout(() => {
      playTone(frequency, 0.4, "sine", 0.07);
    }, index * 160);
  });
}

// ==========================================
// SOUND BUTTON
// ==========================================

const soundBtn = document.getElementById("soundBtn");

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;

  soundBtn.textContent = soundEnabled ? "🔊" : "🔇";

  if (soundEnabled) {
    playClick();
  }
});

// ==========================================
// FULLSCREEN
// ==========================================

document.getElementById("fullscreenBtn")
  .addEventListener("click", async () => {

    playClick();

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.log("Fullscreen is not supported here.");
    }
  });

// ==========================================
// SLIDE NAVIGATION
// ==========================================

function updateNavigation() {
  currentSlide.textContent =
    String(currentIndex + 1).padStart(2, "0");

  indicatorFill.style.width =
    ((currentIndex + 1) / totalSlides * 100) + "%";

  prevBtn.disabled = currentIndex === 0;

  nextBtn.disabled = currentIndex === totalSlides - 1;

  // Hide normal navigation on the quiz itself.
  const quizActive =
    slides[currentIndex].classList.contains("quiz-slide");

  document.getElementById("controls").style.opacity =
    quizActive ? "0" : "1";

  document.getElementById("controls").style.pointerEvents =
    quizActive ? "none" : "auto";
}

function showSlide(index, direction = "right") {
  if (index < 0 || index >= totalSlides) return;

  const previous = slides[currentIndex];

  previous.classList.remove("active");
  previous.classList.remove("exit-left");

  if (direction === "right") {
    previous.classList.add("exit-left");
  }

  currentIndex = index;

  const next = slides[currentIndex];

  next.classList.remove("exit-left");

  void next.offsetWidth;

  next.classList.add("active");

  updateNavigation();

  if (soundEnabled) {
    playTransition();
  }
}

function nextSlide() {
  if (currentIndex >= totalSlides - 1) return;

  showSlide(currentIndex + 1, "right");
}

function prevSlide() {
  if (currentIndex <= 0) return;

  showSlide(currentIndex - 1, "left");
}

prevBtn.addEventListener("click", () => {
  playClick();
  prevSlide();
});

nextBtn.addEventListener("click", () => {
  playClick();
  nextSlide();
});

// ==========================================
// KEYBOARD CONTROLS
// ==========================================

document.addEventListener("keydown", (event) => {
  if (event.target.matches("input, textarea, select")) return;

  if (event.key === "ArrowRight" || event.key === " ") {
    event.preventDefault();

    if (
      slides[currentIndex].classList.contains("quiz-slide")
    ) return;

    nextSlide();
  }

  if (event.key === "ArrowLeft") {
    if (
      slides[currentIndex].classList.contains("quiz-slide")
    ) return;

    prevSlide();
  }
});

// ==========================================
// QUIZ QUESTIONS
// Based on the submitted PPT
// ==========================================

const questions = [
  {
    question: "Ano ang tatlong batayan ng makataong kilos?",
    options: [
      "Kaalaman, layunin at pagpili",
      "Lakas, bilis at talino",
      "Takot, galit at saya",
      "Pera, oras at kapangyarihan"
    ],
    answer: 0,
    explanation:
      "Tama! Ang makataong kilos ay may kaalaman, layunin at malayang pagpili."
  },
  {
    question: "Anong uri ng kilos ang biglang hindi sinasadyang pagbahing?",
    options: [
      "Kusang-loob",
      "Kilos ng tao",
      "Makataong kilos",
      "Pananagutan"
    ],
    answer: 1,
    explanation:
      "Tama! Ang biglang pagbahing ay isang awtomatikong kilos."
  },
  {
    question: "Ano ang ibig sabihin ng dignidad?",
    options: [
      "Pagiging sikat",
      "Pagkakaroon ng maraming pera",
      "Likas na halaga at karapatan ng bawat tao",
      "Pagiging mas mataas sa iba"
    ],
    answer: 2,
    explanation:
      "Tama! Bawat tao ay may likas na halaga at karapatang dapat igalang."
  },
  {
    question: "Ano ang dapat alamin bago uriin ang isang pagtawa?",
    options: [
      "Edad ng tao",
      "Intensiyon at konteksto",
      "Damit na suot",
      "Lugar na pinagtawanan"
    ],
    answer: 1,
    explanation:
      "Tama! Maaaring sorpresa lamang o sinadyang pangungutya ang pagtawa."
  },
  {
    question: "Ano ang mas ligtas na tugon sa mapanganib na alok?",
    options: [
      "Sumunod agad",
      "Huwag mag-isip",
      "Tumanggi at humingi ng tulong",
      "Himukin ang iba"
    ],
    answer: 2,
    explanation:
      "Tama! Mahalagang tumanggi sa mapanganib na alok at humingi ng tulong."
  },
  {
    question: "Ano ang tatlong uri ayon sa pagkukusa?",
    options: [
      "Mabilis, mabagal at katamtaman",
      "Kusang-loob, walang kusang-loob at di kusang-loob",
      "Mabuti, masama at neutral",
      "Lakas, talino at tapang"
    ],
    answer: 1,
    explanation:
      "Tama! Ito ang tatlong uri ayon sa pagkukusa sa aralin."
  },
  {
    question: "Ano ang dapat suriin kapag may banta o pamimilit?",
    options: [
      "Kulay ng damit",
      "Bilang ng kaibigan",
      "Antas ng kalayaan at kaalaman",
      "Edad lamang"
    ],
    answer: 2,
    explanation:
      "Tama! Mahalagang alamin ang kaalaman at tunay na kalayaan ng tao."
  },
  {
    question: "Ano ang dapat gawin kapag nakakita ng napulot na ID?",
    options: [
      "Itago ito",
      "Itapon ito",
      "Ibalik sa may-ari",
      "Ipamigay sa iba"
    ],
    answer: 2,
    explanation:
      "Tama! Ang kusang pagbabalik ay nagpapakita ng paggalang sa kapuwa."
  },
  {
    question: "Alin ang unang hakbang sa limang bahagi ng pagsusuri?",
    options: [
      "Bunga",
      "Dignidad",
      "Sitwasyon",
      "Pagpili"
    ],
    answer: 2,
    explanation:
      "Tama! Unang alamin kung ano ang nangyari sa sitwasyon."
  },
  {
    question: "Totoo ba na ang lahat ng makataong kilos ay mabuti?",
    options: [
      "Oo, palagi",
      "Hindi, maaari ring may maling sinadyang pasiya",
      "Oo, kapag mabilis ginawa",
      "Hindi, dahil walang pananagutan"
    ],
    answer: 1,
    explanation:
      "Tama! Ang makataong kilos ay maaaring mabuti o mali depende sa pasiya at layunin."
  }
];

// ==========================================
// QUIZ START
// ==========================================

function startQuiz() {
  playClick();

  quizIndex = 0;
  score = 0;
  answered = false;

  showSlide(findSlideIndex("quiz-slide"));

  displayQuestion();
}

function findSlideIndex(className) {
  return slides.findIndex(slide =>
    slide.classList.contains(className)
  );
}

// ==========================================
// DISPLAY QUESTION
// ==========================================

function displayQuestion() {
  answered = false;

  const question = questions[quizIndex];

  document.getElementById("questionNumber").textContent =
    `QUESTION ${quizIndex + 1}/${questions.length}`;

  document.getElementById("scoreDisplay").textContent =
    `SCORE: ${score}`;

  document.getElementById("questionText").textContent =
    question.question;

  document.getElementById("quizProgress").style.width =
    ((quizIndex + 1) / questions.length * 100) + "%";

  document.getElementById("feedback").textContent = "";

  document.getElementById("feedback").className = "feedback";

  document.getElementById("nextQuestionBtn")
    .classList.add("hidden");

  const answerContainer =
    document.getElementById("answerOptions");

  answerContainer.innerHTML = "";

  question.options.forEach((option, index) => {
    const button = document.createElement("button");

    button.className = "answer-btn";

    button.textContent =
      String.fromCharCode(65 + index) + ". " + option;

    button.addEventListener("click", () => {
      checkAnswer(index, button);
    });

    answerContainer.appendChild(button);
  });
}

// ==========================================
// CHECK ANSWER
// ==========================================

function checkAnswer(selected, selectedButton) {
  if (answered) return;

  answered = true;

  const question = questions[quizIndex];

  const buttons = document.querySelectorAll(".answer-btn");

  buttons.forEach(button => {
    button.disabled = true;
  });

  const feedback = document.getElementById("feedback");

  if (selected === question.answer) {
    score++;

    selectedButton.classList.add("correct");

    feedback.textContent =
      "✓ CORRECT! " + question.explanation;

    feedback.classList.add("good");

    playCorrect();

  } else {
    selectedButton.classList.add("wrong");

    buttons[question.answer].classList.add("correct");

    feedback.textContent =
      "✗ NOT QUITE. " + question.explanation;

    feedback.classList.add("bad");

    playWrong();
  }

  document.getElementById("scoreDisplay").textContent =
    `SCORE: ${score}`;

  document.getElementById("nextQuestionBtn")
    .classList.remove("hidden");
}

// ==========================================
// NEXT QUESTION
// ==========================================

function nextQuestion() {
  if (!answered) return;

  playClick();

  quizIndex++;

  if (quizIndex < questions.length) {
    displayQuestion();
  } else {
    showResult();
  }
}

// ==========================================
// FINAL RESULT
// ==========================================

function showResult() {
  showSlide(findSlideIndex("result-slide"));

  document.getElementById("finalScore").textContent = score;

  const title = document.getElementById("resultTitle");
  const message = document.getElementById("resultMessage");

  if (score === 10) {
    title.textContent = "PERFECT SCORE!";
    message.textContent =
      "Outstanding! Napakahusay ng iyong pag-unawa sa aralin.";
  } else if (score >= 8) {
    title.textContent = "EXCELLENT!";
    message.textContent =
      "Napakagaling! Malawak ang iyong pag-unawa sa makataong kilos.";
  } else if (score >= 6) {
    title.textContent = "WELL DONE!";
    message.textContent =
      "Maganda ang iyong resulta. Ipagpatuloy ang pag-aaral!";
  } else {
    title.textContent = "KEEP LEARNING!";
    message.textContent =
      "Balikan ang mga aralin at patuloy na matuto. Kaya mo iyan!";
  }

  playVictory();
}

// ==========================================
// THANK YOU
// ==========================================

function showThankYou() {
  playClick();

  showSlide(findSlideIndex("thankyou-slide"));
}

function openCredits() {
  const paper = document.getElementById("creditsPaper");
  const envelope = document.getElementById("envelopeBtn");

  if (paper.classList.contains("show")) {
    paper.classList.remove("show");

    envelope.style.display = "flex";

    playClick();

  } else {
    paper.classList.add("show");

    envelope.style.display = "none";

    playVictory();
  }
}

// ==========================================
// RESTART
// ==========================================

function restartPresentation() {
  playClick();

  document.getElementById("creditsPaper")
    .classList.remove("show");

  document.getElementById("envelopeBtn")
    .style.display = "flex";

  quizIndex = 0;
  score = 0;
  answered = false;

  showSlide(0);
}

// ==========================================
// INITIALIZE
// ==========================================

updateNavigation();
