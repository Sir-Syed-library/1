function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function removeItem(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function changeQuantity(index, delta) {
  const cart = getCart();
  const currentQty = cart[index].quantity || 1;
  const newQty = currentQty + delta;

  if (newQty <= 0) {
    cart.splice(index, 1);
  } else {
    cart[index].quantity = newQty;
  }

  saveCart(cart);
  renderCart();
}
function renderCart() {
  const itemsDiv = document.getElementById("cartItems");
  const cart = getCart();
  itemsDiv.innerHTML = "";

  if (cart.length === 0) {
    itemsDiv.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("totalPrice").textContent = "";
    document.getElementById("whatsappBtn").style.display = "none";
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    const qty = item.quantity || 1;
    subtotal += item.price * qty;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
  <div class="item-info">${item.name}</div>
  <div class="item-price">₹${item.price} x ${qty} = ₹${item.price * qty}</div>
  <div class="quantity-controls">
    <button onclick="changeQuantity(${index}, -1)">-</button>
    <span class="quantity-display">${qty}</span>
    <button onclick="changeQuantity(${index}, 1)">+</button>
  </div>
  <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
`;

    itemsDiv.appendChild(itemDiv);
  });

  const discount = 0; // future discount ke liye placeholder
  const shipping = 40;
  const grandTotal = subtotal - discount + shipping;

  document.getElementById("totalPrice").innerHTML = `
    <p><strong>Subtotal:</strong> ₹${subtotal}</p>
    <p><strong>Discount:</strong> ₹${discount}</p>
    <p><strong>Shipping Charges:</strong> ₹${shipping}</p>
    <p><strong>Grand Total:</strong> ₹${grandTotal}</p>
  `;

  const message = encodeURIComponent(
    `Hello, I want to order the following items from Apna Bageecha:\n\n` +
      cart
        .map(
          (p) =>
            `- ${p.name} x ${p.quantity || 1} (₹${p.price * (p.quantity || 1)})`
        )
        .join("\n") +
      `\n\nSubtotal: ₹${subtotal}\nDiscount: ₹${discount}\nShipping: ₹${shipping}\nGrand Total: ₹${grandTotal}`
  );

  document.getElementById("whatsappBtn").style.display = "inline-block";
  document.getElementById("whatsappBtn").onclick = function () {
    window.open(`https://wa.me/917042346807?text=${message}`, "_blank");
  };
}

renderCart();
