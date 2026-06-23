const wallets = [
  { chain: 'TRC', token: 'TRX', address: 'TYaSMBp1yj22VeX2CufWn63vTf5C2BKQND' },

  { chain: 'TON', token: 'TON', address: 'EQDo1vubs16adUwpkstZN1vNXHnHY2_NeLZIUlwmRwiFvosO' },

  { chain: 'ERC', token: 'USDT', address: '0xe9DF5E1BFE0Ec36b3a6a2558b9e919753CeBE703' },

  { chain: 'ERC', token: 'USDC', address: '0xe9DF5E1BFE0Ec36b3a6a2558b9e919753CeBE703' },

  { chain: 'ETH', token: 'ETH', address: '0xBE209792E014c0fAD1EDf88C80C60C8cC864322B' }
];

async function getTRXBalance(address) {
  const res = await fetch(
    `https://api.trongrid.io/v1/accounts/${address}`
  );

  const data = await res.json();

  return (
    Number(data.data?.[0]?.balance || 0) / 1e6
  ).toFixed(6);
}

async function getTONBalance(address) {
  const res = await fetch(
    `https://toncenter.com/api/v2/getAddressBalance?address=${address}`
  );

  const data = await res.json();

  return (
    Number(data.result || 0) / 1e9
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

async function getERC20Balance(address, tokenAddress, decimals = 6) {

  const res = await fetch(
    `https://api.ethplorer.io/getAddressInfo/${address}?apiKey=freekey`
  );

  const data = await res.json();

  const token = data.tokens?.find(
    t =>
      t.tokenInfo?.address?.toLowerCase() ===
      tokenAddress.toLowerCase()
  );

  if (!token) {
    return '0.000000';
  }

  return (
    Number(token.balance) /
    Math.pow(10, decimals)
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

      else if (
        w.chain === 'ERC' &&
        w.token === 'USDT'
      ) {
        balance =
          await getERC20Balance(
            w.address,
            '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            6
          );
      }

      else if (
        w.chain === 'ERC' &&
        w.token === 'USDC'
      ) {
        balance =
          await getERC20Balance(
            w.address,
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            6
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
