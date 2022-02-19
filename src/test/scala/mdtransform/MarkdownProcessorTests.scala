package mdtransform

import zio.test._
import zio.test.assert
import zio.test.Assertion.equalTo
import mdtransform.MarkdownProcessor.Line
import mdtransform.MarkdownProcessor.MDocModifier


object MarkdownProcessorTests {
    val mdProcessorSuite = suite("MDProcessor") (
      
        test("recognizes silent modifier") {
            val testDoc = MarkdownDocument("```scala mdoc:silent\n42\n```")
            val outputDoc = MarkdownDocument("```scala\n42\n```")
            val processedDoc = MarkdownProcessor.processMarkdown(testDoc)
            assert(processedDoc)(equalTo(outputDoc))
        }
    )        
}

object AllSuites extends zio.test.DefaultRunnableSpec {
    def spec = suite("All tests")(MarkdownProcessorTests.mdProcessorSuite)
}