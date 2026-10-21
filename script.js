class Node23 {
    constructor() {
        this.keys = [];
        this.children = [];
    }

    isLeaf() {
        return this.children.length === 0;
    }
}

class Arvore23 {
    constructor() {
        this.root = null;
    }

    inserir(valor) {
        if (!this.root) {
            this.root = new Node23();
            this.root.keys.push(valor);
            return;
        }

        const resultadoSplit = this._inserirRecursivo(this.root, valor);
        
        
        if (resultadoSplit) {
            const novaRaiz = new Node23();
            novaRaiz.keys.push(resultadoSplit.promovido);
            novaRaiz.children.push(resultadoSplit.esq, resultadoSplit.dir);
            this.root = novaRaiz;
        }
    }

    _inserirRecursivo(no, valor) {
        
        if (no.isLeaf()) {
            no.keys.push(valor);
            no.keys.sort((a, b) => a - b);
        } else {
            
            let i = 0;
            while (i < no.keys.length && valor > no.keys[i]) {
                i++;
            }
            
            const resultadoSplit = this._inserirRecursivo(no.children[i], valor);
            
            // Se o filho dividiu, incorpora o valor promovido e os novos filhos
            if (resultadoSplit) {
                no.keys.push(resultadoSplit.promovido);
                no.keys.sort((a, b) => a - b);
                
                // Atualiza
                no.children.splice(i, 1, resultadoSplit.esq, resultadoSplit.dir);
            }
        }

        // Verificaçao de overflow no cod
        if (no.keys.length === 3) {
            return this._split(no);
        }

        return null;
    }

    _split(no) {
        const promovido = no.keys[1]; // O do meio sobe
        
        const esq = new Node23();
        esq.keys.push(no.keys[0]);
        
        const dir = new Node23();
        dir.keys.push(no.keys[2]);

        
        if (!no.isLeaf()) {
            esq.children.push(no.children[0], no.children[1]);
            dir.children.push(no.children[2], no.children[3]);
        }

        return { promovido, esq, dir };
    }

    remover(valor) {
        alert(`A remoção do ${valor} exige o algoritmo de fusão/empréstimo, que pode ser o próximo passo do projeto!`);
    }
}

const minhaArvore = new Arvore23();

// FUNÇÕES DE INTERFACE E RENDERIZAÇÃO

function inserirValor() {
    const input = document.getElementById('valorInput');
    const valor = parseInt(input.value);

    if (!isNaN(valor)) {
        minhaArvore.inserir(valor);
        renderizarArvore();
        input.value = '';
        input.focus();
    }
}

function removerValor() {
    const input = document.getElementById('valorInput');
    const valor = parseInt(input.value);

    if (!isNaN(valor)) {
        minhaArvore.remover(valor);
        input.value = '';
    }
}

function renderizarArvore() {
    const container = document.getElementById('arvore-container');
    container.innerHTML = ''; // Limpa a tela
    
    if (minhaArvore.root) {
        container.appendChild(criarElementoNo(minhaArvore.root));
    }
}

function criarElementoNo(no) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tree-node-container';

    //[info1][info2]
    const noVisual = document.createElement('div');
    noVisual.className = 'node';

    
    const key1 = document.createElement('div');
    key1.className = 'key';
    key1.innerText = no.keys[0];
    noVisual.appendChild(key1);

    
    const key2 = document.createElement('div');
    key2.className = no.keys.length > 1 ? 'key' : 'key empty';
    key2.innerText = no.keys.length > 1 ? no.keys[1] : '';
    noVisual.appendChild(key2);

    wrapper.appendChild(noVisual);

    // Renderiza os filhos recursivamente
    if (!no.isLeaf()) {
        const filhosContainer = document.createElement('div');
        filhosContainer.className = 'children-container';
        
        no.children.forEach(filho => {
            filhosContainer.appendChild(criarElementoNo(filho));
        });
        
        wrapper.appendChild(filhosContainer);
    }

    return wrapper;
}

// Permite inserir apertando "Enter"
document.getElementById('valorInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') inserirValor();
});