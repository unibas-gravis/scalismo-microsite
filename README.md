# scalismo.github.com 

Code for generating the scalismo website, using the awesome [sbt-microsite](https://47deg.github.io/sbt-microsites/).

#### Trying it out locally

To deploy it locally, do the following:

* Comment out the sbt setting ```micrositeBaseUrl```
* Install jekyll (see this guide [details](https://47deg.github.io/sbt-microsites/docs/))
* Start sbt
* From SBT, call ```microsite/makeMicrosite```
* Change to directory ```site/target/jekyll```
* Run ```jekyll serve```

Open ```127.0.0.1:4000``` to see the webpage.

*Hint, (re-)move the tutorial files in ```docs/mdocs/tutorials/``` while working on the layout, to 
speed up building of the website*. 
      
      
#### Making changes

To see how the webpage can be customized and adapted, check out the documentation for [sbt-microsite](https://47deg.github.io/sbt-microsites/).
