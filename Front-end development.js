/* ================= CONTINUOUS DYNAMIC CAROUSEL LOGIC ================= */
const carousel = document.querySelector("#carousel");
const track = carousel.querySelector(".carousel-track");
const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");

// 1. Clone the cards to ensure there's enough content for a seamless loop
const cards = Array.from(track.children);
cards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});

// 2. Continuous Animation Logic
let scrollSpeed = 1; // Adjust this number to make it faster or slower
let scrollPos = 0;
let animationId;
const totalWidth = cards.length * 330; // 330 is card width + margin

function step() {
    scrollPos -= scrollSpeed;
    
    // If we've scrolled past the original set of cards, reset to 0 seamlessly
    if (Math.abs(scrollPos) >= totalWidth) {
        scrollPos = 0;
    }
    
    track.style.transform = `translateX(${scrollPos}px)`;
    animationId = requestAnimationFrame(step);
}

// Start the continuous movement
animationId = requestAnimationFrame(step);

// 3. Pause on Hover
carousel.addEventListener('mouseenter', () => cancelAnimationFrame(animationId));
carousel.addEventListener('mouseleave', () => animationId = requestAnimationFrame(step));

// 4. Manual Navigation (Optional - allows clicking arrows to skip)
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


/* ================= FRONT-END TEST LOGIC ================= */

const startBtn = document.getElementById("startTestBtn");
const testContainer = document.getElementById("testContainer");
const questionsArea = document.getElementById("questionsArea");
const submitBtn = document.getElementById("submitTestBtn");
const timerEl = document.getElementById("timer");
const resultEl = document.getElementById("testResult");

const questionBank = [
    {
        q: "Which CSS property is used to create a flexible layout container?",
        options: ["display: block", "display: flex", "display: grid-template"],
        correct: 1,
        explain: "Flexbox (display: flex) allows for easy alignment of items in rows or columns."
    },
    {
        q: "What is the primary purpose of 'Semantic HTML' (e.g., using <nav>)?",
        options: ["Faster loading", "Improved accessibility and SEO", "Change text color"],
        correct: 1,
        explain: "Semantic tags help screen readers and search engines understand page structure."
    },
    {
        q: "Which method is used to store data in the browser that persists after closing the tab?",
        options: ["sessionStorage", "JSON.parse()", "localStorage"],
        correct: 2,
        explain: "localStorage saves data with no expiration date."
    },
    {
        q: "What does a JavaScript Promise represent?",
        options: ["A constant value", "The eventual completion of an async operation", "A CSS animation"],
        correct: 1,
        explain: "Promises handle asynchronous tasks like data fetching."
    },
    {
        q: "Which DOM property allows you to change the text inside an HTML element?",
        options: ["element.textContent", "element.style", "element.href"],
        correct: 0,
        explain: ".textContent is the standard way to update text content via JS."
    }
];

let selectedQuestions = [];
let timeLeft = 300;
let timerInterval;

startBtn.onclick = () => {
    startBtn.style.display = "none";
    testContainer.style.display = "block"; 
    testContainer.classList.remove("hidden");
    timeLeft = 300;
    startTimer();
    renderQuestions();
};

function renderQuestions() {
    questionsArea.innerHTML = "";
    selectedQuestions = [...questionBank].sort(() => 0.5 - Math.random()).slice(0, 5);

    selectedQuestions.forEach((q, i) => {
        const div = document.createElement("div");
        div.className = "test-q";
        div.innerHTML = `
            <p class="test-title"><strong>${i + 1}. ${q.q}</strong></p>
            <div class="options">
                ${q.options.map((opt, idx) => `
                    <label class="option-card">
                        <input type="radio" name="test${i}" value="${idx}">
                        <span>${opt}</span>
                    </label>
                `).join("")}
            </div>
        `;
        questionsArea.appendChild(div);
    });
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let min = Math.floor(timeLeft / 60);
        let sec = timeLeft % 60;
        timerEl.textContent = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        if (timeLeft <= 0) submitTest();
        timeLeft--;
    }, 1000);
}

submitBtn.onclick = submitTest;

function submitTest() {
    clearInterval(timerInterval);
    submitBtn.disabled = true;
    let score = 0;
    resultEl.innerHTML = "";

    selectedQuestions.forEach((q, i) => {
        const selected = document.querySelector(`input[name="test${i}"]:checked`);
        const isCorrect = selected && parseInt(selected.value) === q.correct;
        if (isCorrect) score++;

        const resDiv = document.createElement("div");
        resDiv.className = `result-q ${isCorrect ? 'correct' : 'wrong'}`;
        resDiv.innerHTML = `
            <p><strong>Q${i + 1}:</strong> ${q.q}</p>
            <p>${isCorrect ? "✔ Correct" : "❌ Wrong"}</p>
            ${!isCorrect ? `<p><small>Correct Answer: ${q.options[q.correct]}. ${q.explain}</small></p>` : ""}
        `;
        resultEl.appendChild(resDiv);
    });

    const percent = Math.round((score / selectedQuestions.length) * 100);
    resultEl.insertAdjacentHTML("afterbegin", `
        <div style="margin-bottom: 20px; padding: 20px; border-radius: 10px; background: #003366; color: white;">
            <h2>Assessment Complete!</h2>
            <p>Your Score: ${percent}% (${score}/${selectedQuestions.length})</p>
        </div>
    `);
    
    resultEl.scrollIntoView({ behavior: 'smooth' });
}