let adminUser="admin";
let adminPass="123";
let albums = JSON.parse(localStorage.getItem("albums")||"[]"); // Apenas metadados
let currentAlbumIndex = null;
let deleteMode = false;

// Salvar metadados do álbum
function save(){ 
  localStorage.setItem("albums", JSON.stringify(albums)); 
}

// Renderizar álbuns
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
  currentAlbumIndex=i;
  showGallery();
}

// Mostrar galeria
function showGallery(){
  let album=albums[currentAlbumIndex];
  let gallery=document.getElementById("gallery");
  gallery.innerHTML="";
  if(!album.files) album.files=[];
  album.files.forEach((f,index)=>{
    let div=document.createElement("div");
    div.className="card";
    if(f.type==="image") div.innerHTML=`<img src="${f.url}">`;
    else div.innerHTML=`<video controls src="${f.url}"></video>`;
    let btn=document.createElement("button");
    btn.innerText="Download";
    btn.onclick=()=>{ 
      let a=document.createElement("a");
      a.href=f.url;
      a.download=`arquivo-${index}`;
      a.click();
    };
    div.appendChild(btn);
    gallery.appendChild(div);
  });

  document.getElementById("albumsGrid").classList.add("hidden");
  gallery.classList.remove("hidden");
  if(!document.getElementById("adminPanel").classList.contains("hidden")){
    document.getElementById("galleryAdminControls").classList.remove("hidden");
  }
  document.getElementById("backBtn").classList.remove("hidden");
}

// Voltar aos álbuns
function backToAlbums(){
  document.getElementById("gallery").classList.add("hidden");
  document.getElementById("albumsGrid").classList.remove("hidden");
  document.getElementById("galleryAdminControls").classList.add("hidden");
  document.getElementById("backBtn").classList.add("hidden");
}

// Criar álbum
function createAlbum(){
  let name=document.getElementById("albumName").value.trim();
  if(!name){ alert("Nome do álbum é obrigatório"); return; }
  let user=document.getElementById("albumUser").value.trim();
  let pass=document.getElementById("albumPass").value;
  let album={name,user,pass,cover:"",files:[]};
  albums.push(album);
  save();
  renderAlbums();
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

// Adicionar arquivos (somente admin)
function addFilesToAlbum(){
  if(currentAlbumIndex===null) return;
  let files=document.getElementById("addFiles").files;
  let album=albums[currentAlbumIndex];
  Array.from(files).forEach(f=>{
    let url=URL.createObjectURL(f);
    album.files.push({url,type:f.type.startsWith("video")?"video":"image"});
    if(!album.cover && f.type.startsWith("image")) album.cover=url;
  });
  save();
  showGallery();
}

// Deletar arquivos
function toggleDeleteMode(){ deleteMode=!deleteMode; alert(deleteMode?"Modo seleção ativado":"Modo seleção desativado"); }
function confirmDeleteFiles(){
  if(currentAlbumIndex===null) return;
  albums[currentAlbumIndex].files=[];
  save();
  showGallery();
}

// Inicial
renderAlbums();
