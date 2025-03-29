
import React, { useState } from "react";

// ----------------------------------------------------------------------------------------------------------
// HELPER FUNCTIONS
// ----------------------------------------------------------------------------------------------------------

// Generate a random value in the range {min, max}
function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Create an attack log
function createLogAttack(isPlayer, damage) {
  return {
    isPlayer: isPlayer,
    isDamage: true,
    text: ` takes ${damage} damage`,
  };
}

// Create a healing log
function createLogHeal(healing) {
  return {
    isPlayer: true,
    isDamage: false,
    text: ` heals ${healing} life points`,
  };
}

function Game() {
  // ----------------------------------------------------------------------------------------------------------
  // STATES & VARIABLES
  // ----------------------------------------------------------------------------------------------------------

  const [monsterHealth, setMonsterHealth] = useState(100);
  const [playerHealth, setPlayerHealth] = useState(100);
  const [turnCount, setTurnCount] = useState(0);
  const [battleLog, setBattleLog] = useState([]);

  // ----------------------------------------------------------------------------------------------------------
  // BUTTONS EVENT FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  function monsterAttack() {
    const damage = getRandomValue(5, 15);
    setPlayerHealth((prevHealth) => Math.max(prevHealth - damage, 0));
    setBattleLog((log) => [...log, createLogAttack(false, damage)]);
  }

  function attack() {
    const damage = getRandomValue(5, 12);
    setMonsterHealth((prevHealth) => Math.max(prevHealth - damage, 0));
    setBattleLog((log) => [...log, createLogAttack(true, damage)]);
    setTurnCount(turnCount + 1);
    setTimeout(monsterAttack, 500);
  }

  function special() {
    if (turnCount % 3 !== 0) return; // Special attack only every 3 turns
    const damage = getRandomValue(8, 25);
    setMonsterHealth((prevHealth) => Math.max(prevHealth - damage, 0));
    setBattleLog((log) => [...log, createLogAttack(true, damage)]);
    setTurnCount(turnCount + 1);
    setTimeout(monsterAttack, 500);
  }

  function heal() {
    const healing = getRandomValue(8, 15);
    setPlayerHealth((prevHealth) => Math.min(prevHealth + healing, 100));
    setBattleLog((log) => [...log, createLogHeal(healing)]);
    setTurnCount(turnCount + 1);
    setTimeout(monsterAttack, 500);
  }

  function killYourself() {
    setPlayerHealth(0);
    setMonsterHealth(0);
    setBattleLog((log) => [...log, { isPlayer: true, isDamage: false, text: "Player killed themselves" }]);
  }

  // Game Over Check
  if (playerHealth === 0 || monsterHealth === 0) {
    return (
      <>
        <section className="container">
          <h2>Game Over!</h2>
          <h3>{playerHealth === 0 ? "You lost!" : "You won!"}</h3>
          <button onClick={() => window.location.reload()}>Start New Game</button>
        </section>
      </>
    );
  }

  // ----------------------------------------------------------------------------------------------------------
  // JSX FUNCTIONS
  // ----------------------------------------------------------------------------------------------------------

  function showPlayerHealth() {
    return {
      width: `${playerHealth}%`
    };
  }

  function showMonsterHealth() {
    return {
      width: `${monsterHealth}%`
    };
  }

  // ----------------------------------------------------------------------------------------------------------
  // MAIN TEMPLATE
  // ----------------------------------------------------------------------------------------------------------

  return (
    <>
      <section className="container">
        <h2>Monster Health</h2>
        <div className="healthbar">
          <div style={showMonsterHealth()} className="healthbar__value"></div>
        </div>
      </section>
      <section className="container">
        <h2>Your Health</h2>
        <div className="healthbar">
          <div style={showPlayerHealth()} className="healthbar__value"></div>
        </div>
      </section>
      <section id="controls">
        <button onClick={attack}>ATTACK</button>
        <button onClick={special} disabled={turnCount % 3 !== 0}>SPECIAL!</button>
        <button onClick={heal}>HEAL</button>
        <button onClick={killYourself}>KILL YOURSELF</button>
      </section>
      <section id="log" className="container">
        <h2>Battle Log</h2>
        <ul>
          {battleLog.map((logItem, index) => (
            <li key={index}>
              <span>{logItem.isPlayer ? "Player" : "Monster"}</span>
              <span>{logItem.isDamage ? ` attacked for ${logItem.text}` : logItem.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

export default Game;