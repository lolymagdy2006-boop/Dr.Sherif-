/* ================= CONTINUOUS DYNAMIC CAROUSEL LOGIC ================= */
const carousel = document.querySelector("#carousel");
const track = carousel.querySelector(".carousel-track");
const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");

// 1. Clone the cards for a seamless infinite loop
const cards = Array.from(track.children);
cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});

// 2. Continuous Animation Settings
let scrollSpeed = 1; // Change this to adjust speed (e.g., 0.5 for slower)
let scrollPos = 0;
let animationId;
const totalWidth = cards.length * 330; // Card width (300) + margins (15+15)

function step() {
    scrollPos -= scrollSpeed;
    
    // Seamless reset logic
    if (Math.abs(scrollPos) >= totalWidth) {
        scrollPos = 0;
    }
    
    track.style.transform = `translateX(${scrollPos}px)`;
    animationId = requestAnimationFrame(step);
}

// Start moving immediately
animationId = requestAnimationFrame(step);

// 3. Hover Interactions
carousel.addEventListener('mouseenter', () => cancelAnimationFrame(animationId));
carousel.addEventListener('mouseleave', () => animationId = requestAnimationFrame(step));

// 4. Manual Navigation
nextBtn.addEventListener('click', () => {
    scrollPos -= 330;
    if (Math.abs(scrollPos) >= totalWidth) scrollPos = 0;
    track.style.transform = `translateX(${scrollPos}px)`;
});

prevBtn.addEventListener('click', () => {
    scrollPos += 330;
    if (scrollPos > 0) scrollPos = -totalWidth + 330;
    track.style.transform = `translateX(${scrollPos}px)`;
});

/* ================= SCROLL PROGRESS ================= */
window.addEventListener("scroll", () => {
  const scrollTop = document.documentElement.scrollTop;
  const height =
    document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  const progressBar = document.getElementById("progressBar");
  if (progressBar) {
    progressBar.style.width = (scrollTop / height) * 100 + "%";
  }
});

/* ================= SECTION COMPLETION ================= */
const sections = document.querySelectorAll(".card");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      if (id) {
        localStorage.setItem(id, "completed");
        const check = document.querySelector(`.check[data-sec="${id}"]`);
        if (check) check.style.display = "inline";
      }
    }
  });
}, { threshold: 0.6 });

sections.forEach(sec => observer.observe(sec));

window.addEventListener("load", () => {
  sections.forEach(sec => {
    if (sec.id && localStorage.getItem(sec.id) === "completed") {
      const check = document.querySelector(`.check[data-sec="${sec.id}"]`);
      if (check) check.style.display = "inline";
    }
  });
});

/* ================= WEB DEVELOPMENT TEST LOGIC ================= */
const webQuestionBank = [
  {
    q: "In a REST API, which HTTP method is typically used to update an existing resource?",
    options: ["GET", "POST", "PUT"],
    correct: 2,
    explain: "PUT is used to update an existing resource, while POST is usually for creating new ones.",
  },
  {
    q: "Which of the following is a 'NoSQL' database?",
    options: ["MySQL", "MongoDB", "PostgreSQL"],
    correct: 1,
    explain: "MongoDB is a document-oriented NoSQL database; the others are Relational (SQL).",
  },
  {
    q: "What is the purpose of a 'Server-Side Framework' like Node.js or Django?",
    options: ["To style the webpage", "To handle database logic and routing", "To run animations in the browser"],
    correct: 1,
    explain: "Server-side frameworks handle data processing, security, and communication with the database.",
  },
  {
    q: "What does the 'Status Code 404' mean in web communication?",
    options: ["Success", "Internal Server Error", "Resource Not Found"],
    correct: 2,
    explain: "404 is the standard code sent when the server cannot find the requested URL.",
  },
  {
    q: "Which layer of the '3-Tier Architecture' is responsible for data storage?",
    options: ["Presentation Layer", "Application Layer", "Data Layer"],
    correct: 2,
    explain: "The Data Layer (or Database Layer) is where information is stored and retrieved.",
  }
];

const webStartBtn = document.getElementById("webStartBtn");
const webContainer = document.getElementById("webTestContainer");
const webQuestionsArea = document.getElementById("webQuestionsArea");
const webSubmitBtn = document.getElementById("webSubmitBtn");
const webTimerEl = document.getElementById("webTimer");
const webResultEl = document.getElementById("webTestResult");

let webTimeLeft = 300;
let webTimerInterval;

if (webStartBtn) {
    webStartBtn.onclick = () => {
        webStartBtn.style.display = "none";
        webContainer.style.display = "block";
        webContainer.classList.remove("hidden");
        startWebTimer();
        renderWebQuestions();
    };
}

function renderWebQuestions() {
    webQuestionsArea.innerHTML = "";
    webQuestionBank.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "test-q";
        div.innerHTML = `
            <p class="test-title"><strong>${i + 1}. ${q.q}</strong></p>
            <div class="options">
                ${q.options.map((opt, idx) => `
                    <label class="option-card">
                        <input type="radio" name="webtest${i}" value="${idx}">
                        <span>${opt}</span>
                    </label>
                `).join("")}
            </div>
        `;
        webQuestionsArea.appendChild(div);
    });
}

function startWebTimer() {
    clearInterval(webTimerInterval);
    webTimerInterval = setInterval(() => {
        let min = Math.floor(webTimeLeft / 60);
        let sec = webTimeLeft % 60;
        webTimerEl.textContent = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (webTimeLeft <= 0) submitWebTest();
        webTimeLeft--;
    }, 1000);
}

if (webSubmitBtn) {
    webSubmitBtn.onclick = submitWebTest;
}

function submitWebTest() {
    clearInterval(webTimerInterval);
    let score = 0;
    webResultEl.innerHTML = "";

    webQuestionBank.forEach((q, i) => {
        const selected = document.querySelector(`input[name="webtest${i}"]:checked`);
        const isCorrect = selected && parseInt(selected.value) === q.correct;
        if (isCorrect) score++;

        const resDiv = document.createElement("div");
        resDiv.className = `result-q ${isCorrect ? 'correct' : 'wrong'}`;
        resDiv.innerHTML = `<p><strong>Q${i+1}:</strong> ${isCorrect ? "✔" : "❌"} ${q.explain}</p>`;
        webResultEl.appendChild(resDiv);
    });

    webResultEl.insertAdjacentHTML("afterbegin", `
        <div style="margin-bottom: 20px; padding: 20px; border-radius: 10px; background: #003366; color: white; text-align:center;">
            <h3>Final Score: ${score}/${webQuestionBank.length}</h3>
        </div>
    `);
    
    webResultEl.scrollIntoView({ behavior: 'smooth' });
}