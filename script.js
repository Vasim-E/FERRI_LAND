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
    // Reset pricing display
    if (typeof updateTotals === 'function') updateTotals();

    // If specific product clicked, set its qty to 1
    if (preSelectProductName) {
        // Simple exact match logic
        const productItems = document.querySelectorAll('.modal-product-item');
        productItems.forEach(item => {
            if (item.getAttribute('data-name') === preSelectProductName) {
                const qtyInput = item.querySelector('.qty-input');
                if (qtyInput) {
                    qtyInput.value = 1;
                    if (typeof updateTotals === 'function') updateTotals();
                }
            }
        });
    }

    modal.style.display = "block";
    // Double RAF to ensure browser has painted the display:block state
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
    });
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

// Update Totals Function
const updateTotals = () => {
    let grandTotal = 0;
    document.querySelectorAll('.modal-product-item').forEach(item => {
        const price = parseFloat(item.getAttribute('data-price')) || 0;
        const qty = parseInt(item.querySelector('.qty-input').value) || 0;
        const subtotal = price * qty;

        // Update subtotal text
        item.querySelector('.item-subtotal').textContent = `₹${subtotal}`;
        grandTotal += subtotal;
    });

    // Update Grand Total
    const grandTotalEl = document.getElementById('grandTotal');
    if (grandTotalEl) {
        grandTotalEl.textContent = `₹${grandTotal}`;
    }

    return grandTotal;
};

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
            updateTotals();
        }
    });

    plusBtn.addEventListener('click', () => {
        let currentValue = parseInt(input.value) || 0;
        input.value = currentValue + 1;
        updateTotals();
    });
});

// Initialize totals on modal open (part of openModal logic or separate)
// We'll just ensure they are reset when updated. The openModal function resets values to 0, so we should call updateTotals there too if possible, 
// OR simpler: manually call it inside openModal. Let's patch openModal separately or rely on the resets.

// Handle Form Submit
if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Collect ordered items
        const orderedItems = [];
        let calculatedGrandTotal = 0;

        const productItems = document.querySelectorAll('.modal-product-item');

        productItems.forEach(item => {
            const name = item.getAttribute('data-name');
            const price = parseFloat(item.getAttribute('data-price')) || 0;
            const qty = parseInt(item.querySelector('.qty-input').value) || 0;

            if (qty > 0) {
                const subtotal = price * qty;
                orderedItems.push(`${name} (x${qty}) - ₹${subtotal}`);
                calculatedGrandTotal += subtotal;
            }
        });

        if (orderedItems.length === 0) {
            alert("Please add at least one item to your order.");
            return;
        }

        const customerName = document.getElementById('customerName').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const customerAddress = document.getElementById('customerAddress').value;

        // Construct WhatsApp Message
        let waMessage = `*New Order from FerriLand Website* 🛍️\n\n`;
        waMessage += `*Customer Details:*\n`;
        waMessage += `👤 Name: ${customerName}\n`;
        waMessage += `📞 Phone: ${customerPhone}\n`;
        waMessage += `📍 Address: ${customerAddress}\n\n`;
        waMessage += `*Order Items:*\n`;
        waMessage += orderedItems.join('\n');
        waMessage += `\n\n*Total Amount: ₹${calculatedGrandTotal}*\n`;
        waMessage += `-----------------------------`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(waMessage);

        // WhatsApp URL
        const companyNumber = "916282077710";
        const waUrl = `https://wa.me/${companyNumber}?text=${encodedMessage}`;

        // Redirect to WhatsApp
        window.open(waUrl, '_blank');

        closeModal();
        orderForm.reset();
        // Reset quantities manually
        document.querySelectorAll('.qty-input').forEach(input => input.value = 0);
        updateTotals(); // Reset totals display
    });
}

// Distributor Modal Logic
const distModal = document.getElementById('distributorModal');
const btnDistributor = document.getElementById('btnDistributor');
const closeDistBtn = document.querySelector('.close-dist-modal'); // Updated selector
const distForm = document.getElementById('distributorForm');

const openDistModal = () => {
    distModal.style.display = "block";
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            distModal.classList.add('show');
        });
    });
};

const closeDistModal = () => {
    distModal.classList.remove('show');
    setTimeout(() => {
        distModal.style.display = "none";
    }, 300);
};

if (btnDistributor) {
    btnDistributor.addEventListener('click', (e) => {
        e.preventDefault();
        openDistModal();
    });
}

if (closeDistBtn) {
    closeDistBtn.addEventListener('click', closeDistModal);
}

window.addEventListener('click', (e) => {
    if (e.target == distModal) {
        closeDistModal();
    }
});

if (distForm) {
    distForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('distName').value;
        const phone = document.getElementById('distPhone').value;
        const address = document.getElementById('distAddress').value;
        const pincode = document.getElementById('distPincode').value;

        // Construct WhatsApp Message
        let waMessage = `*New Distributor Inquiry* 🤝\n\n`;
        waMessage += `*Partner Details:*\n`;
        waMessage += `👤 Name: ${name}\n`;
        waMessage += `📞 Phone: ${phone}\n`;
        waMessage += `📍 Address: ${address}\n`;
        waMessage += `📮 Pincode: ${pincode}\n\n`;
        waMessage += `I am interested in becoming a distributor for FerriLand.`;

        const encodedMessage = encodeURIComponent(waMessage);
        const companyNumber = "916282077710";
        const waUrl = `https://wa.me/${companyNumber}?text=${encodedMessage}`;

        window.open(waUrl, '_blank');

        closeDistModal();
        distForm.reset();
    });
}
