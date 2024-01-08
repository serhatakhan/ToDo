const input = document.querySelector("#todoInput");
const todoForm = document.querySelector(".container");
const wrapper = document.querySelector(".todo-wrapper");
const alertTodo = document.querySelector(".success");
const clearBtn = document.querySelector("#clear");
// console.log(wrapper)

// storage için oluşturduk.
let todos = [];

// olayların yer aldığı fonk çalışsın
runEvents();

// eventler
function runEvents() {
  todoForm.addEventListener("submit", addTodo);
  document.addEventListener("DOMContentLoaded", pageLoaded); //ekran yüklendiğinde pageLoaded fonk çalışsın
  clearBtn.addEventListener("click", clearAllTodo)
}

function clearAllTodo(e){
  if(wrapper.children.length > 0){
    clearBtn.classList.remove("hide")
    const clear = e.target.previousElementSibling
    clear.remove()
    clearBtn.classList.add("hide")
    showAlert("All Deleted")
  }
  // storageden komple sil
  removeAllStorage()
}

function removeAllStorage(){
  localStorage.removeItem("todos")
  todos = []
}

// storage'den alınan değerleri ekrana yazdık. sayfa yenilenince de silinmiyor
function pageLoaded() {
  checkTodosFromStorage(); //önce todos'un güncel değerini almak için bu fonksiyonu çalıştırdık
  todos.forEach((todo) => {
    addTodoUI(todo); // todo ismiyle yakaladığım her bir elemanı arayüze renderladığım fonksiyonumu çağırarak ona parametre oalrak verdim
    clearBtn.classList.remove("hide");
    // clear all todo butonunu da ekledik
  });
}

// todo ekleme
function addTodo(e) {
  e.preventDefault();
  let inputValue = input.value.trim();

  if (inputValue == null || inputValue == "") {
    showAlert("Please Add TO DO !");
  } else {
    // arayüze renderlama
    addTodoUI(inputValue);
    clearBtn.classList.remove("hide");

    // storage ekleme
    addTodoStorage(inputValue);

    // uyarı
    showAlert("Success");
  }
}

// arayüze randerlama
function addTodoUI(value) {
  const todoDiv = document.createElement("div");
  todoDiv.classList.add("todo-main-wrap");
  todoDiv.innerHTML = `
    <p class="todo-name">${value}</p>
    <div class="todoBtn">
      <button id="editBtn">Draw</button>
      <button id="deleteBtn">Remove</button>
    </div>
    `;
  wrapper.appendChild(todoDiv);
  input.value = "";

  // üstünü çizme
  const editBtn = todoDiv.querySelector("#editBtn")
  editBtn.addEventListener("click", drawLine)

  // arayüzden silme
  const deleteBtn = todoDiv.querySelector("#deleteBtn");
  deleteBtn.addEventListener("click", deleteTodo);
  /*içerde tanımlamanızın nedeni, her eklenen todo elemanının delete butonu olduğu için 
  ve bu delete butonlarına aynı event listener'ı eklemek istediğimiz için */
}

// üstünü çizme fonksiyonu
function drawLine(e){
  const pEle = e.target.parentElement.previousElementSibling
  pEle.style.textDecoration = "line-through"
}

// arayüzden silme fonk.
function deleteTodo(e) {
  // ekrandan silme
  const element = e.target.parentElement.parentElement;
  element.remove()
  showAlert("Deleted")
  /*e.target kullanmanızın nedeni, silme işlemini tetikleyen butonun hangi element
  üzerinde tıklandığını belirlemektir. e.target tıklanan öğeyi temsil eder ve bu
  hangi butona tıklandığını belirlemenize yardımcı olur.*/
  /*Eğer e.target kullanmazsanız, her zaman aynı öğeyi sileceğiniz için yanlış todo elemanını silebiliriz. */
  
  if(wrapper.children.length == 0){
    clearBtn.classList.add("hide");
  }

  // storageden silme , elementin textcontentini değişekene atadık
  const todoText = element.querySelector(".todo-name").textContent;
  removoTodoStorage(todoText)
  //sildiğimiz elemanın textContentini parametre olarak verdik. bunu aşağıda eşleştireceğiz.
}

// storageden silme fonk.
function removoTodoStorage(removeTodo){
  checkTodosFromStorage() //yine todos'un güncel halini aldık

  todos.forEach((todo,index)=>{
    // todo adıyla yakaladığımız her elemanın bir de index numarasını aldık.
    if(removeTodo==todo){ 
      todos.splice(index,1) 
      //index numarası şu olandan başla ve 1 tane değer sil dedik burada !!! ilki nerden başlayacağını, ikincisi ise kaç tane ögeyi sileceğimizi söylüyor
    }
  })
  localStorage.setItem("todos",JSON.stringify(todos))
  // son halini lokale setle ve "todos" key'inin array formatında veriyoruz lokale
}

// storageye ekleme
function addTodoStorage(storageValue) {
  checkTodosFromStorage(); //varsa dolu yoksa boş başlatan fonksiyon
  todos.push(storageValue); //storageValue'yi todos'a pushla
  localStorage.setItem("todos", JSON.stringify(todos)); //yeni güncel arrayi lokale bastık
}
// önce storage'da kayıt var mı yoksa boş mu onu kontrol ediyoruz.
function checkTodosFromStorage() {
  // lokalde todos key'li bir eleman yoksa, boş dizi çevir.
  if (localStorage.getItem("todos") === null) {
    todos = []; //globalde tanımladık
  } else {
    // varsa bunu js verisine çevirip todos'a ata. array'e çeviriyor.
    todos = JSON.parse(localStorage.getItem("todos"));
  }
}

// uyarı fonk
function showAlert(text) {
  // önce hide clasını kaldır ve yazı görünsün
  alertTodo.classList.remove("hide");
  alertTodo.textContent = text;

  // 1.5 saniye sonra hide clasını ekle ve görünmesin
  setTimeout(() => {
    alertTodo.textContent = "";
    alertTodo.classList.add("hide");
  }, 1500);
}
