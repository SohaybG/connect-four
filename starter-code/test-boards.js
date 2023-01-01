const tiedTestBoard = [
    {
        "player": "player_one",
        "column": 1,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 1,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 3
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 4
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 5
    },
    {
        "player": "player_two",
        "column": 1,
        "row": 6
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 2,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 3
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 4
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 5
    },
    {
        "player": "player_one",
        "column": 3,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 3
    },
    {
        "player": "player_one",
        "column": 3,
        "row": 4
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 5
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 6
    },
    {
        "player": "player_one",
        "column": 4,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 4,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 4,
        "row": 3
    },
    {
        "player": "player_one",
        "column": 4,
        "row": 4
    },
    {
        "player": "player_two",
        "column": 4,
        "row": 5
    },
    {
        "player": "player_one",
        "column": 4,
        "row": 6
    },
    {
        "player": "player_one",
        "column": 5,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 5,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 5,
        "row": 3
    },
    {
        "player": "player_two",
        "column": 5,
        "row": 4
    },
    {
        "player": "player_one",
        "column": 5,
        "row": 5
    },
    {
        "player": "player_two",
        "column": 5,
        "row": 6
    },
    {
        "player": "player_two",
        "column": 6,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 6,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 6,
        "row": 3
    },
    {
        "player": "player_one",
        "column": 6,
        "row": 4
    },
    {
        "player": "player_two",
        "column": 6,
        "row": 5
    },
    {
        "player": "player_one",
        "column": 6,
        "row": 6
    },
    {
        "player": "player_one",
        "column": 7,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 7,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 7,
        "row": 3
    },
    {
        "player": "player_two",
        "column": 7,
        "row": 4
    },
    {
        "player": "player_one",
        "column": 7,
        "row": 5
    },
    {
        "player": "player_two",
        "column": 7,
        "row": 6
    }
];

const playerOneHorizontalWinTestBoard = [
    {
        "player": "player_one",
        "column": 1,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 1,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 2,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 3,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 2
    }
];

const playerOneVerticalWinTestBoard = [
    {
        "player": "player_one",
        "column": 1,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 3
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 3
    }
];

const playerOneUpwardDiagonalWinTestBoard = [
    {
        "player": "player_one",
        "column": 1,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 2,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 3,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 3,
        "row": 3
    },
    {
        "player": "player_two",
        "column": 4,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 4,
        "row": 2
    },
    {
        "player": "player_two",
        "column": 4,
        "row": 3
    },
    {
        "player": "player_one",
        "column": 5,
        "row": 1
    }
];

const playerOneDownwardWinTestBoard = [
    {
        "player": "player_one",
        "column": 1,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 1,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 3
    },
    {
        "player": "player_one",
        "column": 1,
        "row": 4
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 1
    },
    {
        "player": "player_two",
        "column": 2,
        "row": 2
    },
    {
        "player": "player_one",
        "column": 2,
        "row": 3
    },
    {
        "player": "player_two",
        "column": 3,
        "row": 1
    },
    {
        "player": "player_one",
        "column": 3,
        "row": 2
    }
];