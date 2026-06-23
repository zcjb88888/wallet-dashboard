async function getTRXBalance(address) {

  const url =
    `https://api.trongrid.io/v1/accounts/${address}`;

  const response = await fetch(url);

  const data = await response.json();

  if (
    !data.data ||
    data.data.length === 0
  ) {
    return 0;
  }

  return (
    Number(data.data[0].balance || 0)
    / 1000000
  ).toFixed(6);
}

async function loadBalances() {

  const wallets = [

    {
      chain: 'TRC',
      token: 'TRX',
      address: 'TYaSMBp1yj22VeX2CufWn63vTf5C2BKQND'
    },

    {
      chain: 'TRC',
      token: 'USDT'
    },

    {
      chain: 'TON',
      token: 'TON'
    },

    {
      chain: 'TON',
      token: 'USDT'
    }

  ];

  const tbody =
    document.querySelector(
      '#walletTable tbody'
    );

  tbody.innerHTML = '';

  for (const item of wallets) {

    let balance = 'Loading...';

    if (
      item.chain === 'TRC' &&
      item.token === 'TRX'
    ) {
      try {
        balance =
          await getTRXBalance(
            item.address
          );
      } catch (e) {
        balance = 'ERROR';
      }
    }

    const row =
      document.createElement('tr');

    row.innerHTML = `
      <td>${item.chain}</td>
      <td>${item.token}</td>
      <td>${balance}</td>
    `;

    tbody.appendChild(row);
  }

}

loadBalances();
