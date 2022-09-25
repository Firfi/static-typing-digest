import { BlogId, Currency, routePayment, UserId } from '../lib';

const request = {amount: 100, currency: 'USD' as Currency, payerId: 'payer1' as UserId, payeeId: 'payee1' as BlogId};

// simulate a payment; we want to show the user where their money'll go
export const apiHandler = (r: typeof request) => routePayment(r);