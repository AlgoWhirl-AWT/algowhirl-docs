# AlgoWhirl Token ($AWT) Whitepaper

## 1. 项目概述
AlgoWhirl 是基于 Orderly Network 的 Perp DEX，支持高杠杆永续合约交易。全 AI 管理，无团队份额，100% 社区驱动。

**代币**：$AWT (AlgoWhirl Token)
- **总供应**：1,000,000,000 (1B)
- **小数**：18
- **链**：Base (Chain ID: 8453)
- **合约**：`0x4365B7cDA1250B6962e1F139E6AE548A31263655`

## 2. Tokenomics (分配)
| 类别 | 比例 | 数量 | 规则 |
|------|------|------|------|
| 早期空投 | 10% | 100M | TGE 快照 (前1k用户) |
| 交易挖矿 (非MM) | 50% | 500M | 2.5年线性, Halving 12月 |
| 任务空投 | 10% | 100M | 任务完成 |
| LP | 15% | 150M | TGE 50% + 线性 |
| DAO | 5% | 50M | AI投票 |
| 渠道邀请 | 10% | 100M | 返佣 + 积分解锁 |

TGE 流通: 25%

## 3. 手续费 (0.07%)
- Maker: 0.02%
- Taker: 0.05%
- 分配:
  - 0.04% (Maker 0.02% + Taker 0.02%): 返佣 0.01%*2 (有邀) / 回购 0.02%*2 (无邀)
  - 0.03% (Taker 后): MM 激励

回购: TWAP 买 $AWT → 烧50%/LP50%

## 4. 交易挖矿 (50%, 非MM)
积分 = Vol * Multiplier (Maker 1.5x)
日池 = min(547k, Vol * 0.0008)
Claim: 周, vesting 7天

## 5. 邀请渠道 (10%)
- 返佣: 即时 0.01%*2 ($AWT)
- 积分: 被邀 Vol * 0.001, 每日解锁 (30天 vesting)

## 6. 经济模拟 (Vol $156k/日)
| 月 | Vol | 返佣 | 回购 | APY |
|----|-----|------|------|-----|
| 1 | $4.7M | $47k | $47k | 160% |
| 12 | $200M | $2M | $2M | 22% |

## 7. 合约地址 (Base Mainnet, Chain ID: 8453)

| 合约 | 地址 | 说明 |
|------|------|------|
| AWT Token | `0x4365B7cDA1250B6962e1F139E6AE548A31263655` | ERC-20, 总量 1B |
| TokenDistributor | `0x64dd27DdB5D266Ed29059C4296D183126A3f77a2` | 代币分发 |
| MiningRewardsVault | `0xb32e3164eb8a72ac59673998F8EdFC89c94E9BDE` | 交易挖矿 500M AWT |
| LPFarming | `0x7CeD4ee8DAbaE7820f8DCE9396389b4106E71375` | LP 挖矿 150M AWT, 3年释放 |
| LiquidityVault | `0xbd95191388f7Ede6CD317f3233eD3384E83d80BA` | 流动性挖矿 15% |
| ReferralVault | `0xb6AE025b99933ea81ABA0ab5c95Bdd48674E6141` | 推荐奖励 10% |
| EarlyUsersVault | `0x99e71D124A9441d0245826978dBc55FB9bF1835B` | 早期用户 10% |
| GrowthVault | `0x28b92ef067331C9887b9baDd54b21784051ef8e7` | 增长活动 10% |
| DAOTreasury | `0x9c7213F7EfD54c5a2dc6098E24c550Eb7e59052C` | DAO 金库 5% |
| Gnosis Safe (Owner) | `0x2283D5dC7D9161405907913d69662BC69a0Ac8bD` | 2/2 多签，所有合约 owner |

所有合约均部署在 **Base 主网**，可通过 [Basescan](https://basescan.org) 验证。

## 8. AI 管理架构
- **Indexer**: 实时抓取 Orderly API 数据 → 更新链上奖励
- **Subagent**: 自动监控、DAO 投票执行
- **多签治理**: 2/2 Gnosis Safe，所有关键操作需多签确认
- **无团队份额**: 100% 代币通过协议规则分配给社区

AlgoWhirl: AI-Powered Perp DEX. $AWT to infinity.

*Version 1.1, 2026-03-21*
