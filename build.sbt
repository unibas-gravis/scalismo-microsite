
organization  := "ch.unibas.cs.gravis"

name := """scalismo-website"""
version       := "0.91"

fork := true

scalaVersion  := "3.1.0"

scalacOptions := Seq("-unchecked", "-deprecation", "-encoding", "utf8")


resolvers += Opts.resolver.sonatypeSnapshots
resolvers += Opts.resolver.sonatypeReleases

libraryDependencies  ++= Seq(
            "ch.unibas.cs.gravis" %% "scalismo-ui" % "0.91-RC3",
            "dev.zio" %% "zio" % "2.0.0-RC2",
            "dev.zio" %% "zio-test" % "2.0.0-RC2" % "test",
            "dev.zio" %% "zio-test-sbt" % "2.0.0-RC2" % "test",
            ("org.scalameta" %% "scalafmt-dynamic" % "3.4.3").cross(CrossVersion.for3Use2_13)
)

lazy val root = (project in file("."))

  