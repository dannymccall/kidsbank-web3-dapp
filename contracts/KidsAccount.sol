// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract KidsBank {
    address owner;
    struct KidAccount {
        address parent;
        string parentName;
        address child;
        string childName;
        uint8 age;
        uint256 balance;
        uint256 allowance;
        uint256 withdrawLimit;
        uint256 lastDeposit;
        uint256 nextAllowanceTime;
        bool hasGuardianApproval;
        bool isAccountActive;
    }

    event AccountCreated(
        address indexed parent,
        address indexed child,
        string childName,
        uint8 age
    );
    event DepositMade(
        address indexed parent,
        address indexed child,
        uint256 amount
    );
    event AccountDeactivated(address indexed _child);
    event AccountActivated(address indexed _child);
    event WithdrawalMade(
        address indexed _add,
        address indexed _add2,
        uint256 amount
    );

    mapping(address => KidAccount) public kidAccounts;
    mapping(address => bool) public isParent;
    mapping(address => mapping(bytes32 => bool)) private usedChildNames;
    modifier isParentOnly() {
        require(isParent[msg.sender], "Only parents can call make this transaction");
        _;
    }

    modifier childBelongToParent(address _add) {
        require(_add != address(0), "Invalid child address");
        require(
            kidAccounts[_add].parent == msg.sender,
            "Not a parent of this account!"
        );
        _;
    }

    modifier isAccountActive(address _add) {
        require(kidAccounts[_add].isAccountActive, "Account is not active");
        _;
    }

    function createAccount(
        address _child,
        string memory _childName,
        uint8 _age,
        string memory parentName
    ) public {
        require(_child != address(0), "Invalid child address");
        require(msg.sender != _child, "Only parents can create accounts");
        require(_age > 0 && _age < 18, "Age must be between 1 and 17");

        bytes32 childNameHash = keccak256(abi.encodePacked(_childName));

        // Check if this parent has already used this child name
        require(
            !usedChildNames[msg.sender][childNameHash],
            "You have already used this child name"
        );

        kidAccounts[_child] = KidAccount({
            parent: msg.sender,
            child: _child,
            childName: _childName,
            age: _age,
            balance: 0,
            allowance: 0,
            withdrawLimit: 0,
            hasGuardianApproval: false,
            isAccountActive: true,
            parentName: parentName,
            lastDeposit: block.timestamp,
            nextAllowanceTime: 0
        });

        usedChildNames[msg.sender][childNameHash] = true; // Store used name for this parent

        emit AccountCreated(msg.sender, _child, _childName, _age);

        isParent[msg.sender] = true;
    }

    function getKid(
        address _kid
    )
        public
        view
        returns (
            address parent,
            address child,
            string memory childName,
            uint256 balance,
            string memory parentName
        )
    {
        KidAccount memory k = kidAccounts[_kid];
        return (k.parent, k.child, k.childName, k.balance, k.parentName);
    }

    function checkIfParent(address _add) public view returns (bool) {
        return isParent[_add];
    }

    function checkIfChild(address _addr) public view returns (bool) {
        return kidAccounts[_addr].parent != address(0); // Quick lookup
    }

    function setAllowance(
        address _child,
        uint256 amountInEther
    ) public isParentOnly {
        require(_child != address(0), "Invalid child address"); // Quick check for errors
        kidAccounts[_child].allowance = amountInEther; 
    }

    function deposit(
        address _child
    )
        public
        payable
        isParentOnly
        childBelongToParent(_child)
        isAccountActive(_child)
    {
        require(_child != address(0), "Invalid child address");
        require(
            checkIfChild(_child),
            "Account does not exist for this address"
        );
        require(msg.value > 0, "Amount must be greater than 0");

        kidAccounts[_child].balance += msg.value;
        kidAccounts[_child].lastDeposit = block.timestamp;
        emit DepositMade(msg.sender, _child, msg.value);
    }

    function activateAccont(address _add) public childBelongToParent(_add) {
        kidAccounts[_add].isAccountActive = true;
        emit AccountActivated(_add);
    }

    function checkAndDeactivateAccount(address _child) public {
        require(
            checkIfChild(_child),
            "Account does not exist or is already deactivated"
        );
        uint256 lastTimeDeposit = kidAccounts[_child].lastDeposit;
        uint256 threeMonths = 90 days;

        if (block.timestamp >= (lastTimeDeposit + threeMonths)) {
            kidAccounts[_child].isAccountActive = false;
            emit AccountDeactivated(_child);
        }
    }

    function withdraw(address _child, uint _amount) public {
        require(_child != address(0), "Invalid child address");
  
        KidAccount memory account = kidAccounts[_child];
        require(account.balance >= _amount, "Insufficient balance");

        // If the parent is withdrawing, allow any amount
        if (msg.sender == account.parent) {
            account.balance -= _amount;
            payable(msg.sender).transfer(_amount);
            emit WithdrawalMade(msg.sender, _child, _amount);
            return;
        }

        // If a child is withdrawing, enforce allowance rules
        require(
            msg.sender == _child,
            "Only the child can withdraw their allowance"
        );
        require(
            block.timestamp >= account.nextAllowanceTime,
            "Allowance not available yet"
        );
        require(_amount <= account.allowance, "Exceeds allowance limit");

        // Process allowance withdrawal
        account.balance -= _amount;
        account.nextAllowanceTime = block.timestamp + 30 days;
        payable(msg.sender).transfer(_amount);

        emit WithdrawalMade(msg.sender, _child, _amount);
    }
}
