const logoutBtn = document.getElementById("logoutBtn");
const Container = document.getElementById("productsContainer");
const titleInput = document.getElementById("title");
const imageInput = document.getElementById("image");
const priceInput = document.getElementById("price");
const descriptionInput = document.getElementById("description");
const productsLength = document.getElementById("productsLength");
const addProductBtn = document.querySelector(".newProduct form button");
const token = localStorage.getItem("token");

if (!token) {
  window.location.replace("./login.html");
}

// Handle logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.replace("./login.html");
});

let products = JSON.parse(localStorage.getItem("products")) || [];

function updateProductsLength() {
  productsLength.innerHTML = `Number of products: ${products.length}`;
  console.log(`Products length updated to: ${products.length}`);
}

addProductBtn.addEventListener("click", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const image = imageInput.value.trim();
  const price = parseFloat(priceInput.value.trim());
  const description = descriptionInput.value.trim();

  if (!title || !image || isNaN(price) || !description) {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Please fill in all the required fields.",
    });
    return;
  }

  const newProduct = {
    id: products.length + 1,
    title,
    image,
    price,
    description,
  };

  products.push(newProduct);
  localStorage.setItem("products", JSON.stringify(products));
  displayProduct(newProduct);
  clearInputs();

  Swal.fire({
    title: "Product Added!",
    text: "The new product has been added to the list.",
    icon: "success",
    confirmButtonText: "OK",
  });

  updateProductsLength();
});

function displayProducts() {
  Container.innerHTML = "";

  products.forEach((product) => {
    displayProduct(product);
  });

  updateProductsLength();
}

function displayProduct(product) {
  const productElement = document.createElement("div");
  productElement.classList.add("product");
  productElement.setAttribute("data-id", product.id);

  productElement.innerHTML = `
    <img class='image' src="${product.image}" alt="${product.title}">
    <h3 class='title'>${product.title}</h3>
    <p class='price'>Price: $${product.price}</p>
    <p class='description'>${product.description}</p>
    <button class="deleteButton" type='button'>Delete Product - ${product.id}</button>
  `;

  Container.appendChild(productElement);
}

function clearInputs() {
  titleInput.value = "";
  imageInput.value = "";
  priceInput.value = "";
  descriptionInput.value = "";
}

function deleteProduct(productId) {
  products = products.filter((product) => product.id !== productId);
  localStorage.setItem("products", JSON.stringify(products));
  displayProducts();

  Swal.fire({
    title: "Product Deleted!",
    text: `The product ${productId} has been removed from the list.`,
    icon: "success",
    confirmButtonText: "OK",
  });

  updateProductsLength();
}

function openProductModal(productElement) {
  const modal = document.getElementById("productModal");
  const modalContent = document.getElementById("modalContent");
  const closeButton = document.querySelector(".close-button");

  const product = {
    image: productElement.querySelector(".image").src,
    title: productElement.querySelector(".title").textContent,
    price: productElement.querySelector(".price").textContent,
    description: productElement.querySelector(".description").textContent,
  };

  modalContent.innerHTML = `
    <img src="${product.image}" alt="${product.title}">
    <h3>${product.title}</h3>
    <p>${product.price}</p>
    <p>${product.description}</p>
  `;

  modal.style.display = "block";

  closeButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
}

Container.addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteButton")) {
    const productId = parseInt(
      event.target.closest(".product").getAttribute("data-id")
    );
    deleteProduct(productId);
  } else if (event.target.closest(".product")) {
    openProductModal(event.target.closest(".product"));
  }
});

document.addEventListener("DOMContentLoaded", displayProducts);
