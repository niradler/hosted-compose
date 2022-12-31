import { execa } from "execa";
import Path from "path";
import { logger } from "../utils.js";

export default function (parentCommand) {
  parentCommand.command(
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
        .option("args", {
          type: "array",
          default: [],
          description: "zx args",
        })
        .option("binPath", {
          default: Path.join(__basedir, "node_modules", ".bin", "zx"),
          description: "zx location",
        });
    },
    async (argv) => {
      logger(argv.verbose)(argv);
      try {
        const args = [...argv.args];
        if (argv.eval) {
          args.push("--eval");
          args.push(argv.eval);
        }
        if (argv.filePath) args.push(argv.filePath);
        if (args.length === 0) throw new Error("Missing arguments");
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
