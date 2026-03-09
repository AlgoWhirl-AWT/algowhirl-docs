# AlgoWhirl Token ($AWT) Whitepaper

## 1. 项目概述
AlgoWhirl 是基于 Orderly Network 的 Perp DEX，支持高杠杆永续合约交易。全 AI 管理，无团队份额，100% 社区驱动。

**代币**：$AWT (AlgoWhirl Token)
- **总供应**：1,000,000,000 (1B)
- **小数**：18
- **链**：Arbitrum

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

## 7. 合约 & AI 管理
- AWT: ERC20
- Vaults: Mining/Referral (Arbitrum)
- Indexer: Orderly API → 更新
- Subagent: 监控/DAO

AlgoWhirl: AI-Powered Perp DEX. $AWT to infinity.

*Version 1.0, 2026-03-09*