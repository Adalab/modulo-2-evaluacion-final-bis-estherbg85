"use strict";

// SECCIÓN QUERY SELECTOR

const book = document.querySelector(".js_book");
const countList = document.querySelector(".js_count");

//ARRAYS

let allBooks = [];
let bookCount = 0;

// SECCIÓN DE LAS FUNCIONES

const renderOneBooks = (booksObj, selected) => {
  return `
        <li class="js_booksList book_list ${
          booksObj.added ? "selected" : ""
        }" data-id="${booksObj.id}">
            <img class="book_image" src="${booksObj.cover_image}" alt="${
    booksObj.name
  }"/>
            <h2 class="book_name">${booksObj.name}</h2> 
            <h4 class="book_author">${booksObj.author}</h4> 
            <button class="cart_button">${
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

  const cartButtons = document.querySelectorAll(".cart_button");
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
/*
  const allBooksLi = document.querySelectorAll(".js_booksList");

  for (const li of allBooksLi) {
    li.addEventListener("click", handleCount);
  }
};

const handleCount = (ev) => {
  const clickedId = parseInt(ev.currentTarget.id);

  const clickedBooksObj = allBooks.find(
    (eachBooks) => eachBooks._id === clickedId
  );

  const countsIdx = bookCount.findIndex(
    (eachBooks) => eachBooks.id === clickedId
  );

  if (countsIdx === -1) {
    bookCount.push(clickedBooksObj);
    renderCountBooks();
  } else {
    bookCount.splice(countsIdx, 1);
  }
};

/*


  // Actualizar el contador del carrito
  updateCountList();
};

const toggleAddToCart = (bookId) => {
  const book = allBooks.find((b) => b.id === bookId); // Buscar el libro por su id
  if (book) {
    book.added = !book.added;

    // Actualizar el contador del carrito
    if (book.added) {
      bookCount++;
    } else {
      bookCount--;
    }

    renderAllBooks(allBooks);
  }
};

const updateCountList = () => {
  countList.textContent = bookCount;
};*/
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
        renderAllBooks(allBooks);
      }
    });
  });
