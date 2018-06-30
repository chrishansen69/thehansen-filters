var lines = String.raw`%INPUT%`.split('\n');

var mo = 'janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro'.split('|');
var re = /^! (segunda-feira|terça-feira|quarta-feira|quinta-feira|sexta-feira|sábado|domingo), ([0-9]+) de (janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro) de ([0-9]+) ([0-9]+):([0-9]+):([0-9]+) (.*)$/i;
var re2 = /^! ([0-9]+)\/([0-9]+)\/([0-9]+),? ([0-9]+):([0-9]+):([0-9]+) (.*)$/i;
var out = [];

function parseUrl(str) {
  try {
    return new URL(str).hostname
  } catch (e) {
    if (str.indexOf('/') == -1) { // not an url just a host name
      return str;
    }
    throw e; // rethrow
  }
}

for (let i = 0; i < lines.length; i++) {
  try {
    let ex = re.exec(lines[i]);
    if (ex) {
      lines[i] = `! ${new Date(ex[4], mo.findIndex(e => e == ex[3]), ex[2]).toDateString()} : ${parseUrl(ex[8])}`;
    }
    ex = re2.exec(lines[i]);
    if (ex) {
      lines[i] = `! ${new Date(ex[3], ex[2]-1, ex[1]).toDateString()} : ${parseUrl(ex[7])}`;
    }
  } catch (e) {
    console.log(e, lines[i]);
  }
}
copy(lines.join('\n'));
