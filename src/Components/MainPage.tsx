import { Row, Alert, Container, Button, Col } from "react-bootstrap";
import { discord_url } from "../config.json";

export default function MainPage() {

  
  return (
    <>
      <br></br>
      <Row className="justify-content-md-center listfeed">
        <h1 style={{ alignContent: "center", textAlign: "center" }}>
          <Alert className="initbotheader">Dungeon Bot</Alert>
        </h1>
      </Row>
      <Container>
        <Row className="justify-content-md-center">
          <Col md={8}>
            <Row className="justify-content-md-center titleh">
              <h2 style={{ alignContent: "center", textAlign: "center" }}>
                <a href={discord_url} target="_blank" rel="noopener noreferrer">
                  <Button className="nopadding">
                    Invite Dungeon Bot to Discord!
                  </Button>
                </a>
              </h2>
            </Row>
            <br></br>
            <p>
              Dungeon Bot is a Discord bot that allows you to track initiative
              either through Discord Commands or by a website.
            </p>
            <p>
              Tracking initiative and spell effects has always been such a
              hassle for my Pathfinder group. Who would take care of initiative?
              What spells are active? Whose turn is it? This problem only grew
              once we moved to Discord due to the pandemic. I had been tinkering
              around with Python at the time, and decided that I wanted to solve
              this problem by building a Discord Bbot. Through trials,
              tribulations, and screaming at the computer screen, I slowly
              worked towards the culmination of what I have today. The final
              product is a React JS front end, with a Node backend.{" "}
            </p>
            <p>
              Originally, this project was just a Discord bot. You would enter
              in your initiative and progress initiative through slash commands.
              This was cumbersome, and changing initiative required resetting
              things and starting over. I decided that adding in a web component
              alongside the Discord bot would be the easiest solution. With
              React JS I was able to create a page that allowed you to change
              your initiative order with ease using a sortable list.
            </p>
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
            <br></br>
            <Row className="justify-content-md-center titleh">
              <h2 style={{ alignContent: "center", textAlign: "center" }}>
                Discord Commands
              </h2>
            </Row>
            <br></br>
            <p>
              <h5>
                <i>maths:</i>
              </h5>
              <br></br>
              This allows you to evaluate arithmetic operations like 2+2.
              Alternatively, you can simply type in 2+2 to get the result. This
              command uses the Evaluate function from Math JS. You can add,
              subtract, multiply, do certain algebraic functions (9/3 + 2i),
              etc.
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>roller:</i>
              </h5>
              <br></br>
              This is the dice roller. It uses the rpg-dice-roller library. You
              can use one of it's multiple aliases (roller, r, /r) or you can
              type in 2d20 or 3d6 to roll the dice.
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>add_npc or add_pc:</h5>
              <br></br>
              These add in a player character or non-player character to the
              initiative. You'll need to type the command and the character's
              Name, Initiative, and Modifier. For example, let's say that
              Meridia has an initiative modifier of 2 and she rolled a 18 on the
              dice. That would be an initiative of 20 with a modifier of two. So
              your command would look like this:
              <strong>add_pc Meridia,20,2</strong>
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>getlink:</i>
              </h5>
              <br></br>
              This command initiates the session in the channel that you invoke
              it in. You're given a link to your specific session page as well.
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>changechannel and changeid:</i>
              </h5>
              <br></br>
              The bot takes the channel ID when you use the getlink command and
              stores it in a database so that the bot and the Website can talk
              with each other. If you need to move your session to a different
              channel, you can first use the changeid command to get the command
              you need to change the channel. This will look like: changechannel
              123-2shd-23423 Copy the command and then send it in the channel
              you wish to change the session to.
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>clearsessionlist:</i>
              </h5>
              <br></br>
              This resets the session, clearing out all initiative records
              (leaving spells, effects, buffs, etc. in place).
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>roundstart:</i>
              </h5>
              <br></br>
              Type in this command to start rounds.
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>next:</i>
              </h5>
              <br></br>
              Use the command to move the initiative forward once rounds have
              started.
            </p>
            <br></br>
            <br></br>
            <p>
              <h5>
                <i>spells:</i>
              </h5>
              <br></br>
              Use this command to get a current list of all spells, effects,
              etc.
            </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
