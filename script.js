// Classe base do nó da Árvore 2-3
class Node23 {
    constructor() {
        this.keys = [];     // Guarda até 2 valores
        this.children = []; // Guarda as referências dos filhos
        this.isLeaf = true;
    }
}

// Classe da Árvore
class Arvore23 {
    constructor() {
        this.root = null;
    }

    inserir(valor) {
        console.log(`Lógica de inserção do valor ${valor} será feita amanhã!`);
        // Aqui vai entrar a lógica pesada de split amanhã
    }

    remover(valor) {
        console.log(`Lógica de remoção do valor ${valor} será feita amanhã!`);
    }
}

const minhaArvore = new Arvore23();

// Funções chamadas pelos botões do HTML
function inserirValor() {
    const input = document.getElementById('valorInput');
    const valor = parseInt(input.value);

    if (!isNaN(valor)) {
        minhaArvore.inserir(valor);
        input.value = ''; // Limpa o campo
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