module ibt_coin::ibt {
    use std::option::none<u8>();
    use sui::coin;
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    struct IBT has drop {
    }

    fun init(witness: IBT, ctx: &mut TxContext) {
    	let (treasury, metadata) = coin::create_currency(witness, 6, b"IBT", b"IBT", b"", option::none(), ctx);
    	transfer::public_freeze_object(metadata,ctx);
    	transfer::public_transfer(treasury, tx_context::sender(ctx),ctx)
    }

    public entry fun mint(
        treasury: &mut coin::TreasuryCap<IBT>, amount: u64, recipient: address, ctx: &mut TxContext
    ) {
        coin::mint_and_transfer(treasury, amount, recipient, ctx)
    }

    public entry fun burn(treasury: &mut coin::TreasuryCap<IBT>, coin: coin::Coin<IBT>, tx: &mut TxContext) {
        coin::burn(treasury, coin,ctx);
    }
}

