import java.io.File
import scala.util.Try
import scala.util.{Success, Failure}
import scala.io.Source
import zio._
import java.io.IOException
import mdtransform.{MarkdownProcessor, MarkdownDocument, ScalaCLIClass}
import java.nio.file.StandardCopyOption
import java.nio.file.Paths
import java.nio.file.Files

object Main extends zio.ZIOAppDefault {

  private final val scalafmtConfig = Paths.get(".scalafmt-mdoc.conf")

  def readMarkdownFile(file: File): zio.Task[MarkdownDocument] = {
    ZIO.attempt(MarkdownDocument(Source.fromFile(file).getLines.mkString("\n")))
  }

  private def writeTextFile(text: String, file: File): zio.Task[Unit] = {
    import java.io._
    ZIO.acquireReleaseWith(ZIO.succeed(new PrintWriter(file)))(pw =>ZIO.succeed(pw.close())){pw => 
      ZIO.succeed(pw.write(text))
    }
      
  }

  private def formatAndWriteScalaFile(
      scalaCode: String,
      fileToFormat: File
  ): zio.Task[Unit] = {

    import java.nio.file._
    import org.scalafmt.interfaces.Scalafmt

    val scalafmt = Scalafmt.create(this.getClass.getClassLoader)

    for {
      formattedSource <- ZIO.attempt(
        scalafmt.format(scalafmtConfig, fileToFormat.toPath, scalaCode)
      )
      _ <- writeTextFile(formattedSource, fileToFormat)
    } yield ()

  }

  def writeMarkdownAndScalaFile(
      doc: (MarkdownDocument, ScalaCLIClass),
      outFileMarkdown: File,
      outFileScalaCLI: File
  ): zio.Task[Unit] = {
    import java.io.PrintWriter
    for {
      _ <- writeTextFile(doc._1.content, outFileMarkdown)
      _ <- formatAndWriteScalaFile(doc._2.content, outFileScalaCLI)
    } yield (())
  }

  def processMarkdownFile(inFile: File, outDir: File): zio.Task[Unit] = {
    val outFile = new File(outDir, inFile.getName)
    val outFileName = outFile.getName.replace(".md", ".scala")
      .split("-")
      .map(_.capitalize)
      .mkString("")
    val scalaFile = new File(outDir, outFileName)
    for {
      markdownDoc <- readMarkdownFile(inFile)
      processedDoc = MarkdownProcessor.processMarkdown(markdownDoc)
      _ <- writeMarkdownAndScalaFile(processedDoc, outFile, scalaFile)
    } yield ()

  }

  def copyFile(inFile: File, outDir: File): zio.Task[Unit] = {
    ZIO.attempt {
      val copied = new File(outDir, inFile.getName).toPath;
      val originalPath = inFile.toPath();
      Files.copy(originalPath, copied, StandardCopyOption.REPLACE_EXISTING);
    }
  }

  /** Runs for each file in the directory a action and collects all failures (in
    * return not failure position)
    */
  def processDirectory(
      dir: File,
      outDir: File
  ): ZIO[Any, Throwable, Seq[Throwable]] = {

    val filesOrDirectories = dir.listFiles.toSeq
    val (directories, files) = filesOrDirectories.partition(f => f.isDirectory)

    val collectedFailuresDir = ZIO
      .foreach(directories)(dir => {
        val newSubDir = new File(outDir, dir.getName)
        newSubDir.mkdirs()
        processDirectory(dir, newSubDir)
      })
      .map(_.flatten)

    val collectedFailuresFiles = ZIO
      .partition(files)(file => {
        if (file.getName.endsWith(".md")) {
          processMarkdownFile(file, outDir)
        } else {
          copyFile(file, outDir)
        }
      })
      .map(f => f._1.toSeq)

    for {
      failuresFiles <- collectedFailuresFiles
      failuresDirectory <- collectedFailuresDir
    } yield (failuresDirectory ++ failuresFiles)
  }

  def run = {
    val inDir = new File("./docs/mdocs/")
    val outDir = new File("./website/docs/")

    outDir.mkdirs()

    val collectedFailures = processDirectory(inDir, outDir)
    collectedFailures.map(failures =>
      ZIO.foreach(failures)(f => zio.Console.printLine(f.getMessage))
    )
  }
}
