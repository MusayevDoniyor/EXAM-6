document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const container = document.getElementById("productsContainer");
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

  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.replace("./login.html");
  });

  let products = JSON.parse(localStorage.getItem("products")) || [];
  let editProductId = null;

  function updateProductsLength() {
    productsLength.textContent = `Number of products: ${products.length}`;
    console.log(`Products length updated to: ${products.length}`);
  }

  addProductBtn.addEventListener("click", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const image = imageInput.files[0];
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

    const reader = new FileReader();
    reader.onload = (e) => {
      if (editProductId) {
        updateProduct(e.target.result);
      } else {
        addNewProduct(e.target.result);
      }
      clearInputs();
    };
    reader.readAsDataURL(image);
  });

  function addNewProduct(imageSrc) {
    const newProduct = {
      id: products.length + 1,
      title: titleInput.value.trim(),
      image: imageSrc,
      price: parseFloat(priceInput.value.trim()),
      description: descriptionInput.value.trim(),
    };

    products.push(newProduct);
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();

    Swal.fire({
      title: "Product Added!",
      text: "The new product has been added to the list.",
      icon: "success",
      confirmButtonText: "OK",
    });

    updateProductsLength();
  }

  function updateProduct(imageSrc) {
    products = products.map((product) => {
      if (product.id === editProductId) {
        return {
          ...product,
          title: titleInput.value.trim(),
          image: imageSrc,
          price: parseFloat(priceInput.value.trim()),
          description: descriptionInput.value.trim(),
        };
      }
      return product;
    });

    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();

    Swal.fire({
      title: "Product Updated!",
      text: "The product has been updated successfully.",
      icon: "success",
      confirmButtonText: "OK",
    });

    editProductId = null;
  }

  function displayProducts() {
    container.innerHTML = "";
    products
      .map((product) => {
        const productElement = document.createElement("div");
        productElement.classList.add("product");
        productElement.setAttribute("data-id", product.id);

        productElement.innerHTML = `
          <img class='image' src="${product.image}" alt="${product.title}">
          <h3 class='title'>${product.title}</h3>
          <p class='price'>Price: $${product.price}</p>
          <p class='description'>${product.description}</p>
          <div id='productButtons'>
            <button class="deleteButton" type='button'>Delete Product - ${product.id}</button>
            <button class="editButton" type='button'>Edit Product - ${product.id}</button>
          </div>
        `;

        return productElement;
      })
      .forEach((productElement) => {
        container.appendChild(productElement);
      });

    updateProductsLength();
  }

  function clearInputs() {
    titleInput.value = "";
    imageInput.value = "";
    priceInput.value = "";
    descriptionInput.value = "";
  }

  function deleteProduct(productId) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        products = products.filter((product) => product.id !== productId);
        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();

        Swal.fire({
          title: "Deleted!",
          text: `The product ${productId} has been removed from the list.`,
          icon: "success",
        });

        updateProductsLength();
      }
    });
  }

  function openEditModal(product) {
    const modal = document.getElementById("editModal");
    const editTitle = document.getElementById("editTitle");
    const editImage = document.getElementById("editImage");
    const editPrice = document.getElementById("editPrice");
    const editDescription = document.getElementById("editDescription");
    const saveEditBtn = document.getElementById("saveEditBtn");
    const closeButton = modal.querySelector(".close-button");

    editTitle.value = product.title;
    editPrice.value = product.price;
    editDescription.value = product.description;

    modal.style.display = "block";

    saveEditBtn.onclick = () => {
      const newTitle = editTitle.value.trim();
      const newImage = editImage.files[0];
      const newPrice = parseFloat(editPrice.value.trim());
      const newDescription = editDescription.value.trim();

      if (!newTitle || isNaN(newPrice) || !newDescription) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Please fill in all the required fields.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const productIndex = products.findIndex((p) => p.id === product.id);
        products[productIndex].title = newTitle;
        products[productIndex].price = newPrice;
        products[productIndex].description = newDescription;
        if (newImage) {
          products[productIndex].image = e.target.result;
        }

        localStorage.setItem("products", JSON.stringify(products));
        displayProducts();

        Swal.fire({
          title: "Product Updated!",
          text: "The product has been updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });

        modal.style.display = "none";
      };
      if (newImage) {
        reader.readAsDataURL(newImage);
      } else {
        reader.onload();
      }
    };

    closeButton.onclick = () => {
      let changesMade = false;

      if (editTitle.value.trim() !== product.title) changesMade = true;
      if (editPrice.value.trim() !== product.price.toString())
        changesMade = true;
      if (editDescription.value.trim() !== product.description)
        changesMade = true;
      if (editImage.files[0] && editImage.files[0] !== product.image)
        changesMade = true;

      if (changesMade) {
        Swal.fire({
          title: "Unsaved Changes",
          text: "Are you sure you want to close without saving changes?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Yes, close without saving",
          cancelButtonText: "Cancel",
        }).then((result) => {
          if (result.isConfirmed) {
            modal.style.display = "none";
          }
        });
      } else {
        modal.style.display = "none";
      }
    };
  }

  function editProduct(productId) {
    const product = products.find((product) => product.id === productId);

    if (product) {
      titleInput.value = product.title;
      priceInput.value = product.price;
      descriptionInput.value = product.description;
      editProductId = productId;
    }
  }

  function openProductModal(productElement) {
    const modal = document.getElementById("productModal");
    const modalContent = document.getElementById("modalContent");
    const productId = parseInt(productElement.getAttribute("data-id"), 10);
    const product = products.find((product) => product.id === productId);

    if (product) {
      modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <p>${product.description}</p>
      `;
      modal.style.display = "block";
    }

    const closeButton = modal.querySelector(".close-button");
    closeButton.onclick = () => {
      modal.style.display = "none";
    };
  }

  container.addEventListener("click", (event) => {
    const productElement = event.target.closest(".product");

    if (event.target.classList.contains("deleteButton")) {
      const productId = parseInt(productElement.getAttribute("data-id"), 10);
      deleteProduct(productId);
    } else if (event.target.classList.contains("editButton")) {
      const productId = parseInt(productElement.getAttribute("data-id"), 10);
      const product = products.find((p) => p.id === productId);
      openEditModal(product);
    } else if (event.target.classList.contains("image")) {
      openProductModal(productElement);
    }
  });

  displayProducts();
});
