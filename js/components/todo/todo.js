import { LitElement, html, css } from "lit-element";

export default class Todo extends LitElement {

  constructor() {
    super();
    this.title = "";
    this.description = "";
    this.date = "";
    this.priority = "";
    this.id = "";
  }

  static get properties() {
    return {
      title: { type: String },
      description: { type: String },
      date: { type: Date },
      priority: { type: String },
      id: { type: String }
    }
  }

  firstUpdated() {

  }

  static get styles() {
    return css`
    :host {
      display: block;
      position: relative;
    }
    .card {
      position: relative;
      margin-bottom: 12px;
      overflow: hidden;
      border-radius: 5px;
      box-shadow: var(--app-header-shadow);
      margin: 1rem;
      background-color: #747474;
    }
    .card header {
      position: relative;
      padding: 0;
      margin: 0;
    }
    .card main {
      padding: 1rem;
      background-color: white;
    }
    /**
      * Persist animation using : animation-fill-mode set to forward 
      * @see https://developer.mozilla.org/en-US/docs/Web/CSS/animation-fill-mode
      */
    .fade {
      -webkit-animation: fadeout 2s forwards; /* Safari and Chrome */
      -moz-animation: fadeout 2s forwards; /* Firefox */
      -ms-animation: fadeout 2s forwards; /* Internet Explorer */
      -o-animation: fadeout 2s forwards; /* Opera */
      animation: fadeout 2s forwards;
    }
    
    /* Key frame animation */
    @keyframes fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    
    /* Firefox */
    @-moz-keyframes fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    
    /* Safari and Chrome */
    @-webkit-keyframes fadeout {
      from { opacity: 1; }
      to   { opacity: 0; }
    }
    
    @media (min-width: 600px) {
    
    }
    
    /* Wide layout: when the viewport width is bigger than 460px, layout
    changes to a wide layout. */
    @media (min-width: 460px) {
      .card {
        flex-basis: 21%;
        margin: 2%;
      }
      .card figure {
        min-height: 20vh;
        height: 20vh;
        overflow: hidden;
      }
    }
    h3{
        font-family: "Arial Black", cursive;
        font-size: 30px;
        font-weight: normal;
        text-align: center;
        text-shadow: 0 1px 1px rgb(17, 0, 116); 
    }

    `;
  }

  removeTodo() {
    let id = this.shadowRoot.querySelector('#cardId');
    const event = new CustomEvent('remove-todo', {
      detail: id
    });
    document.dispatchEvent(event);
    id = '';
    this.remove();
  }

  firstUpdated(_changeProperty) {
    const btn = this.shadowRoot.querySelector('button');
    btn.addEventListener('click', () => {
      this.removeTodo();
    });
  }

  initTodo(title, description, date, priority, id) {
    this.title = title;
    this.description = description;
    this.date = date;
    this.priority = priority;
    this.id = id;
  }

  render() {
    return html`
      <article class="card">
        <input type="hidden" id="cardId" name="cardId" value="${this.id}">
        <header>
          <h3>${this.title}</h3>
        </header>
        <main>
          <p>${this.description}</p>
          <p>${this.priority}</p>
          <p>${this.date}</p>
          <button>Done</button>
        </main>
      </article>
    `;
  }
}

customElements.define('app-todo', Todo);