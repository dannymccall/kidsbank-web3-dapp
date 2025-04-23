const KidsBank = artifacts.require("KidsBank");

contract("KidsBank", (accounts) => {
  let kidsBankInstance;
  before(async () => {
    kidsBankInstance = await KidsBank.deployed();
  });
  it("should add new kid details to the kidAccounts mapping", async () => {
    const child = accounts[1];
    const childName = "Daniel Palmer";
    const age = 16;
    const parentName = "Dorcas Larbi";
    const parent = accounts[0];
    await kidsBankInstance.createAccount(child, childName, age, parentName, {
      from: parent,
    });

    const result = await kidsBankInstance.getKid(child);

    // Validate the returned data
    assert.equal(result[0], parent, "Parent address mismatch");
    assert.equal(result[1], child, "Child address mismatch");
    assert.equal(result[2], childName, "Child name mismatch");
    assert.equal(result[3].toNumber(), 0, "Balance should be 0 initially");
    assert.equal(result[4], parentName, "Parent name mismatch");
  });
  it("should check if the deployer is a parent", async () => {
    const result = await kidsBankInstance.checkIfParent(accounts[0]);

    assert.equal(result, true, "The deployer should be recognized as a parent");
  });

  it("should return false for a non-parent address", async () => {
    const result = await kidsBankInstance.checkIfParent(accounts[1]);

    assert.equal(result, false, "A random address should not be a parent");
  });

  it("should check if the deployer is a child", async() => {
    const result = await kidsBankInstance.checkIfChild(accounts[1]);
    assert.equal(result, true, "Address not a child's address")
  });

  it("should make deposit into a child's account", async () => {
    await kidsBankInstance.deposit(accounts[1], {from: accounts[0], value: 5});
  })
});
