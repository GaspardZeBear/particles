import { Command } from 'commander';
import {process} from './jpg2x.mjs'

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
  .option('--vo, --voffset <>', 'vertical offset', '96')
  .option('--vp, --vpad <>', 'vertical ', '0')
  .option('--hp, --hpad <>', 'horizontal padl ', '0')
  .option('-v, --verbose', 'enable verbose output');
cmd.parse();
const args=cmd.opts()
//console.log(args)
let background = { format: {l:2,c:3}, backgroundImg: '', colors: { r: 0, g: 0, b: 0 } }
process(args);
