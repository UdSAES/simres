# simres
`simres` is a node.js package to read and write csv files that have been generated by a simulation tool.

> Deprecated: This package is no longer actively developed/maintained. Security issues (or any other issues) will not be fixed!

~~The package is being developed and maintained by the [Chair of Automation and Energy Systems](https://www.uni-saarland.de/en/lehrstuhl/frey/start.html) at the [Saarland University](https://www.uni-saarland.de/nc/en/home.html).~~

## License
`simres` is released under the [ISC license](./LICENSE).

## Installation
``` JavaScript
$ npm install simres
```

## Usage
The `simres` package provides four functions.

### parseCsvFile
* purpose: parse the content of a simulation result file
* arguments:
  1. (`String`): the content of the simulation result file as plain text
  2. (`Object`): the optional options `Object`to adjust the way of parsing with the following attributes:
      * `columnSeparator` (`String`): the character sequence that is used to separate columns (standard value is `'\t'`)
      * `rowSeparator` (`String`): the character sequence that is used to separate rowss (standard value is `'\r\n'`)
      * `automaticRowEndDetection` (`Boolean`): define whether the row ending separator shall be detected automatically (standard value is `true`)
* returns (`Array`): the simulation result as array of timeseries objects (timestamps are a timeseries on their own). Each item in the array is an `Object` with the following attributes:
  * `label` (`String`): the label of the timeseries
  * `type` (`String`): the type of the timeseries
  * `unit` (`String`): the unit of the timeseries
  * `values` (`Array`): the values of the timeseries

### readAndParseCsvFile
* purpose: asynchronously read and parse the content of a simulation result file
* arguments:
  1. (`String`): the path to the csv file
  2. (`Object`): the optional options `Object`to adjust the way of parsing
      * `columnSeparator` (`String`): the character sequence that is used to separate columns (standard value is `'\t'`)
      * `rowSeparator` (`String`): the character sequence that is used to separate rowss (standard value is `'\r\n'`)
      * `automaticRowEndDetection` (`Boolean`): define whether the row ending separator shall be detected automatically (standard value is `true`)
* returns (`Array`): the simulation result as array of timeseries objects (timestamps are a timeseries on their own). Each item in the array is an `Object` with the following attributes:
  * `label` (`String`): the label of the timeseries
  * `type` (`String`): the type of the timeseries
  * `unit` (`String`): the unit of the timeseries
  * `values` (`Array`): the values of the timeseries

### composeCsvFile
* purpose: compose the content of a simulation result file
* arguments:
  1. (`Array`): the collection of timeseries items with each item being an `Object` with the following attributes:
      * `label` (`String`): the label of the timeseries
      * `type` (`String`): the type of the timeseries
      * `unit` (`String`): the unit of the timeseries
      * `values` (`Array`): the values of the timeseries
  2. (`Object`): the optional options `Object` to adjust the way of parsing with the following attributes:
      * `columnSeparator` (`String`): the character sequence that is used to separate columns (standard value is `'\t'`)
      * `rowSeparator` (`String`): the character sequence that is used to separate rowss (standard value is `'\r\n'`)
* returns (`String`): the simulation result converted to plain text

### composeAndWriteCsvFile
* purpose: asynchronously compose the content of a simulation result and write it to a file
* arguments:
  1. (`String`): the path to file that shall be written
  2. (`Array`): the collection of timeseries items with each item being an `Object` with the following attributes:
      * `label` (`String`): the label of the timeseries
      * `type` (`String`): the type of the timeseries
      * `unit` (`String`): the unit of the timeseries
      * `values` (`Array`): the values of the timeseries
  3. (`Object`): the optional options `Object` to adjust the way of parsing with the following attributes:
      * `columnSeparator` (`String`): the character sequence that is used to separate columns (standard value is `'\t'`)
      * `rowSeparator` (`String`): the character sequence that is used to separate rowss (standard value is `'\r\n'`)
* returns (`undefined`)
