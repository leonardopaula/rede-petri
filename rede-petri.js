class Lugar {
	constructor(nome, marcas) {
		this.nome = nome;
		this.marcas = marcas;
	}
}

class Transicao {
	constructor(nome) {
		this.nome = nome;
		this.habilitado = false;
	}
}

class RedePetri {
	constructor() {
		this.vertice = [];
		this.nVertices = 0;
		this.arco = [];
		this.ciclo = 0;
		this.habilitados = [];
		this.passo = 0;
	}

	adicionaVertice(vertice) {
		this.vertice[this.nVertices++] = vertice;
	}

	adicionaArco(v1, v2, peso = 1) {		
		this.validarVertices(v1, v2);

		if (!this.arco[v1])
			this.arco[v1] = [];

		this.arco[v1][v2] = peso;

	}

	validarVertices(v1, v2) {
		if (this.vertice[v1] instanceof Lugar && this.vertice[v2] instanceof Lugar) {
			throw "Não é possível adicionar arcos entre Lugares (" + this.vertice[v1].nome + ", " + this.vertice[v2].nome + ").";
		}

		if (this.vertice[v1] instanceof Transicao && this.vertice[v2] instanceof Transicao) {
			throw "Não é possível adicionar arcos entre Transições (" + this.vertice[v1].nome + ", " + this.vertice[v2].nome + ").";
		}
	}

	localizaVertice(nome) {
		for (var i = 0; i < this.vertice.length; i++) {
			if (this.vertice[i].nome == nome) {
				return i;
			}
		}

		return -1;
	}

	/* Percorre todos o nós, executando 1 passo*/
	executa() {
		// Percorre as transações habilitadas, atualizando os pesos
		//for (var i = 0; i < this.habilitados.length; i++) {
			let i = Math.floor((Math.random() * (this.habilitados.length - 1)) + 0);
			// Percorre os arcos deste vértice
			for (var j = 0; j < this.arco.length; j++) {
				// Para

				if (j == this.habilitados[i]) {
					for (var k = 0; k < this.arco[j].length; k++) {
						if (this.arco[j][k] != undefined) {
							this.vertice[k].marcas += this.arco[j][k];
						}
					}
				}

				// De
				if (this.arco[j]) {
					if (this.arco[j][this.habilitados[i]] != undefined) {
						this.vertice[j].marcas -= this.arco[j][this.habilitados[i]];
					}
				}
			}
		

		this.atualizaHabilitado();
		this.ciclo++;
		this.desenhaTabela(this.ciclo);

	}

	atualizaHabilitado() {
		this.habilitados = [];

		// Percorre capturando as transacoes
		for (var i = 0; i < this.nVertices; i++) {
			if (this.vertice[i] instanceof Transicao) {
				this.vertice[i].habilitado = this.verificaTransacao(i);
				if (this.vertice[i].habilitado)
					this.habilitados.push(i);
			}
		}

	}

	verificaTransacao(indice) {
		let transacao = this.vertice[indice];
		let local = {};
		let habilitado = false;

		// Percorre os arcos verificando os pesos
		for (var i = 0; i < this.arco.length; i++) {
			if (this.arco[i]) {
				if (this.arco[i][indice] != undefined) {
					local = this.vertice[i];
					if (local.marcas >= this.arco[i][indice])
						habilitado = true;
					else
						return false;
				}
			}
		}
		return habilitado;
	}

	desenhaTerminal(ciclo) {
		let transicoes = [];
		transicoes['cabecalho'] = '';
		transicoes['dados'] = '';
		let lugares = [];
		lugares['cabecalho'] = '';
		lugares['dados'] = '';
		let cabecalho = '|Ciclo|  ';
		let dados = '|  ';

		dados += this.ciclo + '  |  ';

		for (var i = 0; i < this.vertice.length; i++) {
			if (this.vertice[i] instanceof Lugar) {
				//if (ciclo == 0)
				lugares['cabecalho'] += this.vertice[i].nome + ' |  ';

				lugares['dados'] += this.vertice[i].marcas + '  |  ';
			} else {

				//if (ciclo == 0)
				transicoes['cabecalho'] += this.vertice[i].nome + ' |  ';

				transicoes['dados'] += ((this.vertice[i].habilitado) ? 'S' : 'N') + '  |  ';
			}
		}

		cabecalho += lugares['cabecalho'] + transicoes['cabecalho'];
		dados += lugares['dados'] + transicoes['dados'];
		console.log(cabecalho);
		console.log(dados);
		document.getElementById("redeOutput").innerHTML = cabecalho + "\n" + dados;
	}

	desenhaTabela(ciclo) {
		let transicoes = [];
		transicoes['cabecalho'] = '';
		transicoes['dados'] = '';
		let lugares = [];
		lugares['cabecalho'] = '';
		lugares['dados'] = '';
		let cabecalho = '<th scope="col">Ciclo</th>';
		let dados = '<td>';

		dados += this.ciclo + '</td>';

		for (var i = 0; i < this.vertice.length; i++) {
			if (this.vertice[i] instanceof Lugar) {
				if (ciclo == 0)
					lugares['cabecalho'] += '<th scope="col">' + this.vertice[i].nome + '</th>';

				lugares['dados'] += '<td>' + this.vertice[i].marcas + '</td>';
			} else {

				if (ciclo == 0)
					lugares['cabecalho'] += '<th scope="col">' + this.vertice[i].nome + '</th>';

				transicoes['dados'] += '<td>' + ((this.vertice[i].habilitado) ? 'S' : 'N') + '</td>';
			}
		}

		cabecalho += lugares['cabecalho'] + transicoes['cabecalho'];
		dados += lugares['dados'] + transicoes['dados'];
		if (ciclo == 0)
			$('.table thead').html('<tr>' + cabecalho + '</tr>');
		$('.table tbody').html($('.table tbody').html() + '<tr>' + dados + '</tr>');
	}
}

var rede = new RedePetri();

function lerEntradaRede() {
	try {
		texto = document.getElementById("redeInput").value
		let json = JSON.parse(texto);

		let lugares = json.L;
		for (var i = 0; i < lugares.length; i++) {
			rede.adicionaVertice(new Lugar(lugares[i][0], lugares[i][1]));
		}
		let transicoes = json.T;
		for (var i = 0; i < transicoes.length; i++) {
			rede.adicionaVertice(new Transicao(transicoes[i][0]));
		}
		let arcos = json.A;
		for (var i = 0; i < arcos.length; i++) {
			rede.adicionaArco(rede.localizaVertice(arcos[i][0]), rede.localizaVertice(arcos[i][1]), arcos[i][2]);
		}

		rede.atualizaHabilitado();

		//rede.desenhaTerminal(0);
		rede.desenhaTabela(0);
	}
	catch (e)
	{
		console.log("Erro " + e);
		document.getElementById("erros").textContent = e;
		//document.getElementById("erros").innerHTML = e.message;
	}
}

/*

rede.adicionaVertice(new Lugar('L1', 1));
rede.adicionaVertice(new Lugar('L2', 2));
rede.adicionaVertice(new Lugar('L3', 0));
rede.adicionaVertice(new Lugar('L4', 1));
rede.adicionaVertice(new Lugar('L5', 0));

rede.adicionaVertice(new Transicao('T1'));
rede.adicionaVertice(new Transicao('T2'));

rede.adicionaArco(rede.localizaVertice('L1'), rede.localizaVertice('T1'), 1);
rede.adicionaArco(rede.localizaVertice('L2'), rede.localizaVertice('T1'), 2);
rede.adicionaArco(rede.localizaVertice('T1'), rede.localizaVertice('L2'), 2);
rede.adicionaArco(rede.localizaVertice('T1'), rede.localizaVertice('L3'), 1);

rede.adicionaArco(rede.localizaVertice('L4'), rede.localizaVertice('T2'), 1);
rede.adicionaArco(rede.localizaVertice('L3'), rede.localizaVertice('T2'), 1);

rede.adicionaArco(rede.localizaVertice('T2'), rede.localizaVertice('L5'), 1);


rede.atualizaHabilitado();

rede.desenhaTerminal(0);
*/


/*
{"L":[["L1",1],["L2",2],["L3",0],["L4",1],["L5",0]],"T":[["T1",0],["T2",0]],"A":[["L1","T1",1],["L2","T1",2],["T1","L2",2],["T1","L3",1],["L4","T2",1],["L3","T2",1],["T2","L5",1]]}
*/