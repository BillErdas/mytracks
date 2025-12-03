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
                // Check for Luminary track (Bill Erdas ft. Xristiana)
                if (trackUrl.includes('bill-erdas-ft-xristiana')) {
                    // Use Spotify embed for Luminary track
                    const spotifyEmbedUrl = 'https://open.spotify.com/embed/track/6LHnttZXpn4LEKST4AemKc';
                    player.src = spotifyEmbedUrl;
                } else {
                    // Default Soundcloud embed
                    const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
                    player.src = embedUrl;
                }
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

    // Visitor Stats Logic
    const totalVisitsEl = document.getElementById('total-visits');
    const onlineUsersEl = document.getElementById('online-users');

    if (totalVisitsEl && onlineUsersEl) {
        // 1. Total Visits (Simulated Persistence via LocalStorage)
        // In a real production environment, this should fetch from a backend API (e.g., Firebase, CountAPI).
        let visits = localStorage.getItem('billErdasVisits');

        // Initialize with a realistic base number if not present
        if (!visits) {
            visits = 14203;
        } else {
            // Increment on every page load (Hit Counter)
            visits = parseInt(visits) + 1;
        }

        localStorage.setItem('billErdasVisits', visits);
        totalVisitsEl.innerText = parseInt(visits).toLocaleString();

        // 2. Online Users (Simulated Real-time)
        // Real-time online users require a WebSocket server or a service like Firebase Realtime Database.
        // We simulate this by generating a number and persisting it in SessionStorage so it doesn't jump on refresh.

        const getOnlineCount = () => {
            const stored = sessionStorage.getItem('billErdasOnline');
            if (stored) return parseInt(stored);
            // Initial random count between 12 and 28
            return Math.floor(Math.random() * (28 - 12 + 1)) + 12;
        };

        let online = getOnlineCount();

        const updateOnlineDisplay = () => {
            onlineUsersEl.innerText = online;
            sessionStorage.setItem('billErdasOnline', online);
        };

        updateOnlineDisplay();

        // Simulate fluctuation every few seconds
        setInterval(() => {
            // 30% chance to change the number
            if (Math.random() > 0.7) {
                const change = Math.random() > 0.5 ? 1 : -1;
                online += change;

                // Keep within realistic bounds
                if (online < 8) online = 8;
                if (online > 45) online = 45;

                updateOnlineDisplay();
            }
        }, 4000);
    }
    // Listen More functionality
    const listenMoreCard = document.getElementById('listen-more-card');
    const listenModal = document.getElementById('listen-modal');
    const closeListenModal = document.getElementById('close-listen-modal');
    const listenIframe = document.getElementById('listen-iframe');
    const dropboxFolderUrl = 'https://www.dropbox.com/scl/fo/tnlutnpdezagooz4it5yy/ALQQVCPLmY-HghqEBHC5bGs?rlkey=gb5xs5dr77elondilkr98i5nq&dl=0';

    if (listenMoreCard) {
        // Add observer for animation consistency
        observer.observe(listenMoreCard);

        listenMoreCard.addEventListener('click', () => {
            window.open(dropboxFolderUrl, '_blank');
        });

        // Hover effect for background (reuse existing logic if possible, or add specific)
        listenMoreCard.addEventListener('mouseenter', () => {
            const img = listenMoreCard.querySelector('img');
            if (img && dynamicBg) {
                dynamicBg.style.backgroundImage = `url('${img.src}')`;
                dynamicBg.style.opacity = '1';
            }
        });

        listenMoreCard.addEventListener('mouseleave', () => {
            if (dynamicBg) {
                dynamicBg.style.opacity = '0';
            }
        });
    }
    if (closeListenModal) {
        closeListenModal.addEventListener('click', () => {
            listenModal.classList.add('hidden');
            listenIframe.src = '';
        });
    }
});
