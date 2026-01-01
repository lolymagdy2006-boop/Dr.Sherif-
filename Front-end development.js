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
        yearBtn.innerText = year ? "Year: " + year.split(' ')[1] : "Select Year";
        yearBtn.style.backgroundColor = year ? "#660000" : "transparent";
        yearBtn.style.boxShadow = year ? "inset 0 0 10px rgba(0,0,0,0.5)" : "none";
    }

    // Close dropdown
    const yearContent = document.querySelector('#yearBtn + .dropdown-content');
    if (yearContent) yearContent.style.display = 'none';
    
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
        semBtn.innerText = semester ? "Sem: " + semester.split(' ')[1] : "Select Semester";
        semBtn.style.backgroundColor = semester ? "#660000" : "transparent";
        semBtn.style.boxShadow = semester ? "inset 0 0 10px rgba(0,0,0,0.5)" : "none";
    }

    // Close dropdown
    const semContent = document.querySelector('#semBtn + .dropdown-content');
    if (semContent) semContent.style.display = 'none';
    
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
 * Duplicates visible cards for infinite loop
 */
function duplicateForLoop(sectionSelector) {
    const track = document.querySelector(sectionSelector + ' .carousel-track');
    if (!track) return;

    // Remove existing clones
    track.querySelectorAll('.clone').forEach(clone => clone.remove());

    const cards = track.querySelectorAll('.path-card');
    const visibleCards = Array.from(cards).filter(card => card.style.display !== 'none');

    const visibleCount = visibleCards.length;

    if (visibleCount < 4) {
        track.style.animation = 'none';
        return;
    }

    // Duplicate visible cards
    visibleCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
    });

    // Set duration based on visible count
    const duration = visibleCount * 3.33;
    track.style.animationDuration = `${duration}s`;
    track.style.animation = `scroll ${duration}s linear infinite`;
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
        
        card.style.display = (matchesYear && matchesSem) ? 'flex' : 'none';
    });

    duplicateForLoop('.filtered-carousel-section');
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

    // Duplicate for main carousel
    duplicateForLoop('.main-carousel-section');

    // Initial setup
    toggleCarousels();
    filterCards();

    // Dropdown click toggle
    const yearBtn = document.getElementById('yearBtn');
    const semBtn = document.getElementById('semBtn');

    yearBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const content = yearBtn.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });

    semBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const content = semBtn.nextElementSibling;
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        const yearDropdown = yearBtn.parentElement;
        const semDropdown = semBtn.parentElement;

        if (!yearDropdown.contains(event.target)) {
            yearDropdown.querySelector('.dropdown-content').style.display = 'none';
        }
        if (!semDropdown.contains(event.target)) {
            semDropdown.querySelector('.dropdown-content').style.display = 'none';
        }
    });

    // Carousel arrow click manual scroll and pause
    const arrows = document.querySelectorAll('.arrow');
    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            const section = arrow.closest('.carousel-section');
            const carousel = section.querySelector('.carousel');
            const track = section.querySelector('.carousel-track');
            const direction = arrow.classList.contains('left') ? -330 : 330;
            carousel.scrollBy({ left: direction, behavior: 'smooth' });
            track.style.animationPlayState = 'paused';
        });
    });

    // Pause on hover for all tracks
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        carousel.addEventListener('mouseenter', () => {
            track.style.animationPlayState = 'paused';
        });
        carousel.addEventListener('mouseleave', () => {
            track.style.animationPlayState = 'running';
        });
    });
});
