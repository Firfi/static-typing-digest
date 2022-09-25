import { Newtype } from '../../01_we_are_not_the_same';

export type Currency = 'USD' | 'EUR';

export type UserId = Newtype<string, 'UserId'>;
export type BlogId = Newtype<string, 'BlogId'>;

export type ComputePaymentArgs = {
  amount: number;
  currency: Currency;
  payerId: UserId;
  payeeId: BlogId;
}

// assignment: substitute the arg with me
export type ComputePaymentWithStrategyArgs = ComputePaymentArgs & {
  strategy: 'even' | 'weighted';
}

export type ComputePaymentResult = {
  packets: Array<{
    amount: number;
    payeeId: UserId;
  }>
}

export const routePayment = (args: ComputePaymentArgs): ComputePaymentResult => ({
  packets: [{
    amount: args.amount / 2,
    payeeId: 'finalPayee1' as UserId,
  }, {
    amount: args.amount / 2,
    payeeId: 'finalPayee2' as UserId,
  }]
});