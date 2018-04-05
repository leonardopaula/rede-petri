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
	}

	adicionaVertice(vertice)
	{
		this.vertice[ this.nVertices++ ] = vertice;
	}

	adicionaArco(v1, v2, peso = 1)
	{
		// TODO: adicionar consistência nas ligações (não permitir transicao -> transicao, nem lugar -> lugar)
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
	executa(vertice)
	{
		// Verifica os possíveis caminhos a partir do atual
		let verticeAtual = this.vertice[vertice];

		// Caminhos que o nodo pode tomar
		let caminhos = this.arco[vertice];

		// vertices que ele pode ir
		let verticesPossiveis = [];

		for(var i = 0; i < caminhos.length; i++)
		{
			if (caminhos[i] != undefined)
			{
				if (this.arco[vertice][i] <= verticeAtual.marcas)
				{
					verticesPossiveis.push(i);
				}
			}
		}

		//this.temRecursos(verticesPossiveis);
	}

	atualizaHabilitado()
	{
		// Percorre capturando as transacoes
		for(var i = 0; i < this.nVertices; i++)
		{
			if (this.vertice[i] instanceof Transicao)
			{
				this.vertice[i].habilitado = this.verificaTransacao(i);
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
					console.log("L:" + local.marcas + " A:" + this.arco[i][indice]);
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
				if (ciclo == 0)
					lugares['cabecalho'] += this.vertice[i].nome + ' |  ';

				lugares['dados'] += this.vertice[i].marcas + '  |  ';
			} else {

				if (ciclo == 0)
					transicoes['cabecalho'] += this.vertice[i].nome + ' |  ';

				transicoes['dados'] += ((this.vertice[i].habilitado) ? 'S' : 'N') + '  |  ';
			}
		}

		cabecalho += lugares['cabecalho'] + transicoes['cabecalho'];
		dados     += lugares['dados'] + transicoes['dados'];
		console.log(cabecalho);
		console.log(dados);
	}

}

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

