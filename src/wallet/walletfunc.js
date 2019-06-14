const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethereumjsUtil = require('ethereumjs-util');
const bs58check = require('bs58check');
const wif = require('wif');
const bchaddrjs = require('bchaddrjs');
const web3 = require('web3');
const createHash = require('create-hash');
const Buffer = require('buffer');

function generate() {
    const mnemonic = bip39.generateMnemonic();
    console.log(mnemonic);
    const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const root = hdkey.fromMasterSeed(seed); //create root from seed
    const masterPrivateKey = root.privateKey.toString("hex"); //create master private key
    console.log(masterPrivateKey);
    const masterPubKey = root.publicKey.toString("hex"); //create master public key
    let path = "m/44'/60'/0'/0/0"; //defining derivation path
    const addrNode = root.derive(path);
    const pubKey = ethereumjsUtil.privateToPublic(addrNode._privateKey); //Public key as hex
    console.log(pubKey + " Pub");
    const addr = ethereumjsUtil.publicToAddress(pubKey).toString("hex"); //Create wallet address
    const address = ethereumjsUtil.toChecksumAddress(addr);
    console.log(address + " address");
    let privateKeys = addrNode._privateKey.toString("hex"); //Private key
    privateKeys = ethereumjsUtil.toChecksumAddress(privateKeys);
    console.log(privateKeys);


    //Bitcoin


    const addrNOde = root.derive("m/44'/0'/0'/0/0");
    console.log("addrnodePublicKey: " + addrNOde._publicKey.toString("hex"));
    console.log("addrnodePrivateKey: " + addrNOde._privateKey.toString("hex"));
    const getPub = addrNOde._publicKey;

    const sha1 = createHash("sha256")
        .update(getPub)
        .digest();
    const sha2 = createHash("rmd160")
        .update(sha1)
        .digest();
    var checksum = Buffer.Buffer.allocUnsafe(21);
    checksum.writeUInt8(0x00, 0);
    sha2.copy(checksum, 1);
    const bs58 = bs58check.encode(checksum);

    console.log("Base58Check:" + bs58);


    //Bitcoin Cash


    let addrnode = root.derive("m/44'/145'/0'/0/0");
    console.log("addrnodePublicKey: " + addrnode._publicKey.toString("hex"));
    console.log("addrnodePrivateKey: " + addrnode._privateKey.toString("hex"));

    const pubKEy = addrnode._publicKey;
    const pubHash = createHash("sha256")
        .update(pubKey)
        .digest();
    let pubHashrmd = createHash("rmd160")
        .update(pubHash)
        .digest();

    var step4 = Buffer.Buffer.allocUnsafe(21);
    step4.writeUInt8(0x00, 0);
    pubHashrmd.copy(step4, 1);
    let Addr = bs58check.encode(step4);
    console.log("Base58Check:" + Addr);
    var pvtKey = wif.encode(128, addrnode._privateKey, true);
    console.log(pvtKey);

    var toCashAddress = bchaddrjs.toCashAddress;
    const adr = toCashAddress(Addr);
    let Address;
    console.log(adr.substr(0, 12) + " " + adr.substr(12, adr.length));
    if (adr.substr(0, 12) == "bitcoincash:") {
        Address = adr.substr(12, adr.length);
    } else {
        Address = adr;
    }

}

function sendEth() {
    return 'sending';
}

export {
    generate,
    sendEth
}