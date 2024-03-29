'use strict';

class JSDialogHandler {
  constructor() {

    /*Creation of the basic html for dialogs_box:
     | dialog_root
     | | dialog_panel
     | | | dialog_content
     | | | dialog_buttons
     */
    this.dialogs_holder = (function(){
      let dialog_root = document.createElement('div');
      dialog_root.setAttribute('id', 'jsdialog_box');

      let dialog_panel = document.createElement('div');
      dialog_panel.setAttribute('id', 'jsdialog_panel');
      let dialog_content_box = document.createElement('div');
      dialog_content_box.setAttribute('id', 'jsdialog_content_box');
      let dialog_button_box = document.createElement('div');
      dialog_button_box.setAttribute('id', 'jsdialog_buttons_box');

      dialog_panel.appendChild(dialog_content_box);
      dialog_panel.appendChild(dialog_button_box);

      dialog_root.appendChild(dialog_panel);

      document.getElementsByTagName('BODY')[0].appendChild(dialog_root);

      return dialog_root;
    })();

    //inserting style tag in head with basic css for dialogs
    let dialog_css = document.createElement('style');
    dialog_css.type = 'text/css';
    dialog_css.innerHTML = `#jsdialog_box{
        opacity:0;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      #jsdialog_box.active{
        opacity: 1;
        pointer-events: auto;
      }

      #jsdialog_panel{
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    }`;

    document.getElementsByTagName('head')[0].appendChild(dialog_css);

    //shortcuts vars
    this.content_holder = this.dialogs_holder.children[0].children[0];
    this.buttons_holder = this.dialogs_holder.children[0].children[1];

    //configurable values
    this.accept_button_label = 'Accept';
    this.cancel_button_label = 'Cancel';
    this.delay_time_to_clean = 0;
  }


/*############################################################################*/

  set_accept_button_label(label_text){
    this.accept_button_label = label_text;
  }

/*############################################################################*/

  set_cancel_button_label(label_text){
    this.cancel_button_label = label_text;
  }

/*############################################################################*/

  set_delay_time_to_clean(delay_time){
    this.delay_time_to_clean = delay_time;
  }

/*############################################################################*/

  hide(){
    /*hide and clean dialogs content and buttons. Cleaning has a delay
     option for better style in hide transition.
    */
    this.dialogs_holder.classList.remove('active');
    setTimeout((function(){
      this.content_holder.innerHTML = '';
      this.buttons_holder.innerHTML = '';
    }).bind(this), this.delay_time_to_clean);
  }

/*############################################################################*/

  show(){
    this.dialogs_holder.classList.add('active');
  }

/*############################################################################*/

  set_dialog_content(html_content){

    if (typeof(html_content) === 'string') {
      this.content_holder.innerHTML = html_content;
    } else {
      /*if the content is a Node, save the old content_holder, clone the new
       content in the dialog attribute and add the id, and replace in the DOM
       the new content with the old one.*/
      let old_content_holder = this.content_holder;
      this.content_holder = html_content.cloneNode(true);
      this.content_holder.setAttribute('id', 'jsdialog_content');
      old_content_holder.replaceWith(this.content_holder);
    }
  }

/*############################################################################*/

  add_accept_button(callback = false){
    let accept_button = document.createElement('button');
    accept_button.setAttribute('id', 'jsdialog_accept_button');
    accept_button.innerText = this.accept_button_label;
    accept_button.onclick = (function(){
      this.hide();
      if (callback) {
        callback();
      }
    }).bind(this);
    this.buttons_holder.appendChild(accept_button);
  }

/*############################################################################*/

  add_cancel_button(){
    let cancel_button = document.createElement('button');
    cancel_button.setAttribute('id', 'jsdialog_cancel_button');
    cancel_button.innerText = this.cancel_button_label;
    cancel_button.onclick = (function(){
      this.hide();
    }).bind(this);

    this.buttons_holder.appendChild(cancel_button);
  }

/*############################################################################*/

  run({dialog_content, is_confirmation_dialog}, callback){

    this.set_dialog_content(dialog_content);

    if (is_confirmation_dialog) {
      this.add_accept_button(callback);
      this.add_cancel_button();
    } else {
      this.add_accept_button(callback);
    }

    this.show();
  }
}

let jsdialog = new JSDialogHandler();
