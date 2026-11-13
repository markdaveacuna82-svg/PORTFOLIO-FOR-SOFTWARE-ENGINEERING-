/**
 * Demon Slayer Atmosphere Particle Engine
 * Renders authentic anime atmospheric visual effects:
 * - Drifting Wisteria & Sakura Petals (Fuji no Hana)
 * - Fiery Nichirin Embers (Hinokami Kagura sparks)
 * - Atmospheric Red Mist & Moonlight dust
 */

class ParticleEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.numParticles = 65;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.mouse = { x: -1000, y: -1000, radius: 120 };
        this.currentMode = 'flame'; // 'flame', 'wisteria', 'water', 'thunder'

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = -1000;
            this.mouse.y = -1000;
        });

        this.spawnParticles();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);

        if (this.width < 768) {
            this.numParticles = 35;
        } else {
            this.numParticles = 65;
        }
    }

    createParticle() {
        const types = ['ember', 'petal', 'wisteria', 'mist'];
        const type = types[Math.floor(Math.random() * types.length)];

        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            size: Math.random() * 5 + 2,
            speedX: (Math.random() - 0.3) * 1.5,
            speedY: Math.random() * 1.8 + 0.6,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            opacity: Math.random() * 0.7 + 0.3,
            fadeSpeed: Math.random() * 0.005 + 0.002,
            type: type,
            oscillation: Math.random() * Math.PI * 2,
            oscillationSpeed: Math.random() * 0.03 + 0.01
        };
    }

    spawnParticles() {
        this.particles = [];
        for (let i = 0; i < this.numParticles; i++) {
            this.particles.push(this.createParticle());
        }
    }

    setMode(mode) {
        this.currentMode = mode;
    }

    drawPetal(p, colorA, colorB) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);

        const grad = this.ctx.createLinearGradient(-p.size, -p.size, p.size, p.size);
        grad.addColorStop(0, colorA);
        grad.addColorStop(1, colorB);

        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        // Delicate curved petal path
        this.ctx.moveTo(0, -p.size * 1.5);
        this.ctx.bezierCurveTo(p.size * 1.2, -p.size * 0.8, p.size * 1.2, p.size * 0.8, 0, p.size * 1.6);
        this.ctx.bezierCurveTo(-p.size * 1.2, p.size * 0.8, -p.size * 1.2, -p.size * 0.8, 0, -p.size * 1.5);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.restore();
    }

    drawEmber(p) {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);

        const glow = this.ctx.createRadialGradient(0, 0, 0, 0, 0, p.size * 2.5);
        glow.addColorStop(0, `rgba(255, 230, 120, ${p.opacity})`);
        glow.addColorStop(0.35, `rgba(255, 60, 20, ${p.opacity * 0.8})`);
        glow.addColorStop(1, 'rgba(200, 0, 0, 0)');

        this.ctx.fillStyle = glow;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 2.2, 0, Math.PI * 2);
        this.ctx.fill();

        // Bright hot core
        this.ctx.fillStyle = `rgba(255, 255, 220, ${p.opacity * 0.95})`;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    drawWisteria(p) {
        // Soft violet/purple wisteria cluster petal
        this.drawPetal(p, `rgba(186, 147, 245, ${p.opacity})`, `rgba(112, 60, 200, ${p.opacity * 0.7})`);
    }

    drawMistParticle(p) {
        this.ctx.save();
        const mistGrad = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
        mistGrad.addColorStop(0, `rgba(220, 30, 45, ${p.opacity * 0.08})`);
        mistGrad.addColorStop(0.6, `rgba(120, 15, 25, ${p.opacity * 0.04})`);
        mistGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = mistGrad;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.restore();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        this.ctx.clearRect(0, 0, this.width, this.height);

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // Motion physics
            p.oscillation += p.oscillationSpeed;
            p.rotation += p.rotationSpeed;

            if (p.type === 'ember') {
                // Embers drift upwards
                p.y -= p.speedY * 1.1;
                p.x += Math.sin(p.oscillation) * 0.8 + p.speedX * 0.4;
            } else {
                // Petals and mist drift gracefully downward and sideways
                p.y += p.speedY * 0.8;
                p.x += Math.sin(p.oscillation) * 1.2 + p.speedX;
            }

            // Mouse displacement (interactive katana wake)
            const dx = this.mouse.x - p.x;
            const dy = this.mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < this.mouse.radius) {
                const force = (1 - dist / this.mouse.radius) * 3;
                p.x -= (dx / dist) * force * 2;
                p.y -= (dy / dist) * force * 2;
            }

            // Render according to type
            if (p.type === 'ember') {
                this.drawEmber(p);
            } else if (p.type === 'wisteria') {
                this.drawWisteria(p);
            } else if (p.type === 'mist') {
                this.drawMistParticle(p);
            } else {
                // Sakura crimson/pink petal
                this.drawPetal(p, `rgba(255, 120, 150, ${p.opacity})`, `rgba(215, 35, 60, ${p.opacity * 0.8})`);
            }

            // Boundaries wrap
            if (p.y < -20) {
                p.y = this.height + 15;
                p.x = Math.random() * this.width;
            } else if (p.y > this.height + 20) {
                p.y = -15;
                p.x = Math.random() * this.width;
            }

            if (p.x < -30) p.x = this.width + 25;
            if (p.x > this.width + 30) p.x = -25;
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.particleEngine = new ParticleEngine('bg-canvas');
});
