/**
 * ChatworkEnhancement機能のメイン関数
 */
(function(){
 /**
  * chatworkエレメント操作クラスのインスタンス
  * @type {ElementController}
  */
  const eltController = new ElementController();
 /**
  * ボタンを格納するListItemエレメントのクラス名
  * @type {String}
  */
  const STYLE_CHATINPUT_RES = "chatInput__response";
 /**
  * ボタンを格納するSpanエレメントのクラス名
  * @type {String}
  */
  const STYLE_CHATINPUT_RESICON = "chatInput__response_icon";
 /**
  * ボタン情報を格納するDictionary
  * Reply Requied（要返信）ボタン
  * @type {Object}
  */
  const DIC_BUTTON_RR = {
        id:        "_rr",
        label:     "返信要のエモーティコンを挿入",
        sign:      "要返信",
        emot:      "(F)",
        listStyle: STYLE_CHATINPUT_RES,
        spanStyle: STYLE_CHATINPUT_RESICON,
        func:      onClickChatButton
  };
  /**
   * ボタン情報を格納するDictionary
   * To Be Confirmed（要確認）ボタン
   * @type {Object}
   */
  const DIC_BUTTON_TBC = {
        id:        "_tbc",
        label:     "確認要のエモーティコンを挿入",
        sign:      "要確認",
        emot:      "(roger)",
        listStyle: STYLE_CHATINPUT_RES,
        spanStyle: STYLE_CHATINPUT_RESICON,
        func:      onClickChatButton
  };
  /**
   * ボタン情報を格納するDictionary
   * Quick Reply Requied（要即返信）ボタン
   * @type {Object}
   */
  const DIC_BUTTON_QRR = {
        id:        "_qrr",
        label:     "急ぎで返信要のエモーティコンを挿入",
        sign:      "即返信",
        emot:      "(lightbulb)",
        listStyle: STYLE_CHATINPUT_RES,
        spanStyle: STYLE_CHATINPUT_RESICON,
        func:      onClickChatButton
  };
  /**
   * キーイベント：Enter
   * @type {Number}
   */
  const KEY_ENTER = 13;

  /**
   * キー押下イベントコールバック
   * @param  {[type]} e
   */
  function onKeyDown(e){
    //TODO: そのうち実装予定。今はイベント受けるだけ
    switch (e.keyCode){
      case KEY_ENTER:
        console.log("Enter key Down");
        break;
      default:
        break;
    }
  }

  /**
   * チャットルーム移動検知イベントコールバック
   */
  function onChatroomChanged(){
    // 追加したボタンのListItemクラス名を持つエレメントが一つもなければ
    // Chatroom移動したと判断しボタンを再生成
    if (document.getElementsByClassName(STYLE_CHATINPUT_RESICON).length == 0){
      console.log("onChatroomChanged: Clear the notifier");
      createReplayNotifier();
    }
  }

  /**
   * 追加したボタン押下イベントコールバック
   * @param  {[type]} e イベント
   */
  function onClickChatButton(e){
    console.log("onClickChatToolbar:" + e.currentTarget.id);
    let emoticon = "";

    // 押下したボタンによって挿入するエモーティコンを振り分け
    switch(e.currentTarget.id){
      case DIC_BUTTON_RR.id:
        emoticon = DIC_BUTTON_RR.emot;
        break;
      case DIC_BUTTON_TBC.id:
        emoticon = DIC_BUTTON_TBC.emot;
        break;
      case DIC_BUTTON_QRR.id:
        emoticon = DIC_BUTTON_QRR.emot;
        break;
      default:
        break;
    }
    eltController.insertAtChatText(emoticon);
  }

/**
 * Chatworkのボタンを生成しツールバーに追加
 * @return {[type]} [description]
 */
  function createReplayNotifier(){
    let buttonArray = [
      eltController.createButtonElement(DIC_BUTTON_RR),  //要返信ボタン
      eltController.createButtonElement(DIC_BUTTON_TBC), //要確認ボタン
      eltController.createButtonElement(DIC_BUTTON_QRR)  //即返信ボタン
    ];

    eltController.addButtonOnToolBar(buttonArray);
  }

/**
 * chatworkのエレメント操作が可能となったタイミングでイベントを追加
 */
  function addEventIfChatworkReady(){
    // Loadが完了してもchatworkのエレメントが取得できない時があるのでチェック
    // エレメント操作の準備ができるまで繰り返し。
    if(!eltController.isChatworkLoaded()){
      console.log(" is not ready");
      setTimeout(addEventIfChatworkReady, 200);
      return;
    }

    // 準備ができたらボタン作成開始
    createReplayNotifier();

    //Chatroomを移動すると追加したボタンが消されるのでRoom移動を監視しとく
    eltController.addRoomChangeObserver(onChatroomChanged);
    window.addEventListener("keydown", onKeyDown);
  }

  /**
   * ページ読み込み完了時に発火
   * ここから処理開始
   */
  window.addEventListener('load', function () {
    console.log("load completed");
    addEventIfChatworkReady();
  });
})()
