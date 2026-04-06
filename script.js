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
                        const pLinks = otherCard.querySelector('.permanent-streaming-links');
                        if (pLinks) pLinks.style.display = '';
                        const fArtist = otherCard.querySelector('.featured-artist-text');
                        if (fArtist) fArtist.style.display = '';
                        const fTitle = otherCard.querySelector('.featured-title-text');
                        if (fTitle) fTitle.style.display = '';
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
    let activeSeekBar = null;
    let activeCurrentTimeEl = null;
    let activeTotalTimeEl = null;

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    const attachInlinePlayer = (item) => {
        const trackInfo = item.querySelector('.track-info-sidebar');

        if (!trackInfo) {
            return;
        }

        let inlinePlayer = item.querySelector('.playlist-item-player');

        if (!inlinePlayer) {
            inlinePlayer = document.createElement('div');
            inlinePlayer.className = 'playlist-item-player';
            inlinePlayer.innerHTML = `
                <div class="progress-info">
                    <span class="current-time">0:00</span>
                    <span class="total-time">0:00</span>
                </div>
                <input type="range" class="seek-bar" value="0" min="0" max="100" step="0.1">
            `;
            trackInfo.appendChild(inlinePlayer);
        }

        ['click', 'pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup'].forEach((eventName) => {
            inlinePlayer.addEventListener(eventName, (e) => {
                e.stopPropagation();
            });
        });

        activeSeekBar = inlinePlayer.querySelector('.seek-bar');
        activeCurrentTimeEl = inlinePlayer.querySelector('.current-time');
        activeTotalTimeEl = inlinePlayer.querySelector('.total-time');

        if (activeSeekBar) {
            activeSeekBar.value = 0;
            activeSeekBar.oninput = () => {
                if (audioPlayer.duration) {
                    const seekTo = (activeSeekBar.value / 100) * audioPlayer.duration;
                    audioPlayer.currentTime = seekTo;
                }
            };
        }

        if (activeCurrentTimeEl) {
            activeCurrentTimeEl.textContent = '0:00';
        }

        if (activeTotalTimeEl) {
            activeTotalTimeEl.textContent = '0:00';
        }
    };

    const resetPlaylistItem = (item) => {
        if (!item) {
            return;
        }

        item.classList.remove('playing', 'is-player');

        const button = item.querySelector('.play-pause-btn');
        if (button) {
            button.innerHTML = '<i class="fas fa-play"></i>';
        }

        const inlinePlayer = item.querySelector('.playlist-item-player');
        if (inlinePlayer) {
            inlinePlayer.remove();
        }

        if (currentPlayingItem === item) {
            currentPlayingItem = null;
            activeSeekBar = null;
            activeCurrentTimeEl = null;
            activeTotalTimeEl = null;
        }
    };

    const activatePlaylistItem = (item) => {
        const src = item.dataset.src;
        const playBtn = item.querySelector('.play-pause-btn');

        if (!src || !playBtn) {
            return;
        }

        if (currentPlayingItem && currentPlayingItem !== item) {
            resetPlaylistItem(currentPlayingItem);
        }

        item.classList.add('playing', 'is-player');
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        attachInlinePlayer(item);

        audioPlayer.src = src;
        audioPlayer.play();
        currentPlayingItem = item;
    };

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
        audioPlayer.currentTime = 0;
        resetPlaylistItem(currentPlayingItem);
    };

    if (closeSidebarBtn && sidebarPlaylist) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarPlaylist) {
        ['click', 'pointerdown', 'touchstart', 'mousedown'].forEach((eventName) => {
            sidebarPlaylist.addEventListener(eventName, (e) => {
                if (e.target.closest('.seek-bar')) {
                    e.stopPropagation();
                }
            });
        });
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

            item.addEventListener('click', (e) => {
                if (e.target.closest('.download-track-btn')) {
                    return;
                }

                if (e.target.closest('.playlist-item-player')) {
                    return;
                }

                if (currentPlayingItem === item && !audioPlayer.paused) {
                    audioPlayer.pause();
                    resetPlaylistItem(item);
                    return;
                }

                activatePlaylistItem(item);
            });

            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (currentPlayingItem === item && !audioPlayer.paused) {
                        audioPlayer.pause();
                        resetPlaylistItem(item);
                    } else {
                        activatePlaylistItem(item);
                    }
                });
            }
        });

        audioPlayer.addEventListener('ended', () => {
            resetPlaylistItem(currentPlayingItem);
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            if (activeTotalTimeEl && audioPlayer.duration) {
                activeTotalTimeEl.textContent = formatTime(audioPlayer.duration);
            }
        });

        audioPlayer.addEventListener('timeupdate', () => {
            if (activeSeekBar && audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                activeSeekBar.value = progress;
            }

            if (activeCurrentTimeEl) {
                activeCurrentTimeEl.textContent = formatTime(audioPlayer.currentTime);
            }

            if (activeTotalTimeEl && audioPlayer.duration) {
                activeTotalTimeEl.textContent = formatTime(audioPlayer.duration);
            }
        });
    }
});
