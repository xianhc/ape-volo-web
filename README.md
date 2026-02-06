## 📚 项目简介

Ape-Volo-Admin 是一套面向企业场景的 **权限管理 / 后台管理系统解决方案**，帮助你快速搭建：用户、角色、菜单、接口权限、数据权限等通用后台能力，并在此基础上进行二次开发。

基于 **.NET 8 + SqlSugar + Vue 3 + Element Plus + Vite** 构建，默认开箱即用，同时保留足够的扩展空间，适合绝大多数 **.NET/C#** 项目落地。

- 通用能力完备：认证授权、审计日志、缓存、任务调度、限流、数据权限、国际化等
- 架构清晰可维护：分层模块化（接口层 / 业务层 / 基础设施层…）便于扩展与替换
- 低侵入易集成：核心能力以通用方式提供，尽量减少对业务代码的“硬绑定”

## 🌐 在线体验

- 系统官网：<a href="https://www.apevolo.com" target="_blank" rel="noopener noreferrer">https://www.apevolo.com</a>
- 系统预览：<a href="https://vip.apevolo.com" target="_blank" rel="noopener noreferrer">https://vip.apevolo.com</a>
- 体验账号：`apevolo / 123456`

## 💒 代码仓库

### 后端 / API

- GitHub：https://www.github.com/xianhc/ape-volo-admin
- Gitee：https://www.gitee.com/xianhc/ape-volo-admin

### 前端 / Web

- GitHub：https://www.github.com/xianhc/ape-volo-web
- Gitee：https://www.gitee.com/xianhc/ape-volo-web

## 📁 项目结构

```
ape-volo-web/
├── public/                          # 静态资源目录
│   ├── favicon.ico                  # 网站图标
│   ├── logo.png                     # 应用 Logo
├── src/                             # 源代码目录
│   ├── api/                         # API 接口管理
│   │   ├── auth.js                  # 认证相关接口
│   │   ├── data.js                  # 数据管理接口
│   │   ├── onlineUser.js            # 在线用户接口
│   │   ├── verificationCode.js      # 验证码接口
│   │   ├── log/                     # 日志模块接口
│   │   │   ├── exceptionLog.js      # 异常日志记录
│   │   │   ├── operateLog.js        # 操作日志记录
│   │   │   └── taskLog.js           # 任务日志记录
│   │   ├── message/                 # 消息模块接口
│   │   │   └── email/               # 邮件消息接口
│   │   ├── permission/              # 权限模块接口
│   │   │   ├── api.js               # API 权限管理
│   │   │   ├── department.js        # 部门管理
│   │   │   ├── job.js               # 职位管理
│   │   │   ├── menu.js              # 菜单管理
│   │   │   ├── role.js              # 角色管理
│   │   │   └── user.js              # 用户管理
│   │   └── system/                  # 系统模块接口
│   │       ├── appSecret.js         # 应用密钥管理
│   │       ├── dictionary.js        # 字典管理
│   │       ├── dictionaryDetail.js  # 字典详情管理
│   │       ├── setting.js           # 系统设置
│   │       ├── storage.js           # 存储管理
│   │       ├── tenant.js            # 租户管理
│   │       └── timing.js            # 定时任务管理
│   ├── assets/                      # 静态资源
│   │   ├── *.png, *.jpg, *.svg     # 图片资源
│   │   └── icons/                   # SVG 图标库
│   ├── components/                  # 公共组件
│   │   ├── BottomInfo/              # 版权信息组件
│   │   ├── CRUD/                    # CRUD 组件
│   │   ├── ECharts/                 # 图表组件
│   │   │   └── index.vue            # ECharts 组件
│   │   ├── Fullscreen/              # 全屏组件
│   │   ├── IconSelect/              # 图标选择器
│   │   │   └── index.vue            # 图标选择组件
│   │   ├── Iframe/                  # 内嵌框架组件
│   │   ├── MenuSearch/              # 菜单搜索组件
│   │   │   └── index.vue            # 菜单搜索功能
│   │   ├── SvgIcon/                 # SVG 图标组件
│   ├── directive/                   # 自定义指令
│   │   ├── index.js                 # 指令注册入口
│   │   └── permission/              # 权限控制指令
│   │       └── index.js             # 权限指令实现
│   ├── enums/                       # 枚举定义
│   │   ├── borderRadiusType.js      # 边框圆角类型
│   │   ├── menuNavigation.js        # 菜单导航类型
│   │   └── menuType.js              # 菜单类型枚举
│   ├── hooks/                       # 组合式函数
│   │   └── responsive.js            # 响应式监听 Hook
│   ├── pinia/                       # 状态管理
│   │   ├── index.js                 # Pinia 配置入口
│   │   └── modules/                 # 状态模块
│   │       ├── app.js               # 应用状态管理
│   │       ├── dictionary.js        # 字典状态管理
│   │       ├── router.js            # 路由状态管理
│   │       └── user.js              # 用户状态管理
│   ├── plugins/                     # 插件模块
│   │   ├── index.js                 # 插件注册入口
│   │   ├── icons.js                 # 图标插件配置
│   │   ├── pathInfo.json            # 路径信息配置
│   │   └── permission.js            # 权限插件配置
│   ├── router/                      # 路由配置
│   │   └── index.js                 # 路由主配置文件
│   ├── style/                       # 样式文件
│   │   ├── ape-volo-admin.scss      # 主题样式
│   │   ├── main.scss                # 主样式文件
│   │   ├── reset.scss               # 样式重置
│   │   ├── transition.scss          # 过渡动画
│   │   └── element/                 # Element Plus 样式定制
│   ├── utils/                       # 工具函数
│   │   ├── bus.js                   # 事件总线
│   │   ├── converter.js             # 数据转换工具
│   │   ├── dateTime.js              # 日期时间工具
│   │   ├── dictionary.js            # 字典工具
│   │   ├── downloadFile.js          # 文件下载工具
│   │   ├── dynamicRouter.js         # 动态路由工具
│   │   ├── index.js                 # 工具函数入口
│   │   ├── jwtAuth.js               # JWT 认证工具
│   │   ├── request.js               # HTTP 请求工具
│   │   ├── rsaEncrypt.js            # RSA 加密工具
│   │   ├── theme.js                 # 主题工具
│   │   └── validate.js              # 数据验证工具
│   ├── views/                       # 页面组件
│   │   ├── routerHolder.vue         # 路由占位组件
│   │   ├── dashboard/               # 仪表盘页面
│   │   ├── error/                   # 错误页面
│   │   ├── layout/                  # 布局组件
│   │   ├── log/                     # 日志管理页面
│   │   ├── login/                   # 登录页面
│   │   ├── message/                 # 消息管理页面
│   │   ├── onlineUser/              # 在线用户页面
│   │   ├── permission/              # 权限管理页面
│   │   ├── personalCenter/          # 个人中心页面
│   │   ├── serverMonitor/           # 服务器监控页面
│   │   └── system/                  # 系统管理页面
│   ├── App.vue                      # 根组件
│   ├── main.js                      # 应用入口文件
│   ├── setting.js                   # 全局配置
├── babel.config.js                  # Babel 配置
├── componentNameMap.js              # 组件名映射
├── eslint.config.mjs                # ESLint 配置
├── index.html                       # HTML 入口模板
├── jsconfig.json                    # JavaScript 配置
├── package.json                     # 项目依赖配置
├── postcss.config.js                # PostCSS 配置
├── tailwind.config.js               # Tailwind CSS 配置
├── vite.config.js                   # Vite 构建配置
```

## 🎯 核心功能

### 🔐 权限管理

- **用户管理**: 用户增删改查、角色分配、状态管理
- **角色管理**: 角色权限配置、菜单权限、API 权限
- **菜单管理**: 动态菜单配置、路由权限、按钮权限
- **部门管理**: 组织架构管理、部门层级关系
- **职位管理**: 职位信息维护、权限关联

### 📊 系统管理

- **字典管理**: 系统字典配置、数据字典维护
- **参数设置**: 系统参数配置、应用设置管理
- **应用密钥**: API 密钥管理、安全配置
- **租户管理**: 多租户支持、数据隔离
- **定时任务**: 任务调度管理、执行状态监控

### 📈 日志管理

- **操作日志**: 用户操作记录、行为追踪
- **异常日志**: 系统异常监控、错误分析
- **任务日志**: 定时任务执行日志、状态跟踪

### 💬 消息管理

- **邮件管理**: 邮件发送、模板配置、发送记录
- **站内消息**: 系统通知、用户消息、消息推送

### 🖥️ 系统监控

- **在线用户**: 实时在线用户监控、强制下线
- **服务器监控**: 系统资源监控、性能指标
- **存储管理**: 文件存储、空间监控

## 🚀 快速开始

### 环境要求

- Node.js >= 16.0.0
- npm >= 8.0.0 或 yarn >= 1.22.0

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发环境启动

```bash
npm run dev
# 或
yarn dev
```

### 生产环境构建

```bash
npm run build
# 或
yarn build
```

## ⭐️ 支持作者

如果这个项目对你有帮助，欢迎在 GitHub 或 Gitee 点个 Star：

- GitHub：https://www.github.com/xianhc/ape-volo-admin
- Gitee：https://www.gitee.com/xianhc/ape-volo-admin

## 🙋 反馈交流

### QQ 群：839263566

| QQ 群 |
| :---: |

| <img width="150" src="https://www.apevolo.com/contact/wechat/20230723172503.jpg">

### 微信群

| 微信 |
| :--: |

| <img width="150" src="https://www.apevolo.com/contact/wechat/20230723172451.jpg">

添加微信，备注"加群"

## 🤟 捐赠

如果你觉得这个项目对你有帮助，你可以请作者喝饮料 🍹 [点我](https://www.apevolo.com/donate/)

## 📄 许可证

本项目采用 Apache-2.0 license 许可证 - 查看 [LICENSE](LICENSE) 文件了解更多详情。
