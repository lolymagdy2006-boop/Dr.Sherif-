document.addEventListener("DOMContentLoaded", () => {
    /* ================= 1. INFINITE CAROUSEL LOGIC ================= */
    const track = document.querySelector(".carousel-track");
    const carouselSection = document.querySelector(".carousel-section");

    if (track) {
        // Clone the content to create a seamless loop
        track.innerHTML += track.innerHTML;

        let position = 0;
        let isPaused = false;
        const speed = 0.8; // Adjust for smoothness

        function moveCarousel() {
            if (!isPaused) {
                position -= speed;
                // Reset to 0 when half the track (the original content) has passed
                if (Math.abs(position) >= track.scrollWidth / 2) {
                    position = 0;
                }
                track.style.transform = `translateX(${position}px)`;
            }
            requestAnimationFrame(moveCarousel);
        }

        // Pause on Hover
        track.addEventListener("mouseenter", () => isPaused = true);
        track.addEventListener("mouseleave", () => isPaused = false);

        moveCarousel();
    }

    /* ================= 2. SECTION COMPLETION LOGIC ================= */
    // This looks at localStorage to see which skill pages the user has visited
    const updateCheckmarks = () => {
        const sections = ['section1', 'section2', 'section3', 'section4', 'section5'];
        sections.forEach(id => {
            if (localStorage.getItem(id + "_completed") === "true") {
                // Find the checkmark span within the card linked to that section
                const checkMark = document.querySelector(`a[href="${id}.html"] .check`);
                if (checkMark) checkMark.style.display = "block";
            }
        });
    };

    updateCheckmarks();
});