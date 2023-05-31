const doccontainer = document.querySelector("#docView");

async function loadDocs (){
    const res = await fetch('/loadNewest', {
       method: 'POST',
       headers: {
          'Content-Type': 'application/json'
       },
       body: JSON.stringify({
          parcel: 
             'LOAD'
          
       })
    });
    
    const result = await(res.json());

    console.log(result);
    
    let docs = result.status.foundDocs;


    if(docs.length < 10){
        docs.forEach((doc) => {

            // If working with images, add: <img src="data:${doc.image.contentType};base64, ${doc.image.data.toString('base64')}" class="docImg" alt="Bilde av document"> below first div tag

            let template = `
            <div class="docContain" id="${doc._id}"> 
                <div class="mainInfo">
                    <h1 class="docName">${doc.name}</h1>
                    <div class="abList">
                        <h2>Properties:</h2
                        <p class="docList">${doc.property}</p>
                    </div>
                    <p class="docCreator">${doc.creator}</p>
                </div>
            </div>
            `;
            doccontainer.innerHTML += template;
    })
    }else{
        for(i = 0; i < 10; i++){

            // If working with images, add: <img src="data:${docs[i].image.contentType};base64, ${docs[i].image.data.toString('base64')}" class="docImg" alt="Bilde av document"> below first div tag

            let template = `
            <div class="docContain" id="${docs[i]._id}"> 
                    <div class="mainInfo">
                        <h1 class="docName">${docs[i].name}</h1>
                        <div class="abList">
                            <h2>Properties:</h2
                            <p class="docList">${docs[i].property}</p>
                        </div>
                        <p class="docCreator">${docs[i].creator}</p>
                    </div>
            </div>
            `;
            doccontainer.innerHTML += template;
        }
    }
    
}

loadDocs();