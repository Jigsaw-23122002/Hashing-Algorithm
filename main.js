//This will work only if the version of electron is ^11.1.1
const { ipcRenderer } = require('electron');
const electron=require('electron');
const app=electron.app;
const browserWindow=electron.BrowserWindow;
const ipcMain=electron.ipcMain;
const Menu=electron.Menu;
const MenuItem=electron.MenuItem;
const mongoose=require('mongoose');
const globalShortcut=electron.globalShortcut;
require('dotenv').config();

mongoose.connect(process.env.MONGOURL);
const Hashed=require('./Hashed_Modal');

let win=null;

function Encrypt(){
    win=new browserWindow({
        width:"1100",
        height:"600",
        resizable:true,
        webPreferences:{
            nodeIntegration:true
        }
    });

    win.webContents.openDevTools();

    win.loadFile("Encryption.html");
}

function Decrypt(){
    win.loadFile("Decryption.html");
}

app.whenReady().then(()=>{
    Encrypt();

    const template=[
        {
            label:"Encryption",
            submenu:[
                {
                    label:"Encrypting the passwords",
                    accelerator:"Ctrl + Shift + e",
                    click:function(){
                        win.loadFile("Encryption.html");
                    }
                }
            ]
        },
        {
            label:"Decryption",
            submenu:[
                {
                    label:"Decrypting the passwords",
                    accelerator:"Ctrl + Shift + d",
                    click:function(){
                        win.loadFile("Decryption.html");
                    }
                }
            ]
        },
        {
            label:"Database",
            submenu:[
                {
                    label:"Encrypted Passwords Database",
                    accelerator:"Ctrl + Shift + b",
                    click:function(){
                        Hashed.find().then((databaseContents)=>{
                            win.loadFile("Database.html").then(()=>{
                                console.log(databaseContents);
                                win.webContents.send('databaseTable',databaseContents);
                            })
                        })
                    }
                }
            ]
        },
        {
            label:"More",
            submenu:[
                {
                    label:"Like this project on GitHub",
                    accelerator:"Ctrl + G", 
                    click:function(){
                        electron.shell.openExternal("https://github.com/Jigsaw-23122002/Hashing-Algorithm");
                    },
                },
                {role:"undo"},
                {role:"redo"},
                {role:"copy"},
                {role:"selectall"}
            ]
        }
    ]
    const menu=Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    const ctxMenu=new Menu();
    ctxMenu.append(new MenuItem({
        label:"Github Repository",
        accelerator:"Ctrl + G",
        click:function(){
            electron.shell.openExternal("https://github.com/Jigsaw-23122002/Hashing-Algorithm");
        }
    }));
    win.webContents.on('context-menu',function(event,params){
        ctxMenu.popup(win,params.x,params.y);
    })

    globalShortcut.register("Alt + 1",function(){
        win.show();
    });

});

app.on('will-quit',()=>{
    globalShortcut.unregisterAll();
})

ipcMain.on('generatePassword',(event,data)=>{

    console.log(data);

    Hashed.find({Username:data[1]}).then((dataGot)=>{
        console.log(dataGot);
        if(dataGot.length!==0){
            console.log("User Exists.")
            win.webContents.send('generatedPassword',"Username Already Exists.");
        } 
        else{
            let password=data[0];
            let hashedPassword="";
            let decoder1="";
            let decoder2="";
            let decoder3="";
            let hashDecider="jigsaw";
            let random=Math.round(Math.random()*100);
            console.log(random);
            let k=0;

            for(let i=0;i<password.length;i++){
                
                let a="",b="",c="",d="";
                let equivalence=password.charCodeAt(i);
                while(equivalence>0){
                    let remainder=equivalence%10;
                    a=String.fromCharCode(33+remainder)+a;
                    
                    let resultantValue=remainder+hashDecider.charCodeAt(k)+random;
                    d=hashDecider[k]+d;
                    k++;
                    b=String.fromCharCode(Math.floor(33+resultantValue/85))+b;
                    
                    c=String.fromCharCode(37+resultantValue%85)+c;
                    if(k===hashDecider.length){
                        k=0;
                    }
                    equivalence=Math.floor(equivalence/10);
                }
                decoder1=decoder1+a+'#';
                decoder2=decoder2+b+'#';
                decoder3=decoder3+d+'#';
                hashedPassword=hashedPassword+c+'#';
            }
            let Database=new Hashed({
                Username:data[1],
                Random:random,
                HashedPassword:hashedPassword,
                HashDecider:hashDecider,
                Decoder:decoder1    
            })
            Database.save();
            console.log(hashedPassword);
            win.webContents.send('generatedPassword',hashedPassword);
        }
    })  
})
ipcMain.on('fetchOriginalPassword',(event,data)=>{
    Hashed.findOne({Username:data}).then((datas)=>{
        if(datas!==null){
            let originalPassword="";
                for(let i=0;i<datas.HashedPassword.length;i++){
                    let sum=0;
                    while(datas.HashedPassword[i]!=='#'){
                        let a=datas.Decoder.charCodeAt(i)-33;
                        sum=sum*10+a;   
                        i++;
                    }
                    originalPassword=originalPassword+String.fromCharCode(sum);
                }
                console.log(originalPassword);
                win.webContents.send('generatedOriginalPassword',originalPassword);
            }
        else{
            win.webContents.send('generatedOriginalPassword',"No Encryption is done for this Username.");
        }
    })
})
