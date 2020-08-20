# Node Store API
 
Node Store API This NodeJs API was build along the course "Construindo APIs com NodeJs" in balta.io portal in there was explained some basics API funcionalities like a CRUD for Users, Products, Orders, generate and refresh Json Web Token, user permissions and access privilegies was inplemented.  


# Install

    $ git clone https://github.com/Kleciosilva/criando_apis.git  
    $ cd criando_apis  
    $ npm install  
    $ npm start  
  
  Then should be running in 3000's port.  

## Course Details  

"Criando APIs com Node"  
Link: http://balta.io.  

### Course Content overview:  
  - Node (offcorse!!! rsrsrs)
  - Express
  - MogoDB/Mongoose
  - MCV Design Patern
  - Repository Patern
  - Validation / Route intercept
  - Jason Web Token (JWT)
  - Azure Deploy

## The Project

Online API: https://ksnodestr.azurewebsites.net/  

Test user:  
email: kleciosilvajp@gmail.com  
password: klecio

## Routes Overview:  
  OBS:  
    - You must authenticate first;  
    - Input data must be in the request body

## API Routes
  - Authenticate:  
  Route: {URL}/customers/authenticate,  
    Method: POST,  
    Input data:  
    {  
      "email": String !required,  
      "password": String !required  
    }  
  Return:  String 

  - CUSTOMER  
    - List  
      Route: {URL}/customers,  
      Method: GET,  
      Input data:  NONE,
      Return:  JSON Array string  

    - Create  
      Route: {URL}/customers,  
      Method: POST,  
      Input data:  
      {  
        "token": String !required,
        "name": String (> 2 char) !required,
        "email": String (> 2 char) !required,  
        "password": String (> 5 char) !required,  
        "roles": Array of String [('user', !default) 'admin']
      }  
      Return:  { "message" : String }  

  - Product  
    - List  
      Route: {URL}/products,  
      Method: GET,  
      Input data:  NONE,
      Return:  JSON Array string  
    
    - Get by ID
      Route: {URL}/products/admin/{ID}
      Method: GET,  
      Return:  JSON string  

    - Get by Slug
      Route: {URL}/products/{slug}
      Method: GET,  
      Return:  JSON string  

    - Create  
      Route: {URL}/products,  
      Method: POST,  
      Input data:  
      {  
        "token": String !required,
        "title": String (> 2 char) !required,
        "slug": String (> 2 char) !required,  
        "description": String (> 2 char) !required,  
        "price": Number !required,  
        "active": Boolean,  
        "tags": Array of String ex: ['promo', 'fashion'],  
        "image": String Base64 image !required,  
      } 
      Return:  { "message" : String }  
      OBS: user's token must be admin
    
    - Update  
      Route: {URL}/products/{ID},  
      Method: PUT,  
      Input data:  
      {  
        "token": String !required,
        "title": String (> 2 char),
        "slug": String (> 2 char),  
        "description": String (> 2 char),  
        "price": Number,  
        "tags": Array of String ['user', 'admin'],  

        "title": "Cadeira Gammer",
        "description": "Cadeira Gammer",
        "slug": "cadeira-gammer",
        "price": 399,
        "active": true,
        "tags": ["cadeira", "gammer", "informatica"]
      } 
      Return:  { "message" : String }  
      OBS: user's token must be admin
        
    - Delete 
      Route: {URL}/products/,  
      Method: PUT,  
      Input data:  
      {  
        "token": String !required,
        "id": Number
      } 
      Return:  { "message" : String } 
      OBS: user's token must be admin

  - Order
    - List  
      Route: {URL}/orders,  
      Method: GET,  
      Input data:  
        {  
          "token": String !required,
          "id": Number
        } 
      Return:  JSON Array string  
      OBS: user's token must be admin
  
  - Create  
      Route: {URL}/products,  
      Method: POST,  
      Input data:  
      {
        "items": Json Array string ex: "[
            {
              "quantity": Number !required, 
              "price": Number !required, 
              "product": String !required
            }
        ]"
    }