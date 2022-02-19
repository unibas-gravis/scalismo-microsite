package mdtransform

import scala.util.matching.Regex

/**
 * represents a markdown document
 */
case class MarkdownDocument(content: String)

/**
 * represents scala code
 */
case class ScalaCLIClass(content: String)


object MarkdownProcessor {

  
   // possible modifiers in a line such as 
   // ```scala mdoc:modifier
  enum MDocModifier {
    case Invisible, Silent, None
  }

 
   // The type of lines we might find when parsing markdown
  private enum Line {
    case NormalLine extends Line
    case MDocLine(modifier: MDocModifier) extends Line
    case TripleQuoteLine extends Line
  }


  // Different states we might be in when going through 
  // the document
  private enum ProcessingState {
    case InMarkdown, InSilentScala, InInvisibleScala
  }

  // Represents the lines that were already processed in the processing
  // steps
  private case class ProcessedLines(markdownLines: Seq[String], scalaLines: Seq[String])

  /**
   * Processes a given markdown document with blocks of the 
   * form ```scala mdoc:modifiers```. It produces a markdown
   * document processed according to the modifiers and a scala
   * file with the extracted scala code from the code blocks.
   */ 
  def processMarkdown(
      markdownDocument: MarkdownDocument
  ): (MarkdownDocument, ScalaCLIClass) = {

    val linesToProcess = markdownDocument.content.split('\n').toSeq
    val ProcessedLines(markdownLines, scalaLines) =
      if (linesToProcess.isEmpty) {
        ProcessedLines(Seq.empty[String], Seq.empty[String])
      } else {
        processMarkdownInMarkdownState(linesToProcess)
      }

    (
      MarkdownDocument(markdownLines.mkString("\n")),
      ScalaCLIClass(scalaLines.mkString("\n"))
    )
  }

  private def lineType(line: String): Line = {
    val mdocPattern: Regex = """```\s*scala\s*mdoc\s*.*""".r
    if (mdocPattern.matches(line)) {
      if (line.contains(":")) {
        line.split(":")(1).trim match {
          case "invisible" => Line.MDocLine(MDocModifier.Invisible)
          case "silent"    => Line.MDocLine(MDocModifier.Silent)
        }
      } else {
        Line.MDocLine(MDocModifier.None)
      }
    } else if (line.trim == "```") {
      Line.TripleQuoteLine
    } else {
      Line.NormalLine
    }
  }

  private def processMarkdownInMarkdownState(
      linesToProcess: Seq[String]
  ): ProcessedLines = {
    if (linesToProcess.isEmpty) {
      ProcessedLines(Seq.empty[String], Seq.empty[String])
    } else {
      val line = linesToProcess.head
      lineType(linesToProcess.head) match
        case Line.MDocLine(MDocModifier.Invisible) =>
          processMarkdownInInvisibleScalaState(linesToProcess.tail)
        case Line.MDocLine(MDocModifier.Silent) =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInSilentScalaState(linesToProcess.tail)
          ProcessedLines("```scala" +: parsedMarkdown, parsedScala)
        case Line.MDocLine(MDocModifier.None) =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInSilentScalaState(linesToProcess.tail)
          ProcessedLines("```scala" +: parsedMarkdown, parsedScala)
        case Line.NormalLine =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInMarkdownState(linesToProcess.tail)
          ProcessedLines(line +: parsedMarkdown, parsedScala)
        case Line.TripleQuoteLine =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInMarkdownState(linesToProcess.tail)
          ProcessedLines(line +: parsedMarkdown, parsedScala)
    }
  }

  private def processMarkdownInSilentScalaState(
      linesToProcess: Seq[String]
  ): ProcessedLines = {
    if (linesToProcess.isEmpty) {
      ProcessedLines(Seq.empty[String], Seq.empty[String])
    } else {
      val line = linesToProcess.head
      lineType(linesToProcess.head) match {
        case Line.TripleQuoteLine =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInMarkdownState(linesToProcess.tail)
          ProcessedLines(line +: parsedMarkdown, parsedScala)
        case Line.NormalLine =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInSilentScalaState(
              linesToProcess.tail
            )
          ProcessedLines(line +: parsedMarkdown, line +: parsedScala)
        case _ =>
          ProcessedLines(
            Seq(line, "parsing error - bailing out"),
            Seq(line, "parsing error - bailing out")
          )
      }
    }
  }

  private def processMarkdownInInvisibleScalaState(
      linesToProcess: Seq[String]
  ): ProcessedLines = {
    if (linesToProcess.isEmpty) {
      ProcessedLines(Seq.empty[String], Seq.empty[String])
    } else {
      val line = linesToProcess.head
      lineType(line) match {
        // State invisible
        case Line.TripleQuoteLine =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInMarkdownState(linesToProcess.tail)
          ProcessedLines(parsedMarkdown, parsedScala)
        case Line.NormalLine =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInInvisibleScalaState(linesToProcess.tail)
          ProcessedLines(parsedMarkdown, line +: parsedScala)
        case _ =>
          ProcessedLines(
            Seq(line, "parsing error - bailing out"),
            Seq(line, "parsing error - bailing out")
          )
      }
    }
  }

}
