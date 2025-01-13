### UserController

| HTTP Method | URL                                      | Description                               | Request Body / Parameters                                     |
| ----------- | ---------------------------------------- | ----------------------------------------- | ------------------------------------------------------------- |
| **GET**     | `/api/users/info`                        | Login and get user info (except password) | `LoginRequest` (Request Body)                                 |
| **POST**    | `/api/users/register`                    | Register a new user                       | `User` (Request Body)                                         |
| **PUT**     | `/api/users/update`                      | Update a user's information               | `UpdateRequest` (Request Body)                                |
| **PUT**     | `/api/users/shelf-groups/{shelfGroupId}` | Add a shelf group to the user             | `loginRequest` (Request Body), `shelfGroupId` (Path Variable) |
| **DELETE**  | `/api/users/delete`                      | Delete a user                             | `LoginRequest` (Request Body)                                 |

---

### ShelfGroupController

| HTTP Method | URL                                                  | Description                    | Request Body / Parameters                                     |
| ----------- | ---------------------------------------------------- | ------------------------------ | ------------------------------------------------------------- |
| **GET**     | `/api/shelf-groups/{id}`                             | Get a shelf group by its ID    | `id` (Path Variable)                                          |
| **GET**     | `/api/shelf-groups/{shelfGroupId}/shelves/`          | Get shelf IDs in a shelf group | `shelfGroupId` (Path Variable)                                |
| **POST**    | `/api/shelf-groups`                                  | Create a new shelf group       | `ShelfGroup` (Request Body)                                   |
| **PUT**     | `/api/shelf-groups/{shelfGroupId}/users/`            | Add a user to a shelf group    | `shelfGroupId` (Path Variable), `LoginRequest` (Request Body) |
| **PUT**     | `/api/shelf-groups/{shelfGroupId}/shelves/{shelfId}` | Add a shelf to a shelf group   | `shelfGroupId`, `shelfId` (Path Variables)                    |
| **PUT**     | `/api/shelf-groups/{id}`                             | Update a shelf group by its ID | `id` (Path Variable), `ShelfGroup` (Request Body)             |
| **DELETE**  | `/api/shelf-groups/{id}`                             | Delete a shelf group by its ID | `id` (Path Variable)                                          |

---

### ShelfController

| HTTP Method | URL                                     | Description              | Request Body / Parameters                    |
| ----------- | --------------------------------------- | ------------------------ | -------------------------------------------- |
| **GET**     | `/api/shelves/{id}`                     | Get a shelf by its ID    | `id` (Path Variable)                         |
| **POST**    | `/api/shelves`                          | Create a new shelf       | `Shelf` (Request Body)                       |
| **PUT**     | `/api/shelves/{shelfId}/books/{bookId}` | Add a book to a shelf    | `shelfId`, `bookId` (Path Variables)         |
| **PUT**     | `/api/shelves/{id}`                     | Update a shelf by its ID | `id` (Path Variable), `Shelf` (Request Body) |
| **DELETE**  | `/api/shelves/{id}`                     | Delete a shelf by its ID | `id` (Path Variable)                         |

---

### BookController

| HTTP Method | URL                          | Description                             | Request Body / Parameters                   |
| ----------- | ---------------------------- | --------------------------------------- | ------------------------------------------- |
| **GET**     | `/api/books/{id}`            | Get a book by its ID                    | `id` (Path Variable)                        |
| **GET**     | `/api/books/shelf/{shelfId}` | Get books by a shelf ID                 | `shelfId` (Path Variable)                   |
| **GET**     | `/api/books/search`          | Search books by keyword and shelf group | `SearchRequest` (Request Body)              |
| **POST**    | `/api/books`                 | Add a new book                          | `Book` (Request Body)                       |
| **PUT**     | `/api/books/{id}`            | Update a book by its ID                 | `id` (Path Variable), `Book` (Request Body) |
| **DELETE**  | `/api/books/{id}`            | Delete a book by its ID                 | `id` (Path Variable)                        |

---