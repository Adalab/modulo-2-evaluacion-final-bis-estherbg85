"use strict";

// SECCIÓN QUERY SELECTOR

const book = document.querySelector(".js_book");
const countList = document.querySelector(".js_count");
const saveButton = document.querySelector(".js_save");
const restoreButton = document.querySelector(".js_restore");
const deleteButton = document.querySelector(".js_delete");
const deleteForm = document.querySelector(".js_formDelete");
const form = document.querySelector(".js_form");

//ARRAYS

let allBooks = [];
let bookCount = 0;

// SECCIÓN DE LAS FUNCIONES

const renderOneBooks = (booksObj) => {
  return `
        <li class="js_booksList book_list ${
          booksObj.added ? "selected" : ""
        }" data-id="${booksObj.id}">
            <img class="book_image" src="${booksObj.cover_image}" alt="${
    booksObj.name
  }"/>
            <h2 class="book_name">${booksObj.name}</h2> 
            <h4 class="book_author">${booksObj.author}</h4> 
            <button class="book_button">${
              booksObj.added ? "X Delete" : "🛒 Add"
            }</button>
        </li>`;
};

const renderAllBooks = (booksArray) => {
  let html = "";
  booksArray.forEach((book) => {
    html += renderOneBooks(book);
  });

  book.innerHTML = html;

  const cartButtons = document.querySelectorAll(".book_button");
  cartButtons.forEach((button) => {
    button.addEventListener("click", handleCount);
  });

  // Actualizar el contador del carrito
  updateCountList();
};

// Manejar clic en el botón de "Añadir al carrito"
const handleCount = (ev) => {
  const clickedId = parseInt(
    ev.currentTarget.closest("li").getAttribute("data-id")
  );
  const clickedBook = allBooks.find((book) => book.id === clickedId);

  // Verificar si el libro ya está en el carrito
  if (clickedBook) {
    if (!clickedBook.added) {
      clickedBook.added = true;
      bookCount++; // Aumentar el contador
    } else {
      clickedBook.added = false;
      bookCount--; // Disminuir el contador
    }
    // Volver a renderizar los libros
    renderAllBooks(allBooks);
  }
};

// Actualizar el contador de libros en el carrito

const updateCountList = () => {
  const countList = document.querySelector(".js_count");

  countList.textContent = bookCount; // Mostrar el número de libros en el carrito
};

// GUARDAR CARRITO EN LOCALSTORAGE CON LOS LIBROS SELECCIONADOS

const saveCart = () => {
  const selectedBooks = allBooks.filter((book) => book.added); // Filtrar solo los seleccionados
  localStorage.setItem("savedCart", JSON.stringify(selectedBooks));
};
const restoreCart = () => {
  const savedBooks = JSON.parse(localStorage.getItem("savedCart")); // Obtener los libros guardados

  if (savedBooks && savedBooks.length > 0) {
    bookCount = savedBooks.length; // Actualizar el contador

    renderAllBooks(savedBooks); // Renderizar solo los libros guardados

    if (form) {
      form.classList.add("hidden");
    }
    const book = document
      .querySelector(".js_book_div")
      .classList.add("divBooks");
  }
};

const deleteCart = () => {
  localStorage.removeItem("savedCart");
  bookCount = 0;

  allBooks.forEach((book) => {
    book.added = false;
  });

  form.classList.remove("hidden");

  const book = document
    .querySelector(".js_book_div")
    .classList.remove("divBooks");
  renderAllBooks(allBooks);
};

// Agregar el evento al botón de "Restaurar"
restoreButton.addEventListener("click", restoreCart);

saveButton.addEventListener("click", saveCart);

deleteButton.addEventListener("click", deleteCart);

deleteForm.addEventListener("click", (ev) => {
  ev.preventDefault();
});

// CUANDO CARGA LA PÁGINA

fetch("http://beta.adalab.es/resources/apis/books-v1/childrens-books.json")
  .then((response) => response.json())
  .then((data) => {
    allBooks = data.map((book, id) => ({
      id: book.id,
      name: book.name,
      author: book.author,
      cover_image: book.cover_image,
      added: false,
    }));
    allBooks.forEach((element) => {
      if (element.cover_image === null) {
        element.cover_image =
          "https://static.vecteezy.com/system/resources/previews/007/517/574/large_2x/red-closed-book-school-collection-illustration-cartoon-style-on-a-white-background-vector.jpg";
      }
    });

    renderAllBooks(allBooks);
  });
