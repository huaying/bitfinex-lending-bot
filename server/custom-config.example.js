module.exports = {
  Strategy: {
    splitEqually: {
      MIN_TO_LEND: 50,
      NUM_ALL_IN: 1100,
      SPLIT_UNIT: 1000,
      RATE_EXPECTED_OVER_AMOUNT: 50000
    },
    splitPyramidally: {
      MIN_TO_LEND: 50,
      UP_BOUND_RATE: 0.001, // around 40% annual rate
      LOW_BOUND_RATE: 0.0001, // around 4% annual rate
      AMOUNT_GROW_EXP: 1.4,
      AMOUNT_INIT_MAP: [
        [0.0007, 1200],
        [0.0006, 900],
        [0.0005, 700],
        [0.0004, 550],
        [0.0003, 400],
        [0.0002, 300]
      ],
      RATE_EXPECTED_OVER_AMOUNT: 10000
    }
  },
  Rate: {
    EXPECTED_AMOUNT: 50000
  },
  Period: {
    PERIOD_MAP: [
      [0.3, 30],
      [0.25, 20],
      [0.2, 10],
      [0.15, 5],
      [0.12, 3]
    ]
  }
};
