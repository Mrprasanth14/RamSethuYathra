function openPackage(packageType) {

    if (packageType === "normal") {
        window.location.href = "normal-package.html";
    }

    else if (packageType === "medium") {
        window.location.href = "medium-package.html";
    }

    else if (packageType === "premium") {
        window.location.href = "premium-package.html";
    }

}
window.openPackage = openPackage;