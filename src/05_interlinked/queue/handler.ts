import { BlogId, Currency, routePayment, UserId } from '../lib';

// no payee, we have to procure it
const event = {amount: 100, currency: 'USD' as Currency, payerId: 'payer1' as UserId};

const enhanceEventWithPayee = (e: typeof event) => ({
  ...e,
  payeeId: 'payee1' as BlogId
});

const run = () => {
  // won't compile; we forgot the payee
  // const result = routePayment(event);
  const result = routePayment(enhanceEventWithPayee(event));
  // further processing i.e. save to db
  console.log(result);
}