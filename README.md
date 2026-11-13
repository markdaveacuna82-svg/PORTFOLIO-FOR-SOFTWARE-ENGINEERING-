# 🗡️ Mark Dave Acuña BSIT 3— C IT Portfolio

An anime-inspired personal developer portfolio website crafted for **Mark Dave Acuña**, an aspiring IT professional and BSIT student at **Computer Communication Development Institute (CCDI)**.

The design captures the dark fantasy atmosphere, Japanese aesthetics, breathing techniques, and cinematic visual effects of *Demon Slayer: Kimetsu no Yaiba*, while maintaining a clean, responsive layout.

---

## ⛩️ Live Features & Sections

1. **Cinematic Preloader & Opening Entrance:**
   - Features the Demon Slayer Corps "Metsu" (滅) emblem with rotating Nichirin Tsuba and loading bar.

2. **Hero Landing Page:**
   - Anime warrior character illustration with glowing Nichirin flame blade and Corps uniform.
   - Prominent glowing name: **MARK DAVE ACUÑA** with Japanese kanji seal.
   - Dual action buttons: *"Explore My Portfolio"* and *"Download CV"*.
   - Dynamic canvas background rendering drifting sakura petals, wisteria petals, fiery embers, and red mist.

3. **About Me – The Journey:**
   - Personal narrative of Mark Dave Acuña pursuing BSIT at CCDI.
   - Demon Slayer Corps Rank progression tracker (Mizunoto ➔ Kanoto ➔ Kinoto ➔ Hashira).
   - Kyojuro Rengoku flame quote: *"Set your heart ablaze, never give up, and keep moving forward."* (心を燃やせ).

4. **Skills – Breathing Techniques (全集中の呼吸):**
   - **Water Breathing:** HTML5 & CSS3
   - **Thunder Breathing:** JavaScript (ES6+)
   - **Flame Breathing:** PHP Backend Scripting
   - **Stone Breathing:** MySQL & Database Management
   - **Mist Breathing:** UI/UX Design & Prototyping
   - **Sun Breathing (Hinokami Kagura):** Problem Solving & Core Programming
   - Animated skill mastery bars with elemental glows and custom sound effects on hover.

5. **Projects – Demon Slayer Missions:**
   - **Featured Mission:** **QR Code Faculty Attendance System**
     - Digital system for CCDI faculty to instantly record attendance instead of manual logbook signing.
     - Includes **Interactive Live Simulation** allowing anyone to test camera scanning right in the browser!
   - **CCDI IT Asset & Terminal Manager**
   - **Breathing Style Assessment App**

6. **Education – Training Arc:**
   - Computer Communication Development Institute (CCDI)
   - Degree: Bachelor of Science in Information Technology (BSIT)
   - Academic Years: 2021 – 2026
   - Core curriculum milestones and certifications.

7. **Contact – Join the Demon Slayer Corps:**
   - Direct links for Email (`markdaveacuna82@gmail.com`), Facebook, GitHub, and LinkedIn.
   - Kasugai Crow transmission form with honeypot spam protection and instant toast notifications.

8. **Audio & Sound FX Engine:**
   - Web Audio API synthesizer for zero-dependency Japanese Koto/Biwa & Taiko ambient music.
   - Katana blade unsheathing SFX on clicks.
   - Water and thunder sound effects for breathing techniques.

---

## 📁 Project Directory Structure

```text
demon-slayer-portfolio/
│
├── index.html                 # Main portfolio single-page application
├── README.md                  # Documentation and setup instructions
│
├── css/
│   ├── style.css              # Demon Slayer color palette, typography & layout
│   └── animations.css         # Katana slash, flame pulse, glow & keyframes
│
├── js/
│   ├── main.js                # Navigation, scrollspy, modal logic & contact form
│   ├── particles.js           # 60fps canvas engine for embers, sakura & mist
│   ├── audio.js               # Web Audio API sound engine & Japanese koto BGM
│   └── cursor.js              # Katana sword-slash trail and spark burst cursor
│
├── api/
│   └── contact.php            # Optional backend transmission handler & JSON logger
│
└── assets/
    ├── character-hero.svg     # Demon Slayer Corps anime illustration
    ├── project-qr.svg         # QR Attendance System graphical preview
    ├── project-portal.svg     # IT Asset Management System preview
    └── project-breathing.svg  # Breathing Technique Wheel graphic
```

---

## 🚀 How to Run Locally

### Option 1: Direct Browser Launch (Static Mode)
Simply open `index.html` in any modern web browser (Chrome, Edge, Firefox, Brave). All visual effects, particles, sound effects, audio generator, and QR simulations work without an external server.

### Option 2: Using PHP Built-In Server (Full API Support)
If you wish to test the `api/contact.php` form storage:
```bash
cd "C:\Users\Vin\.gemini\antigravity\scratch\demon-slayer-portfolio"
php -S localhost:8000
```
Open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 3: Deploying Online
- **GitHub Pages:** Push the repository to GitHub and enable Pages in repository settings.
- **Vercel / Netlify:** Drag-and-drop the folder or link your GitHub repository.
