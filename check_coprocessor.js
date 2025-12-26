const { HDNodeWallet } = require('ethers');
const m = 'test test test test test test test future home encrypt virtual machine';
for (let i = 0; i < 5; i++) {
  console.log(i + ': ' + HDNodeWallet.fromPhrase(m, '', `m/44'/60'/2'/0/${i}`).address);
}

