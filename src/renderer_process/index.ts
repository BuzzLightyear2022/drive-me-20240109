const loginForm: HTMLDivElement = document.querySelector("#login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const usernameInput: HTMLInputElement = document.querySelector("#username");
    const passwordInput: HTMLInputElement = document.querySelector("#password");

    const username = usernameInput.value;
    const password = passwordInput.value;

    const userData = await window.login.sendUserData({
        username: username,
        password: password
    });
}, false);