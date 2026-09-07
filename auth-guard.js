import { auth } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


/*
========================================
WAIT FOR FIREBASE AUTH
========================================
*/

export function waitForUser() {

    return new Promise((resolve) => {

        const unsubscribe =
            onAuthStateChanged(
                auth,
                (user) => {

                    unsubscribe();

                    resolve(user || null);

                }
            );

    });

}


/*
========================================
REQUIRE LOGIN
========================================
*/

export async function requireLogin() {

    const user =
        await waitForUser();


    if (user) {

        return user;

    }


    const currentPage =
        window.location.pathname.split("/").pop() +
        window.location.search;


    window.location.href =
        "login.html?redirect=" +
        encodeURIComponent(currentPage);


    return null;

}