// 1. Memory storage for user choices
let chosenYear = null;
let chosenSemester = null;

/**
 * Handles Year Selection from Dropdown
 */
function selectYear(year) {
    chosenYear = year;
    
    // Update the Button UI
    const yearBtn = document.getElementById('yearBtn');
    if (yearBtn) {
        yearBtn.innerText = "Year: " + year.split(' ')[1];
        yearBtn.style.backgroundColor = "#660000";
        yearBtn.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.5)";
    }
    
    filterCards();
    toggleCarousels();
    updateStatus();
}

/**
 * Handles Semester Selection from Dropdown
 */
function selectSemester(semester) {
    chosenSemester = semester;
    
    // Update the Button UI
    const semBtn = document.getElementById('semBtn');
    if (semBtn) {
        semBtn.innerText = "Sem: " + semester.split(' ')[1];
        semBtn.style.backgroundColor = "#660000";
        semBtn.style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.5)";
    }
    
    filterCards();
    toggleCarousels();
    updateStatus();
}

/**
 * Toggles between main and filtered carousels
 */
function toggleCarousels() {
    const main = document.querySelector('.main-carousel-section');
    const filtered = document.querySelector('.filtered-carousel-section');
    if (main && filtered) {
        if (chosenYear || chosenSemester) {
            main.style.display = 'none';
            filtered.style.display = 'block';
        } else {
            main.style.display = 'block';
            filtered.style.display = 'none';
        }
    }
}

/**
 * Filters the syllabus cards based on current selections (only in filtered carousel)
 */
function filterCards() {
    const cards = document.querySelectorAll('.filtered-carousel-section .path-card');
    
    cards.forEach(card => {
        const cardYear = card.dataset.year;
        const cardSem = card.dataset.semester;
        
        const matchesYear = !chosenYear || cardYear === chosenYear;
        const matchesSem = !chosenSemester || cardSem === chosenSemester;
        
        if (matchesYear && matchesSem) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Updates the Hero text to guide the user
 */
function updateStatus() {
    const statusText = document.getElementById('status-text');
    if (!statusText) return;

    if (chosenYear && chosenSemester) {
        statusText.innerHTML = `Showing: <strong>${chosenYear} - ${chosenSemester}</strong>`;
        statusText.style.color = "#00ff00";
    } else if (chosenYear) {
        statusText.innerText = `Showing all semesters of ${chosenYear}. Select a semester to narrow down.`;
        statusText.style.color = "#ffffff";
    } else if (chosenSemester) {
        statusText.innerText = `Showing all years for ${chosenSemester}. Please select a Year first for better filtering.`;
        statusText.style.color = "#ffffff";
    } else {
        statusText.innerText = "Please select a Year and Semester from the menu above.";
        statusText.style.color = "#ffffff";
    }
}

/**
 * Page Setup on Load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initial setup
    toggleCarousels();
    filterCards();

    // Carousel arrow click pause and manual scroll
    const leftBtns = document.querySelectorAll('.arrow.left');
    const rightBtns = document.querySelectorAll('.arrow.right');

    leftBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.carousel-section');
            const carousel = section.querySelector('.carousel');
            const track = section.querySelector('.carousel-track');
            carousel.scrollBy({ left: -330, behavior: 'smooth' });
            track.style.animationPlayState = 'paused';
        });
    });

    rightBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.closest('.carousel-section');
            const carousel = section.querySelector('.carousel');
            const track = section.querySelector('.carousel-track');
            carousel.scrollBy({ left: 330, behavior: 'smooth' });
            track.style.animationPlayState = 'paused';
        });
    });

    // Pause on hover for all tracks
    const tracks = document.querySelectorAll('.carousel-track');
    tracks.forEach(track => {
        track.parentElement.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        track.parentElement.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });
});
