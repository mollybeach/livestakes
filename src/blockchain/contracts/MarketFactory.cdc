pub contract MarketFactory {

    pub event MarketDeployed(address: Address, question: String)

    pub fun deployMarket(question: String): Address {
        // In real Flow, this would deploy a new contract to a new account
        // For demo, just emit event and return dummy address
        let dummyAddress: Address = 0x01
        emit MarketDeployed(address: dummyAddress, question: question)
        return dummyAddress
    }
} 