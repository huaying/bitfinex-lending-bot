const { getPeriod } = require("./utils");

test("test peiord-rate mapping", () => {
  const rates = [0.0001, 0.0002, 0.00033, 0.0004, 0.0006, 0.0007, 0.001];
  const expects = [2, 2, 3, 5, 10, 20, 30];
  rates.forEach((rate, idx) => {
    expect(getPeriod(rate)).toBe(expects[idx]);
  });
});
