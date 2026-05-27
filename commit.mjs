import readline from 'node:readline';
import { execSync } from 'node:child_process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Do you want to commit changes? (yes/no): ', (answer) => {
  const value = answer.trim().toLowerCase();

  if (value === 'yes' || value === 'y') {
    execSync('npm run commit', { stdio: 'inherit' });
  } else {
    console.log('Commit cancelled.');
  }

  rl.close();
});
