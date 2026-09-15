/* ==========================================
   ACTIVE NAVIGATION
   Automatically highlights current page
   ========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";

    const navLinks =
        document.querySelectorAll(".main-nav a");

    navLinks.forEach(function (link) {

        const linkPage =
            link.getAttribute("href")
                ?.split("/")
                .pop()
                .toLowerCase();

        link.classList.remove("active");

        if (
            linkPage === currentPage ||
            (
                currentPage === "" &&
                linkPage === "index.html"
            )
        ) {
            link.classList.add("active");
        }

    });

});
/* =====================================================
   GOOGLE TRANSLATE
   ===================================================== */

window.googleTranslateElementInit = function () {

    new google.translate.TranslateElement(
        {
            pageLanguage: "en",

            includedLanguages:
                "en,ta,hi,ml,te,kn,bn,mr,gu,pa,es,fr,de,ar",

            autoDisplay: false
        },

        "google_translate_element"
    );

};


/* =====================================================
   LANGUAGE MENU
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const languageBtn =
        document.getElementById("languageBtn");

    const languageMenu =
        document.getElementById("languageMenu");


    if (!languageBtn || !languageMenu) {
        return;
    }


    /* Open / close language menu */

    languageBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        languageMenu.classList.toggle("open");

    });


    /* Select language */

    const languageButtons =
        languageMenu.querySelectorAll(
            "button[data-lang]"
        );


    languageButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const language =
                this.getAttribute("data-lang");

            changeLanguage(language);

            languageMenu.classList.remove("open");

        });

    });


    /* Close when clicking outside */

    document.addEventListener("click", function (event) {

        if (
            !languageMenu.contains(event.target) &&
            !languageBtn.contains(event.target)
        ) {

            languageMenu.classList.remove("open");

        }

    });

});


/* =====================================================
   CHANGE LANGUAGE
   ===================================================== */

function changeLanguage(language) {

    const translateSelect =
        document.querySelector(
            ".goog-te-combo"
        );


    if (!translateSelect) {

        console.warn(
            "Google Translate is not ready yet."
        );

        return;

    }


    translateSelect.value = language;


    translateSelect.dispatchEvent(
        new Event("change")
    );

}
document.addEventListener("DOMContentLoaded", function () {

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mainNav = document.getElementById("mainNav");

    if (!mobileMenuBtn || !mainNav) {
        return;
    }

    mobileMenuBtn.addEventListener("click", function (event) {
        event.stopPropagation();

        mainNav.classList.toggle("mobile-open");

        const icon = mobileMenuBtn.querySelector("i");

        if (mainNav.classList.contains("mobile-open")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {

        if (
            !mainNav.contains(event.target) &&
            !mobileMenuBtn.contains(event.target)
        ) {
            mainNav.classList.remove("mobile-open");

            const icon = mobileMenuBtn.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        }
    });

    // Close menu after clicking a navigation link
    mainNav.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            mainNav.classList.remove("mobile-open");

            const icon = mobileMenuBtn.querySelector("i");

            if (icon) {
                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");
            }
        });

    });

});