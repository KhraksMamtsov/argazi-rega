type Time = readonly [hours: number, minutes: number];

export const CLOCK_FACES: Array<{
  face: string;
  time: readonly [Time, Time];
}> = [
  {
    face: "🕛",
    time: [
      [12, 0],
      [0, 0],
    ],
  },
  {
    face: "🕧",
    time: [
      [12, 30],
      [0, 30],
    ],
  },
  {
    face: "🕐",
    time: [
      [13, 0],
      [1, 0],
    ],
  },
  {
    face: "🕜",
    time: [
      [13, 30],
      [1, 30],
    ],
  },
  {
    face: "🕑",
    time: [
      [14, 0],
      [2, 0],
    ],
  },
  {
    face: "🕝",
    time: [
      [14, 30],
      [2, 30],
    ],
  },
  {
    face: "🕒",
    time: [
      [15, 0],
      [3, 0],
    ],
  },
  {
    face: "🕞",
    time: [
      [15, 30],
      [3, 30],
    ],
  },
  {
    face: "🕓",
    time: [
      [16, 0],
      [4, 0],
    ],
  },
  {
    face: "🕟",
    time: [
      [16, 30],
      [4, 30],
    ],
  },
  {
    face: "🕔",
    time: [
      [17, 0],
      [5, 0],
    ],
  },
  {
    face: "🕠",
    time: [
      [17, 30],
      [5, 30],
    ],
  },
  {
    face: "🕕",
    time: [
      [18, 0],
      [6, 0],
    ],
  },
  {
    face: "🕡",
    time: [
      [18, 30],
      [6, 30],
    ],
  },
  {
    face: "🕖",
    time: [
      [19, 0],
      [7, 0],
    ],
  },
  {
    face: "🕢",
    time: [
      [19, 30],
      [7, 30],
    ],
  },
  {
    face: "🕗",
    time: [
      [20, 0],
      [8, 0],
    ],
  },
  {
    face: "🕣",
    time: [
      [20, 30],
      [8, 30],
    ],
  },
  {
    face: "🕘",
    time: [
      [21, 0],
      [9, 0],
    ],
  },
  {
    face: "🕤",
    time: [
      [21, 30],
      [9, 30],
    ],
  },
  {
    face: "🕙",
    time: [
      [22, 0],
      [10, 0],
    ],
  },
  {
    face: "🕥",
    time: [
      [22, 30],
      [10, 30],
    ],
  },
  {
    face: "🕚",
    time: [
      [23, 0],
      [11, 0],
    ],
  },
  {
    face: "🕦",
    time: [
      [23, 30],
      [11, 30],
    ],
  },
];
