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
        const elementBottom = reveal.getBoundingClientRect().bottom;

        // Check if element is visible in viewport
        if (elementTop < windowHeight - elementVisible && elementBottom > 0) {
            reveal.classList.add('active');
        } else {
            // Remove active class if out of view to re-trigger animation next time
            reveal.classList.remove('active');
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
const navbarShopBtn = document.getElementById('navShopBtn');
const orderForm = document.querySelector('.order-form');

// Function to open modal
const openModal = (preSelectProductName = null) => {
    // Reset all quantities to 0
    const qtyInputs = document.querySelectorAll('.qty-input');
    qtyInputs.forEach(input => input.value = 0);

    // If specific product clicked, set its qty to 1
    if (preSelectProductName) {
        // Simple exact match logic
        const productItems = document.querySelectorAll('.modal-product-item');
        productItems.forEach(item => {
            if (item.getAttribute('data-name') === preSelectProductName) {
                const qtyInput = item.querySelector('.qty-input');
                if (qtyInput) qtyInput.value = 1;
            }
        });
    }

    modal.style.display = "block";
    void modal.offsetWidth; // Trigger reflow
    modal.classList.add('show');
};

// Open Modal from Product Cards
shopButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const productTitle = card.querySelector('h3').textContent;
        openModal(productTitle);
    });
});

// Open Modal from Navbar
if (navbarShopBtn) {
    navbarShopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(null); // Open with all 0
    });
}

// Close Modal Function
const closeModal = () => {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
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

// Quantity Button Logic
const mpQtyContainers = document.querySelectorAll('.mp-qty');

mpQtyContainers.forEach(container => {
    const minusBtn = container.querySelector('.minus');
    const plusBtn = container.querySelector('.plus');
    const input = container.querySelector('.qty-input');

    minusBtn.addEventListener('click', () => {
        let currentValue = parseInt(input.value) || 0;
        if (currentValue > 0) {
            input.value = currentValue - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;
    });
});

// Handle Form Submit
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect ordered items
        const orderedItems = [];
        const productItems = document.querySelectorAll('.modal-product-item');

        productItems.forEach(item => {
            const name = item.getAttribute('data-name');
            const qty = parseInt(item.querySelector('.qty-input').value) || 0;
            if (qty > 0) {
                orderedItems.push(`${name} (x${qty})`);
            }
        });

        if (orderedItems.length === 0) {
            alert("Please add at least one item to your order.");
            return;
        }

        const customerName = document.getElementById('customerName').value;

        // Construct message
        const message = `Thank you ${customerName}! Your order has been placed:\n\n${orderedItems.join('\n')}\n\nWe will contact you shortly to confirm details.`;

        alert(message);
        closeModal();
        orderForm.reset();
        // Reset quantities manually
        document.querySelectorAll('.qty-input').forEach(input => input.value = 0);
    });
}
