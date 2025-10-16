export interface IAPIResponse<T> {
  success: boolean;
  data: T;
  message: string;
  type: "error" | "success";
}

export interface IUser {
  _id: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface IStartingNumber {
  _id: string;
  value: number;
  createdAt: string;
  updatedAt: string;
  author: IUser;
  operationsCount: number;
  operations: IOperationsTree[];
}

export interface IOperationsTree {
  _id: string;
  operator: "+" | "-" | "*" | "/";
  value: number;
  result: number;
  parentType: "StartingNumber" | "Operation";
  parentId: string;
  author: {
    _id: string;
    username: string;
  };
  children: IOperationsTree[];
}
