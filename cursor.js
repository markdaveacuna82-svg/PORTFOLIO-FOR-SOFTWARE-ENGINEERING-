/**
 * Demon Slayer Custom Katana Cursor & Slash Trail Effect
 */

class KatanaCursor {
    constructor() {
        // Only run on devices with fine pointer
        if (window.matchMedia('(pointer: coarse)').matches) {
            return;
        }

        this.cursor = document.querySelector('.custom-cursor');
        this.cursorDot = document.querySelector('.cursor-dot');
        this.trailCanvas = document.getElementById('cursor-canvas');
        if (!this.trailCanvas) return;

        this.ctx = this.trailCanvas.getContext('2d');
        this.points = [];
        this.maxPoints = 22;
        this.mouseX = -100;
        this.mouseY = -100;
        this.currentX = -100;
        this.currentY = -100;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;

            this.points.push({
                x: e.clientX,
                y: e.clientY,
                age: 0,
                life: 1
            });

            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        });

        // Hover scale effects on interactive elements
        const targets = 'a, button, input, textarea, .mission-card, .skill-card, .btn, .interactive';
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest(targets)) {
                document.body.classList.add('cursor-hover');
            }
        });
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest(targets)) {
                document.body.classList.remove('cursor-hover');
            }
        });

        // Katana strike spark burst on click
        window.addEventListener('click', (e) => {
            this.createSlashSparks(e.clientX, e.clientY);
            if (window.soundEngine) {
                // Subtle slash sound when clicking buttons
                if (e.target.closest('button, .btn, a')) {
                    window.soundEngine.playKatanaSlash();
                } else {
                    window.soundEngine.playUiClick();
                }
            }
        });

        this.animate();
    }

    resize() {
        this.trailCanvas.width = window.innerWidth;
        this.trailCanvas.height = window.innerHeight;
    }

    createSlashSparks(x, y) {
        const sparkContainer = document.createElement('div');
        sparkContainer.className = 'slash-impact-effect';
        sparkContainer.style.left = `${x}px`;
        sparkContainer.style.top = `${y}px`;

        // Create 8 directional sparks
        for (let i = 0; i < 8; i++) {
            const spark = document.createElement('span');
            spark.className = 'spark-particle';
            const angle = (i * 45) + (Math.random() * 20 - 10);
            const dist = Math.random() * 35 + 25;
            spark.style.setProperty('--tx', `${Math.cos(angle * Math.PI / 180) * dist}px`);
            spark.style.setProperty('--ty', `${Math.sin(angle * Math.PI / 180) * dist}px`);
            sparkContainer.appendChild(spark);
        }

        document.body.appendChild(sparkContainer);
        setTimeout(() => sparkContainer.remove(), 600);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth cursor dot lerp
        this.currentX += (this.mouseX - this.currentX) * 0.35;
        this.currentY += (this.mouseY - this.currentY) * 0.35;

        if (this.cursor) {
            this.cursor.style.transform = `translate3d(${this.currentX}px, ${this.currentY}px, 0)`;
        }

        // Draw Katana Blade Slash Trail
        this.ctx.clearRect(0, 0, this.trailCanvas.width, this.trailCanvas.height);

        if (this.points.length < 2) return;

        for (let i = 0; i < this.points.length; i++) {
            this.points[i].age++;
            this.points[i].life -= 0.045;
        }

        this.points = this.points.filter(p => p.life > 0);

        if (this.points.length > 1) {
            this.ctx.save();
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';

            for (let i = 1; i < this.points.length; i++) {
                const p1 = this.points[i - 1];
                const p2 = this.points[i];
                const ratio = i / this.points.length;

                this.ctx.beginPath();
                this.ctx.moveTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);

                // Crimson Nichirin Blade glow
                this.ctx.lineWidth = ratio * 6.5;
                this.ctx.strokeStyle = `rgba(230, 57, 70, ${p2.life * 0.75})`;
                this.ctx.shadowColor = '#ff2a40';
                this.ctx.shadowBlur = 12;
                this.ctx.stroke();

                // Bright inner silver/white blade edge
                this.ctx.lineWidth = ratio * 2.2;
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${p2.life * 0.95})`;
                this.ctx.shadowBlur = 4;
                this.ctx.stroke();
            }

            this.ctx.restore();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.katanaCursor = new KatanaCursor();
});
