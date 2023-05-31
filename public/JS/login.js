const form = document.querySelector('#loginForm');

const errorCont = document.querySelector(".errors");
const errorMail = document.querySelector(".emailerror");
const errorPass = document.querySelector(".passerror");

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //get the values
    const email = form.loginEmail.value;
    const password = form.loginPass.value;

    // reset errors
    errorPass.textContent = "";
    errorMail.textContent = "";
    errorCont.classList.add("hidden");


    try {
        const res = await fetch('/sign-in', {
            method: "POST",
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        console.log(data);
        if(data.errors){ //if errors are present, show them in the error fields
            errorCont.classList.remove("hidden");
            errorMail.textContent = data.errors.email;
            errorPass.textContent = data.errors.password;
        }
        if(data.user){
            console.log(data.user.name);
            location.assign(`/${data.user.name}`); //if login is successful, redirect to homepage
        }
    }
    catch(err){
        console.error("Welp, time to reset the error counter", err);
    }
})