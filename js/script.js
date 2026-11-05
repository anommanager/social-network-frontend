
$(document).ready(function () {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(input, errorElement, message) {
        $(input).addClass("is-invalid").removeClass("is-valid");
        $(errorElement).text(message);
    }

    function showSuccess(input) {
        $(input).removeClass("is-invalid").addClass("is-valid");
    }

    $("#password").on("input", function () {
        const password = $(this).val();
        let strength = 0;

        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        const bar = $("#passwordStrength");
        const text = $("#strengthText");

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
    });

    $("#registrationForm").on("submit", function (event) {
        event.preventDefault();

        let isValid = true;

        const name = $("#name").val().trim();
        const email = $("#email").val().trim();
        const password = $("#password").val();
        const confirmPassword = $("#confirmPassword").val();

        if (name === "") {
            showError("#name", "#nameError", "Name is required");
            isValid = false;
        } else {
            showSuccess("#name");
        }

        if (email === "") {
            showError("#email", "#emailError", "Email is required");
            isValid = false;
        } else if (!emailRegex.test(email)) {
            showError("#email", "#emailError", "Invalid email format");
            isValid = false;
        } else {
            showSuccess("#email");
        }

        if (password === "") {
            showError("#password", "#passwordError", "Password is required");
            isValid = false;
        } else if (password.length < 8) {
            showError("#password", "#passwordError",
                "Password must contain at least 8 characters");
            isValid = false;
        } else {
            showSuccess("#password");
        }

        if (confirmPassword === "") {
            showError("#confirmPassword", "#confirmPasswordError",
                "Please confirm your password");
            isValid = false;
        } else if (password !== confirmPassword) {
            showError("#confirmPassword", "#confirmPasswordError",
                "Passwords do not match");
            isValid = false;
        } else {
            showSuccess("#confirmPassword");
        }

        if (isValid) {
            $("#formMessage").html(
                '<div class="alert alert-success">' +
                'Registration successful!</div>'
            );
        } else {
            $("#formMessage").html(
                '<div class="alert alert-danger">' +
                'Please correct the errors above.</div>'
            );
        }
    });

});
