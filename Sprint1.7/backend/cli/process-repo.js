#!/usr/bin/env node

/**
 * CLI Tool: Process Repository
 * Usage: node cli/process-repo.js <repository-url> [branch]
 */

const repositoryService = require('../services/repositoryService');

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node cli/process-repo.js <repository-url> [branch]');
    console.log('\nExample:');
    console.log('  node cli/process-repo.js https://github.com/user/repo.git');
    console.log('  node cli/process-repo.js https://github.com/user/repo.git develop');
    process.exit(1);
  }

  const repositoryUrl = args[0];
  const branch = args[1] || 'main';

  console.log('========================================');
  console.log('Repository Processing Tool');
  console.log('========================================\n');
  console.log(`Repository: ${repositoryUrl}`);
  console.log(`Branch: ${branch}\n`);

  try {
    const result = await repositoryService.cloneAndProcess(repositoryUrl, branch);

    console.log('\n========================================');
    console.log('Processing Complete');
    console.log('========================================\n');

    if (result.success) {
      console.log('✓ Success');
      console.log(`\nID: ${result.id}`);
      console.log('\nStatistics:');
      console.log(`  - Java files found: ${result.statistics.filesFound}`);
      console.log(`  - Files processed: ${result.statistics.filesProcessed}`);
      console.log(`  - Classes found: ${result.statistics.classesFound}`);
      console.log(`  - Interfaces found: ${result.statistics.interfacesFound}`);
      console.log('\nOutput files:');
      console.log(`  - Markdown: ${result.documentation.markdownPath}`);
      console.log(`  - PlantUML: ${result.documentation.pumlPath}`);
    } else {
      console.error('✗ Failed');
      console.error(`\nPhase: ${result.phase}`);
      console.error(`Error: ${result.error}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('✗ Fatal Error:', error.message);
    process.exit(1);
  }
}

main();
