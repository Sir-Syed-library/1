const allCardsOriginal = Array.from(document.querySelectorAll(".product-card")); // global list

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  document.getElementById("cartCount").textContent = totalQty;
}

function addToCart(name) {
  const card = allCardsOriginal.find((c) => c.dataset.name === name);
  if (card) {
    const product = {
      name: card.dataset.name,
      price: parseFloat(card.dataset.price),
      category: card.dataset.category,
      image: card.querySelector("img").src,
    };

    const cart = getCart();
    const existingIndex = cart.findIndex((item) => item.name === product.name);

    if (existingIndex !== -1) {
      // Already in cart: increase quantity
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
    } else {
      // New item: add with quantity = 1
      product.quantity = 1;
      cart.push(product);
    }

    saveCart(cart);
    updateCartCount();
    showToast(`${name} added to cart successfully!`);
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000); // 3 seconds ke baad hide
}

function filterAndSortProducts() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const category = document.getElementById("categorySelect").value;
  const sort = document.getElementById("sortSelect").value;
  const grid = document.getElementById("productGrid");

  let filtered = allCardsOriginal.filter((card) => {
    const name = card.dataset.name.toLowerCase();
    const cat = card.dataset.category;
    return name.includes(search) && (category === "all" || cat === category);
  });

  if (sort === "low") {
    filtered.sort(
      (a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price)
    );
  } else if (sort === "high") {
    filtered.sort(
      (a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price)
    );
  }

  grid.innerHTML = "";
  filtered.forEach((card) => grid.appendChild(card));
}

document
  .getElementById("searchInput")
  .addEventListener("input", filterAndSortProducts);
document
  .getElementById("categorySelect")
  .addEventListener("change", filterAndSortProducts);
document
  .getElementById("sortSelect")
  .addEventListener("change", filterAndSortProducts);

updateCartCount();
