/* main.js - site-wide scripts
   - AOS init (if loaded)
   - countdown timer (if element with id="countdown" exists)
   - lab card toggle (for .lab-card .lab-details)
   - smooth scroll for anchor links
   - hero counter animation for elements with data-counter
*/
(function(){
    function ready(fn){
        if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function(){
        // AOS init (safe check)
        if (window.AOS && typeof AOS.init === 'function') {
            AOS.init({ duration: 900, once: true });
        }

        // Countdown (if present)
        (function(){
            const countdownEl = document.getElementById('countdown');
            if (!countdownEl) return;
            function updateCountdown(){
                const eventDate = new Date('2024-05-10T09:00:00');
                const now = new Date();
                const diff = eventDate - now;
                if (diff <= 0) { countdownEl.textContent = 'Event Started!'; return; }
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const mins = Math.floor((diff / (1000 * 60)) % 60);
                const secs = Math.floor((diff / 1000) % 60);
                countdownEl.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
            }
            updateCountdown();
            setInterval(updateCountdown, 1000);
        })();

        // Labs: click to toggle details
        document.querySelectorAll('.lab-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', function(){
                const details = card.querySelector('.lab-details');
                if (!details) return;
                const open = details.style.display === 'block';
                document.querySelectorAll('.lab-details').forEach(d => d.style.display = 'none');
                details.style.display = open ? 'none' : 'block';
            });
        });

        // Smooth scroll for anchors
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (!href || href === '#') return;
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // Hero / stat counters (data-counter)
        document.querySelectorAll('[data-counter]').forEach(el => {
            const target = parseInt(el.getAttribute('data-counter'), 10) || 0;
            const plus = el.hasAttribute('data-plus');
            let current = 0;
            const step = Math.max(1, Math.floor(target / 60));
            const iv = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target + (plus ? '+' : '');
                    clearInterval(iv);
                } else {
                    el.textContent = current;
                }
            }, 16);
        });

    });
})();
