import { Newtype } from './01_we_are_not_the_same';

type StripePaymentId = Newtype<string, 'StripePaymentId'>;
type PaypalPaymentId = Newtype<string, 'StripePaymentId'>;

// discriminated union

type StripePayment = {
  provider: 'stripe';
  id: StripePaymentId;
  stripeSpecificField: number;
};

type PaypalPayment = {
  provider: 'paypal';
  id: PaypalPaymentId
  paypalSpecificField: string;
}

type BitcoinPayment = {
  provider: 'bitcoin';
  hash: string;
}

type Payment = StripePayment | PaypalPayment; // | BitcoinPayment

// exhaustiveness check
// done better in better languages, but at least we have this

const handlePayment = (payment: Payment) => {
  switch (payment.provider) {
    case 'stripe': {
      const field = payment.stripeSpecificField;
      // const field = payment.paypalSpecificField; // won't compile
      break;
    }

    case 'paypal': {
      const field = payment.paypalSpecificField;
      // const field = payment.stripeSpecificField; // won't compile
      break;
    }

    default: {
      const _: never = payment;
    }

  }
}