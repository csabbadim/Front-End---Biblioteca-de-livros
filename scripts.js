/*
  --------------------------------------------------------------------------------------
  Função para obter o nome do autor via API Externa
  --------------------------------------------------------------------------------------
*/

async function fetchData(authorName) {
  const encodedAuthorName = encodeURIComponent(authorName);
  const url = `https://openlibrary.org/search/authors.json?q=${encodedAuthorName}`;
  const options = { // Definir as opções de requisição dentro da função
    method: 'GET',
  };

try {
  const response = await fetch(url, options);
  const result = await response.json();
  const docs = result.docs;

  // Exibir os top works no listContainer
  const listContainer = document.getElementById("listContainer");
  listContainer.innerHTML = ""; // Limpar o conteúdo antes de adicionar novos itens

  docs.forEach(author => {
    const topWork = author.top_work;
    const authorKey = author.key;
    // console.log("Top Work:", topWork);

    // Adicionar o nome do top work ao listContainer
    if (topWork && authorKey) {
      // console.log("Adding top work:", topWork);
      const listItem = document.createElement("div");
      listItem.textContent = topWork;
      listContainer.appendChild(listItem);

      // Adicionar evento de clique ao item
    listItem.addEventListener("click", () => {
      // console.log("Item clicado:", topWork);
      const novoLivroInput = document.getElementById("nome_livro");
      novoLivroInput.value = topWork;
      listContainer.style.display = "none";
      }); 
    }
  });
  
} catch (error) {
  console.error(error);
  }
}

// Evento de mudança para buscar e exibir os "Top Works" quando um autor é inserido
const inputAutor = document.getElementById("nome_autor");
const searchIcon = document.querySelector(".search-icon");
searchIcon.addEventListener("click", async () => {
  const authorName = inputAutor.value;
  if (authorName !== "") {
      try {
          await fetchData(authorName);
          listContainer.style.display = "block"; // Exibir a lista ao clicar no ícone de pesquisa
      } catch (error) {
          console.error(error);
      }
    } else {
      listContainer.style.display = "none"; // Esconder a lista se o campo autor estiver vazio
    }
});

// Evento pra quando a seta pra baixo é clicada
const toggleListButton = document.getElementById("toggleListButton");
const listContainer = document.getElementById("listContainer");
toggleListButton.addEventListener("click", () => {
  console.log("Botão de seta clicado!");
  if (listContainer.style.display === "none") {
    listContainer.style.display = "block";
  } else {
    listContainer.style.display = "none";
  }
});


/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async () => {
  let url = 'http://127.0.0.1:5000/livros';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {
      data.livros.forEach(item => insertList(item.nome_livro, item.nome_autor, item.ja_lido, item.quer_ler, item.previsao_leitura))
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


// FUNÇÃO PARA CHAMAR GET LIVRO
const getLivro = async (searchText) => {
  let url = `http://127.0.0.1:5000/procuralivro?nome_livro=${encodeURIComponent(searchText)}`;
  
  try {
    const response = await fetch(url, {
      method: 'get',
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Registrar os dados recebidos
      searchItems(searchText)
    } else {
      console.error('Erro:', response.status);
    }
  } catch (error) {
    console.error('Erro:', error);
  }
}

// Adiciona evento de digitação no campo de busca
const searchButton = document.getElementById("searchButton");
searchButton.addEventListener("click", () => {
  const searchText = searchInput.value;
  getLivro(searchText); // Chama a função getLivro com o termo de busca
});

// Função para pesquisar na tabela e filtrar os itens
const searchItems = (searchText) => {
  const tableRows = document.querySelectorAll("#myTable tbody tr");
  tableRows.forEach(row => {
    const itemNameCell = row.querySelector("td:first-child");
    if (itemNameCell) {
      const itemName = itemNameCell.innerText;
      if (itemName.toLowerCase().includes(searchText.toLowerCase())) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    }
  });
};

/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (nome_livro, nome_autor, ja_lido, quer_ler, previsao_leitura) => {
  const formData = new FormData();
  formData.append('nome_livro', nome_livro);
  formData.append('nome_autor', nome_autor);
  formData.append('ja_lido', ja_lido);
  formData.append('quer_ler', quer_ler);
  formData.append('previsao_leitura', previsao_leitura);

  let url = 'http://127.0.0.1:5000/livro';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}

/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/livro?nome_livro=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um checkbox para a coluna "Quer Ler" para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertCheckboxQuerLer = (parent, quer_ler) =>  {
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if (quer_ler.toLowerCase() === "sim") {
  checkbox.checked = true} else {
    checkbox.checked = false
  }; // Marca o checkbox se quer_ler for "sim"
  checkbox.className = "checkboxQuerLer"
  parent.appendChild(checkbox);
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar o item "quer_ler" de acordo com a alteração no checkbox
  --------------------------------------------------------------------------------------
*/
const atualizaQuerLer = () => {
  let checkboxQuerLer = document.getElementsByClassName("checkboxQuerLer");
  var quer_ler;
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < checkboxQuerLer.length; i++) {
    checkboxQuerLer[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      const querLerItem = div.getElementsByTagName('td')[3]
      if (querLerItem.firstChild.checked) {
          quer_ler = "Sim" } else {
          quer_ler = "Não"
        };
      atualizaItemQuerLer(nomeItem, quer_ler)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar o campo quer_ler via requisição PUT
  --------------------------------------------------------------------------------------
*/
const atualizaItemQuerLer = (item, quer_ler) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/alteralivro?nome_livro=' + item + '&quer_ler=' + quer_ler;
  fetch(url, {
    method: 'put'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um checkbox para a coluna "Já Lido" para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertCheckboxJaLido = (parent, ja_lido) =>  {
  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  if (ja_lido.toLowerCase() === "sim") {
  checkbox.checked = true} else {
    checkbox.checked = false
  }; // Marca o checkbox se ja_lido for "sim"
  checkbox.className = "checkboxJaLido"
  parent.appendChild(checkbox);
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar o item "ja_lido" de acordo com a alteração no checkbox
  --------------------------------------------------------------------------------------
*/
const atualizaJaLido = () => {
  let checkboxJaLido = document.getElementsByClassName("checkboxJaLido");
  var ja_lido;
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < checkboxJaLido.length; i++) {
    checkboxJaLido[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      const jaLidoItem = div.getElementsByTagName('td')[2]
      if (jaLidoItem.firstChild.checked) {
          ja_lido = "Sim" } else {
          ja_lido = "Não"
        };
      atualizaItemJaLido(nomeItem, ja_lido)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar o campo ja_lido via requisição PUT
  --------------------------------------------------------------------------------------
*/
const atualizaItemJaLido = (item, ja_lido) => {
  console.log(ja_lido)
  let url = 'http://127.0.0.1:5000/alteralivro?nome_livro=' + item + '&ja_lido=' + ja_lido;
  fetch(url, {
    method: 'put'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para criar um campo editável de data para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertInputField = (parent, previsao_leitura) => {
  let input = document.createElement("input");
  input.type = "date";
  input.className = "editable-input";
  // Converter a data para o formato YYYY-MM-DD
  const dateParts = previsao_leitura.split('/');
  const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
  //input.setAttribute('value', formattedDate);
  input.value = formattedDate;
  parent.appendChild(input);
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar o item "Data de leitura" de acordo com a alteração no campo data
  --------------------------------------------------------------------------------------
*/
const atualizaData = () => {
  let input = document.getElementsByClassName("editable-input");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < input.length; i++) {
    input[i].onchange = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      const previsaoLeitura = div.getElementsByTagName('td')[4]
      console.log(previsaoLeitura.firstChild.value)
      atualizaPrevisaoLeitura(nomeItem, previsaoLeitura.firstChild.value)
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para alterar o campo previsao_leitura via requisição PUT
  --------------------------------------------------------------------------------------
*/
const atualizaPrevisaoLeitura = (item, previsao_leitura) => {
  // Converter a data para o formato YYYY-MM-DD
  const dateParts = previsao_leitura.split('-');
  previsao_leitura = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
  console.log(previsao_leitura)
  let url = 'http://127.0.0.1:5000/alteralivro?nome_livro=' + item + '&previsao_leitura=' + previsao_leitura;
  fetch(url, {
    method: 'put'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com livro, autor, campo quer ler, campo quer lido e previsão de leitura 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputLivro = document.getElementById("nome_livro").value;
  let inputAutor = document.getElementById("nome_autor").value;
  let inputQuerLer = document.getElementById("quer_ler").value;
  let inputJaLido = document.getElementById("ja_lido").value;
  let inputPrevisaoLeitura = document.getElementById("previsao_leitura").value;

  if (inputLivro === '') {
    alert("Escreva o nome de um livro!");
  } else if (inputAutor === '') {
    alert("Escreva o nome de um autor!");
  } else if (inputQuerLer === '') {
    alert("Preencha o campo se já leu o livro!");
  } else if ((inputQuerLer.toLowerCase() !== 'sim' && inputQuerLer.toLowerCase() !== 'não') && inputQuerLer.toLowerCase() !== '') {
    alert('Você precisa preencher se pretende ler com os valores "sim" ou "não".');
  } else if (inputJaLido === '') {
    alert("Escreva se pretende ler futuramente!");
  } else if ((inputJaLido.toLowerCase() !== 'sim' && inputJaLido.toLowerCase() !== 'não') && inputJaLido.toLowerCase() !== '') {
    alert('Você precisa preencher se já leu ou não com os valores "sim" ou "não".');
  } else if (inputPrevisaoLeitura === '') {
    alert("Preencha o campo com a data que leu esse livro, ou que pretender ler!");
  } else if (!isValidDateFormat(inputPrevisaoLeitura)) {
    alert("Por favor, insira uma data válida no formato dd/mm/yyyy para a previsão de leitura.");
  }
  else {
    insertList(inputLivro, inputAutor, inputQuerLer, inputJaLido, inputPrevisaoLeitura)
    postItem(inputLivro, inputAutor, inputQuerLer, inputJaLido, inputPrevisaoLeitura)
    alert("Livro adicionado!")
  }
  }

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/

const insertList = (nome_livro, nome_autor, ja_lido, quer_ler, previsao_leitura) => {
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  var celName = row.insertCell(0);
  celName.textContent = nome_livro;

  var celAutor = row.insertCell(1);
  celAutor.textContent = nome_autor;

  insertCheckboxJaLido(row.insertCell(2), ja_lido);

  insertCheckboxQuerLer(row.insertCell(3), quer_ler);

  insertInputField(row.insertCell(4), previsao_leitura);
  
  insertButton(row.insertCell(5));

  document.getElementById("nome_livro").value = "";
  document.getElementById("nome_autor").value = "";
  document.getElementById("previsao_leitura").value = "";

  atualizaQuerLer();
  atualizaJaLido();
  atualizaData();
  removeElement();
};

/*
  --------------------------------------------------------------------------------------
  Função para verificar que a data está no formato correto
  --------------------------------------------------------------------------------------
*/
function isValidDateFormat(dateString) {
  var regex = /^\d{2}\/\d{2}\/\d{4}$/;
  return regex.test(dateString);
}