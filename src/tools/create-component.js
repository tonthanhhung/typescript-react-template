#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require("fs");
const process = require("process");
const chalk = require("chalk");
const program = require("commander");
const Listr = require("listr");
const resolve = require("path").resolve;

function create(name, isPage) {
  const componentParentFolder = isPage ? "pages" : "components";
  const path = resolve(`${__dirname}/../${componentParentFolder}/${name}`);

  if (fs.existsSync(path)) {
    console.error(`path already exists: ${path}`);
    process.exitCode = 1;
    return;
  }
  new Listr([
    {
      title: "Creating component source",
      task: () => {
        fs.mkdirSync(path);
        fs.writeFileSync(
          `${path}/${name}.tsx`,
          `import React from "react";

interface Props {}

const ${name}: React.FC<Props> = (props) => {
  return (
    <div>
      Implement me !
    </div>
  );
};

export default ${name};
`
        );
      }
    },
    {
      title: "Creating component storybook",
      task: () => {
        fs.writeFileSync(
          `${path}/${name}.stories.tsx`,
          `import React from "react";

import { storiesOf } from "@storybook/react";
import ${name} from "./${name}";

storiesOf("${
            isPage ? "Pages|" : "Components|"
          }${name}", module).add("default", () => {
  return <${name}></${name}>;
});
`
        );
      }
    }
  ])
    .run()
    .then(() => {
      console.log(chalk.greenBright(`Component created: ${path}`));
    });
}

console.log(chalk.greenBright("Create Component Cli"));
program
  .name("yarn cc")
  .description("Tool for automated component creation")
  .usage("[option] <ComponentName>")
  .option("-p, --page", "page component", false)
  .on("--help", function() {
    console.log("");
    console.log("Examples:");
    console.log("  $ yarn cc LinkButton");
    console.log("  $ yarn cc -p HomePage");
  })
  .parse(process.argv);
const name = program.args[0];
if (name) {
  create(name, program.page);
} else {
  program.outputHelp(chalk.redBright);
}
