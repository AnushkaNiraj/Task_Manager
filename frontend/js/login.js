// Already logged in? Go straight to the tasks page.
if (getToken()) window.location.href = 'index.html';

const form = document.getElementById('authForm');
const heading = document.getElementById('authHeading');
const nameInput = document.getElementById('authName');
const emailInput = document.getElementById('authEmail');
const passwordInput = document.getElementById('authPassword');
const submitBtn = document.getElementById('authSubmit');
const switchLink = document.getElementById('authSwitch');
const switchText = document.getElementById('authSwitchText');
const errorBox = document.getElementById('authError');

let isRegister = false;

function setMode(register) {
    isRegister = register;
    heading.textContent = register ? 'Register' : 'Login';
    submitBtn.textContent = register ? 'Create Account' : 'Login';
    nameInput.style.display = register ? 'block' : 'none';
    passwordInput.autocomplete = register ? 'new-password' : 'current-password';
    switchText.textContent = register ? 'Already have an account?' : 'New here?';
    switchLink.textContent = register ? 'Login' : 'Create an account';
    errorBox.textContent = '';
}
setMode(false);

switchLink.addEventListener('click', function (e) {
    e.preventDefault();
    setMode(!isRegister);
});

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    errorBox.textContent = '';
    submitBtn.disabled = true;

    try {
        const body = { email: emailInput.value, password: passwordInput.value };
        if (isRegister) body.name = nameInput.value;

        const data = await apiRequest(isRegister ? '/auth/register' : '/auth/login', 'POST', body);
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.name);
        window.location.href = 'index.html';
    } catch (err) {
        errorBox.textContent = err.message;
    } finally {
        submitBtn.disabled = false;
    }
});
