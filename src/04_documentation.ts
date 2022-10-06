import { Node, NodeType } from './03_generics';

type EdgeType = 'subscription' | 'admin' | 'payout';

// one - to - one here for simplicity
// can be (and should be) one - to - many
// can be (and should be) runtime configurable
type NodeRelations = {
  user: {
    subscription: 'blog',
    admin: 'blog',
  },
  blog: {
    payout: 'user',
  }
};

type NodeRelation<T extends NodeType, E extends keyof NodeRelations[T]> = NodeRelations[T][E];

const db: [Node<NodeType>, EdgeType, Node<NodeType>][] = [];

const initEdge = <
  T extends NodeType,
  E extends keyof NodeRelations[T] & EdgeType,
  T2 extends NodeRelations[T][E] & NodeType
>(from: Node<T>, type: E, to: Node<T2>) => {
  db[db.length] = [from, type, to];
};

initEdge({
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
}, 'admin', {
  type: 'blog',
  meta: {
    title: 'Bobbert\'s blog',
  }
});

// impossible
// initEdge({
//   type: 'blog',
//   meta: {
//     title: 'Bobbert\'s blog',
//   }
// }, 'admin', {
//   type: 'user',
//   meta: {
//     firstName: 'Bobbert',
//   }
// });

// impossible
// initEdge({
//   type: 'user',
//   meta: {
//     firstName: 'Bobbert',
//   }
// }, 'subscription', {
//   type: 'user',
//   meta: {
//     firstName: 'Bobbert',
//   }
// });

initEdge({
  type: 'blog',
  meta: {
    title: 'Bobbert\'s blog',
  }
}, 'payout', {
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
});

// note that here we should actually have an api with
// initEdge(NodeId<...>, EdgeType, NodeId<...>)
// but I don't want to go into Id type parametrisation for the sake of example

// one-to-many
type NodeRelationsOtM = {
  user: {
    subscription: ['blog', 'user'],
    admin: ['blog'],
  },
  blog: {
    payout: ['user'],
  }
};

// there's a price: we have to help it with types a lot on advanced use cases
const initEdgeOtM = <
  T extends NodeType,
  E extends keyof NodeRelationsOtM[T] & EdgeType,
  T2 extends (NodeRelationsOtM[T][E] & NodeType[])[number] & NodeType
>(from: Node<T>, type: E, to: Node<T2>) => {
  db[db.length] = [from, type, to];
};

// a new feature that's impossible above, is supported here: user subscribed to user

initEdgeOtM({
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
}, 'subscription', {
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
});

// invalid state is still impossible
// initEdgeOtM({
//   type: 'blog',
//   meta: {
//     title: 'Bobbert\'s blog',
//   }
// }, 'subscription', {
//   type: 'user',
//   meta: {
//     firstName: 'Bobbert',
//   }
// });

// can move it to runtime; it will be DRY enough but won't *look* DRY
// we can generate db runtime checks out of it now
const nodeRelationsOtM: NodeRelationsOtM = {
  user: {
    subscription: ['blog', 'user'],
    admin: ['blog'],
  },
  blog: {
    payout: ['user'],
  }
};

// ^ note! boilerplate but not "repeating ourselves" because inconsistencies are checked

const assertDbChecks = () => {
  const tuples = Object.entries(nodeRelationsOtM).flatMap(
    ([from, edges]) => Object.entries(edges).flatMap(
      ([edge, tos]) => tos.map(
        (to: NodeType) => [from, edge, to] as const)));
  // pseudo statements
  const statements = tuples.map(([from, edge, to]) => `VALIDATE(${from}, ${edge}, ${to})`);
  console.log(statements);
}

// run:
// assertDbChecks();

// now we can:
const validateApiCall = (/*...*/) => {
  // validate against nodeRelationsOtM
};

// and:
const generateJsonSchema = (/*...*/) => {
  // transform nodeRelationsOtM
};

// or we can completely DRY it
const nodeRelationsOtMRuntime = {
  user: {
    subscription: ['blog', 'user'],
    admin: ['blog'],
  },
  blog: {
    payout: ['user'],
  }
} as const;

type NodeRelationsOtMRuntime = typeof nodeRelationsOtMRuntime;

// the incurred price is still the same
const initEdgeOtMRuntime = <
  T extends NodeType,
  E extends keyof NodeRelationsOtMRuntime[T] & EdgeType,
  T2 extends (NodeRelationsOtMRuntime[T][E] & NodeType[])[number] & NodeType
>(from: Node<T>, type: E, to: Node<T2>) => {
  db[db.length] = [from, type, to];
};

initEdgeOtMRuntime({
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
}, 'subscription', {
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
});

// invalid state is still impossible
// initEdgeOtMRuntime({
//   type: 'blog',
//   meta: {
//     title: 'Bobbert\'s blog',
//   }
// }, 'subscription', {
//   type: 'user',
//   meta: {
//     firstName: 'Bobbert',
//   }
// });
