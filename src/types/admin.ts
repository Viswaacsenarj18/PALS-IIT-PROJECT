export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'farmer' | 'tractor_owner' | 'admin';
}

export interface Node {
  _id: string;
  nodeId: string;
  name: string;
  channelId: string;
  readApiKey: string;
  user?: {
    _id: string;
    name: string;
    email: string;
  };
}

