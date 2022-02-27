package mdtransform

import scala.util.matching.Regex

/** represents a markdown document
  */
case class MarkdownDocument(content: String)

/** represents scala code
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
    case MDocLine(modifier: MDocModifier, leadingEmptyLines: Int) extends Line
    case TripleQuoteLine extends Line
  }

  // Different states we might be in when going through
  // the document
  private enum ProcessingState {
    case InMarkdown, InSilentScala, InInvisibleScala
  }

  // Represents the lines that were already processed in the processing
  // steps
  private case class ProcessedLines(
      markdownLines: Seq[String],
      scalaLines: Seq[String]
  )

  /** Processes a given markdown document with blocks of the form ```scala
    * mdoc:modifiers```. It produces a markdown document processed according to
    * the modifiers and a scala file with the extracted scala code from the code
    * blocks.
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
   if (!line.trim.startsWith("```")) {
      Line.NormalLine
    } else if (line.trim == "```") {
      Line.TripleQuoteLine 
    } else if (line.startsWith("```") && !line.contains("mdoc")) {
      Line.TripleQuoteLine 
    } else if (line.startsWith("```scala")) {
      // tokenize line of type ```scala mdoc:silent emptyLines:5 
      val tokens = line.replace("```scala", "").split(raw"\s+")
      val keywordMap = tokens.map(token => {
        val parts = token.split(":")
        val modifier = parts.head
        val value = if (parts.tail.isEmpty) "" else parts.tail.head
        (modifier, value)
      }).toMap
      val mdocModifer = keywordMap.getOrElse("mdoc", "")
      val numEmptyLines = keywordMap.getOrElse("emptyLines", "0")
      if (mdocModifer == "invisible") {
        Line.MDocLine(MDocModifier.Invisible, numEmptyLines.toInt)
      } else if (mdocModifer == "silent") {
        Line.MDocLine(MDocModifier.Silent, numEmptyLines.toInt)
      } else {
        Line.MDocLine(MDocModifier.None, 0)
      }
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
        case Line.MDocLine(MDocModifier.Invisible, leadingEmptyLines) =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInInvisibleScalaState(linesToProcess.tail)
          val emptyLines = Seq.fill(leadingEmptyLines)("\n")
          ProcessedLines(parsedMarkdown, emptyLines ++ parsedScala)
        case Line.MDocLine(MDocModifier.Silent, leadingEmptyLines) =>
          val ProcessedLines(parsedMarkdown, parsedScala) =
            processMarkdownInSilentScalaState(linesToProcess.tail)
          val emptyLines = Seq.fill(leadingEmptyLines)("\n")
          ProcessedLines("```scala" +: parsedMarkdown, emptyLines ++ parsedScala)
        case Line.MDocLine(MDocModifier.None, _) =>
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
