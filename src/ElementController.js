/**
 * chatworkのエレメントを操作
 */
class ElementController {
  constructor(){
    /**
     * chatRoomの移動を監視するMutationObserver
     * @type {Object}
     */
    this.chatroomChangeObserver;
    /**
     * chatRoomの移動を監視するMutationObserver設定値
     * @type {Object} childList, subtreeの変化を監視
     */
    this.CHATROOM_OBSERVE_OPTIONS = {
      childList: true,
      subtree: true
    };
  }

  /**
   * Chatworkのページ表示が完了したか否かを返却
   * @return {Boolean} ページ表示完了していればtrue、それ以外はfalse
   */
  isChatworkLoaded(){
    let ret = false ;

    // timeline（メッセージ表示エリア）のエレメントが取得可能か否かで判断
    const elt = document.getElementById("_timeLine")
    if(elt != null){
      ret = true;
    }
    console.log("ElementController:isChatworkLoaded " + ret);
    return ret;
  }

/**
 * ChatRoomの移動を監視するObserverを追加
 * @param {function} func ChatRoom移動検知時に呼ばれるコールバック関数
 */
  addRoomChangeObserver(func){
    let ret = false;

    // chatroomを移動すれば必ずtimeline（メッセージ表示エリア）は変化する為
    // timelineの子リスト/サブツリー変化を監視
    const elt = document.getElementById("_timeLine");
    if(elt){
      this.chatroomChangeObserver = new MutationObserver(func);
      this.chatroomChangeObserver.observe(elt, this.CHATROOM_OBSERVE_OPTIONS);
      ret = true;
    }
    console.log("ElementController:addRoomChangeObserver " + ret);
    return ret;
  }

/**
 * Chatworkのツールバーにボタンを追加
 * @param {Array} chidlElts 追加するボタンリスト
 */
  addButtonOnToolBar(chidlElts){
    let eltToolbar = document.getElementById("_chatSendTool");
    for (const child of chidlElts) {
      eltToolbar.appendChild(child);
    }
  }

/**
 * ツールバーに表示するボタンを作成
 * ボタンはLIエレメントの子ノードにSpanエレメントが格納された構造
 * @param  {Object} dic 作成するボタン情報を格納したDictionary
 * @return {Element}     作成したリストアイテムエレメント
 */
  createButtonElement(dic){
    console.log("createButtonElement:" + dic.id);

    // 親はList Item、roleにButtonを指定
    let parentElt = document.createElement("li");
    parentElt.className = "_showDescription " + dic.listStyle;
    parentElt.setAttribute("role", "button");
    parentElt.setAttribute("aria-label", dic.label);
    parentElt.id = dic.id;

    // 子はspanエレメントで作成、ボタンに表示する文字はinnerHTMLで指定
    let childElt = document.createElement("span");
    childElt.className = dic.spanStyle;
    childElt.innerHTML = dic.sign;
    parentElt.appendChild(childElt);

    parentElt.addEventListener("click", dic.func);
    return parentElt;
  }

/**
 * 指定した文字をTextエリアに挿入
 * @param  {String} text 挿入する文字列
 */
  insertAtChatText(text){
    console.log("insertAtChatText:" + text);

    const textArea = document.getElementById('_chatText');

    // カーソルが当たっている箇所に文字列を挿入する
    const cursor = textArea.selectionStart;
    textArea.setSelectionRange(cursor, cursor);
    textArea.focus();
    document.execCommand('insertText', false, text);
  }

  createSideContent(){
    console.log("createSideContent:" );

    let parentDiv = document.createElement("div");
    parentDiv.className = "subContent_thread";
    parentDiv.id = "_subThread";

    let childDiv_head = document.createElement("div");
    childDiv_head.className = "subThread__header";
    childDiv_head.id = "_subThread_header";
    childDiv_head.innerHTML = "スレッド";

    let childDiv_body = document.createElement("div");
    childDiv_body.className = "subThread__body";
    childDiv_body.id = "_subThread_body";

    let childDiv_container = document.createElement("div");
    childDiv_container.className = "subThread__container";
    childDiv_container.id = "_subThread_container";
    childDiv_container.style.display = "block";

    let childDiv_overflow = document.createElement("div");
    childDiv_overflow.className = "subThread__body--overflow";
    childDiv_overflow.id = "_subThread__body--overflow";
    // childDiv_overflow.style.height = "50px";

    let childDiv_thread = document.createElement("div");
    childDiv_thread.className = "subThread__text";
    childDiv_thread.id = "_subThread__text";

    parentDiv.appendChild(childDiv_head);

    childDiv_overflow.appendChild(childDiv_thread);
    childDiv_container.appendChild(childDiv_overflow);
    childDiv_body.appendChild(childDiv_container);

    parentDiv.appendChild(childDiv_body);

    let elt = document.getElementById("_subContentAreaContent");
    elt.appendChild(parentDiv);
  }

  addTextToThread(html){
    let elt = document.getElementById("_subThread__text");
    let threadHTML = elt.innerHTML;
    html += threadHTML;
    elt.innerHTML = html;
  }
}
