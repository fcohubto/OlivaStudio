document.addEventListener("DOMContentLoaded", () => {
    /* =========================
       MENU MOBILE
       ========================= */

    const menuButton = document.querySelector(".site-header__menu-button");
    const navigation = document.querySelector("#site-navigation");
    const navigationLinks = document.querySelectorAll(".site-navigation__link");

    if (menuButton && navigation) {
        const closeMenu = () => {
            menuButton.setAttribute("aria-expanded", "false");
            navigation.classList.remove("is-open");
        };

        const toggleMenu = () => {
            const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
            const shouldOpen = !isExpanded;

            menuButton.setAttribute("aria-expanded", String(shouldOpen));
            navigation.classList.toggle("is-open", shouldOpen);

            if (shouldOpen && navigationLinks.length > 0) {
                navigationLinks[0].focus();
            }
        };

        menuButton.addEventListener("click", toggleMenu);

        navigationLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                closeMenu();
                menuButton.focus();
            }
        });
    }

    /* =========================
       DARK MODE
       ========================= */

    const themeButton = document.querySelector(".site-header__theme-button");
    const root = document.documentElement;

    if (themeButton) {
        const applyTheme = (theme) => {
            const isDark = theme === "dark";

            root.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);

            themeButton.setAttribute(
                "aria-label",
                isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"
            );
        };

        const savedTheme = localStorage.getItem("theme") || "light";
        applyTheme(savedTheme);

        themeButton.addEventListener("click", () => {
            const currentTheme = root.getAttribute("data-theme") || "light";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";

            applyTheme(nextTheme);
        });
    }
    /* =========================
       SERVICE SWITCH
       ========================= */
    const updateResultCards = (cards) => {
        const resultCards = document.querySelectorAll(".resultado-card");

        resultCards.forEach((cardElement, index) => {
            const card = cards[index];

            if (!card) return;

            const image = cardElement.querySelector(".resultado-card__image img");
            const labels = cardElement.querySelectorAll(".resultado-card__label");
            const title = cardElement.querySelector(".resultado-card__title");
            const texts = cardElement.querySelectorAll(".resultado-card__text");

            if (image) {
                image.src = card.image;
                image.alt = card.alt;
            }

            if (labels[0]) labels[0].textContent = card.labelOne;
            if (labels[1]) labels[1].textContent = card.labelTwo;
            if (labels[2]) labels[2].textContent = card.labelThree;

            if (title) title.textContent = card.title;

            if (texts[0]) texts[0].textContent = card.textOne;
            if (texts[1]) texts[1].textContent = card.textTwo;
        });
    };
    const serviceButtons = document.querySelectorAll(".service-switch__button");
    const serviceLabel = document.querySelector("[data-service-label]");

    const serviceContent = {
        audit: {
            label: "Auditoría UX/UI",
            hero: {
                title: "Tu sitio podría estar perdiendo clientes",
                description: "Detecto fricción, errores y oportunidades invisibles que afectan conversión, confianza y resultados.",
                primaryCta: "Solicitar diagnóstico",
                secondaryCta: "Problemas frecuentes"
            },
            problem: {
                title: "Problemas frecuentes que frenan resultados",
                description: "Estas señales suelen generar dudas, fricción o abandono antes del contacto.",
                cards: [{
                        title: "Tu propuesta no se entiende rápido.",
                        description: "Si la claridad falla en segundos, aumentan las dudas y baja la intención de contacto."
                    },
                    {
                        title: "Tu sitio genera dudas.",
                        description: "Cuando falta confianza visual o contenido claro, la persona compara y se va."
                    },
                    {
                        title: "Inviertes, pero no conviertes.",
                        description: "Puedes estar atrayendo visitas, pero perdiendo oportunidades por fricción invisible."
                    },
                    {
                        title: "Tu competencia parece más confiable.",
                        description: "Una mejor estructura, evidencia y jerarquía puede cambiar la percepción de valor."
                    }
                ]
            },
            offer: {
                title: "Diagnóstico de tu sitio web",
                description: "Recibes una revisión clara, priorizada y explicada para saber qué corregir primero.",
                cards: [{
                        title: "Revisión estructural.",
                        description: "Analizo contenido, jerarquía y recorrido para entender si la página guía bien la decisión."
                    },
                    {
                        title: "Detección de fricción.",
                        description: "Identifico puntos que generan dudas, abandono o pérdida de confianza antes del contacto."
                    },
                    {
                        title: "Ejemplos de mejora.",
                        description: "Te muestro oportunidades concretas para mejorar claridad, interacción y conversión."
                    },
                    {
                        title: "Plan priorizado.",
                        description: "Ordeno los hallazgos según impacto para que sepas qué corregir primero."
                    }
                ],
                delivery: "1 a 3 días hábiles",
                price: "Desde $99.000",
                ideal: "Negocios que necesitan entender qué está frenando resultados antes de rediseñar o invertir más.",
                cta: "Solicitar diagnóstico"
            },
            results: {
                title: "Casos reales de mejora detectada",
                description: "Ejemplos de fricciones reales y mejoras posibles para aumentar claridad, confianza y contacto.",
                cta: "Solicitar revisión"
            },
            contact: {
                title: "Hablemos de tu página",
                description: "Déjame el enlace de tu sitio y reviso si hay señales que estén afectando claridad, confianza o contacto.",
                cta: "Enviar solicitud"
            }
        },
        design: {
            label: "Diseño UX/UI",
            hero: {
                title: "Diseño sitios web claros, modernos y confiables",
                description: "Construyo experiencias digitales con estructura, diseño y contenido orientado a comunicar mejor, guiar decisiones y facilitar el contacto.",
                primaryCta: "Solicitar diseño web",
                secondaryCta: "Mostrar qué incluye"
            },
            problem: {
                title: "Problemas que hacen que tu sitio se vea poco profesional",
                description: "Un sitio mal estructurado puede afectar confianza, claridad y percepción de valor antes del primer contacto.",
                cards: [{
                        title: "Tu sitio no representa el valor de tu negocio.",
                        description: "La imagen digital queda por debajo de lo que realmente ofreces."
                    },
                    {
                        title: "La información está desordenada.",
                        description: "Las personas no entienden rápido qué haces, para quién trabajas o cómo contactarte."
                    },
                    {
                        title: "El diseño no guía la acción.",
                        description: "El sitio informa, pero no conduce hacia una decisión clara."
                    },
                    {
                        title: "La experiencia mobile no funciona bien.",
                        description: "Gran parte de la confianza se pierde cuando navegar desde celular se vuelve incómodo."
                    }
                ]
            },
            offer: {
                title: "Diseño UX/UI para sitios web",
                description: "Diseño una experiencia web clara, responsive y alineada a tus objetivos para comunicar mejor y facilitar la conversión.",
                cards: [{
                        title: "Estructura estratégica.",
                        description: "Ordeno secciones, jerarquía y recorrido para que el sitio comunique con claridad."
                    },
                    {
                        title: "Diseño visual responsive.",
                        description: "Creo una interfaz moderna, coherente y adaptable a mobile, tablet y desktop."
                    },
                    {
                        title: "Contenido orientado a decisión.",
                        description: "Ajusto textos, llamados a la acción y mensajes clave para guiar al usuario."
                    },
                    {
                        title: "Entrega lista para desarrollo.",
                        description: "Preparo una propuesta clara para avanzar a implementación sin ambigüedad."
                    }
                ],
                delivery: "A definir",
                price: "Desde $399.000",
                ideal: "Negocios que necesitan construir o renovar su presencia digital con una experiencia clara, profesional y orientada a resultados.",
                cta: "Solicitar diseño web"
            },
            results: {
                title: "Casos reales de diseño aplicado",
                description: "Ejemplos de sitios y experiencias diseñadas para comunicar mejor, ordenar contenido y facilitar contacto.",
                cta: "Solicitar diseño web",
                cards: [{
                        image: "/assets/design-koyam.webp",
                        alt: "Sitio web diseñado para Grupo Koyam",
                        labelOne: "Cliente",
                        title: "Grupo Koyam",
                        labelTwo: "Trabajo",
                        textOne: "Diseño web responsive para comunicar servicios y generar confianza comercial.",
                        labelThree: "Foco",
                        textTwo: "Ordenar propuesta, mejorar jerarquía y facilitar contacto desde mobile."
                    },
                    {
                        image: "/assets/design-rafcon.webp",
                        alt: "Propuesta de sitio web para Rafcon",
                        labelOne: "Cliente",
                        title: "Rafcon",
                        labelTwo: "Trabajo",
                        textOne: "Arquitectura y diseño de experiencia para servicios industriales.",
                        labelThree: "Foco",
                        textTwo: "Comunicar solvencia técnica, evidencia y capacidad operativa."
                    },
                    {
                        image: "/assets/design-portfolio.webp",
                        alt: "Sitio profesional diseñado para servicios freelance",
                        labelOne: "Proyecto",
                        title: "Sitio freelance profesional",
                        labelTwo: "Trabajo",
                        textOne: "Diseño de landing comercial para presentar servicios UX/UI.",
                        labelThree: "Foco",
                        textTwo: "Claridad, posicionamiento y conversión hacia contacto."
                    },
                    {
                        image: "/assets/design-landing.webp",
                        alt: "Landing page diseñada para servicio digital",
                        labelOne: "Proyecto",
                        title: "Landing de servicio digital",
                        labelTwo: "Trabajo",
                        textOne: "Diseño de estructura, contenido y experiencia responsive.",
                        labelThree: "Foco",
                        textTwo: "Guiar lectura, reducir dudas y aumentar intención de contacto."
                    }
                ]
            },
            contact: {
                title: "Hablemos de tu nuevo sitio",
                description: "Cuéntame qué necesitas construir o mejorar y revisamos el mejor enfoque para diseñarlo con claridad.",
                cta: "Enviar solicitud"
            }
        }
    };

    const updateText = (selector, text) => {
        const element = document.querySelector(selector);

        if (element) {
            element.textContent = text;
        }
    };

    const updateCards = (selector, cards) => {
        const items = document.querySelectorAll(selector);

        items.forEach((item, index) => {
            const card = cards[index];

            if (!card) return;

            const title = item.querySelector("h3");
            const description = item.querySelector("p");

            if (title) {
                title.textContent = card.title;
            }

            if (description) {
                description.textContent = card.description;
            }
        });
    };

    const applyService = (service) => {
        const content = serviceContent[service];

        if (!content) return;

        if (serviceLabel) {
            serviceLabel.textContent = content.label;
        }

        serviceButtons.forEach((button) => {
            const isActive = button.dataset.service === service;

            button.classList.toggle("is-active", isActive);
            button.setAttribute("aria-selected", String(isActive));
        });

        updateText("#hero-title", content.hero.title);
        updateText(".hero__description", content.hero.description);
        updateText(".hero__primary-link", content.hero.primaryCta);
        updateText(".hero__secondary-link", content.hero.secondaryCta);

        updateText("#problema-title", content.problem.title);
        updateText("#problema .section__description", content.problem.description);
        updateCards(".problema__item", content.problem.cards);

        updateText("#oferta-title", content.offer.title);
        updateText("#oferta-principal .section__description", content.offer.description);
        updateCards(".oferta__item", content.offer.cards);
        updateText(".oferta__meta-item:nth-child(1) .oferta__meta-value", content.offer.delivery);
        updateText(".oferta__meta-item--featured .oferta__meta-value", content.offer.price);
        updateText(".oferta__meta-item:nth-child(3) .oferta__meta-value", content.offer.ideal);
        updateText(".oferta__cta", content.offer.cta);

        updateText("#resultados-title", content.results.title);
        updateText("#resultados .section__description", content.results.description);
        updateText(".resultados__cta", content.results.cta);
        updateResultCards(content.results.cards);


        updateText("#contacto-title", content.contact.title);
        updateText("#contacto .section__description", content.contact.description);
        updateText(".contacto__cta", content.contact.cta);

        localStorage.setItem("selectedService", service);
    };

    if (serviceButtons.length > 0) {
        const savedService = localStorage.getItem("selectedService") || "audit";

        applyService(savedService);

        serviceButtons.forEach((button) => {
            button.addEventListener("click", () => {
                applyService(button.dataset.service);
            });
        });
    }
    /* =========================
       HEADER SCROLL
       ========================= */

    const header = document.querySelector(".site-header");

    if (header) {
        const updateHeaderOnScroll = () => {
            const isScrolled = window.scrollY > 8;

            header.classList.toggle("is-scrolled", isScrolled);
        };

        updateHeaderOnScroll();

        window.addEventListener("scroll", updateHeaderOnScroll);
    }

    /* =========================
       FORM VALIDATION
       ========================= */

    const contactForm = document.querySelector(".contacto__form");

    if (contactForm) {
        const fields = {
            nombre: contactForm.querySelector("#nombre"),
            email: contactForm.querySelector("#email"),
            enlace: contactForm.querySelector("#enlace"),
            mensaje: contactForm.querySelector("#mensaje"),
            terminos: contactForm.querySelector('input[name="terminos"]')
        };

        const suspiciousPatterns = [
            ".ru",
            "casino",
            "xxx",
            "hack",
            "free-money",
            "malware",
            "phishing"
        ];

        const setFieldState = (field, isValid) => {
            if (!field) return;

            field.classList.toggle("is-valid", isValid);
            field.classList.toggle("is-error", !isValid);
        };

        const clearFieldState = (field) => {
            if (!field) return;

            field.classList.remove("is-valid");
            field.classList.remove("is-error");
        };

        const isSafeUrl = (value) => {
            const url = value.trim().toLowerCase();

            return !suspiciousPatterns.some((pattern) => url.includes(pattern));
        };

        const validateUrl = (field) => {
            if (!field) return false;

            try {
                const url = new URL(field.value.trim());

                const isValidProtocol = url.protocol === "http:" || url.protocol === "https:";
                const hasDomain = url.hostname.includes(".");
                const isSafe = isSafeUrl(field.value);

                return isValidProtocol && hasDomain && isSafe;
            } catch {
                return false;
            }
        };

        const validateField = (field) => {
            if (!field) return false;

            if (field.id === "enlace") {
                const isValid = validateUrl(field);
                setFieldState(field, isValid);
                return isValid;
            }

            const isValid = field.checkValidity();
            setFieldState(field, isValid);

            return isValid;
        };

        Object.values(fields).forEach((field) => {
            if (!field || field.type === "checkbox") return;

            field.addEventListener("blur", () => {
                validateField(field);
            });

            field.addEventListener("input", () => {
                clearFieldState(field);
            });
        });

        contactForm.addEventListener("submit", (event) => {
            const validFields = [
                validateField(fields.nombre),
                validateField(fields.email),
                validateField(fields.enlace),
                validateField(fields.mensaje)
            ];

            const isTermsAccepted = fields.terminos && fields.terminos.checked === true;

            if (!isTermsAccepted) {
                event.preventDefault();

                if (fields.terminos) {
                    fields.terminos.focus();
                }

                return;
            }

            const turnstileResponse = contactForm.querySelector('[name="cf-turnstile-response"]');

            const isTurnstileValid = turnstileResponse && turnstileResponse.value.length > 0;

            if (!isTurnstileValid) {
                event.preventDefault();
                alert("Por favor verifica que eres humano.");
                return;
            }

            if (validFields.includes(false)) {
                event.preventDefault();
            }
        });
    }
});