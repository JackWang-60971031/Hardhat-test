const {
    time, 
    loadFixture, // loadFixture函式，用在測試中所加載的預設數據或環境。可以幫助開發者建立一個可預測且一致的測試環境，每次執行測試時，loadFixture 函式都會加載相同的初始數據或環境。
} = require("@nomicfoundation/hardhat-network-helpers"); // 有兩個functions，分別為time和loadFixture。loadFixture用於加載或初始化測試夾具。

//console.log(time); // 可看到整個關於時間的屬性和函數
//console.log(loadFixture);

//console.log(time.days);

const {anyValue} = require("@nomicfoundation/hardhat-chai-matchers/withArgs"); // 藉由require函數來引入@nomicfoundation/hardhat-chai-matchers/withArgs模組，並從模組中指定anyValue屬性的值，並存於常數anyValue中。用於資金轉移時。
//console.log(anyValue);

// 將
const {expect} = require("chai"); // (require)引入chai斷言庫，並從chai斷言庫中指定expect屬性的值，並存於常數expect中。expect函式用於定義測試條件與預期結果，開發者可將實際結果與預期結果進行比較，以驗證程式碼是否符合預期。
                                  // chai斷言庫用於編寫和執行測試斷言。
const {ethers} = require("hardhat"); // (require)引入hardhat模組中的ethers，並賦值給常數ethers。

//console.log(expect);

describe("MyTest", function (){ // describe()區塊內部有兩個參數，分別為描述性的字串(MyTest測試套件)、callback function。
    async function runEveryTime(){ // 名為runEveryTime非同步函式
        const ONE_YEAR_IN_SECONDS = 365 * 24 * 60 * 60; // 一整年的秒數
        const ONE_GEWI = 1_000_000_000; // 也可使用1000000000

        const lockedAmount = ONE_GEWI; // 將ONE_GEWI常數的值賦值(指定)給lockedAmount常數。 lockedAmount常數為確保金額於程式執行期間不會被修改。
        const unlockedTime = (await time.latest()) + ONE_YEAR_IN_SECONDS; // 使用當前的時間戳+一年總秒數，以計算出一個未來資產解鎖的時間點，並將值賦值給unlockedTime常數。
                                                                          // time.latest()函式為取得當前區塊的時間戳
        //console.log(ONE_YEAR_IN_SECONDS, ONE_GEWI);
        //console.log(unlockedTime);

        // GET ACCOUNTS
        const [owner, otherAccount] = await ethers.getSigners(); // 獲取兩個簽署者陣列，並將陣列中的第一個元素賦值給owner常數，第二元素賦值給otherAccount常數。owner表示持有者帳戶，otherAccount為另一簽署者帳戶。
                                                                 // 使用await關鍵字作為等待getSingers()函式的結果
                                                                 // 使用ethers.getSingers()函式取得簽署者
        //const [owner, act1, act2, act3] = await ethers.getSigners(); // 可取得多個帳戶
        //console.log(owner);
        //console.log(otherAccount);
        //console.log(unlockedTime, lockedAmount, owner, otherAccount);

        console.log("hey");
        const MyTest = await ethers.getContractFactory("MyTest"); // 獲得名為MyTest的智能合約，並賦值到MyTest常數。可藉由此合約與區塊鏈進行交互。
                                                                  // getContractFactory("MyTest")函式是用來獲得名為MyTest的智能合約
        const myTest = await MyTest.deploy(unlockedTime, {value: lockedAmount}); // 將MyTest智能合約的新實例進行佈署至區塊鏈上，並返回一個可與該合約進行交互的myTest合約實例。
                                                                                 // deploy函式內部有兩個參數，分別為unlockedTime、{value: lockedAmount}(為一個Object)
                                                                                 // unlockedTime參數為表示一個未來資產解鎖的時間點。
                                                                                 // {value: lockedAmount}參數為在佈署合約時，就傳送以太幣的數量。
        //console.log(myTest);

        return {myTest, unlockedTime, lockedAmount, owner, otherAccount}; // 有五個資料會返回成Object型態
    }

    // describe、it函式是用於編寫測試套件和測試案例。每個 describe 塊都代表一個測試套件，而每個 it 塊則代表一個具體的測試案例。
    describe("Deployment", function(){ // describe()區塊內部會有兩個參數，分別為描述性的字串(Deployment測試套件)、callback function。
                                       // 而在此，callback function內部會包含一個或是多個it()函式。
        // CHECKING UNLOCKED TIME
        it("Should check unlocked time", async function(){ // it()函式用來測試案例。該測試案例為"Should check unlocked time"，並使用非同步函式。
            const {myTest, unlockedTime} = await loadFixture(runEveryTime); // 將loadFixture(runEveryTime)所返回的值(Object型態)，被提取給myTest、unlockedTime變數。
                                                                            // leadFixture()函式，可確保每次測試前，會重置區塊鏈為預設狀態，以確保每次測試都在相同的起點運行。
            //console.log(unlockedTime);
            //console.log(myTest);

            expect(await myTest.unlockedTime()).to.equal(unlockedTime); // expect函式來自Chai library。獲取myTest合約中，unlockedTime()函式的結果，並比較是否等於預期的unlockedTime值。
                                                                       // 使用myTest，因為擁有合約中的所有實例 與實際時間進行比較
                                                                       // .to來自Chai library，用於連接expect函式與其後方的斷言語句。
                                                                       // await myTest.unlockedTime()是一個非同步，其呼叫myTest合約的unlockedTime函式，並等待其回傳結果。
            //const ab = expect(await myTest.unlockedTime()).to.equal(unlockedTime);
            //console.log(ab);
        });

        // CHECKING OWNER 檢查是哪位擁有者部署合約
        it("Should set the right owner", async function(){ // 此案例為"Should set the right owner"，使用非同步函式。
            const{myTest, owner} = await loadFixture(runEveryTime); // 從loadFixture(runEveryTime)返回的物件中，提取屬性名為myTest、owner，並賦值給myTest、owner常數。
                                                                    // loadFixture(runEveryTime)為每次執行時，會呼叫runEveryTime函式

            expect(await myTest.owner()).to.equal(owner.address); // 使用Chai library的expect。檢查myTest合約中的擁有者是否等於預期的owner的地址。
                                                                 // myTest.owner()為提取合約擁有者的地址。
        });

        // CHECKING BALANCE 因為會將一些以太幣金額傳送至MyTest合約中
        it("Should receive and store the funds to MyTest", async function(){ // 此案例為"Should receive and store the funds to MyTest"，使用非同步函式。
            const{myTest, lockedAmount} = await loadFixture(runEveryTime); // 提取屬性名為myTest、lockedAmount，並賦值給myTest、lockedAmount常數。
            //console.log(lockedAmount);

            /*const contractBal = await ethers.provider.getBalance(myTest.address); // 帳戶的餘額來自合約 找出在myTest合約中的餘額
                                                                                  // getBalance(myTest.address)可取得myTest合約在區塊鏈上的位址
                                                                                  // ehters.provider是與以太坊網路進行交互的介面。
            console.log(contractBal.toNumber()); // 將contractBal轉換為數字*/

            expect(await ethers.provider.getBalance(myTest.address)).to.equal(lockedAmount); // 檢查myTest合約的地址的餘額是否等於lockedAmount
                                                                                             // ehters.provider的getBalance()方法，獲取myTest合約地址的餘額。
        });

        // CONDITION CHECK 所有條件都在MyTest合約中，在Withdraw()函式
        it("Should fail if the unlocked is not in the future", async function(){ // 如使用者所提供的時間不是未來的時間，即為錯誤。
            const latestTime = await time.latest(); // latestTime來自上方所定義的time常數，會取得目前(最新)的時間戳。time.latest()由Hardhat Network Helpers提供。
            //console.log(Math.round(latestTime / 60 / 60 / 60 / 24)); // 從毫秒轉換為天，並使用Math.round四捨五入進位為整數

            const MyTest = await ethers.getContractFactory("MyTest"); // 獲取名為MyTest的合約，並儲存於MyTest常數中。

            await expect(MyTest.deploy(latestTime, {value: 1})).to.be.revertedWith( // 檢查執行部屬的MyTest合約中，如提供的latestTime不是未來的時間，則回覆"Unlocked time should be in the future"訊息。
                                                                                    // latestTime、{value: 1}為MyTest合約的參數。 latestTime參數為目前最新的時間戳。
                                                                                    // {value: 1}參數為一個物件，以value屬性指定於部屬合約時，要傳送1個以太幣。
                "Unlocked time should be in the future"                             // 使用revertedWith()可驗證是否有錯誤，如有錯誤則傳送Unlocked time should be in the future訊息。
            ); // 如使用者所提供的時間不是未來的時間，則revertedWith()會丟出錯誤訊息。
        });
    });

    describe("Withdrawals", function(){ // describe()區塊內部會有兩個參數，分別為描述性的字串(Withdrawals測試套件)、callback function。
        describe("Validations", function(){ // describe()區塊內部會有兩個參數，分別為描述性的字串(Validations測試套件)、callback function。
            // TIME CHECK FOR WITHDRAW
            it("Should revert with the right if called to soon", async function(){ // 此案例為"Should revert with the right if called to soon"，使用非同步函式。
                const {myTest} = await loadFixture(runEveryTime); // 提取屬性名為myTest，並賦值給myTest常數。

                await expect(myTest.Withdraw()).to.be.revertedWith("Wait till the time period complete"); // 檢查在myTest合約中，所提款的時間點是否在預期的時間範圍，如不符合，則回覆"Wait till the time period complete"訊息(這些訊息要與MyTest合約內部訊息一致，否則會發生錯誤)。
                                                                                                          // myTest.Withdraw()方法，表示myTest合約中，提款的時間點。
            });

            // 如有人要從合約中提取資產，則我們要部屬以下訊息
            it("Should revert the message for right owner", async function(){
                const {myTest, unlockedTime, otherAccount} = await loadFixture(runEveryTime); // 加載runEveryTime函式，並將返回的值(Object)提取給myTest、unlockedTime、otherAccount常數。
                //const newTime = await time.increaseTo(unlockedTime); // 檢查我們所提供的時間是否在未來。將區塊鏈的時間提前到指定的時間點unlockedTime。
                //console.log(newTime); // 會得到undefined，因為此function只會檢查我們所提供的時間，並不會回傳任何值。如果所提供的時間與另一時間相同，則會拋出錯誤訊息。

                await time.increaseTo(unlockedTime); // increaseTo()函是將檢查我們所提供的時間是否符合上述條件。將區塊鏈的時間提前到指定的時間點unlockedTime。
                await expect(myTest.connect(otherAccount).Withdraw()).to.be.rejectedWith("You are not an owner"); // 測試當 otherAccount 嘗試以非擁有者身份執行 myTest 合約中的 Withdraw() 函式時，是否會被拒絕並且產生錯誤訊息 "You are not an owner"。
                                                                                                                  // myTest.connect(otherAccount).Withdraw()為使用connect()函式指定otherAccount帳戶地址作為執行者(也就是MyTest合約中的msg.sender)，呼叫Withdraw()函式執行
                                                                                                                  // rejectedWith("You are not an owner")為檢查操作是否被拒絕，並且產生預期的You are not an owner錯誤訊息。
            });

            it("Should not fail if the unlockedTime has arrived and the owner calls it", async function(){
                const {myTest, unlockedTime} = await loadFixture(runEveryTime); // 加載runEveryTime函式，並將返回的值(Object)提取給myTest、unlockedTime常數。

                await time.increaseTo(unlockedTime); // 將區塊鏈的時間提前到指定的時間點unlockedTime(unlockedTime為一個未來的時間戳，代表我們希望模擬的時間點)。
                await expect(myTest.Withdraw()).not.to.be.reverted; // 檢查myTest合約中，執行Withdraw()函式過程中不會被回滾(回滾：合約狀態回到執行交易前狀態)。
                                                                    // .not.to.be.reverted表示期望交易不會失敗且不會被回滾。
            });
        });
    });

    // NOW LETS CHECK FOR EVENTS
    describe("EVENTS", function(){ // describe()區塊內部有EVENTS測試套件、callback function。
        // SUBMIT EVENTS
        it("Should emit the event on withdrawals", async function(){ // 該測試案例為"Should emit the event on withdrawals"，並使用非同步函式。
            const{myTest, unlockedTime, lockedAmount} = await loadFixture(runEveryTime); // 加載runEveryTime函式，並將返回的值(Object)提取給myTest、unlockedTime、lockedAmount常數。
                                                                                         // loadFixture(runEveryTime)為加載runEveryTime函式
            await time.increaseTo(unlockedTime); // 此行為將區塊鏈的時間提前到指定的時間點unlockedTime(unlockedTime為一個未來的時間戳，代表我們希望模擬的時間點)。能助於模擬合約於不同時間點的行為，並測試合約在時間的推移下是否按照預期運作。
                                                 // time.increaseTo()為Hardhat框架所提供的工具函數，用於模擬區塊鏈時間的變化。

            await expect(myTest.Withdraw()).to.emit(myTest, "Widthrawal").withArgs(lockedAmount, anyValue); // 檢查myTest合約上執行的Withdraw()函式，是否觸發myTest合約中的Widthrawal事件
                                                                                                            // .to.emit(myTest, "Widthrawal")用來檢查myTest合約中，是否觸發了名為Widthrawal的事件。
                                                                                                            // withArgs(lockedAmount, anyValue)用來檢查Widthrawal事件的參數值lockedAmount、anyValue是否符合預期。
                                                                                                            // lockedAmount參數表示鎖定的金額量。
                                                                                                            // anyValue參數表示任意值，在測試中並不會關心此參數的值，僅會關心其是否存在於事件中。此斷言語句允許合約在觸發Widthrawal事件時使用任意的值作為第二個參數，只要事件的第一個參數是 lockedAmount 即可通過斷言。
        });
    });

    // CHECK FOR THE TRANSFER 最終要將資產從一個帳戶轉至另一個帳戶

    describe("Transfer", function(){
        it("Should transfer the funds to the owner", async function(){
            const{myTest, unlockedTime, lockedAmount, owner} = await loadFixture(runEveryTime); // 加載runEveryTime函式，並將返回的值(Object)提取給myTest、unlockedTime、lockedAmount、owner常數。

            await time.increaseTo(unlockedTime); // 將區塊鏈的時間提前到指定的時間點unlockedTime(unlockedTime為一個未來的時間戳，代表我們希望模擬的時間點)。
            await expect(myTest.Withdraw()).to.changeEtherBalances([owner, myTest], [lockedAmount, -lockedAmount]); // 檢查myTest合約上執行的Withdraw()函式，檢查owner、myTest帳戶的以太幣餘額是否有預期變化。
                                                                                                                    //.changeEtherBalances()用來檢查帳戶的以太幣餘額是否發生預期變化。
                                                                                                                    // [owner, myTest]表示帳戶列表，內有owner、myTest兩個帳戶地址，用於檢查帳戶列表。
                                                                                                                    // [lockedAmount, -lockedAmount]表示餘額變化列表，內有lockedAmount、-lockedAmount兩個數字，表示預期的以太幣餘額變化量。lockedAmount 是預期的以太幣餘額增加量（可能是提款操作所釋放的鎖定金額），而 -lockedAmount 是預期的以太幣餘額減少量（可能是提款操作所轉移的金額）。
        });
    });

    runEveryTime();
});