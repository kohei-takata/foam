/**
 * @license
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

CLASS({
  name: 'PopupView',
  package: 'foam.ui.md',
  extendsModel: 'foam.ui.SimpleView',

  exports: [ 'as popup' ],

  properties: [
    {
      model_: 'ViewFactoryProperty',
      name: 'delegate',
      documentation: function() {/* The inner view to pop up.
        This should be created in the context of this popup,
        so that X.viewContainerController is available to the inner
        view to control the popup.</p>
        <p>The ViewContainerController interface includes methods to control
        your containing view, including .accept() and .reject()
        for standard dialogs. */}
    },
    {
      name: 'delegateView',
      defaultValue: null
    },
    {
      name: '$content',
      getter: function() {
        return this.X.document.getElementById(this.id+'Content');
      }
    },
    {
      name: '$blocker',
      getter: function() {
        return this.X.document.getElementById(this.id+'Blocker');
      }
    },
    {
      name: 'className',
      defaultValue: "popup-view-container"
    },
    {
      name: 'state',
      defaultValue: 'closed'
    },
  ],

  methods: {
    open: function(sourceElement) {
      if ( this.state == 'closed' ) {
        this.delegateView = this.delegate();
        if ( this.data ) this.delegateView.data = this.data;

        if ( this.$ ) this.$.outerHTML = '';  // clean up old copy, in case of rapid re-activation
        this.X.document.body.insertAdjacentHTML('beforeend', this.toHTML());
        this.initializePosition();
        this.X.setTimeout(function() {  this.animateToExpanded(); }.bind(this), 100);
        this.initHTML();
        this.state = 'open';
      }
    },
    initializePosition: function() {
      this.$content.style.zIndex = "1010";
      //this.$content.style.transform = "translateY("+this.viewportSize().height+"px)";
      this.$content.style.opacity = "0";
      this.$blocker.style.opacity = "0";
    },
    animateToExpanded: function() {
      //this.$content.style.transition = "transform cubic-bezier(0.0, 0.0, 0.2, 1) .1s";
      //this.$content.style.transform = "translateY(0)";
      this.$content.style.transition = "opacity cubic-bezier(0.0, 0.0, 0.2, 1) .1s";
      this.$content.style.opacity = "1";

      this.$blocker.style.transition = "opacity cubic-bezier(0.0, 0.0, 0.2, 1) .1s";
      this.$blocker.style.opacity = "0.4";

      this.isHidden = false;
    },
    animateToHidden: function() {
      this.isHidden = true;
      if ( this.$content ) {
        this.$content.style.transition = "opacity cubic-bezier(0.4, 0.0, 1, 1) .1s"
        this.$content.style.opacity = "0";
        this.$content.style.pointerEvents = "none";
      }
      if ( this.$blocker ) {
        this.$blocker.style.transition = "opacity cubic-bezier(0.4, 0.0, 1, 1) .1s"
        this.$blocker.style.opacity = "0";
        this.$blocker.style.pointerEvents = "none";
      }
    },
    close: function() {
      this.animateToHidden();
      this.X.setTimeout(function() { this.destroy(); }.bind(this), 300);
    },
    destroy: function(p) {
      if ( this.$ ) this.$.outerHTML = '';
      this.delegateView = null;
      this.state = 'closed';
      this.SUPER(p);
    },

  },

  templates: [
    function toInnerHTML() {/*
      <div id="<%= this.id %>Blocker" class='popup-view-modal-blocker'></div>
      <div id="<%= this.id %>Content"class='popup-view-content md-card'>
        %%delegateView
      </div>
    */},
    function CSS() {/*
      .popup-view-modal-blocker {
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        background: black;
        opacity: 0;
      }
      .popup-view-container {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0px;
        left: 0px;
        bottom: 0px;
        right: 0px;
        z-index: 1000;
      }
    */}
  ]
});
