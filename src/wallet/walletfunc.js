const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethereumjs = require('ethereumjs-util');
const Tx = require('ethereumjs-tx').Transaction;
const bs58check = require('bs58check');
const wif = require('wif');
const bchaddrjs = require('bchaddrjs');
const Web3 = require('web3');
const createHash = require('create-hash');
const Buffer = require('buffer');
const btcLib = require("bitcoinjs-lib");
const WAValidator = require("wallet-address-validator");
const Client = require("bitcoin-core");
const axios = require('axios');
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
    // console.log(serializedTx);
    let newSerializedTx = buf2hex(serializedTx);
    console.log(newSerializedTx);

}

//send bitcoin

async function sendBtc(req, res) {
    const senderAddress = 'mwjHY5N9x5GjxfvCLW3bvuvdixfwQ3nmtc';
    const privateKey = 'cUCrtCPc9sBtAa2y9dSfd5pR1Huz4aVQZhFMSzWvJDRYeTgXR8DA';
    const receiverAddress = 'ms4ud1Npr9MVfHr5Uv5hsMjyDE6zqF3NfH';
    let valid = await CA_validate(senderAddress, "BTC");

    if (valid) {
      const client = new Client({
        username: "admin",
        password: "password",
        network: 'testnet'
      });

      const satoshiConverter = 100000000;
      //  cUCrtCPc9sBtAa2y9dSfd5pR1Huz4aVQZhFMSzWvJDRYeTgXR8DA
      try {
         let senderKey = await btcLib.ECPair.fromWIF(
          privateKey,
          btcLib.networks.bitcoin
        );
        const btcBal = await getBtcBalance(senderAddress);
        let input = parseFloat(0.0005 / satoshiConverter ) + parseFloat('0.0005');
        let txnInputAmount = Math.round(input * satoshiConverter);
        console.log(txnInputAmount);
        if (btcBal < input) {
          console.log('Insufficient balance');
        } else {
          // const senderAddress = "mwjHY5N9x5GjxfvCLW3bvuvdixfwQ3nmtc";
          // Changes based on consensus. Commonly used version is 1

          // BTC Txn Fee
          // let txnFee = Math.round(0.00005 * satoshiConverter); // 0.0004 BTC

          // BTC to Satoshi Conversion - Input Amount
          // let txnInputAmount = 0.000565 * satoshiConverter; // 0.7 BTC

          // BTC to Satoshi Conversion - Output Amount
          // let txnOutputAmount = txnInputAmount - txnFee;

          // const highfee = await bestFee();
          // console.log(highfee);
          // Fee = Input - Output

          /*
           * Very Important Part to get UTX
           */

          // {
          //             "tx_hash":"38a923aa8af54f1bb3f53f541775e8daf3b5227044fe36ae4ba45cb862d89c51",
          //             "tx_hash_big_endian":"519cd862b85ca44bae36fe447022b5f3dae87517543ff5b31b4ff58aaa23a938",
          //             "tx_index":405001571,
          //             "tx_output_n": 0,
          //             "script":"a9144616b2c00cfc401861b98e86ccce47a683ed63da87",
          //             "value": 10000000,
          //             "value_hex": "00989680",
          //             "confirmations":6730
          // }

          let accumilateValue = 0;
          let transactionProcessed = false;
          let balanceAmount = 0;

          axios.get("https://api.blockcypher.com/v1/btc/test3/addrs/"+senderAddress+"?unspentOnly=true&token=33e0954b05094211b3241cc1c088b8d8",
            (err, resp, utx) => {
              if (err) {
                console.log("unable to fetch utx.");
              } else if (resp.statusCode == 500) {
                console.log("No UTXs found");
              } else {
                // console.log(utx);
                // if (utx.unconfirmed_n_tx == 0) {
                // if (utx.txrefs){

                // if((fee/satoshiConverter)>input){
                //   return res.send({
                //     status:false,
                //     message:'You are trying to send an amount lower than transaction fee'
                //   });
                // }
                // else{

                utx.txrefs.forEach(function(singleUtx) {
                  if (singleUtx.value >= txnInputAmount) {
                    // const txb = new btcLib.TransactionBuilder(btcLib.networks.testnet);
                    const txb = new btcLib.TransactionBuilder(
                      btcLib.networks.bitcoin
                    );
                    txb.setVersion(1);
                    // let txBytes = 180 + 75;
                    // let fee = txBytes * highfee;
                    // console.log(
                    //   "highfee=" +
                    //     highfee +
                    //     "\nfee=" +
                    //     fee +
                    //     "\ninput=" +
                    //     txnInputAmount +
                    //     "\nout=" +
                    //     txnOutputAmount
                    // );
                    //  let txnOutputAmount = txnInputAmount + fee;

                    if (txnInputAmount / satoshiConverter > btcBal) {
                      return res.send({
                        status: false,
                        message: "Insufficient funds to continue transaction"
                      });
                    }
                    txb.addInput(singleUtx.tx_hash, singleUtx.tx_output_n); // Sender Address, (Index) Vout

                    // TxnFee = Input - Output
                    balanceAmount = singleUtx.value - txnInputAmount;
                    txb.addOutput(
                      receiverAddress,
                      req.body.amount * satoshiConverter
                    ); // Reciever Address, Txn Amount Satoshis.
                    txb.addOutput(senderAddress, balanceAmount); // Sender Address, Txn Amount Satoshis. Balance to origin address
                    txb.sign(0, senderKey);

                    let rawTxn = txb.build().toHex();
                    console.log(rawTxn);
                    // Broadcast
                    
                    // request.post(
                    //   {
                    //     url:
                    //       "https://api.blockcypher.com/v1/btc/" +
                    //       env.production.btcNetwork +
                    //       "/txs/push?token=" +
                    //       env.common.bcypherToken,
                    //     body: JSON.stringify(tx)
                    //   },
                    //   function(err, resp, body) {
                    //     if (err) {
                    //       // resolve(err);
                    //       console.log(err);
                    //       res.send({
                    //         status: false,
                    //         message: "Something went wrong"
                    //       });
                    //     } else {
                    //       // return tx hash as feedback
                    //       let finaltx = JSON.parse(body);
                    //       
                    //     }
                    //   }console.log(finaltx);
                    //       const data = {
                    //         from: senderAddress,
                    //         to: receiverAddress,
                    //         contractaddress: "",
                    //         txHash: finaltx.tx.hash,
                    //         value: txnInputAmount / 100000000,
                    //         status: "Pending",
                    //         symbol: "BTC",
                    //         date: Date.now()
                    //       };
                    //       
                    // );

                    transactionProcessed = true;
                  }
                });
                let inputCounter = 0;
                if (transactionProcessed == false) {
                  // const txb = new btcLib.TransactionBuilder(btcLib.networks.testnet);
                  const txb = new btcLib.TransactionBuilder(
                    btcLib.networks.bitcoin
                  );
                  txb.setVersion(1);
                  utx.txrefs.forEach(function(singleUtx, index) {
                    accumilateValue += singleUtx.value;
                    txb.addInput(singleUtx.tx_hash, singleUtx.tx_output_n); // Sender Address, Input Amount
                    // txb.sign(index + 1, senderKey);
                    inputCounter++;
                    if (accumilateValue >= txnInputAmount) {
                      return;
                    }
                  });

                  if (accumilateValue >= txnInputAmount) {
                    console.log("inputC=" + inputCounter + "\n");
                    // let txBytes = inputCounter * 180 + 75;
                    // let fee = txBytes * highfee;
                    // let txnOutputAmount = txnInputAmount + fee;
                    // console.log(
                    //   "highfee=" +
                    //     highfee +
                    //     "\nfee=" +
                    //     fee +
                    //     "\n input=" +
                    //     txnInputAmount +
                    //     "\n Out=" +
                    //     txnOutputAmount
                    // );
                    if (txnInputAmount / satoshiConverter > btcBal) {
                      return res.send({
                        status: false,
                        message: "Insufficient funds to continue transaction"
                      });
                    }
                    balanceAmount = accumilateValue - txnInputAmount;
                    txb.addOutput(
                      receiverAddress,
                      req.body.amount * satoshiConverter
                    ); // Reciever Address, Txn Amount Satoshis.
                    txb.addOutput(senderAddress, balanceAmount); // Sender Address, Txn Amount Satoshis. Balance to origin address
                    // utx.txrefs.forEach(function (singleUtx, index) {
                    //   txb.sign(index, senderKey);
                    // });
                    // console.log(inputCounter + " ss");
                    for (let i = 0; i < inputCounter; i++) {
                      txb.sign(i, senderKey);
                    }

                    let rawTxn = txb.build().toHex();
                    console.log(rawTxn);
                   
                    // Boradcast
                    // client.sendRawTransaction(rawTxn, (error, response) => {
                    //   if (error) console.log(error);
                    //   console.log(response)
                    // });
                    // request.post(
                    //   {
                    //     url:
                    //       "https://api.blockcypher.com/v1/btc/" +
                    //       env.production.btcNetwork +
                    //       "/txs/push?token=" +
                    //       env.common.bcypherToken,
                    //     body: JSON.stringify(tx)
                    //   },
                    //   function(err, resp, body) {
                    //     if (err) {
                    //       // resolve(err);
                    //       console.log(err);
                    //       res.send({
                    //         status: false,
                    //         message: "Something went wrong"
                    //       });
                    //     } else {
                    //       // return tx hash as feedback
                    //       let finaltx = JSON.parse(body);
                    //       
                    //     }
                    //   }
                    // );
                  } else {
                    res.send({
                      status: false,
                      message: "Insufficient balance"
                    });
                  }
                }
                // } else {
                //   res.send({
                //     status: false,
                //     message:
                //       "Pending transaction " +
                //       utx.unconfirmed_txrefs[0].tx_hash +
                //       ". Proceed after sometime."
                //   });
                // }
              }
            }
            // }
          );
        }
      } catch (err) {
        if (err.message == "Invalid checksum") {
          res.send({
            status: false,
            message:
              "Invalid private key. Please make sure you're using the right one."
          });
        }
      }
    } else {
      res.send({
        status: false,
        message: "Invalid address"
      });
    }
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

  async function getBtcBalance(address) {
    return new Promise(async (resolve, reject) => {
      try {
      axios.get("https://testnet.blockchain.info/balance?active="+address)
      .then(function (response) {
        console.log(response);
        const tx = response.data[address];
        resolve(tx.final_balance / 100000000);
      })
      .catch(function (error) {
        reject('Unable to fetch balance');
      });
    } 
    catch (error) {
      console.log("here="+error);
    }});
  
  }

  function CA_validate(address, symbol) {
    return new Promise(async (resolve, reject) => {
    var valid = WAValidator.validate(address, symbol,'testnet');
    resolve(valid);
    });
  }

  function buf2hex(buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  }
export {
    generate,
    sendEth,
    ethGas,
    getEthBalance,
    getBtcBalance
}