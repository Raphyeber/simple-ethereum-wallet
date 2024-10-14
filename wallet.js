let web3;
let userAccount;

if (typeof window.ethereum !== 'undefined') {
    web3 = new Web3(window.ethereum);
    console.log('Metamask detected');
} else {
    alert('Metamask not found! Please install Metamask.');
}

const connectButton = document.getElementById('connect');
const accountElement = document.getElementById('account');
const balanceElement = document.getElementById('balance');
const sendButton = document.getElementById('send');
const recipientInput = document.getElementById('recipient');
const amountInput = document.getElementById('amount');
const transactionStatus = document.getElementById('transactionStatus');
const transactionHistory = document.getElementById('transactionHistory');

connectButton.addEventListener('click', async () => {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const accounts = await web3.eth.getAccounts();
    userAccount = accounts[0];
    accountElement.innerText = `Connected: ${userAccount}`;

    const balanceWei = await web3.eth.getBalance(userAccount);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    balanceElement.innerText = balanceEth;

    transactionHistory.innerHTML = `
        <li class="list-group-item">0.1 ETH sent to 0xabc...1234</li>
        <li class="list-group-item">0.05 ETH received from 0xdef...5678</li>
    `;
});

sendButton.addEventListener('click', async () => {
    const recipient = recipientInput.value;
    const amount = amountInput.value;

    if (!recipient || !amount) {
        alert('Please enter recipient address and amount.');
        return;
    }

    try {
        const transactionHash = await web3.eth.sendTransaction({
            from: userAccount,
            to: recipient,
            value: web3.utils.toWei(amount, 'ether')
        });
        transactionStatus.innerText = `Transaction successful: ${transactionHash}`;
        transactionStatus.classList.add('text-success');
    } catch (error) {
        transactionStatus.innerText = `Transaction failed: ${error.message}`;
        transactionStatus.classList.add('text-danger');
    }
});
