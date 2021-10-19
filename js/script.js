const logOutBtn = document.querySelector('#logout');
const template = document.querySelector('#template').content
const elList = document.querySelector('#list')

const token = JSON.parse(window.localStorage.getItem('__auth_token__'))

if(!token?.token){
    window.location.replace('login.html')
}

logOutBtn.addEventListener('click', () =>{
    window.localStorage.removeItem('__auth_token__');
    location.reload();
})

function renderUser(person, element) {
    element.innerHTML = null;
    window.localStorage.setItem('users', JSON.stringify(person))
    person.forEach(item => {
        /*--------------- cloneTemplate---------------------*/
        const cloneTemplate = template.cloneNode(true);
        /*--------------- create Element---------------------*/
        const elLinkItem = cloneTemplate.querySelector("#list__item")
        const newImg = cloneTemplate.querySelector("#temp__img")
        const elTitle = cloneTemplate.querySelector("#userName")
        const elLink = cloneTemplate.querySelector("#emailLink")
        
        newImg.setAttribute("src", item.avatar);
        elTitle.textContent = item.first_name + " " + item.last_name;
        elLink.setAttribute("href", item.email);
        elLink.textContent = item.email;

        elLinkItem.addEventListener("mouseenter", () => {
            newImg.classList.add("animate__rotateIn")
        });

        element.appendChild(cloneTemplate)
    });
}

try {
    async function fetchLogin(){
        const response = await fetch('https://reqres.in/api/users?page=2');
        const data = await response.json();
        const fullData = await data.data
    
        renderUser(fullData, elList)
    }
    fetchLogin()
}catch{
    console.error(e);
}
elList.addEventListener('click', (e) =>{
    if(e.target.matches('.deleteBtn')){
        let {uuid} = e.target.dataset;

        const users = JSON.parse(window.localStorage.getItem('users'));

        const foundUserIndex = users.findIndex((row) => row.id == uuid);

        fetch('https://reqres.in/api/users/' + foundUserIndex, {
            method: "DELETE"
        }).then(res => {
            if(res.status == 204){
                users.splice(foundUserIndex, 1);
                renderUser(users, elList);
            }
        })
    }
})