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

    // --- INSERÇÃO ---
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
            while (i < no.keys.length && valor > no.keys[i]) i++;
            
            const resultadoSplit = this._inserirRecursivo(no.children[i], valor);
            
            if (resultadoSplit) {
                no.keys.push(resultadoSplit.promovido);
                no.keys.sort((a, b) => a - b);
                no.children.splice(i, 1, resultadoSplit.esq, resultadoSplit.dir);
            }
        }

        if (no.keys.length === 3) return this._split(no);
        return null;
    }

    _split(no) {
        const promovido = no.keys[1];
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

    // --- REMOÇÃO ---
    remover(valor) {
        if (!this.root) {
            alert("A árvore já está vazia!");
            return;
        }

        const achou = this._removerRecursivo(this.root, valor);
        
        if (!achou) {
            alert("Valor não encontrado na árvore!");
            return;
        }

        // Se a raiz ficou sem chaves após a remoção (underflow na raiz)
        if (this.root.keys.length === 0) {
            if (this.root.isLeaf()) {
                this.root = null; // A árvore ficou 100% vazia
            } else {
                this.root = this.root.children[0]; // O único filho vira a nova raiz
            }
        }
    }

    _removerRecursivo(no, valor) {
        let i = 0;
        while (i < no.keys.length && valor > no.keys[i]) i++;

        let encontrou = false;

        // Se encontrou o valor neste nó
        if (i < no.keys.length && no.keys[i] === valor) {
            encontrou = true;
            if (no.isLeaf()) {
                // Remoção simples na folha
                no.keys.splice(i, 1);
            } else {
                // Substitui pelo predecessor (maior valor da subárvore esquerda)
                let predNode = no.children[i];
                while (!predNode.isLeaf()) {
                    predNode = predNode.children[predNode.keys.length];
                }
                const predKey = predNode.keys[predNode.keys.length - 1];
                no.keys[i] = predKey;
                
                // Vai deletar a duplicata do predecessor lá embaixo na folha
                this._removerRecursivo(no.children[i], predKey);
                this._fixUnderflow(no, i); // Verifica se causou underflow
            }
        } else {
            // Se não encontrou e já chegou na folha, o número não existe
            if (no.isLeaf()) return false;
            
            // Continua descendo para procurar
            encontrou = this._removerRecursivo(no.children[i], valor);
            this._fixUnderflow(no, i); // Ao subir na recursão, arruma os filhos que ficaram vazios
        }

        return encontrou;
    }

    _fixUnderflow(pai, indexFilho) {
        const filho = pai.children[indexFilho];
        
        // Se o filho ainda tem uma chave, está tudo certo (sem underflow)
        if (filho.keys.length > 0) return; 

        const irmaoEsq = indexFilho > 0 ? pai.children[indexFilho - 1] : null;
        const irmaoDir = indexFilho < pai.children.length - 1 ? pai.children[indexFilho + 1] : null;

        // 1. Tenta emprestar do irmão da esquerda
        if (irmaoEsq && irmaoEsq.keys.length > 1) {
            filho.keys.unshift(pai.keys[indexFilho - 1]);
            pai.keys[indexFilho - 1] = irmaoEsq.keys.pop();
            if (!irmaoEsq.isLeaf()) {
                filho.children.unshift(irmaoEsq.children.pop());
            }
        }
        // 2. Tenta emprestar do irmão da direita
        else if (irmaoDir && irmaoDir.keys.length > 1) {
            filho.keys.push(pai.keys[indexFilho]);
            pai.keys[indexFilho] = irmaoDir.keys.shift();
            if (!irmaoDir.isLeaf()) {
                filho.children.push(irmaoDir.children.shift());
            }
        }
        // 3. Fusão com o irmão da esquerda
        else if (irmaoEsq) {
            irmaoEsq.keys.push(pai.keys[indexFilho - 1]);
            if (!filho.isLeaf()) irmaoEsq.children.push(...filho.children);
            
            pai.keys.splice(indexFilho - 1, 1);
            pai.children.splice(indexFilho, 1);
        }
        // 4. Fusão com o irmão da direita
        else if (irmaoDir) {
            filho.keys.push(pai.keys[indexFilho]);
            filho.keys.push(...irmaoDir.keys);
            if (!irmaoDir.isLeaf()) filho.children.push(...irmaoDir.children);
            
            pai.keys.splice(indexFilho, 1);
            pai.children.splice(indexFilho + 1, 1);
        }
    }
}

const minhaArvore = new Arvore23();

// --- INTERFACE WEB ---

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
        renderizarArvore();
        input.value = '';
        input.focus();
    }
}

function renderizarArvore() {
    const container = document.getElementById('arvore-container');
    container.innerHTML = '';
    
    if (minhaArvore.root) {
        container.appendChild(criarElementoNo(minhaArvore.root));
    }
}

function criarElementoNo(no) {
    const wrapper = document.createElement('div');
    wrapper.className = 'tree-node-container';

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

document.getElementById('valorInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') inserirValor();
});