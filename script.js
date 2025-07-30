// Scroll effect: shrink profile image with Tailwind classes
window.addEventListener('scroll', function () {
    const profileImg = document.getElementById('profile-img');
    if (!profileImg) return;
    if (window.scrollY > 40) {
        profileImg.classList.remove('w-36', 'h-36', 'mb-3');
        profileImg.classList.add('w-14', 'h-14', 'mb-0');
    } else {
        profileImg.classList.add('w-36', 'h-36', 'mb-3');
        profileImg.classList.remove('w-14', 'h-14', 'mb-0');
    }
});

// Add Me button: save contact
function saveContact() {
    // vCard format for download
    const vCardData = `BEGIN:VCARD\nVERSION:3.0\nFN:Dinitha Serasinghe\nORG:Prasuking (pvt) LTD\nTITLE:Cyber Security Intern\nEMAIL:dinitha@email.com\nEND:VCARD`;
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Dinitha_Serasinghe.vcf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

document.addEventListener('DOMContentLoaded', function () {
    // Profile card pop and tilt logic
    const profileCard = document.getElementById('profile-card');
    const cardShine = document.getElementById('card-shine');
    let cardHold = false, cardStartX = 0, cardStartY = 0;

    function setCardTransform(scale = 1, rotateX = 0, rotateY = 0, shineX = 50, showShine = false, gradAngle = null) {
        if (!profileCard) return;
        profileCard.style.transform = `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        profileCard.style.transition = scale === 1 ? 'transform 0.22s cubic-bezier(.4,2,.6,1)' : 'transform 0.09s';
        if (cardShine) {
            cardShine.style.opacity = showShine ? '1' : '0';
            const shineDiv = cardShine.querySelector('div');
            if (shineDiv) {
                shineDiv.style.left = `calc(${shineX}% - 25%)`;
            }
        }
        if (gradAngle !== null) {
            profileCard.style.setProperty('--card-gradient-angle', gradAngle + 'deg');
        }
    }

    function cardHoldStart(e) {
        cardHold = true;
        // Stop animated gradient and set initial angle
        profileCard.classList.remove('animated-gradient-bg');
        setCardTransform(1.05, 0, 0, 50, true, 90);
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            cardStartX = touch.clientX;
            cardStartY = touch.clientY;
        } else {
            cardStartX = e.clientX;
            cardStartY = e.clientY;
        }
        window.addEventListener('touchmove', cardMove, {passive: false});
        window.addEventListener('mousemove', cardMove);
        window.addEventListener('touchend', cardHoldEnd);
        window.addEventListener('mouseup', cardHoldEnd);
    }
    function cardMove(e) {
        if (!cardHold) return;
        let x, y;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        const dx = Math.max(Math.min(x - cardStartX, 80), -80);
        const dy = Math.max(Math.min(y - cardStartY, 80), -80);
        const shineX = 50 + (dx / 2);
        // Map dx to angle between 60deg and 120deg (centered at 90)
        const gradAngle = 90 + (dx / 2);
        setCardTransform(1.05, -dy / 8, dx / 8, shineX, true, gradAngle);
    }
    function cardHoldEnd() {
        cardHold = false;
        setCardTransform(1, 0, 0, 50, false, 90);
        setTimeout(() => {
            if (profileCard) {
                profileCard.style.transform = '';
                profileCard.style.transition = '';
                profileCard.classList.add('animated-gradient-bg');
                profileCard.style.removeProperty('--card-gradient-angle');
            }
            if (cardShine) cardShine.style.opacity = '0';
        }, 220);
        window.removeEventListener('touchmove', cardMove);
        window.removeEventListener('mousemove', cardMove);
        window.removeEventListener('touchend', cardHoldEnd);
        window.removeEventListener('mouseup', cardHoldEnd);
    }
    if (profileCard) {
        profileCard.addEventListener('touchstart', cardHoldStart, {passive: false});
        profileCard.addEventListener('mousedown', cardHoldStart);
        profileCard.addEventListener('touchend', cardHoldEnd);
        profileCard.addEventListener('mouseup', cardHoldEnd);
        profileCard.addEventListener('mouseleave', cardHoldEnd);
    }

    // Profile image modal logic
    const profileImg = document.getElementById('profile-img');
    const profileModal = document.getElementById('profile-modal');
    let modalTimeout = null;

    function showModal() {
        if (profileModal) {
            profileModal.classList.remove('hidden');
            const img = profileModal.querySelector('img');
            img.style.transform = 'scale(0.92)';
            img.style.transition = 'transform 0.12s cubic-bezier(.4,2,.6,1)';
            setTimeout(() => {
                img.style.transform = 'scale(1)';
                img.style.transition = 'transform 0.22s cubic-bezier(.4,2,.6,1)';
            }, 40);
        }
    }
    function hideModal() {
        if (profileModal) {
            const img = profileModal.querySelector('img');
            img.style.transform = 'scale(0.92)';
            img.style.transition = 'transform 0.13s cubic-bezier(.4,2,.6,1)';
            setTimeout(() => {
                profileModal.classList.add('hidden');
                img.style.transform = '';
                img.style.transition = '';
            }, 120);
        }
    }
    if (profileImg && profileModal) {
        // Mouse events
        profileImg.addEventListener('mousedown', (e) => {
            e.preventDefault();
            modalTimeout = setTimeout(showModal, 120);
        });
        profileImg.addEventListener('mouseup', (e) => {
            clearTimeout(modalTimeout);
            hideModal();
        });
        profileImg.addEventListener('mouseleave', (e) => {
            clearTimeout(modalTimeout);
            hideModal();
        });
        // Touch events
        profileImg.addEventListener('touchstart', (e) => {
            modalTimeout = setTimeout(showModal, 90);
        }, {passive: true});
        profileImg.addEventListener('touchend', (e) => {
            clearTimeout(modalTimeout);
            hideModal();
        });
        profileImg.addEventListener('touchcancel', (e) => {
            clearTimeout(modalTimeout);
            hideModal();
        });
        // Also close modal if user taps anywhere on modal
        profileModal.addEventListener('mousedown', hideModal);
        profileModal.addEventListener('touchstart', hideModal);
    }

    const addMeBtn = document.getElementById('add-me-btn');
    const messageBtn = document.querySelector('a[href^="mailto:"]');
    if (addMeBtn) {
        addMeBtn.addEventListener('click', saveContact);
    }

    // Pop button effect
    function addPopEffect(btn) {
        if (!btn) return;
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.93)';
            btn.style.transition = 'transform 0.12s cubic-bezier(.4,2,.6,1)';
        });
        btn.addEventListener('touchstart', () => {
            btn.style.transform = 'scale(0.93)';
            btn.style.transition = 'transform 0.12s cubic-bezier(.4,2,.6,1)';
        }, {passive: true});
        const reset = () => {
            btn.style.transform = '';
            btn.style.transition = 'transform 0.22s cubic-bezier(.4,2,.6,1)';
        };
        btn.addEventListener('mouseup', reset);
        btn.addEventListener('mouseleave', reset);
        btn.addEventListener('touchend', reset);
        btn.addEventListener('touchcancel', reset);
    }
    addPopEffect(addMeBtn);
    addPopEffect(messageBtn);

    // Interactive description bubble
    const descBubble = document.getElementById('desc-bubble');
    let isHolding = false;
    let startX = 0, startY = 0;

    function setTransform(scale = 1, rotateX = 0, rotateY = 0) {
        descBubble.style.transform = `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        descBubble.style.transition = scale === 1 ? 'transform 0.25s cubic-bezier(.4,2,.6,1)' : 'transform 0.08s';
    }

    function onHoldStart(e) {
        isHolding = true;
        descBubble.style.willChange = 'transform';
        setTransform(1.09, 0, 0);
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
        } else {
            startX = e.clientX;
            startY = e.clientY;
        }
        window.addEventListener('touchmove', onMove, {passive: false});
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchend', onHoldEnd);
        window.addEventListener('mouseup', onHoldEnd);
    }

    function onMove(e) {
        if (!isHolding) return;
        let x, y;
        if (e.type.startsWith('touch')) {
            const touch = e.touches[0];
            x = touch.clientX;
            y = touch.clientY;
        } else {
            x = e.clientX;
            y = e.clientY;
        }
        const dx = Math.max(Math.min(x - startX, 60), -60);
        const dy = Math.max(Math.min(y - startY, 60), -60);
        // Tilt more on horizontal than vertical for a card-like feel
        setTransform(1.09, -dy / 8, dx / 8);
    }

    function onHoldEnd() {
        isHolding = false;
        setTransform(1, 0, 0);
        setTimeout(() => {
            descBubble.style.transform = '';
            descBubble.style.transition = '';
            descBubble.style.willChange = '';
        }, 250);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('touchend', onHoldEnd);
        window.removeEventListener('mouseup', onHoldEnd);
    }

    if (descBubble) {
        descBubble.addEventListener('touchstart', onHoldStart, {passive: false});
        descBubble.addEventListener('mousedown', onHoldStart);
        descBubble.addEventListener('touchend', onHoldEnd);
        descBubble.addEventListener('mouseup', onHoldEnd);
        descBubble.addEventListener('mouseleave', onHoldEnd);
    }
});
