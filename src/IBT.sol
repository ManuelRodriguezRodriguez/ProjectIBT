// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract IBT is ERC20, Ownable {
    constructor() 
        ERC20("IBT Token", "IBT") 
        Ownable(msg.sender) // Pass the initial owner here
    {
        // Optionally mint some initial supply, etc.
        // _mint(msg.sender, 1000 * 10**decimals());
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}

