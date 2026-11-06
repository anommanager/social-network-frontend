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

    function validatePassword() {
        const password = $("#password").val();

        if (password === "") {
            return showError("#password", "#passwordError", "Password is required");
        }
        if (password.length < 8) {
            return showError("#password", "#passwordError",
                "Password must contain at least 8 characters");
        }
        return showSuccess("#password");
    }

    function validateConfirmPassword() {
        const confirmPassword = $("#confirmPassword").val();

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

        const isValid = [
            validateName(),
            validateEmail(),
            validatePassword(),
            validateConfirmPassword()
        ].every(Boolean);

        const type = isValid ? "success" : "danger";
        const message = isValid
            ? "Settings saved!"
            : "Please correct the errors above.";

        $("#formMessage").html(
            `<div class="alert alert-${type}">${message}</div>`
        );
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

});
