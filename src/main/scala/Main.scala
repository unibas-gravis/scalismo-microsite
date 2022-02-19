import java.io.File 
import scala.util.Try
import scala.util.{Success, Failure}
import scala.io.Source
import zio._
import java.io.IOException
import mdtransform.{MarkdownProcessor, MarkdownDocument, ScalaCLIClass}


object Main extends zio.ZIOAppDefault {


  def readMarkdownFile(file : File) : zio.Task[MarkdownDocument] = {
      ZIO.attempt(MarkdownDocument(Source.fromFile(file).getLines.mkString("\n")))
  }

  private def writeTextFile(text : String, file : File) : zio.Task[Unit] = {
    import java.io._
    ZIO.succeed(new PrintWriter(file)).acquireReleaseWith(pw => ZIO.succeed(pw.close()))(pw => ZIO.succeed(pw.write(text)))
  }

  private def formatAndWriteScalaFile(scalaCode : String, file : File) : zio.Task[Unit] = {
    
    import java.nio.file._
    import org.scalafmt.interfaces.Scalafmt
    
    val scalafmt = Scalafmt.create(this.getClass.getClassLoader)
    val config = Paths.get(".scalafmt.conf")
  
    for {
      formattedSource <- ZIO.attempt(scalafmt.format(config, file.toPath, scalaCode))
      _ <- writeTextFile(formattedSource, file)
    } yield ()

  }

  def writeMarkdownAndScalaFile(doc : (MarkdownDocument, ScalaCLIClass), outFileMarkdown : File, outFileScalaCLI : File) : zio.Task[Unit]= {
    import java.io.PrintWriter
    for {
      _ <- writeTextFile(doc._1.content, outFileMarkdown)
      _ <- formatAndWriteScalaFile(doc._2.content, outFileScalaCLI)
    } yield (())
  }

  def writeScalaCLIToFile(doc : ScalaCLIClass, outFile : File) : Try[Unit] = ???

  def run = {
    val inDir = new File("./docs/mdocs/tutorials")
    val outDir = new File("./tmp/tutorials")
    val outDirScala = new File(outDir, "scala")
    val outDirMarkdown = new File(outDir, "markdown")
    outDirScala.mkdirs
    outDirMarkdown.mkdirs
    
    val files = inDir.listFiles.filter(f => f.getName.endsWith("tutorial0.md")).toSeq
    
    ZIO.validateDiscard(files)(file => {
      
        val markdownFile = new File(outDirMarkdown, file.getName)
        val scalaFile = new File(outDirScala, file.getName.replace(".md", ".scala"))
        for {
          markdownDoc <- readMarkdownFile(file)          
          processedDoc = MarkdownProcessor.processMarkdown(markdownDoc)
          _ <- writeMarkdownAndScalaFile(processedDoc, markdownFile, scalaFile)
        } yield ()
      } 
    ).foldZIO(
        failure = (failures : Seq[Throwable]) => ZIO.foreach(failures)(f  => zio.Console.print(f.getCause)),
        success = (_ : Unit) => ZIO.succeed(())
        )
    
  }  
} 