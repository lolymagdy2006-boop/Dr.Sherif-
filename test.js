document.addEventListener("DOMContentLoaded", () => {
    const questionBank = [
        {
            q: "What is the primary role of a Backend Framework?",
            options: ["UI Design", "Server-side logic and APIs", "Browser rendering"],
            correct: 1
        },
        {
            q: "Which format is widely used for data exchange in Web Services?",
            options: ["PNG", "JSON", "MP4"],
            correct: 1
        },
        {
            q: "The 'Observer' pattern is used for:",
            options: ["Database backups", "Notifying objects of state changes", "Styling text"],
            correct: 1
        },
        {
            q: "In OOP, 'Encapsulation' means:",
            options: ["Sharing data publicly", "Bundling data and methods together", "Deleting unused code"],
            correct: 1
        },
        {
            q: "MVC stands for:",
            options: ["Model View Controller", "Main Visual Code", "Multiple Virtual Computers"],
            correct: 0
        }
    ];

    const startBtn = document.getElementById("startTestBtn");
    const testContainer = document.getElementById("testContainer");
    const questionsArea = document.getElementById("questionsArea");
    const submitBtn = document.getElementById("submitTestBtn");
    const timerEl = document.getElementById("timer");
    const resultEl = document.getElementById("testResult");

    let timeLeft = 300; // 5 minutes
    let timerInterval;

    if (startBtn) {
        startBtn.addEventListener("click", () => {
            startBtn.style.display = "none";
            testContainer.classList.remove("hidden");
            startTimer();
            renderQuestions();
        });
    }

    function renderQuestions() {
        questionsArea.innerHTML = questionBank.map((q, i) => `
            <div class="test-q">
                <p><strong>${i + 1}. ${q.q}</strong></p>
                ${q.options.map((opt, idx) => `
                    <label class="option-card">
                        <input type="radio" name="q${i}" value="${idx}">
                        <span>${opt}</span>
                    </label>
                `).join('')}
            </div>
        `).join('');
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            let mins = Math.floor(timeLeft / 60);
            let secs = timeLeft % 60;
            timerEl.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
            if (timeLeft-- <= 0) submitTest();
        }, 1000);
    }

    function submitTest() {
        clearInterval(timerInterval);
        let score = 0;
        
        questionBank.forEach((q, i) => {
            const selected = document.querySelector(`input[name="q${i}"]:checked`);
            if (selected && parseInt(selected.value) === q.correct) {
                score++;
            }
        });

        const percent = (score / questionBank.length) * 100;
        resultEl.innerHTML = `
            <div style="background: #003366; color: white; padding: 20px; border-radius: 15px;">
                <h3>Your Score: ${score} / ${questionBank.length} (${percent}%)</h3>
                <p>${percent >= 60 ? "Congratulations! You passed." : "Please review the materials and try again."}</p>
                <button onclick="location.reload()" class="test-btn">Restart</button>
            </div>
        `;
    }

    if (submitBtn) submitBtn.addEventListener("click", submitTest);
});