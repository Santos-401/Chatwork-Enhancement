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
    const elt = document.getElementById("_timeLine");
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

  /**
   * 返信のあるメッセージをサブコンテンツエリアにスレッド化
   * @param  {Element} parent クリックしたメッセージのエレメント
   */
  createThreadIfHasReply(parent){
    if(parent == null){
      console.log("createThreadIfHasReply: parent is NULL");
      return;
    }

    // メッセージのBodyエレメントまで遡り
    while(true){
      if(parent.className ==  "timelineMessage__body"){
        break;
      }
      parent = parent.parentElement;
      if(parent == null){
        // メッセージ以外をクリックしたと判断
        return;
      }
    }

    // 返信元メッセージのID情報を持つエレメントを取得
    let targetMsg = parent.getElementsByClassName("chatTimeLineReply _replyMessage _showDescription");
    if(targetMsg == null){
      return;
    }

    // Thread生成しまずは返信先メッセージを記入
    this.createThreadOnSubcontent();
    this.addHtmlToThread(parent.innerHTML);

    // 返信元メッセージエレメントを取得しスレッドに追記
    // 返信元がなくなるまで繰り返し
    while(true){
      try{
        parent = document.getElementById("_messageId" + targetMsg[0].dataset.mid);
      }catch(e){
        return;
      }
      if(parent == null){
        return;
      }
      this.addHtmlToThread(parent.getElementsByClassName("timelineMessage__body")[0].innerHTML);
      targetMsg = parent.getElementsByClassName("chatTimeLineReply _replyMessage _showDescription");
    }
  }

  /**
   * サブコンテンツエリアにスレッドを生成
   * @return {[type]} [description]
   */
  createThreadOnSubcontent(){
    // 既にスレッド生成済みなら新規作成はせず、スレッド内を空にする
    let check = document.getElementById("_subThread__text");
    if(check != null){
      check.innerHTML = "";
      return;
    }
    console.log("createSideContent:" );

    // スレッドに必要なエレメントを生成
    let parentDiv = document.createElement("div");
    parentDiv.className = "subContent_thread";
    parentDiv.id = "_subThread";

    // ヘッダ部生成
    let childDiv_head = document.createElement("div");
    childDiv_head.className = "subThread__header";
    childDiv_head.id = "_subThread_header";
    childDiv_head.innerHTML = "スレッド";

    let childDiv_closeButton = document.createElement("div");
    childDiv_closeButton.className = "subThread__close";
    childDiv_closeButton.id = "_subThread__close";
    childDiv_closeButton.innerHTML = "×";
    childDiv_closeButton.addEventListener("click", this.closeSubthread);

    // 作成した各エレメントの子孫関係を設定
    childDiv_head.appendChild(childDiv_closeButton);
    parentDiv.appendChild(childDiv_head);

    // ボディ部生成
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

    // 作成した各エレメントの子孫関係を設定
    childDiv_overflow.appendChild(childDiv_thread);
    childDiv_container.appendChild(childDiv_overflow);
    childDiv_body.appendChild(childDiv_container);
    parentDiv.appendChild(childDiv_body);

    // チャットルーム概要欄の上部にスレッドを追加
    let elt = document.getElementById("_subRoomInfoArea");
    if(elt != null){
      elt.parentNode.insertBefore(parentDiv, elt)
    }
  }

  /**
   * メッセージをHTML形式でスレッドに追加
   * メッセージ間に[hr]を追加
   * @param {[HTML]} html スレッドに追加するhtml
   */
  addHtmlToThread(html){
    let elt = document.getElementById("_subThread__text");
    html += "<hr>" + elt.innerHTML;
    elt.innerHTML = html;
  }

  /**
   * スレッドを削除する
   */
  closeSubthread(){
    let thread = document.getElementById("_subThread");
    if(thread != null){
      thread.remove();
    }
  }
}
