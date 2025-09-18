// Robust responsive navigation script
// - Supports .nav-toggle (or id="nav-toggle") anywhere on the page
// - Falls back to .nav-links if #nav-links is missing
// - Safe no-op when necessary elements are not present
// - Restores previous body overflow value when closing the menu
// - Adds keyboard support for Enter/Space and Escape

document.addEventListener('DOMContentLoaded', function () {
    try {
        // Support both id and class usage; select all toggle buttons if present
        const navToggleEls = Array.from(document.querySelectorAll('.nav-toggle, #nav-toggle'));
        const navLinks = document.getElementById('nav-links') || document.querySelector('.nav-links');
        const navCtaGroup = document.querySelector('.nav-cta-group');

        // If there is no nav toggle or no nav links, nothing to do
        if (!navToggleEls.length || !navLinks) {
            return;
        }

        let isMenuOpen = false;
        let _previousBodyOverflow = null;
        let resizeTimeout = null;

        function setToggleAttributes(expanded) {
            navToggleEls.forEach(el => {
                el.classList.toggle('active', expanded);
                el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
                el.setAttribute('aria-label', expanded ? 'Close navigation menu' : 'Open navigation menu');
            });
        }

        function openMenu() {
            navLinks.classList.add('active');
            if (navCtaGroup) navCtaGroup.style.display = 'none';
            if (_previousBodyOverflow === null) _previousBodyOverflow = document.body.style.overflow || '';
            document.body.style.overflow = 'hidden';
            isMenuOpen = true;
            setToggleAttributes(true);
        }

        function closeMenu() {
            navLinks.classList.remove('active');
            if (navCtaGroup) navCtaGroup.style.display = '';
            document.body.style.overflow = _previousBodyOverflow !== null ? _previousBodyOverflow : '';
            _previousBodyOverflow = null;
            isMenuOpen = false;
            setToggleAttributes(false);
        }

        function toggleMenu() {
            if (isMenuOpen) closeMenu(); else openMenu();
        }

        // Attach handlers to all toggle elements
        navToggleEls.forEach(toggle => {
            // Make sure toggle is focusable and has proper role for accessibility
            if (!toggle.hasAttribute('role')) toggle.setAttribute('role', 'button');
            if (!toggle.hasAttribute('tabindex')) toggle.setAttribute('tabindex', '0');

            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu();
            });

            toggle.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleMenu();
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const clickedInsideToggle = navToggleEls.some(el => el.contains(event.target));
            const clickedInsideNav = navLinks.contains(event.target);
            if (isMenuOpen && !clickedInsideToggle && !clickedInsideNav) {
                closeMenu();
            }
        }, { passive: true });

        // Close menu when clicking a link inside nav (supports anchor nested elements)
        navLinks.addEventListener('click', function (event) {
            const anchor = event.target.closest('a');
            if (anchor && isMenuOpen) closeMenu();
        });

        // Keyboard: Escape closes
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && isMenuOpen) closeMenu();
        });

        // Responsive: close on resize above mobile
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                if (window.innerWidth > 768 && isMenuOpen) closeMenu();
            }, 120);
        }, { passive: true });

    } catch (err) {
        // avoid breaking other scripts
        console.error('Navbar script error:', err);
    }
});
