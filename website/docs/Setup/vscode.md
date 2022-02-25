---
id: vscode
title: Using Scalismo with scala-cli and vscode 
---

# Using Scalismo with scala-cli and VSCode

In this article we describe how to set up Scalismo, such that it can be used to program shape modelling applications using [VSCode](https://code.visualstudio.com/) as an editor.
This is the recommended setup to get started with developing in Scalismo. It is powerful, but still relatively light-weight, compared to using a full blown IDE such as IntelliJ IDEA.

## Install VSCode

[Download](https://code.visualstudio.com/Download) and install VSCode as described
in the [official documentation](https://code.visualstudio.com/docs/setup/setup-overview).


## Install Scala-CLi
Install [Scala-CLI](https://scala-cli.virtuslab.org/) by following the 
[Installation guide](https://scala-cli.virtuslab.org/install) for your operating system. 


## MacOS only: Install an older JVM

On MacOS, there is a bug in some of the base libraries that Scalismo-UI is using for visualization, which causes Scalismo-UI to crash on startup. To successfully run Scalismo-UI for visualization, we therefore have to install an older version of the JVM. 
The Zulu JDK 11.0.9 is known to work on both M1 and intel versions of Macs. An installable package for MacOS can be downloaded from [here](https://cdn.azul.com/zulu/bin/zulu11.43.21-ca-fx-jdk11.0.9-macosx_x64.dmg). Please install this JVM and make sure you use it for all the future steps. You can test if the correct JVM is used by typing 
```
java -version
```
in a terminal, which should show a line like:
```
openjdk version "11.0.9"2020-10-20 LTS"
```
If another version is shown, you might have to set the environment variables ```PATH``` and ```JAVA_HOME``` accordingly. 

## Running the first Scalismo program

Now we are ready to run our first program. 
Open an editor and create a file ```HelloScalismo.scala``` with the following content:
```scala
//> using scala "2.13"
//> using lib "ch.unibas.cs.gravis::scalismo-ui:0.90.0"

import scalismo.ui.api.ScalismoUI

object HelloScalismo extends App {
    ScalismoUI()
}
```

You can run the program, by calling 
```
scala-cli run HelloScalismo.scala
```

On MacOS, you might have to call instead 
```
scala-cli --jvm system run HelloScalismo.scala
```
in order to instruct `scala-cli` to use the system JVM that you installed before. 

If it runs successfully, you should see the following window appearing
![scalismo-ui](images/scalismo-ui-empty.png)



## Setting up VSCode as an IDE

To setup the necessary environment for using VSCode as an ide, the following command can be used. 
```
scala-cli setup-ide .
```
or on MacOS
```
scala-cli setup-ide --jvm system 
```

After starting vscode with the command 
```
code . 
```
(or by starting it from the start menu and choosing *File->Open Folder...*), 
VSCode should appear with the project correctly configured. 
After successful initialization run buttons should appear, with which you can start 
the project.

*On MacOS it might happen that the program crashes when starting it using the run 
buttons. In this case the JVM is not correctly configured. An easy workaround is 
to open a terminal (from within VS Code) and use 
```scala