const { HDNodeWallet, Mnemonic } = require('ethers');
const mStr = 'test test test test test test test future home encrypt virtual machine';

try {
    const m = Mnemonic.fromPhrase(mStr);
    console.log("Mnemonic is valid");
    for (let i = 0; i < 5; i++) {
        console.log("Path 0: " + i + ': ' + HDNodeWallet.fromMnemonic(m, `m/44'/60'/0'/0`).deriveChild(i).address);
        console.log("Path 2: " + i + ': ' + HDNodeWallet.fromMnemonic(m, `m/44'/60'/2'/0`).deriveChild(i).address);
    }
} catch (e) {
    console.error("Error:", e.message);
}

