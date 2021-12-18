const electron=require('electron');
const ipcRenderer=electron.ipcRenderer;

const inputPassword=()=>{
    ipcRenderer.send('generatePassword',[document.querySelector('.Password').value,document.querySelector('.Username').value]);
}

const inputHashedPassword=()=>{
    ipcRenderer.send('fetchOriginalPassword',document.querySelector('.Username').value);
}

ipcRenderer.on('generatedPassword',(event,data)=>{
    const spaceForHashedPassword=document.querySelector('#spaceForHashedPassword');
    spaceForHashedPassword.innerText=data;
})

ipcRenderer.on('generatedOriginalPassword',(event,data)=>{
    const spaceForOriginalPassword=document.querySelector('#spaceForOriginalPassword');
    spaceForOriginalPassword.innerText=data;
})
