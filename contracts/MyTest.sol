// SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.9;

// IMPORTANT THE HARDHAT CONSOLE
import "hardhat/console.sol"; // 引用console模組，可於Solidity智能合約中使用類似於JS的console.log()函式

// 在MyTest合約中，創建了constructor構造函式、withdraw函式、Widthrawal事件
contract MyTest{
    // 宣告兩個狀態變數(狀態變數的值會永久存於合約中)，分別為unlockedTime、owner。
    uint256 public unlockedTime; // 宣告一個名為unlockedTime的公開無符號整數狀態變數，以被其它合約或外部帳號讀取或修改變數值。
    address payable public owner; // 宣告一個名為owner的公開支付地址狀態變數，用來接收以太幣轉帳以及被其它合約或外部帳號讀取或修改變數值，並且可以存儲以太坊網絡上的帳戶地址。 
                                  // payable關鍵字表示該地址可以接受以太幣或其它可支付的幣。

    event Widthrawal(uint256 amount, uint256 when); // 該事件名為Widthrawal，內部有amount、when參數(兩個參數皆為uint256類型的變數)。amount參數用來表示提款的金額。when參數用來表示某個事件發生的時間戳。
                                                    // 該事件用以在智能合約中觸發以及紀錄特定的操作、狀態修改。

    constructor(uint256 _unlockedTime) payable{ // 此構造函式(constructor)具有一個名為_unlockedTime參數，且該參數為uint256型別。並且是可支付的。 
                                               // _unlockedTime參數為代表未來時間的數值，它可能代表一個時間限制，只有在超過該時間之後，特定的操作或功能才會被啟用或允許。
        require(block.timestamp < _unlockedTime, "Unlocked time should be in the future"); // 此行為檢查當前區塊的時間戳是否小於_unlockedTime，如果條件不符合，則會將錯誤訊息"Unlocked time should be in the future"回傳給呼叫合約的地方。
                                                // require陳述句為，在合約執行時，檢查條件是否符合。 block.timestamp < _unlockedTime條件是確保某些操作只能在指定的未來時間後進行。
        unlockedTime = _unlockedTime; // 將_unlockedTime參數的值賦值給合約中的unlockedTime狀態變數。目的是將傳入至unlockedTime狀態變數的_unlockedTime設定為合約中的特定時間點，助於後續邏輯判斷或是功能操作。
        owner = payable(msg.sender); // 將當前交易發送者的地址(msg.sender)轉換為可接受以太幣支付的地址(payable)，並賦值給owner狀態變數(以將合約的擁有者地址保存下來，以便在合約內部使用)。
                                     // msg.sender為全域變數，表示當前交易發送者的地址。
    }

    function Withdraw() public{ // 使Withdraw() function是公開的，且用以提取資金。 呼叫function者，被稱為擁有者
        require(block.timestamp >= unlockedTime, "Wait till the time period complete"); // 此行表示檢查當前區塊的時間戳(當前區塊產生的時間)是否>=unlockedTime狀態變數。
                                                                                        // unlockedTime為在合約建立時設定的時間戳，要於該設定的時間之後，才允許執行特定操作。
        require(msg.sender == owner, "You are not an owner"); // 此行主要檢查是否為合約的擁有者，才可進行某些操作。用於防止未授權的帳戶濫用合約功能。
                                                              // mes.sender為當前執行合約的帳戶位址。msg.sender == owner表示，當前執行合約的帳戶位址是否等於合約建立時設定的擁有者地址。

        emit Widthrawal(address(this).balance, block.timestamp); // 使用emit關鍵字來觸發Widthrawal事件，並將address(this).balance、block.timestamp參數值傳遞給事件。助於其他合約或外部觀察者就可以監聽和處理這個事件。
                                                                 // address(this).balance為合約當前的餘額，也就是合約所持有的以太幣數量。this關鍵字表示當前正在執行的合約位址。address(this)來獲取合約位址。balance屬性來獲取合約的以太幣數量餘額。
                                                                 // block.timestamp為當前區塊的時間戳，也就是產生區塊的時間。

        owner.transfer(address(this).balance); // 此行為將合約的全部以太幣餘額轉移至owner位址，此時合約的餘額將會減少。
    }
}