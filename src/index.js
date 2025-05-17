import DatasetParser from "./DatasetParser"

const datasetConfig = (elment, options) => {
  return new DatasetParser(elment, options).parse()
}

export default datasetConfig
