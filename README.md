# name-generator
generic configurable name generator

## Usage

```
> name-generator-cli -h
Usage: index [options]

Name generator based on a yaml config file

Options:
  -i, --inputs <values...>           add inputs on the form key1=value1 key2=value2
  -c, --configFile <configFile>      add a config file (default: "https://raw.githubusercontent.com/lars1974/node-name-generator/main/test.yaml")
  -o, --outputFormat <outputFormat>  yaml, json or properties
  -v, --version                      output the version number
  -f, --outputFile <file>            file
  -s, --singleOutput <singleOutput>  output single value to console
  -y, --echoYamlConfig               show yaml config file
  -h, --help                         display help for command
```

# install from github"

npm login --scope=@lars1974 --registry=https://npm.pkg.github.com

npm install -g @lars1974/name-generator

# build and run

npm run all && npm i -g lars1974-name-generator-cli-0.0.0.tgz && name-generator-cli
