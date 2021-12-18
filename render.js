const electron=require('electron');
const ipcRenderer=electron.ipcRenderer;
const shell=electron.shell;

const inputPassword=()=>{
    ipcRenderer.send('generatePassword',[document.querySelector('.Password').value,document.querySelector('.Username').value]);
}

const inputHashedPassword=()=>{
    ipcRenderer.send('fetchOriginalPassword',document.querySelector('.Username').value);
}

const AccessingDatabase=()=>{
    shell.openPath('C:\\Users\\harsh\\Desktop\\DatabasePic.jpg')
}

ipcRenderer.on('generatedPassword',(event,data)=>{
    const spaceForHashedPassword=document.querySelector('#spaceForHashedPassword');
    spaceForHashedPassword.innerText=data;
})

ipcRenderer.on('generatedOriginalPassword',(event,data)=>{
    const spaceForOriginalPassword=document.querySelector('#spaceForOriginalPassword');
    spaceForOriginalPassword.innerText=data;
})

ipcRenderer.on('databaseTable',(event,data)=>{
    console.log(data);
    const DatabaseData=document.querySelector('#DatabaseData');
    DatabaseData.innerText=data;
})
