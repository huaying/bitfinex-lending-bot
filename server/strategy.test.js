const Stratege = require("./strategy");

test("test strategy: split normally", async () => {
  const ccy = "USD";
  const rate = 0.0007;
  const avaliableBalance = 1500;
  const offers = Stratege.splitEqually(avaliableBalance, rate, ccy);

  expect(offers[0].amount).toBe(1000);
  expect(offers[0].period).toBe(20);
  expect(offers[0].rate).toBe(0.0007);
  expect(offers[1].amount).toBe(500);
  expect(offers[1].period).toBe(20);
  expect(offers[1].rate).toBe(0.0007);
});

test("test strategy: split pyramidally", async () => {
  const ccy = "USD";
  let rate, avaliableBalance, offers;

  rate = 0.0004;
  avaliableBalance = 3000;
  offers = Stratege.splitPyramidally(avaliableBalance, rate, ccy);

  expect(offers[0]).toEqual({
    amount: 350,
    rate: 0.0004,
    period: 5,
    ccy: "USD"
  });

  expect(offers[4]).toEqual({
    amount: 725.76,
    rate: 0.0005178153086419753,
    period: 10,
    ccy: "USD"
  });

  rate = 0.0015;
  offers = Stratege.splitPyramidally(avaliableBalance, rate, ccy);
  expect(offers[1]).toEqual({
    amount: 1200,
    rate: 0.0015,
    period: 30,
    ccy: "USD"
  });

  rate = 0.00005;
  offers = Stratege.splitPyramidally(avaliableBalance, rate, ccy);
  expect(offers[0]).toEqual({
    amount: 100,
    rate: 0.00005,
    period: 2,
    ccy: "USD"
  });
  expect(offers[2]).toEqual({
    amount: 144,
    rate: 0.000060500000000000014,
    period: 2,
    ccy: "USD"
  });
});
