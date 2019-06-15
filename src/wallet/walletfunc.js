const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethereumjs = require('ethereumjs-util');
const Tx = require('ethereumjs-tx');
const bs58check = require('bs58check');
const wif = require('wif');
const bchaddrjs = require('bchaddrjs');
const Web3 = require('web3');
const createHash = require('create-hash');
const Buffer = require('buffer');
let web3 = new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/79931628a2fd40329ae0e7e6132df909"));
function generate() {
    const mnemonic = bip39.generateMnemonic();
    console.log(mnemonic);
    const seed = bip39.mnemonicToSeed(mnemonic); //creates seed buffer
    const root = hdkey.fromMasterSeed(seed); //create root from seed
    const masterPrivateKey = root.privateKey.toString("hex"); //create master private key
    console.log(masterPrivateKey);
    // const masterPubKey = root.publicKey.toString("hex"); //create master public key
    let path = "m/44'/60'/0'/0/0"; //defining derivation path
    const addrNode = root.derive(path);
    const pubKey = ethereumjs.privateToPublic(addrNode._privateKey); //Public key as hex
    console.log(pubKey + " Pub");
    const addr = ethereumjs.publicToAddress(pubKey).toString("hex"); //Create wallet address
    const address = ethereumjs.toChecksumAddress(addr);
    console.log(address + " address");
    let privateKeys = addrNode._privateKey.toString("hex"); //Private key
    privateKeys = ethereumjs.toChecksumAddress(privateKeys);
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

    // const pubKEy = addrnode._publicKey;
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
    console.log(adr.substr(0, 12) + " " + adr.substr(12, adr.length));
    let Address;
    if (adr.substr(0, 12) === "bitcoincash:") {
        Address = adr.substr(12, adr.length);
    } else {
        Address = adr;
    }

}

async function sendEth(amount,toAccount) {
    let balance = await getEthBalance();
    if (parseFloat(amount) > balance) {
        //false
        console.log('Insufficient balance');
    }
    var gas = await ethGas();
    var privateKey = Buffer.Buffer('8BC3031B7228262df3C0608Da2eA4B039EB1EBf1A50CB5D40c3F4717c54B5940',"hex");
    let nonce = 25;
    const rawTx = {
        to: toAccount,
        value: web3.utils.toHex(web3.utils.toWei(amount, "ether")),
        gasPrice: web3.utils.toHex(gas.price),
        gasLimit: web3.utils.toHex(21000),
        chainId: 1,
        nonce: web3.utils.toHex(nonce)
    };
    
    var tx = new Tx(rawTx);
    tx.sign(privateKey);
    var serializedTx = tx.serialize();
    console.log(serializedTx);

}

function getEthBalance(){
    return new Promise(async (resolve, reject) => {  
        web3.eth.getBalance('0xc44B600EaE5a7C12146459182a0D1e039BEa89fa',function(err,balance){
        console.log(web3.utils.fromWei(balance.toString(),'ether'));
        resolve(web3.utils.fromWei(balance.toString(),'ether'));
        });
    });
}

async function ethGas() {  
    
  return new Promise(async (resolve, reject) => {  
        web3.eth.getBlock("latest", false,async(err,data)=>{
          if(err) console.log(err);
          fetch("https://ethgasstation.info/json/ethgasAPI.json")
          .then(res =>res.json())
          .then((result)=>{
            resolve({limit:data.gasLimit,price:result.fastest});
          })
          .then((error)=>{

          })
          
      });
    });
  }

export {
    generate,
    sendEth,
    ethGas,
    getEthBalance
}