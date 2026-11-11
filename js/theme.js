(function () {
    var theme = "light";
    try {
        theme = localStorage.getItem("theme") || "light";
    } catch (e) {}
    document.documentElement.setAttribute("data-bs-theme", theme);
})();
