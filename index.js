import yargs from 'yargs';
import cfonts from 'cfonts';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { createRequire } from 'module';
import { createInterface } from 'readline';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';

// Setup console output
const { say } = cfonts;
const rl = createInterface(process.stdin, process.stdout);
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
const { name, version, author } = require(join(__dirname, './package.json'));
// 𝙎𝙩𝙖𝙧𝙩𝙞𝙣𝙜 𝘾𝙤𝙣𝙨𝙤𝙡𝙚
console.log(chalk.blue.bold(` 
█ 15%
██ 30%
███ 45%
████ 60%
█████ 75%
██████ 100%
⋘ 𝑃𝑙𝑒𝑎𝑠𝑒 𝑤𝑎𝑖𝑡 – 𝑙𝑜𝑎𝑑𝑖𝑛𝑔 𝑑𝑎𝑡𝑎… ⋙
[████████]99%
⋘ Tʀᴀɴsᴍɪssɪᴏɴ sᴜᴄᴄᴇss. ʀᴇᴀᴅʏ ᴛᴏ ᴜsᴇ... ⋙
`));
console.log(chalk.green.bold(`
    --------------------------------------
    🤖 Selamat datang di CataclysmX
  terimakasih telah menggunakan script ini 👍
    --------------------------------------
  `));
  
  console.log(chalk.yellow.bold("📁     Inisialisasi modul..."));
  console.log(chalk.cyan.bold("- API Baileys Telah Dimuat"));
  console.log(chalk.cyan.bold("- Sistem File Siap Digunakan"));
  console.log(chalk.cyan.bold("- Database Telah Diinisialisasi"));

  console.log(chalk.blue.bold("\n🤖 Info Bot:"));
  console.log(chalk.white.bold("  | GitHub: ") + chalk.cyan.bold("https://github.com/Fyzxy/CataclysmX-MD"));
  console.log(chalk.white.bold("  | Developer: ") + chalk.green.bold("Fyzxy"));
  console.log(chalk.white.bold("  | Status Server: ") + chalk.green.bold("Online"));
  console.log(chalk.white.bold("  | Versi: ") + chalk.magenta.bold(version));
  console.log(chalk.white.bold("  | Versi Node.js: ") + chalk.magenta.bold(process.version));
  
  console.log(chalk.blue.bold("\n🔁 Memuat plugin dan scraper...")) 

console.log('🐾 Starting...'); 

var isRunning = false;

/**
 * Start a js file
 * @param {String} file `path/to/file`
 */
function start(file) {
  if (isRunning) return;
  isRunning = true;

  let args = [join(__dirname, file), ...process.argv.slice(2)];
  say([process.argv[0], ...args].join(' '), { font: 'console', align: 'center', gradient: ['red', 'magenta'] });
  
  setupMaster({ exec: args[0], args: args.slice(1) });
  let p = fork();

  p.on('message', data => {
    console.log('[✅RECEIVED]', data);
    switch (data) {
      case 'reset':
        p.kill(); // Change here
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
      default:
          console.warn('[⚠️ UNRECOGNIZED MESSAGE]', data);
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    console.error('[❗] Exited with code:', code);
    if (code !== 0) {
      console.log('[🔄 Restarting worker due to non-zero exit code...');
      return start(file);
    }
    
    watchFile(args[0], () => {
      unwatchFile(args[0]);
      start(file);
    });
  });

  let opts = yargs(process.argv.slice(2)).exitProcess(false).parse();
  
  if (!opts['test']) {
    if (!rl.listenerCount()) {
      rl.on('line', line => {
        p.emit('message', line.trim());
      });
    }
  }
}

start('main.js');
