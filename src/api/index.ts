/**
 * API模块索引
 */

import AudioAPI from './audio';
import ChannelAPI from './channel';
import ChannelMessageAPI from './channelMessage';
import ForumAPI from './forum';
import GuildAPI from './guild';
import MemberAPI from './member';
import MessageAuditAPI from './messageAudit';
import PermissionAPI from './permission';
import ReactionAPI from './reaction';
import ScheduleAPI from './schedule';
import UserAPI from './user';

// 导出所有API类
export {
  AudioAPI,
  ChannelAPI,
  ChannelMessageAPI,
  ForumAPI,
  GuildAPI,
  MemberAPI,
  MessageAuditAPI,
  PermissionAPI,
  ReactionAPI,
  ScheduleAPI,
  UserAPI,
};

// 默认导出
export default {
  GuildAPI,
  MemberAPI,
  ChannelAPI,
  MessageAPI,
  ReactionAPI,
  AudioAPI,
  ForumAPI,
  PermissionAPI,
  UserAPI,
  ScheduleAPI,
  MessageAuditAPI,
};
