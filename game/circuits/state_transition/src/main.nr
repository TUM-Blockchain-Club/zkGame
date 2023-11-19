use dep::std;

struct State {
    x: Field,
    y: Field,
    dir: Field, // 0: left, 1: right, 2: up, 3: down
}

fn check_state_transition(hash: Field, state: State, prev_hash: Field, prev_state: State) {
    // make sure prover inputs correct values
    let state_hash = std::hash::pedersen_hash([state.x, state.y, state.dir]);
    assert(state_hash == hash);

    let prev_state_hash = std::hash::pedersen_hash([prev_state.x, prev_state.y, prev_state.dir]);
    assert(prev_state_hash == prev_hash);

    // check direction in range 0..3
    assert(0 <= state.dir as u8);
    assert(3 >= state.dir as u8);

    // check character moved only one field
    let x: u16 = state.x as u16;
    let y: u16 = state.y as u16;
    let prev_x: u16 = prev_state.x as u16;
    let prev_y: u16 = prev_state.y as u16;
    if (x > prev_x) {
        assert(x == prev_x + 1);
        assert(y == prev_y);
    } else if (x < prev_x) {
        assert(x + 1 == prev_x);
        assert(y == prev_y);
    } else if (y > prev_y) {
        assert(y == prev_y + 1);
        assert(x == prev_x);
    } else if (y < prev_y) {
        assert(y + 1 == prev_y);
        assert(x == prev_x);
    }
}

fn main(hash: pub Field, state: State, prev_hash: pub Field, prev_state: State) {
    check_state_transition(hash, state, prev_hash, prev_state);
}

#[test]
fn test_main() {
    main()

    // Uncomment to make test fail
    // main(1, 1);
}
