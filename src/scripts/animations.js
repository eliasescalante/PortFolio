document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section");

    const onScroll = () => {
        const triggerBottom = window.innerHeight * 0.85;
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < triggerBottom) {
                section.classList.add("visible");
            }
        });
    };

    window.addEventListener("scroll", onScroll);
    onScroll(); // trigger on load
});

window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const hero = document.getElementById("hero");
    if (hero) {
        hero.style.backgroundPositionY = -(scrolled * 0.3) + "px";
    }
});
