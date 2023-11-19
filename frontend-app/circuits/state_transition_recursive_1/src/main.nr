use dep::std;

struct State {
    x: Field,
    y: Field,
    dir: Field, // 0: left, 1: right, 2: up, 3: down
}

fn main(
    next_hash: pub Field,
    hash: pub Field,
    prev_hash: pub Field,
    verification_key : [Field; 114],
    proof : [Field; 94],
    public_inputs : [Field; 1],
    key_hash : Field,
    input_aggregation_object : [Field; 16],
    proof_b : [Field; 94]
) -> pub [Field; 16] {
    
    std::verify_proof(
        verification_key.as_slice(),
        proof.as_slice(),
        public_inputs.as_slice(),
        key_hash,
        input_aggregation_object
    );
}

#[test]
fn test_main() {

    // Uncomment to make test fail
    // main(1, 1);
}
