pub contract ProjectRegistry {

    pub event ProjectRegistered(id: UInt64, name: String, owner: Address)

    pub struct Project {
        pub let id: UInt64
        pub let name: String
        pub let owner: Address
        pub let description: String
        pub let createdAt: UFix64

        init(id: UInt64, name: String, owner: Address, description: String, createdAt: UFix64) {
            self.id = id
            self.name = name
            self.owner = owner
            self.description = description
            self.createdAt = createdAt
        }
    }

    access(self) var projects: {UInt64: Project}
    access(self) var nextProjectId: UInt64

    pub fun registerProject(name: String, description: String): UInt64 {
        let id = self.nextProjectId
        let owner = AuthAccount(payer: signer).address
        let project = Project(id: id, name: name, owner: owner, description: description, createdAt: getCurrentBlock().timestamp)
        self.projects[id] = project
        self.nextProjectId = id + 1
        emit ProjectRegistered(id: id, name: name, owner: owner)
        return id
    }

    pub fun getProject(id: UInt64): Project? {
        return self.projects[id]
    }

    init() {
        self.projects = {}
        self.nextProjectId = 1
    }
} 