import { Newtype } from './01_we_are_not_the_same';

// we ignore these in example nodes for brevity
export type NodeId = Newtype<string, 'NodeId'>;
export type EdgeId = Newtype<string, 'EdgeId'>;

export type NodeType = 'user' | 'blog';

type NodeMetaMapping = {
  user: {
    firstName: string;
  },
  blog: {
    title: string;
  },
  // warning! some extra exhaustiveness checks needed, but we won't go into it here
  someOtherType: {
    someOtherField: string;
  }
}

type NodeMeta<T extends NodeType> = NodeMetaMapping[T];

// like TypeVar in Python
export type Node<T extends NodeType> = {
  type: T,
  meta: NodeMeta<T>,
};

const userNode: Node<'user'> = {
  type: 'user',
  meta: {
    firstName: 'Bobbert',
  }
};

const blogNode: Node<'blog'> = {
  type: 'blog',
  meta: {
    title: 'Bobbert\'s blog',
  }
}

const handleUserNode = (node: Node<'user'>) => {
  console.log(node.meta.firstName);
  // impossible
  // node.meta.title
}

handleUserNode(userNode);
// fail
// handleUserNode(blogNode);

const handleBlogNode = (node: Node<'blog'>) => {
  console.log(node.meta.title);
  // impossible
  // node.meta.firstName
}

handleBlogNode(blogNode);
// fail
// handleBlogNode(userNode);

// below advanced things, probably skip

const handleNode = (node: Node<NodeType>) => {
  switch (node.type) {
    case 'user': {
      // typescript can't infer
      // console.log(node.firstName);
      break;
    }

    case 'blog': {
      // typescript can't infer
      // console.log(node.title);
      break;
    }

    default: {
      // const _: never = node;
    }
  }
}

const isUserNode = (node: Node<NodeType>): node is Node<'user'> => node.type === 'user';
const isBlogNode = (node: Node<NodeType>): node is Node<'blog'> => node.type === 'blog';

const handleNodeWithTypeGuards = (node: Node<NodeType>) => {
  if (isUserNode(node)) {
    node.meta.firstName;
  } else if (isBlogNode(node)) {
    node.meta.title;
  } else {
    // no compile time exhaustiveness check; needs a unit test
  }
}