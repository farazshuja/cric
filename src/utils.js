import { merge } from 'lodash-es';

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

/* Section for Points Calculations */
export const runsToPoints = (runs) => {
  const fp = runs - 20;
  let pts = 0;
  if (fp >= 0) {
    pts = 1;
    pts += parseInt(fp / 15, 10);
  }
  return pts;
};

export const innsToBatPoints = (inn) => {
  const p = {};
  inn
    .bats
    .filter((b) => b.country !== '---')
    .forEach((b) => {
      p[b.country] = {
        batPoints: runsToPoints(b.runs),
      };
    });
  return p;
};

export const teamResult = (team1, p1, team2, p2) => {
  const result = {};
  result[team1[0]] = { WLD: p1 };
  result[team1[1]] = { WLD: p1 };
  result[team2[0]] = { WLD: p2 };
  result[team2[1]] = { WLD: p2 };
  return result;
};

export const innsToTeamPoints = (inn) => {
  const p = {};
  let totalRuns = 0;
  inn
    .bats
    .filter((b) => b.country !== '---')
    .forEach((b) => {
      totalRuns += b.runs;
    });
  const t1 = inn.bats[0].country;
  const t2 = inn.bats[1].country;
  const pts = runsToPoints(totalRuns);
  p[t1] = { batTeamPoints: pts };
  p[t2] = { batTeamPoints: pts };
  return p;
};

export const scoreToWinPoints = (score) => {
  let result = null;
  if (score && score.length === 2) {
    const totalInns = score[0].inns.length + score[1].inns.length;
    const team1 = score[0].team.split('-');
    const team2 = score[1].team.split('-');
    result = teamResult(team1, 0, team2, 0);
    // follow on case
    if (totalInns === 3 && score[0].inns.length === 1 && score[1].inns[1].outs === 3) {
      if ((score[1].inns[0].runs + score[1].inns[1].runs) < score[0].inns[0].runs) {
        result = teamResult(team1, 5, team2, 0);
      }
    } else if (totalInns === 3 && score[0].inns.length === 2 && score[0].inns[1].outs === 3) {
      if ((score[0].inns[0].runs + score[0].inns[1].runs) < score[1].inns[0].runs) {
        result = teamResult(team1, 0, team2, 5);
      }
    } else if (totalInns === 4) {
      const isFollowOn = (score[0].inns[0].runs / 2 > score[1].inns[0].runs);
      const t1Score = score[0].inns[0].runs + score[0].inns[1].runs;
      const t2Score = score[1].inns[0].runs + score[1].inns[1].runs;
      if (isFollowOn) {
        if (t1Score > t2Score) {
          result = teamResult(team1, 5, team2, 0);
        } else if (score[0].inns[1].outs === 3 && t2Score > t1Score) {
          result = teamResult(team1, 0, team2, 5);
        }
      } else {
        // eslint-disable-next-line
        if (t2Score > t1Score) {
          result = teamResult(team1, 0, team2, 5);
        } else if (score[1].inns[1].outs === 3 && t1Score > t2Score) {
          result = teamResult(team1, 5, team2, 0);
        }
      }
    }
  }
  return result; // no result so far
};

export const innsToBallerPoints = (inn) => {
  const p = {};
  inn.ballers.forEach((b) => {
    p[b.country] = {
      ballerPoints: b.outs,
    };
  });
  return p;
};


export const calculateAllPoints = (match) => {
  const result = {};
  let score = [];
  let points = {};
  let remaingBalls = 150;
  if (match) {
    match.inns.forEach((inn, i) => {
      const bats = inn.bats.filter((b) => b.country !== '---');
      const team = [...new Set(bats.map((b) => b.country))].sort().join('-');
      const total = getTotal(bats);
      if (total.balls === 0) {
        return;
      }
      if (result[team]) {
        result[team].push(total);
      } else {
        result[team] = [total];
      }

      // bat n ball points are only for first inns
      if (i < 2) {
        points = merge(
          points,
          innsToBatPoints(inn),
          innsToBallerPoints(inn),
          innsToTeamPoints(inn),
        );
      }
      remaingBalls -= total.balls;
    });
  }
  score = Object.keys(result).map((key) => ({
    team: key,
    inns: result[key],
  }));
  points = merge(points, scoreToWinPoints(score));
  points = Object.keys(points).map((key) => {
    const p = points[key];
    const total = p.batPoints + p.ballerPoints + p.batTeamPoints + p.WLD;
    return {
      country: key,
      total,
      ...p,
    };
  }).sort((a, b) => b.total - a.total);

  return {
    score,
    points,
    remaingBalls,
  };
};
/* End of Section for Points Calculations */

export const addOrPush = (obj, p1, p2, v) => {
  if (!obj[p1]) {
    // eslint-disable-next-line
    obj[p1] = {};
  }
  if (Array.isArray(obj[p1][p2])) {
    obj[p1][p2].push(v);
  } else {
    // eslint-disable-next-line
    obj[p1][p2] = [v];
  }
};

export default ballToOvers;
