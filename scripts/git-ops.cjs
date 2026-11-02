const fs = require('fs');
const path = require('path');
const git = require('isomorphic-git');

const dir = path.resolve(__dirname, '..');

async function main() {
  console.log('Initializing git repository in', dir);
  await git.init({ fs, dir, defaultBranch: 'main' });
  console.log('Git repo initialized.');

  // Read gitignore patterns
  const gitignoreContent = fs.readFileSync(path.join(dir, '.gitignore'), 'utf8');
  const ignoreList = ['node_modules', 'dist', '.git', 'dist-ssr', '*.local'];

  function getAllFiles(currentDir, relativePath = '') {
    const files = [];
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const entryRelative = relativePath ? `${relativePath}/${entry.name}` : entry.name;
      if (entry.name === '.git' || entry.name === 'node_modules' || entry.name === 'dist') {
        continue;
      }
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllFiles(fullPath, entryRelative));
      } else {
        files.push(entryRelative);
      }
    }
    return files;
  }

  const allFiles = getAllFiles(dir);
  console.log(`Found ${allFiles.length} files to track.`);

  for (const file of allFiles) {
    await git.add({ fs, dir, filepath: file });
  }
  console.log('Staged all files.');

  const sha = await git.commit({
    fs,
    dir,
    author: {
      name: 'AadithAS2026',
      email: 'aadith@example.com'
    },
    message: 'feat: CivicTrack responsive civic issue reporting platform with GPS geotagging and maps'
  });
  console.log('Created commit:', sha);

  // Set remote origin
  const remotes = await git.listRemotes({ fs, dir });
  const hasOrigin = remotes.some(r => r.remote === 'origin');
  if (hasOrigin) {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  }
  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/AadithAS2026/civictrack.git'
  });
  console.log('Added remote origin: https://github.com/AadithAS2026/civictrack.git');

  // Verify status
  const currentBranch = await git.currentBranch({ fs, dir });
  console.log('Current branch:', currentBranch);
}

main().catch(err => {
  console.error('Git error:', err);
  process.exit(1);
});
