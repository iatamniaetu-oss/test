/* ============================================================
   SAFARII — Main JavaScript
   Scroll animations, 3D scene, counter, micro-interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ─── 1. NAVBAR SCROLL EFFECT ────────────────────────────────
    const navbar = document.getElementById('navbar');
    let lastScrollY = 0;

    function handleNavbarScroll() {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });

    // ─── 2. MOBILE MENU TOGGLE ──────────────────────────────────
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('mobile-open');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('mobile-open');
            });
        });
    }

    // ─── 3. SCROLL REVEAL ANIMATIONS ────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── 4. ANIMATED COUNTERS ───────────────────────────────────
    const counterElements = document.querySelectorAll('[data-target]');
    let countersAnimated = new Set();

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function easeOutExpo(t) {
            return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        }

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const current = Math.round(target * easedProgress);

            // Format large numbers
            if (target >= 10000) {
                element.textContent = current.toLocaleString('ar-DZ');
            } else {
                element.textContent = current;
            }

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                // Add plus sign for large numbers
                if (target >= 10000) {
                    element.textContent = target.toLocaleString('ar-DZ') + '+';
                }
            }
        }

        requestAnimationFrame(updateCounter);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated.has(entry.target)) {
                countersAnimated.add(entry.target);
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.3 });

    counterElements.forEach(el => counterObserver.observe(el));

    // ─── 5. SMOOTH SCROLL FOR NAV LINKS ─────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const heroDemoBtn = document.getElementById('heroDemoBtn');
    if (heroDemoBtn) {
        heroDemoBtn.addEventListener('click', () => {
            const target = document.getElementById('prototype-videos');
            if (!target) return;

            const navHeight = navbar ? navbar.offsetHeight : 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    function scrollToSection(sectionId) {
        const target = document.getElementById(sectionId);
        if (!target) return;

        const navHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    const heroCtaBtn = document.getElementById('heroCtaBtn');
    if (heroCtaBtn) {
        heroCtaBtn.addEventListener('click', () => scrollToSection('demo'));
    }

    const demoCta = document.getElementById('demoCta');
    if (demoCta) {
        demoCta.addEventListener('click', () => scrollToSection('prototype-videos'));
    }

    const ctaBtn = document.getElementById('ctaBtn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => scrollToSection('prototype-videos'));
    }

    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            window.open('https://mail.google.com/mail/?view=cm&fs=1&to=atamniaismail@safarii.app', '_blank', 'noopener');
        });
    }

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => scrollToSection('scope'));
    }

    // ─── 6. ACTIVE NAV LINK HIGHLIGHTING ────────────────────────
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveLink() {
        const scrollY = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.style.color = '';
                });
                const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.style.color = '#2dd4bf';
                }
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink, { passive: true });

    // ─── 7. BUTTON RIPPLE EFFECT ─────────────────────────────────
    document.querySelectorAll('.btn-primary, .btn-outline-large').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.2);
                transform: scale(0);
                animation: ripple-effect 0.6s ease-out;
                top: ${e.clientY - rect.top - size / 2}px;
                left: ${e.clientX - rect.left - size / 2}px;
                pointer-events: none;
            `;

            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple keyframes
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple-effect {
            to { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(rippleStyle);

    // ─── 8. PARALLAX EFFECT ON HERO ─────────────────────────────
    const heroVisual = document.querySelector('.hero-visual');
    const glassMetrics = document.querySelector('.glass-metrics');
    const glassNotification = document.querySelector('.glass-notification');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY < 800 && heroVisual) {
            const parallaxOffset = scrollY * 0.15;
            heroVisual.style.transform = `translateY(${parallaxOffset}px)`;

            if (glassMetrics) {
                glassMetrics.style.transform = `translateY(${-parallaxOffset * 0.5}px)`;
            }
            if (glassNotification) {
                glassNotification.style.transform = `translateY(${-parallaxOffset * 0.3}px)`;
            }
        }
    }, { passive: true });

    // ─── 9. THREE.JS 3D SCENE ────────────────────────────────────
    function init3DScene() {
        const canvas = document.getElementById('canvas-container');
        if (!canvas || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ── Create Route Lines (transport theme) ──
        const routeMaterial = new THREE.LineBasicMaterial({
            color: 0x14b8a6,
            transparent: true,
            opacity: 0.15
        });

        const routeMaterialAlt = new THREE.LineBasicMaterial({
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.1
        });

        const routes = [];
        const routeCount = 12;

        for (let i = 0; i < routeCount; i++) {
            const points = [];
            const segments = 50;
            const startX = (Math.random() - 0.5) * 60;
            const startY = (Math.random() - 0.5) * 40;
            const endX = (Math.random() - 0.5) * 60;
            const endY = (Math.random() - 0.5) * 40;

            for (let j = 0; j <= segments; j++) {
                const t = j / segments;
                const x = startX + (endX - startX) * t;
                const y = startY + (endY - startY) * t + Math.sin(t * Math.PI * 2) * 3;
                const z = Math.sin(t * Math.PI) * 5 + (Math.random() - 0.5) * 2;
                points.push(new THREE.Vector3(x, y, z));
            }

            const geometry = new THREE.BufferGeometry().setFromPoints(points);
            const material = i % 2 === 0 ? routeMaterial : routeMaterialAlt;
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            routes.push(line);
        }

        // ── Create Floating Dots (bus stops / cities) ──
        const dotGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const dotMaterial = new THREE.MeshBasicMaterial({
            color: 0x2dd4bf,
            transparent: true,
            opacity: 0.3
        });

        const dots = [];
        for (let i = 0; i < 40; i++) {
            const dot = new THREE.Mesh(dotGeometry, dotMaterial.clone());
            dot.position.set(
                (Math.random() - 0.5) * 60,
                (Math.random() - 0.5) * 40,
                (Math.random() - 0.5) * 20
            );
            dot.userData = {
                originalY: dot.position.y,
                speed: 0.5 + Math.random() * 1.5,
                amplitude: 0.5 + Math.random() * 1.5
            };
            scene.add(dot);
            dots.push(dot);
        }

        // ── Create Grid Particles ──
        const gridParticles = new THREE.BufferGeometry();
        const gridCount = 200;
        const positions = new Float32Array(gridCount * 3);

        for (let i = 0; i < gridCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 80;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
        }

        gridParticles.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const particleMaterial = new THREE.PointsMaterial({
            color: 0x14b8a6,
            size: 0.08,
            transparent: true,
            opacity: 0.2
        });

        const particles = new THREE.Points(gridParticles, particleMaterial);
        scene.add(particles);

        // ── Mouse Interaction ──
        let mouseX = 0;
        let mouseY = 0;
        let mouseWorldX = 0;
        let mouseWorldY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
            // Convert to world coordinates
            mouseWorldX = mouseX * 25;
            mouseWorldY = mouseY * 15;
        }, { passive: true });

        // ── Build 3D Bus Model ──
        const busGroup = new THREE.Group();

        // Bus body
        const bodyGeo = new THREE.BoxGeometry(4, 1.6, 1.8);
        const bodyMat = new THREE.MeshBasicMaterial({
            color: 0x14b8a6,
            transparent: true,
            opacity: 0.85
        });
        const busBody = new THREE.Mesh(bodyGeo, bodyMat);
        busBody.position.y = 0.3;
        busGroup.add(busBody);

        // Bus roof (slightly rounded)
        const roofGeo = new THREE.BoxGeometry(3.6, 0.3, 1.6);
        const roofMat = new THREE.MeshBasicMaterial({
            color: 0x0d9488,
            transparent: true,
            opacity: 0.9
        });
        const busRoof = new THREE.Mesh(roofGeo, roofMat);
        busRoof.position.set(0, 1.25, 0);
        busGroup.add(busRoof);

        // Windows (glass strip)
        const windowGeo = new THREE.BoxGeometry(3.4, 0.6, 1.85);
        const windowMat = new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.4
        });
        const busWindows = new THREE.Mesh(windowGeo, windowMat);
        busWindows.position.set(0, 0.8, 0);
        busGroup.add(busWindows);

        // Window frame lines
        const windowLinesMat = new THREE.LineBasicMaterial({
            color: 0x99f6e4,
            transparent: true,
            opacity: 0.6
        });
        for (let w = -1.2; w <= 1.2; w += 0.6) {
            const lineGeo = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(w, 0.5, 0.93),
                new THREE.Vector3(w, 1.1, 0.93)
            ]);
            const windowLine = new THREE.Line(lineGeo, windowLinesMat);
            busGroup.add(windowLine);
            // Other side
            const lineGeo2 = new THREE.BufferGeometry().setFromPoints([
                new THREE.Vector3(w, 0.5, -0.93),
                new THREE.Vector3(w, 1.1, -0.93)
            ]);
            busGroup.add(new THREE.Line(lineGeo2, windowLinesMat));
        }

        // Wheels (4 cylinders)
        const wheelGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.2, 12);
        const wheelMat = new THREE.MeshBasicMaterial({
            color: 0x1e293b,
            transparent: true,
            opacity: 0.9
        });
        const wheelRimMat = new THREE.MeshBasicMaterial({
            color: 0x94a3b8,
            transparent: true,
            opacity: 0.7
        });
        const wheelRimGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.22, 8);

        const wheelPositions = [
            { x: 1.3, z: 0.95 }, { x: -1.3, z: 0.95 },
            { x: 1.3, z: -0.95 }, { x: -1.3, z: -0.95 }
        ];

        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.x = Math.PI / 2;
            wheel.position.set(pos.x, -0.5, pos.z);
            busGroup.add(wheel);
            // Rim
            const rim = new THREE.Mesh(wheelRimGeo, wheelRimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.set(pos.x, -0.5, pos.z);
            busGroup.add(rim);
        });

        // Headlights (front)
        const headlightGeo = new THREE.SphereGeometry(0.15, 8, 8);
        const headlightMat = new THREE.MeshBasicMaterial({
            color: 0xfef3c7,
            transparent: true,
            opacity: 0.95
        });
        const headlightL = new THREE.Mesh(headlightGeo, headlightMat);
        headlightL.position.set(2.05, 0.3, 0.55);
        busGroup.add(headlightL);
        const headlightR = new THREE.Mesh(headlightGeo, headlightMat);
        headlightR.position.set(2.05, 0.3, -0.55);
        busGroup.add(headlightR);

        // Tail lights (back)
        const taillightMat = new THREE.MeshBasicMaterial({
            color: 0xef4444,
            transparent: true,
            opacity: 0.8
        });
        const taillightL = new THREE.Mesh(headlightGeo, taillightMat);
        taillightL.position.set(-2.05, 0.3, 0.55);
        busGroup.add(taillightL);
        const taillightR = new THREE.Mesh(headlightGeo, taillightMat);
        taillightR.position.set(-2.05, 0.3, -0.55);
        busGroup.add(taillightR);

        // Headlight glow (point lights)
        const headlightGlow = new THREE.PointLight(0xfef3c7, 0.8, 8);
        headlightGlow.position.set(2.5, 0.3, 0);
        busGroup.add(headlightGlow);

        // Bus overall glow
        const busGlow = new THREE.PointLight(0x14b8a6, 0.5, 12);
        busGlow.position.set(0, -0.5, 0);
        busGroup.add(busGlow);

        // Scale and position bus
        busGroup.scale.set(0.7, 0.7, 0.7);
        busGroup.position.set(0, 0, 5);
        scene.add(busGroup);

        // ── Bus Trail System ──
        const trailParticleCount = 60;
        const trailPositions = new Float32Array(trailParticleCount * 3);
        const trailSizes = new Float32Array(trailParticleCount);
        const trailOpacities = new Float32Array(trailParticleCount);

        for (let i = 0; i < trailParticleCount; i++) {
            trailPositions[i * 3] = 0;
            trailPositions[i * 3 + 1] = 0;
            trailPositions[i * 3 + 2] = 5;
            trailSizes[i] = 0;
            trailOpacities[i] = 0;
        }

        const trailGeometry = new THREE.BufferGeometry();
        trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

        const trailMaterial = new THREE.PointsMaterial({
            color: 0x2dd4bf,
            size: 0.3,
            transparent: true,
            opacity: 0.4,
            blending: THREE.AdditiveBlending
        });

        const trailPoints = new THREE.Points(trailGeometry, trailMaterial);
        scene.add(trailPoints);

        // Trail history buffer
        const trailHistory = [];
        let trailIndex = 0;

        // ── Smooth bus position tracking ──
        let busCurrentX = 0;
        let busCurrentY = 0;
        let busPrevX = 0;
        let busPrevY = 0;
        let busVelocityX = 0;
        let busVelocityY = 0;

        // ── Animation Loop ──
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsed = clock.getElapsedTime();

            // ── Smooth bus movement toward mouse ──
            busPrevX = busCurrentX;
            busPrevY = busCurrentY;

            const lerpSpeed = 0.04;
            busCurrentX += (mouseWorldX - busCurrentX) * lerpSpeed;
            busCurrentY += (mouseWorldY - busCurrentY) * lerpSpeed;

            busVelocityX = busCurrentX - busPrevX;
            busVelocityY = busCurrentY - busPrevY;
            const speed = Math.sqrt(busVelocityX * busVelocityX + busVelocityY * busVelocityY);

            busGroup.position.x = busCurrentX;
            busGroup.position.y = busCurrentY;

            // ── Bus rotation — face movement direction ──
            if (speed > 0.01) {
                const targetAngle = Math.atan2(busVelocityY, busVelocityX);
                // Smooth rotation interpolation
                let angleDiff = targetAngle - busGroup.rotation.z;
                // Normalize angle diff
                while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
                while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
                busGroup.rotation.z += angleDiff * 0.08;
            }

            // Bus slight hover/bounce
            busGroup.position.y += Math.sin(elapsed * 3) * 0.08;

            // Wheels spin based on speed
            busGroup.children.forEach(child => {
                if (child.geometry && child.geometry.type === 'CylinderGeometry' &&
                    child.material === wheelMat) {
                    child.rotation.z += speed * 2;
                }
            });

            // Headlight pulse
            headlightGlow.intensity = 0.6 + Math.sin(elapsed * 4) * 0.2;

            // ── Update trail ──
            if (speed > 0.005) {
                const posArr = trailGeometry.attributes.position.array;
                // Shift all trail particles
                for (let i = trailParticleCount - 1; i > 0; i--) {
                    posArr[i * 3] = posArr[(i - 1) * 3];
                    posArr[i * 3 + 1] = posArr[(i - 1) * 3 + 1];
                    posArr[i * 3 + 2] = posArr[(i - 1) * 3 + 2];
                }
                // New trail particle at bus rear
                const backOffsetX = -busVelocityX / (speed + 0.001) * 1.5;
                const backOffsetY = -busVelocityY / (speed + 0.001) * 1.5;
                posArr[0] = busCurrentX + backOffsetX;
                posArr[1] = busCurrentY + backOffsetY;
                posArr[2] = 5;

                trailGeometry.attributes.position.needsUpdate = true;
                trailMaterial.opacity = Math.min(0.5, speed * 3);
                trailMaterial.size = Math.min(0.5, 0.15 + speed * 2);
            } else {
                // Fade trail when stationary
                trailMaterial.opacity *= 0.95;
            }

            // ── Rotate scene gently based on mouse (reduced) ──
            scene.rotation.y += (mouseX * 0.02 - scene.rotation.y) * 0.01;
            scene.rotation.x += (mouseY * 0.01 - scene.rotation.x) * 0.01;

            // Animate dots / bus stops
            dots.forEach(dot => {
                dot.position.y = dot.userData.originalY +
                    Math.sin(elapsed * dot.userData.speed) * dot.userData.amplitude;
                dot.material.opacity = 0.15 + Math.sin(elapsed * dot.userData.speed + 1) * 0.15;
            });

            // Slowly rotate particles
            particles.rotation.y = elapsed * 0.02;
            particles.rotation.x = elapsed * 0.01;

            renderer.render(scene, camera);
        }

        animate();

        // ── Resize Handler ──
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Initialize 3D scene
    try {
        init3DScene();
    } catch (e) {
        console.log('3D scene initialization skipped:', e.message);
    }

    // ─── 10. FEATURE CARD TILT ON HOVER ─────────────────────────
    document.querySelectorAll('.feature-card').forEach(card => {
        card.addEventListener('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;

            this.style.transform = `translateY(-8px) perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = '';
        });
    });

    // ─── 11. STEP NUMBER GLOW ─────────────────────────────────────
    document.querySelectorAll('.step-number').forEach((step, i) => {
        step.style.animationDelay = `${i * 0.3}s`;
    });

    // ─── 12. PRELOADER ──────────────────────────────────────────────
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('hidden');
                // Remove from DOM after animation
                setTimeout(() => preloader.remove(), 600);
            }, 2000);
        });

        // Fallback: hide after 4s regardless
        setTimeout(() => {
            if (preloader && !preloader.classList.contains('hidden')) {
                preloader.classList.add('hidden');
                setTimeout(() => preloader.remove(), 600);
            }
        }, 4000);
    }

    // ─── 13. SCROLL PROGRESS BAR ────────────────────────────────────
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            scrollProgress.style.width = scrollPercent + '%';
        }, { passive: true });
    }

    // ─── 14. THEME TOGGLE (DARK / AMOLED / LIGHT) ─────────────────
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    // Theme cycle: dark → amoled → light → dark
    const themeCycle = ['dark', 'amoled', 'light'];
    const themeIcons = {
        dark: 'fa-solid fa-moon',           // Show moon → means "currently dark"
        amoled: 'fa-solid fa-circle-half-stroke', // AMOLED indicator
        light: 'fa-solid fa-sun',            // Show sun → means "currently light"
    };
    const themeLabels = {
        dark: 'داكن',
        amoled: 'AMOLED',
        light: 'فاتح',
    };

    // Add tooltip label to toggle button
    if (themeToggle && !themeToggle.querySelector('.theme-label')) {
        const label = document.createElement('span');
        label.className = 'theme-label';
        themeToggle.appendChild(label);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeIcon) {
            themeIcon.className = themeIcons[theme] || 'fa-solid fa-sun';
        }
        // Update tooltip label
        const label = themeToggle ? themeToggle.querySelector('.theme-label') : null;
        if (label) {
            label.textContent = themeLabels[theme] || '';
        }
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('safarii-theme');
    if (savedTheme && themeCycle.includes(savedTheme)) {
        applyTheme(savedTheme);
    } else {
        applyTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const currentIndex = themeCycle.indexOf(current);
            const nextIndex = (currentIndex + 1) % themeCycle.length;
            const next = themeCycle[nextIndex];
            applyTheme(next);
            localStorage.setItem('safarii-theme', next);
        });
    }

    // ─── 15. TYPING EFFECT ON HERO ──────────────────────────────────
    const typingTarget = document.getElementById('typingTarget');
    if (typingTarget && !document.body.classList.contains('safarii-grounded')) {
        const phrases = [
            'وضاعف مبيعاتك.',
            'وتتبع حافلاتك.',
            'واستقبل الحجوزات.',
            'وحلّل بياناتك.',
        ];

        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        // Add cursor element
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        typingTarget.parentNode.insertBefore(cursor, typingTarget.nextSibling);

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (isDeleting) {
                typingTarget.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingTarget.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                // Pause at full text
                typingSpeed = 2500;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeEffect, typingSpeed);
        }

        // Start typing after page loads
        setTimeout(typeEffect, 2500);
    }

    // ─── 16. FAQ ACCORDION ──────────────────────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function () {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isActive) {
                faqItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ─── 17. BACK TO TOP BUTTON ─────────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Prototype video custom controls
    document.querySelectorAll('.prototype-video-mockup--has-video').forEach(mockup => {
        const video = mockup.querySelector('.prototype-real-video');
        const playButton = mockup.querySelector('.prototype-control-play');
        const progressTrack = mockup.querySelector('.prototype-progress-track');
        const progressFill = mockup.querySelector('.prototype-progress-fill');
        const timeLabel = mockup.querySelector('.prototype-video-time');
        const fullscreenButton = mockup.querySelector('.prototype-control-fullscreen');

        if (!video || !playButton || !progressTrack || !progressFill || !timeLabel || !fullscreenButton) return;

        const playbackRate = 1.3;

        function formatTime(seconds) {
            if (!Number.isFinite(seconds)) return '0:00';
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
            return `${minutes}:${remainingSeconds}`;
        }

        function setPlaybackRate() {
            video.defaultPlaybackRate = playbackRate;
            video.playbackRate = playbackRate;
        }

        function updateProgress() {
            const percent = video.duration ? (video.currentTime / video.duration) * 100 : 0;
            progressFill.style.width = `${Math.min(percent, 100)}%`;
            progressTrack.setAttribute('aria-valuenow', Math.round(percent).toString());
            timeLabel.textContent = formatTime(video.currentTime);
        }

        function updatePlayIcon() {
            const icon = playButton.querySelector('i');
            if (!icon) return;
            icon.className = video.paused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
            playButton.setAttribute('aria-label', video.paused ? 'تشغيل الفيديو' : 'إيقاف الفيديو');
        }

        function seekFromPointer(event) {
            if (!video.duration) return;
            const rect = progressTrack.getBoundingClientRect();
            const x = Math.min(Math.max(event.clientX - rect.left, 0), rect.width);
            video.currentTime = (x / rect.width) * video.duration;
            updateProgress();
        }

        function isFullscreen() {
            return document.fullscreenElement === mockup ||
                document.webkitFullscreenElement === mockup;
        }

        function updateFullscreenIcon() {
            const icon = fullscreenButton.querySelector('i');
            if (!icon) return;
            icon.className = isFullscreen() ? 'fa-solid fa-compress' : 'fa-solid fa-expand';
            fullscreenButton.setAttribute('aria-label', isFullscreen() ? 'تصغير الفيديو' : 'تكبير الفيديو');
        }

        async function toggleFullscreen() {
            try {
                if (isFullscreen()) {
                    if (document.exitFullscreen) {
                        await document.exitFullscreen();
                    } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                } else if (mockup.requestFullscreen) {
                    await mockup.requestFullscreen();
                } else if (mockup.webkitRequestFullscreen) {
                    mockup.webkitRequestFullscreen();
                }
            } catch (error) {
                console.log('Fullscreen unavailable:', error.message);
            }
        }

        setPlaybackRate();
        video.addEventListener('loadedmetadata', () => {
            setPlaybackRate();
            updateProgress();
        });
        video.addEventListener('play', () => {
            setPlaybackRate();
            updatePlayIcon();
        });
        video.addEventListener('pause', updatePlayIcon);
        video.addEventListener('ended', updatePlayIcon);
        video.addEventListener('timeupdate', updateProgress);
        video.addEventListener('ratechange', setPlaybackRate);

        playButton.dataset.videoControlReady = 'true';

        progressTrack.addEventListener('click', seekFromPointer);
        fullscreenButton.addEventListener('click', toggleFullscreen);
        document.addEventListener('fullscreenchange', updateFullscreenIcon);
        document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    });

    document.addEventListener('click', event => {
        const playButton = event.target.closest('.prototype-control-play');
        if (!playButton) return;

        const mockup = playButton.closest('.prototype-video-mockup--has-video');
        const video = mockup ? mockup.querySelector('.prototype-real-video') : null;
        if (!video) return;

        video.defaultPlaybackRate = 1.3;
        video.playbackRate = 1.3;

        if (video.paused) {
            video.play().catch(() => {
                video.muted = true;
                return video.play().catch(() => {});
            });
        } else {
            video.pause();
        }
    }, true);

});
