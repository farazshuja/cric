import groupBy from 'underscore/modules/groupBy';

function seriesNameToNumber(seriesName) {
  return Number(seriesName.replace('Series-', ''));
}

export function groupBySeries(matches) {
  const grps = groupBy(matches, 'series');
  return Object
    .entries(grps)
    .map(([key, value]) => ({
      series: key,
      matches: value.sort((a, b) => b.timestamp - a.timestamp),
    }))
    .sort((a, b) => seriesNameToNumber(b.series) - seriesNameToNumber(a.series));
}

export function tut() {
  return 'tu';
}
