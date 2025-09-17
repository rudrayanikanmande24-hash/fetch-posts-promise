const cl = console.log;
const postForm = document.getElementById('postForm');
const titleControl = document.getElementById('title');
const bodyControl = document.getElementById('body');
const userIdControl = document.getElementById('userId');
const postSubmitBtn = document.getElementById('postSubmitBtn');
const postUpdateBtn = document.getElementById('postUpdateBtn');
const postContainer = document.getElementById('postContainer');
const spinner = document.getElementById('spinner');

const BASE_URL='https://jsonplaceholder.typicode.com'
const POST_URL=`${BASE_URL}/posts`

const snackBar = (msg,icon) =>{
    Swal.fire({
        title:msg,
        icon:icon,
        timer:3000
    })
}


const templating = (arr) =>{
    let result='';

    arr.forEach(ele => {
        result +=`<div class="col-md-4">
                <div class="card h-100" id="${ele.id}">
                    <div class="card-header">
                        <h2 class="m-0">${ele.title}</h2>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${ele.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-success">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button>
                    </div>
                </div>
            </div>
        
                
            `
    });
    postContainer.innerHTML=result;
}

const createCard = (res) =>{
    let col = document.createElement('div')
    col.className='col-md-4'
    col.innerHTML=`<div class="card-header">
                        <h2 class="m-0">${res.title}</h2>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${res.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-success">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Remove</button>
                    </div>
    
    
    
    `
    postContainer.prepend(col)

}



const fetchAllPosts = () =>{
   spinner.classList.remove('d-none')
    const CONFIG_OBJ={
        method:'GET',
        body:null,
        headers:{
            "Content-type":'application/json',
            Auth:'JWT token form LocalStorage !!!'
        }

        
    }
    fetch(POST_URL,CONFIG_OBJ)
      .then(res=>{
        if(!res.ok){
            throw new Error('Network Error !!!')
        }
        return res.json()
      })
      .then(data=>{
        // cl(data)
        templating(data)
        snackBar('Create fetched successfully !!!','success')
      })
      .catch(err=>{
        snackBar(err,'error')
      })
      .finally(()=>{
         spinner.classList.add('d-none')
      })
}

fetchAllPosts()

const onPost = (eve) =>{
    eve.preventDefault()

    let obj={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIdControl.value
    }
    cl(obj)

    postForm.reset()

     spinner.classList.remove('d-none')
    let CONFIG_OBJ={
        method:"POST",
        body:JSON.stringify(obj),
        headers:{
            "Content-type":'application/json',
            Auth:'JWT token form LocalStorage !!!'
        }
    }

    fetch(POST_URL, CONFIG_OBJ)
      .then(res=>{
        if(!res.ok){
            throw new Error('Network Error !!!')
        }
        return res.json()
      })
      .then(res=>{
        cl(res)
        createCard(res)
        snackBar('Create card successfully !!!','success')
      })
      .catch(err=>{
        snackBar(err,'error')
      })
      .finally(()=>{
         spinner.classList.add('d-none')
      })
}

const patchData = (data) =>{
    titleControl.value=data.title
    bodyControl.value=data.body
    userIdControl.value=data.userId
    postSubmitBtn.classList.add('d-none')
    postUpdateBtn.classList.remove('d-none')
}

const onEdit = (ele) =>{
    EDIT_ID = ele.closest('.card').id
    localStorage.setItem('EDIT_ID',EDIT_ID)
    EDIT_URL=`${BASE_URL}/posts/${EDIT_ID}`

     
     spinner.classList.remove('d-none')
    const CONFIG_OBJ = {
        method:'GET',
        body:null,
        headers:{
            "Contnet-type":'application/json',
            Auth:'JWT token form LocalStorage !!!'
        }
    }

    fetch(EDIT_URL,CONFIG_OBJ)
     .then(res=>{
        if(!res.ok){
            throw new Error('Network Error !!!')
        }
        return res.json()
     })
     .then(data=>{
       patchData(data)
        postForm.scrollIntoView({
         behavior: "smooth",   
         block: "start"       
       });
     })
     .catch(err=>{
        snackBar(err,'error')
     })
     .finally(()=>{
         spinner.classList.add('d-none')
     })
}


const onUpdate = () =>{
    let UPDATE_ID=localStorage.getItem('EDIT_ID')
    let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`

     let UPDATED_OBJ={
        title:titleControl.value,
        body:bodyControl.value,
        userId:userIdControl.value,
        id:UPDATE_ID
    }
  cl(UPDATED_OBJ)

    const CONFIG_OBJ ={
        method:"PATCH",
        body:JSON.stringify(UPDATED_OBJ),
        headers:{
            'Content-type':'application/json',
            Auth:'JWT token from LocalStorage !!!'
        }
    }




    fetch(UPDATE_URL, CONFIG_OBJ)
      .then(res=>{
         if(!res.ok){
            throw new Error('Network Error !!!')
         }
         return res.json()
      })
      .then(data=>{
         cl(data)

         let card = document.getElementById(UPDATE_ID)
         let h2 = document.querySelector('.card-header h2')
         let p = document.querySelector('.card-body p')
         cl(h2)
         cl(p)
         h2.innerHTML=data.title
         p.innerHTML=data.body
         
         postSubmitBtn.classList.remove('d-none')
         postUpdateBtn.classList.add('d-none')
      })
      .catch(err=>{
        cl(err)
      })
      .finally(()=>{
        spinner.classList.add('d-none')
      })
}

const onRemove = (ele)=>{
    Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
   let REMOVE_ID=ele.closest('.card').id
    let REMOVE_URL=`${BASE_URL}/posts/${REMOVE_ID}`

    const CONFIG_OBJ = {
        method:"DELETE",
        body:null,
        headers:{
            "Content-type":'application.json',
            Auth:'JWt token form LocalStorage !!!'
        }

    }
    
    spinner.classList.remove('d-none')
    fetch(REMOVE_URL,CONFIG_OBJ)
      .then(res=>{
         if(!res.ok){
            throw new Error('Network Error !!!')
         }
         return res.json()
      })
      .then(res=>{
        cl(res)
        ele.closest('.card').remove()
      })
      .catch(err=>{
        cl(err)
      })
      .finally(()=>{
        spinner.classList.add('d-none')
      })
});
}











postForm.addEventListener('submit', onPost)
postUpdateBtn.addEventListener('click', onUpdate)