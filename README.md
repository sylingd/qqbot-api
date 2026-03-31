# QQ Bot API SDK

基于腾讯官方文档的 Node.js QQ Bot API SDK（ES Module版本）。

[![NPM Version](https://img.shields.io/npm/v/%40sylingd%2Fqqbot-api)](https://www.npmjs.com/package/@sylingd/qqbot-api)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 特性

- 完整封装腾讯QQ Bot API v2（52个API端点，70个方法）
- 支持HTTP API和WebSocket Gateway
- 支持沙箱环境
- 完整的类型定义
- 简单易用的API接口
- 自动Token刷新
- 自动重连机制
- **ES Module支持**
- **Bot Token自动管理**
- **完整的错误码处理**
- **富媒体消息支持**
- **消息按钮支持**

## 安装

```bash
npm install qqbot-api
```

## 快速开始

### 1. 创建Bot实例

#### 方式1: 使用clientSecret自动获取Token（推荐）

```javascript
import QQBot, { Intent } from '@sylingd/qqbot-api';

const bot = new QQBot({
  appId: 'your-app-id',
  clientSecret: 'your-client-secret', // 自动获取access_token
  sandbox: true, // 使用沙箱环境
  intents: Intent.GUILDS | Intent.GUILD_MESSAGES | Intent.GUILD_MEMBERS,
});
```

#### 方式2: 使用Bot Token

```javascript
import QQBot, { Intent } from '@sylingd/qqbot-api';

const bot = new QQBot({
  appId: 'your-app-id',
  token: 'your-bot-token', // 从机器人管理后台获取
  sandbox: true,
  intents: Intent.GUILDS | Intent.GUILD_MESSAGES | Intent.GUILD_MEMBERS,
});
```

### 2. 监听事件

```javascript
import { EventType } from '@sylingd/qqbot-api';

// Bot准备就绪
bot.on(EventType.READY, (data) => {
  console.log('Bot is ready!');
});

// 收到消息
bot.on(EventType.C2C_MESSAGE_CREATE, async (message) => {
  console.log('收到消息:', message);

  // 回复消息
  if (message.content === 'ping') {
    await bot.message.sendC2CMessage(message.author.user_openid, {
      msg_type: 0,
      content: 'pong!',
    });
  }
});

// 错误处理
bot.on(EventType.ERROR, (error) => {
  console.error('Bot错误:', error);
});
```

### 3. 启动Bot

```javascript
bot.start().then(() => {
  console.log('Bot启动成功！');
}).catch((error) => {
  console.error('Bot启动失败:', error);
});
```

## API文档

### 频道API (Guild)

```javascript
// 获取频道信息
const guild = await bot.guild.getGuild(guildId);

// 获取机器人所在的所有频道
const guilds = await bot.guild.getGuilds();
```

### 成员API (Member)

```javascript
// 获取频道成员列表
const members = await bot.member.getMembers(guildId, { limit: 10 });

// 获取频道成员详情
const member = await bot.member.getMember(guildId, userId);

// 删除频道成员
await bot.member.deleteMember(guildId, userId);
```

### 子频道API (Channel)

```javascript
// 获取频道下的子频道列表
const channels = await bot.channel.getChannels(guildId);

// 获取子频道详情
const channel = await bot.channel.getChannel(channelId);

// 创建子频道
const newChannel = await bot.channel.createChannel(guildId, {
  name: '新子频道',
  type: 0, // 文字子频道
});

// 修改子频道
await bot.channel.updateChannel(channelId, {
  name: '修改后的名称',
});

// 删除子频道
await bot.channel.deleteChannel(channelId);
```

### 基础消息API (Message)

#### 基础消息操作

```javascript
// 发送私聊消息
const message = await bot.message.sendC2CMessage(userOpenId, {
  msg_type: 0,
  content: 'Hello World!',
});

// 发送群聊消息
const groupMessage = await bot.message.sendGroupMessage(groupOpenid, {
  msg_type: 0,
  content: 'Hello World!',
});
```

### 频道消息API (ChannelMessage)

#### 基础消息操作

```javascript
// 发送文本消息
const message = await bot.channelMessage.sendTextMessage(channelId, 'Hello World!');

// 发送Embed消息
const embedMessage = await bot.channelMessage.sendEmbedMessage(channelId, {
  title: '标题',
  description: '描述',
  color: 0x00FF00,
  fields: [
    { name: '字段1', value: '值1' },
  ],
});

// 发送Ark消息
const arkMessage = await bot.channelMessage.sendArkMessage(channelId, {
  template_id: 1,
  kv: [
    { key: 'title', value: '标题' },
  ],
});

// 发送Markdown消息
const markdownMessage = await bot.channelMessage.sendMarkdownMessage(channelId, {
  content: '# 标题\n内容',
});

// 发送图片消息
const imageMessage = await bot.channelMessage.sendImageMessage(channelId, 'https://example.com/image.png');

// 发送引用消息
const replyMessage = await bot.channelMessage.sendReplyMessage(
  channelId,
  '回复内容',
  originalMessageId
);

// 获取消息列表
const messages = await bot.channelMessage.getMessages(channelId, {
  limit: 20,
});

// 获取指定消息
const message = await bot.channelMessage.getMessage(channelId, messageId);

// 撤回消息
await bot.channelMessage.deleteMessage(channelId, messageId);
```

#### 富媒体消息

```javascript
// 获取富媒体消息
const richMedia = await bot.channelMessage.getRichMediaMessage(channelId, messageId);
console.log('附件:', richMedia.attachments);
console.log('Embeds:', richMedia.embeds);
```

#### 消息按钮

```javascript
// 设置消息按钮
await bot.channelMessage.setMessageButtons(channelId, messageId, {
  rows: [
    {
      buttons: [
        {
          id: 'button1',
          render_data: { label: '按钮1' },
          action: { type: 1 },
        },
      ],
    },
  ],
});

// 创建按钮模板
const template = await bot.channelMessage.createButtonTemplate({
  name: '模板名称',
  template: { /* 按钮配置 */ },
});

// 获取按钮模板列表
const templates = await bot.channelMessage.getButtonTemplates();

// 删除按钮模板
await bot.channelMessage.deleteButtonTemplate(templateId);
```

#### 私信功能

```javascript
// 创建私信会话
const dms = await bot.channelMessage.createDMS(recipientId, sourceGuildId);

// 发送私信
await bot.channelMessage.sendDMS(dms.guild_id, {
  content: '私信内容',
});
```

### 消息反应API (Reaction)

```javascript
// 创建消息反应
await bot.reaction.createReaction(channelId, messageId, '1', '4'); // 👍

// 删除消息反应
await bot.reaction.deleteReaction(channelId, messageId, '1', '4');

// 获取消息反应用户列表
const users = await bot.reaction.getReactionUsers(
  channelId,
  messageId,
  '1',
  '4'
);
```

### 音频API (Audio)

```javascript
// 开始播放音频
await bot.audio.startAudio(channelId, 'http://example.com/audio.mp3');

// 暂停播放
await bot.audio.pauseAudio(channelId);

// 继续播放
await bot.audio.resumeAudio(channelId);

// 停止播放
await bot.audio.stopAudio(channelId);

// 获取麦克风列表
const micList = await bot.audio.getMicList(channelId);

// 上麦
await bot.audio.onMic(channelId);

// 下麦
await bot.audio.offMic(channelId);
```

### 论坛API (Forum)

```javascript
// 获取帖子列表
const threads = await bot.forum.getThreads(channelId);

// 获取帖子详情
const thread = await bot.forum.getThread(channelId, threadId);

// 发布帖子
const newThread = await bot.forum.createThread(channelId, {
  title: '帖子标题',
  content: {
    paragraphs: [
      {
        type: 1,
        elems: [{ text: { text: '帖子内容' } }],
      },
    ],
  },
});

// 删除帖子
await bot.forum.deleteThread(channelId, threadId);

// 获取帖子回复列表
const replies = await bot.forum.getReplies(channelId, threadId);

// 发布回复
const reply = await bot.forum.createReply(channelId, threadId, {
  content: '回复内容',
});

// 删除回复
await bot.forum.deleteReply(channelId, threadId, replyId);
```

### 权限API (Permission)

```javascript
// 获取频道身份组列表
const roles = await bot.permission.getRoles(guildId);

// 创建身份组
const role = await bot.permission.createRole(guildId, {
  name: '新身份组',
  color: 0xFF0000,
});

// 修改身份组
await bot.permission.updateRole(guildId, roleId, {
  name: '修改后的名称',
});

// 删除身份组
await bot.permission.deleteRole(guildId, roleId);

// 添加成员到身份组
await bot.permission.addRoleMember(guildId, roleId, userId);

// 从身份组移除成员
await bot.permission.deleteRoleMember(guildId, roleId, userId);

// 获取子频道用户权限
const permissions = await bot.permission.getChannelPermissions(channelId, userId);

// 修改子频道用户权限
await bot.permission.updateChannelPermissions(channelId, userId, {
  add: '1', // 添加权限
  remove: '2', // 移除权限
});

// 获取子频道身份组权限
const rolePermissions = await bot.permission.getChannelRolePermissions(channelId, roleId);

// 修改子频道身份组权限
await bot.permission.updateChannelRolePermissions(channelId, roleId, {
  add: '1',
  remove: '2',
});

// 获取API权限
const apiPermissions = await bot.permission.getAPIPermissions(guildId);

// 申请API权限
await bot.permission.requireAPIPermission(guildId, channelId, {
  path: '/path',
  method: 'GET',
  desc: '申请描述',
});
```

### 用户API (User)

```javascript
// 获取机器人信息
const me = await bot.user.getMe();

// 获取当前用户信息
const currentUser = await bot.user.getCurrentUser();

// 获取机器人所在的所有频道
const guilds = await bot.user.getMeGuilds();

// 获取指定用户信息
const user = await bot.user.getUser(guildId, userId);

// 获取机器人资料页分享链接
const shareUrl = await bot.user.getShareUrl(guildId);
console.log('分享链接:', shareUrl.url);

// 用户添加机器人
await bot.user.addBot(guildId, userId);

// 用户删除机器人
await bot.user.removeBot(guildId, userId);

// 拒绝机器人主动消息
await bot.user.rejectBotMessage(guildId, userId);

// 允许机器人主动消息
await bot.user.allowBotMessage(guildId, userId);
```

### 日程API (Schedule)

```javascript
// 获取日程列表
const schedules = await bot.schedule.getSchedules(channelId);

// 获取日程详情
const schedule = await bot.schedule.getSchedule(channelId, scheduleId);

// 创建日程
const newSchedule = await bot.schedule.createSchedule(channelId, {
  name: '日程名称',
  description: '日程描述',
  start_timestamp: '1234567890000',
  end_timestamp: '1234567890000',
  remind_type: 1,
});

// 修改日程
await bot.schedule.updateSchedule(channelId, scheduleId, {
  name: '修改后的名称',
});

// 删除日程
await bot.schedule.deleteSchedule(channelId, scheduleId);
```

### 消息审核API (MessageAudit)

```javascript
// 获取消息审核结果
const auditResult = await bot.messageAudit.getAuditResult(auditId);
```

### Gateway API

```javascript
// 获取Gateway地址
const gatewayUrl = await bot.getGateway();

// 获取Gateway Bot信息
const gatewayBot = await bot.getGatewayBot();
console.log('建议分片数:', gatewayBot.shards);
console.log('Session限制:', gatewayBot.session_start_limit);
```

## 错误处理

### 使用QQBotError类

```javascript
import { QQBotError, ErrorCode } from '@sylingd/qqbot-api';

try {
  const guild = await bot.guild.getGuild('invalid_id');
} catch (error) {
  if (error instanceof QQBotError) {
    console.log('错误码:', error.code);
    console.log('错误消息:', error.message);

    // 错误类型判断
    if (error.isTokenError()) {
      console.log('Token错误，请检查Token配置');
    } else if (error.isPermissionError()) {
      console.log('权限不足');
    } else if (error.isNotFoundError()) {
      console.log('资源不存在');
    } else if (error.isRateLimitError()) {
      console.log('请求频率超限');
    }

    // 获取错误详情
    console.log('错误描述:', error.getDescription());
    console.log('错误JSON:', error.toJSON());
  }
}
```

### 错误码列表

| 错误码 | 名称 | 描述 |
|--------|------|------|
| 11243 | TOKEN_ERROR | Token错误 |
| 11244 | TOKEN_EXPIRED | Token过期 |
| 11245 | TOKEN_INVALID | Token无效 |
| 10403 | NO_PERMISSION | 无权限 |
| 11302 | GUILD_NOT_FOUND | 频道不存在 |
| 11404 | CHANNEL_NOT_FOUND | 子频道不存在 |
| 12004 | MESSAGE_NOT_FOUND | 消息不存在 |
| 13001 | RATE_LIMIT_EXCEEDED | 超过频率限制 |

## 事件类型

SDK支持以下事件类型：

- `READY` - Bot准备就绪
- `GUILD_CREATE` - 频道创建
- `GUILD_UPDATE` - 频道更新
- `GUILD_DELETE` - 频道删除
- `CHANNEL_CREATE` - 子频道创建
- `CHANNEL_UPDATE` - 子频道更新
- `CHANNEL_DELETE` - 子频道删除
- `GUILD_MEMBER_ADD` - 成员加入
- `GUILD_MEMBER_UPDATE` - 成员更新
- `GUILD_MEMBER_REMOVE` - 成员移除
- `MESSAGE_CREATE` - 消息创建
- `MESSAGE_DELETE` - 消息删除
- `MESSAGE_REACTION_ADD` - 消息反应添加
- `MESSAGE_REACTION_REMOVE` - 消息反应移除
- `DIRECT_MESSAGE_CREATE` - 私信消息创建
- `THREAD_CREATE` - 帖子创建
- `THREAD_UPDATE` - 帖子更新
- `THREAD_DELETE` - 帖子删除
- `AUDIO_START` - 音频开始播放
- `AUDIO_FINISH` - 音频播放完成

## Intent订阅

SDK支持以下Intent类型：

```javascript
import { Intent } from '@sylingd/qqbot-api';

Intent.GUILDS // 频道事件
Intent.GUILD_MEMBERS // 成员事件
Intent.GUILD_MESSAGES // 消息事件
Intent.GUILD_MESSAGE_REACTIONS // 消息反应事件
Intent.DIRECT_MESSAGE // 私信事件
Intent.OPEN_FORUMS_EVENT // 论坛事件
Intent.AUDIO_OR_LIVE_CHANNEL_MEMBER // 音频/直播成员事件
Intent.GROUP_AND_C2C_EVENT // 单聊群聊事件
Intent.INTERACTION // 互动事件
Intent.MESSAGE_AUDIT // 消息审核事件
Intent.FORUM_EVENT // 论坛事件
Intent.AUDIO_ACTION // 音频事件
Intent.PUBLIC_GUILD_MESSAGES // 公域的消息事件
```

## 配置选项

```javascript
const bot = new QQBot({
  appId: 'your-app-id',           // 必填：机器人AppID
  token: 'your-token',            // 可选：机器人Token（与clientSecret二选一）
  clientSecret: 'your-secret',    // 可选：ClientSecret（自动获取Token）
  sandbox: false,                 // 可选：是否使用沙箱环境，默认false
  intents: Intent.GUILDS,         // 可选：订阅的事件
  shard: [0, 1],                  // 可选：分片信息 [shard_id, shard_count]
});
```

## Token认证说明

### 认证格式

SDK使用官方要求的认证格式：
```
Authorization: QQBot {ACCESS_TOKEN}
```

### Token管理

- ✅ 自动获取Token（使用clientSecret）
- ✅ 自动刷新Token（过期前60秒）
- ✅ Token缓存机制
- ✅ 失败自动重试

## 示例

查看 `examples` 目录获取更多使用示例：

- `basic.js` - 基础使用示例
- `api-usage.js` - API使用示例
- `esm-example.js` - ES Module示例

## 官方文档

- [QQ Bot 开发文档](https://bot.q.qq.com/wiki/develop/api-v2/)

## License

MIT
