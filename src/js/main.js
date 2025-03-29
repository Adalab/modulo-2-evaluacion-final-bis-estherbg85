"use strict";

// SECCIÓN QUERY SELECTOR

const booksUl = document.querySelector(".js_booksUl");

// SECCIÓN DE LAS FUNCIONES

const renderOneBooks = (booksObj) => {
  return `
        <li class="js_books books">
            <img class="books_img" src="${booksObj.cover_image}" alt="${booksObj.name}"/>
            <h2 class="books_name">${booksObj.name}</h2> 
            <h4 class="books_author">${booksObj.author}</h4> 
        </li>`;
};

const renderAllBooks = (booksArray) => {
  let html = "";
  booksArray.forEach((book) => {
    html += renderOneBooks(book);
  });

  booksUl.innerHTML = html;
};

// CUANDO CARGA LA PÁGINA

fetch("http://beta.adalab.es/resources/apis/books-v1/childrens-books.json")
  .then((response) => response.json())
  .then((data) => {
    const allBooks = data;
    console.log(allBooks);
    renderAllBooks(allBooks);
  });
