// const { post } = require("../../routes/routes");

const docFormCont = document.querySelector("#newDocFormContainer");
const docForm = document.querySelector("#newDocForm");
const docFormBtn = document.querySelector("#submitBtn");

const updateDocFormCont = document.querySelector("#updateDocFormContainer");
const updateDocForm = document.querySelector(".updateDocForm");

const doccontainer = document.querySelector("#docView");

docForm.addEventListener("submit" , async (e) => { // If using images, make the event listen for a "click" on the form button

   const data = {
      name: docForm.docName.value,
      // property: docForm.docProp1.value,
      creatorID: ""
      // creator: ""
   }

   // Always included

    try{
        const res = await fetch('/documentCreate', {

            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({
               data
            })
         });
         
         const result = await(res.json());
         
         console.log(result);
         
    }catch(err){
        console.log(err); //On firefox this function is broken, users cannot create or update tasks
    }
})

updateDocForm.addEventListener("submit", async (e) =>{
   //  e.preventDefault();


    const newInfo = {
        name: updateDocForm.docUName.value
      //   property: updateDocForm.docUProp1.value,
    }

    const id = updateDocForm.id;

    const res = await fetch('/docUpdate', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify({
          newInfo, id
       })
    });
    
    const result = await(res.json());
    
    console.log(result);
    

})

async function loadDocuments (){
    const res = await fetch('/loadPersonal', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify({
          parcel: 'LOAD'
       })
    });
    
    const result = await(res.json());

    let resultLength = result.status.foundDocs.length;
    
    result.status.foundDocs.forEach((doc) => {

      // If working with images, add: <img src="data:${doc.image.contentType};base64, ${doc.image.data.toString('base64')}" class="docImg" alt="Bilde av document"> right under the first div tag

        let template = `
        <div class="docContain" id="${doc._id}"> 
               <h1 class="docName">${doc.name}</h1>
               <svg class="checkMark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
               <div class="docActions">
                  <button class="" onclick="updateDocFetch('${doc._id}')">Update</button>
                  <button class="" onclick="deleteDoc('${doc._id}')">Delete</button>
               </div>
        </div>
        `;
        doccontainer.innerHTML += template;

        resultLength--;
    })

    if(resultLength == 0){
      assignChecks();
    }
    
}

async function updateDocFetch(id){

    const res = await fetch('/docUpdateFetch', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify({
          id
       })
    });
    
    const result = await(res.json());
    
    console.log(result);

    docFormCont.classList.add("hidden");
    updateDocFormCont.classList.remove("hidden");
    updateDocForm.id = id;

    console.log(updateDocForm);
    

    updateDocForm.docUName.value = result.status.name;
   //  updateDocForm.docUProp1.value = result.status.property;
}

function cancelUpdate(){
   docFormCont.classList.remove("hidden");
   updateDocFormCont.classList.add("hidden");
   updateDocForm.id = "";
   updateDocForm.docUName.value = "";
}

async function deleteDoc(id){
    const res = await fetch('/docDelete', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify({
          id
       })
    });
    
    const result = await(res.json());
    
    console.log(result);
    
}

loadDocuments();

function assignChecks(){
   let checks = document.querySelectorAll("svg.checkMark");
   console.log(checks);

   checks.forEach((check) => {
      check.addEventListener('click', e => {
         console.log("Check marked");

         // ADD FUNCTIONALITY FOR CHECKMARKS HERE

      })
   })
}