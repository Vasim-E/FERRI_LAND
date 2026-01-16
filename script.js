// Custom Cursor
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');

window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    // Simple delay effect for the outline or just direct follow with CSS transition
    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
});

// Sticky Navbar
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Scroll Animation Reveal
const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const elementVisible = 150;

    revealElements.forEach((reveal) => {
        const elementTop = reveal.getBoundingClientRect().top;
        if (elementTop < windowHeight - elementVisible) {
            reveal.classList.add('active');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Trigger once on load to show elements already in view
revealOnScroll();

// Parallax effect for hero (subtle)
const heroImage = document.querySelector('.floating-product');
window.addEventListener('mousemove', (e) => {
    if (window.innerWidth > 900) {
        const x = (window.innerWidth - e.pageX) / 50;
        const y = (window.innerHeight - e.pageY) / 50;

        if (heroImage) {
            heroImage.style.transform = `translate(${x}px, ${y}px) rotate(${x * 0.5}deg)`;
        }
    }
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-links li');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Toggle icon between bars and times (X)
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Close mobile menu when a link is clicked
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
});

// Order Modal Logic
const modal = document.getElementById('orderModal');
const closeBtn = document.querySelector('.close-modal');
const shopButtons = document.querySelectorAll('.btn-shop-now');
const modalTitle = document.getElementById('modalProductTitle');
const orderForm = document.querySelector('.order-form');

// Open Modal
shopButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Find the product title associated with the clicked button
        // The button is inside .card-details, which is sibling to .card-image
        // We can traverse up to .product-card then down to h3
        const card = e.target.closest('.product-card');
        const productTitle = card.querySelector('h3').textContent;

        modalTitle.textContent = `Order ${productTitle}`;
        modal.style.display = "block";
        // Trigger reflow to enable transition
        void modal.offsetWidth;
        modal.classList.add('show');
    });
});

// Close Modal Function
const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300); // Wait for transition
};

// Close on X click
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target == modal) {
        closeModal();
    }
});

// Handle Form Submit (Simulation)
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Here you would typically send the data to a backend or WhatsApp
        // For now, let's just show an alert and close the modal
        alert(`Thank you for your order of ${modalTitle.textContent.replace('Order ', '')}! We will contact you shortly.`);
        closeModal();
        orderForm.reset();
    });
}
