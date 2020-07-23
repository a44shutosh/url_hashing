# urlHashing Hashing url#

It's a small demostration of how any url hashing system need to be build.

#Note
it's of basic level just to give idea of how url hashing works. It can be used as a base to create whole url hashing system

### Highlights

Technologyy used Node.js
Database used mysql

#explanation
I have created 2 APIs

1.  create short url and insert it mysql if url is already there return the same shortlink
2.  get paremt url api which returns the parent url hwne this api is called with shorturl

### Installation
npm install;


### Testing
Cases Tested
1. For createUrl API
  1.1 Blank url : validation error we get
  1.2 correct url passed : url returned
  1.3 previous inserted url : same shortLink returned
2. For getParentUrl API
   1.1 with correct shortlink : url returned
   1.2 with blank url : Invalid Request
   1.3 incorrect url : no data data  

### Known Issue
Nothing at the moment :)

## Contributors

 0. Ashutosh
