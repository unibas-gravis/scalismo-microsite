import microsites.ExtraMdFileConfig


organization  := "ch.unibas.cs.gravis"

name := """scalismo-website"""
version       := "0.16.0"

scalaVersion  := "2.12.8"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

resolvers += Resolver.bintrayRepo("unibas-gravis", "maven")

resolvers += Opts.resolver.sonatypeSnapshots


libraryDependencies  ++= Seq(
            "ch.unibas.cs.gravis" % "scalismo-native-all" % "4.0.0",
            "ch.unibas.cs.gravis" %% "scalismo-ui" % "0.13.1"
)

lazy val root = (project in file("."))



lazy val docs = project       // new documentation project
  .in(file("myproject-docs"))
  .settings(
    mdocIn := new java.io.File("docs/mdocs/"),
    mdocOut := new java.io.File("docs/")
  )
  .dependsOn(root)
  .enablePlugins(MdocPlugin)

lazy val microsite = project
  .in(file("site"))
  .dependsOn(root)
  .enablePlugins(MicrositesPlugin)
  //.settings(commonSettings)
  .settings(
    micrositeName := "scalismo",
    micrositeDescription := "Scalismo - Scalable Image Analysis and Shape Modelling ",
    micrositeGithubOwner := "marcelluethi",
    micrositeGithubRepo := "scalismo.github.io",
    //micrositePushSiteWith := GitHub4s,
      micrositeAuthor := "University of Basel",
    //micrositeBaseUrl := "https://scalismo.org",
    micrositeDocumentationUrl := "http://unibas-gravis.github.io/scalismo/latest/api/index.html",
    micrositeDocumentationLabelDescription := "API Documentation",

    //micrositeOrganizationHomepage := "https://gravis.dmi.unibas.ch",
    micrositeCompilingDocsTool := WithMdoc,
     mdocIn := new java.io.File("docs/mdocs/"),
     //micrositeExtraMdFiles := Map()

  )
  