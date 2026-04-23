// Zaryn Educacao - Static Landing Page JavaScript

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    const menuToggle = document.getElementById('menuToggle');
    const menuIcon = menuToggle.querySelector('.menu-icon');
    const closeIcon = menuToggle.querySelector('.close-icon');

    nav.classList.toggle('nav-open');

    if (nav.classList.contains('nav-open')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
}

// Smooth Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });

        const nav = document.getElementById('mainNav');
        if (nav.classList.contains('nav-open')) {
            toggleMenu();
        }
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// FAQ Accordion Toggle
function toggleFAQ(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const chevron = button.querySelector('.faq-chevron');
    const isOpen = faqItem.classList.contains('active');

    document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        item.querySelector('.faq-answer').style.maxHeight = null;
        item.querySelector('.faq-chevron').style.transform = 'rotate(0deg)';
    });

    if (!isOpen) {
        faqItem.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        chevron.style.transform = 'rotate(180deg)';
    }
}

// Form Submission Handler
async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';

    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Enviando...';
    }

    try {
        const payload = new FormData(form);
        const response = await fetch(form.getAttribute('action') || 'API/send_mail.php', {
            method: 'POST',
            body: payload,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
            throw new Error((data && data.message) ? data.message : 'Não foi possível enviar agora.');
        }

        showToast('Solicitação enviada com sucesso! Nosso time retornará em breve.', 'success');
        form.reset();

        const formTs = document.getElementById('form_ts');
        if (formTs) {
            formTs.value = String(Math.floor(Date.now() / 1000));
        }
    } catch (error) {
        console.error('Erro no envio do formulário:', error);
        showToast(error.message || 'Erro ao enviar formulário. Tente novamente.', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    }
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show ' + type;

    setTimeout(() => {
        toast.className = 'toast';
    }, 4000);
}

// WhatsApp Integration
function openWhatsApp() {
    const phone = '5511974634116';
    const message = encodeURIComponent('Ola! Gostaria de agendar uma demonstracao da Zaryn Educacao.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Scroll Animations Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

function updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    return scrolled;
}

function handleHeaderScroll() {
    const header = document.querySelector('.header');
    const topBtn = document.querySelector('.floating-top');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(13, 17, 23, 0.98)';
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
    } else {
        header.style.background = 'rgba(13, 17, 23, 0.95)';
        header.style.boxShadow = 'none';
    }
    if (topBtn) {
        topBtn.classList.toggle('show', window.scrollY > 260);
    }
}

function initHeroSlider() {
    const slider = document.getElementById('heroSlider');
    if (!slider) return;

    let slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dotsWrap = document.getElementById('heroSliderDots');
    const prevBtn = slider.querySelector('.hero-slider-arrow.prev');
    const nextBtn = slider.querySelector('.hero-slider-arrow.next');
    if (!slides.length || !dotsWrap) return;

    const shuffle = (arr) => {
        const clone = arr.slice();
        for (let i = clone.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [clone[i], clone[j]] = [clone[j], clone[i]];
        }
        return clone;
    };

    const randomizedSlides = shuffle(slides);
    const anchorNode = prevBtn || nextBtn || dotsWrap;
    randomizedSlides.forEach((slide) => {
        slide.classList.remove('is-active');
        slider.insertBefore(slide, anchorNode);
    });
    slides = randomizedSlides;

    let index = 0;
    slides[0].classList.add('is-active');
    let timer = null;

    dotsWrap.innerHTML = slides.map((_, i) =>
        `<button type="button" class="hero-slider-dot${i === index ? ' is-active' : ''}" data-slide="${i}" aria-label="Ir para imagem ${i + 1}"></button>`
    ).join('');
    const dots = Array.from(dotsWrap.querySelectorAll('.hero-slider-dot'));

    const setSlide = (nextIndex) => {
        index = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    };

    const next = () => setSlide(index + 1);
    const prev = () => setSlide(index - 1);

    const start = () => {
        stop();
        timer = setInterval(next, 4200);
    };
    const stop = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); start(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); start(); });
    dotsWrap.addEventListener('click', (e) => {
        const btn = e.target.closest('.hero-slider-dot');
        if (!btn) return;
        const target = parseInt(btn.getAttribute('data-slide') || '0', 10);
        setSlide(target);
        start();
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);

    start();
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', function() {
    const formTs = document.getElementById('form_ts');
    if (formTs) {
        formTs.value = String(Math.floor(Date.now() / 1000));
    }

    document.querySelectorAll('[data-animate]').forEach((el, i) => {
        if (!el.hasAttribute('data-aos')) {
            el.setAttribute('data-aos', 'fade-up');
            el.setAttribute('data-aos-delay', String((i % 6) * 60));
        }
    });

    if (window.AOS && typeof window.AOS.init === 'function') {
        window.AOS.init({
            duration: 700,
            easing: 'ease-out-cubic',
            once: true,
            offset: 30
        });
    }

    initScrollAnimations();
    initHeroSlider();

    window.addEventListener('scroll', function() {
        handleHeaderScroll();
        updateScrollProgress();
    });

    document.addEventListener('click', function(event) {
        const nav = document.getElementById('mainNav');
        const menuToggle = document.getElementById('menuToggle');

        if (nav.classList.contains('nav-open') &&
            !nav.contains(event.target) &&
            !menuToggle.contains(event.target)) {
            toggleMenu();
        }
    });

    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleFAQ(this);
            }
        });
    });

    document.querySelectorAll('.faq-answer').forEach(answer => {
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease-out';
    });

    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        window.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 6;
            const y = (e.clientY / window.innerHeight - 0.5) * 6;
            heroImage.style.transform = `translate(${x * -0.35}px, ${y * -0.35}px)`;
        });
    }
});

// Optional: keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        scrollToSection('contato');
    }

    if (e.key === 'Escape') {
        const nav = document.getElementById('mainNav');
        if (nav.classList.contains('nav-open')) {
            toggleMenu();
        }
    }
});

// Lazy-load support
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

window.zarynApp = {
    scrollToSection,
    scrollToTop,
    toggleFAQ,
    openWhatsApp,
    showToast
};
