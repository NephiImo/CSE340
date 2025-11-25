document.addEventListener('DOMContentLoaded', function () {
    // Use a JS string to avoid HTML-attribute parsing problems.
    var pwd = document.getElementById('account_password');
    if (!pwd) return;

    // Regex: at least 12 chars, 1 uppercase, 1 digit, 1 special char
    // (note: double-escaped backslashes inside JS string are not required here)
    var regex = '^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-={}\\[\\]|;:\'\\".,<>/?]).{12,}$';

    pwd.setAttribute('pattern', regex);
    pwd.setAttribute('title', 'Password must be at least 12 characters long and include 1 uppercase letter, 1 number, and 1 special character.');
});
