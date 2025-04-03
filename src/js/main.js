"use strict";

// SECCIÓN QUERY SELECTOR

const book = document.querySelector(".js_book");
const countList = document.querySelector(".js_count");
const saveButton = document.querySelector(".js_save");
const restoreButton = document.querySelector(".js_restore");
const deleteButton = document.querySelector(".js_delete");
const form = document.querySelector(".js_form");
const searchInput = document.querySelector(".js_search");
const btnSearch = document.querySelector(".js_btnSearch");

//ARRAYS

let allBooks = [];
let bookCount = 0;

// SECCIÓN DE LAS FUNCIONES

const renderOneBooks = (booksObj) => {
  return `
        <li class="js_booksList book_list ${
          booksObj.added ? "selected " : ""
        }" data-id="${booksObj.id}">
            <img class="book_image" src="${booksObj.cover_image}" alt="${
    booksObj.name
  }"/>
            <h2 class="book_name">${booksObj.name}</h2> 
            <h4 class="book_author">${booksObj.author}</h4> 
            <button class="js_book_button icon">${
              booksObj.added ? "X" : "🛒"
            }</button>
        </li>`;
};

const renderAllBooks = (booksArray) => {
  let html = "";
  booksArray.forEach((book) => {
    html += renderOneBooks(book);
  });

  book.innerHTML = html;

  // Añadimos evento al botón de dentro de cada libro, para añadir o elimiar del carrito

  const cartButtons = document.querySelectorAll(".js_book_button");
  cartButtons.forEach((button) => {
    button.addEventListener("click", handleCount);
  });
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

    renderAllBooks(savedBooks);

    if (form) {
      form.classList.add("hidden");
    }
    const book = document
      .querySelector(".js_book_div")
      .classList.add("divBooks");
  }
};

// Borrar cuentos guardados en localstorage

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

// EVENTOS

restoreButton.addEventListener("click", restoreCart);

saveButton.addEventListener("click", saveCart);

deleteButton.addEventListener("click", deleteCart);

// Evento al hacer clic en el botón de búsqueda

btnSearch.addEventListener("click", (ev) => {
  ev.preventDefault();
});

// FILTRADO POR TITULO

const filterBooks = () => {
  const searchText = searchInput.value.toLowerCase().trim(); // Obtiene y limpia el texto
  const filteredBooks = allBooks.filter((book) =>
    book.name.toLowerCase().includes(searchText)
  );
  renderAllBooks(filteredBooks); // Vuelve a mostrar solo los cuentos que coinciden
};

// Evento al escribir en el campo (filtrado en tiempo real)
searchInput.addEventListener("input", filterBooks);

// CUANDO CARGA LA PÁGINA

fetch("https://beta.adalab.es/resources/apis/books-v1/childrens-books.json")
  .then((response) => response.json())
  .then((data) => {
    allBooks = data.map((book, id) => ({
      id: book.id,
      name: book.name,
      author: book.author,
      cover_image:
        book.cover_image ||
        "https://static.vecteezy.com/system/resources/previews/007/517/574/large_2x/red-closed-book-school-collection-illustration-cartoon-style-on-a-white-background-vector.jpg",
      added: false,
    }));

    renderAllBooks(allBooks);
  });
