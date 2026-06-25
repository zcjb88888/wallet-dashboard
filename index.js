// ========================
// 📦 引入第三方区块链库 (统一采用 ESM 语法，防止冲突)
// ========================
import { TronWeb } from 'tronweb';
import { ethers } from 'ethers';

// ========================
// 💰 钱包定义 (保持你的原始配置未动)
// ========================
const WALLETS = [
  { id: 'TRC', type: 'USDT', chain: 'TRC', address: 'TRmtrUrQzcxGqUCa6fq3K5JuUTDpE3BGtZ', range: 'F5', owner: 'TYaSMBp1yj22VeX2CufWn63vTf5C2BKQND' },
  { id: 'TRX', type: 'TRX', chain: 'TRC', address: 'TYaSMBp1yj22VeX2CufWn63vTf5C2BKQND', range: 'G5' },
  { id: 'TON', type: 'USDT', chain: 'TON', address: 'EQBKtAyErebY9U0aUFeZl1bX8ob4I7eItauQzBp6K1tRaly7', range: 'M5', master: 'EQCxE6mUtQJKFnGfaROTKOt1lZbDiiX1kCixRv7Nw2Id_sDs' },
  { id: 'TON', type: 'TON', chain: 'TON', address: 'EQDo1vubs16adUwpkstZN1vNXHnHY2_NeLZIUlwmRwiFvosO', range: 'N5' },
  { id: 'ERC', type: 'USDT', chain: 'ERC', address: '0xe9DF5E1BFE0Ec36b3a6a2558b9e919753CeBE703', range: 'T5' },
  { id: 'ERC', type: 'USDC', chain: 'ERC', address: '0xe9DF5E1BFE0Ec36b3a6a2558b9e919753CeBE703', range: 'Y5' },
  { id: 'ETH', type: 'ETH', chain: 'ERC', address: '0xBE209792E014c0fAD1EDf88C80C60C8cC864322B', range: 'Z5' },
  { id: 'BSC', type: 'USDT', chain: 'BSC', address: '0x892D65d57B9Cabf26A4bd6D11b5C245A72406220', range: 'AF5' },
  { id: 'BSC', type: 'USDC', chain: 'BSC', address: '0x892D65d57B9Cabf26A4bd6D11b5C245A72406220', range: 'AK5' },
  { id: 'BSC', type: 'BNB', chain: 'BSC', address: '0xBE209792E014c0fAD1EDf88C80C60C8cC864322B', range: 'AL5' },
  { id: 'SOL', type: 'USDC', chain: 'SOL', address: '8wAhQkunQsKV36RPUFeDAZAoAawEj9SiDFWAdtm5S9G6', range: 'AR5' },
  { id: 'SOL', type: 'SOL', chain: 'SOL', address: '3B3ZqLcRBDuheELrzUqVz8yRvoNA4Gi2Bokdf2u7izRN', range: 'AS5' }
];

// ========================
// 🌐 实例化区块链节点
// ========================
const tronWeb = new TronWeb({ fullHost: 'https://api.trongrid.io', privateKey: '01'.repeat(32) });
const bscProvider = new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
const SOL_RPC = 'https://api.mainnet-beta.solana.com';

// ========================
// 📡 链数据获取核心函数 (少改动，仅适配 fetch 异步请求)
// ========================
async function fetchTRC_USDT(addr, owner) { try { const contract = await tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'); const res = await contract.methods.balanceOf(addr).call({ from: owner }); return Number(res) / 1e6; } catch { return null; } }
async function fetchTRX(addr) { try { return Number(await tronWeb.trx.getBalance(addr)) / 1e6; } catch { return null; } }
async function fetchTON_Native(addr) { try { const res = await fetch(`https://toncenter.com/api/v2/getAddressBalance?address=${addr}`).then(r => r.json()); return Number(res.result) / 1e9; } catch { return null; } }
async function fetchTON_USDT(addr, master) { try { const res = await fetch(`https://toncenter.com/api/v3/jetton/wallets?address=${addr}&jetton_address=${master}`).then(r => r.json()); const bal = res.jetton_wallets?.[0]?.balance ?? '0'; return Number(bal) / 1e6; } catch { return null; } }
async function fetchETH_Native(addr) { try { const res = await fetch(`https://api.ethplorer.io/getAddressInfo/${addr}?apiKey=freekey`).then(r => r.json()); return res.ETH?.balance || 0; } catch { return null; } }
async function fetchERC20(owner, token) { try { const res = await fetch(`https://api.ethplorer.io/getAddressInfo/${owner}?apiKey=freekey`).then(r => r.json()); const t = res.tokens?.find(x => x.tokenInfo?.address.toLowerCase() === token.toLowerCase()); return t ? Number(t.balance) / 1e6 : 0; } catch { return null; } }
async function fetchBSC_Native(addr) { try { return Number(ethers.formatEther(await bscProvider.getBalance(addr))); } catch { return null; } }
async function fetchBEP20(owner, token) { try { const abi = ["function balanceOf(address owner) view returns (uint256)"]; const contract = new ethers.Contract(token, abi, bscProvider); const balance = await contract.balanceOf(owner); return Number(balance) / 1e18; } catch { return null; } }
async function fetchSOL_Native(addr) { try { const res = await fetch(SOL_RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getBalance', params: [addr] }) }).then(r => r.json()); return (res.result?.value ?? 0) / 1e9; } catch { return null; } }
async function fetchSOL_USDC(acc) { try { const res = await fetch(SOL_RPC, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getAccountInfo', params: [acc, { encoding: 'jsonParsed' }] }) }).then(r => r.json()); const info = res.result?.value?.data?.parsed?.info; return info ? Number(info.tokenAmount.amount) / 10 ** info.tokenAmount.decimals : 0; } catch { return null; } }

const round6 = n => n == null ? null : Math.round(n * 1e6) / 1e6;

// ========================
// 🌍 Cloudflare Worker 标准入口
// ========================
export default {
  async fetch(request, env, ctx) {
    const results = [];

    // 执行对账循环，仅获取链上余额
    for (const w of WALLETS) {
      let chainRaw = null;
      if (w.chain === 'TRC') {
          chainRaw = (w.type === 'USDT') ? await fetchTRC_USDT(w.address, w.owner) : await fetchTRX(w.address);
      } else if (w.chain === 'TON') {
          chainRaw = (w.type === 'USDT') ? await fetchTON_USDT(w.address, w.master) : await fetchTON_Native(w.address);
      } else if (w.chain === 'ERC') {
          if (w.type === 'ETH') chainRaw = await fetchETH_Native(w.address);
          else if (w.type === 'USDT') chainRaw = await fetchERC20(w.address, '0xdAC17F958D2ee523a2206206994597C13D831ec7');
          else if (w.type === 'USDC') chainRaw = await fetchERC20(w.address, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48');
      } else if (w.chain === 'BSC') {
          if (w.type === 'BNB') chainRaw = await fetchBSC_Native(w.address);
          else if (w.type === 'USDT') chainRaw = await fetchBEP20(w.address, '0x55d398326f99059fF775485246999027B3197955');
          else if (w.type === 'USDC') chainRaw = await fetchBEP20(w.address, '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d');
      } else if (w.chain === 'SOL') {
          chainRaw = (w.type === 'USDC') ? await fetchSOL_USDC(w.address) : await fetchSOL_Native(w.address);
      }

      const chainVal = round6(chainRaw);
      results.push({ id: `${w.chain}-${w.type}`, val: chainVal ?? 0 });
    }

    // 生成一键复制文本（Tab隔开，方便直接贴入谷歌表格一行）
    const copyText = results.map(r => r.val).join('\t');

    // 生成前端 HTML
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>链上余额实时查询</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background: #f5f7fa; color: #333; }
        .card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        h2 { margin-top: 0; color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 10px; text-align: center; }
        .balance-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; font-size: 16px; }
        .balance-item span:first-child { font-weight: bold; color: #475569; }
        .balance-item span:last-child { font-family: "Courier New", monospace; color: #10b981; font-weight: bold; font-size: 18px; }
        .btn { display: block; width: 100%; padding: 14px; background: #3b82f6; color: white; border: none; border-radius: 6px; font-size: 16px; font-weight: bold; cursor: pointer; margin-top: 25px; text-align: center; transition: background 0.2s; }
        .btn:hover { background: #2563eb; }
        .tips { font-size: 13px; color: #94a3b8; text-align: center; margin-top: 12px; line-height: 1.5; }
      </style>
    </head>
    <body>
      <div class="card">
        <h2>💰 实时链上余额查询</h2>
        <div id="list">
          ${results.map(r => `
            <div class="balance-item">
              <span>${r.id}</span>
              <span>${r.val.toFixed(6)}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn" onclick="copyToClipboard()">📋 一键复制链上余额</button>
        <p class="tips">提示：点击复制后，直接在你的 Google 对账表格对应的【链上余额】第一个格子中按下 <b>Ctrl+V (或 Cmd+V)</b>，数据就会自动按顺序横向填入。附带复制内容：<br><small style="color:#64748b">${copyText}</small></p>
      </div>

      <script>
        function copyToClipboard() {
          const text = \`${copyText}\`;
          navigator.clipboard.writeText(text).then(() => {
            alert('🎉 复制成功！快去谷歌表格中粘贴对账吧。');
          }).catch(err => {
            alert('❌ 复制失败，请赋予浏览器剪贴板权限，或手动选择复制。');
          });
        }
      </script>
    </body>
    </html>
    `;

    return new Response(html, {
      headers: { 'Content-Type': 'text/html;charset=UTF-8' }
    });
  }
};
