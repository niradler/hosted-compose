import { execa } from "execa";
import Path from "path";
import { logger } from "../utils.js";

export default function (parentCommand) {
  return parentCommand.command(
    "run",
    "run zx script file",
    (yargs) => {
      return yargs
        .option("filePath", {
          description: "script file path",
        })
        .option("eval", {
          alias: "e",
          description: "pass script as text",
        })
        .option("zxArgs", {
          alias: "zargs",
          type: "array",
          default: [],
          description: "zx args",
        })
        .option("scriptArgs", {
          alias: "sargs",
          type: "array",
          default: [],
          description: "script args",
        })
        .option("binPath", {
          default: Path.join(__basedir, "node_modules", ".bin", "zx"),
          description: "zx location",
        });
    },
    async (argv) => {
      logger(argv.verbose)(argv);
      try {
        let args = [...argv.zxArgs];
        if (argv.eval) {
          args.push("--eval");
          args.push(argv.eval);
        }
        if (argv.filePath) args.push(argv.filePath);
        if (args.length === 0) throw new Error("Missing arguments");
        if (argv.scriptArgs.length > 0) args = [...args, ...argv.scriptArgs];
        logger(argv.verbose)(args);
        const ps = execa(argv.binPath, args);
        ps.stdout.pipe(process.stdout);
        ps.stdin.pipe(process.stdin);
        await ps;
        process.exit(0);
      } catch (error) {
        console.error("ERROR:", error.message);
        process.exit(1);
      }
    }
  );
}
