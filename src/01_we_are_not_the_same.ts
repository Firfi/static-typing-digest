
// subscription statuses
const subscriptionStatusClassic = 'active';
const subscriptionStatusInactiveClassic = 'inactive';

// user statuses
const userStatusClassic = 'active';
const userStatusBannedClassic = 'banned';

type SubscriptionClassic = {
  status: string;
};

const subscriptionClassic: SubscriptionClassic = {
  status: 'active'
};

const setSubscriptionStatusClassic = (status: string): void => {
  subscriptionClassic.status = status;
}

// easily fixable with enums
const runClassic = () => {
  // expected: success, actual: success
  setSubscriptionStatusClassic(subscriptionStatusClassic);
  // expected: success, actual: success
  setSubscriptionStatusClassic(subscriptionStatusInactiveClassic);
  // expected: failure, actual: success
  // will work, until it blows up
  // it'll blow up when the maintainer of this code is out of context and is busy with another urgent task
  // which would incur a lot of context switching cost, at the top of a usual "bugfix" time cost
  setSubscriptionStatusClassic(userStatusClassic);
  // expected: failure, actual: probably failure somewhere down the line in production
  setSubscriptionStatusClassic(userStatusBannedClassic);

  if (subscriptionStatusClassic === userStatusClassic) return true; // possible to do
};

// ----

enum SubscriptionStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

enum UserStatusEnum {
  ACTIVE = 'active',
  BANNED = 'banned',
}

type SubscriptionEnum = {
  status: SubscriptionStatusEnum;
};

const subscriptionEnum: SubscriptionEnum = {
  status: SubscriptionStatusEnum.ACTIVE
};

const setSubscriptionStatusEnum = (status: SubscriptionStatusEnum): void => {
  subscriptionClassic.status = status;
};

const runEnums = () => {
  // expected: success, actual: success
  setSubscriptionStatusEnum(SubscriptionStatusEnum.ACTIVE);
  // expected: success, actual: success
  setSubscriptionStatusEnum(SubscriptionStatusEnum.INACTIVE);
  // expected: failure, actual: failure
  // setSubscriptionStatusEnum(UserStatusEnum.ACTIVE);
  // expected: failure, actual: failure
  // setSubscriptionStatusEnum(UserStatusEnum.BANNED);
};

// -----

// We could do better; behold Newtype pattern

const userIdClassic = 'user:1';
const subscriptionIdClassic = 'subscription:1';

type UserClassic = {
  id: string;
};

const userClassic: UserClassic = {
  id: 'user:0'
};

const users: UserClassic[] = [userClassic];

const fetchUserClassic = (id: string): UserClassic | undefined => {
  return users.find(user => user.id === id);
}

const runIdsClassic = () => {
  // expected: success, actual: success
  const userClassic1 = fetchUserClassic(userIdClassic);
  // expected: failure, actual: success
  const userClassic2 = fetchUserClassic(subscriptionIdClassic);
  // it seems not to be a big deal but think about it for a second: do we ever really want to even *try* to fetch a user using a subscription id?
  // wouldn't it be the root cause of a family of bugs?
};

// -----

const firebaseUserIdClassic = 'fb11111';
const userNodeIdClassic = 'user::fb11111';
const customerIdClassic = 'stripe11111';

type UserNodeClassic = {
  id: string;
}

const handleUserNodeClassic = ({ id }: UserNodeClassic) => {
  // at this point, it's easy to miss this naming error; probably should be nodeId or userNodeId
  // but we also have to remember a lot of context: that this is `user::fb11111` and not `fb11111`
  // and, if we also work on a payments-related tasks, that it is not `stripe11111` either
  const userId = id; // is it user id? or user node id?
}

// Newtype is like enums but work with an infinite amount of values [and also not with only strings]

export type Newtype<T, U> = T & {__TYPE__: U}; // __TYPE__ key is arbitrary

type UserId = Newtype<string, 'UserId'>;
type UserNodeId = Newtype<string, 'UserNodeId'>;
type CustomerId = Newtype<string, 'CustomerId'>;

const userId = 'fb11111' as UserId;
const userNodeId = 'user::fb11111' as UserNodeId;
const customerId = 'stripe11111' as CustomerId;

type UserNode = {
  id: UserNodeId;
}

const handleUserNode = ({ id }: UserNode) => {
  // - we see an issue with naming here more clearly
  // - we don't have to remember what kind of id it is; we know it's an ID the graph database uses
  // const userId: UserNodeId = id;
  const userNodeId: UserNodeId = id;

  const userNode1: UserNode = {

    // won't compile
    // id: userId,

    // won't compile
    // id: customerId,

    id: userNodeId,
  };

};

// -----

// Newtype with numbers

// module to hide contextual types
module GameModule {
  // index in a row
  export type X = Newtype<number, 'X'>;
  // index in a column
  export type Y = Newtype<number, 'Y'>;

  // note that player `X` looks like `X` coordinate;
  // it is what it is, we can't call it differently without losing the meaning
  // but we also can't make a mistake because type system won't let us
  type Player = 'X' | 'O'; // kind of a enum here; called a literal type in TS
  type Place = Player | undefined;
  /*
  * [X] [ ] [O]
  * [X] [ ] [ ]
  * [O] [ ] [ ]
   */
  type Field = {
    [j in Y]: {
      [x in X]: Place;
    }
  } // (boolean | undefined)[][]

  const makeEmptyField = () => [
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
    [undefined, undefined, undefined],
  ] as Field;

  export class Game {
    readonly #field: Field;

    constructor() {
      this.#field = makeEmptyField();
    }

    #setCell(x: X, y: Y, player: Player) {
      // not possible:
      // this.#field[x][x] = player;
      // this.#field[x][y] = player;
      this.#field[y][x] = player;
    }

    #getCell(x: X, y: Y): Place {
      return this.#field[y][x];
    }

    #isCellEmpty(x: X, y: Y): boolean {
      return this.#getCell(x, y) === undefined;
    }

    // api

    getCurrentPlayer = (): Player =>
      (this.#field as Place[][]).flat().filter(Boolean).length % 2 === 0 ? 'X' : 'O';

    makeTurn(player: Player, x: X, y: Y) {
      if (this.getCurrentPlayer() !== player) throw new Error('Not your turn');
      if (!this.#isCellEmpty(x, y)) throw new Error('Cell is not empty');
      this.#setCell(x, y, player);
    }

  }
}

import Game = GameModule.Game;
import X = GameModule.X;
import Y = GameModule.Y;

const game = new Game();

const x = 0 as X;
const y = 0 as Y;

game.makeTurn('X', x, y);
// won't compile
// game.makeTurn('O', y, x);

// but! accidentally, will compile; if you ever need this kind operations
const a = x + y;
const b = x * y;

// still, won't compile
// game.makeTurn('X', x + y, y + x);
// game.makeTurn('X', x * y, y * x);

// ------------------- BONUS -----------------------

// Bonus: function arguments examples. Tangentially related to the above

type DbRepository = {
  // ...
}

enum PaymentProvider {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
}

type PaymentMethodId = Newtype<string, 'PaymentMethodId'>;
// we already have it defined
// type UserId = Newtype<string, 'UserId'>;

// tiers

// fixed with named args in some languages, but not in TS (not that it actually needs to be fixed)
const setPaymentInfoTierOMG = (repository: DbRepository,
                               paymentProvider: string,
                               paymentMethodId: string,
                               userId: string
) => {
  // ...
}

// often you get "named args" semantics just by having uniq type for each one
// it's impossible to mess with the args then
// but a long list of args still isn't great
const setPaymentInfoTier3 = (repository: DbRepository,
                             paymentProvider: PaymentProvider,
                             paymentMethodId: PaymentMethodId,
                             userId: UserId
) => {
  // ...
}

// kind of a named args
const setPaymentInfoTier2 = (args: {
  repository: DbRepository;
  paymentProvider: PaymentProvider;
  paymentMethodId: PaymentMethodId;
  userId: UserId;
}) => {
  // ...
}

const setPaymentInfoTier1 = (repository: DbRepository,
                             paymentMethodCompositeKey: {
                               paymentProvider: PaymentProvider,
                               paymentMethodId: PaymentMethodId
                             },
                             userId: UserId
) => {
  // ...
}

// dependency injection
// what we really often have is that the args can be sorted from more general to more specific,
// and vice versa
const setPaymentInfoTier0 =
  (repository: DbRepository) =>
    (userId: UserId) =>
      (paymentMethodCompositeKey: {
        paymentProvider: PaymentProvider,
        paymentMethodId: PaymentMethodId
      }) => {
        // ...
      }

const setUserPaymentInfo = setPaymentInfoTier0({} as DbRepository);
const setBobbertPaymentInfo = setUserPaymentInfo('bobbert' as UserId);

// the trick is these two (paymentProvider and paymentMethodId) are always used together
setBobbertPaymentInfo({
  paymentProvider: PaymentProvider.STRIPE,
  paymentMethodId: 'stripe11111' as PaymentMethodId
});