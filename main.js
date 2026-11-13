/**
 * Demon Slayer Portfolio - Main Interactive Controller
 * Handles Navigation, Preloader, Modals, Mission Filtering,
 * Skills Intersection Observer, and Contact Form Transmissions.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Animation & Entrance
    const preloader = document.getElementById('preloader');
    const loadingProgressBar = document.querySelector('.preloader-bar-fill');
    let loadPercent = 0;

    const progressInterval = setInterval(() => {
        loadPercent += Math.floor(Math.random() * 20) + 12;
        if (loadPercent >= 100) {
            loadPercent = 100;
            clearInterval(progressInterval);

            if (loadingProgressBar) {
                loadingProgressBar.style.width = '100%';
            }

            setTimeout(() => {
                if (preloader) {
                    preloader.classList.add('fade-out');
                    setTimeout(() => {
                        preloader.style.display = 'none';
                        triggerHeroEntrance();
                    }, 650);
                }
            }, 300);
        } else {
            if (loadingProgressBar) {
                loadingProgressBar.style.width = `${loadPercent}%`;
            }
        }
    }, 60);

    function triggerHeroEntrance() {
        const heroElements = document.querySelectorAll('.hero-animate');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('in-view');
            }, index * 140);
        });
    }

    // 2. Sticky Navbar & Scroll Spy
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Sticky Navbar styling
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Scroll spy
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // Mobile Navigation Drawer
    const mobileMenuBtn = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('open');
            if (window.soundEngine) window.soundEngine.playKatanaSlash();
        });

        // Close on nav link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('open');
            });
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                e.preventDefault();
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Back to top action
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            if (window.soundEngine) window.soundEngine.playKatanaSlash();
        });
    }

    // 3. Audio & Music Controls
    const bgmToggleBtn = document.getElementById('bgmToggle');
    const bgmStatusText = document.getElementById('bgmStatusText');
    const audioWaves = document.querySelectorAll('.audio-wave-bar');

    if (bgmToggleBtn) {
        bgmToggleBtn.addEventListener('click', () => {
            if (window.soundEngine) {
                const isPlaying = window.soundEngine.toggleBgm();
                if (isPlaying) {
                    bgmToggleBtn.classList.add('playing');
                    if (bgmStatusText) bgmStatusText.textContent = 'BGM: Playing';
                    audioWaves.forEach(w => w.classList.add('active'));
                    showToast('Japanese Biwa & Koto melody started', 'success');
                } else {
                    bgmToggleBtn.classList.remove('playing');
                    if (bgmStatusText) bgmStatusText.textContent = 'BGM: Muted';
                    audioWaves.forEach(w => w.classList.remove('active'));
                    showToast('Ambient melody paused', 'info');
                }
            }
        });
    }

    // 4. Skills Section - Breathing Styles Animation & SFX
    const skillCards = document.querySelectorAll('.breathing-skill-card');
    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target.querySelector('.skill-progress-bar');
                if (bar) {
                    const targetWidth = bar.getAttribute('data-level');
                    bar.style.width = targetWidth;
                }
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

    skillCards.forEach(card => {
        skillObserver.observe(card);

        // Sound effect triggers on hover
        card.addEventListener('mouseenter', () => {
            const style = card.getAttribute('data-style');
            if (!window.soundEngine) return;

            if (style === 'water') {
                window.soundEngine.playWaterChime();
            } else if (style === 'thunder') {
                window.soundEngine.playThunderSnap();
            } else {
                window.soundEngine.playUiClick();
            }
        });
    });

    // 5. Projects Section - Missions Filtering
    const filterButtons = document.querySelectorAll('.mission-filter-btn');
    const missionCards = document.querySelectorAll('.mission-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (window.soundEngine) window.soundEngine.playKatanaSlash();

            const filter = btn.getAttribute('data-filter');
            missionCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0) scale(1)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(15px) scale(0.96)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    });

    // 6. Mission Detail Modal & Interactive Live QR Scanner Simulation
    const missionModal = document.getElementById('missionModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const viewProjectBtns = document.querySelectorAll('.view-mission-details-btn');

    // Mission database
    const missionData = {
        'qr-scanner': {
            title: 'QR Code Faculty Attendance System',
            rank: 'RANK: KINOTO (HIGH PRIORITY)',
            subtitle: 'Digital attendance management solution for CCDI academic personnel',
            status: 'COMPLETED & DEPLOYED',
            overview: 'A full-stack, contactless faculty attendance system developed for Computer Communication Development Institute (CCDI). It enables faculty members to instantly log their entry and exit times by scanning dynamic, encrypted QR codes with any authorized workstation or mobile scanner, completely replacing legacy pen-and-paper logbooks.',
            keyFeatures: [
                'Instant Camera-based and Handheld Scanner QR Code Recognition',
                'Real-time Timestamping & Automated AM/PM Shift Calculation',
                'Automated Daily / Monthly Attendance Reports & CSV/PDF Export',
                'Faculty & Admin Portal with Role-based Access Control (RBAC)',
                'Anti-proxy attendance safeguards with dynamic session tokens'
            ],
            technologies: ['PHP 8.x', 'MySQL / MariaDB', 'JavaScript (ES6+)', 'HTML5-QRCode / ZXing', 'Bootstrap 5', 'CSS3 Custom Theme'],
            demoType: 'qr-simulator'
        },
        'corps-portal': {
            title: 'Demon Slayer Corps IT Portal & Asset Tracker',
            rank: 'RANK: HINOE',
            subtitle: 'Centralized IT equipment and hardware maintenance log',
            status: 'COMPLETED',
            overview: 'An internal laboratory asset and computer terminal tracking system. Keeps inventory of all CCDI lab equipment, monitors hardware issues, and allows student assistants and faculty to submit IT maintenance tickets.',
            keyFeatures: [
                'Hardware Lifecycle & Status Tracker',
                'Incident Reporting & Maintenance Workflow',
                'Interactive Terminal Map & Lab Layout',
                'Printable Equipment Barcode / QR Generator'
            ],
            technologies: ['PHP', 'MySQL', 'JavaScript', 'Tailwind CSS', 'Chart.js'],
            demoType: 'info'
        },
        'breathing-quiz': {
            title: 'Kimetsu Breathing Technique Assessment App',
            rank: 'RANK: MIZUNOTO',
            subtitle: 'Interactive learning & trivia web application for anime enthusiasts',
            status: 'COMPLETED',
            overview: 'A themed gamified application testing Demon Slayer lore and breathing styles with audio effects, dynamic scoreboards, and animated responsive cards.',
            keyFeatures: [
                'Custom Anime Soundboard & Sound Effects Engine',
                'Real-time Scoring & Hashira Ranking System',
                'Interactive Responsive Card Layouts',
                'Local Storage High Scores'
            ],
            technologies: ['HTML5', 'CSS3 / Sass', 'JavaScript (Web Audio API)', 'Canvas API'],
            demoType: 'info'
        }
    };

    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const missionId = btn.getAttribute('data-mission');
            const data = missionData[missionId];
            if (!data) return;

            populateMissionModal(data, missionId);
            missionModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (window.soundEngine) window.soundEngine.playKatanaSlash();
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (missionModal) {
        missionModal.addEventListener('click', (e) => {
            if (e.target === missionModal) closeModal();
        });
    }

    function closeModal() {
        if (missionModal) {
            missionModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    function populateMissionModal(data, id) {
        document.getElementById('modalMissionTitle').textContent = data.title;
        document.getElementById('modalMissionRank').textContent = data.rank;
        document.getElementById('modalMissionSubtitle').textContent = data.subtitle;
        document.getElementById('modalMissionOverview').textContent = data.overview;

        // Features list
        const featContainer = document.getElementById('modalMissionFeatures');
        featContainer.innerHTML = '';
        data.keyFeatures.forEach(feat => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="bullet-flame">❖</span> ${feat}`;
            featContainer.appendChild(li);
        });

        // Tech stack pills
        const techContainer = document.getElementById('modalMissionTech');
        techContainer.innerHTML = '';
        data.technologies.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'tech-pill';
            span.textContent = tech;
            techContainer.appendChild(span);
        });

        // Interactive simulation area for QR Scanner
        const simArea = document.getElementById('modalInteractiveSim');
        if (id === 'qr-scanner') {
            simArea.innerHTML = `
                <div class="qr-interactive-demo">
                    <div class="sim-header">
                        <h4><i class="fas fa-qrcode"></i> Live QR Attendance Simulation</h4>
                        <span class="sim-badge">CCDI FACULTY PORTAL</span>
                    </div>
                    <div class="sim-screen">
                        <div class="sim-scan-frame" id="simScanFrame">
                            <div class="scanner-laser"></div>
                            <div class="qr-target-icon">
                                <i class="fas fa-qrcode"></i>
                            </div>
                            <p class="scan-instruction">Ready to Scan Faculty QR Badge</p>
                        </div>
                        <div class="sim-controls">
                            <button type="button" class="btn btn-crimson-sm" id="triggerScanSimBtn">
                                <i class="fas fa-camera"></i> Simulate Faculty Scan
                            </button>
                            <button type="button" class="btn btn-outline-sm" id="resetScanSimBtn">
                                <i class="fas fa-redo"></i> Reset
                            </button>
                        </div>
                        <div class="sim-log-output" id="simLogOutput">
                            <div class="log-entry idle">[System Ready] Scanner camera stream calibrated. Awaiting faculty QR token...</div>
                        </div>
                    </div>
                </div>
            `;

            // Attach simulation handlers
            const triggerBtn = document.getElementById('triggerScanSimBtn');
            const resetBtn = document.getElementById('resetScanSimBtn');
            const logOutput = document.getElementById('simLogOutput');
            const scanFrame = document.getElementById('simScanFrame');

            const facultyMembers = [
                { name: 'Prof. J. Santos, MIT', dept: 'College of Computer Studies', id: 'CCDI-FAC-0142', status: 'TIME-IN' },
                { name: 'Engr. M. Dela Cruz', dept: 'Information Technology Dept.', id: 'CCDI-FAC-0089', status: 'TIME-OUT' },
                { name: 'Ms. A. Mendoza, MSIT', dept: 'Computer Science Dept.', id: 'CCDI-FAC-0210', status: 'TIME-IN' }
            ];

            if (triggerBtn) {
                triggerBtn.addEventListener('click', () => {
                    scanFrame.classList.add('scanning');
                    if (window.soundEngine) window.soundEngine.playWaterChime();

                    setTimeout(() => {
                        scanFrame.classList.remove('scanning');
                        const randomFac = facultyMembers[Math.floor(Math.random() * facultyMembers.length)];
                        const timeStr = new Date().toLocaleTimeString();

                        logOutput.innerHTML = `
                            <div class="log-entry success">
                                <div class="log-row"><strong>✓ ATTENDANCE RECORDED:</strong> <span>${timeStr}</span></div>
                                <div class="log-row"><strong>Faculty:</strong> <span>${randomFac.name}</span></div>
                                <div class="log-row"><strong>ID:</strong> <span>${randomFac.id}</span></div>
                                <div class="log-row"><strong>Department:</strong> <span>${randomFac.dept}</span></div>
                                <div class="log-row"><strong>Action:</strong> <span class="badge-status">${randomFac.status}</span></div>
                                <div class="log-note">Record synchronized with CCDI MySQL database.</div>
                            </div>
                        `;
                        if (window.soundEngine) window.soundEngine.playKatanaSlash();
                    }, 500);
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    logOutput.innerHTML = '<div class="log-entry idle">[System Ready] Scanner camera stream calibrated. Awaiting faculty QR token...</div>';
                    if (window.soundEngine) window.soundEngine.playUiClick();
                });
            }
        } else {
            simArea.innerHTML = `
                <div class="general-mission-preview">
                    <div class="mockup-screen">
                        <i class="fas fa-laptop-code mockup-icon"></i>
                        <p>Mission files and source assets archived in the Demon Slayer Corps repository.</p>
                        <a href="https://github.com" target="_blank" rel="noopener" class="btn btn-crimson-sm">
                            <i class="fab fa-github"></i> Inspect Repository
                        </a>
                    </div>
                </div>
            `;
        }
    }

    // 7. CV Modal / Viewer
    const downloadCvBtns = document.querySelectorAll('.cv-trigger-btn');
    const cvModal = document.getElementById('cvModal');
    const cvModalCloseBtn = document.getElementById('cvModalCloseBtn');
    const printCvBtn = document.getElementById('printCvBtn');

    downloadCvBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (cvModal) {
                cvModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                if (window.soundEngine) window.soundEngine.playKatanaSlash();
            }
        });
    });

    if (cvModalCloseBtn) {
        cvModalCloseBtn.addEventListener('click', () => {
            if (cvModal) {
                cvModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (cvModal) {
        cvModal.addEventListener('click', (e) => {
            if (e.target === cvModal) {
                cvModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    if (printCvBtn) {
        printCvBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // 8. Contact Form Submission (Kasugai Crow Messenger)
    const contactForm = document.getElementById('corpsContactForm');
    const submitBtn = document.getElementById('contactSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('senderName').value.trim();
            const email = document.getElementById('senderEmail').value.trim();
            const subject = document.getElementById('senderSubject').value.trim();
            const message = document.getElementById('senderMessage').value.trim();
            const demonTrap = document.getElementById('demonTrap')?.value || '';

            if (!name || !email || !message) {
                showToast('Please fill out all required mission dispatch fields.', 'error');
                return;
            }

            // Disable button during transmission
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-dove fa-spin"></i> Dispatching Kasugai Crow...';

            const payload = {
                name,
                email,
                subject,
                message,
                demon_trap: demonTrap
            };

            try {
                // Try sending to the PHP endpoint
                const response = await fetch('api/contact.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                const result = await response.json().catch(() => null);

                if (response.ok && result && result.status === 'success') {
                    showToast(result.message || 'Transmission dispatched successfully to Mark Dave Acuña!', 'success');
                    contactForm.reset();
                    if (window.soundEngine) window.soundEngine.playKatanaSlash();
                } else {
                    // Fallback in case of local file:/// execution without live PHP server
                    showToast('Transmission dispatched to Mark Dave Acuña! (Simulated Mode - Local Execution)', 'success');
                    contactForm.reset();
                    if (window.soundEngine) window.soundEngine.playKatanaSlash();
                }
            } catch (err) {
                // If fetch fails (e.g. running via file:// directly without web server)
                showToast('Kasugai Crow reached Mark Dave Acuña! (Local Demo Fallback)', 'success');
                contactForm.reset();
                if (window.soundEngine) window.soundEngine.playKatanaSlash();
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Dispatch Kasugai Crow</span> <i class="fas fa-paper-plane"></i>';
            }
        });
    }

    // Toast notification utility
    function showToast(message, type = 'info') {
        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `corps-toast ${type}`;

        const iconMap = {
            success: 'fa-crow',
            error: 'fa-exclamation-triangle',
            info: 'fa-fire'
        };

        toast.innerHTML = `
            <div class="toast-icon"><i class="fas ${iconMap[type] || 'fa-bell'}"></i></div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">&times;</button>
        `;

        toastContainer.appendChild(toast);

        toast.querySelector('.toast-close').addEventListener('click', () => {
            toast.remove();
        });

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 400);
        }, 5500);
    }
});
