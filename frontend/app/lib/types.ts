export type Transaction = {
    transactionHash: string,
    transactionStatus: string,
    from:string;
    to:string;
    _id: string;
    createdAt: string
}

export interface ITransaction{
    transaction: Transaction
}

export interface TransactionProps {
    transactions: Transaction[]
}


export type Account = {
    childName: string,
    loginId: string,
    childAddress: string,
    _id: string,
    createdAt: string
}

export interface IAccount {
    account: Account
}
export interface AccountProps {
    accounts: Account[]
}

export interface CustomFile {
    name: string;
    lastModified: number;
    lastModifiedDate: Date;
webkitRelativePath: string;
    size: number;
    // Add other properties if needed, for example:
    // type: string;
  }


  export interface ParentData {
    _id: string;
    address: string;
    email: string;
    child?: {
      _id: string;
      address: string;
    };
  }
  
  export interface ChildData {
    _id: string;
    address: string;
    parent?: {
      _id: string;
      address: string;
      email: string;
    };
  }
  
  export interface GetUserDataOptions {
    userId?: string;
    childAddress: string;
    isParent: boolean;
  }
  
  export interface GetUserDataResult {
    parent?: ParentData;
    child?: ChildData;
    error?: string;
  }
  