async function loadBalances() {

  const wallets = [

    {
      chain: 'TRC',
      token: 'TRX',
      balance: 'Loading...'
    },

    {
      chain: 'TRC',
      token: 'USDT',
      balance: 'Loading...'
    },

    {
      chain: 'TON',
      token: 'TON',
      balance: 'Loading...'
    },

    {
      chain: 'TON',
      token: 'USDT',
      balance: 'Loading...'
    }

  ];

  const tbody =
    document.querySelector(
      '#walletTable tbody'
    );

  tbody.innerHTML = '';

  wallets.forEach(item => {

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${item.chain}</td>
      <td>${item.token}</td>
      <td>${item.balance}</td>
    `;

    tbody.appendChild(row);

  });

}

loadBalances();
