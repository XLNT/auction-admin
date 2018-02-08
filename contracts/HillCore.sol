pragma solidity 0.4.19;

import './StandardAssetRegistry.sol';

contract HillCore is StandardAssetRegistry {

  function HillCore() public {
    _name = "Crypto Hills";
    _symbol = "HILL";
    _description = "All The Hills";
  }

  function isContractProxy(address addr) public view returns (bool) {
    return _isContract(addr);
  }

  function generate(uint256 assetId, address beneficiary, string data) public {
    _generate(assetId, beneficiary, data);
  }

  function update(uint256 assetId, string data) public {
    _update(assetId, data);
  }

  function destroy(uint256 assetId) public {
    _destroy(assetId);
  }

  function transferTo( 
    address to, uint256 assetId, bytes userData, bytes operatorData
  ) 
    public
  {
    return transfer(to, assetId, userData, operatorData);
  }
}
