/**
 * 真实投研对话沉淀与标的深度研思画布库 (Distilled from WorkBuddy & Antigravity Authentic History)
 * 涵盖 18 大核心研思工程：
 * [半导体与先进制程]
 *  1. 拓荆科技 (688072.SH) vs 北方华创：薄膜沉积与混合键合壁垒
 *  2. 中际旭创 vs AAOI：光模块800G/1.6T与台积电 3nm/5nm DSP 制程代工
 *  3. BESI vs AMAT vs KLA：先进封装混合键合与 HBM 资本开支周期
 *  4. 全球存储六强估值与周期标尺：美光/海力士/三星/闪迪/西数/长鑫
 *  5. 西安奕材 (688783.SH)：12英寸大硅片国产替代与折旧利润拐点
 *  6. 芯片先进制程晶体管密度 MTr/mm²：破除纳米营销与CapEx拐点
 * [美股AI算力]
 *  7. 希捷科技 (STX) vs 西部数据 (WDC)：存储周期与AI冷热分层近线海量存储
 *  8. 博通 (AVGO)：业绩预期、定制ASIC爆发与以太网交换芯片替代
 *  9. Marvell (MRVL)：AI互连I/O、PAM4 DSP与定制ASIC造血机制
 * [美股软件与SaaS]
 * 10. 软件行业 AI 受益与受损分化全景框架 (CRM/SAP/SNOW/NET/PLTR)
 * 11. Snowflake (SNOW)：云原生数据底座、按用量计费与AI数据云
 * 12. CrowdStrike (CRWD)：Falcon单Agent壁垒、Rule of 63%与买方估值锚点
 * 13. Cloudflare (NET)：How They Make Money 财务拆解与边缘网络
 * 14. Palantir (PLTR)：FDE前向部署工程师、Ontology本体与AIP商业杠杆
 * 15. 美股网络安全全景图谱：端点XDR、零信任SASE与网安巨头竞合
 * [A股与港股 / 周期与大宗]
 * 16. A股稳定高自由现金流企业挖掘 (连续3年 FCFF ≥ 5亿 & PE ≤ 15x)
 * 17. 重庆机电 (02722.HK)：股息率持续性分析与合资发动机现金奶牛
 * 18. 糖业产业链供需与大宗周期：巴西糖醇比切换与国内自产缺口
 */

import { normalizeCanvasProject } from '../services/canvasNormalizer';

const RAW_CANVASES = [
  {
    "id": "proj-tuojing",
    "title": "拓荆科技 (688072.SH) 薄膜沉积壁垒与先进制程渗透测算",
    "category": "半导体与先进制程",
    "createdAt": "2026-10-15T09:00:00.000Z",
    "updatedAt": "2026-10-29T14:30:00.000Z",
    "viewport": {
      "x": 80,
      "y": 110,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "tj-q1",
        "type": "question",
        "roleId": "devil-advocate",
        "content": "对比半导体薄膜沉积中 CVD 与 ALD 的工艺极限差异。拓荆科技在哪些先进制程环节具备不可替代性？又在哪些环节面临客户扶持二供压价？",
        "x": 100,
        "y": 160,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "tj-a1",
        "type": "answer",
        "content": "### 核心结论与博弈拆解\n\n1. **工艺极限与物理壁垒分水岭**：\n   - **PECVD/SACVD**：成膜速率 200~400 nm/min，用于层间介质膜（ILD/IMD）。拓荆在成熟晶圆厂国产化率已超 65%，但技术边际壁垒已转入工程降本与腔体产能（Throughput）竞争。\n   - **ALD (原子层沉积)**：单原子层自限制反应，厚度公差 < 0.1 nm，台阶覆盖率 100%。在 3D DRAM 电容介质（High-k ZrO2/Al2O3）与垂直 GAA 环绕栅极中为物理唯一选择。\n\n2. **客户扶持二供与压价风险**：\n   - **二供分流**：国内晶圆厂在成熟 PECVD 环节正引入北方华创等厂商进行竞价，机台毛利率由早期的 52% 面临向 45%~48% 区间承压。\n   - **高不可替代性锚点**：Thermal ALD 突破先进制程存储 High-k 栅氧层，以及应用于先进封装的 Wafer-to-Wafer / Die-to-Wafer 混合键合（Hybrid Bonding）设备，仍处强独供周期。",
        "reasoning": "分析逻辑：\n1. 梳理 CVD 与 ALD 微观物理机制；\n2. 剥离成熟制程与先进制程的产品毛利率区间；\n3. 从国内晶圆厂采购博弈角度定位降价压力与独供壁垒。",
        "x": 580,
        "y": 130,
        "width": 460,
        "height": 480,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "tj-q2",
        "type": "question",
        "roleId": "engineering-limits",
        "branchQuote": "Thermal ALD 突破先进制程存储 High-k 栅氧层，以及应用于先进封装的 Wafer-to-Wafer / Die-to-Wafer 混合键合（Hybrid Bonding）设备，仍处强独供周期",
        "content": "针对混合键合（Hybrid Bonding）设备，对标 BESi 与 ASMPT，拓荆在对准精度（Alignment < 100nm）与颗粒度（Particle）上的工程差距与产线验证进展如何？",
        "x": 1100,
        "y": 160,
        "width": 420,
        "height": 220,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "tj-a2",
        "type": "answer",
        "content": "### 混合键合工程物理指标与客户验证\n\n- **对准精度（Overlay）**：BESi Ultra 系列可实现 < 50 nm 级热膨胀动态自适应对准；拓荆当前量产机台对准精度维持在 100~150 nm 区间，正攻坚 < 100 nm 验证机。\n- **表面粗糙度与颗粒缺陷**：键合前预处理介质层（SiO2/SiCN）表面粗糙度 Ra 需控制在 < 0.5 nm，否则易产生微观未贴合空泡。\n- **量产落地节奏**：国内龙头 CIS 与 3D 堆叠客户已进入小批量产线爬坡（Pilot Run），商业订单落地预计滞后于海外 2~3 个季度。",
        "x": 1580,
        "y": 160,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      },
      {
        "id": "tj-q3",
        "type": "question",
        "roleId": "forensic-finance",
        "branchQuote": "国内晶圆厂在成熟 PECVD 环节正引入北方华创等厂商进行竞价，机台毛利率由早期的 52% 面临向 45%~48% 区间承压",
        "content": "若二供压价导致成熟PECVD毛利率下行3-5个百分点，公司2028E 32x PE的估值锚点在什么出货规模下具备足够安全边际？",
        "x": 1100,
        "y": 430,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "tj-a3",
        "type": "answer",
        "content": "### 敏感性财务测算（2028E 估值中枢）\n\n- **基准假设**：假设 2028 年国内晶圆扩产达每年 120 万片等效 12 寸产能，设备国产化率 75%。\n- **毛利率敏感性**：\n  - 毛利率 50%：年净利润约 18.2 亿元，对应 2028E 32x PE 市值为 582 亿元；\n  - 毛利率下移至 46%：净利润压缩至 14.8 亿元，合理市值降至 474 亿元。\n- **买方买入安全边际价格**：若不计新产品期权，回撤至 420~450 亿区间（对应当前价格折让 18%）提供充分安全边际。",
        "x": 1580,
        "y": 430,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "tj-e1",
        "fromId": "tj-q1",
        "toId": "tj-a1"
      },
      {
        "id": "tj-e2",
        "fromId": "tj-a1",
        "toId": "tj-q2",
        "quote": "Thermal ALD 突破先进制程存储 High-k 栅氧层...仍处强独供周期"
      },
      {
        "id": "tj-e3",
        "fromId": "tj-q2",
        "toId": "tj-a2"
      },
      {
        "id": "tj-e4",
        "fromId": "tj-a1",
        "toId": "tj-q3",
        "quote": "国内晶圆厂在成熟 PECVD 环节正引入北方华创等厂商进行竞价...毛利率承压"
      },
      {
        "id": "tj-e5",
        "fromId": "tj-q3",
        "toId": "tj-a3"
      }
    ]
  },
  {
    "id": "proj-stx-wdc",
    "title": "希捷科技 (STX) vs 西部数据 (WDC) 存储周期与近线海量存储",
    "category": "美股AI算力",
    "createdAt": "2026-09-21T14:52:00.000Z",
    "updatedAt": "2026-10-28T16:00:00.000Z",
    "viewport": {
      "x": 60,
      "y": 90,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "sw-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "希捷科技（STX）和西部数据（WDC）现在市场对他们的预期如何？行业格局如何？AI时代冷热分层语料库对大容量HDD的TCO冲击何在？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "sw-a1",
        "type": "answer",
        "content": "### 核心买方结论\n\n1. **赛道定性**：AI算力基建从“纯算力（GPU/HBM）”向“海量多模态语料库（冷热分层架构）”扩散。高密度近线（Nearline）大容量机械硬盘（HDD）凭借**每TB成本仅为企业级SSD的 1/5～1/6 及更优的 TCO（总体拥有成本）**，在长期沉淀训练语料中不可替代。\n\n2. **标的差异化定位**：\n   - **希捷（STX）**：**纯度最高、HAMR先发优势明显**。率先实现 Mozaic HAMR（热辅助磁记录，30TB～44TB+）规模量产，单盘面密度与溢价能力强，毛利率突破 35%~38% 历史高位。\n   - **西部数据（WDC）**：**双轮驱动、兼具分拆重估与稳健路线**。HDD业务主打成熟度更高的 ePMR/UltraSMR 稳健过渡方案；同时拥有 NAND Flash/SSD 业务享受闪存周期上行与分拆重估溢价。",
        "reasoning": "分析逻辑：\n1. 拆解企业级SSD与大容量近线HDD的单位$/TB与电耗TCO；\n2. 对比HAMR技术成熟度与ePMR/UltraSMR的商用节奏；\n3. 梳理云厂商Hyperscalers资本开支从计算向海量存储延伸的订单持续性。",
        "x": 560,
        "y": 110,
        "width": 460,
        "height": 450,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "sw-q2",
        "type": "question",
        "roleId": "engineering-limits",
        "branchQuote": "率先实现 Mozaic HAMR（热辅助磁记录，30TB～44TB+）规模量产，单盘面密度与溢价能力强",
        "content": "HAMR（热辅助磁记录）在激光二极管热可靠性、介质FePt颗粒均匀性上是否存在早期失效率高的风险？与WDC的UltraSMR相比良率差异多大？",
        "x": 1080,
        "y": 140,
        "width": 420,
        "height": 210,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "sw-a2",
        "type": "answer",
        "content": "### 物理极限与工程可靠性剖析\n\n- **微观物理机制**：HAMR 采用 FePt（铁铂）合金磁介质，常温下各向异性极高（防止超顺磁效应导致数据丢失），写入时用纳米级激光局部加热至居里点（~450°C），写入后皮秒级冷却。\n- **激光二极管可靠性**：希捷测试数据显示近场换能器（NFT）寿命已突破百万写入小时，但超大规模云厂商在部署初期采用“双轨验证”，小批量混跑至少 2~3 个季度。\n- **竞争博弈**：WDC 避开 HAMR 初期良率爬坡陷阱，用 ePMR + 28TB UltraSMR 锁住保守型客户，等 32TB 以后再切入商用 HAMR，二者毛利剪刀差在 30TB 节点达到峰值。",
        "x": 1560,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "sw-e1",
        "fromId": "sw-q1",
        "toId": "sw-a1"
      },
      {
        "id": "sw-e2",
        "fromId": "sw-a1",
        "toId": "sw-q2",
        "quote": "率先实现 Mozaic HAMR（热辅助磁记录，30TB～44TB+）规模量产"
      },
      {
        "id": "sw-e3",
        "fromId": "sw-q2",
        "toId": "sw-a2"
      }
    ]
  },
  {
    "id": "proj-saas-framework",
    "title": "软件行业 AI 受益与受损分化全景框架 (CRM/SAP/SNOW/NET/PLTR)",
    "category": "美股软件与SaaS",
    "createdAt": "2026-09-10T10:42:00.000Z",
    "updatedAt": "2026-10-25T11:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "sf-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "当下的软件行业，哪些会受益于AI，哪些受损于AI？席位制SaaS定价模式面临何种冲击？如何构建买方分类分析框架？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "sf-a1",
        "type": "answer",
        "content": "### 买方四象限分析框架\n\n核心逻辑：**大模型是算力消耗怪兽，而AI Agent是劳动力替代品。** 传统按人头计费（Seat-based）的SaaS面临“席位通缩”，按实际用量（Consumption-based）计费的底层基础设施将迎来超额利润。\n\n1. **重度受益（核心基础设施/按用量计费）**：\n   - **标的**：Snowflake (SNOW)、Cloudflare (NET)、Databricks。\n   - **因果**：AI推理与微调产生海量数据流动与API调用，以计算CU或流量计费，完美享受AI调用量指数爆发。\n\n2. **重度受益（高壁垒特种系统/成果计费）**：\n   - **标的**：Palantir (PLTR)。\n   - **因果**：Ontology（企业本体架构）沉淀深，AIP能直接转化为企业作战工作流，按业务落地成效收取高额平台费用。\n\n3. **受损与被迫转型（轻量通用席位制SaaS）**：\n   - **标的**：Salesforce (CRM)、HubSpot、各类客服与文案SaaS。\n   - **因果**：AI Agent让原本需要10个客服/销售的工作由1个监督员+Agent完成，席位采购总数缩减，被迫转向按Conversation/Token计费转型期阵痛。",
        "reasoning": "分析逻辑：\n1. 剖析Seat-based定价与AI Agent替代人工的根本矛盾；\n2. 区分Data/Infra层（按量收费）与Application层（席位收费）；\n3. 梳理估值乘数重构的敏感性。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "sf-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "传统按人头计费（Seat-based）的SaaS面临“席位通缩”，被迫转向按Conversation/Token计费转型期阵痛",
        "content": "Salesforce推出Agentforce按每次对话$2收费，能否抵消席位缩减损失？客户会否转向开源轻量框架自建？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "sf-a2",
        "type": "answer",
        "content": "### 商业博弈与转型阻力\n\n- **单位经济模型倒挂**：原企业版席位约 $150/人/月。若一个 Agent 替代 3 名初级员工，CRM 需从该客户每月产生 > $450 的 Agent 交互费才能打平收入。\n- **数据主权与围墙花园**：头部客户不愿将核心客户私密数据传输至公有 SaaS Agent，更倾向将数据留在 Snowflake/Databricks 私有湖仓，在本地调度开源模型（如 Llama 3/Qwen）。\n- **结论**：传统应用层 SaaS 估值倍数将从历史 12-15x EV/Sales 永久性压缩至 5-8x EV/Sales。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "sf-e1",
        "fromId": "sf-q1",
        "toId": "sf-a1"
      },
      {
        "id": "sf-e2",
        "fromId": "sf-a1",
        "toId": "sf-q2",
        "quote": "传统按人头计费的SaaS面临“席位通缩”...转向按Conversation/Token计费"
      },
      {
        "id": "sf-e3",
        "fromId": "sf-q2",
        "toId": "sf-a2"
      }
    ]
  },
  {
    "id": "proj-broadcom-avgo",
    "title": "博通 (AVGO) 业绩预期、定制ASIC爆发与以太网交换芯片替代",
    "category": "美股AI算力",
    "createdAt": "2026-09-30T14:30:00.000Z",
    "updatedAt": "2026-10-28T10:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 90,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "av-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "机构对博通明年业绩的核心共识是什么？定制AI ASIC算力（谷歌TPU/Meta MTIA/OpenAI）与以太网网络芯片如何构成双引擎？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "av-a1",
        "type": "answer",
        "content": "### 买方核心结论与业绩基准\n\n1. **双引擎资产定位**：博通已确立**仅次于英伟达的全球第二大 AI 算力与高速互联核心资产地位**。其业绩由“定制 ASIC 爆发 + 800G/1.6T 以太网网络芯片全面渗透 + VMware 软件订阅变现”三重共振驱动。\n\n2. **硬数据业绩基准**：\n   - **营收体量**：机构一致预期博通 FY26 全财年营收将跨越 **$1,060亿 – $1,080亿美元**（YoY +65%~70%），向 FY27E 的 $1,735亿美元进发。\n   - **AI 半导体业务**：管理层与买方机构将 FY26 全年 AI 收入指引锚定在 **$580亿美元**，FY27E 翻倍至 **$1,100亿美元**。\n   - **三大云厂商客户**：谷歌（TPU v5p/v6e 独供定制）、Meta（MTIA 深度协同）、以及新签入的第三大 Hyperscaler 客户（市场普遍确认为 OpenAI/微软定制芯片），保障中长期算力份额。",
        "reasoning": "分析逻辑：\n1. 盘点博通AI收入占比及三大定制ASIC客户出货周期；\n2. 测算Tomahawk 5/6 51.2T交换机芯片替代InfiniBand份额；\n3. 评估VMware改版后的超高自由现金流转化率。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 480,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "av-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "谷歌（TPU v5p/v6e 独供定制）、Meta（MTIA 深度协同）、以及新签入的第三大 Hyperscaler 客户",
        "content": "联发科（MediaTek）与Marvell正极力争夺谷歌TPU及海外定制ASIC二供，博通在先进封装CoWoS产能分配与SerDes IP壁垒上能否防守住？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 210,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "av-a2",
        "type": "answer",
        "content": "### 护城河壁垒检验\n\n- **SerDes IP 统治力**：博通拥有全球最成熟的 224G PAM4 SerDes IP，并已完成 448G 物理层研发。其在超高速信号完整性与低误码率上的积累是任何对手在 2 年内无法超越的硬物理鸿沟。\n- **台积电晶圆与 CoWoS 配额话语权**：博通作为台积电前三大晶圆采购客户，锁定了充足的 CoWoS-R/CoWoS-L 先进封装产能，二线 ASIC 方案商受制于封装配额不足难以大规模交付。\n- **风险点**：毛利率受 ASIC 硬件出货占比增加轻微稀释（ASIC 毛利率约 55%~60%，低于传统博通网络芯片 70%+）。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "av-e1",
        "fromId": "av-q1",
        "toId": "av-a1"
      },
      {
        "id": "av-e2",
        "fromId": "av-a1",
        "toId": "av-q2",
        "quote": "谷歌、Meta以及新签入的第三大 Hyperscaler 客户定制ASIC"
      },
      {
        "id": "av-e3",
        "fromId": "av-q2",
        "toId": "av-a2"
      }
    ]
  },
  {
    "id": "proj-snowflake",
    "title": "Snowflake (SNOW) 深度基本面、按用量计费与AI数据底座",
    "category": "美股软件与SaaS",
    "createdAt": "2026-10-18T15:00:00.000Z",
    "updatedAt": "2026-10-27T17:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "sn-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "SNOW（Snowflake）股票基本面梳理：产品演进、按用量计费模式、竞争格局、行业空间、业绩增速与估值折价原因何在？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "sn-a1",
        "type": "answer",
        "content": "### 核心投资结论与数据画像\n\n1. **买方定性**：全球云原生数据基础设施龙头，正从纯“云数据仓库（Data Warehouse）”加速升级为“企业级 AI 与数据云（Data Cloud & AI Platform）”。\n2. **商业模式优势**：天然采用**按用量计费（Consumption-based）**，避开了 GenAI/AI Agent 对传统按席位付费（Seat-based SaaS）的杀席位通缩压力。\n3. **财务核心指标**：\n   - **毛利率（Non-GAAP）**：保持在 74%~77% 高位；\n   - **净收入留存率（NRR）**：在 127%~130% 区间触底反弹；\n   - **自由现金流（FCF Margin）**：稳定在 27%~29% 水平。\n4. **核心压制因素**：开源存储格式 Apache Iceberg 的采用使部分客户存储与计算进一步解耦，带来短期存储用量收入压制；前 CEO 离职与 Databricks 激烈竞争压低了短期估值倍数至 ~10x EV/Sales（历史低位分位）。",
        "reasoning": "分析逻辑：\n1. 梳理计算与存储分离架构；\n2. 测算Iceberg对存储收入的短期压制与长期开放生态红利；\n3. 评估Cortex AI对企业知识库RAG的用量拉动。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 500,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "sn-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "开源存储格式 Apache Iceberg 的采用使部分客户存储与计算进一步解耦，带来短期存储用量收入压制",
        "content": "Iceberg支持外部表直接查询后，客户是否会将大部分计算任务迁移回自建引擎，导致Snowflake沦为纯粹的按需调度器？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 210,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "sn-a2",
        "type": "answer",
        "content": "### 数据引力与转换成本检验\n\n- **计算引力依然成立**：尽管 Iceberg 允许外部引擎读取数据，但 Snowflake 的微分区优化（Micro-partitioning）、企业级权限管控（Data Governance）与跨云多租户共享功能具有强大粘性。\n- **增量收入来源**：通过 Cortex AI，非技术业务人员可以直接通过自然语言提问调用私有数据，直接将分析需求从传统的“数仓工程师”扩展至“全员业务调用”，推升底层计算 Credit 消耗。\n- **估值结论**：当 EV/Sales 回踩至 8-9x、增速企稳在 20%+ 时，具备显著非对称赔率。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "sn-e1",
        "fromId": "sn-q1",
        "toId": "sn-a1"
      },
      {
        "id": "sn-e2",
        "fromId": "sn-a1",
        "toId": "sn-q2",
        "quote": "开源存储格式 Apache Iceberg 使存储与计算进一步解耦"
      },
      {
        "id": "sn-e3",
        "fromId": "sn-q2",
        "toId": "sn-a2"
      }
    ]
  },
  {
    "id": "proj-crowdstrike",
    "title": "CrowdStrike (CRWD) Falcon单Agent壁垒、Rule of 63%与买方估值锚点",
    "category": "美股软件与SaaS",
    "createdAt": "2026-09-15T16:00:00.000Z",
    "updatedAt": "2026-10-26T18:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "cr-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "用买方投研视角深度剖析CrowdStrike（CRWD）：Falcon架构的技术壁垒、Rule of 40指标表现、7·19宕机事件后客户留存与估值重构路径如何？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "cr-a1",
        "type": "answer",
        "content": "### 机会卡与核心买方结论\n\n> **一句话结论**：**业务壁垒顶级（Rule of 63%），但当前估值透支未来2年预期（EV/TTM FCF 达 121x），买方视角建议「观察/不追高」，等待估值中枢回踩至 $180–$195（对应 EV/FCF ~60x）再行布局。**\n\n1. **技术护城河（单轻量Agent + 威胁图谱）**：\n   - 核心优势是运行在操作系统内核层的**单一轻量级传感器（Single Lightweight Agent）**，搭配云端 Threat Graph，每日处理数万亿级安全事件，具备强大的飞轮效应。\n2. **超预期财务指标（Rule of 63%）**：\n   - ARR 达 40 亿美元，同比增速 +32%；\n   - FCF Margin 达到 31%~33%，二者相加达 63%~65%，在千亿美元级软件股中绝无仅有。\n3. **7·19系统故障冲击后遗症**：\n   - 客户并未发生大规模流失（Churn率仍在 2% 以下），但新单销售周期（Sales Cycle）被迫拉长，给予客户的 Customer Commitment Packages（减免折扣/服务补偿）对毛利产生 150-200bps 压制。",
        "reasoning": "分析逻辑：\n1. 拆解单Agent架构与微软Defender、SentinelOne的技术壁垒差异；\n2. 财务三要素（ARR增速、FCF Margin、NRR）；\n3. 估值溢价与风险安全边际测算。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "cr-q2",
        "type": "question",
        "roleId": "forensic-finance",
        "branchQuote": "当前估值透支未来2年预期（EV/TTM FCF 达 121x），买方视角建议等待估值中枢回踩至 $180–$195",
        "content": "针对高估值但基本面极强的CRWD，是否适合运用FCN（固定票息票据）结构化产品进行安全垫建仓？具体的执行参数如何设计？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "cr-a2",
        "type": "answer",
        "content": "### FCN 结构化建仓方案设计\n\n- **标的适用性**：CRWD 隐含波动率（IV）常年在 40%~50% 区间，高 IV 为结构化衍生品提供了丰厚的权利金垫底。\n- **交易结构设计**：\n  - **挂钩标的**：CRWD.US；\n  - **行权挂钩期限**：3-6 个月；\n  - **执行敲入价（Strike / In-Barrier）**：现价 75%~80%（即 $190-$205 强支撑位）；\n  - **年化票息（Coupon）**：提供 15%~18% p.a. 确定性现金流；\n- **买方意图**：若未跌破 80% 敲入线，稳收年化 16% 现金流回报；若跌破敲入，则顺理成章以 $190 历史估值底仓位接盘高品质龙头。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "cr-e1",
        "fromId": "cr-q1",
        "toId": "cr-a1"
      },
      {
        "id": "cr-e2",
        "fromId": "cr-a1",
        "toId": "cr-q2",
        "quote": "当前估值透支未来2年预期...建议观察等待回踩"
      },
      {
        "id": "cr-e3",
        "fromId": "cr-q2",
        "toId": "cr-a2"
      }
    ]
  },
  {
    "id": "proj-cloudflare",
    "title": "Cloudflare (NET) How They Make Money 财务拆解与边缘网络",
    "category": "美股软件与SaaS",
    "createdAt": "2026-10-02T12:00:00.000Z",
    "updatedAt": "2026-10-27T14:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "net-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "按照 How They Make Money 风格拆解 Cloudflare（NET）：78%超高毛利密码、全球可编程边缘网络架构与 Workers AI 商业化潜力何在？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "net-a1",
        "type": "answer",
        "content": "### 500字买方核心结论（The TL;DR）\n\n**核心定性**：Cloudflare（NYSE: NET）绝非单纯的 CDN 或防 DDoS 工具商，其商业本质是**构建在公网底层的“数字收费站与全球可编程边缘织网”**。\n\n1. **78% 极致高毛利的工程秘密**：\n   - **Anycast 架构 + 白盒服务器**：全球 330+ 城市节点全部运行统一代码栈。一个机房既处理 CDN、又拦截 DDoS、同时执行 Workers 边缘函数，计算效率与带宽复用率远超传统云厂商。\n   - **免费换取极端流量规模**：用免费层吸引数百万小网站，反向作为其全网恶意流量探测雷达，其网络感知度高居全球首位。\n2. **三大飞轮收入流转**：\n   - **应用服务（CDN/DNS/WAF）**：占比 ~55%，提供基础现金流；\n   - **零信任网络（Cloudflare One/SASE）**：占比 ~30%，企业级 ARR 增速 40%+；\n   - **开发者平台与边缘 AI（Workers + Workers AI）**：占比 ~15%，按 CPU/GPU 执行毫秒计费，直接支持分布式轻量推理。",
        "reasoning": "分析逻辑：\n1. 拆解Anycast全局统一架构带来的硬件复用效率；\n2. 剖析How They Make Money现金流转瀑布；\n3. 评估Workers AI与GPU边缘推理的增量空间。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "net-q2",
        "type": "question",
        "roleId": "forensic-finance",
        "branchQuote": "开发者平台与边缘 AI（Workers + Workers AI）按 CPU/GPU 执行毫秒计费，直接支持分布式轻量推理",
        "content": "部署边缘GPU（如L4/L40S）的巨额资本开支，会否侵蚀Cloudflare原本引以为傲的高自由现金流？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "net-a2",
        "type": "answer",
        "content": "### 资本开支（CapEx）与现金流韧性检验\n\n- **非堆叠式 CapEx**：Cloudflare 不购买昂贵的 H100/B200 集群进行大模型预训练，而是仅在现有 CDN 节点服务器插槽中增配高能效推理卡（Nvidia L4/L40S），单节点硬件成本可控。\n- **CapEx / Revenue 比例控制**：历史 CapEx 占比控制在 10%~12% 区间，即使扩容 Workers AI，2026 年预测仍控制在 13% 以下。\n- **现金转化**：经营性现金流净额持续为正，自由现金流利润率维持在 12%~15% 并处上行通道。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "net-e1",
        "fromId": "net-q1",
        "toId": "net-a1"
      },
      {
        "id": "net-e2",
        "fromId": "net-a1",
        "toId": "net-q2",
        "quote": "开发者平台与边缘 AI 按毫秒计费...支持轻量推理"
      },
      {
        "id": "net-e3",
        "fromId": "net-q2",
        "toId": "net-a2"
      }
    ]
  },
  {
    "id": "proj-palantir",
    "title": "Palantir (PLTR) FDE前向部署工程师、Ontology本体与AIP商业杠杆",
    "category": "美股软件与SaaS",
    "createdAt": "2026-09-05T09:32:00.000Z",
    "updatedAt": "2026-10-25T15:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "pl-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "Palantir应该如何拆解？为什么99%国内企业试图复制FDE（前向部署工程师）模式均以沦为低毛利外包告终？Ontology本体资产如何支撑AIP商业化？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "pl-a1",
        "type": "answer",
        "content": "### 买方核心结论（BLUF）\n\n1. **商业本质定性**：Palantir 不是传统的纯 SaaS，也不是外包系统集成商（SI），而是**「高客单价特种咨询驱动 + 极强核心数字资产沉淀（Ontology 本体）的平台型操作系统」**。\n\n2. **FDE 的真实角色定位**：\n   - FDE（Forward Deployed Engineer）不是驻场实施，而是**具备全栈工程能力与敏锐商业嗅觉的特种作战工程师**。\n   - 他们的核心KPI不是交付定制代码，而是**将客户独有业务逻辑抽象提炼为 Foundry/AIP 的通用模块，回流到核心软件平台**。\n\n3. **商业模式复制的主要壁垒**：\n   - 国内企业缺乏底层的**本体架构引擎（Ontology）**，导致每一个客户项目都是从零烟囱式开发，边际成本不降反升，毛利率跌入 30% 外包泥潭；\n   - Palantir 借由 Ontology 将业务动作与底层多模态数据解耦，软件毛利率高达 82%~84%，且通过 AIP Bootcamps 实现 3 天极速 POC 转化客户。",
        "reasoning": "分析逻辑：\n1. 剥离FDE实施与纯外包驻场的机制区别；\n2. 解释Ontology概念对大模型幻觉与权限的物理约束；\n3. 梳理商业客户客户数增速与NDR扩张。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "pl-q2",
        "type": "question",
        "roleId": "forensic-finance",
        "branchQuote": "国内企业缺乏底层的本体架构引擎（Ontology）导致毛利率跌入外包泥潭，Palantir软件毛利率高达82%",
        "content": "当前PLTR市值已破千亿美元，对应动态PE超80x、EV/Sales超35x，买方如何在极端高估值下评估其安全边际与回撤风险？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "pl-a2",
        "type": "answer",
        "content": "### 估值溢价与风险剖析\n\n- **成长性支持**：美国商业客户营收同比增速超 55%，商业化客户数单季度新增超百家，AIP 成为美股市场唯一被客户真正证明能落地赚钱的企服 AI 应用。\n- **估值透支度**：35x EV/Sales 位于历史 95% 极高分位，容错率极低。任何一个季度的商业化指引轻微不及预期，都可能触发 20%~25% 的急速去估值波动。\n- **买方策略**：不适合在此位置直接追买现货股票，建议通过双卖宽跨式（Strangle）或卖出看跌期权（Cash-Secured Put）在 $32-$35 区间被动低吸建仓。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "pl-e1",
        "fromId": "pl-q1",
        "toId": "pl-a1"
      },
      {
        "id": "pl-e2",
        "fromId": "pl-a1",
        "toId": "pl-q2",
        "quote": "国内企业缺乏本体架构引擎导致外包泥潭...Palantir毛利率高达82%"
      },
      {
        "id": "pl-e3",
        "fromId": "pl-q2",
        "toId": "pl-a2"
      }
    ]
  },
  {
    "id": "proj-cybersec-map",
    "title": "美股网络安全全景图谱：端点XDR、零信任SASE与网安巨头竞合",
    "category": "美股软件与SaaS",
    "createdAt": "2026-10-30T10:02:00.000Z",
    "updatedAt": "2026-10-30T11:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "cs-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "美股网络安全核心标的有哪些？按技术架构与业务形态如何分类？在企业IT开支紧缩下哪个赛道展现出最强防守反击属性？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "cs-a1",
        "type": "answer",
        "content": "### 产业全景分类与标的池\n\n1. **端点安全与 XDR（防病毒/威胁检测核心）**：\n   - **龙头**：CrowdStrike (CRWD)、SentinelOne (S)。具备极高黏性与单 Agent 架构优势。\n2. **零信任与 SASE（公网安全接入与云防护）**：\n   - **龙头**：Zscaler (ZS)、Cloudflare (NET)。彻底取代传统硬件 VPN 盒子，按流量与用户订阅收费。\n3. **身份安全与访问管理（IAM/PAM，数字身份通行证）**：\n   - **龙头**：Okta (OKTA)、CyberArk (CYBR)。在 AI 时代防范凭证窃取与特权滥用。\n4. **综合平台型网络安全巨头（兼并收购平台化）**：\n   - **龙头**：Palo Alto Networks (PANW)、Fortinet (FTNT)。PANW 强力推行 Platformization（平台化捆绑免费送模块策略），抢占中小单品厂商蛋糕。",
        "reasoning": "分析逻辑：\n1. 梳理安全软件架构各技术栈分工；\n2. 分析PANW平台化策略对单一模块厂商的定价战威胁；\n3. 评估企业CISO在宏观不确定性下的预算优先级。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 480,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "cs-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "PANW 强力推行 Platformization（平台化捆绑免费送模块策略），抢占中小单品厂商蛋糕",
        "content": "Palo Alto的平台化策略是否会导致全行业进入恶性价格战，拖垮整个网安板块的毛利率？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "cs-a2",
        "type": "answer",
        "content": "### 平台化博弈与竞争格局演化\n\n- **短期冲击**：PANW 策略对 ZS、S 等中小纯粹单点厂商在大型跨国企业投标中形成明显压价阻力，迫使对手也提供过渡折扣。\n- **长期分化**：安全行业具有“非标准灾难保险”特征，客户最在乎的是不被勒索软件攻破，而非省几个百分点预算。顶级高危环节客户依然选择 CRWD + ZS 最佳组合（Best-of-breed），二者增速在消化降价期后仍高于 PANW。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "cs-e1",
        "fromId": "cs-q1",
        "toId": "cs-a1"
      },
      {
        "id": "cs-e2",
        "fromId": "cs-a1",
        "toId": "cs-q2",
        "quote": "PANW强力推行Platformization平台化捆绑免费策略"
      },
      {
        "id": "cs-e3",
        "fromId": "cs-q2",
        "toId": "cs-a2"
      }
    ]
  },
  {
    "id": "proj-a-share-fcf",
    "title": "A股稳定高自由现金流企业挖掘 (连续3年 FCFF ≥ 5亿 & PE ≤ 15x)",
    "category": "A股与港股",
    "createdAt": "2026-09-22T10:00:00.000Z",
    "updatedAt": "2026-10-25T16:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "fcf-q1",
        "type": "question",
        "roleId": "forensic-finance",
        "content": "A股里有哪些企业连续三年每年产生5亿以上的真实企业自由现金流（FCFF），同时估值并不高（PE < 15x）？剔除地产与金融伪现金流后的硬核资产池特征是什么？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "fcf-a1",
        "type": "answer",
        "content": "### 全量量化筛选与样本池透视\n\n1. **筛选标准**：\n   - **硬现金流约束**：2022-2024 连续三年企业自由现金流 $\\text{FCFF} = \\text{经营现金流净额} - \\text{资本开支} \\ge 5$ 亿元；\n   - **估值约束**：动态 $\\text{PE} \\le 15$ 倍，剔除 ST 与未上市标的；\n   - **会计勾稽剔除**：剔除房企（清盘停止拿地后的虚假清算回款）及银行/非银金融（负债经营模式）。\n\n2. **实体样本池四大核心聚集带**：\n   - **大宗资源与周期航运**：中远海控、中国船舶、紫金矿业、中国铝业（周期高景气度沉淀巨额真金白银）；\n   - **特种制造与自动化零部件**：柏楚电子、三一重工、徐工机械（行业下行期严格控制 CapEx，经营现金流强韧）；\n   - **化肥与基础化工龙头**：云天化、华鲁恒升（极低成本护城河与折旧高峰已过）；\n   - **公用事业与电力运营**：长江电力、中国核电（类债券高确定性充沛自由现金流）。",
        "reasoning": "分析逻辑：\n1. 财务勾稽验证FCFF扣除资本开支的真实造血能力；\n2. 剔除应收账款粉饰与虚假存货出清；\n3. 结合宏观利率周期定位股息回报率。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "fcf-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "大宗资源与周期航运在周期高景气度沉淀巨额真金白银",
        "content": "周期股在景气峰值往往表现为“PE极低、现金流极佳”，买方如何防范周金涛康波周期下行导致的经典‘低PE价值陷阱’？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "fcf-a2",
        "type": "answer",
        "content": "### 周期股防踩坑四维准则\n\n1. **严禁在 PE 历史 10% 分位时误认为具备绝对安全边际**：周期顶部往往出现 4-6x PE，应改用历史十年中枢 **PB-ROE 周期标尺** 和吨毛利/运价周期位置评估。\n2. **资本开支纪律（CapEx 严防扩张）**：检查管理层在手现金是转为巨额分红/股票回购，还是再度盲目购船扩产。若 CapEx 占 FCF 比重持续低于 30%，则下行期依然具备坚实分红托底。\n3. **净现金头寸保护**：优先挑选在手净现金（现金及等价物 - 有息负债）占总市值 40%+ 的标的，即使运价跌破成本线，利息收益与账面现金亦能封死下行空间。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "fcf-e1",
        "fromId": "fcf-q1",
        "toId": "fcf-a1"
      },
      {
        "id": "fcf-e2",
        "fromId": "fcf-a1",
        "toId": "fcf-q2",
        "quote": "大宗资源与周期航运沉淀巨额真金白银"
      },
      {
        "id": "fcf-e3",
        "fromId": "fcf-q2",
        "toId": "fcf-a2"
      }
    ]
  },
  {
    "id": "proj-chongqing-machinery",
    "title": "重庆机电 (02722.HK) 股息率持续性分析与合资发动机现金奶牛",
    "category": "A股与港股",
    "createdAt": "2026-10-21T12:57:00.000Z",
    "updatedAt": "2026-10-28T14:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "cq-q1",
        "type": "question",
        "roleId": "forensic-finance",
        "content": "重庆机电（02722.HK）高达 9%~11% 的股息率是一次性的还是可持续的？其利润与分红的主要造血来源来自何处？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "cq-a1",
        "type": "answer",
        "content": "### 核心买方拆解与分红穿透\n\n1. **利润核心来源（合资发动机现金奶牛）**：\n   - 公司账面利润绝大部分并非来自本部传统机床与电线电缆，而是来自与美国康明斯合资的**重庆康明斯发动机有限公司（持股 50%）**。\n   - 重庆康明斯主攻大马力重型柴油机与发电机组，广泛应用于矿山、船舶与高可靠性 IDC 备用电源，利润率极高且分红率常年稳定在 80%~90%。\n\n2. **股息可持续性评估**：\n   - **非一次性特征**：历史分红记录长达十余年，派息率稳定在 40%~50% 母公司净利润以上。\n   - **算力中心备电新期权**：随着全球及国内大型算力中心配电要求提升，大功率柴油备用发电机组需求稳步攀升，合资公司造血不仅未萎缩反而获得增量订单。\n3. **估值与折价**：当前港股估值仅 0.35x PB、4.5x PE，分红率超 9%，具备扎实的深度价值防御底色。",
        "reasoning": "分析逻辑：\n1. 穿透联营合营企业投资收益占比；\n2. 梳理重庆康明斯大马力发动机在IDC备电的市占率；\n3. 测算港股流动性折价与股息税后实际到手收益率。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 500,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "cq-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "利润绝大部分来自持股 50% 的重庆康明斯发动机，母公司对合资企业资金调配存在折价",
        "content": "港股国企控股架构下，联营公司分红回流至母公司再向港股中小股东派发，是否存在现金沉淀与集团利益输送风险？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "cq-a2",
        "type": "answer",
        "content": "### 治理与现金分配穿透\n\n- **合资合同约束**：康明斯作为美股跨国巨头对合资公司治理极其严格，合资协议明确约定年度未分配利润按出资比例强制分红，现金无截留风险。\n- **国资考核导向**：重庆国资委对机电控股集团的考核中，ROE与上缴利润为刚性红线，母公司对上市公司现金分红具备强烈的诉求而非压制。\n- **流动性折价买点**：港股日均成交偏小（日均百余万港元），买方建议在市场悲观恐慌时以限价单分批收集，作为纯吃息防守底仓。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "cq-e1",
        "fromId": "cq-q1",
        "toId": "cq-a1"
      },
      {
        "id": "cq-e2",
        "fromId": "cq-a1",
        "toId": "cq-q2",
        "quote": "利润绝大部分来自持股50%的重庆康明斯发动机"
      },
      {
        "id": "cq-e3",
        "fromId": "cq-q2",
        "toId": "cq-a2"
      }
    ]
  },
  {
    "id": "proj-sugar-cycle",
    "title": "糖业产业链供需与大宗周期：巴西糖醇比切换与国内自产缺口",
    "category": "周期与大宗",
    "createdAt": "2026-10-15T16:45:00.000Z",
    "updatedAt": "2026-10-27T18:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "sg-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "糖业这个行业应该如何系统化研究？全球与国内供需平衡表的核心变量是什么？巴西糖醇比与国内进口配额制度如何影响糖价定价权？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "sg-a1",
        "type": "answer",
        "content": "### 【500字投资核心结论】\n\n**糖业本质是一个“全球看巴西/印度，国内看进口配额与高成本托底”的典型强周期大宗农产品行业。**\n\n1. **供需格局（常年硬缺口）**：\n   - 中国年食糖消费量约 **1,500–1,550万吨**（平稳刚需）；\n   - 国内自产糖仅 **980–1,050万吨**（广西占60%+，云南15%+，北方甜菜15%+），每年存在 **450–550万吨刚性缺口** 必须依赖进口补充。\n\n2. **定价与周期核心驱动**：\n   - **外盘（ICE原糖）**：核心看**巴西中南部糖醇比**（原油价格高则糖厂偏向转产燃料乙醇削减食糖供应，反之压榨原糖增加）与**印度/泰国季风气候**。\n   - **内盘（郑糖）**：实行进口关税配额制度（配额内 194.5 万吨关税 15%，配额外关税 50%）。配额外进口成本构筑了国内糖价的硬性天花板与防线，赋予国内自产龙头极强的提价防御弹性。",
        "reasoning": "分析逻辑：\n1. 梳理全球三大主产国（巴西/印度/泰国）产能季节性；\n2. 拆解原油价格与生物乙醇对食糖压榨比例的联动机制；\n3. 分析国内中粮糖业全产业链进口配额红利与自产糖成本线。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "sg-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "巴西中南部糖醇比受原油价格牵引，配额外进口关税50%构筑国内糖价硬底",
        "content": "如果国际原油暴跌导致巴西糖厂将糖醇比提升至50%以上极致制糖，叠加印度取消出口限制，国内制糖龙头中粮糖业的利润如何承受外糖倾销冲击？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "sg-a2",
        "type": "answer",
        "content": "### 风险传导与企业护城河对冲\n\n- **配额管理防火墙**：商务部通过自动进口许可证发放节奏控制配额外进口糖流入速度，严禁无序倾销冲击国内蔗农利益。\n- **中粮糖业双轮对冲机制**：\n  - **自产糖业务（~100万吨）**：享受高糖价利润暴增；\n  - **精炼糖与进口贸易业务（~200万吨）**：当外糖暴跌时，进口原料原糖成本大幅走低，精炼糖加工利润（Crush Margin）反而扩大，形成逆周期天然对冲。\n- **安全边际价格**：国内糖价跌至国内制糖现金成本线（5,500-5,800元/吨）即为长周期超级建仓买点。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "sg-e1",
        "fromId": "sg-q1",
        "toId": "sg-a1"
      },
      {
        "id": "sg-e2",
        "fromId": "sg-a1",
        "toId": "sg-q2",
        "quote": "巴西中南部糖醇比受原油牵引...配额外关税构筑硬底"
      },
      {
        "id": "sg-e3",
        "fromId": "sg-q2",
        "toId": "sg-a2"
      }
    ]
  },
  {
    "id": "proj-semiconductor-mtr",
    "title": "先进制程与晶圆代工核心指标：MTr/mm²晶体管密度与CapEx拐点",
    "category": "半导体与先进制程",
    "createdAt": "2026-09-19T11:16:00.000Z",
    "updatedAt": "2026-10-25T14:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "mtr-q1",
        "type": "question",
        "roleId": "engineering-limits",
        "content": "芯片行业看 MTR（MTr/mm²）这个指标吗？它如何破除‘纳米制程营销虚标’？台积电、三星与英特尔在真实晶体管密度上的代际差距究竟多大？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "mtr-a1",
        "type": "answer",
        "content": "### 芯片先进制程的真实标尺\n\n**看，且是买方与晶圆厂破除制程纳米营销的最硬核物理指标。**\n\n1. **定义与为什么看**：\n   - **MTr/mm²** = Million Transistors per mm²（每平方毫米百万晶体管数）。\n   - 如今各家宣称的“3nm/2nm/18A”早已脱离栅极实际物理栅长（Gate Length），变成纯商业营销数字。真正决定芯片性能、算力面积比与制造成本的是单位面积塞入的晶体管密度。\n\n2. **主流厂商先进制程真实密度排位**：\n   - **台积电 N3E / N3P**：晶体管密度约为 **215 ~ 220 MTr/mm²**（逻辑密度）；\n   - **英特尔 18A (Intel 18A)**：凭借 RibbonFET（GAA）+ PowerVia（背部供电），标称设计目标达到 **190 ~ 210 MTr/mm²**；\n   - **三星 3GAP (SF3)**：标称 3nm，但实际密度仅为 **170 ~ 185 MTr/mm²**，落后台积电整整半代到一代。\n\n3. **经济学含义**：台积电先进制程报价突破 $20,000/片，但客户依然抢购，根本原因在于更高的 MTr/mm² 能用更小的 Die Size 塞入相同算力，综合良率与系统功耗反而在总体 TCO 上占优。",
        "reasoning": "分析逻辑：\n1. 澄清半导体工艺从平面MOSFET到FinFET、GAA的物理栅长虚标演变；\n2. 引用台积电/三星/Intel技术白皮书横向对比逻辑与SRAM密度；\n3. 测算高密度制程对GPU/ASIC芯片面积与良率成本方程的边际影响。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "mtr-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "台积电先进制程报价突破 $20,000/片，更高的 MTr/mm² 能用更小的 Die Size 塞入相同算力",
        "content": "SRAM 缩放停滞（SRAM Scaling Stalled）导致先进节点每比特缓存成本暴涨，会否倒逼算力芯片停止追求极限 MTr/mm²，转入 Chiplet 先进封装堆叠？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "mtr-a2",
        "type": "answer",
        "content": "### 摩尔定律减速后的架构突围\n\n- **SRAM 缩放墙**：从 5nm 进阶至 3nm，逻辑晶体管缩放达 1.6x，但 SRAM 单元面积缩放仅 1.05x，边际成本极速恶化。\n- **必然转向 Chiplet / 3D 封装**：\n  - **计算核心（Compute Die）**：采用最昂贵的台积电 3nm/2nm 追求极致 MTr/mm²；\n  - **I/O 与缓存（I/O Die & Cache）**：剥离至 6nm/7nm 成熟制程，采用 3D SoIC 垂直堆叠在计算核心下方；\n- **结论**：先进封装设备商（BESI、ASMPT）与台积电先进封装产线的重要性全面超越传统单一光刻微缩路线。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "mtr-e1",
        "fromId": "mtr-q1",
        "toId": "mtr-a1"
      },
      {
        "id": "mtr-e2",
        "fromId": "mtr-a1",
        "toId": "mtr-q2",
        "quote": "台积电先进制程报价突破 $20,000/片...高密度塞入更多算力"
      },
      {
        "id": "mtr-e3",
        "fromId": "mtr-q2",
        "toId": "mtr-a2"
      }
    ]
  },
  {
    "id": "proj-marvell",
    "title": "Marvell (MRVL) AI互连I/O、PAM4 DSP与定制ASIC造血机制",
    "category": "美股AI算力",
    "createdAt": "2026-09-18T10:00:00.000Z",
    "updatedAt": "2026-10-26T16:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 90,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "mr-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "拆解Marvell（MRVL）盘前暴涨与AI数据中心收入爆发驱动力。其在光电互连PAM4 DSP、PCIe Gen6 retimer与定制ASIC上的壁垒几何？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "mr-a1",
        "type": "answer",
        "content": "### 核心买方研判：算力尽头是互连\n\n1. **业绩爆发结构**：\n   - **数据中心（Data Center）业务** 占总营收突破 70%，同比翻倍以上增长，完全抵消了传统消费电子、运营商与企业级企业网的下行拖累。\n2. **三大护城河业务分拆**：\n   - **光学 PAM4 DSP**：在 800G/1.6T 光模块电芯片市场与博通平分秋色，享有 65%+ 高毛利率；\n   - **定制 AI ASIC 算力芯片**：独家切入亚马逊 AWS Trainium/Inferentia 核心定制芯片设计，FY26 带来十亿美元级增量收入；\n   - **高速 PCIe/CXL Retimer**：AI 服务器 GPU 机柜间与扩展总线关键连接芯片，单柜搭载量提升 4 倍。",
        "reasoning": "分析逻辑：\n1. 梳理AWS Trainium定制芯片出货量与单芯片收入贡献；\n2. 测算800G向1.6T演进对5nm/3nm DSP芯片单价与毛利拉动力；\n3. 评估Marvell与博通在云计算互连上的竞争格局。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 480,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "mr-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "定制 AI ASIC 算力芯片独家切入亚马逊 AWS Trainium/Inferentia",
        "content": "亚马逊自研芯片团队若在未来转向内部自研设计或引入世芯（Alchip）瓜分二供份额，Marvell的估值如何承受此单一客户集中度打击？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 210,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "mr-a2",
        "type": "answer",
        "content": "### 客户集中度与二供防守推演\n\n- **SerDes与互连IP护城河**：亚马逊自研的是顶层矩阵计算单元，但数千颗芯片间低延迟横向扩展互联所需的 112G/224G SerDes、以太网协议栈及 3D 封装中介层，仍牢牢绑定 Marvell。\n- **新客户对冲**：除 AWS 外，Marvell 成功导入谷歌第三代定制处理器与微软部分互连芯片设计，正有效分散单一云巨头依赖。\n- **买方估值底线**：若剔除 AWS ASIC 估值，光网络 DSP 业务仍可支撑 35x 动态 PE，下行回撤空间受坚挺光通信需求硬性封底。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "mr-e1",
        "fromId": "mr-q1",
        "toId": "mr-a1"
      },
      {
        "id": "mr-e2",
        "fromId": "mr-a1",
        "toId": "mr-q2",
        "quote": "定制AI ASIC算力芯片切入亚马逊AWS Trainium独家设计"
      },
      {
        "id": "mr-e3",
        "fromId": "mr-q2",
        "toId": "mr-a2"
      }
    ]
  },
  {
    "id": "proj-xuchuang-aaoi",
    "title": "中际旭创 vs AAOI 光通信与台积电 3nm/5nm DSP 制程代工",
    "category": "半导体与先进制程",
    "createdAt": "2026-08-10T11:00:00.000Z",
    "updatedAt": "2026-10-24T18:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "xc-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "中际旭创与北美对手AAOI在800G/1.6T光模块出货量与供应链响应能力上有何实质差距？台积电先进工艺DSP芯片的断供与配额壁垒如何？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "xc-a1",
        "type": "answer",
        "content": "### 龙头规模效应与工艺代差\n\n1. **出货规模与良率绝对鸿沟**：\n   - 中际旭创 800G 单月出货量超数十万只，综合良率稳定在 95% 以上，规模采购享有光芯片（EML/硅光）与 DSP 采购最高优先配额；\n   - AAOI 受制于自身代工厂良率与早期资金开支滞后，在 800G 交付速度与毛利水平上显著落后。\n\n2. **供应链配额与海外建厂布局**：\n   - 旭创在泰国已建成完备的大规模制造基地，满足北美 CSP 客户对海外供应链韧性的合规要求，客户粘性极高。\n   - 核心风险点：上游 3nm/5nm 先进 DSP 芯片（博通/Marvell 供应）受全球晶圆代工产能分配约束。",
        "reasoning": "分析逻辑：\n1. 比较光模块组装、光器件耦合与老化测试良率曲线；\n2. 盘点北美前四大云厂商采购份额分配与价格谈判权；\n3. 测算硅光（Silicon Photonics）渗透对传统EML方案的替代拐点。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 480,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "xc-q2",
        "type": "question",
        "roleId": "engineering-limits",
        "branchQuote": "核心风险点：上游 3nm/5nm 先进 DSP 芯片（博通/Marvell 供应）受全球晶圆代工产能分配约束",
        "content": "硅光方案（CPO/LPO）若加速普及，是否会大幅降低对传统高性能独立DSP的依赖，从而打破现有光模块龙头制造壁垒？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "xc-a2",
        "type": "answer",
        "content": "### 物理层与方案演进博弈\n\n- **LPO（线性直驱）局限性**：缺乏 DSP 信号重定时（Retiming），误码率对系统走线距离与交换机主板极度敏感，难以在超大型千卡集群跨机架互连中成为通用主流方案。\n- **CPO（共封装光学）成熟度**：维护与单通道损坏更换成本过高，预计在 1.6T 时代主流仍是以可插拔光模块为主，CPO 仅在特定极超算节点验证应用。\n- **旭创的防守布局**：自研硅光芯片与引擎已进入批量出货，无论技术路径是传统 EML 还是硅光，龙头在精密光电耦合工艺与自动化封装上的壁垒均不可动摇。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "xc-e1",
        "fromId": "xc-q1",
        "toId": "xc-a1"
      },
      {
        "id": "xc-e2",
        "fromId": "xc-a1",
        "toId": "xc-q2",
        "quote": "上游 3nm/5nm 先进 DSP 芯片受全球晶圆代工产能分配约束"
      },
      {
        "id": "xc-e3",
        "fromId": "xc-q2",
        "toId": "xc-a2"
      }
    ]
  },
  {
    "id": "proj-besi-amat-kla",
    "title": "BESI vs AMAT vs KLA 先进封装混合键合与 HBM 资本开支周期",
    "category": "半导体与先进制程",
    "createdAt": "2026-06-18T14:00:00.000Z",
    "updatedAt": "2026-10-25T17:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "bs-q1",
        "type": "question",
        "roleId": "business-moat",
        "content": "在 HBM3e/HBM4 与 3D 封装代际升级中，BESI（Besi）、应用材料（AMAT）与科天（KLA）谁能夺取混合键合（Hybrid Bonding）与缺陷检测最大红利？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "bs-a1",
        "type": "answer",
        "content": "### 标的格局与产业链地位\n\n1. **BESI（荷兰先进封装龙头）**：\n   - 在 **Die-to-Wafer (D2W) 混合键合机台** 上拥有独步全球的 <50nm 超高精度对准能力，台积电 3DFabric（SoIC）与海外 GPU 巨头最核心的验证伙伴，毛利率高达 65%+；\n2. **应用材料（AMAT）**：\n   - 与 BESI 成立联合实验室，主攻键合前的铜化学机械抛光（CMP）与表面等离子体活化，以设备集群方式锁定整条产线；\n3. **KLA（科天）**：\n   - 混合键合要求表面颗粒物近乎零容忍（哪怕一个数十纳米微粒就会造成整颗昂贵 Chip 报废），KLA 光学检测与高精度量测机台在先进封装环节的单线采购额提升 3 倍。",
        "reasoning": "分析逻辑：\n1. 剖析微凸块（Micro-bump）在节距小于10微米时的物理极限；\n2. 解释无凸块铜-铜（Cu-Cu）直接混合键合的工艺难度与良率曲线；\n3. 测算HBM4 16层堆叠对混合键合机台台数的刚性拉动。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 500,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "bs-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "BESI在混合键合机台上拥有独步全球的高精度对准能力，台积电SoIC最核心伙伴",
        "content": "HBM4 阶段三大存储原厂（SK海力士、三星、美光）若出于成本考量延后转向混合键合、继续压榨高级微凸块MR-MUF工艺，BESI订单会否面临断崖？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 210,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "bs-a2",
        "type": "answer",
        "content": "### 存储原厂博弈与过渡期缓冲\n\n- **高度限制的硬物理天花板**：JEDEC 规范对 HBM4 封装总高度限制在 720 微米以内。在 16 层（16-Hi）及未来 24 层堆叠下，微凸块厚度无法再被压缩，转向混合键合是物理唯一解。\n- **逻辑晶圆（Logic SoIC）增量打底**：即使存储原厂在第一代 HBM4 上部分采用优化凸块，台积电为英伟达、AMD、苹果代工的逻辑芯片 3D 堆叠（如 Rubin 架构）已全量导入 BESI 混合键合机台，支撑其基本盘稳定增长。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "bs-e1",
        "fromId": "bs-q1",
        "toId": "bs-a1"
      },
      {
        "id": "bs-e2",
        "fromId": "bs-a1",
        "toId": "bs-q2",
        "quote": "BESI在混合键合机台上拥有独步全球的精度对准能力"
      },
      {
        "id": "bs-e3",
        "fromId": "bs-q2",
        "toId": "bs-a2"
      }
    ]
  },
  {
    "id": "proj-memory-cycle",
    "title": "全球存储六强估值与周期标尺 (美光/海力士/三星/闪迪/西数/长鑫)",
    "category": "半导体与先进制程",
    "createdAt": "2026-07-27T10:00:00.000Z",
    "updatedAt": "2026-10-24T15:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "mem-q1",
        "type": "question",
        "roleId": "forensic-finance",
        "content": "如何构建全球存储行业（DRAM/NAND）的估值标尺？在行业景气度顶部与底部，美光、SK海力士与三星的PB-ROE历史锚点在何处？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "mem-a1",
        "type": "answer",
        "content": "### 存储周期买方核心标尺：PB-ROE 框架\n\n1. **绝对禁忌**：永远不要在存储周期高点用 PE 估值（此时盈利最高、PE 最低，往往是周期见顶信号）；必须采用 **PB 估值与存货减值反转** 作为周期主钟摆。\n\n2. **三大龙头历史分位锚点**：\n   - **周期底部（大亏损、原厂减产减亏期）**：\n     - 美光（MU）：**0.8x – 1.0x PB**，绝佳击球区；\n     - SK海力士：**0.85x – 1.1x PB**（此时常伴随巨额存货跌价计提）；\n   - **周期高点（产能打满、满载涨价）**：\n     - 历史高点通常落在 **2.2x – 2.8x PB**，此时 ROE 往往超过 25%~30%，为标准获利了结区间。\n\n3. **HBM 带来的结构性估值重估**：\n   - HBM 采取按年锁定长期供货协议（LTA），客户提前支付预付款，打破了传统通用 DRAM 随现货价格暴涨暴跌的纯大宗属性，促使海力士估值中枢由 1.2x PB 系统性上移至 1.8x PB。",
        "reasoning": "分析逻辑：\n1. 回测过去20年存储周期PB与随后三年年化收益率的关系；\n2. 剥离DRAM与NAND在不同资本开支纪律下的供需曲线；\n3. 分析HBM对原厂利润率中枢的结构性提振。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 520,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "mem-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "HBM采取按年锁定长期供货协议（LTA），打破传统通用DRAM纯大宗属性",
        "content": "当三星正式通过英伟达HBM3e认证并释放海量产能时，HBM的超额利润溢价会不会在2-3个季度内被彻底抹平？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "mem-a2",
        "type": "answer",
        "content": "### 供给放量与价格侵蚀敏感性测算\n\n- **晶圆消耗倍数对冲**：生产 1GB HBM 所需消耗的先进制程晶圆面积是通用 DDR5 的 **3倍**，且封装后综合良率仅 65%~75%。即使三星释放产能，大量先进制程晶圆被 HBM 吞噬，亦将反向造成传统 DDR5 供给严重短缺，价格联袂上涨。\n- **海力士生态先发优势**：SK海力士在 MR-MUF 封装工艺积累深厚，英伟达下代芯片研发直接与海力士定制联合流片，具有极高粘性与优先采购承诺，降价压力首当其冲由二线供应商承受。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "mem-e1",
        "fromId": "mem-q1",
        "toId": "mem-a1"
      },
      {
        "id": "mem-e2",
        "fromId": "mem-a1",
        "toId": "mem-q2",
        "quote": "HBM采取长期供货协议...打破传统通用DRAM大宗属性"
      },
      {
        "id": "mem-e3",
        "fromId": "mem-q2",
        "toId": "mem-a2"
      }
    ]
  },
  {
    "id": "proj-xian-yicai",
    "title": "西安奕材 (688783.SH) 12寸大硅片国产替代与折旧利润拐点",
    "category": "半导体与先进制程",
    "createdAt": "2026-09-08T11:00:00.000Z",
    "updatedAt": "2026-10-24T16:00:00.000Z",
    "viewport": {
      "x": 70,
      "y": 80,
      "zoom": 0.85
    },
    "nodes": [
      {
        "id": "yc-q1",
        "type": "question",
        "roleId": "forensic-finance",
        "content": "西安奕材在12英寸半导体大硅片（抛光片与外延片）的产能规模与客户认证进展如何？前期重资产巨额折旧何时迎来业绩释放拐点？",
        "x": 80,
        "y": 140,
        "width": 420,
        "height": 200,
        "depth": 0,
        "status": "done"
      },
      {
        "id": "yc-a1",
        "type": "answer",
        "content": "### 产业定位与折旧拐点测算\n\n1. **国内 12 寸大硅片主力军**：\n   - 与沪硅产业形成国内双寡头并跑格局。月产 12 寸硅片产能已达 50 万片规模，在先进制程逻辑芯片与 3D NAND 存储领域通过一线头部代工厂认证并实现批量供应。\n\n2. **重资产折旧周期测算**：\n   - 半导体硅片单厂投资额达百亿元级，固定资产折旧年限普遍为 5-7 年；\n   - 前期高额设备折旧严重压制账面净利润，导致表面 PE 畸高（甚至亏损）；\n   - **拐点特征**：当产能利用率突破 85% 且一期产线折旧提满 70% 时，边际出货增加的收入绝大部分将直接转化为净利润，呈现极强的利润弹性爆发特征。",
        "reasoning": "分析逻辑：\n1. 拆解半导体大硅片提拉单晶硅棒、线切割、CMP双面抛光与外延生长技术壁垒；\n2. 测算折旧占总制造成本比例（~35%）；\n3. 模拟产能利用率从70%攀升至90%时毛利率跳升幅度。",
        "x": 560,
        "y": 110,
        "width": 480,
        "height": 480,
        "depth": 1,
        "status": "done"
      },
      {
        "id": "yc-q2",
        "type": "question",
        "roleId": "devil-advocate",
        "branchQuote": "前期高额设备折旧严重压制账面净利润，产能利用率突破85%将迎利润弹性爆发",
        "content": "信越化学（Shin-Etsu）与胜高（SUMCO）若在海外开启价格战以倾销成熟大硅片，国内晶圆厂采购成本与国产替代意愿如何博弈？",
        "x": 1100,
        "y": 140,
        "width": 420,
        "height": 210,
        "depth": 2,
        "status": "done"
      },
      {
        "id": "yc-a2",
        "type": "answer",
        "content": "### 供应链安全与国产替代刚性\n\n- **自主可控刚性底线**：大硅片是整个半导体制造的基石材料，国内晶圆龙头已明确将国产大硅片本土采购比例纳入战略考核，绝不允许出现关键原材受制于海外单点断供的局面。\n- **降本追赶进度**：国内电费与人工成本较日韩本土具备 15%~20% 结构性优势，随着拉晶热场国产化与金刚线切片良率提升，在 12 寸普通抛光片上的现金成本已逐渐逼近海外同行。",
        "x": 1580,
        "y": 140,
        "width": 450,
        "height": 380,
        "depth": 3,
        "status": "done"
      }
    ],
    "edges": [
      {
        "id": "yc-e1",
        "fromId": "yc-q1",
        "toId": "yc-a1"
      },
      {
        "id": "yc-e2",
        "fromId": "yc-a1",
        "toId": "yc-q2",
        "quote": "前期高额设备折旧压制净利...产能突破85%迎利润弹性"
      },
      {
        "id": "yc-e3",
        "fromId": "yc-q2",
        "toId": "yc-a2"
      }
    ]
  }
];

export const INITIAL_RESEARCH_CANVASES = RAW_CANVASES.map(normalizeCanvasProject);
