// Helper Methods
const ce = (tag) => document.createElement(tag)
const qs = (selector) => document.querySelector(selector)
// Variable Helpers
const booksUrl = 'http://localhost:3000/books/'
const list = qs('#list')
const showPanel = qs('#show-panel')
const currentUser = {
  "id": 1,
  "username": "pouros"
}

async function getBooks() {
  const response = await fetch(booksUrl)
  const books = await response.json()
  renderBooks(books)
}

const renderBooks = (books) => {
  for (const book of books) {
    renderBook(book)
  }
}

const renderBook = (book) => {
  const li = ce('li')
  const br = ce('br')
  li.dataset.bookId = book.id
  li.innerText = book.title
  list.append(li, br)
}

const addClickHandler = () => {
  list.addEventListener('click', e => {
    if (e.target.matches('li')) {
      getBook(e.target.dataset.bookId)
    }
  })
  showPanel.addEventListener('click', e => {
    if (e.target.matches('button')) {
      const bookId = e.target.id
      updateLikes(bookId)
    }
  })
}

async function getBook(bookId) {
  const response = await fetch(booksUrl + bookId)
  const book = await response.json()
  renderSelectedBook(book)
}

const renderSelectedBook = (book) => {
  showPanel.innerHTML = ""
  const pic = ce('img')
  pic.src = book.img_url

  const subtitle = ce('h3')
  subtitle.innerText = book.subtitle

  const author = ce('h3')
  author.innerText = book.author

  const description = ce('p')
  description.innerText = book.description

  const ul = ce('ul')

  const button = ce('button')
  button.innerText = 'Like'
  button.id = book.id

  showPanel.append(pic, subtitle, author, description, ul, button)
  addLikers(ul, book)
}

const addLikers = (ul, book) => {
  for (const user of book.users) {
    addLiker(ul, user)
  }
}

const addLiker = (ul, user) => {
  const li = ce('li')
  li.textContent = user.username
  li.dataset.id = user.id
  ul.append(li)
}

//needs drying, but works
const updateLikes = (bookId) => {
  fetch(booksUrl + bookId)
    .then(response => response.json())
    .then((book) => {
      let currentUser = {
        id: 1,
        username: "pouros"
      }
      let bookLikers = book.users
      let bookLikersArr = Array.from(bookLikers)
      bookLikersArr.push(currentUser)
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          users: bookLikersArr
        })
      }
      fetch(booksUrl + bookId, options)
        .then(response => response.json())
        .then(renderSelectedBook)
    })
}

addClickHandler()
getBooks()