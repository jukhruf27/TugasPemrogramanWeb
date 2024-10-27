let form = document.getElementById("task_list") // ini merupakan DOM: Ambil elemen form berdasarkan id
let list = document.getElementById("list") // ini merupakan DOM: Ambil elemen list berdasarkan id
let filter = document.getElementById("filter") // ini merupakan DOM: Ambil elemen filter berdasarkan id
let clearBtn = document.getElementById("clear") // ini merupakan DOM: Ambil elemen clear button berdasarkan id
let newTask = document.getElementById("newTask") // ini merupakan DOM: Ambil elemen input untuk task baru berdasarkan id
let historyList = document.getElementById("history_list") // ini merupakan DOM: Ambil elemen history list berdasarkan id

// Menambahkan event listener pada elemen-elemen DOM
form.addEventListener("submit", addTask) // ini merupakan DOM: Event listener untuk submit form
list.addEventListener("click", deleteTask) // ini merupakan DOM: Event listener untuk klik pada elemen list
clearBtn.addEventListener("click", clearTask) // ini merupakan DOM: Event listener untuk tombol clear
filter.addEventListener("keyup", filterTask) // ini merupakan DOM: Event listener untuk filter ketika mengetik
document.addEventListener("DOMContentLoaded", getTask) // ini merupakan DOM: Event listener untuk DOMContentLoaded
list.addEventListener("change", checkTaskCompleted) // ini merupakan DOM: Event listener untuk perubahan pada list

// Fungsi untuk menambahkan task
function addTask(e) {
    if (newTask.value === "") { // ini merupakan DOM: Cek jika input kosong
        alert("Add a Task!") // ini merupakan DOM: Peringatan jika kosong
    } else {
        let li = createTaskElement(newTask.value); // Membuat elemen task baru
        list.appendChild(li); // ini merupakan DOM: Tambahkan elemen ke list

        storeTaskInLocalStorage(newTask.value) // Simpan task ke LocalStorage

        newTask.value = "" // ini merupakan DOM: Kosongkan input setelah ditambahkan
    }
    e.preventDefault() // Mencegah default submit form
}

// Fungsi untuk membuat elemen task (li) dengan checkbox dan link delete
function createTaskElement(taskText) {
    let li = document.createElement("li") // ini merupakan DOM: Buat elemen li
    
    let checkbox = document.createElement("input") // ini merupakan DOM: Buat elemen checkbox
    checkbox.type = "checkbox" // ini merupakan DOM: Set tipe checkbox
    checkbox.className = "complete-task" // ini merupakan DOM: Tambahkan kelas pada checkbox
    
    li.appendChild(checkbox) // ini merupakan DOM: Tambahkan checkbox ke li
    li.appendChild(document.createTextNode(` ${taskText} `)) // ini merupakan DOM: Tambahkan teks task ke li

    let a = document.createElement("a") // ini merupakan DOM: Buat elemen link untuk delete
    a.setAttribute("href", "#") // ini merupakan DOM: Set atribut href pada link
    a.innerText = "x" // ini merupakan DOM: Set teks link delete
    li.appendChild(a) // ini merupakan DOM: Tambahkan link delete ke li

    return li // Kembalikan elemen li
}

// Fungsi untuk cek task selesai dan pindahkan ke history
function checkTaskCompleted(e) {
    if (e.target.classList.contains("complete-task")) { // ini merupakan DOM: Cek jika elemen yang di klik adalah checkbox selesai
        let li = e.target.parentElement // ini merupakan DOM: Ambil elemen li induk

        if (e.target.checked) { // ini merupakan DOM: Cek jika checkbox ditandai
            historyList.appendChild(li) // ini merupakan DOM: Pindahkan ke history
            removeFromLocalStorage(li) // Hapus dari LocalStorage
            storeCompletedTaskInLocalStorage(li.textContent.trim()) // Simpan ke LocalStorage completed
        } else {
            list.appendChild(li) // ini merupakan DOM: Pindahkan kembali ke task aktif jika tidak ditandai
            removeCompletedTaskFromLocalStorage(li) // Hapus dari LocalStorage completed
            storeTaskInLocalStorage(li.textContent.trim()) // Simpan kembali ke LocalStorage
        }
    }
}

// Fungsi untuk menghapus task
function deleteTask(e) {
    if (e.target.hasAttribute("href")) { // ini merupakan DOM: Cek jika elemen memiliki atribut href
        if (confirm("Are You Sure?")) { // ini merupakan DOM: Konfirmasi penghapusan
            let ele = e.target.parentElement // ini merupakan DOM: Ambil elemen li induk
            ele.remove() // ini merupakan DOM: Hapus elemen dari list
            removeFromLocalStorage(ele) // Hapus dari LocalStorage
        }
    }
}

// Fungsi untuk membersihkan seluruh task
function clearTask() {
    if (confirm("Are You Sure?")) { // ini merupakan DOM: Konfirmasi penghapusan semua task
        list.innerHTML = "" // ini merupakan DOM: Kosongkan elemen list
        localStorage.clear() // Hapus seluruh data dari LocalStorage
    }
}

// Fungsi untuk memfilter task
function filterTask(e) {
    let text = e.target.value.toLowerCase() // ini merupakan DOM: Ambil teks filter dan ubah ke huruf kecil
    document.querySelectorAll("li").forEach(task => { // ini merupakan DOM: Loop melalui setiap elemen li
        let item = task.textContent.toLowerCase().indexOf(text) // ini merupakan DOM: Cek kecocokan teks
        if (item != -1) {
            task.style.display = "block" // ini merupakan DOM: Tampilkan elemen jika cocok
        } else {
            task.style.display = "none" // ini merupakan DOM: Sembunyikan elemen jika tidak cocok
        }
    })
}

// Fungsi untuk menyimpan task ke LocalStorage
function storeTaskInLocalStorage(task) {
    let tasks = getTasksFromLocalStorage("tasks") // Ambil data task dari LocalStorage
    tasks.push(task) // Tambahkan task ke array
    localStorage.setItem("tasks", JSON.stringify(tasks)) // Simpan kembali ke LocalStorage
}

// Fungsi untuk menyimpan task selesai ke LocalStorage
function storeCompletedTaskInLocalStorage(task) {
    let tasks = getTasksFromLocalStorage("completed_tasks") // Ambil data completed task dari LocalStorage
    tasks.push(task) // Tambahkan completed task ke array
    localStorage.setItem("completed_tasks", JSON.stringify(tasks)) // Simpan kembali ke LocalStorage
}

// Fungsi untuk mengambil data task dari LocalStorage berdasarkan key
function getTasksFromLocalStorage(key) {
    let tasks;
    if (localStorage.getItem(key) === null) { // Cek jika tidak ada data di LocalStorage
        tasks = [] // Inisialisasi array kosong
    } else {
        tasks = JSON.parse(localStorage.getItem(key)) // Ambil dan parsing data dari LocalStorage
    }
    return tasks // Kembalikan array task
}

// Fungsi untuk mengambil task dari LocalStorage ketika halaman dimuat
function getTask() {
    let tasks = getTasksFromLocalStorage("tasks") // Ambil data task dari LocalStorage
    let completedTasks = getTasksFromLocalStorage("completed_tasks") // Ambil data completed task dari LocalStorage

    tasks.forEach(task => {
        let li = createTaskElement(task); // Membuat elemen li untuk setiap task
        list.appendChild(li) // ini merupakan DOM: Tambahkan elemen ke list
    })

    completedTasks.forEach(task => {
        let li = createTaskElement(task); // Membuat elemen li untuk setiap completed task
        li.querySelector(".complete-task").checked = true // ini merupakan DOM: Tandai checkbox sebagai selesai
        historyList.appendChild(li) // ini merupakan DOM: Tambahkan elemen ke history list
    })
}

// Fungsi untuk menghapus task dari LocalStorage
function removeFromLocalStorage(element) {
    let tasks = getTasksFromLocalStorage("tasks") // Ambil data task dari LocalStorage
    let li = element
    li.removeChild(li.lastChild) // ini merupakan DOM: Hapus link delete
    let text = li.textContent.trim() // ini merupakan DOM: Ambil teks task

    tasks.forEach((task, index) => {
        if (task === text) { // Cek jika task sesuai
            tasks.splice(index, 1) // Hapus task dari array
        }
    })
    localStorage.setItem("tasks", JSON.stringify(tasks)) // Simpan array baru ke LocalStorage
}

// Fungsi untuk menghapus completed task dari LocalStorage
function removeCompletedTaskFromLocalStorage(element) {
    let tasks = getTasksFromLocalStorage("completed_tasks") // Ambil data completed task dari LocalStorage
    let li = element
    li.removeChild(li.lastChild) // ini merupakan DOM: Hapus link delete
    let text = li.textContent.trim() // ini merupakan DOM: Ambil teks task

    tasks.forEach((task, index) => {
        if (task === text) { // Cek jika task sesuai
            tasks.splice(index, 1) // Hapus task dari array
        }
    })
    localStorage.setItem("completed_tasks", JSON.stringify(tasks)) // Simpan array baru ke LocalStorage
}
