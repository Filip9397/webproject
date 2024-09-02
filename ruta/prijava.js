document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
  
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
  
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
  
        const response = await fetch('/prijava', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
  
        const result = await response.text();
        document.getElementById('result').innerHTML = result;
    });
  });