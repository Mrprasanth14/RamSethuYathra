/* =====================================================
   RAMSETHUYATRA - SHARED HEADER
   LOGIN / LOGOUT + MOBILE MENU + ACTIVE NAV
   ===================================================== */

document.addEventListener("DOMContentLoaded", async function () {

    /* =====================================================
       PREVENT HEADER.JS FROM RUNNING TWICE
       ===================================================== */

    if (window.__ramSethuHeaderLoaded) {
        return;
    }

    window.__ramSethuHeaderLoaded = true;


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const loginNav = document.getElementById("loginNav");
    const logoutNav = document.getElementById("logoutNav");
    const myBookingNav = document.getElementById("myBookingNav");

    const mobileMenuBtn =
        document.getElementById("mobileMenuBtn");

    const mainNav =
        document.getElementById("mainNav");


    /* =====================================================
       LOGIN / LOGOUT
       ===================================================== */

    if (loginNav || logoutNav || myBookingNav) {

        try {

            const { auth } =
                await import("./firebase.js");

            const {
                onAuthStateChanged,
                signOut
            } =
                await import(
                    "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js"
                );


            /* =================================================
               AUTH STATE
               ================================================= */

            onAuthStateChanged(auth, function (user) {

                if (user) {

                    /* ==============================
                       USER IS LOGGED IN
                       ============================== */

                    if (loginNav) {
                        loginNav.style.display = "none";
                    }

                    if (myBookingNav) {
                        myBookingNav.style.display = "flex";
                    }

                    if (logoutNav) {
                        logoutNav.style.display = "flex";
                    }

                } else {

                    /* ==============================
                       USER IS LOGGED OUT
                       ============================== */

                    if (loginNav) {
                        loginNav.style.display = "flex";
                    }

                    if (myBookingNav) {
                        myBookingNav.style.display = "none";
                    }

                    if (logoutNav) {
                        logoutNav.style.display = "none";
                    }

                }

            });


            /* =================================================
               LOGOUT
               ================================================= */

            if (logoutNav) {

                logoutNav.addEventListener(
                    "click",
                    async function (event) {

                        event.preventDefault();
                        event.stopPropagation();

                        try {

                            await signOut(auth);

                            window.location.replace(
                                "index.html"
                            );

                        } catch (error) {

                            console.error(
                                "Logout failed:",
                                error
                            );

                        }

                    }
                );

            }

        } catch (error) {

            console.error(
                "Header Firebase error:",
                error
            );

        }

    }


    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "index.html";


    const navLinks =
        document.querySelectorAll(".main-nav a");


    navLinks.forEach(function (link) {

        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }


        const linkPage =
            href
                .split("/")
                .pop()
                .split("?")[0]
                .split("#")[0]
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


    /* =====================================================
       MOBILE MENU
       ===================================================== */

    if (mobileMenuBtn && mainNav) {

        /* ==============================================
           OPEN / CLOSE MOBILE MENU
           ============================================== */

        mobileMenuBtn.addEventListener(
            "click",
            function (event) {

                event.preventDefault();
                event.stopPropagation();


                const isOpen =
                    mainNav.classList.toggle(
                        "mobile-open"
                    );


                mobileMenuBtn.setAttribute(
                    "aria-expanded",
                    isOpen ? "true" : "false"
                );


                const icon =
                    mobileMenuBtn.querySelector("i");


                if (icon) {

                    icon.classList.toggle(
                        "fa-bars",
                        !isOpen
                    );

                    icon.classList.toggle(
                        "fa-xmark",
                        isOpen
                    );

                }

            }
        );


        /* ==============================================
           CLOSE MENU AFTER CLICKING NAV ITEM
           ============================================== */

        mainNav
            .querySelectorAll("a")
            .forEach(function (item) {

                item.addEventListener(
                    "click",
                    function () {

                        mainNav.classList.remove(
                            "mobile-open"
                        );


                        mobileMenuBtn.setAttribute(
                            "aria-expanded",
                            "false"
                        );


                        const icon =
                            mobileMenuBtn.querySelector("i");


                        if (icon) {

                            icon.classList.remove(
                                "fa-xmark"
                            );

                            icon.classList.add(
                                "fa-bars"
                            );

                        }

                    }
                );

            });


        /* ==============================================
           CLOSE MENU WHEN CLICKING OUTSIDE
           ============================================== */

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !mainNav.contains(event.target) &&
                    !mobileMenuBtn.contains(event.target)
                ) {

                    mainNav.classList.remove(
                        "mobile-open"
                    );


                    mobileMenuBtn.setAttribute(
                        "aria-expanded",
                        "false"
                    );


                    const icon =
                        mobileMenuBtn.querySelector("i");


                    if (icon) {

                        icon.classList.remove(
                            "fa-xmark"
                        );

                        icon.classList.add(
                            "fa-bars"
                        );

                    }

                }

            }
        );

    }

});