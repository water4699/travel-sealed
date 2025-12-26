const { HDNodeWallet } = require('ethers');
const m = 'test test test test test test test test test test test junk';
for (let i = 0; i < 25; i++) {
  console.log(i + ': ' + HDNodeWallet.fromPhrase(m, '', `m/44'/60'/0'/0/${i}`).address);
}

