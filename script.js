let adminUser="admin";
let adminPass="123";
let albums = JSON.parse(localStorage.getItem("albums")||"[]");
let currentAlbumIndex = null;
let deleteMode = false;

// Salvar albums
function save(){ 
  try { 
    localStorage.setItem("albums", JSON.stringify(albums)); 
  } catch(e){ 
    if(e.name==='QuotaExceededError') alert('Limite de armazenamento atingido!');
  } 
}

// Renderização de álbuns
function renderAlbums(){
  let grid=document.getElementById("albumsGrid");
  grid.innerHTML="";
  albums.forEach((album,i)=>{
    let card=document.createElement("div");
    card.className="album-card";
    card.onclick=()=>openAlbum(i);
    let cover=album.cover?`<img src='${album.cover}'>`:`<div style='height:150px;background:#333;border-radius:8px;line-height:150px;'>Sem Capa</div>`;
    card.innerHTML=`${cover}<h4>${album.name}</h4>`;
    grid.appendChild(card);
  });
}

// Abrir álbum
function openAlbum(i){
  alert("Abrir álbum aqui (funcionalidade completa pode ser adicionada).");
}

// Criar álbum (admin)
function createAlbum(){
  let name=document.getElementById("albumName").value.trim();
  if(!name){ alert("Nome do álbum é obrigatório!"); return; }
  let user=document.getElementById("albumUser").value.trim();
  let pass=document.getElementById("albumPass").value;
  let files=document.getElementById("albumFiles").files;
  let album={name,user,pass,cover:"",files:[]};
  if(files.length>0){
    Array.from(files).forEach(f=>{
      let reader=new FileReader();
      reader.onload=(e)=>{ album.files.push({src:e.target.result,type:f.type.startsWith("video")?"video":"image"}); save(); };
      reader.readAsDataURL(f);
    });
    album.cover=URL.createObjectURL(files[0]);
  }
  albums.push(album); save(); renderAlbums();
  alert("Álbum criado!");
}

// Admin login
document.getElementById("adminBtn").onclick = () => { document.getElementById("loginBox").classList.toggle("hidden"); };
document.getElementById("loginBtn").onclick = () => {
  let u=document.getElementById("user").value;
  let p=document.getElementById("pass").value;
  if(u===adminUser && p===adminPass){
    document.getElementById("adminPanel").classList.remove("hidden");
    document.getElementById("loginBox").classList.add("hidden");
    renderAlbums();
    alert("Login Admin realizado");
  } else alert("Usuário ou senha incorretos");
};
function closeLogin(){ document.getElementById("loginBox").classList.add("hidden"); }
function logout(){ document.getElementById("adminPanel").classList.add("hidden"); renderAlbums(); }

// Marquee
function updateMarquee(){ 
  let text=document.getElementById("marqueeInput").value;
  if(text) document.getElementById("marquee").innerText=text;
}

// Papel de parede
function setWallpaper(){
  let file=document.getElementById('wallpaperFile').files[0];
  if(file){
    let reader=new FileReader();
    reader.onload=(e)=>{ document.body.style.backgroundImage=`url('${e.target.result}')`; document.body.style.backgroundSize='cover'; document.body.style.backgroundRepeat='no-repeat'; };
    reader.readAsDataURL(file);
  }
}

// Inicial render
renderAlbums();

// Inicial render

renderAlbums();
