<template>
  <div>
    <div class="flex flex-column align-items-center justify-content-center">
      <div class="main-content">
        <div>
          <h2>
            <Button class="p-button-secondary mb-6 shadow-8">
              Invite Dungeon Bot to Discord!
            </Button>
          </h2>
        </div>
        <br />
        <Card class="shadow-8">
          <template #content>
            <p>
              Dungeon Bot is a Discord bot that allows you to track initiative
              either through Discord Commands or by a website.
            </p>
            <hr class="mt-6" />
            <p>
              Tracking initiative and spell effects has always been such a
              hassle for my Pathfinder group. Who would take care of initiative?
              What spells are active? Whose turn is it? This problem only grew
              once we moved to Discord due to the pandemic. I had been tinkering
              around with Python at the time, and decided that I wanted to solve
              this problem by building a Discord Bbot. Through trials,
              tribulations, and screaming at the computer screen, I slowly
              worked towards the culmination of what I have today. The final
              product is a React JS front end, with a Node backend.
            </p>
            <hr class="mt-6" />
            <p>
              Originally, this project was just a Discord bot. You would enter
              in your initiative and progress initiative through slash commands.
              This was cumbersome, and changing initiative required resetting
              things and starting over. I decided that adding in a web component
              alongside the Discord bot would be the easiest solution. With
              React JS I was able to create a page that allowed you to change
              your initiative order with ease using a sortable list.
            </p>
            <hr class="mt-6" />
            <p>
              When adding your initiative, you can choose to either provide your
              own roll or let the bot do it for you! You can also edit your
              initiative values at any time as well as use the bot to reroll for
              you. No sorting is required. The bot does it for you. Click "Sort
              Initiative" when you're ready to start rounds! Players can also
              easily add in spells, spell effects, and the like. When you click
              on a spell in the list, it populates the information in the info
              section to the right. You can then add characters in initiative to
              the Target Group, which then places a marker below their
              initiative record with the name of the effect. This provides a
              quick and easy way to show which buffs or debuffs a NPC or PC has.
            </p>
            <hr class="mt-6" />
            <p>
              If you need to change who the current initiative is at, you can
              click "Current" next to their name. This will then place a green
              outline around their record. Finally, the website is integrated
              with the Discord bot mentioned above. You have the ability to send
              both the list of spells and initiative list at this time. Moving
              the initiative backwards or forwards from the bot triggers the
              website and vice versa. You'll receive a Discord notification
              whenever you move the initiative forward or sort the initiative
              from Discord.
            </p>
          </template>
        </Card>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <span class="p-fieldset text-2xl p-2 mt-8 shadow-8"
          >Discord Commands</span
        >
        <br />
        <br />
        <br />
        <br />
        <Fieldset legend="/addchar" class="shadow-8">
          <p>
            This command allows you to add your character to the initiative
            list. You can also do so from the website component. Grab a link
            using the /link command.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/addroll" class="shadow-8">
          <p>
            This command is used in conjunction with the /collectrolls command.
            If you want to roll in person, instead of the dice bot, you can use
            the /addroll command to add your roll to the collected list.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/changechannel" class="shadow-8">
          <p>
            The bot takes the channel ID when you use the getlink command and
            stores it in a database so that the bot and the Website can talk
            with each other. If you need to move your session to a different
            channel then type in this command and a drop-down menu of Text
            Channels in your guild will appear. Select the channel from the list
            to move your session to.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/clearsesssion" class="shadow-8">
          <p>
            This resets the session, clearing out all initiative records and
            spells.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/collectrolls" class="shadow-8">
          <p>
            This command allows you to collect rolls and organize them in an
            embed. When you run this command, both a tag and the number of rolls
            to be collected is required. Everyone can roll a dice (using just
            d20 or /roll) with their appropriate modifier, the tag, and a name
            that the roll is for if needed.
            <strong>I.E. d20+3 init Meridia</strong> You can also add a roll to
            the collector using /addroll. This will ask for a roll total, the
            tag, and (if you need to differentiate rolls) a name for the roll.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/help" class="shadow-8">
          <p>
            Choose a command from the drop-down list to receive a helpful
            snippet about the command.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/link" class="shadow-8">
          <p>
            This command gives you a link to the website component of the bot.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/listinitiative" class="shadow-8">
          <p>
            This command will reply with an embed that lists everyone in
            initiative. It is by order of first (top) to last(bottom).
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/maths" class="shadow-8">
          <p>
            This allows you to evaluate arithmetic operations like 2+2.
            Alternatively, you can simply type in 2+2 to get the result. This
            command uses the Evaluate function from Math JS. You can add,
            subtract, multiply, do certain algebraic functions (9/3 + 2i), etc.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/next" class="shadow-8">
          <p>
            Use the command to move the initiative forward once rounds have
            started.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/previous" class="shadow-8">
          <p>
            Use the command to move the initiative backwards once rounds have
            started.
          </p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/roll" class="shadow-8">
          <p>
            This is the dice roller. It uses the rpg-dice-roller library. You
            can use /roll or just type d20 and any other modifiers, as well as a
            comment! <strong>I.E. d20+5 will save</strong>
          </p>
        </Fieldset>
        <hr class="mt-6" />

        <br />
        <br />
        <Fieldset legend="/resort" class="shadow-8">
          <p>Type in this command to resort initiative and keep turn order.</p>
        </Fieldset>
        <hr class="mt-6" />
        <br />
        <br />
        <Fieldset legend="/start" class="shadow-8">
          <p>
            Type in this command to sort initiative and start rounds. This will
            reset turn order and resort all characters in the initiative order.
          </p>
        </Fieldset>
        <hr class="mt-6" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Fieldset from "primevue/fieldset";
import Card from "primevue/card";

export default defineComponent({
  name: "Home",
  components: { Button, Fieldset, Card },
  setup() {
    const data = reactive({
      items: [
        {
          id: "1234",
          title: "A",
        },
        { id: "5678", title: "B" },
        { id: "0564", title: "C" },
      ],
    });
    return { data };
  },
});
</script>

<style scoped>
.main-content {
  width: 50vw;
}
</style>
