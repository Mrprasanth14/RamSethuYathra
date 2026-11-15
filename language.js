
/* =====================================================
   RAMSETHUYATRA - GLOBAL LANGUAGE SYSTEM
   Language selector: Home page only
   Translation: All website pages
   ===================================================== */

(function () {
    "use strict";

    const DEFAULT_LANGUAGE = "en";
    const STORAGE_KEY = "ramsethu_language";

    // Supported languages
    const SUPPORTED_LANGUAGES = [
        "en", "ta", "hi", "ml", "te", "kn",
        "bn", "mr", "gu", "pa", "es", "fr",
        "de", "ar"
    ];

    // Check whether this is the Home page
    function isHomePage() {
        const page = window.location.pathname
            .split("/")
            .pop()
            .toLowerCase();

        return page === "" || page === "index.html";
    }

    // Read saved language
    function getSavedLanguage() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);

            if (SUPPORTED_LANGUAGES.includes(saved)) {
                return saved;
            }
        } catch (error) {
            console.warn("Language storage unavailable.");
        }

        return DEFAULT_LANGUAGE;
    }

    // Save Google Translate language cookie
    function setLanguageCookie(language) {
        const cookieName = "googtrans";

        if (language === DEFAULT_LANGUAGE) {
            document.cookie =
                cookieName + "=; path=/; max-age=0; SameSite=Lax";
        } else {
            document.cookie =
                cookieName +
                "=/en/" + language +
                "; path=/; max-age=31536000; SameSite=Lax";
        }

        try {
            localStorage.setItem(STORAGE_KEY, language);
        } catch (error) {
            console.warn("Unable to save language.");
        }
    }

    // Create hidden Google Translate container
    function createTranslateContainer() {
        let container = document.getElementById(
            "google_translate_element"
        );

        if (!container) {
            container = document.createElement("div");
            container.id = "google_translate_element";
            container.style.display = "none";
            document.body.appendChild(container);
        }

        return container;
    }

    // Google Translate initialization callback
    window.googleTranslateElementInit = function () {
        if (!window.google || !google.translate) {
            return;
        }

        new google.translate.TranslateElement(
            {
                pageLanguage: "en",
                includedLanguages: SUPPORTED_LANGUAGES.join(","),
                autoDisplay: false
            },
            "google_translate_element"
        );
    };

    // Load Google Translate once
    function loadGoogleTranslate() {
        if (document.getElementById("google-translate-script")) {
            return;
        }

        const script = document.createElement("script");

        script.id = "google-translate-script";
        script.src =
            "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";

        script.async = true;

        document.head.appendChild(script);
    }

    // Language selector
    function initializeLanguageMenu() {
        const languageBox = document.querySelector(".translate-box");

        // Hide selector on every page except Home
        if (!isHomePage()) {
            if (languageBox) {
                languageBox.style.display = "none";
            }

            return;
        }

        if (!languageBox) return;

        const button = document.getElementById("languageBtn");
        const menu = document.getElementById("languageMenu");

        if (!button || !menu) return;

        button.addEventListener("click", function (event) {
            event.stopPropagation();
            menu.classList.toggle("open");
        });

        menu.querySelectorAll("[data-lang]").forEach(function (item) {
            item.addEventListener("click", function (event) {
                event.stopPropagation();

                const language = this.dataset.lang;

                if (!SUPPORTED_LANGUAGES.includes(language)) {
                    return;
                }

                setLanguageCookie(language);

                menu.classList.remove("open");

                // Reload so Google Translate applies the language
                // consistently to the entire page.
                window.location.reload();
            });
        });

        document.addEventListener("click", function (event) {
            if (!languageBox.contains(event.target)) {
                menu.classList.remove("open");
            }
        });
    }

    // Start the global language system
    document.addEventListener("DOMContentLoaded", function () {
        createTranslateContainer();

        initializeLanguageMenu();

        loadGoogleTranslate();
    });

})();
