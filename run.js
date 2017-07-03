#!/usr/bin/env node

var exports = require('./exports.js');

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .command('usd', 'Update schema dependencies')
  .example('npm run usd -u ./new.json -s ./schema.json -o ./output.json')
  .option('d', {
      alias: 'domain',
      nargs: 1,
      describe: 'Domain to fetch translations from',
      type: 'string',
      default: 'https://m.133a.lolacloud.com'
  })
  .option('p', {
      alias: 'path',
      nargs: 1,
      describe: 'Path from domain to fetch translations from',
      type: 'string',
      default: '/services/translations/sub_project_translations/mobileBooking.json'
  })
  .option('u', {
      alias: 'upload',
      nargs: 1,
      describe: 'Uploaded input file',
      type: 'string',
      // default: './mock-data/mock_uploaded_translations.json'
  })
  .option('s', {
      alias: 'schema',
      nargs: 1,
      describe: 'Schema file',
      type: 'string',
      default: './schema.json'
  })
  .option('o', {
      alias: 'output',
      nargs: 1,
      demandOption: true,
      describe: 'Output file',
      type: 'string',
      // default: './mock-data/mock_current_translations.json'
  })
  .option('q', {
      alias: 'quiet',
      nargs: 1,
      describe: 'Quieten console output to errors only',
      type: 'boolean',
      default: false
  })
  .help('h')
  .alias('h', 'help')
  .epilog('Copyright George Deeks 2017')
  .argv
;

if (!module.parent) {
    exports.run(argv);
}
