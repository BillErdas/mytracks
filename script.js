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
                // If this card already has the player, do nothing
                if (card.querySelector('.inline-soundcloud-player')) {
                    return;
                }

                // Remove player from other cards and restore their images
                document.querySelectorAll('.track-card').forEach(otherCard => {
                    const existingPlayer = otherCard.querySelector('.inline-soundcloud-player');
                    if (existingPlayer) {
                        existingPlayer.remove();
                        const overlay = otherCard.querySelector('.overlay');
                        if (overlay) overlay.style.display = '';
                    }
                });

                // Create inline player for this card
                const embedUrl = `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%23ff5500&auto_play=true&visual=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false`;
                
                const iframe = document.createElement('iframe');
                iframe.src = embedUrl;
                iframe.className = 'inline-soundcloud-player';
                iframe.setAttribute('allow', 'autoplay');
                iframe.setAttribute('frameborder', 'no');
                iframe.setAttribute('scrolling', 'no');
                
                // Hide the overlay, but keep the cover image visible
                // so it shines through the 50% opacity iframe
                const overlay = card.querySelector('.overlay');
                if (overlay) overlay.style.display = 'none';
                
                // Hide featured-specific elements if present
                const pLinks = card.querySelector('.permanent-streaming-links');
                if (pLinks) pLinks.style.display = 'none';
                const fArtist = card.querySelector('.featured-artist-text');
                if (fArtist) fArtist.style.display = 'none';
                const fTitle = card.querySelector('.featured-title-text');
                if (fTitle) fTitle.style.display = 'none';
                
                card.appendChild(iframe);
            }
        });
    });

    // Make the explicit YouTube button open the modal
    const featuredYtBtn = document.querySelector('#featured-luminary .youtube-btn');
    if (featuredYtBtn) {
        featuredYtBtn.addEventListener('click', (e) => {
            e.preventDefault();
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
    
    // Sidebar Playlist functionality
    const listenMoreBtn = document.getElementById('listen-more-btn');
    const sidebarPlaylist = document.getElementById('sidebar-playlist');
    const closeSidebarBtn = document.querySelector('.close-sidebar');
    const audioPlayer = document.getElementById('sidebar-audio-player');
    const playlistItems = document.querySelectorAll('.playlist-item');
    let currentPlayingItem = null;

    if (listenMoreBtn && sidebarPlaylist) {
        listenMoreBtn.addEventListener('click', () => {
            sidebarPlaylist.classList.add('open');
            listenMoreBtn.style.opacity = '0';
            listenMoreBtn.style.pointerEvents = 'none';
        });
    }

    const closeSidebar = () => {
        sidebarPlaylist.classList.remove('open');
        listenMoreBtn.style.opacity = '1';
        listenMoreBtn.style.pointerEvents = 'auto';
        
        if (audioPlayer && !audioPlayer.paused) {
            audioPlayer.pause();
        }
        if (currentPlayingItem) {
            currentPlayingItem.classList.remove('playing');
            const oldBtn = currentPlayingItem.querySelector('.play-pause-btn');
            if(oldBtn) oldBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    };

    if (closeSidebarBtn && sidebarPlaylist) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    document.addEventListener('click', (e) => {
        if (sidebarPlaylist && sidebarPlaylist.classList.contains('open')) {
            if (!sidebarPlaylist.contains(e.target) && 
                (!listenMoreBtn || !listenMoreBtn.contains(e.target))) {
                closeSidebar();
            }
        }
    });

    if (playlistItems && audioPlayer) {
        playlistItems.forEach(item => {
            const playBtn = item.querySelector('.play-pause-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const src = item.dataset.src;
                    
                    if (currentPlayingItem === item) {
                        if (audioPlayer.paused) {
                            audioPlayer.play();
                            item.classList.add('playing');
                            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        } else {
                            audioPlayer.pause();
                            item.classList.remove('playing');
                            playBtn.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    } else {
                        if (currentPlayingItem) {
                            currentPlayingItem.classList.remove('playing');
                            const oldBtn = currentPlayingItem.querySelector('.play-pause-btn');
                            if(oldBtn) oldBtn.innerHTML = '<i class="fas fa-play"></i>';
                        }
                        
                        audioPlayer.src = src;
                        audioPlayer.play();
                        item.classList.add('playing');
                        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        currentPlayingItem = item;
                    }
                });
            }
        });

        audioPlayer.addEventListener('ended', () => {
            if (currentPlayingItem) {
                currentPlayingItem.classList.remove('playing');
                const btn = currentPlayingItem.querySelector('.play-pause-btn');
                if(btn) btn.innerHTML = '<i class="fas fa-play"></i>';
                currentPlayingItem = null;
            }
        });

        // Seek Bar Logic
        const seekBar = document.querySelector('.seek-bar');
        const currentTimeEl = document.querySelector('.current-time');
        const totalTimeEl = document.querySelector('.total-time');

        if (seekBar && currentTimeEl && totalTimeEl) {
            audioPlayer.addEventListener('timeupdate', () => {
                if (audioPlayer.duration) {
                    const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                    seekBar.value = progress;
                    
                    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
                    totalTimeEl.textContent = formatTime(audioPlayer.duration);
                }
            });

            seekBar.addEventListener('input', () => {
                if (audioPlayer.duration) {
                    const seekTo = (seekBar.value / 100) * audioPlayer.duration;
                    audioPlayer.currentTime = seekTo;
                }
            });
        }

        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }
    }
});
