/**
 * QQ Bot API SDK - TypeScript 类型声明
 * @packageDocumentation
 */

declare module 'qqbot-api' {
  // ==================== 导出主类 ====================
  export default class QQBot {
    constructor(config: QQBotConfig);

    // API模块
    guild: GuildAPI;
    member: MemberAPI;
    channel: ChannelAPI;
    message: MessageAPI;
    reaction: ReactionAPI;
    audio: AudioAPI;
    forum: ForumAPI;
    permission: PermissionAPI;
    user: UserAPI;
    schedule: ScheduleAPI;
    messageAudit: MessageAuditAPI;

    // 核心方法
    start(): Promise<void>;
    stop(): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): this;
    once(event: string, listener: (...args: any[]) => void): this;
    emit(event: string, ...args: any[]): boolean;
    getGateway(): Promise<string>;
    getGatewayBot(): Promise<GatewayBot>;
  }

  // ==================== 配置类型 ====================
  export interface QQBotConfig {
    appId: string;
    token?: string;
    clientSecret?: string;
    sandbox?: boolean;
    intents?: number;
    shard?: [number, number];
  }

  // ==================== Intent常量 ====================
  export const Intent: {
    GUILDS: number;
    GUILD_MEMBERS: number;
    GUILD_MESSAGES: number;
    GUILD_MESSAGE_REACTIONS: number;
    DIRECT_MESSAGE: number;
    OPEN_FORUMS_EVENT: number;
    AUDIO_OR_LIVE_CHANNEL_MEMBER: number;
    INTERACTION: number;
    MESSAGE_AUDIT: number;
    FORUM_EVENT: number;
  };

  // ==================== 错误处理 ====================
  export const ErrorCode: {
    TOKEN_ERROR: number;
    TOKEN_EXPIRED: number;
    TOKEN_INVALID: number;
    NO_PERMISSION: number;
    GUILD_NOT_FOUND: number;
    CHANNEL_NOT_FOUND: number;
    MESSAGE_NOT_FOUND: number;
    RATE_LIMIT_EXCEEDED: number;
    [key: string]: number;
  };

  export class QQBotError extends Error {
    code: number;
    data: any;

    constructor(code: number, message?: string, data?: any);

    isTokenError(): boolean;
    isPermissionError(): boolean;
    isNotFoundError(): boolean;
    isRateLimitError(): boolean;
    getDescription(): string;
    toJSON(): object;
  }

  // ==================== API类类型 ====================
  export class GuildAPI {
    getGuild(guildId: string): Promise<Guild>;
    getGuilds(options?: { limit?: number; after?: string; before?: string }): Promise<Guild[]>;
  }

  export class MemberAPI {
    getMembers(guildId: string, options?: { limit?: number; after?: string }): Promise<Member[]>;
    getMember(guildId: string, userId: string): Promise<Member>;
    deleteMember(guildId: string, userId: string): Promise<void>;
  }

  export class ChannelAPI {
    getChannels(guildId: string): Promise<Channel[]>;
    getChannel(channelId: string): Promise<Channel>;
    createChannel(guildId: string, data: CreateChannelData): Promise<Channel>;
    updateChannel(channelId: string, data: UpdateChannelData): Promise<Channel>;
    deleteChannel(channelId: string): Promise<void>;
  }

  export class MessageAPI {
    sendMessage(channelId: string, data: SendMessageData): Promise<Message>;
    sendTextMessage(channelId: string, content: string, options?: SendMessageOptions): Promise<Message>;
    sendEmbedMessage(channelId: string, embed: Embed, options?: SendMessageOptions): Promise<Message>;
    sendArkMessage(channelId: string, ark: Ark, options?: SendMessageOptions): Promise<Message>;
    sendMarkdownMessage(channelId: string, markdown: Markdown, options?: SendMessageOptions): Promise<Message>;
    sendImageMessage(channelId: string, imageUrl: string, options?: SendMessageOptions): Promise<Message>;
    sendReplyMessage(channelId: string, content: string, referenceMessageId: string, options?: SendMessageOptions): Promise<Message>;
    getMessages(channelId: string, options?: GetMessagesOptions): Promise<Message[]>;
    getMessage(channelId: string, messageId: string): Promise<Message>;
    deleteMessage(channelId: string, messageId: string): Promise<void>;
    getRichMediaMessage(channelId: string, messageId: string): Promise<Message>;
    setMessageButtons(channelId: string, messageId: string, keyboard: Keyboard): Promise<void>;
    createButtonTemplate(template: ButtonTemplate): Promise<ButtonTemplate>;
    getButtonTemplates(): Promise<ButtonTemplate[]>;
    deleteButtonTemplate(templateId: string): Promise<void>;
    createDMS(recipientId: string, sourceGuildId: string): Promise<DMS>;
    sendDMS(guildId: string, data: SendMessageData): Promise<Message>;
  }

  export class ReactionAPI {
    createReaction(channelId: string, messageId: string, type: string, id: string): Promise<void>;
    deleteReaction(channelId: string, messageId: string, type: string, id: string): Promise<void>;
    getReactionUsers(channelId: string, messageId: string, type: string, id: string, options?: { limit?: number }): Promise<User[]>;
  }

  export class AudioAPI {
    startAudio(channelId: string, audioUrl: string, text?: string): Promise<void>;
    pauseAudio(channelId: string): Promise<void>;
    resumeAudio(channelId: string): Promise<void>;
    stopAudio(channelId: string): Promise<void>;
    getMicList(channelId: string): Promise<MicList>;
    onMic(channelId: string): Promise<void>;
    offMic(channelId: string): Promise<void>;
  }

  export class ForumAPI {
    getThreads(channelId: string, options?: GetThreadsOptions): Promise<Thread[]>;
    getThread(channelId: string, threadId: string): Promise<Thread>;
    createThread(channelId: string, data: CreateThreadData): Promise<Thread>;
    deleteThread(channelId: string, threadId: string): Promise<void>;
    getReplies(channelId: string, threadId: string, options?: GetRepliesOptions): Promise<Reply[]>;
    createReply(channelId: string, threadId: string, data: CreateReplyData): Promise<Reply>;
    deleteReply(channelId: string, threadId: string, replyId: string): Promise<void>;
  }

  export class PermissionAPI {
    getRoles(guildId: string): Promise<Role[]>;
    createRole(guildId: string, data: CreateRoleData): Promise<Role>;
    updateRole(guildId: string, roleId: string, data: UpdateRoleData): Promise<Role>;
    deleteRole(guildId: string, roleId: string): Promise<void>;
    addRoleMember(guildId: string, roleId: string, userId: string): Promise<void>;
    deleteRoleMember(guildId: string, roleId: string, userId: string): Promise<void>;
    getChannelPermissions(channelId: string, userId: string): Promise<ChannelPermissions>;
    updateChannelPermissions(channelId: string, userId: string, data: UpdatePermissionsData): Promise<void>;
    getChannelRolePermissions(channelId: string, roleId: string): Promise<ChannelPermissions>;
    updateChannelRolePermissions(channelId: string, roleId: string, data: UpdatePermissionsData): Promise<void>;
    getAPIPermissions(guildId: string): Promise<APIPermission[]>;
    requireAPIPermission(guildId: string, channelId: string, data: RequireAPIPermissionData): Promise<APIPermissionDemand>;
  }

  export class UserAPI {
    getMe(): Promise<User>;
    getCurrentUser(): Promise<User>;
    getMeGuilds(options?: { limit?: number; after?: string; before?: string }): Promise<Guild[]>;
    getUser(guildId: string, userId: string): Promise<User>;
    getShareUrl(guildId: string, channelId?: string): Promise<{ url: string }>;
    addBot(guildId: string, userId: string): Promise<void>;
    removeBot(guildId: string, userId: string): Promise<void>;
    rejectBotMessage(guildId: string, userId: string): Promise<void>;
    allowBotMessage(guildId: string, userId: string): Promise<void>;
  }

  export class ScheduleAPI {
    getSchedules(channelId: string, options?: GetSchedulesOptions): Promise<Schedule[]>;
    getSchedule(channelId: string, scheduleId: string): Promise<Schedule>;
    createSchedule(channelId: string, data: CreateScheduleData): Promise<Schedule>;
    updateSchedule(channelId: string, scheduleId: string, data: UpdateScheduleData): Promise<Schedule>;
    deleteSchedule(channelId: string, scheduleId: string): Promise<void>;
  }

  export class MessageAuditAPI {
    getAuditResult(auditId: string): Promise<MessageAuditResult>;
  }

  // ==================== 数据类型 ====================
  export interface Guild {
    id: string;
    name: string;
    icon: string;
    owner_id: string;
    owner: boolean;
    member_count: number;
    max_members: number;
    description: string;
    joined_at: string;
  }

  export interface Channel {
    id: string;
    guild_id: string;
    name: string;
    type: number;
    position: number;
    parent_id: string;
    owner_id: string;
    sub_type: number;
  }

  export interface Member {
    user: User;
    nick: string;
    roles: string[];
    joined_at: string;
  }

  export interface User {
    id: string;
    username: string;
    avatar: string;
    bot: boolean;
    union_openid?: string;
    union_user_account?: string;
  }

  export interface Message {
    id: string;
    channel_id: string;
    guild_id: string;
    content: string;
    timestamp: string;
    edited_timestamp: string;
    mention_everyone: boolean;
    author: User;
    mentions: User[];
    attachments: Attachment[];
    embeds: Embed[];
    reactions: Reaction[];
    message_reference?: MessageReference;
    ark?: Ark;
  }

  export interface Embed {
    title?: string;
    description?: string;
    color?: number;
    fields?: EmbedField[];
    thumbnail?: EmbedThumbnail;
    image?: EmbedImage;
    footer?: EmbedFooter;
  }

  export interface EmbedField {
    name: string;
    value: string;
    inline?: boolean;
  }

  export interface EmbedThumbnail {
    url: string;
  }

  export interface EmbedImage {
    url: string;
  }

  export interface EmbedFooter {
    text: string;
    icon_url?: string;
  }

  export interface Ark {
    template_id: number;
    kv: ArkKV[];
  }

  export interface ArkKV {
    key: string;
    value?: string;
    obj?: ArkObj[];
  }

  export interface ArkObj {
    obj_kv: ArkKV[];
  }

  export interface Markdown {
    content: string;
  }

  export interface Attachment {
    id: string;
    filename: string;
    content_type?: string;
    size: number;
    url: string;
    description?: string;
  }

  export interface Reaction {
    user_id: string;
    emoji: Emoji;
    type: number;
  }

  export interface Emoji {
    id: string;
    type: number;
  }

  export interface MessageReference {
    message_id: string;
    channel_id?: string;
    guild_id?: string;
  }

  export interface Keyboard {
    rows: KeyboardRow[];
  }

  export interface KeyboardRow {
    buttons: Button[];
  }

  export interface Button {
    id: string;
    render_data: ButtonRenderData;
    action: ButtonAction;
  }

  export interface ButtonRenderData {
    label: string;
    visited_label?: string;
    style?: number;
  }

  export interface ButtonAction {
    type: number;
    permission?: ButtonPermission;
    data?: string;
    reply?: boolean;
    enter?: boolean;
    anchor?: number;
  }

  export interface ButtonPermission {
    type: number;
    specify_role_ids?: string[];
    specify_user_ids?: string[];
  }

  export interface ButtonTemplate {
    id?: string;
    name: string;
    template: Keyboard;
  }

  export interface DMS {
    guild_id: string;
    channel_id: string;
    create_time: string;
  }

  export interface Role {
    id: string;
    name: string;
    color: number;
    hoist: boolean;
    number: number;
    member_limit: number;
  }

  export interface ChannelPermissions {
    permissions: string;
  }

  export interface APIPermission {
    path: string;
    method: string;
    desc: string;
    auth_status: number;
  }

  export interface APIPermissionDemand {
    guild_id: string;
    channel_id: string;
    api_identify: APIPermission;
    title: string;
    desc: string;
  }

  export interface Thread {
    channel_id: string;
    guild_id: string;
    author_id: string;
    thread_info: ThreadInfo;
  }

  export interface ThreadInfo {
    thread_id: string;
    title: string;
    content: string;
    date_time: string;
  }

  export interface Reply {
    channel_id: string;
    guild_id: string;
    author_id: string;
    thread_id: string;
    reply_info: ReplyInfo;
  }

  export interface ReplyInfo {
    reply_id: string;
    content: string;
    date_time: string;
  }

  export interface Schedule {
    id: string;
    name: string;
    description: string;
    start_timestamp: string;
    end_timestamp: string;
    creator_id: string;
    jump_channel_id: string;
    remind_type: number;
  }

  export interface MessageAuditResult {
    audit_id: string;
    message_id?: string;
    audit_status: number;
  }

  export interface MicList {
    channel_id: string;
    list: MicUser[];
  }

  export interface MicUser {
    index: number;
    user_id: string;
    mute: boolean;
    deaf: boolean;
  }

  export interface GatewayBot {
    url: string;
    shards: number;
    session_start_limit: {
      total: number;
      remaining: number;
      reset_after: number;
      max_concurrency: number;
    };
  }

  // ==================== 请求参数类型 ====================
  export interface CreateChannelData {
    name: string;
    type: number;
    position?: number;
    parent_id?: string;
    sub_type?: number;
  }

  export interface UpdateChannelData {
    name?: string;
    position?: number;
    parent_id?: string;
  }

  export interface SendMessageData {
    content?: string;
    embed?: Embed;
    ark?: Ark;
    markdown?: Markdown;
    image?: string;
    message_reference?: MessageReference;
  }

  export interface SendMessageOptions {
    msg_id?: string;
    event_id?: string;
  }

  export interface GetMessagesOptions {
    limit?: number;
    type?: string;
    id?: string;
  }

  export interface GetThreadsOptions {
    limit?: number;
    before?: string;
    after?: string;
  }

  export interface GetRepliesOptions {
    limit?: number;
    before?: string;
    after?: string;
  }

  export interface CreateThreadData {
    title: string;
    content: ThreadContent;
  }

  export interface ThreadContent {
    paragraphs: ThreadParagraph[];
  }

  export interface ThreadParagraph {
    type: number;
    elems: ThreadElem[];
  }

  export interface ThreadElem {
    text?: { text: string };
    image?: { url: string };
  }

  export interface CreateReplyData {
    content: string;
  }

  export interface CreateRoleData {
    name?: string;
    color?: number;
    hoist?: boolean;
  }

  export interface UpdateRoleData {
    name?: string;
    color?: number;
    hoist?: boolean;
  }

  export interface UpdatePermissionsData {
    add?: string;
    remove?: string;
  }

  export interface RequireAPIPermissionData {
    path: string;
    method: string;
    desc: string;
  }

  export interface GetSchedulesOptions {
    since?: string;
    before?: string;
    after?: string;
    limit?: number;
  }

  export interface CreateScheduleData {
    name: string;
    description?: string;
    start_timestamp: string;
    end_timestamp: string;
    remind_type: number;
    jump_channel_id?: string;
  }

  export interface UpdateScheduleData {
    name?: string;
    description?: string;
    start_timestamp?: string;
    end_timestamp?: string;
    remind_type?: number;
    jump_channel_id?: string;
  }
}

// ==================== 子模块类型声明 ====================
declare module 'qqbot-api/types' {
  export * from 'qqbot-api';
}

declare module 'qqbot-api/core' {
  export * from 'qqbot-api';
}

declare module 'qqbot-api/api' {
  export * from 'qqbot-api';
}
