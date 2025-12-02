document.addEventListener('DOMContentLoaded', () => {
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

    // Contact Modal Logic
    const contactBtn = document.getElementById('contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeContact = document.querySelector('.close-contact');
    const emailForm = document.getElementById('email-form');

    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            contactModal.classList.remove('hidden');
        });
    }

    const closeContactModal = () => {
        contactModal.classList.add('hidden');
    };

    if (closeContact) {
        closeContact.addEventListener('click', closeContactModal);
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeMusicModal();
        }
        if (e.target === contactModal) {
            closeContactModal();
        }
    });

    if (emailForm) {
        emailForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = emailForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Sending...';

            const name = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const message = document.getElementById('sender-message').value;

            const templateParams = {
                from_name: name,
                from_email: email,
                message: message,
                to_email: 'billerdas@gmail.com'
            };

            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
            emailjs.send('service_zd6taqq', 'template_w7z1v9m', templateParams)
                .then(() => {
                    alert('Message sent successfully!');
                    closeContactModal();
                    emailForm.reset();
                    btn.innerText = originalText;
                }, (error) => {
                    alert('Failed to send message. Please try again or email billerdas@gmail.com directly.');
                    console.error('FAILED...', error);
                    btn.innerText = originalText;
                });
        });
    }

    // Visitor Stats Simulation
    const totalVisitsEl = document.getElementById('total-visits');
    const onlineUsersEl = document.getElementById('online-users');

    if (totalVisitsEl && onlineUsersEl) {
        // Total Visits Logic (LocalStorage)
        let visits = localStorage.getItem('billErdasVisits');
        if (!visits) {
            visits = 14203; // Starting number
        } else {
            visits = parseInt(visits) + 1;
        }
        localStorage.setItem('billErdasVisits', visits);
        totalVisitsEl.innerText = visits.toLocaleString();

        // Online Users Logic (Random Simulation)
        let online = Math.floor(Math.random() * (35 - 12 + 1)) + 12; // Random between 12 and 35
        onlineUsersEl.innerText = online;

        setInterval(() => {
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            online += change;
            if (online < 8) online = 8; // Minimum floor
            if (online > 45) online = 45; // Maximum ceiling
            onlineUsersEl.innerText = online;
        }, 5000); // Update every 5 seconds
    }
});
