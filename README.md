# Vietnamese Cuisine Recipes Website

This project is a web application built using Express.js, MongoDB with Mongoose, Docker for containerization, npm for package management, and EJS (Embedded JavaScript) for dynamic views. The goal of this project is to provide a platform where users can explore and discover various traditional Vietnamese cuisine recipes.

![Vietnamese Cuisine Recipes](https://ibb.co/5xzKPfS)

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Docker](#docker)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse a collection of traditional Vietnamese cuisine recipes.
- View detailed recipe information, including ingredients and instructions.
- Search for recipes based on keywords or ingredients.
- Add new recipes to the database.
- Edit and update existing recipes.
- Delete recipes from the collection.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js: [Download & Install Node.js](https://nodejs.org/).
- MongoDB: [Download & Install MongoDB](https://www.mongodb.com/try/download/community).

## Getting Started

1. Clone this repository to your local machine or download the source code files.

2. Install project dependencies:
	```sh
	npm install
	```
3. Run the application:
	```sh
	npm start
	```
## Usage
1.  Open your web browser and navigate to `http://localhost:3000`. This will be the user page.
2.  Browse through the list of available Vietnamese cuisine recipes. 
3.  Click on a recipe to view its details, including ingredients and instructions.
4.  Use the search bar to find recipes based on keywords or ingredients or use the filter to find suitable recipes.
5.  To add a new recipe, go to Admin panel `http://localhost:3000/admin/add-dish` fill in the required information then click the submit button.
6.  To edit a recipe, in Admin panel, go to  "Quản lý món ăn" and click the "Sửa" button on the corresponding dish.
7.  To delete a recipe, click the "Xoá" button on the corresponding dish in the list.

## Docker
This project includes Docker support. To run the application using Docker, follow these steps:
1. Install Docker: [Download & Install Docker](https://docs.docker.com/get-docker/).
2.  Build the Docker image:
    
    ```sh
    docker build -t vietnamese-cuisine-app 
    ```
    
3.  Run the Docker container:
    ```sh   
    docker run -p 3000:3000 -d vietnamese-cuisine-app
    ```
## Technologies Used
-   Express.js: Web application framework for Node.js.
-   MongoDB with Mongoose: NoSQL database and Object Data Modeling (ODM) library.
-   EJS (Embedded JavaScript): Templating engine for generating dynamic HTML.
-   Docker: Containerization platform for application deployment.
-   npm: Package manager for managing project dependencies.
## Contributing

Contributions are welcome! If you have suggestions for improvements or encounter any issues, please [open an issue](https://chat.openai.com/link-to-issue) or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](https://chat.openai.com/LICENSE) file for details.