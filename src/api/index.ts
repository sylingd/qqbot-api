/**
 * API模块索引
 */

import GuildAPI from './guild';
import MemberAPI from './member';
import ChannelAPI from './channel';
import MessageAPI from './message';
import ReactionAPI from './reaction';
import AudioAPI from './audio';
import ForumAPI from './forum';
import PermissionAPI from './permission';
import UserAPI from './user';
import ScheduleAPI from './schedule';
import MessageAuditAPI from './messageAudit';

// 导出所有API类
export {
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