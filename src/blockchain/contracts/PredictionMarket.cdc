pub contract PredictionMarket {

    pub event MarketCreated(id: UInt64, question: String, creator: Address)
    pub event BetPlaced(marketId: UInt64, user: Address, outcome: String, amount: UFix64)
    pub event MarketResolved(id: UInt64, outcome: String)
    pub event PayoutClaimed(marketId: UInt64, user: Address, amount: UFix64)

    pub struct Market {
        pub let id: UInt64
        pub let question: String
        pub let creator: Address
        pub var isOpen: Bool
        pub var outcome: String?
        pub var bets: {Address: {String: UFix64}}
        pub var totalBets: {String: UFix64}

        init(id: UInt64, question: String, creator: Address) {
            self.id = id
            self.question = question
            self.creator = creator
            self.isOpen = true
            self.outcome = nil
            self.bets = {}
            self.totalBets = {"yes": 0.0, "no": 0.0}
        }
    }

    access(self) var markets: {UInt64: Market}
    access(self) var nextMarketId: UInt64

    pub fun createMarket(question: String): UInt64 {
        let id = self.nextMarketId
        self.markets[id] = Market(id: id, question: question, creator: AuthAccount(payer: signer).address)
        self.nextMarketId = id + 1
        emit MarketCreated(id: id, question: question, creator: AuthAccount(payer: signer).address)
        return id
    }

    pub fun placeBet(marketId: UInt64, outcome: String, amount: UFix64) {
        let market = self.markets[marketId]!
        pre {
            market.isOpen: "Market is closed"
            outcome == "yes" || outcome == "no": "Invalid outcome"
        }
        let user = AuthAccount(payer: signer).address
        if market.bets[user] == nil {
            market.bets[user] = {"yes": 0.0, "no": 0.0}
        }
        market.bets[user]![outcome] = market.bets[user]![outcome]! + amount
        market.totalBets[outcome] = market.totalBets[outcome]! + amount
        emit BetPlaced(marketId: marketId, user: user, outcome: outcome, amount: amount)
    }

    pub fun resolveMarket(marketId: UInt64, outcome: String) {
        let market = self.markets[marketId]!
        pre {
            market.isOpen: "Market already resolved"
            outcome == "yes" || outcome == "no": "Invalid outcome"
        }
        market.isOpen = false
        market.outcome = outcome
        emit MarketResolved(id: marketId, outcome: outcome)
    }

    pub fun claimPayout(marketId: UInt64) {
        let market = self.markets[marketId]!
        pre {
            !market.isOpen: "Market not resolved yet"
            market.outcome != nil: "Market not resolved yet"
        }
        let user = AuthAccount(payer: signer).address
        let userBet = market.bets[user]?[market.outcome!] ?? 0.0
        let totalWinningBets = market.totalBets[market.outcome!]!
        let totalPool = market.totalBets["yes"]! + market.totalBets["no"]!
        let payout = userBet / totalWinningBets * totalPool
        // payout logic here (send tokens, etc.)
        emit PayoutClaimed(marketId: marketId, user: user, amount: payout)
    }

    init() {
        self.markets = {}
        self.nextMarketId = 1
    }
} 