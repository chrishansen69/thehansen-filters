'use strict';
/*jshint node:true*/
const fs = require('fs');
const http = require('http');
const https = require('https');

const files = [
  "./ublock1.txt",
  "./ublock2.txt",
  "./adblock1.txt",
  "./adblock2.txt",
];

const remoteFiles = [
  'http://abp.mozilla-hispano.org/nauscopio/filtros.txt',
  'https://easylist-downloads.adblockplus.org/antiadblockfilters.txt',
  'https://raw.githubusercontent.com/rusingineer/mpbl/master/mpub_increment.txt',
  'http://winhelp2002.mvps.org/hosts.txt',
  'https://raw.githubusercontent.com/rbrito/easylist-ptbr/master/adblock-rules.txt',
  'http://pastebin.com/raw.php?i=rSP8d6Vb',
  'https://raw.githubusercontent.com/piperun/iploggerfilter/master/filterlist',
  'https://raw.githubusercontent.com/Asexual/Ublock-Filterlist/master/filterlist.txt',
  'https://adguard.com/en/filter-rules.html?id=9',
  'https://adguard.com/en/filter-rules.html?id=2',
  'https://raw.githubusercontent.com/hant0508/uBlock-fillters/master/filters.txt',
  'https://raw.githubusercontent.com/chrishansen69/uBlock-elitepvpers-usersignatures/master/elitepvpers_usersignatures.txt',
  'https://raw.githubusercontent.com/pkajan/My_uBlock_blocklist/master/ublock-static-filters.txt',
  'https://raw.githubusercontent.com/btgregory/uBlock-Supplementary-Blocklist/master/general_filters.txt',
  'https://raw.githubusercontent.com/btgregory/uBlock-Supplementary-Blocklist/master/cosmetic_filters.txt',
  'https://raw.githubusercontent.com/btgregory/uBlock-Supplementary-Blocklist/master/network_filters.txt',
  'https://raw.githubusercontent.com/uwx/thehansen-filters/master/stopmodreposts.txt',
];

fs.truncateSync('./Filters.txt');

files.forEach(file => {
  console.log('processing ' + file.substring(2));
  // slower but has less need for control flow shit than piping
  fs.appendFileSync('./Filters.txt', fs.readFileSync(file, 'utf8'));
});

function it(i) {
  const file = remoteFiles[i];
  console.log('processing ' + file);
  
  const st = fs.createWriteStream('./Filters.txt', {flags: 'a'});

  (file.startsWith('https')?https:http).get(file, function(res) {
    res.pipe(st);
    st.on('finish', () => {
      st.close(() => {
        fs.appendFileSync('./Filters.txt', '\n');
        if (++i < remoteFiles.length) {
          it(i);
        } else {
          console.log('correcting newlines');
          fs.writeFileSync('./Filters.txt', fs.readFileSync('./Filters.txt', 'utf8')
                                              .replace(/\r\n/g, '\n')
                                              .replace(/^!.*?$\n/gm, '')//remove comments at start of line
                                              .replace(/^#.*?$\n/gm, '')//remove HOSTS file comments at start of line
                                              .replace(/\n{2,}/g, '\n') //remove multiple newlines
                                              .trim()                   // trim it!
                          );
          console.log('finish');
        }
      });
    });
  });
}

it(0);
