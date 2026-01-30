import { initThreeScene } from './three-scene.js';

// Setup GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize 3D Scene
initThreeScene();

// Mock Data for "Product Showcase"
const products = [
    { name: "Imperial Vase", price: "$2,500", image: "assets/images/marble_vase.png" },
    { name: "Bust of Apollo", price: "$4,200", image: "assets/images/marble_bust.png" },
    { name: "Fluid Motion", price: "$3,800", image: "assets/images/marble_abstract.png" },
    { name: "Royal Panel", price: "$1,500", image: "assets/images/marble_panel.png" },
    { name: "Lush Vase", price: "$2,100", image: "assets/images/marble_vase.png" },
    { name: "Modern Head", price: "$3,900", image: "assets/images/marble_bust.png" },
];

document.addEventListener('DOMContentLoaded', () => {

    // 1. Hero Text Animation
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    heroTl.to('.hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.5
    });

    heroTl.to('.scroll-indicator', {
        opacity: 0.7,
        y: 0,
        duration: 1
    }, "-=0.5");

    // 2. Populate Product Grid
    const grid = document.getElementById('product-grid');
    if (grid) {
        products.forEach((product, index) => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="card-info">
                    <h3>${product.name}</h3>
                    <p>${product.price}</p>
                </div>
            `;

            // Add click event to navigate to product page
            card.addEventListener('click', () => {
                window.location.href = `product.html?name=${encodeURIComponent(product.name)}&price=${encodeURIComponent(product.price)}`;
            });

            grid.appendChild(card);

            // Staggered Fade In Animation
            gsap.from(card, {
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%"
                },
                opacity: 0,
                y: 50,
                duration: 0.8,
                delay: index * 0.1
            });
        });
    }

    // 3. Navbar Scroll Effect
    window.addEventListener('scroll', () => {
        const nav = document.querySelector('nav');
        if (window.scrollY > 50) {
            nav.style.background = 'rgba(10, 10, 10, 0.9)';
            nav.style.backdropFilter = 'blur(10px)';
        } else {
            nav.style.background = 'transparent';
            nav.style.backdropFilter = 'none';
        }
    });

    // 4. Contact Form Handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';

            // Simulate sending
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = '#d4af37';
                btn.style.color = '#000';

                setTimeout(() => {
                    contactForm.reset();
                    btn.textContent = originalText;
                    btn.style.background = ''; // Revert to CSS default
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

});
