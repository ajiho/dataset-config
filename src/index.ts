import DatasetParser from "./DatasetParser.js"
import type { DatasetParserOptions } from "./DatasetParser.js"

const datasetConfig = (
  element: HTMLElement,
  options?: DatasetParserOptions,
): Record<string, unknown> => {
  return new DatasetParser(element, options).parse()
}

export default datasetConfig
