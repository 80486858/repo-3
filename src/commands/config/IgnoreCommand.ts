import { Message } from 'discord.js';

import * as ignoreList from '~/util/db/IgnoreList';
import localize from '~/util/i18n/localize';

import Command from '../base/Command';
import userHasElevatedRole from '../util/userHasElevatedRole';

export class IgnoreCommand extends Command {
  public readonly triggers = ['ignore'];
  public readonly usage = 'Usage: !ignore <user>';

  public run(message: Message) {
    if (!message.member) return;

    const allowedToRunCommand = userHasElevatedRole(message.member);
    if (!allowedToRunCommand) {
      message.channel.send(localize.t('errors.unauthorized'));
      return;
    }

    const { users } = message.mentions;
    if (users.size < 1) {
      message.channel.send(this.usage);
      message.channel.send(localize.t('helpers.userFinder.error'));
      return;
    }

    users.forEach(user => {
      ignoreList.add(user.id);
      message.channel.send(localize.t('commands.ignore.add', { user: user.username }));
    });
  }
}
