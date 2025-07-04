// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ProjectRegistry {
    struct Project {
        uint64 id;
        string name;
        address owner;
        string description;
        uint256 createdAt;
    }

    mapping(uint64 => Project) public projects;
    uint64 public nextProjectId = 1;

    event ProjectRegistered(uint64 indexed id, string name, address indexed owner);

    function registerProject(string memory name, string memory description) public returns (uint64) {
        uint64 id = nextProjectId;
        Project memory project = Project({
            id: id,
            name: name,
            owner: msg.sender,
            description: description,
            createdAt: block.timestamp
        });
        
        projects[id] = project;
        nextProjectId = id + 1;
        
        emit ProjectRegistered(id, name, msg.sender);
        return id;
    }

    function getProject(uint64 id) public view returns (Project memory) {
        return projects[id];
    }

    function projectExists(uint64 id) public view returns (bool) {
        return projects[id].id != 0;
    }
} 