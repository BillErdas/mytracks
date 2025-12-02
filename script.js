document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Optional: Add a subtle click animation or sound here if requested
            console.log(`Tab ${tab.dataset.tab} clicked`);
        });
    });

    // Modal Logic
    const modal = document.getElementById('music-modal');
    const closeModal = document.querySelector('.close-modal');
    const player = document.getElementById('soundcloud-player');
    const trackCards = document.querySelectorAll('.track-card');

    trackCards.forEach(card => {
        card.addEventListener('click', () => {
            const trackUrl = card.dataset.trackUrl;
            if (trackUrl) {
                const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
                player.src = embedUrl;
                modal.classList.remove('hidden');
            }
        });
    });

    // Scroll Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a staggered delay based on index for a nice cascade effect
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 50); // 50ms delay per item in the batch
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Dynamic Background Logic
    const dynamicBg = document.getElementById('dynamic-bg');

    trackCards.forEach(card => {
        observer.observe(card);

        // Hover effect for background
        card.addEventListener('mouseenter', () => {
            const img = card.querySelector('img');
            if (img && dynamicBg) {
                dynamicBg.style.backgroundImage = `url('${img.src}')`;
                dynamicBg.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            if (dynamicBg) {
                dynamicBg.style.opacity = '0';
            }
        });
    });

    const closeMusicModal = () => {
        modal.classList.add('hidden');
        player.src = ""; // Stop playback
    };

    if (closeModal) {
        closeModal.addEventListener('click', closeMusicModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMusicModal();
        }
    });
});
