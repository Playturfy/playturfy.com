// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initFloatingHearts();
    initButtons();
    initLiveCounter();
});

// Floating Hearts
function initFloatingHearts() {
    const container = document.getElementById('floatingHearts');
    
    // Create initial hearts
    for (let i = 0; i < 8; i++) {
        setTimeout(() => createFloatingHeart(container), i * 300);
    }
    
    // Continue creating hearts
    setInterval(() => {
        createFloatingHeart(container);
    }, 2000);
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = `
        <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
    `;
    
    const colors = ['#ff6b9d', '#ff1744', '#ff8fab', '#ffc0cb', '#ff69b4'];
    heart.style.color = colors[Math.floor(Math.random() * colors.length)];
    heart.style.left = Math.random() * 100 + '%';
    heart.style.animationDuration = (Math.random() * 8 + 10) + 's';
    heart.style.fontSize = (Math.random() * 20 + 25) + 'px';
    heart.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(heart);
    
    setTimeout(() => heart.remove(), 18000);
}

// Live Counter - Marriage Date: 18/11/2023
function initLiveCounter() {
    const marriageDate = new Date('2023-11-18T00:00:00');
    
    function updateCounter() {
        const now = new Date();
        const diff = now - marriageDate;
        
        // Calculate time units
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Update display
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update immediately and then every second
    updateCounter();
    setInterval(updateCounter, 1000);
}

// Button Logic
function initButtons() {
    const yesBtn = document.getElementById('yesBtn');
    const noBtn = document.getElementById('noBtn');
    const questionCard = document.getElementById('questionCard');
    const congratsCard = document.getElementById('congratsCard');
    
    let noClickCount = 0;
    const noMessages = [
        { text: "No", icon: "sad" },
        { text: "Are you sure?", icon: "sad" },
        { text: "Really?", icon: "cry" },
        { text: "Please?", icon: "pray" },
        { text: "Think again!", icon: "broken" },
        { text: "Don't do this!", icon: "sad" },
        { text: "Last chance!", icon: "heart" },
        { text: "Pretty please?", icon: "pray" }
    ];
    
    const iconSVGs = {
        sad: '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 3c-2.33 0-4.31 1.46-5.11 3.5h10.22c-.8-2.04-2.78-3.5-5.11-3.5z"/></svg>',
        cry: '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-3.5-9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm7 0c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5zm-3.5 6.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z"/></svg>',
        pray: '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>',
        broken: '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/><line x1="2" y1="2" x2="22" y2="22" stroke="white" stroke-width="2"/></svg>',
        heart: '<svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
    };
    
    // Yes Button Click
    yesBtn.addEventListener('click', () => {
        // Hide question card
        questionCard.style.animation = 'cardDisappear 0.5s ease-in forwards';
        
        setTimeout(() => {
            questionCard.style.display = 'none';
            congratsCard.classList.add('show');
            
            // Create massive confetti
            createMassiveConfetti();
        }, 500);
    });
    
    // No Button Click - Move to random position
    noBtn.addEventListener('click', (e) => {
        e.preventDefault();
        moveNoButton(noBtn);
        
        // Change button text and icon
        if (noClickCount < noMessages.length - 1) {
            noClickCount++;
            const message = noMessages[noClickCount];
            noBtn.innerHTML = iconSVGs[message.icon] + message.text;
        }
        
        // Make Yes button bigger each time
        const currentScale = 1 + (noClickCount * 0.15);
        yesBtn.style.transform = `scale(${currentScale})`;
    });
    
    // Also move on hover for desktop
    noBtn.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) {
            moveNoButton(noBtn);
        }
    });
}

// Move No Button to Random Position (stay within visible card area)
function moveNoButton(button) {
    const card = document.getElementById('questionCard');
    const cardRect = card.getBoundingClientRect();
    const buttonRect = button.getBoundingClientRect();
    
    // Add moving class for higher z-index
    button.classList.add('moving');
    
    // Calculate boundaries within the visible card area
    const padding = 50;
    const minX = cardRect.left + padding;
    const maxX = cardRect.right - buttonRect.width - padding;
    const minY = cardRect.top + padding + 100; // Start below title
    const maxY = cardRect.bottom - buttonRect.height - padding - 100; // Stay above bottom buttons
    
    // Ensure valid range
    const validMaxX = Math.max(minX, maxX);
    const validMaxY = Math.max(minY, maxY);
    
    // Generate random position within card boundaries
    const randomX = Math.random() * (validMaxX - minX) + minX;
    const randomY = Math.random() * (validMaxY - minY) + minY;
    
    // Apply fixed position
    button.style.position = 'fixed';
    button.style.left = randomX + 'px';
    button.style.top = randomY + 'px';
    button.style.transform = 'translate(0, 0)';
    button.style.zIndex = '99999';
    button.style.transition = 'left 0.3s ease, top 0.3s ease';
    button.style.pointerEvents = 'auto';
    button.style.opacity = '1';
    button.style.visibility = 'visible';
    
    // Add bounce effect
    button.style.animation = 'buttonBounce 0.5s ease';
    setTimeout(() => {
        button.style.animation = '';
    }, 500);
}

// Massive Confetti
function createMassiveConfetti() {
    const container = document.getElementById('confettiContainer');
    const colors = ['#ff1744', '#ff6b9d', '#ff8fab', '#ffc0cb', '#ff69b4', '#ffd700', '#ffb6c1'];
    
    for (let i = 0; i < 150; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
            confetti.style.animationDelay = (Math.random() * 0.5) + 's';
            
            // Random shapes
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            // Random sizes
            const size = Math.random() * 8 + 8;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            
            container.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 4000);
        }, i * 15);
    }
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes cardDisappear {
        to {
            opacity: 0;
            transform: scale(0.8) translateY(-50px);
        }
    }
    
    @keyframes shake {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-10px, 0); }
        75% { transform: translate(10px, 0); }
    }
    
    @keyframes buttonBounce {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
