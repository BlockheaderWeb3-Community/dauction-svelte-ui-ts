import web3 from 'web3';

// num to wei
const toWei = (number: any) => web3.utils.toWei(number.toString(), 'ether');
const fromWei = (wei: any) => web3.utils.fromWei(wei.toString(), 'ether');

export { toWei, fromWei };
