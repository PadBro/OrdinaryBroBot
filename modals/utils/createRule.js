import {
  ModalBuilder,
  TextInputBuilder,
  ActionRowBuilder,
  TextInputStyle,
} from 'discord.js';
import { rule as ruleModel } from '../../models/rule.js';

const modal = new ModalBuilder()
  .setCustomId('createRule')
  .setTitle('Create rule');

const questionInput = new TextInputBuilder()
  .setCustomId('name')
  .setLabel('Name:')
  .setStyle(TextInputStyle.Short);

const answerInput = new TextInputBuilder()
  .setCustomId('rule')
  .setLabel('Rule:')
  .setStyle(TextInputStyle.Paragraph);

const questionActionRow = new ActionRowBuilder().addComponents(questionInput);
const answerActionRow = new ActionRowBuilder().addComponents(answerInput);

modal.addComponents(questionActionRow, answerActionRow);

export { modal };

export const handler = async (interaction) => {
  const name = interaction.fields.getTextInputValue('name');
  const rule = interaction.fields.getTextInputValue('rule');

  try {
    await ruleModel.create({ name, rule });

    await interaction.reply({
      content: `The rule "${name}" was created.`,
      ephemeral: true,
    });
  } catch (e) {
    if (e.errors) {
      const errors = e.errors.map((error) => error.message).join('\n');
      await interaction.reply({
        content: errors,
        ephemeral: true,
      });
    } else {
      console.error(e);
      await interaction.reply({
        content: `An error ocoured while creating the rule entry. Please try again later. If this error persists, please report to the staff team.`,
        ephemeral: true,
      });
    }
  }
};
