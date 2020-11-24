
organization  := "ch.unibas.cs.gravis"

name := """scalismo-website"""
version       := "0.90-RC2"

fork := true

scalaVersion  := "2.12.10"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")

resolvers += Resolver.bintrayRepo("unibas-gravis", "maven")

resolvers += Opts.resolver.sonatypeSnapshots


libraryDependencies  ++= Seq(
            "ch.unibas.cs.gravis" % "scalismo-native-all" % "4.0.0",
            "ch.unibas.cs.gravis" %% "scalismo-ui" % "0.90-RC2"
)

lazy val root = (project in file("."))

lazy val docs = project       // new documentation project
  .in(file("myproject-docs"))
  .settings(
    mdocIn := new java.io.File("docs/mdocs/"),
    mdocOut := new java.io.File("website/docs")
  )
  .dependsOn(root)
  .enablePlugins(MdocPlugin)
