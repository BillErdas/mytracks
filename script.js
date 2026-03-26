document.addEventListener('DOMContentLoaded', () => {
    // Modal Logic
    const modal = document.getElementById('music-modal');
    const closeModal = document.querySelector('.close-modal');
    const player = document.getElementById('soundcloud-player');
    const trackCards = document.querySelectorAll('.track-card');

    trackCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Do not open modal if standard URL is clicked directly (like the Spotify button)
            if (e.target.tagName === 'A' || e.target.classList.contains('featured-btn')) {
                return;
            }
            const trackUrl = card.dataset.trackUrl;
            if (trackUrl) {
                const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;
                player.src = embedUrl;
                modal.classList.remove('hidden');
            }
        });
    });

    // Make the explicit YouTube button open the modal
    const featuredYtBtn = document.querySelector('#featured-luminary .youtube-btn');
    if (featuredYtBtn) {
        featuredYtBtn.addEventListener('click', (e) => {
            e.preventDefault();
            // Extracted video ID from: https://www.youtube.com/watch?v=3N2K7nTBoO0&list=RD3N2K7nTBoO0&start_radio=1
            const embedUrl = `https://www.youtube.com/embed/3N2K7nTBoO0?autoplay=1`;
            player.src = embedUrl;
            modal.classList.remove('hidden');
        });
    }

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

    // Visitor Stats Logic (Removed)
    
    // Listen & Download More functionality
    const listenMoreBtn = document.getElementById('listen-more-btn');
    const listenModal = document.getElementById('listen-modal');
    const closeListenModal = document.getElementById('close-listen-modal');
    const listenIframe = document.getElementById('listen-iframe');
    const dropboxFolderUrl = 'https://www.dropbox.com/scl/fo/tnlutnpdezagooz4it5yy/ALQQVCPLmY-HghqEBHC5bGs?rlkey=gb5xs5dr77elondilkr98i5nq&dl=0';

    if (listenMoreBtn) {
        listenMoreBtn.addEventListener('click', () => {
            window.open(dropboxFolderUrl, '_blank');
        });
    }
    if (closeListenModal) {
        closeListenModal.addEventListener('click', () => {
            listenModal.classList.add('hidden');
            listenIframe.src = '';
        });
    }
});
