/**
 * QQ Bot API 类型定义
 * 基于腾讯官方文档：https://bot.q.qq.com/wiki/develop/api-v2/
 */

// ==================== 基础类型 ====================

/**
 * 频道对象
 */
export interface Guild {
  id: string; // 频道ID
  name: string; // 频道名称
  icon: string; // 频道头像地址
  owner_id: string; // 创建人用户ID
  owner: User; // 创建人
  member_count: number; // 成员数
  max_members: number; // 最大成员数
  description: string; // 描述
  joined_at: string; // 加入时间
}

/**
 * 子频道对象
 */
export interface Channel {
  id: string; // 子频道ID
  guild_id: string; // 频道ID
  name: string; // 子频道名称
  type: number; // 子频道类型
  sub_type: number; // 子频道子类型
  position: number; // 排序
  parent_id: string; // 父频道ID
  owner_id: string; // 创建人ID
  private_type: number; // 私密类型
  private_user_limit: number; // 私密用户限制
  speak_permission: number; // 发言权限
  application_id: string; // 应用ID
  permissions: string; // 权限
}

/**
 * 子频道类型
 */
export enum ChannelType {
  TEXT = 0, // 文字子频道
  VOICE = 2, // 语音子频道
  CATEGORY = 4, // 子频道分组
  LIVE = 10005, // 直播子频道
  APPLICATION = 10006, // 应用子频道
  FORUM = 10007, // 论坛子频道
}

/**
 * 子频道子类型
 */
export enum ChannelSubType {
  CONVERSATION = 0, // 闲聊
  ANNOUNCEMENT = 1, // 公告
  STRATEGY = 2, // 攻略
  HELP = 3, // 帮助
}

/**
 * 成员对象
 */
export interface Member {
  user: User; // 用户对象
  nick: string; // 昵称
  roles: string[]; // 角色ID列表
  joined_at: string; // 加入时间
}

/**
 * 用户对象
 */
export interface User {
  id: string; // 用户ID
  username: string; // 用户名
  avatar: string; // 头像
  bot: boolean; // 是否是机器人
  union_openid: string; // 特殊关联的openid
  union_user_account: string; // 特殊关联的用户信息
  user_openid: string; // Message 事件中特有的用户ID
}

/**
 * 消息对象
 */
export interface Message {
  id: string; // 消息ID
  channel_id: string; // 子频道ID
  guild_id: string; // 频道ID
  content: string; // 消息内容
  timestamp: string; // 发送时间
  edited_timestamp: string; // 编辑时间
  mention: User[]; // @用户列表
  mention_roles: string[]; // @角色列表
  mention_everyone: boolean; // 是否@所有人
  author: User; // 作者
  attachments: Attachment[]; // 附件
  embeds: Embed[]; // embed
  ark: Ark; // ark消息
  message_reference: MessageReference; // 引用消息
  seq: number; // 序号
  seq_in_channel: string; // 子频道内序号
}

export interface GroupAtMessage {
  id: string;
  author: {
    member_openid: string;
  };
  content: string;
  timestamp: string;
  group_openid: string;
  attachments: Attachment[];
}

export interface C2CMessage {
  id: string;
  author: {
    user_openid: string;
  };
  content: string;
  timestamp: string;
  attachments: Attachment[];
}

/**
 * 消息引用对象
 */
export interface MessageReference {
  message_id: string; // 引用消息ID
  channel_id: string; // 引用消息所在子频道ID
  guild_id: string; // 引用消息所在频道ID
}

/**
 * 附件对象
 */
export interface Attachment {
  url: string; // 下载地址
}

/**
 * Embed对象
 */
export interface Embed {
  title: string; // 标题
  description: string; // 描述
  prompt: string; // 消息弹窗内容
  timestamp: string; // 时间
  fields: EmbedField[]; // 字段列表
  color: number; // 颜色
}

/**
 * Embed字段对象
 */
export interface EmbedField {
  name: string; // 字段名
  value: string; // 字段值
}

/**
 * Ark消息对象
 */
export interface Ark {
  template_id: number; // 模版ID
  kv: ArkKv[]; // kv列表
}

/**
 * Ark KV对象
 */
export interface ArkKv {
  key: string; // key
  value: string; // value
  obj: ArkKvObj[]; // obj列表
}

/**
 * Ark KV Obj对象
 */
export interface ArkKvObj {
  obj_kv: ArkKvObj[]; // obj_kv列表
}

/**
 * 消息反应对象
 */
export interface Reaction {
  user_id: string; // 用户ID
  guild_id: string; // 频道ID
  channel_id: string; // 子频道ID
  message_id: string; // 消息ID
  emoji: Emoji; // 表情
}

/**
 * 表情对象
 */
export interface Emoji {
  id: string; // 表情ID
  type: number; // 表情类型
}

/**
 * 表情类型
 */
export enum EmojiType {
  SYSTEM = 1, // 系统表情
  CUSTOM = 2, // 自定义表情
}

/**
 * 角色对象
 */
export interface Role {
  id: string; // 角色ID
  name: string; // 角色名称
  color: number; // ARGB的HEX十六进制颜色值转换后的十进制数值
  hoist: number; // 是否在成员列表中单独展示
  number: number; // 人数
  member_limit: number; // 成员上限
}

/**
 * API权限对象
 */
export interface APIPermission {
  path: string; // API路径
  method: string; // 请求方法
  desc: string; // 描述
  auth_status: number; // 授权状态
}

/**
 * API权限需求对象
 */
export interface APIPermissionDemand {
  path: string; // API路径
  method: string; // 请求方法
  desc: string; // 描述
  api_id: number; // API接口ID
}

/**
 * 音频控制对象
 */
export interface AudioControl {
  audio_url: string; // 音频URL
  text: string; // 状态文本
  status: number; // 播放状态
}

/**
 * 音频状态
 */
export enum AudioStatus {
  START = 0, // 开始播放
  PAUSE = 1, // 暂停播放
  RESUME = 2, // 继续播放
  STOP = 3, // 停止播放
}

/**
 * 论坛帖子对象
 */
export interface Thread {
  guild_id: string; // 频道ID
  channel_id: string; // 子频道ID
  author_id: string; // 作者ID
  thread_info: ThreadInfo; // 帖子详情
}

/**
 * 帖子详情对象
 */
export interface ThreadInfo {
  title: string; // 标题
  content: string; // 内容
  date_time: string; // 发帖时间
}

/**
 * 帖子内容对象
 */
export interface ThreadContent {
  paragraphs: Paragraph[]; // 段落列表
  attachments: Attachment[]; // 附件列表
}

/**
 * 帖子段落对象
 */
export interface Paragraph {
  type: number; // 段落类型
  elems: ParagraphElem[]; // 元素列表
}

/**
 * 段落类型
 */
export enum ParagraphType {
  TEXT = 1, // 文本
  IMAGE = 2, // 图片
  VIDEO = 3, // 视频
}

/**
 * 帖子元素对象
 */
export interface ParagraphElem {
  type: number; // 元素类型
  text: TextElem; // 文本元素
  image: ImageElem; // 图片元素
  video: VideoElem; // 视频元素
}

/**
 * 文本元素对象
 */
export interface TextElem {
  text: string; // 文本内容
}

/**
 * 图片元素对象
 */
export interface ImageElem {
  url: string; // 图片URL
  width: number; // 宽度
  height: number; // 高度
}

/**
 * 视频元素对象
 */
export interface VideoElem {
  url: string; // 视频URL
  width: number; // 宽度
  height: number; // 高度
}

/**
 * 分页对象
 */
export interface Page {
  before: string; // 上一页
  after: string; // 下一页
  limit: string; // 每页数量
}

/**
 * DMS消息对象
 */
export interface DMS {
  guild_id: string; // 频道ID
  channel_id: string; // 子频道ID
  create_time: string; // 创建时间
}

export enum InnerEventType {
  DISPATCH = 'DISPATCH', // 分发事件
  CONNECTED = 'CONNECTED', // 连接成功
  RECONNECT = 'RECONNECT', // 即将重连
  RECONNECTING = 'RECONNECTING', // 正在重连
  CLOSE = 'CLOSE', // 连接关闭
  DEBUG = 'DEBUG', // 调试信息
  HEARTBEAT_ACK = 'HEARTBEAT_ACK', // 心跳确认
}

/**
 * WebSocket事件类型
 */
export enum EventType {
  READY = 'READY', // 连接成功
  ERROR = 'ERROR', // 错误
  RESUMED = 'RESUMED', // 重连成功
  GUILD_CREATE = 'GUILD_CREATE', // 频道创建
  GUILD_UPDATE = 'GUILD_UPDATE', // 频道更新
  GUILD_DELETE = 'GUILD_DELETE', // 频道删除
  CHANNEL_CREATE = 'CHANNEL_CREATE', // 子频道创建
  CHANNEL_UPDATE = 'CHANNEL_UPDATE', // 子频道更新
  CHANNEL_DELETE = 'CHANNEL_DELETE', // 子频道删除
  GUILD_MEMBER_ADD = 'GUILD_MEMBER_ADD', // 成员加入
  GUILD_MEMBER_UPDATE = 'GUILD_MEMBER_UPDATE', // 成员更新
  GUILD_MEMBER_REMOVE = 'GUILD_MEMBER_REMOVE', // 成员移除
  MESSAGE_CREATE = 'MESSAGE_CREATE', // 消息创建
  MESSAGE_DELETE = 'MESSAGE_DELETE', // 消息删除
  MESSAGE_REACTION_ADD = 'MESSAGE_REACTION_ADD', // 消息反应添加
  MESSAGE_REACTION_REMOVE = 'MESSAGE_REACTION_REMOVE', // 消息反应移除
  THREAD_CREATE = 'THREAD_CREATE', // 帖子创建
  THREAD_UPDATE = 'THREAD_UPDATE', // 帖子更新
  THREAD_DELETE = 'THREAD_DELETE', // 帖子删除
  POST_CREATE = 'POST_CREATE', // 帖子发布
  POST_DELETE = 'POST_DELETE', // 帖子删除
  REPLY_CREATE = 'REPLY_CREATE', // 回复创建
  REPLY_DELETE = 'REPLY_DELETE', // 回复删除
  AUDIO_START = 'AUDIO_START', // 音频开始播放
  AUDIO_FINISH = 'AUDIO_FINISH', // 音频播放完成
  AUDIO_ON_MIC = 'AUDIO_ON_MIC', // 上麦
  AUDIO_OFF_MIC = 'AUDIO_OFF_MIC', // 下麦
  MESSAGE_AUDIT_PASS = 'MESSAGE_AUDIT_PASS', // 消息审核通过
  MESSAGE_AUDIT_REJECT = 'MESSAGE_AUDIT_REJECT', // 消息审核不通过
  FORUM_THREAD_CREATE = 'FORUM_THREAD_CREATE', // 论坛帖子创建
  FORUM_THREAD_UPDATE = 'FORUM_THREAD_UPDATE', // 论坛帖子更新
  FORUM_THREAD_DELETE = 'FORUM_THREAD_DELETE', // 论坛帖子删除
  FORUM_POST_CREATE = 'FORUM_POST_CREATE', // 论坛回复创建
  FORUM_POST_DELETE = 'FORUM_POST_DELETE', // 论坛回复删除
  FORUM_REPLY_CREATE = 'FORUM_REPLY_CREATE', // 论坛评论创建
  FORUM_REPLY_DELETE = 'FORUM_REPLY_DELETE', // 论坛评论删除
  INTERACTION_COMMAND = 'INTERACTION_COMMAND', // 互动按钮回调
  GUILD_MESSAGE_REACTIONS = 'GUILD_MESSAGE_REACTIONS', // 频道消息表情表态
  AT_MESSAGE_CREATE = 'AT_MESSAGE_CREATE', // 文字子频道@机器人
  GROUP_AT_MESSAGE_CREATE = 'GROUP_AT_MESSAGE_CREATE', // 用户在群聊@机器人发送消息
  DIRECT_MESSAGE_CREATE = 'DIRECT_MESSAGE_CREATE', // 用户在频道私信内发送消息给机器人
  C2C_MESSAGE_CREATE = 'C2C_MESSAGE_CREATE', // 用户在单聊发送消息给机器人
}

/**
 * Intent事件订阅类型
 */
export enum Intent {
  GUILDS = 1 << 0, // 频道事件
  GUILD_MEMBERS = 1 << 1, // 成员事件
  GUILD_MESSAGES = 1 << 9, // 消息事件
  GUILD_MESSAGE_REACTIONS = 1 << 10, // 消息反应事件
  DIRECT_MESSAGE = 1 << 12, // 私信事件
  OPEN_FORUMS_EVENT = 1 << 18, // 论坛事件
  AUDIO_OR_LIVE_CHANNEL_MEMBER = 1 << 19, // 音频/直播成员事件
  GROUP_AND_C2C_EVENT = 1 << 25, // 单聊群聊事件
  INTERACTION = 1 << 26, // 互动事件
  MESSAGE_AUDIT = 1 << 27, // 消息审核事件
  FORUM_EVENT = 1 << 28, // 论坛事件
  AUDIO_ACTION = 1 << 29, // 音频事件
  PUBLIC_GUILD_MESSAGES = 1 << 30, // 公域的消息事件
}

/**
 * OpCode类型
 */
export enum OpCode {
  DISPATCH = 0, // 服务端进行消息推送
  HEARTBEAT = 1, // 客户端发送心跳
  IDENTIFY = 2, // 客户端发送鉴权
  RESUME = 6, // 客户端恢复连接
  RECONNECT = 7, // 服务端通知客户端重新连接
  INVALID_SESSION = 9, // 当identify或resume的时候，如果参数有错，服务端会返回该消息
  HELLO = 10, // 当与Websocket建立连接之后，后续将回返回一个Hello消息
  HEARTBEAT_ACK = 11, // 心跳回执
}

/**
 * Gateway连接信息对象
 */
export interface Gateway {
  url: string; // WebSocket连接地址
  shards: number; // 建议的shard数
  session_start_limit: SessionStartLimit; // 创建Session限制
}

/**
 * Session限制对象
 */
export interface SessionStartLimit {
  total: number; // 每天可以创建Session总数
  remaining: number; // 目前还可以创建的Session数
  reset_after: number; // 重置计数的剩余时间(ms)
  max_concurrency: number; // 最大并发数
}

/**
 * 机器人信息对象
 */
export interface BotInfo {
  id: string; // 机器人ID
  username: string; // 机器人名称
  avatar: string; // 机器人头像
}

/**
 * 机器人所在频道对象
 */
export interface BotGuild {
  id: string; // 频道ID
  name: string; // 频道名称
  icon: string; // 频道头像
}

/**
 * 私信消息对象
 */
export interface DirectMessage {
  id: string; // 消息ID
  channel_id: string; // 子频道ID
  guild_id: string; // 频道ID
  content: string; // 消息内容
  timestamp: string; // 发送时间
  author: User; // 作者
  attachments: Attachment[]; // 附件
  embeds: Embed[]; // embed
  ark: Ark; // ark消息
}

/**
 * 日程对象
 */
export interface Schedule {
  id: string; // 日程ID
  name: string; // 日程名称
  description: string; // 日程描述
  start_timestamp: string; // 日程开始时间戳(ms)
  end_timestamp: string; // 日程结束时间戳(ms)
  creator: User; // 创建者
  jump_channel_id: string; // 日程跳转子频道ID
  remind_type: string; // 日程提醒类型
}

/**
 * 日程提醒类型
 */
export enum ScheduleRemindType {
  NO_REMIND = 0, // 不提醒
  START = 1, // 开始时提醒
  MINUTES_5 = 2, // 开始前5分钟提醒
  MINUTES_15 = 3, // 开始前15分钟提醒
  MINUTES_30 = 4, // 开始前30分钟提醒
  MINUTES_60 = 5, // 开始前60分钟提醒
}

/**
 * 表情对象（用于消息反应）
 */
export interface EmojiInfo {
  id: string; // 表情ID
  type: number; // 表情类型
}

/**
 * 消息审核对象
 */
export interface MessageAudit {
  audit_id: string; // 审核ID
  message_id: string; // 消息ID
  guild_id: string; // 频道ID
  channel_id: string; // 子频道ID
  audit_status: number; // 审核状态
}

/**
 * 审核状态
 */
export enum AuditStatus {
  PENDING = 0, // 审核中
  APPROVED = 1, // 审核通过
  REJECTED = 2, // 审核不通过
}

/**
 * 互动事件对象
 */
export interface Interaction {
  id: string; // 互动事件ID
  type: number; // 互动事件类型
  channel_id: string; // 子频道ID
  guild_id: string; // 频道ID
  data: any; // 互动事件数据
  user_id: string; // 用户ID
  version: number; // 版本
  token: string; // token
  message: Message; // 消息对象
}

/**
 * 互动事件类型
 */
export enum InteractionType {
  PING = 1, // ping
  APPLICATION_COMMAND = 2, // 应用命令
  MESSAGE_COMPONENT = 3, // 消息组件
  APPLICATION_COMMAND_AUTOCOMPLETE = 4, // 应用命令自动补全
  MODAL_SUBMIT = 5, // 模态框提交
}

/**
 * 回复对象
 */
export interface Reply {
  id: string; // 回复ID
  channel_id: string; // 子频道ID
  guild_id: string; // 频道ID
  author_id: string; // 作者ID
  content: string; // 回复内容
  create_time: string; // 创建时间
}
