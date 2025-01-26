module ibt_coin::ibt {
    use std::option::none<u8>();
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    // A struct to represent your IBT coin type. 
    // "drop" and "store" are typical abilities used for coins.
    struct IBT has drop {
    }

    /// Initialize the coin type so it can be used on-chain
    fun init(witness: IBT, ctx: &mut TxContext) {
    	let (treasury, metadata) = coin::create_currency(witness, 6, b"IBT", b"IBT", b"", option::none(), ctx);
    	transfer::public_freeze_object(metadata,ctx);
    	transfer::public_transfer(treasury, tx_context::sender(ctx),ctx)
    }

    /// Mints new coins and sends them to `recipient`.
    /// Only the `admin` object owner can call this in a fully locked-down scenario.
    public entry fun mint(
        treasury: &mut coin::TreasuryCap<IBT>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury, amount, recipient, ctx)
    }

    /// Burns a coin. The coin must be in the caller’s possession.
       public entry fun burn(treasury: &mut coin::TreasuryCap<IBT>, coin: coin::Coin<IBT>, tx: &mut TxContext) {
        coin::burn(treasury, coin,ctx);
    }
}

