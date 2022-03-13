
organization  := "ch.unibas.cs.gravis"

name := """scalismo-website"""
version       := "0.90"

fork := true

scalaVersion  := "3.1.0"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")


resolvers += Opts.resolver.sonatypeSnapshots
resolvers += Opts.resolver.sonatypeReleases

libraryDependencies  ++= Seq(
            "ch.unibas.cs.gravis" % "scalismo-native-all" % "4.0.1",
            "ch.unibas.cs.gravis" %% "scalismo-ui" % "develop-22afb09cd8110af0fcd27d0bb497240c0a53db41-SNAPSHOT",
            "dev.zio" %% "zio" % "2.0.0-RC2",
            "dev.zio" %% "zio-test" % "2.0.0-RC2" % "test",
            "dev.zio" %% "zio-test-sbt" % "2.0.0-RC2" % "test",
            ("org.scalameta" %% "scalafmt-dynamic" % "3.4.3").cross(CrossVersion.for3Use2_13)
)

dependencyOverrides ++= Seq(
     "ch.unibas.cs.gravis" %% "scalismo" % "develop-fc2a6c18993446ca6200f3b580db0f6d3f14efb7-SNAPSHOT", 
)
lazy val root = (project in file("."))

  