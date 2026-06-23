const wallets = [
  {
    chain: 'TRC',
    token: 'TRX',
    address: 'TYaSMBp1yj22VeX2CufWn63vTf5C2BKQND'
  },
  {
    chain: 'TON',
    token: 'TON',
    address: 'EQDo1vubs16adUwpkstZN1vNXHnHY2_NeLZIUlwmRwiFvosO'
  },
  {
    chain: 'TON',
    token: 'USDT',
    address: 'EQBKtAyErebY9U0aUFeZl1bX8ob4I7eItauQzBp6K1tRaly7'
  },
  {
    chain: 'ERC',
    token: 'USDT',
    address: '0xe9DF5E1BFE0Ec36b3a6a2558b9e919753CeBE703'
  },
  {
    chain: 'ERC',
    token: 'USDC',
    address: '0xe9DF5E1BFE0Ec36b3a6a2558b9e919753CeBE703'
  },
  {
    chain: 'ETH',
    token: 'ETH',
    address: '0xBE209792E014c0fAD1EDf88C80C60C8cC864322B'
  },
  {
    chain: 'BSC',
    token: 'BNB',
    address: '0xBE209792E014c0fAD1EDf88C80C60C8cC864322B'
  },
  {
    chain: 'SOL',
    token: 'SOL',
    address: '3B3ZqLcRBDuheELrzUqVz8yRvoNA4Gi2Bokdf2u7izRN'
  }
];

async function getTRXBalance(address) {
  const res = await fetch(
    `https://api.trongrid.io/v1/accounts/${address}`
  );

  const data = await res.json();

  return (
    Number(data.data?.[0]?.balance || 0) / 1000000
  ).toFixed(6);
}

async function getTONBalance(address) {
  const res = await fetch(
    `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
  );

  const data = await res.json();

  return (
    Number(data.result || 0) / 1000000000
  ).toFixed(6);
}

async function getETHBalance(address) {
  const res = await fetch(
    `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
  );

  const data = await res.json();

  return Number(
    data.ETH?.balance || 0
  ).toFixed(6);
}

async function loadBalances() {

  const tbody =
    document.querySelector('#walletTable tbody');

  tbody.innerHTML = '';

  for (const w of wallets) {

    let balance = 'N/A';

    try {

      if (
        w.chain === 'TRC' &&
        w.token === 'TRX'
      ) {
        balance =
          await getTRXBalance(
            w.address
          );
      }

      else if (
        w.chain === 'TON' &&
        w.token === 'TON'
      ) {
        balance =
          await getTONBalance(
            w.address
          );
      }

      else if (
        w.chain === 'ETH' &&
        w.token === 'ETH'
      ) {
        balance =
          await getETHBalance(
            w.address
          );
      }

    } catch (err) {

      console.error(
        `${w.chain}-${w.token}`,
        err
      );

      balance = 'ERROR';
    }

    const row =
      document.createElement('tr');

    row.innerHTML = `
      <td>${w.chain}</td>
      <td>${w.token}</td>
      <td>${balance}</td>
    `;

    tbody.appendChild(row);
  }
}

loadBalances();
