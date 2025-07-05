const { ethers } = require('hardhat');
const deployments = require('../deployment-flow-testnet.json');

async function testMarket() {
  console.log('🧪 Testing market functionality...');
  
  // Replace with your actual market address
  const marketAddress = '0x...'; // You'll need to provide this
  
  if (!marketAddress || marketAddress === '0x...') {
    console.log('❌ Please provide the market address in the script');
    return;
  }
  
  // Get the market contract ABI
  const PredictionMarketArtifact = require('../artifacts/contracts/PredictionMarket.sol/PredictionMarket.json');
  
  // Get signer
  const [signer] = await ethers.getSigners();
  console.log('📝 Using signer:', signer.address);
  
  // Connect to the market contract
  const market = new ethers.Contract(
    marketAddress,
    PredictionMarketArtifact.abi,
    signer
  );
  
  try {
    // Get market info
    console.log('📊 Getting market info...');
    const info = await market.getMarketInfo();
    
    console.log('Market Information:');
    console.log('- Question:', info.question);
    console.log('- State:', info.state.toString(), '(0 = Open, 1 = Closed, 2 = Resolved)');
    console.log('- Total Pool:', ethers.formatEther(info.totalPool), 'FLOW');
    console.log('- Yes Bets:', ethers.formatEther(info.yesBets), 'FLOW');
    console.log('- No Bets:', ethers.formatEther(info.noBets), 'FLOW');
    console.log('- Total Bettors:', info.totalBettors.toString());
    console.log('- Created At:', new Date(Number(info.createdAt) * 1000).toLocaleString());
    
    // Check if market is open for betting
    if (info.state === 0n) {
      console.log('✅ Market is OPEN and ready for bets!');
      
      // Test placing a small bet (0.001 FLOW)
      console.log('\n🎯 Testing bet placement...');
      const betAmount = ethers.parseEther('0.001');
      
      try {
        const tx = await market.placeBet(0, { value: betAmount }); // 0 = Yes
        console.log('⏳ Bet transaction sent:', tx.hash);
        
        const receipt = await tx.wait();
        console.log('✅ Bet placed successfully!');
        console.log('- Transaction hash:', receipt.hash);
        console.log('- Gas used:', receipt.gasUsed.toString());
        
        // Get updated market info
        const updatedInfo = await market.getMarketInfo();
        console.log('\n📊 Updated market info:');
        console.log('- Total Pool:', ethers.formatEther(updatedInfo.totalPool), 'FLOW');
        console.log('- Yes Bets:', ethers.formatEther(updatedInfo.yesBets), 'FLOW');
        console.log('- Total Bettors:', updatedInfo.totalBettors.toString());
        
      } catch (betError) {
        console.error('❌ Failed to place bet:', betError.message);
      }
    } else {
      console.log('⚠️ Market is not open for betting (state:', info.state.toString() + ')');
    }
    
  } catch (error) {
    console.error('❌ Error testing market:', error.message);
  }
}

// Run the test
testMarket()
  .then(() => console.log('🎉 Market test completed'))
  .catch(console.error); 