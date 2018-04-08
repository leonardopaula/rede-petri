class Lugar 
{
	constructor(nome, marcas)
	{
		this.nome = nome;
		this.marcas = marcas;
	}
}

class Transicao
{
	constructor(nome)
	{
		this.nome = nome;
		this.habilitado = false;
	}
}

class RedePetri
{
	constructor()
	{
		this.vertice    = [];
		this.nVertices  = 0;
		this.arco       = [];
		this.ciclo      = 0;
		this.habilitados= [];
		this.passo      = 0;
	}

	adicionaVertice(vertice)
	{
		this.vertice[ this.nVertices++ ] = vertice;
	}

	adicionaArco(v1, v2, peso = 1)
	{
		// TODO: adicionar consistência nas ligações (não permitir transicao -> transicao, nem lugar -> lugar)
		if (!this.arco[v1])
			this.arco[v1]     = [];

		this.arco[v1][v2] = peso;

	}

	localizaVertice(nome)
	{
		for(var i = 0; i < this.vertice.length; i++)
		{
			if (this.vertice[i].nome == nome)
			{
				return i;
			}
		}

		return -1;
	}

	/* Percorre todos o nós, executando 1 passo*/
	executa()
	{
		// Percorre as transações habilitadas, atualizando os pesos
		for(var i = 0; i < this.habilitados.length; i++)
		{
			// Percorre os arcos deste vértice
			for(var j = 0; j < this.arco.length; j++)
			{
				// Para
				if (j == this.habilitados[i])
				{
					for (var k = 0; k < this.arco[j].length; k++)
					{
						if (this.arco[j][k] != undefined)
						{
							this.vertice[k].marcas += this.arco[j][k];
						}
					}
				}

				// De
				if (this.arco[j])
				{
					if (this.arco[j][this.habilitados[i]] != undefined)
					{
						this.vertice[j].marcas -= this.arco[j][this.habilitados[i]];
					}
				}
			}
		}

		this.ciclo++;

		this.atualizaHabilitado();
	}

	atualizaHabilitado()
	{
		this.habilitados = [];

		// Percorre capturando as transacoes
		for(var i = 0; i < this.nVertices; i++)
		{
			if (this.vertice[i] instanceof Transicao)
			{
				this.vertice[i].habilitado = this.verificaTransacao(i);
				if (this.vertice[i].habilitado)
					this.habilitados.push(i);
			}
		}

	}

	verificaTransacao(indice)
	{
		let transacao  = this.vertice[indice];
		let local      = {};
		let habilitado = false;

		// Percorre os arcos verificando os pesos
		for(var i = 0; i < this.arco.length; i++)
		{
			if (this.arco[i])
			{
				if (this.arco[i][indice] != undefined)
				{
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

	desenhaTerminal(ciclo)
	{
		let transicoes = [];
		    transicoes['cabecalho'] = '';
		    transicoes['dados'] = '';
		let lugares    = [];
			lugares['cabecalho'] = '';
			lugares['dados'] = '';
		let cabecalho  = '|Ciclo|  ';
		let dados      = '|  ';

		dados         += ciclo + '  |  ';

		for(var i = 0; i < this.vertice.length; i++)
		{
			if (this.vertice[i] instanceof Lugar) 
			{
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
		dados     += lugares['dados'] + transicoes['dados'];
		console.log(cabecalho);
		console.log(dados);
		document.getElementById("redeOutput").innerHTML = cabecalho + "\n" + dados;
	}

	desenhaTabela(ciclo)
	{
		let transicoes = [];
		    transicoes['cabecalho'] = '';
		    transicoes['dados'] = '';
		let lugares    = [];
			lugares['cabecalho'] = '';
			lugares['dados'] = '';
		let cabecalho  = '<td>Ciclo</td>';
		let dados      = '<td>';

		dados         += ciclo + '</td>';

		for(var i = 0; i < this.vertice.length; i++)
		{
			if (this.vertice[i] instanceof Lugar) 
			{
				if (ciclo == 0)
					lugares['cabecalho'] += '<td>' + this.vertice[i].nome + '</td>';

				lugares['dados'] += '<td>' + this.vertice[i].marcas + '</td>';
			} else {

				if (ciclo == 0)
					lugares['cabecalho'] += '<td>' + this.vertice[i].nome + '</td>';

				transicoes['dados'] += '<td>' + ((this.vertice[i].habilitado) ? 'S' : 'N') + '</td>';
			}
		}

		cabecalho += lugares['cabecalho'] + transicoes['cabecalho'];
		dados     += lugares['dados'] + transicoes['dados'];
		$('.table thead').html(cabecalho);
		$('.table tbody').html($('.table tbody').html() + dados);
	}
}

function lerEntradaRede() {
	texto = document.getElementById("redeInput").value
	let json = JSON.parse(texto);
	var rede = new RedePetri();
	let lugares = json.L;
	for(var i = 0; i < lugares.length; i++){
		rede.adicionaVertice(new Lugar(lugares[i][0], lugares[i][1]));
	}
	let transicoes = json.T;
	for(var i = 0; i < transicoes.length; i++){
		rede.adicionaVertice(new Transicao(transicoes[i][0]));
	}
	let arcos = json.A;	
	for(var i = 0; i < arcos.length; i++){
		rede.adicionaArco(rede.localizaVertice(arcos[i][0]), rede.localizaVertice(arcos[i][1]), arcos[i][2]);
	}

	rede.atualizaHabilitado();

	//rede.desenhaTerminal(0);
	rede.desenhaTabela(0);
}

/*
var rede = new RedePetri();

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