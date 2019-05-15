import { LitElement, html, css } from "lit-element";

export default class Form extends LitElement {

    constructor() {
        super();
    }

    static get styles() {
        return css`
    .wrapper {
        max-width: 64rem;
        margin: auto;
        padding: 1rem;
        display: block;
      }
      
      @media only screen and (min-width: 48rem) {
        form {
          display: flex;
        }
      }
      
      input[type="text"] {
        border: none;
        line-height: 3rem;
        padding: 0 1rem;
        width: 100%;
        box-sizing: border-box;
      }
      
      button {
        background: #CC0051;
        line-height: 3rem;
        color: #FFF;
        border: none;
        padding: 0 3rem;
        margin-top: 1rem;
        width: 100%;
      }
    `;
    }

    addTodo() {
        let newTodo = this.shadowRoot.querySelectorAll('.form__field');
        const event = new CustomEvent('new-todo', {
            detail: [
                newTodo[0].value,
                newTodo[1].value,
                newTodo[2].value,
                uuidv4()
            ]
        });
        document.dispatchEvent(event);
        newTodo.value = '';
    }

    firstUpdated(_changeProperty) {
        const btn = this.shadowRoot.querySelector('.btn');
        btn.addEventListener('click', () => {
            this.addTodo();
        });
    }

    render() {
        return html`
        <div class="wrapper">
            <input type="text" class="form__field" placeholder="Titre" id="title" />
            <input type="text" class="form__field" placeholder="Description" id="description" />
            <input type="text" class="form__field" placeholder="Priorité" id="priority" />
            <button class="btn">Ajouter</button>
        </div>
      `;
    }
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

customElements.define('app-form', Form);