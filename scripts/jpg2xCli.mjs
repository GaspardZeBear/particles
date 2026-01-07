import { Command } from 'commander';
import { process } from './jpg2x.mjs'
import { Konsol } from './Konsol.mjs';

const cmd = new Command();

cmd
  .name('cli')
  .description('jpg2xCli')
  .version('1.0.0')
  .option('-d, --debug', 'output extra debugging information')
  .option('-i, --img <path>', 'image')
  .option('-b, --background <path>', 'backgroud', '')
  .option('--dir <path>', 'image dir', '../textures/')
  .option('--rgb <rgb>', 'rgb')
  .option('--lc <lc>', 'lines,cols', '2,3')
  .option('--width <>', 'final width', '1024')
  .option('--height <>', 'final height', '512')
  .option('--ho, --hoffset <>', 'horizontal offset', '-1')
  .option('--vp, --vpad <>', 'vertical pad ', '-1')
  .option('--hp, --hpad <>', 'horizontal pad ', '-1')
  .option('-v, --verbose', 'enable verbose output');
cmd.parse();
const args = cmd.opts()
process(args)
for (let m of Konsol.getStack()) {
  console.log("----> " + m)
}







