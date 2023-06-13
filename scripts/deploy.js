const hre = require("hardhat"); // 引入hardhat套件

//console.log(hre);

async function main(){ // 因為要處理Promise，所以使用async function
    const currentTimestampInSeconds = Math.round(Date.now() / 1000); // 使程式為獲取當前時間的時間戳，並轉換為秒數形式(將毫秒/1000即為秒數)。
                                                                     // Math.round()函式是將小數進行四捨五入。Date.now()函式為取得當前時間的時間戳(也就是當前時間的毫秒數)
    const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60; // 表示一年的總秒數
    const unlockedTime = currentTimestampInSeconds + ONE_YEAR_IN_SECONDS; // 用來計算未來的某個時間點，主要目的是設定一個未來的時間。當前的時間秒數+一年的總秒數
    const lockedAmount = hre.ethers.utils.parseEther("1"); // 將1個以太幣的數量(10^18 wei 的固定數量)，從字串轉換為固定點表示的以太幣數量，並將結果賦值給lockedAmount變數。
                                                           // parseEther函式是將乙太幣數量表示為固定的精確度。

    /*console.log(currentTimestampInSeconds);
    console.log(ONE_YEAR_IN_SECONDS);
    console.log(unlockedTime);
    console.log(lockedAmount);*/

    const MyTest = await hre.ethers.getContractFactory("MyTest"); // 使用Ether.js中的getContractFactory函式來獲取名為MyTest參數的智能合約工廠，並賦值給MyTest變數。
                                                                  // await關鍵字，表示要等待getContractFactory函式返回結果才會繼續執行。主要是為了後續對該智能合約工廠進行部署或與合約進行交互。
    const myTest = await MyTest.deploy(unlockedTime, {value: lockedAmount}); // 藉由deploy函式來部屬一個新的MyTest智能合約實例。此行使用目的為，在部屬智能合約時，通常需要支付一些以太幣作為手續費或初始化合約的資金。
                                                                  // unlockedTime參數為：指定MyTest合約的解鎖時間。
                                                                  // {value: lockedAmount}參數為：指定在部屬MyTest合約時，所要傳送的以太幣金額。物件字面量內部的lockedAmount表示要傳送的以太幣金額。
    await myTest.deployed(); // 此行為非同步操作，用於確認MyTest智能合約的部屬是否完成，當部屬完成，返回的結果將儲存在myTest變數中。
                            // deployed()函式用於確認智能合約的部署狀態並返回部署後的合約實例。

    console.log(`Contract contain 1 ETH & address: ${myTest.address}`); // 獲得myTest智能合約的實際位址。
    // console.log(myTest); // 可看到我們在合約中所定義的所有資訊
}

main().catch((error)=>{
    console.log(error);
    process.exitCode = 1; // 一旦合約終止，我們將停止，所設定的退出碼為1。
});