/**
 * STUDIO FABI — JAVASCRIPT PRINCIPAL
 * Vanilla JavaScript puro sem dependências externas de compilação.
 * Projetado para execução garantida em qualquer ambiente (file://, local server ou produção).
 */

(function () {
  'use strict';

  let isInitialized = false;

  function initStudioFabi() {
    if (isInitialized) return;
    isInitialized = true;

    // ==================================================
    // 1. INICIALIZAÇÃO DE ÍCONES LUCIDE (COM REDUNDÂNCIA)
    // ==================================================
    function renderLucideIcons() {
      if (typeof lucide !== 'undefined' && typeof lucide.createIcons === 'function') {
        lucide.createIcons();
      }
    }
    renderLucideIcons();
    setTimeout(renderLucideIcons, 300);
    setTimeout(renderLucideIcons, 1000);

    // ==================================================
    // 2. BARRA DE PROGRESSO DE SCROLL SUPERIOR
    // ==================================================
    const progressBar = document.getElementById('scrollProgressBar');
    function updateProgressBar() {
      if (!progressBar) return;
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      progressBar.style.width = scrolled + '%';
    }
    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();

    // ==================================================
    // 3. HEADER SCROLL EFFECT
    // ==================================================
    const header = document.getElementById('header');
    function handleHeaderScroll() {
      if (!header) return;
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    // ==================================================
    // 4. MENU MOBILE DRAWER
    // ==================================================
    const menuToggle = document.getElementById('menuToggle');
    const menuClose = document.getElementById('menuClose');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileLinks = document.querySelectorAll('[data-mobile-link]');

    function openMobileMenu() {
      if (!mobileMenu || !mobileOverlay) return;
      mobileMenu.classList.add('open');
      mobileOverlay.classList.add('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
      if (!mobileMenu || !mobileOverlay) return;
      mobileMenu.classList.remove('open');
      mobileOverlay.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
    if (menuClose) menuClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // ==================================================
    // 5. ACTIVE NAV LINK BASEADO NO SCROLL
    // ==================================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    function updateActiveNav() {
      if (!sections.length || !navLinks.length) return;
      let currentSection = '';
      const scrollPosition = window.scrollY + 160;

      sections.forEach(function (section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          currentSection = section.getAttribute('id');
        }
      });

      navLinks.forEach(function (link) {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
          link.classList.add('active');
        }
      });
    }
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // ==================================================
    // 6. ANIMAÇÕES REVEAL NO SCROLL (COM FALLBACK)
    // ==================================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -20px 0px'
      });

      revealElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      revealElements.forEach(function (el) {
        el.classList.add('revealed');
      });
    }

    // ==================================================
    // 7. CONTADORES NUMÉRICOS ANIMADOS (COUNT-UP)
    // ==================================================
    const counterElements = document.querySelectorAll('[data-counter]');
    let countersStarted = false;

    function animateCounter(element) {
      const target = parseFloat(element.getAttribute('data-counter'));
      const decimals = parseInt(element.getAttribute('data-decimals') || '0', 10);
      const prefix = element.getAttribute('data-prefix') || '';
      const suffix = element.getAttribute('data-suffix') || '';
      const duration = 1600;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = progress === 1 ? target : (target * ease);

        const formatted = decimals > 0
          ? current.toFixed(decimals).replace('.', ',')
          : Math.floor(current).toString();

        element.textContent = prefix + formatted + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        }
      }

      requestAnimationFrame(updateNumber);
    }

    function checkCounters() {
      if (countersStarted) return;
      counterElements.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.95 && rect.bottom >= 0) {
          countersStarted = true;
          counterElements.forEach(animateCounter);
        }
      });
    }
    window.addEventListener('scroll', checkCounters, { passive: true });
    checkCounters();

    // ==================================================
    // 8. EFEITO 3D NA FOTO DO HERO (SEGUIR O CURSOR DO MOUSE)
    // ==================================================
    const heroContainer = document.getElementById('heroInteractiveContainer');
    const heroTiltImage = document.getElementById('heroTiltImage');
    const heroGlare = document.getElementById('heroGlare');
    const heroAuraGlow = document.getElementById('heroAuraGlow');
    const heroBadgeTop = document.getElementById('heroBadgeTop');
    const heroBadgeBottom = document.getElementById('heroBadgeBottom');

    if (heroContainer && heroTiltImage) {
      let isHovering = false;
      let targetRotX = 0;
      let targetRotY = 0;
      let currentRotX = 0;
      let currentRotY = 0;
      let targetTransXTop = 0;
      let targetTransYTop = 0;
      let targetTransXBottom = 0;
      let targetTransYBottom = 0;
      let currentTransXTop = 0;
      let currentTransYTop = 0;
      let currentTransXBottom = 0;
      let currentTransYBottom = 0;
      let glareX = 50;
      let glareY = 50;
      let glareOpacity = 0;
      let animFrameId = null;
      let lastSparkleTime = 0;

      // Criação dinâmica de partículas mágicas (sparkles) no rastro do mouse
      function spawnSparkle(x, y) {
        const now = performance.now();
        if (now - lastSparkleTime < 80) return;
        lastSparkleTime = now;

        const dot = document.createElement('span');
        dot.className = 'hero-sparkle-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';

        const size = Math.floor(Math.random() * 8) + 6;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';

        heroContainer.appendChild(dot);
        setTimeout(function () {
          if (dot && dot.parentNode) {
            dot.parentNode.removeChild(dot);
          }
        }, 750);
      }

      function renderTiltLoop() {
        if (!isHovering) return;

        // Interpolação suave para movimento orgânico
        currentRotX += (targetRotX - currentRotX) * 0.16;
        currentRotY += (targetRotY - currentRotY) * 0.16;

        currentTransXTop += (targetTransXTop - currentTransXTop) * 0.14;
        currentTransYTop += (targetTransYTop - currentTransYTop) * 0.14;

        currentTransXBottom += (targetTransXBottom - currentTransXBottom) * 0.14;
        currentTransYBottom += (targetTransYBottom - currentTransYBottom) * 0.14;

        // Inclinação 3D da foto
        heroTiltImage.style.transform =
          'rotateX(' + currentRotX.toFixed(2) + 'deg) rotateY(' + currentRotY.toFixed(2) + 'deg) scale3d(1.04, 1.04, 1.04)';

        // Parallax dos badges flutuantes
        if (heroBadgeTop) {
          heroBadgeTop.style.transform =
            'translateX(' + currentTransXTop.toFixed(1) + 'px) translateY(' + currentTransYTop.toFixed(1) + 'px) translateZ(45px)';
        }
        if (heroBadgeBottom) {
          heroBadgeBottom.style.transform =
            'translateX(' + currentTransXBottom.toFixed(1) + 'px) translateY(' + currentTransYBottom.toFixed(1) + 'px) translateZ(60px)';
        }

        // Aura colorida de fundo reagindo ao cursor
        if (heroAuraGlow) {
          const auraOffsetX = (currentRotY * 1.5).toFixed(1);
          const auraOffsetY = (-currentRotX * 1.5).toFixed(1);
          heroAuraGlow.style.transform = 'translate(' + auraOffsetX + 'px, ' + auraOffsetY + 'px) scale(1.08)';
          heroAuraGlow.style.opacity = '0.9';
        }

        // Holofote de luz (glare) acompanhando as coordenadas
        if (heroGlare) {
          heroGlare.style.opacity = glareOpacity;
          heroGlare.style.background =
            'radial-gradient(circle 280px at ' + glareX + '% ' + glareY + '%, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.15) 35%, rgba(255, 255, 255, 0) 70%)';
        }

        animFrameId = requestAnimationFrame(renderTiltLoop);
      }

      heroContainer.addEventListener('mouseenter', function () {
        isHovering = true;
        heroTiltImage.classList.add('is-hovered');
        if (heroBadgeTop) heroBadgeTop.classList.add('is-hovered');
        if (heroBadgeBottom) heroBadgeBottom.classList.add('is-hovered');
        glareOpacity = '1';

        if (animFrameId) cancelAnimationFrame(animFrameId);
        animFrameId = requestAnimationFrame(renderTiltLoop);
      });

      heroContainer.addEventListener('mousemove', function (e) {
        const rect = heroContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const normX = (mouseX / rect.width) - 0.5;
        const normY = (mouseY / rect.height) - 0.5;

        // Rotação em 18 graus para efeito nítido
        targetRotY = normX * 18;
        targetRotX = -normY * 18;

        targetTransXTop = normX * 26;
        targetTransYTop = normY * 26;

        targetTransXBottom = -normX * 22;
        targetTransYBottom = -normY * 22;

        glareX = Math.round((mouseX / rect.width) * 100);
        glareY = Math.round((mouseY / rect.height) * 100);

        spawnSparkle(mouseX, mouseY);
      });

      heroContainer.addEventListener('mouseleave', function () {
        isHovering = false;
        if (animFrameId) cancelAnimationFrame(animFrameId);

        heroTiltImage.classList.remove('is-hovered');
        if (heroBadgeTop) heroBadgeTop.classList.remove('is-hovered');
        if (heroBadgeBottom) heroBadgeBottom.classList.remove('is-hovered');

        targetRotX = 0;
        targetRotY = 0;
        currentRotX = 0;
        currentRotY = 0;

        heroTiltImage.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        if (heroBadgeTop) {
          heroBadgeTop.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
        }
        if (heroBadgeBottom) {
          heroBadgeBottom.style.transform = 'translateX(0px) translateY(0px) translateZ(0px)';
        }
        if (heroAuraGlow) {
          heroAuraGlow.style.transform = 'translate(0px, 0px) scale(1)';
          heroAuraGlow.style.opacity = '0.7';
        }
        if (heroGlare) {
          heroGlare.style.opacity = '0';
        }
      });
    }

    // ==================================================
    // 9. MÁSCARA DINÂMICA DE TELEFONE BRASILEIRO
    // ==================================================
    const phoneInput = document.getElementById('telefone');
    if (phoneInput) {
      phoneInput.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        if (value.length <= 2) {
          e.target.value = value.length ? '(' + value : '';
        } else if (value.length <= 6) {
          e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
        } else if (value.length <= 10) {
          e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 6) + '-' + value.slice(6);
        } else {
          e.target.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7, 11);
        }
      });
    }

    // Data mínima no formulário de agendamento para hoje
    const dataInput = document.getElementById('data');
    if (dataInput) {
      const today = new Date().toISOString().split('T')[0];
      dataInput.setAttribute('min', today);
    }

    // ==================================================
    // 10. VALIDAÇÃO & REDIRECIONAMENTO WHATSAPP
    // ==================================================
    const contactForm = document.getElementById('contactForm');
    const toastBox = document.getElementById('toastBox');

    if (contactForm) {
      contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const telefone = document.getElementById('telefone').value.trim();
        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const horario = document.getElementById('horario').value;
        const mensagem = document.getElementById('mensagem').value.trim();

        let isValid = true;

        // Validação de Nome
        const errNome = document.getElementById('error-nome');
        if (!nome) {
          if (errNome) errNome.classList.remove('hidden');
          document.getElementById('nome').focus();
          isValid = false;
        } else if (errNome) {
          errNome.classList.add('hidden');
        }

        // Validação de Telefone
        const errTelefone = document.getElementById('error-telefone');
        const phoneDigits = telefone.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          if (errTelefone) errTelefone.classList.remove('hidden');
          if (isValid) document.getElementById('telefone').focus();
          isValid = false;
        } else if (errTelefone) {
          errTelefone.classList.add('hidden');
        }

        // Validação de Serviço
        const errServico = document.getElementById('error-servico');
        if (!servico) {
          if (errServico) errServico.classList.remove('hidden');
          if (isValid) document.getElementById('servico').focus();
          isValid = false;
        } else if (errServico) {
          errServico.classList.add('hidden');
        }

        if (!isValid) return;

        // Formatação de data brasileira (DD/MM/AAAA)
        let dataFormatada = '';
        if (data) {
          const parts = data.split('-');
          dataFormatada = parts[2] + '/' + parts[1] + '/' + parts[0];
        }

        // Montagem exata da mensagem estruturada
        let msg = 'Olá, Studio Fabi! Gostaria de agendar um horário.\n\n';
        msg += 'Nome: ' + nome + '\n';
        msg += 'Telefone: ' + telefone + '\n';
        msg += 'Serviço: ' + servico + '\n';
        if (dataFormatada) msg += 'Data desejada: ' + dataFormatada + '\n';
        if (horario) msg += 'Horário desejado: ' + horario + '\n';
        if (mensagem) {
          msg += '\nMensagem:\n' + mensagem + '\n';
        }
        msg += '\nAguardo retorno. Obrigada!';

        const encodedMsg = encodeURIComponent(msg);
        const whatsappUrl = 'https://wa.me/5511969239889?text=' + encodedMsg;

        // Exibe Toast de feedback
        if (toastBox) {
          toastBox.classList.add('show');
          setTimeout(function () {
            toastBox.classList.remove('show');
          }, 3500);
        }

        // Abre o WhatsApp oficial
        setTimeout(function () {
          window.open(whatsappUrl, '_blank');
        }, 600);
      });
    }

    // ==================================================
    // 11. SCROLL SUAVE PARA LINKS ÂNCORA
    // ==================================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#' || targetId === '') return;
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const headerHeight = header ? header.offsetHeight : 0;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // ==================================================
    // 12. CONTROLE DO CARROSSEL DE DEPOIMENTOS NO MOBILE
    // ==================================================
    const carouselTrack = document.getElementById('testimonialCarouselTrack');
    const dotsContainer = document.getElementById('testimonialDots');
    if (carouselTrack && dotsContainer) {
      const dots = dotsContainer.querySelectorAll('button');
      const slides = carouselTrack.querySelectorAll('[data-slide-index]');

      carouselTrack.addEventListener('scroll', function () {
        const scrollLeft = carouselTrack.scrollLeft;
        const slideWidth = slides[0].offsetWidth;
        const activeIndex = Math.round(scrollLeft / slideWidth);

        dots.forEach(function (dot, index) {
          if (index === activeIndex) {
            dot.classList.remove('bg-studio-lilac', 'w-2.5', 'h-2.5');
            dot.classList.add('bg-studio-purple', 'w-3', 'h-3');
          } else {
            dot.classList.remove('bg-studio-purple', 'w-3', 'h-3');
            dot.classList.add('bg-studio-lilac', 'w-2.5', 'h-2.5');
          }
        });
      }, { passive: true });

      dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
          if (slides[index]) {
            slides[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        });
      });
    }

    // ==================================================
    // 13. POPUP DE NOTIFICAÇÃO DO WHATSAPP (CONVITE ATIVO)
    // ==================================================
    const whatsappPopup = document.getElementById('whatsappPopupBadge');
    const closePopupBtn = document.getElementById('closeWhatsappPopup');
    if (whatsappPopup) {
      setTimeout(function () {
        whatsappPopup.style.display = 'block';
      }, 2500);

      if (closePopupBtn) {
        closePopupBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          whatsappPopup.style.display = 'none';
        });
      }

      whatsappPopup.addEventListener('click', function () {
        window.open('https://wa.me/5511969239889?text=Ol%C3%A1%2C%20Studio%20Fabi!%20Gostaria%20de%20agendar%20um%20hor%C3%A1rio.', '_blank');
      });
    }
  }

  // Inicialização garantida em qualquer estado do DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initStudioFabi);
  } else {
    initStudioFabi();
  }
  window.addEventListener('load', initStudioFabi);
})();
