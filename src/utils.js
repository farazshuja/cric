const ballToOvers = (balls) => {
  const overs = balls / 6;
  if (balls < 1) {
    return '0.0';
  }
  if (overs === 1) {
    return '1.0';
  }
  return `${parseInt(overs, 10)}.${balls % 6}`;
};

export const getNewInns = (toBat, toBall) => ({
  isDeclared: false,
  balls: [],
  bats: [
    {
      country: toBat[0],
      player: `${toBat[0]}-P1`,
      runs: 0,
      balls: 0,
      out: 'not out',
      isFacing: true,
    },
    {
      country: toBat[1],
      player: `${toBat[1]}-P1`,
      runs: 0,
      balls: 0,
      out: 'not out',
      isFacing: false,
    },
    {
      country: '---',
      player: '---',
      runs: 0,
      balls: 0,
      out: 'DNB',
      isFacing: false,
    },
  ],
  ballers: [
    {
      country: toBall[0],
      balls: 0,
      runs: 0,
      outs: 0,
      isBalling: true,
    },
    {
      country: toBall[1],
      balls: 0,
      runs: 0,
      outs: 0,
      isBalling: false,
    },
  ],
});

/** Get Total from inns.bats */
export const getTotal = (bats) => {
  const total = {
    runs: 0,
    balls: 0,
    outs: 0,
  };
  bats.forEach((bat) => {
    total.runs += bat.runs;
    total.balls += bat.balls;
    total.outs += (bat.out === 'not out' || bat.out === 'DNB') ? 0 : 1;
  });
  return total;
};

export default ballToOvers;
