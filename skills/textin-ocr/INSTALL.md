# Textin OCR Skill - 安装完成 ✅

## 安装位置

- **Skill 目录**: `~/.claude/skills/textin-ocr/`
- **命令链接**: `~/.local/bin/textin-ocr` -> `~/.claude/skills/textin-ocr/textin-ocr`

## 环境变量配置

环境变量已添加到 `~/.zshrc` 文件中：

```bash
export TEXTIN_APP_ID="your_app_id_here"
export TEXTIN_SECRET_CODE="your_secret_code_here"
```

**生效方式**：
- 新打开的终端窗口会自动加载这些环境变量
- 当前终端需要运行 `source ~/.zshrc` 来加载

## 使用方法

### 1. 全局命令（推荐）

从任何目录直接运行：

```bash
# 营业执照识别
textin-ocr business-license /path/to/license.jpg

# 身份证识别
textin-ocr id-card /path/to/idcard.jpg

# 通用文字识别
textin-ocr ocr /path/to/document.pdf

# 文档解析
textin-ocr parse-doc /path/to/report.pdf
```

### 2. 直接运行（在 skill 目录内）

```bash
cd ~/.claude/skills/textin-ocr

# 使用环境变量
node index.js business-license /path/to/license.jpg

# 或运行测试
node validate.js
node test.js --ocr /path/to/image.jpg
```

## 快速验证

### 验证安装

```bash
cd ~/.claude/skills/textin-ocr
node validate.js
```

应该看到：
```
✅ Configuration verified
✅ Node.js version compatible
✅ All files present
✅ API accessible
```

### 验证全局命令

```bash
textin-ocr
```

应该显示使用帮助信息。

## 测试示例

### 准备测试图片

1. 营业执照图片：`test_license.jpg`
2. 身份证图片：`test_idcard.jpg`
3. 文档图片/PDF：`test_document.pdf`

### 运行测试

```bash
# 单个测试
textin-ocr ocr ~/Downloads/test_document.jpg

# 完整测试套件
cd ~/.claude/skills/textin-ocr
node test.js \
  --business-license ~/Downloads/test_license.jpg \
  --id-card ~/Downloads/test_idcard.jpg \
  --ocr ~/Downloads/test_document.jpg \
  --parse-doc ~/Downloads/test_report.pdf
```

## 支持的功能

### ✅ 1. 营业执照识别

识别字段：
- 统一社会信用代码
- 公司名称
- 类型
- 法定代表人
- 注册资本
- 成立日期
- 营业期限
- 经营范围
- 住所

### ✅ 2. 身份证识别

识别字段：
- 姓名、性别、民族
- 出生日期
- 住址
- 身份证号码
- 签发机关
- 有效期限
- 支持头像提取

### ✅ 3. 通用文字识别

特性：
- 支持 52+ 种语言
- 横向/纵向混排文字
- 手写体检测
- 印章识别
- 公式识别
- 多页文档支持

### ✅ 4. 文档解析

特性：
- 转换为 Markdown 格式
- 表格解析（Markdown 格式）
- 保留文档结构
- 标题层次生成
- 支持分页解析

## 文件说明

```
~/.claude/skills/textin-ocr/
├── index.js          # 主程序
├── textin-ocr        # 包装脚本（全局命令）
├── test.js           # 测试套件
├── validate.js       # 配置验证
├── demo.js           # 演示脚本
├── setup.sh          # 安装助手
├── skill.json        # Skill 配置
├── package.json      # Node.js 包信息
├── README.md         # 完整文档
├── QUICKSTART.md     # 快速开始
├── TESTING.md        # 测试指南
├── INSTALL.md        # 本文档
├── .env.example      # 环境变量模板
└── .gitignore        # Git 忽略规则
```

## 安全说明

✅ **已实现的安全措施**：
- ✅ 环境变量存储在 `~/.zshrc`（用户私有文件）
- ✅ 代码中没有硬编码密钥
- ✅ `.gitignore` 防止敏感文件提交
- ✅ `.env.example` 提供模板但不包含真实密钥

## 更新配置

如需更换 API 密钥：

1. 编辑 `~/.zshrc`：
```bash
nano ~/.zshrc
```

2. 修改以下行：
```bash
export TEXTIN_APP_ID="new_app_id"
export TEXTIN_SECRET_CODE="new_secret_code"
```

3. 重新加载配置：
```bash
source ~/.zshrc
```

## 卸载

如需卸载此 skill：

```bash
# 删除全局命令
rm ~/.local/bin/textin-ocr

# 删除 skill 目录
rm -rf ~/.claude/skills/textin-ocr

# 从 ~/.zshrc 中删除环境变量（手动编辑）
nano ~/.zshrc
# 删除以下行：
# export TEXTIN_APP_ID="..."
# export TEXTIN_SECRET_CODE="..."
```

## 故障排查

### 问题 1: "Missing Textin credentials"

**解决方案**：
```bash
# 检查环境变量
echo $TEXTIN_APP_ID
echo $TEXTIN_SECRET_CODE

# 如果为空，重新加载配置
source ~/.zshrc
```

### 问题 2: "Command not found: textin-ocr"

**解决方案**：
```bash
# 检查符号链接
ls -l ~/.local/bin/textin-ocr

# 如果不存在，重新创建
ln -sf ~/.claude/skills/textin-ocr/textin-ocr ~/.local/bin/textin-ocr

# 确保 ~/.local/bin 在 PATH 中
echo $PATH | grep ".local/bin"
```

### 问题 3: "API Error 40102: Invalid credentials"

**解决方案**：
- 检查 API 密钥是否正确
- 确认账号状态是否正常
- 登录 https://www.textin.com 验证

### 问题 4: "API Error 40003: Insufficient balance"

**解决方案**：
- 登录 Textin 控制台充值
- 检查账户余额

## 获取帮助

- **API 文档**: https://www.textin.com/document
- **Textin 控制台**: https://www.textin.com
- **Skill 文档**: `~/.claude/skills/textin-ocr/README.md`
- **快速开始**: `~/.claude/skills/textin-ocr/QUICKSTART.md`

---

**安装完成时间**: 2026-02-03
**版本**: 1.0.0
**状态**: ✅ 已安装并配置完成
