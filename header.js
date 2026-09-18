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

    /*
     * Apply the language previously selected
     * on index.html.
     */

    const savedLanguage =
        localStorage.getItem("rsyLanguage");

    if (savedLanguage) {

        waitForGoogleTranslate(
            savedLanguage
        );
    }

    hideGoogleTranslateBar();
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

    /*
     * Save selected language.
     * This makes the language continue
     * when the user opens another page.
     */

    localStorage.setItem(
        "rsyLanguage",
        language
    );


    applyGoogleLanguage(language);
}


/* =====================================================
   APPLY GOOGLE LANGUAGE
   ===================================================== */

function applyGoogleLanguage(language) {

    const translateSelect =
        document.querySelector(
            ".goog-te-combo"
        );


    if (!translateSelect) {

        return false;
    }


    /*
     * English = original language
     */

    if (
        language === "en" ||
        language === ""
    ) {

        translateSelect.value = "";

    } else {

        translateSelect.value = language;

    }


    translateSelect.dispatchEvent(
        new Event("change")
    );


    hideGoogleTranslateBar();

    return true;
}


/* =====================================================
   WAIT FOR GOOGLE TRANSLATE
   ===================================================== */

function waitForGoogleTranslate(
    language,
    attempts = 0
) {

    /*
     * Stop after approximately 10 seconds.
     */

    if (attempts > 40) {
        return;
    }


    const translateSelect =
        document.querySelector(
            ".goog-te-combo"
        );


    if (translateSelect) {

        applyGoogleLanguage(
            language
        );

        return;
    }


    setTimeout(function () {

        waitForGoogleTranslate(
            language,
            attempts + 1
        );

    }, 250);

}


/* =====================================================
   HIDE GOOGLE TRANSLATE BAR
   ===================================================== */

function hideGoogleTranslateBar() {

    const elements =
        document.querySelectorAll(
            ".goog-te-banner-frame, " +
            "iframe.goog-te-banner-frame"
        );


    elements.forEach(function (element) {

        element.style.display =
            "none";

        element.style.visibility =
            "hidden";

        element.style.height =
            "0";

    });


    document.body.style.top =
        "0";

    document.body.style.marginTop =
        "0";
}