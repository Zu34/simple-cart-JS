

const products = [
  { id: 1, name: "Product 1", price: 10.0, img: "imgs/img1.jpg" },
  { id: 2, name: "Product 2", price: 15.5, img: "imgs/img2.jpg" },
  { id: 3, name: "Product 3", price: 20.0, img: "imgs/img3.jpg" },
];

const cart = [];
const cartItemsElement = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");
const cartCountElement = document.getElementById("cart-count");
const cartModal = document.getElementById("cart-modal");
const cartOverlay = document.getElementById("cart-overlay");

// Render product cards
const renderProducts = () => {
  const productsElement = document.getElementById("products");
  productsElement.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");

    const defaultImg = "imgs/default.jpg";
    const imgSrc = product.img || defaultImg;

    productCard.innerHTML = `
      <img src="${imgSrc}" alt="${product.name}" />
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;

    productsElement.appendChild(productCard);
  });
};

// Add product to cart
const addToCart = (productId) => {
  const product = products.find((item) => item.id === productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found.`);
    return;
  }

  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartDisplay();
  showNotification(`${product.name} has been added to your cart!`);
  saveCartToLocalStorage();
};

// Show notification
const showNotification = (message) => {
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.textContent = message;

  notification.style.backgroundColor = "#28a745"; // Green background
  notification.style.color = "#fff"; // White text
  notification.style.padding = "15px";
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.borderRadius = "8px";
  notification.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
  notification.style.zIndex = "1000";

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out");
    notification.style.transition = "opacity 0.5s ease";
    notification.style.opacity = "0";

    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, 4000); // Show for 4 seconds
};

// Update cart display
const updateCartDisplay = () => {
  cartItemsElement.innerHTML = ""; // Clear cart items
  let totalPrice = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsElement.innerHTML = "<li>Your cart is empty!</li>";
  } else {
    cart.forEach((item) => {
      totalPrice += item.price * item.quantity;
      totalItems += item.quantity;

      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.marginBottom = "10px";

      const thumbnail = document.createElement("img");
      thumbnail.src = item.img || "imgs/default.jpg"; // Use product image or default
      thumbnail.alt = item.name;
      thumbnail.style.width = "50px";
      thumbnail.style.height = "50px";
      thumbnail.style.objectFit = "cover";
      thumbnail.style.marginRight = "10px";
      thumbnail.style.borderRadius = "8px";

      const itemDetails = document.createElement("div");
      itemDetails.innerHTML = `
        ${item.name} - $${item.price.toFixed(2)} x ${item.quantity}
        <div>
          <button onclick="decreaseQuantity(${item.id})" aria-label="Decrease quantity">-</button>
          <button onclick="increaseQuantity(${item.id})" aria-label="Increase quantity">+</button>
          <button onclick="removeFromCart(${item.id})" aria-label="Remove item">Remove</button>
        </div>
      `;

      li.appendChild(thumbnail);
      li.appendChild(itemDetails);

      cartItemsElement.appendChild(li);
    });
  }

  cartCountElement.textContent = totalItems;
  totalPriceElement.textContent = `Total Price: $${totalPrice.toFixed(2)}`;
};

// Decrease quantity
const decreaseQuantity = (productId) => {
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      removeFromCart(productId);
    } else {
      updateCartDisplay();
    }
    saveCartToLocalStorage();
  }
};

// Increase quantity
const increaseQuantity = (productId) => {
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity++;
    updateCartDisplay();
    saveCartToLocalStorage();
  }
};

// Remove from cart
const removeFromCart = (productId) => {
  const itemIndex = cart.findIndex((item) => item.id === productId);
  if (itemIndex > -1) {
    cart.splice(itemIndex, 1);
    updateCartDisplay();
    saveCartToLocalStorage();
  }
};

// Clear cart
const clearCart = () => {
  cart.length = 0; // Clear the cart array
  updateCartDisplay();
  saveCartToLocalStorage();
};

// Toggle cart modal
const toggleCartModal = () => {
  cartModal.classList.toggle("open");
  cartOverlay.classList.toggle("open");
};

// Save cart to localStorage
const saveCartToLocalStorage = () => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Load cart from localStorage
const loadCartFromLocalStorage = () => {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  if (savedCart) {
    savedCart.forEach((item) => cart.push(item));
    updateCartDisplay();
  }
};

// Render products on page load
renderProducts();
loadCartFromLocalStorage();




