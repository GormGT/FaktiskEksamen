const form = document.querySelector('#signupForm');

const errorCont = document.querySelector(".errors");
const errorMail = document.querySelector(".emailerror");
const errorName = document.querySelector(".nameerror");
const errorPass = document.querySelector(".passerror");

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // reset errors
    errorPass.textContent = "";
    errorMail.textContent = "";
    errorName.textContent = "";
    errorCont.classList.add("hidden");

    //get the values
    const mail = form.signupEmail.value;
    const name = form.signupName.value;
    const password = form.signupPass.value;
    const password2 = form.signupPass2.value;

    if(password === password2){

        try {
            const res = await fetch('/sign-up', {
                method: "POST",
                body: JSON.stringify({ name, mail, password, password2 }),
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await res.json();
            console.log(data);
            if(data.errors){ //if errors are present, show them on the page
                errorName.textContent = data.errors.name;
                errorMail.textContent = data.errors.email;
                errorPass.textContent = data.errors.password;
                errorCont.classList.remove("hidden");
            }
            if(data.user){
                location.assign(`/${data.user.name}`); //if login is successful, redirect to homepage
            }
        }
        catch(err){
            console.error("Stop breaking things, is it really that hard?", err);
        }
    }else{
        errorCont.classList.remove("hidden");
        errorPass.textContent = "Passwords do not match";
    }
})