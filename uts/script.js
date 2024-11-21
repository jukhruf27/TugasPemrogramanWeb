let cart = JSON.parse(localStorage.getItem('cart')) || []; // Ambil data keranjang dari localStorage

// Fungsi untuk menambahkan produk ke keranjang
function addToCart(productName, productPrice) {
    cart.push({ name: productName, price: productPrice });
    localStorage.setItem('cart', JSON.stringify(cart)); // Simpan keranjang yang telah diperbarui ke localStorage
    alert(`${productName} telah ditambahkan ke keranjang.`);
}

// Fungsi untuk menampilkan produk yang ada di keranjang
function displayCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = ''; // Bersihkan konten sebelumnya

    // Jika keranjang kosong
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Keranjang belanja Anda kosong.</p>';
        return;
    }

    // Menampilkan setiap produk yang ada di keranjang
    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            ${item.name} - Rp ${item.price} 
            <button onclick="removeFromCart(${index})">Hapus</button>
        `;
        cartItemsDiv.appendChild(div);
    });
}

// Fungsi untuk menghapus produk dari keranjang
function removeFromCart(index) {
    cart.splice(index, 1); // Menghapus produk berdasarkan index
    localStorage.setItem('cart', JSON.stringify(cart)); // Simpan perubahan ke localStorage
    displayCart(); // Update tampilan keranjang
}

// Fungsi untuk melanjutkan ke halaman checkout
function checkout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong!');
        return;
    }
    window.location.href = "checkout.html"; // Arahkan ke halaman checkout
}

// Fungsi untuk menangani proses pembayaran
function processPayment(event) {
    event.preventDefault(); // Mencegah form submit secara default

    // Ambil nama dan alamat untuk memastikan form terisi
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;

    if (name && address) {
        // Tampilkan modal "Pembayaran Berhasil"
        showModal();
    } else {
        alert('Silakan lengkapi data terlebih dahulu.');
    }
}

// Fungsi untuk menampilkan modal
function showModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'block'; // Menampilkan modal
}

// Fungsi untuk menutup modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none'; // Menutup modal
}

// Menutup modal jika user klik di luar modal
window.onclick = function(event) {
    const modal = document.getElementById('success-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};


document.addEventListener("DOMContentLoaded", function() {
    // Jika berada di halaman keranjang, tampilkan isi keranjang
    if (document.getElementById("cart-items")) {
        displayCart();
    }
});
