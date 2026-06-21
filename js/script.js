document.addEventListener("DOMContentLoaded", () => {
    const navButtons = document.querySelectorAll(".nav-links a");
    const viewSections = document.querySelectorAll(".view-section");

    // Form submission handler
    const contactForm = document.getElementById("mainContactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", function (e) {
            e.preventDefault();
            
            // Collect data
            const name = document.getElementById("contactName").value;
            const email = document.getElementById("contactEmail").value;
            const subject = document.getElementById("contactSubject").value;
            const message = document.getElementById("contactMessage").value;
            
            // Construct mailto link (No external libraries)
            const targetEmail = "bobbiiyt.2@gmail.com"; // Your actual email
            
            // Format the email
            const mailSubject = encodeURIComponent(`${subject} - From ${name}`);
            const mailBody = encodeURIComponent(
                `Sender: ${name}\n` +
                `Email: ${email}\n\n` +
                `Message:\n${message}`
            );
            
            // Open default email client (Outlook, Mail, etc.) with pre-filled details
            window.location.href = `mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`;
            
            // Reset form
            contactForm.reset();
        });
    }

    // SPA Navigation Logic
    function navigateToHash() {
        let hash = window.location.hash;
        if (!hash) hash = '#home'; // Default to home
        
        const targetId = hash.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Remove active class from all sections
            viewSections.forEach(section => {
                section.classList.remove("active");
            });

            // Add active class to target section
            targetSection.classList.add("active");

            // Update active state on all nav buttons pointing to this target
            navButtons.forEach(nav => {
                if(nav.getAttribute("href") === hash) {
                    nav.classList.add("active");
                } else {
                    nav.classList.remove("active");
                }
            });

            // Scroll to top when changing views
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    // Listen for hash changes (e.g. clicking "Read My Story" or browser back button)
    window.addEventListener("hashchange", navigateToHash);

    // Initialize on load
    if (window.location.hash) {
        navigateToHash();
    }

    // Lightbox Modal Logic
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImg");
    const modalCaption = document.getElementById("modalCaption");
    const closeBtn = document.querySelector("#imageModal .close-modal");
    const prevBtn = document.getElementById("prevModal");
    const nextBtn = document.getElementById("nextModal");
    let currentGalleryGroup = [];
    let currentImageIndex = 0;

    function openModal(index, group) {
        currentGalleryGroup = group;
        currentImageIndex = index;
        modal.style.display = "flex";
        modalImg.src = currentGalleryGroup[currentImageIndex].src;
        if (modalCaption) {
            modalCaption.innerHTML = currentGalleryGroup[currentImageIndex].getAttribute("data-caption") || "";
        }
        
        // Hide arrows if there's only 1 image in the group
        if (group.length <= 1) {
            if (prevBtn) prevBtn.style.display = "none";
            if (nextBtn) nextBtn.style.display = "none";
        } else {
            if (prevBtn) prevBtn.style.display = "block";
            if (nextBtn) nextBtn.style.display = "block";
        }
    }

    if (modal && modalImg) {
        // Find all gallery grids and scope click listeners to their own group
        const galleryGrids = document.querySelectorAll(".gallery-grid");
        
        galleryGrids.forEach(grid => {
            const groupImages = Array.from(grid.querySelectorAll(".gallery-img"));
            groupImages.forEach((img, index) => {
                img.addEventListener("click", function() {
                    openModal(index, groupImages);
                });
            });
        });

        // Logo Image Clickable
        const logoImgBtn = document.querySelector('.logo-img');
        if (logoImgBtn) {
            logoImgBtn.addEventListener('click', function() {
                openModal(0, [this]);
            });
        }

        // Next arrow click
        if (nextBtn) {
            nextBtn.addEventListener("click", function(e) {
                e.stopPropagation(); // Prevent modal background click
                if (currentGalleryGroup.length > 0) {
                    currentImageIndex = (currentImageIndex + 1) % currentGalleryGroup.length;
                    openModal(currentImageIndex, currentGalleryGroup);
                }
            });
        }

        // Prev arrow click
        if (prevBtn) {
            prevBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                if (currentGalleryGroup.length > 0) {
                    currentImageIndex = (currentImageIndex - 1 + currentGalleryGroup.length) % currentGalleryGroup.length;
                    openModal(currentImageIndex, currentGalleryGroup);
                }
            });
        }

        // Close on X click
        if (closeBtn) {
            closeBtn.addEventListener("click", function() {
                modal.style.display = "none";
            });
        }

        // Close on background click
        modal.addEventListener("click", function(e) {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
        
        // Keyboard navigation
        document.addEventListener("keydown", function(e) {
            if (modal.style.display === "flex") {
                if (e.key === "ArrowRight") nextBtn.click();
                if (e.key === "ArrowLeft") prevBtn.click();
                if (e.key === "Escape") closeBtn.click();
            }
        });

        // Touch Swipe Navigation for Mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        const modalImage = document.getElementById('modalImg');
        if (modalImage) {
            modalImage.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            }, {passive: true});

            modalImage.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            }, {passive: true});
        }

        function handleSwipe() {
            const swipeThreshold = 50; // minimum pixel distance to register as a swipe
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swiped left -> Next image
                if (nextBtn) nextBtn.click();
            }
            if (touchEndX > touchStartX + swipeThreshold) {
                // Swiped right -> Previous image
                if (prevBtn) prevBtn.click();
            }
        }
    }

    // Drag-to-Scroll for Navigation Bar (Mobile Only)
    const navBarContainer = document.querySelector('.nav-links');
    if (navBarContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;

        navBarContainer.addEventListener('mousedown', (e) => {
            if (window.innerWidth > 768) return; // Do not run on desktop
            isDown = true;
            navBarContainer.style.cursor = 'grabbing';
            startX = e.pageX - navBarContainer.offsetLeft;
            scrollLeft = navBarContainer.scrollLeft;
        });
        navBarContainer.addEventListener('mouseleave', () => {
            if (window.innerWidth > 768) return;
            isDown = false;
            navBarContainer.style.cursor = '';
        });
        navBarContainer.addEventListener('mouseup', () => {
            if (window.innerWidth > 768) return;
            isDown = false;
            navBarContainer.style.cursor = '';
        });
        navBarContainer.addEventListener('mousemove', (e) => {
            if (!isDown || window.innerWidth > 768) return;
            e.preventDefault();
            const x = e.pageX - navBarContainer.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast factor
            navBarContainer.scrollLeft = scrollLeft - walk;
        });
    }

    // Video Intro Modal
    const btnPlay = document.querySelector('.btn-play');
    const videoModal = document.getElementById('videoModal');
    const introVideo = document.getElementById('introVideo');
    const closeVideoModal = document.getElementById('closeVideoModal');

    if (btnPlay && videoModal && introVideo) {
        btnPlay.addEventListener('click', () => {
            videoModal.style.display = "flex";
            introVideo.play();
        });

        closeVideoModal.addEventListener('click', () => {
            videoModal.style.display = "none";
            introVideo.pause();
        });

        videoModal.addEventListener("click", function(e) {
            if (e.target === videoModal) {
                videoModal.style.display = "none";
                introVideo.pause();
            }
        });
    }

    // YouTube Hover Preview
    const ytThumbnails = document.querySelectorAll('.yt-thumbnail');
    ytThumbnails.forEach(thumb => {
        let iframe = null;
        let hoverTimeout = null;
        
        thumb.addEventListener('mouseenter', () => {
            const ytId = thumb.getAttribute('data-yt-id');
            if (!ytId) return;
            
            // Wait 600ms before loading the iframe to prevent accidental triggers
            hoverTimeout = setTimeout(() => {
                iframe = document.createElement('iframe');
                // Added origin to prevent file:/// embed errors
                iframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${ytId}&origin=http://localhost`;
                iframe.setAttribute('allow', 'autoplay; encrypted-media; gyroscope; picture-in-picture');
                iframe.style.position = 'absolute';
                iframe.style.top = '0';
                iframe.style.left = '0';
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                iframe.style.pointerEvents = 'none'; // click passes through to the <a> tag
                iframe.style.zIndex = '0'; 
                thumb.appendChild(iframe);
            }, 600); 
        });
        
        thumb.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout);
            if (iframe) {
                thumb.removeChild(iframe);
                iframe = null;
            }
        });
    });

    // Magic Star Cursor Trail
    const starColors = ["#d8b4e2", "#9d4edd", "#ffffff", "#ffcc00", "#ff6b6b"];
    const sunColors = ["#ffb300", "#ff9800", "#ff5722", "#ffffff", "#ffd54f"];
    let lastParticleTime = 0;
    
    // Only show trail on desktop screens to save mobile performance
    if (window.innerWidth > 768) {
        document.addEventListener("mousemove", function(e) {
            const now = Date.now();
            if (now - lastParticleTime < 40) return; // Limit to ~25 particles per second
            lastParticleTime = now;
            
            const isLight = document.body.classList.contains('light-theme');
            
            const particle = document.createElement("div");
            particle.className = "star-particle";
            particle.innerHTML = isLight ? "☀" : "✦"; // Sun for light mode, Star for dark mode
            
            // Randomize size and color
            const size = Math.random() * 10 + 8; // 8px to 18px
            particle.style.fontSize = size + "px";
            
            const colors = isLight ? sunColors : starColors;
            particle.style.color = colors[Math.floor(Math.random() * colors.length)];
            
            // Position exactly at mouse
            particle.style.left = e.clientX + "px";
            particle.style.top = e.clientY + "px";
            
            document.body.appendChild(particle);
            
            // Remove after animation finishes
            setTimeout(() => {
                particle.remove();
            }, 800);
        });
    }
});