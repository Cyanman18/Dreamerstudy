const $ = s => document.querySelector(s);
const messagesEl = $("#messages");
const input = $("#input");
const send = $("#send");
const chatList = $("#chatList");
const sidebar = document.querySelector(".sidebar");

let chats = JSON.parse(localStorage.getItem("nova-chats") || "[]");
let active = null;

function save(){ localStorage.setItem("nova-chats", JSON.stringify(chats)); renderChatList(); }

function renderChatList(){
  chatList.innerHTML = "";
  chats.slice().reverse().forEach(chat=>{
    const b=document.createElement("div");
    b.className="chat-item";
    b.textContent=chat.title || "New chat";
    b.onclick=()=>loadChat(chat.id);
    chatList.appendChild(b);
  });
}

function loadChat(id){
  const chat=chats.find(c=>c.id===id); if(!chat)return;
  active=chat;
  messagesEl.innerHTML="";
  chat.messages.forEach(m=>addMessage(m.role,m.content,false));
  sidebar.classList.remove("open");
}

function newChat(){
  active={id:crypto.randomUUID(),title:"New chat",messages:[]};
  chats.push(active); save();
  messagesEl.innerHTML=`<div class="welcome"><div class="welcome-icon">✦</div><h2>What can I help you build?</h2><p>Ask Nova anything.</p><div class="suggestions"><button data-prompt="Help me build a gaming website">Gaming website</button><button data-prompt="Write JavaScript for a useful tool">Write code</button></div></div>`;
}

function addMessage(role,text,scroll=true){
  const row=document.createElement("div");
  row.className=`message ${role}`;
  const av=document.createElement("div"); av.className="avatar"; av.textContent=role==="user"?"YOU":"N";
  const bubble=document.createElement("div"); bubble.className="bubble"; bubble.textContent=text;
  row.append(av,bubble); messagesEl.appendChild(row);
  if(scroll) messagesEl.scrollTop=messagesEl.scrollHeight;
}

function addTyping(){
  const row=document.createElement("div"); row.className="message assistant"; row.id="typing";
  row.innerHTML=`<div class="avatar">N</div><div class="bubble"><div class="typing"><i></i><i></i><i></i></div></div>`;
  messagesEl.appendChild(row); messagesEl.scrollTop=messagesEl.scrollHeight;
}

async function sendMessage(text){
  text=text.trim(); if(!text || send.disabled)return;
  if(!active)newChat();
  const welcome=document.querySelector(".welcome"); if(welcome)welcome.remove();
  active.messages.push({role:"user",content:text});
  if(active.title==="New chat")active.title=text.slice(0,42);
  addMessage("user",text);
  input.value=""; resize();
  send.disabled=true; addTyping();
  save();

  try{
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:active.messages})});
    const data=await r.json();
    document.querySelector("#typing")?.remove();
    if(!r.ok)throw new Error(data.error||"Request failed");
    active.messages.push({role:"assistant",content:data.text});
    addMessage("assistant",data.text);
    save();
  }catch(e){
    document.querySelector("#typing")?.remove();
    addMessage("assistant","Error: "+e.message);
  }finally{send.disabled=false;input.focus();}
}

$("#composer").addEventListener("submit",e=>{e.preventDefault();sendMessage(input.value)});
input.addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage(input.value)}});
input.addEventListener("input",resize);
function resize(){input.style.height="auto";input.style.height=Math.min(input.scrollHeight,150)+"px"}

document.addEventListener("click",e=>{
  const p=e.target.closest("[data-prompt]");
  if(p){input.value=p.dataset.prompt;sendMessage(input.value)}
});
$("#newChat").onclick=newChat;
$("#clearChat").onclick=()=>{if(active){active.messages=[];save();loadChat(active.id)}};
$("#mobileMenu").onclick=()=>sidebar.classList.toggle("open");
$("#theme").onclick=()=>document.body.classList.toggle("light");

renderChatList();