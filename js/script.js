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

});
