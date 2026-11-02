import {integer} from "./core.mjs";

export function battleOdds(attackDice, defendDice) {
  if (!integer(attackDice, 1, 3) || !integer(defendDice, 1, 2)) throw Error("Invalid dice odds.");
  let attackerWins = 0, total = 0;
  for (const attacker of diceRolls(attackDice)) {
    for (const defender of diceRolls(defendDice)) {
      total++;
      const attack = [...attacker].sort((left, right) => right - left);
      const defend = [...defender].sort((left, right) => right - left);
      let defenderLosses = 0;
      for (let index = 0; index < Math.min(attack.length, defend.length); index++) {
        if (attack[index] > defend[index]) defenderLosses++;
      }
      if (defenderLosses > 0) attackerWins++;
    }
  }
  return {attackerWins, defenderWins: total - attackerWins, total};
}

export function diceRolls(count) {
  const rolls = [[]];
  for (let die = 0; die < count; die++) {
    const next = [];
    for (const roll of rolls) for (let value = 1; value <= 6; value++) next.push([...roll, value]);
    rolls.length = 0;
    rolls.push(...next);
  }
  return rolls;
}
