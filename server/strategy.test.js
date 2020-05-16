const Stratege = require("./strategy");

test("test strategy: split normally", async () => {
  const ccy = "USD";
  // const rate = await getRate(ccy);
  const rate = 0.0007;
  const avaliableBalance = 1500;
  const offers = Stratege.splitEqually(avaliableBalance, rate, ccy);

  expect(offers[0].amount).toBe(1000);
  expect(offers[0].period).toBe(10);
  expect(offers[0].rate).toBe(0.0007);
  expect(offers[1].amount).toBe(500);
  expect(offers[1].period).toBe(10);
  expect(offers[1].rate).toBe(0.0007);
});
