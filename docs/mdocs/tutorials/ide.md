---
layout: docs
title: Using Scalismo in an IDE
section: "tutorials"
---

# Using Scalismo in an IDE

 

## The Environment

Our environment should run on the most common platforms (Linux, Windows and OSX). The minimal need is a **64-bit JDK**.

 Additionally we need the build tool **sbt**. This would be enough, but for convenience we propose to install also a **git** client and the **Intellij IDEA**.

### Installation

Please install the following tools:

| Tool          | Download Link                               | Test command (will be executed in the next step of the tutorial) |
| ------------- | ------------------------------------------- | ------------------------------------------------------------ |
| JDK 64-bit    | [all OS](https://openjdk.java.net/install/) | `java -version`                                              |
| git           | [all OS](https://git-scm.com/)              | `git --version`                                              |
| sbt           | [all OS](http://www.scala-sbt.org/)         | `sbt sbt-version`                                            |
| Intellij IDEA | [all OS](https://www.jetbrains.com/idea/)   | *(first start later in this tutorial)*                       |

 

## First Steps: Getting the seed project

In this step we provide you with a small "Hello World" example project. First, we download the project, then we run it from the command line and set up the IDE for the later usage.

 

### JAVA - do i have the right version?

To test your java installation you can use the following command:

```bash
java -version
```

The output should look similar to the one below, with the version number changing according to the version you downloaded:


```bash
java version "1.8.0_131"
```

```
Java(TM) SE Runtime Environment (build 1.8.0_131-b11)
Java HotSpot(TM) 64-Bit Server VM (build 25.131-b11, mixed mode)
```

> *Note:* Make sure that your architecture is 64-Bit!

 

### Git - Get the project

Next, to check your installation of git enter the following on a command line.:



```bash
git --version
```

> *Note:* On windows you should have a program called **Git BASH** after the installation of git.

While the exact version does not matter, the output of the above command should be something as simple as:


```bash
git version 2.7.4
```

To get the project, we need to clone the repository using git. 

Alternatively you can download the project also from the seed [project's page](https://github.com/unibas-gravis/minimal-scalismo-seed). To download the project using git, change in the console to somewhere where you want the new project to be added. The cloning of the project creates a new folder in the directory where you execute the command. You can now get the project with the following command:


```bash
git clone https://github.com/unibas-gravis/minimal-scalismo-seed.git
```

The IDE we use supports git. So we do not need to know more about the commandline usage of git. However, a good starting point to learn more about the commandline interface is the official [documentation](https://git-scm.com/doc).

 

### Sbt - Building from the command line

To check whether sbt is installed correctly execute:

```bash
sbt sbtVersion
```

Looking at the output you should see at the end of the output a line similar to:


```bash
[info] 1.0.4
```

Change in the console to the directory `minimal-scalismo-seed`. We will now run the project. This will trigger the project to be built by sbt. Note that the initial build will download some dependencies specific to the project. This may take a while. The command to run the project is:


```bash
sbt run
```

A successful run should display a Scalismo UI with a pink mean face.

Sbt is integrated in the IDE, so we will not explain more about the usage. If you want more information go to the official [documentation](http://www.scala-sbt.org/0.13/docs/index.html).

 

### IntelliJ Idea

Now it is time to start the IDE. What we need to make sure is that you enable the scala plugin. Then we will import the project.

When you start the IDE for the first time you can configure which parts are enabled and or downloaded. 

We recommend to go with the default settings as long as you have enough disk space. Go through the dialog step by step until you encounter the point **Featured Plugins**. Then select to install the **Scala Plugin**.

 
If you have already used the IDE but have not yet installed  the Scala plugin, you can enable it through the menu **File**/**Settings**/**Plugins**
 

When the scala plugin is installed and you get displayed the welcome screen, choose **File->New->Project From Existing Sources**. Then navigate to the folder containing the seed project directory.

In the next dialog select the option: **Import project from external model** and select **sbt** as a model.

In the next dialog check that the **Project SDK** points to the location where you installed the Java SDK. If the checkbox **auto import** is shown, activate it. Then continue by clicking onto the **Finish** button.

 
Now the IDE should change and display the project. When you start the IDE for the first time, there is a lot of processing that is done in the background. In the bottom right you can spot an indication for the ongoing work. Due to the workload it may take a while until the IDE reacts responsive.

To see what is already present in the project hit **[Alt+1]** which should display the project structure tab to the left. If you do not see the project structure, then have a look at the top of the newly opened view. There should be a drop down list where you can select **Project**. You should then be able to navigate through the project folder to `minimal-scalismo-seed/src/main/scala/com/example/` and double-click **ExampleApp**. This will open the code of the application we have already executed before from the console using sbt.

To execute the file from within the IDE right-click the source file and select **Run 'ExampleApp'**. Alternatively you can use the shortcut which is marked after the menu entry. Depending on your setting it might be  **[Ctrl+Shift+F10]**.
