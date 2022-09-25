import { BlogId, Currency, routePayment, UserId } from '../lib';

const loadRecentPayments = () => [
  {amount: 100, currency: 'USD' as Currency, payerId: 'payer1' as UserId, payeeId: 'payee1' as BlogId},
  {amount: 200, currency: 'USD' as Currency, payerId: 'payer2' as UserId, payeeId: 'payee2' as BlogId},
  {amount: 300, currency: 'EUR' as Currency, payerId: 'payer3' as UserId, payeeId: 'payee3' as BlogId},
];

const run = () => {
  const payments = loadRecentPayments();
  const results = payments.map(routePayment);
  // further processing i.e. save to db
  console.log(results);
}