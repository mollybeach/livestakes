// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PredictionMarket {
    enum Side { Yes, No }
    enum State { Open, Closed, Resolved }

    uint64 public projectId;
    string public projectName;
    address public oracle;
    State public state;
    Side public outcome;

    mapping(address => mapping(uint8 => uint256)) public bets;
    mapping(uint8 => uint256) public totalBets;
    uint256 public totalPool;

    event BetPlaced(address indexed user, Side side, uint256 amount);
    event MarketClosed();
    event MarketResolved(Side outcome);
    event PayoutClaimed(address indexed user, uint256 amount);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Not oracle");
        _;
    }
    modifier inState(State _state) {
        require(state == _state, "Invalid state");
        _;
    }

    constructor(uint64 _projectId, string memory _projectName, address _oracle) {
        projectId = _projectId;
        projectName = _projectName;
        oracle = _oracle;
        state = State.Open;
    }

    function placeBet(Side side) external payable inState(State.Open) {
        require(msg.value > 0, "No ETH sent");
        bets[msg.sender][uint8(side)] += msg.value;
        totalBets[uint8(side)] += msg.value;
        totalPool += msg.value;
        emit BetPlaced(msg.sender, side, msg.value);
    }

    function closeMarket() external onlyOracle inState(State.Open) {
        state = State.Closed;
        emit MarketClosed();
    }

    function resolveMarket(Side _outcome) external onlyOracle inState(State.Closed) {
        outcome = _outcome;
        state = State.Resolved;
        emit MarketResolved(_outcome);
    }

    function claimPayout() external inState(State.Resolved) {
        uint256 userBet = bets[msg.sender][uint8(outcome)];
        require(userBet > 0, "No winning bet");
        uint256 winners = totalBets[uint8(outcome)];
        require(winners > 0, "No winners");
        uint256 payout = (userBet * totalPool) / winners;
        bets[msg.sender][uint8(outcome)] = 0;
        (bool sent, ) = msg.sender.call{value: payout}("");
        require(sent, "Payout failed");
        emit PayoutClaimed(msg.sender, payout);
    }

    function getInfo() external view returns (
        uint64 _projectId,
        string memory _projectName,
        State _state,
        Side _outcome,
        uint256 yesBets,
        uint256 noBets,
        uint256 _totalPool
    ) {
        return (
            projectId,
            projectName,
            state,
            outcome,
            totalBets[uint8(Side.Yes)],
            totalBets[uint8(Side.No)],
            totalPool
        );
    }
} 