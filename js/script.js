$(document).ready(function () {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, errorElement, message) {
        $(input).addClass("is-invalid").removeClass("is-valid");
        $(errorElement).text(message);
        return false;
    }

    function showSuccess(input) {
        $(input).removeClass("is-invalid").addClass("is-valid");
        return true;
    }

    function validateName() {
        if ($("#name").val().trim() === "") {
            return showError("#name", "#nameError", "Name is required");
        }
        return showSuccess("#name");
    }

    function validateEmail() {
        const email = $("#email").val().trim();

        if (email === "") {
            return showError("#email", "#emailError", "Email is required");
        }
        if (!emailRegex.test(email)) {
            return showError("#email", "#emailError", "Invalid email format");
        }
        return showSuccess("#email");
    }

    function passwordRuleError(password) {
        if (password === "") {
            return "Password is required";
        }
        if (password.length < 8) {
            return "Password must contain at least 8 characters";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain an uppercase letter";
        }
        if (!/[0-9]/.test(password)) {
            return "Password must contain a digit";
        }
        return "";
    }

    function validatePassword() {
        const password = $("#password").val();

        if (password === "" && currentUser()) {
            $("#password").removeClass("is-invalid is-valid");
            return true;
        }

        const message = passwordRuleError(password);

        if (message) {
            return showError("#password", "#passwordError", message);
        }
        return showSuccess("#password");
    }

    function validateConfirmPassword() {
        const confirmPassword = $("#confirmPassword").val();

        if (confirmPassword === "" && $("#password").val() === "" && currentUser()) {
            $("#confirmPassword").removeClass("is-invalid is-valid");
            return true;
        }

        if (confirmPassword === "") {
            return showError("#confirmPassword", "#confirmPasswordError",
                "Please confirm your password");
        }
        if (confirmPassword !== $("#password").val()) {
            return showError("#confirmPassword", "#confirmPasswordError",
                "Passwords do not match");
        }
        return showSuccess("#confirmPassword");
    }

    function updatePasswordStrength() {
        const password = $("#password").val();
        const bar = $("#passwordStrength");
        const text = $("#strengthText");
        const strength = [
            password.length >= 8,
            /[A-Z]/.test(password),
            /[0-9]/.test(password),
            /[^A-Za-z0-9]/.test(password)
        ].filter(Boolean).length;

        if (password.length === 0) {
            bar.css("width", "0%");
            text.text("Password strength");
        } else if (strength <= 1) {
            bar.css("width", "33%")
               .removeClass("bg-warning bg-success")
               .addClass("bg-danger");
            text.text("Weak password");
        } else if (strength <= 3) {
            bar.css("width", "66%")
               .removeClass("bg-danger bg-success")
               .addClass("bg-warning");
            text.text("Medium password");
        } else {
            bar.css("width", "100%")
               .removeClass("bg-danger bg-warning")
               .addClass("bg-success");
            text.text("Strong password");
        }
    }

    $("#name").on("input", validateName);
    $("#email").on("input", validateEmail);

    $("#password").on("input", function () {
        updatePasswordStrength();
        validatePassword();
        if ($("#confirmPassword").val() !== "") {
            validateConfirmPassword();
        }
    });

    $("#confirmPassword").on("input", validateConfirmPassword);

    $("#registrationForm").on("submit", function (event) {
        event.preventDefault();

        const user = currentUser();

        if (!user) {
            $("#formMessage").html('<div class="alert alert-warning">Please <a href="login.html">sign in</a> to change your settings.</div>');
            return;
        }

        const isValid = [
            validateName(),
            validateEmail(),
            validatePassword(),
            validateConfirmPassword()
        ].every(Boolean);

        if (!isValid) {
            $("#formMessage").html('<div class="alert alert-danger">Please correct the errors above.</div>');
            return;
        }

        const name = $("#name").val().trim();
        const email = $("#email").val().trim().toLowerCase();
        const password = $("#password").val();
        const users = readUsers();

        if (users.some(function (u) { return u.email === email && u.email !== user.email; })) {
            $("#formMessage").html('<div class="alert alert-danger">This email is already used by another account.</div>');
            return;
        }

        const account = users.find(function (u) { return u.email === user.email; });

        if (account) {
            account.name = name;
            account.email = email;
            if (password !== "") {
                account.password = password;
            }
            writeStorage("users", JSON.stringify(users));
        }

        writeStorage("user", JSON.stringify({ name: name, email: email }));
        $(".profile-name").text(name);
        renderNavTools();
        $("#password, #confirmPassword").val("").removeClass("is-valid is-invalid");
        updatePasswordStrength();
        $("#formMessage").html('<div class="alert alert-success">Settings saved!</div>');
    });


    let activeCategory = "all";

    function filterTrends() {
        const query = $("#trendSearch").val().trim().toLowerCase();

        $(".trend-item").each(function () {
            const matchesCategory =
                activeCategory === "all" || $(this).data("category") === activeCategory;
            const matchesSearch = $(this).text().toLowerCase().includes(query);

            $(this).toggle(matchesCategory && matchesSearch);
        });
    }

    $("#trendSearch").on("input", filterTrends);

    $("#categoryFilters button").on("click", function () {
        activeCategory = $(this).data("category");
        $("#categoryFilters button").removeClass("active");
        $(this).addClass("active");
        filterTrends();
    });


    const trends = [
        { name: "#AI", posts: "1.2M", engagement: 94 },
        { name: "#Gaming", posts: "980K", engagement: 89 },
        { name: "#Memes", posts: "870K", engagement: 86 },
        { name: "#Tech", posts: "640K", engagement: 81 },
        { name: "#Music", posts: "590K", engagement: 78 },
        { name: "#Travel", posts: "510K", engagement: 74 }
    ];
    let editIndex = null;

    function renderTrends() {
        const rows = trends.map((trend, index) => `
            <tr>
                <th>${index + 1}</th>
                <td>${$("<div>").text(trend.name).html()}</td>
                <td>${$("<div>").text(trend.posts).html()}</td>
                <td>${trend.engagement}%</td>
                <td>
                    <button type="button" class="btn btn-sm btn-outline-primary edit-btn" data-index="${index}">Edit</button>
                    <button type="button" class="btn btn-sm btn-outline-danger delete-btn" data-index="${index}">Delete</button>
                </td>
            </tr>
        `);

        $("#trendsTableBody").html(rows.join(""));
    }

    function openTrendModal(title, trend) {
        $("#trendModalTitle").text(title);
        $("#trendName").val(trend.name);
        $("#trendPosts").val(trend.posts);
        $("#trendEngagement").val(trend.engagement);
        bootstrap.Modal.getOrCreateInstance("#trendModal").show();
    }

    $("#addTrendBtn").on("click", function () {
        editIndex = null;
        openTrendModal("Add trend", { name: "", posts: "", engagement: "" });
    });

    $("#trendsTableBody").on("click", ".edit-btn", function () {
        editIndex = Number($(this).data("index"));
        openTrendModal("Edit trend", trends[editIndex]);
    });

    $("#trendsTableBody").on("click", ".delete-btn", function () {
        const index = Number($(this).data("index"));

        if (confirm(`Delete ${trends[index].name}?`)) {
            trends.splice(index, 1);
            renderTrends();
        }
    });

    $("#trendForm").on("submit", function (event) {
        event.preventDefault();

        const trend = {
            name: $("#trendName").val().trim(),
            posts: $("#trendPosts").val().trim(),
            engagement: Number($("#trendEngagement").val())
        };

        if (editIndex === null) {
            trends.push(trend);
        } else {
            trends[editIndex] = trend;
        }

        renderTrends();
        bootstrap.Modal.getInstance("#trendModal").hide();
    });

    renderTrends();


    const galleryImages = $("#gallery img");
    let currentImage = 0;

    function showImage(index) {
        currentImage = (index + galleryImages.length) % galleryImages.length;
        $("#lightboxImg")
            .stop(true)
            .fadeOut(150, function () {
                $(this).attr("src", galleryImages.eq(currentImage).attr("src")).fadeIn(150);
            });
    }

    galleryImages.on("click", function () {
        currentImage = galleryImages.index(this);
        $("#lightboxImg").attr("src", $(this).attr("src"));
        $("#lightbox").css("display", "flex").hide().fadeIn(300);
    });

    $("#lightboxClose").on("click", function () {
        $("#lightbox").fadeOut(300);
    });

    $("#lightboxPrev").on("click", function () {
        showImage(currentImage - 1);
    });

    $("#lightboxNext").on("click", function () {
        showImage(currentImage + 1);
    });


    function readStorage(key) {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            return null;
        }
    }

    function writeStorage(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (e) {}
    }

    function removeStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {}
    }

    function currentTheme() {
        return document.documentElement.getAttribute("data-bs-theme") === "dark" ? "dark" : "light";
    }

    function themeLabel() {
        return currentTheme() === "dark" ? "☀ Light" : "☾ Dark";
    }

    function currentUser() {
        try {
            return JSON.parse(readStorage("user"));
        } catch (e) {
            return null;
        }
    }

    function renderNavTools() {
        const user = currentUser();
        const tools = $('<div class="nav-tools"></div>');

        tools.append('<button type="button" class="theme-toggle" id="themeToggle"></button>');

        if (user) {
            tools.append($('<span class="nav-user"></span>').text(user.name));
            tools.append('<button type="button" class="btn btn-sm signout-btn">Sign out</button>');
        } else {
            tools.append('<a class="btn btn-sm btn-primary mt-0" href="login.html">Sign in</a>');
        }

        $("#navbarMenu .nav-tools").remove();
        $("#navbarMenu").append(tools);
        $("#themeToggle").text(themeLabel());
    }

    $(document).on("click", "#themeToggle", function () {
        const next = currentTheme() === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-bs-theme", next);
        writeStorage("theme", next);
        $(this).text(themeLabel());
    });

    $(document).on("click", ".signout-btn", function () {
        removeStorage("user");
        window.location.reload();
    });

    renderNavTools();

    function renderAuthState() {
        const user = currentUser();

        if (user) {
            $("#authForms").hide();
            $("#signedInPanel").prop("hidden", false);
            $("#signedInName").text(user.name);
            $("#signedInEmail").text(user.email);
            $("#welcomeBanner").text(`Welcome back, ${user.name}!`).prop("hidden", false);
            $(".profile-name").text(user.name);
            $("#name").val(user.name);
            $("#email").val(user.email);
        } else {
            $(".comment-input")
                .prop("disabled", true)
                .attr("placeholder", "Sign in to comment");
        }
    }

    renderAuthState();

    $(".comment-input").on("keydown", function (event) {
        const user = currentUser();
        const text = $(this).val().trim();

        if (event.key !== "Enter" || !user || text === "") {
            return;
        }

        const comment = $('<div class="comment"><div class="comment-bubble"><span class="comment-author"></span><span class="comment-text"></span></div></div>');
        comment.find(".comment-author").text(user.name);
        comment.find(".comment-text").text(text);
        $(this).closest(".comment-section").children(".d-flex").before(comment);
        $(this).val("");
    });

    function readUsers() {
        try {
            return JSON.parse(readStorage("users")) || [];
        } catch (e) {
            return [];
        }
    }

    function startSession(user) {
        writeStorage("user", JSON.stringify({ name: user.name, email: user.email }));
        window.location.href = "index.html";
    }

    function checkEmail(input, error) {
        const email = $(input).val().trim();

        if (email === "") {
            return showError(input, error, "Email is required");
        }
        if (!emailRegex.test(email)) {
            return showError(input, error, "Invalid email format");
        }
        return showSuccess(input);
    }

    function checkPassword(input, error) {
        const message = passwordRuleError($(input).val());

        if (message) {
            return showError(input, error, message);
        }
        return showSuccess(input);
    }

    function checkLoginPassword() {
        if ($("#loginPassword").val() === "") {
            return showError("#loginPassword", "#loginPasswordError", "Password is required");
        }
        return showSuccess("#loginPassword");
    }

    function checkRegName() {
        if ($("#regName").val().trim().length < 2) {
            return showError("#regName", "#regNameError", "Name must contain at least 2 characters");
        }
        return showSuccess("#regName");
    }

    function checkRegConfirm() {
        if ($("#regConfirm").val() === "") {
            return showError("#regConfirm", "#regConfirmError", "Please confirm your password");
        }
        if ($("#regConfirm").val() !== $("#regPassword").val()) {
            return showError("#regConfirm", "#regConfirmError", "Passwords do not match");
        }
        return showSuccess("#regConfirm");
    }

    $("#showLogin, #showRegister").on("click", function () {
        const isLogin = this.id === "showLogin";

        $("#showLogin").toggleClass("active", isLogin);
        $("#showRegister").toggleClass("active", !isLogin);
        $("#loginForm").prop("hidden", !isLogin);
        $("#registerForm").prop("hidden", isLogin);
    });

    $("#loginEmail").on("input", function () { checkEmail("#loginEmail", "#loginEmailError"); });
    $("#loginPassword").on("input", checkLoginPassword);
    $("#regName").on("input", checkRegName);
    $("#regEmail").on("input", function () { checkEmail("#regEmail", "#regEmailError"); });
    $("#regPassword").on("input", function () {
        checkPassword("#regPassword", "#regPasswordError");
        if ($("#regConfirm").val() !== "") {
            checkRegConfirm();
        }
    });
    $("#regConfirm").on("input", checkRegConfirm);

    $("#registerForm").on("submit", function (event) {
        event.preventDefault();

        const isValid = [
            checkRegName(),
            checkEmail("#regEmail", "#regEmailError"),
            checkPassword("#regPassword", "#regPasswordError"),
            checkRegConfirm()
        ].every(Boolean);

        if (!isValid) {
            return;
        }

        const users = readUsers();
        const email = $("#regEmail").val().trim().toLowerCase();

        if (users.some(function (u) { return u.email === email; })) {
            $("#registerMessage").html('<div class="alert alert-danger">An account with this email already exists.</div>');
            return;
        }

        const user = { name: $("#regName").val().trim(), email: email, password: $("#regPassword").val() };
        users.push(user);
        writeStorage("users", JSON.stringify(users));
        startSession(user);
    });

    $("#loginForm").on("submit", function (event) {
        event.preventDefault();

        const isValid = [
            checkEmail("#loginEmail", "#loginEmailError"),
            checkLoginPassword()
        ].every(Boolean);

        if (!isValid) {
            return;
        }

        const email = $("#loginEmail").val().trim().toLowerCase();
        const password = $("#loginPassword").val();
        const user = readUsers().find(function (u) {
            return u.email === email && u.password === password;
        });

        if (!user) {
            $("#loginMessage").html('<div class="alert alert-danger">Invalid email or password.</div>');
            return;
        }

        startSession(user);
    });


    $("#faq .faq-question").on("click", function () {
        const answer = $(this).next(".faq-answer");
        const icon = $(this).find(".faq-icon");

        answer.stop(true, true).slideToggle(300, function () {
            icon.text(answer.is(":visible") ? "−" : "+");
        });
    });


    let apiArticles = [];

    function renderApiArticles() {
        const query = $("#apiSearch").val().trim().toLowerCase();
        const visible = apiArticles.filter(function (article) {
            return article.title.toLowerCase().includes(query);
        });

        if (visible.length === 0) {
            $("#apiResults").empty();
            $("#apiStatus").html('<div class="alert alert-info">No articles found.</div>');
            return;
        }

        $("#apiStatus").empty();
        $("#apiResults").html(visible.map(function (article) {
            const tags = (article.tag_list || []).map(function (tag) {
                return $('<span class="api-tag"></span>').text("#" + tag).prop("outerHTML");
            }).join("");
            const title = $("<a target='_blank' rel='noopener'></a>")
                .attr("href", article.url)
                .text(article.title)
                .prop("outerHTML");
            const author = $("<small class='text-secondary'></small>")
                .text(`by ${article.user.name} · ${article.public_reactions_count} reactions`)
                .prop("outerHTML");

            return `<div class="col-md-6 col-lg-4"><article class="api-card"><div>${tags}</div><h3>${title}</h3>${author}</article></div>`;
        }).join(""));
    }

    function loadApiArticles() {
        const tag = $("#apiTag").val();

        $("#apiResults").empty();
        $("#apiStatus").html('<div class="text-secondary">Loading...</div>');

        fetch(`https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=9`)
            .then(function (response) {
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`);
                }
                return response.json();
            })
            .then(function (data) {
                apiArticles = data;
                renderApiArticles();
            })
            .catch(function (error) {
                apiArticles = [];
                $("#apiStatus").html(
                    $('<div class="alert alert-danger"></div>').text(`Could not load articles. ${error.message}`)
                );
            });
    }

    if ($("#apiResults").length) {
        $("#apiTag").on("change", loadApiArticles);
        $("#apiRefresh").on("click", loadApiArticles);
        $("#apiSearch").on("input", renderApiArticles);
        loadApiArticles();
    }

});
