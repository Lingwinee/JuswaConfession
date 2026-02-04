// --- CONFIGURATION ---
const poemLines = [
    "There are billions of stars in the sky, but my eyes always find their way to you.",
    "#######, your laughter is my favorite song, and your happiness is my only wish.", //Frances
    "Every moment with you feels like a beautiful dream I never want to wake up from.",
    "I don't need the whole world to love me, I just need you.",
    "So, on this day of love, I have one question..."
];

const reasons = [
    { title: "Your Smile", color: "bg-pink-100" },
    { title: "Your Kindness", color: "bg-rose-100" },
    { title: "The Way You Laugh", color: "bg-red-100" },
    { title: "Your Eyes", color: "bg-orange-100" },
    { title: "Your Support", color: "bg-purple-100" },
    { title: "Your Warmth", color: "bg-yellow-100" },
    { title: "Just Being You", color: "bg-blue-100" }
];

// --- SETUP ---
let isMusicPlaying = false;
const audio = document.getElementById('bg-music');
let activeCards = [...reasons]; 

// Start Petals Immediately
window.onload = function() {
    startPetals();
};

function startExperience() {
    audio.volume = 0.5;
    audio.play().then(() => {
        isMusicPlaying = true;
        document.getElementById('music-btn').classList.add('music-playing');
    }).catch(e => console.log("Audio waiting for interaction"));

    gsap.to("#view-intro", { opacity: 0, duration: 0.8, onComplete: () => {
        document.getElementById('view-intro').style.display = 'none';
        document.getElementById('view-envelope').classList.remove('hidden');
        document.getElementById('view-envelope').classList.add('flex');
    }});
    
    gsap.to("#env-title", { opacity: 1, y: 20, duration: 1, delay: 0.5, ease: "power2.out" });

    initCards();
    initScratchCard();
}

// --- ENVELOPE LOGIC ---
function openLetter() {
    const envelope = document.getElementById('envelope-obj');
    envelope.classList.add('open');
    
    gsap.to(".envelope-wrapper", { scale: 1.2, rotate: 0, duration: 0.8, ease: "back.inOut(1.7)" });

    setTimeout(() => {
        gsap.to("#view-envelope", { opacity: 0, duration: 0.5, onComplete: () => {
            document.getElementById('view-envelope').style.display = 'none';
            document.getElementById('view-content').classList.remove('hidden');
            
            startTypewriter();
            initGyroTilt();
        }});
    }, 1200);
}

// --- TYPEWRITER POEM ---
function startTypewriter() {
    const container = document.getElementById('typewriter-text');
    let lineIndex = 0;

    function typeLine() {
        if (lineIndex < poemLines.length) {
            const p = document.createElement('p');
            p.className = "mb-4 opacity-0 transform translate-y-2";
            container.appendChild(p);
            
            gsap.to(p, { opacity: 1, y: 0, duration: 0.5 });
            gsap.to(p, {
                text: { value: poemLines[lineIndex] },
                duration: poemLines[lineIndex].length * 0.05,
                ease: "none",
                onComplete: () => {
                    lineIndex++;
                    setTimeout(typeLine, 600);
                }
            });
        }
    }
    typeLine();
}

// --- FALLING PETALS EFFECT (IMMEDIATE) ---
function startPetals() {
    const container = document.getElementById('petals-container');
    const petalChars = ['🌸', '🌹', '🌺', '✨', '🤍'];
    
    // Create initial batch
    for(let i=0; i<10; i++) spawnPetal();

    // Continuous spawn
    setInterval(spawnPetal, 300);

    function spawnPetal() {
        const p = document.createElement('div');
        p.className = 'petal text-2xl opacity-70';
        p.innerText = petalChars[Math.floor(Math.random() * petalChars.length)];
        p.style.left = Math.random() * 100 + 'vw';
        p.style.animationDuration = Math.random() * 5 + 6 + 's';
        p.style.fontSize = Math.random() * 1.5 + 0.5 + 'rem';
        container.appendChild(p);
        
        // Cleanup
        setTimeout(() => p.remove(), 11000);
    }
}

// --- INFINITE CARD LOOP LOGIC ---
function initCards() {
    renderStack();
}

function renderStack() {
    const container = document.getElementById('card-stack');
    container.innerHTML = '';
    
    // Render only top 4 visual cards for performance
    activeCards.slice(0, 4).reverse().forEach((reason, i) => {
        const card = document.createElement('div');
        const rot = (Math.random() - 0.5) * 8; 
        const offset = i * 2; 
        
        card.className = `absolute inset-0 rounded-xl shadow-lg flex items-center justify-center border border-white/60 ${reason.color} transition-all duration-300`;
        card.style.transform = `rotate(${rot}deg) translateY(-${offset}px)`;
        card.style.zIndex = i;
        
        // Content
        card.innerHTML = `<p class="font-hand text-2xl text-gray-700 text-center px-4">${reason.title}</p>`;
        container.appendChild(card);
    });
}

function swipeCard() {
    const container = document.getElementById('card-stack');
    const cards = container.children;
    if(cards.length === 0) return;

    const topCard = cards[cards.length - 1]; // Visually top card
    
    // 1. Animate Out
    gsap.to(topCard, {
        x: 200, // Fly right
        y: 50,
        rotation: 45,
        opacity: 0,
        duration: 0.4,
        ease: "power1.in",
        onComplete: () => {
            // 2. Data Logic: Move top item to bottom of array
            const item = activeCards.shift(); 
            activeCards.push(item); 
            
            // 3. Re-render stack
            renderStack();
        }
    });
}

// --- SCRATCH CARD ---
function initScratchCard() {
    const canvas = document.getElementById('scratch-pad');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f1f5f9'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#94a3b8'; ctx.font = '20px Montserrat'; ctx.fillText("Scratch Here", 65, 70);

    let isDrawing = false;
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (clientX - rect.left) * (canvas.width / rect.width), y: (clientY - rect.top) * (canvas.height / rect.height) };
    };
    const scratch = (x, y) => {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath(); ctx.arc(x, y, 15, 0, Math.PI * 2); ctx.fill();
    };

    ['mousedown', 'touchstart'].forEach(evt => canvas.addEventListener(evt, (e) => { isDrawing = true; const p = getPos(e); scratch(p.x, p.y); }));
    ['mousemove', 'touchmove'].forEach(evt => canvas.addEventListener(evt, (e) => { if(isDrawing) { e.preventDefault(); const p = getPos(e); scratch(p.x, p.y); }}));
    ['mouseup', 'touchend'].forEach(evt => canvas.addEventListener(evt, () => isDrawing = false));
}

// --- ADVANCED NO BUTTON LOGIC (Teleport + Repel) ---
const noBtn = document.getElementById('no-btn');
const btnContainer = document.getElementById('btn-container');

// 1. Touch/Click Teleport (Final Defense)
['click', 'touchstart', 'mousedown'].forEach(evt => 
    noBtn.addEventListener(evt, (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        teleportButton(); 
    })
);

// 2. Proximity Repel & Wall Teleport
['mousemove', 'touchmove'].forEach(evt => 
    document.addEventListener(evt, (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const btnRect = noBtn.getBoundingClientRect();
        const containerRect = btnContainer.getBoundingClientRect();
        const btnCX = btnRect.left + btnRect.width/2;
        const btnCY = btnRect.top + btnRect.height/2;
        
        const dist = Math.hypot(clientX - btnCX, clientY - btnCY);
        
        // If SUPER close (caught), teleport
        if (dist < 20) {
            teleportButton();
            return;
        }

        // If close, repel
        if (dist < 100) {
            const angle = Math.atan2(clientY - btnCY, clientX - btnCX);
            const force = (100 - dist) * 2.5; // Strong repel
            
            const currX = gsap.getProperty(noBtn, "x");
            const currY = gsap.getProperty(noBtn, "y");
            
            let nextX = currX - Math.cos(angle) * force;
            let nextY = currY - Math.sin(angle) * force;

            // Wall Check logic
            const maxX = (containerRect.width - btnRect.width) / 2;
            const maxY = (containerRect.height - btnRect.height) / 2;
            
            // If hitting wall, teleport instead of sticking
            if (Math.abs(nextX) > maxX - 5 || Math.abs(nextY) > maxY - 5) {
                teleportButton();
            } else {
                gsap.to(noBtn, { x: nextX, y: nextY, duration: 0.1, overwrite: "auto" });
            }
        }
    })
);

function teleportButton() {
    const containerRect = btnContainer.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    
    // Available space
    const w = containerRect.width - btnRect.width;
    const h = containerRect.height - btnRect.height;
    
    const newX = (Math.random() - 0.5) * w * 0.8; 
    const newY = (Math.random() - 0.5) * h * 0.8;

    gsap.to(noBtn, { x: newX, y: newY, duration: 0, overwrite: true });
}

// --- SUCCESS SEQUENCE ---
function sayYes() {
    const viewSuccess = document.getElementById('view-success');
    viewSuccess.classList.remove('hidden');
    viewSuccess.classList.add('flex');
    
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 }, colors: ['#f43f5e', '#ec4899', '#ffffff'] });

    gsap.to("#success-title", { scale: 1, duration: 1, ease: "elastic.out(1, 0.3)" });
    gsap.to("#ticket", { opacity: 1, y: 0, delay: 0.5, duration: 0.8, ease: "back.out(1.2)" });
}

function sendResponse() {
    // Opens Facebook Messenger generic link.
    // Joshua should replace this with: https://m.me/USERNAME
    window.open('https://www.facebook.com/joshua.salvador.034', '_blank');
}

// --- PHOTO TILT (Mouse & Gyro) ---
function initGyroTilt() {
    const card = document.getElementById('hero-card');
    
    // Mouse Tilt (Desktop)
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 30;
        const y = (window.innerHeight / 2 - e.pageY) / 30;
        card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
    });

    // Gyro Tilt (Mobile)
    window.addEventListener('deviceorientation', (e) => {
        // Only run if the device actually reports orientation
        if(e.gamma !== null && e.beta !== null) {
            // Gamma: left-to-right tilt (-90 to 90)
            // Beta: front-to-back tilt (-180 to 180)
            const x = e.gamma / 3; 
            // Subtracting 20 because users typically hold phones tilted slightly up
            const y = (e.beta / 3) - 20; 
            card.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
        }
    });
}

function updatePhoto(event) {
    document.getElementById('joshua-photo').src = URL.createObjectURL(event.target.files[0]);
    document.getElementById('img-fallback').style.display = 'none';
}

function toggleMusic() {
    const btn = document.getElementById('music-btn');
    if(isMusicPlaying) {
        audio.pause();
        isMusicPlaying = false;
        btn.classList.remove('music-playing');
    } else {
        audio.play();
        isMusicPlaying = true;
        btn.classList.add('music-playing');
    }
}


function resetApp() { location.reload(); }
