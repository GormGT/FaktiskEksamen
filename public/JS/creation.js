// const { post } = require("../../routes/routes");

const docFormCont = document.querySelector("#newDocFormContainer");
const docForm = document.querySelector("#newDocForm");
const docFormBtn = document.querySelector("#submitBtn");

const updateDocFormCont = document.querySelector("#updateDocFormContainer");
const updateDocForm = document.querySelector(".updateDocForm");

const doccontainer = document.querySelector("#docView");

docForm.addEventListener("submit" , async (e) => { // If using images, make the event listen for a "click" on the form button
   //  e.preventDefault();

   // When working with images

   //  const formData = new FormData();

   //  //form image value
   //  formData.append("image", newPokoForm.pokoImg.files[0]);

   //  //form values
   //  formData.append('name', newPokoForm.pokoName.value);
   //  formData.append('ability1', newPokoForm.pokoAb1.value);
   //  formData.append('ability2', newPokoForm.pokoAb2.value);
   //  formData.append('ability3', newPokoForm.pokoAb3.value);
   //  formData.append('creator', "");
   //  formData.append('creatorID', "");


   // When working without images

   const data = {
      name: docForm.docName.value,
      // property: docForm.docProp1.value,
      creatorID: ""
      // creator: ""
   }

   // Always included

    try{
        const res = await fetch('/documentCreate', {

         // Image version
            // method: 'POST',
            // headers: {},
            // body: formData

         // Normal version
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
        console.log(err);
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

    result.status.foundDocs.forEach((doc) => {

      // If working with images, add: <img src="data:${doc.image.contentType};base64, ${doc.image.data.toString('base64')}" class="docImg" alt="Bilde av document"> right under the first div tag

        let template = `
        <div class="docContain" id="${doc._id}"> 
               <h1 class="docName">${doc.name}</h1>
               <div class="docActions">
                  <button class="" onclick="updateDocFetch('${doc._id}')">Update</button>
                  <button class="" onclick="deleteDoc('${doc._id}')">Delete</button>
               </div>
        </div>
        `;
        doccontainer.innerHTML += template;
    })
    
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