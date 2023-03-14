# scalismo.github.com 

Code for generating the scalismo website, using the awesome [Docusaurus](https://v2.docusaurus.io/).

#### Building the docs

Navigate to the directory ```website``. 
* Testing: ```npm start```
* Building the page  ```npm run build```
* deploy: ```GIT_USER=USERNAME USE_SSH=true npx docusaurus deploy```

Note that the tutorials and corresponding Scala files are generated by 
running the scala program ```Main.scala``` (which can be run with ```sbt run```).
To change the content of the tutorials, 
edit the files in the directory ```docs/mdocs``. 


For more details go to the excellent [Docusaurus Documentation](https://v2.docusaurus.io/docs/).

