const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ProjectRegistry", function() {
    let ProjectRegistry;
    let projectRegistry;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async function() {
        [owner, addr1, addr2] = await ethers.getSigners();

        ProjectRegistry = await ethers.getContractFactory("ProjectRegistry");
        projectRegistry = await ProjectRegistry.deploy();
        await projectRegistry.deployed();
    });

    describe("Project Registration", function() {
        it("Should register a new project", async function() {
            const name = "Test Project";
            const description = "A test project for prediction markets";

            await expect(projectRegistry.registerProject(name, description))
                .to.emit(projectRegistry, "ProjectRegistered")
                .withArgs(1, name, owner.address);
        });

        it("Should increment project ID correctly", async function() {
            await projectRegistry.registerProject("Project 1", "Description 1");
            await projectRegistry.registerProject("Project 2", "Description 2");

            expect(await projectRegistry.nextProjectId()).to.equal(3);
        });

        it("Should return correct project data", async function() {
            const name = "Test Project";
            const description = "A test project for prediction markets";

            await projectRegistry.registerProject(name, description);

            const project = await projectRegistry.getProject(1);
            expect(project.id).to.equal(1);
            expect(project.name).to.equal(name);
            expect(project.owner).to.equal(owner.address);
            expect(project.description).to.equal(description);
        });

        it("Should return empty project for non-existent ID", async function() {
            const project = await projectRegistry.getProject(999);
            expect(project.id).to.equal(0);
            expect(project.name).to.equal("");
            expect(project.owner).to.equal(ethers.constants.AddressZero);
        });

        it("Should check project existence correctly", async function() {
            expect(await projectRegistry.projectExists(1)).to.be.false;

            await projectRegistry.registerProject("Test", "Description");

            expect(await projectRegistry.projectExists(1)).to.be.true;
            expect(await projectRegistry.projectExists(999)).to.be.false;
        });
    });

    describe("Multiple Projects", function() {
        it("Should handle multiple projects from different users", async function() {
            await projectRegistry.connect(owner).registerProject("Owner Project", "Owner description");
            await projectRegistry.connect(addr1).registerProject("User Project", "User description");

            const project1 = await projectRegistry.getProject(1);
            const project2 = await projectRegistry.getProject(2);

            expect(project1.owner).to.equal(owner.address);
            expect(project2.owner).to.equal(addr1.address);
        });
    });
});