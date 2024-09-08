export { RecintosZoo as RecintosZoo };

class Recinto {
    constructor(numero, bioma, tamanhoTotal, animaisExistentes = []) {
        this.numero = numero;
        this.bioma = bioma;
        this.tamanhoTotal = tamanhoTotal;
        this.animaisExistentes = animaisExistentes;
        this.espacoLivre = this.calcularEspacoLivre();
    }

    calcularEspacoLivre() {
        return this.tamanhoTotal - this.animaisExistentes.reduce((total, animal) => total + animal.tamanho, 0);
    }

    isAdequado(animal, quantidade) {
        const novoEspacoOcupado = animal.tamanho * quantidade;
        const espacoDisponivel = this.calcularEspacoLivre() - novoEspacoOcupado;

        // Verificar se há espaço suficiente
        if (espacoDisponivel < 0) {
            return false;
        }

        // Verificar compatibilidade de bioma
        if (!animal.biomas.includes(this.bioma)) {
            return false;
        }

        // Verificar compatibilidade de espécies (carnívoros e hipopótamos)
        if (animal.especie === 'leao' || animal.especie === 'leopardo') {
            if (this.animaisExistentes.length > 0 && this.animaisExistentes.some(a => a.especie !== animal.especie)) {
                return false; // Carnívoros não podem estar no recinto com outros animais
            }
        }

        if (animal.especie === 'hipopotamo') {
            if (this.bioma !== 'savana e rio') {
                return false; // Hipopótamos precisam do bioma "savana e rio"
            }
        }

        if (animal.especie === 'macaco') {
            if (this.animaisExistentes.length === 0) {
                return false; // Macacos precisam estar com pelo menos outro animal
            }
        }

        // Considerar espaço extra se houver mais de uma espécie no recinto
        if (this.animaisExistentes.length > 0 && animal.especie !== this.animaisExistentes[0].especie) {
            return espacoDisponivel - 1 >= 0;
        }

        return true;
    }
}

class Animal {
    constructor(especie, tamanho, biomas) {
        this.especie = especie;
        this.tamanho = tamanho;
        this.biomas = biomas;
    }
}

class RecintosZoo {
    constructor(recintos, animais) {
        this.recintos = recintos;
        this.animais = animais;
    }

    analisaRecintos(animalEspecie, quantidade) {
        // Verificar se a quantidade é válida
        if (quantidade <= 0) {
            return { erro: 'Quantidade inválida' };
        }

        // Verificar se o animal é válido
        const animalKey = animalEspecie.toLowerCase();
        if (!this.animais[animalKey]) {
            return { erro: 'Animal inválido' };
        }

        const [tamanho, biomas] = this.animais[animalKey];
        const novoAnimal = new Animal(animalEspecie.toLowerCase(), tamanho, biomas);
        const recintosViaveis = this.recintos.filter(recinto => recinto.isAdequado(novoAnimal, quantidade));

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        return {
            recintosViaveis: recintosViaveis.sort((a, b) => a.numero - b.numero).map(recinto => 
                `Recinto ${recinto.numero} (espaço livre: ${recinto.calcularEspacoLivre()} total: ${recinto.tamanhoTotal})`
            )
        };
    }
}

// Dados dos recintos existentes
const recintos = [
    new Recinto(1, 'savana', 10, [new Animal('macaco', 1, ['savana', 'floresta'])]),
    new Recinto(2, 'floresta', 5, []),
    new Recinto(3, 'savana e rio', 7, [new Animal('gazela', 2, ['savana'])]),
    new Recinto(4, 'rio', 8, []),
    new Recinto(5, 'savana', 9, [new Animal('leao', 3, ['savana'])])
];

// Dados dos animais
const ANIMAIS = {
    'leao': [3, ['savana']],
    'leopardo': [2, ['savana']],
    'crocodilo': [3, ['rio']],
    'macaco': [1, ['savana', 'floresta']],
    'gazela': [2, ['savana']],
    'hipopotamo': [4, ['savana', 'rio']]
};

// Exemplo de uso
const zoo = new RecintosZoo(recintos, ANIMAIS);

// Teste com diferentes animais e quantidades
const resultadoMacacos = zoo.analisaRecintos('macaco', 2);
console.log('Resultado para macacos:', resultadoMacacos);

const resultadoHipopotamos = zoo.analisaRecintos('hipopotamo', 1);
console.log('Resultado para hipopótamos:', resultadoHipopotamos);

const resultadoLeopardos = zoo.analisaRecintos('leopardo', 2);
console.log('Resultado para leopardos:', resultadoLeopardos);

const resultadoCrocodilos = zoo.analisaRecintos('crocodilo', 1);
console.log('Resultado para crocodilos:', resultadoCrocodilos);

const resultadoInvalido = zoo.analisaRecintos('unicórnio', 1);
console.log('Resultado para animal inválido:', resultadoInvalido);
