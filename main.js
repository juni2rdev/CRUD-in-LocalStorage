'use strict';

const openModal = () => document.getElementById('modal').classList.add('active');

const closeModal = () => {
    clearFields();
    return document.getElementById('modal').classList.remove('active');
};

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_Client')) ?? [];
const setLocalStorage = (Client) => localStorage.setItem("db_Client", JSON.stringify(Client));

// CRUD
    // CRUD-CREATE
const createClient = (client) => {
    let db_client = getLocalStorage();
    console.log(db_client);
    db_client.push(client);
    setLocalStorage(db_client);
};

    // CRUD-READ
const readClient = () => getLocalStorage();

    // CRUD-UPDATE
const updateClient = (index, client) => {
    const dbClient = readClient();
    dbClient[index] = client;
    setLocalStorage(dbClient);
};

    // CRUD-DELETE
const deleteClient = (index) => {
    const dbClient = readClient();
    dbClient.splice(index, 1);
    setLocalStorage(dbClient);
};

// interação com o layout
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field');
    fields.forEach(field => field.value = '');
};

const isValidFields = () => document.getElementById('form').reportValidity();

const saveClient = () => {
    if (isValidFields()) {
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value,
        };
        const index = document.getElementById('nome').dataset.index;
        if (index === 'new') {
            createClient(client);
            console.log('Cadastro concluído');
        } else {
            updateClient(index, client);
            console.log('Atualização concluída');
        }
        updateTable();
        closeModal();
    }
};

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr');
    rows.forEach(row => row.parentNode.removeChild(row));
};

const createRow = (client, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id='edit-${index}'>editar</button>
            <button type="button" class="button red" id='delete-${index}'>excluir</button>
        </td>
    `;
    document.querySelector('#tableClient>tbody').appendChild(newRow);
};

const updateTable = () => {
    const dbClient = readClient();
    clearTable();
    dbClient.forEach(createRow);
};

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome;
    document.getElementById('email').value = client.email;
    document.getElementById('celular').value = client.celular;
    document.getElementById('cidade').value = client.cidade;
    document.getElementById('nome').dataset.index = client.index;
};

const editClient = (index) => {
    const client = readClient()[index];
    client.index = index;
    fillFields(client);
    openModal();
};

const editDelete = (event) => {
    const type = event.target.type;
    if (type === 'button') {
        const [action, index] = event.target.id.split('-');
        if (action === 'edit') {
            editClient(index);
        } else if (action === 'delete') {
            const cert = confirm('Tem certeza que quer excluir o cliente?');
            if (cert) {
                deleteClient(index);
                updateTable();
            }
        }
    }
};

updateTable();

// events
document.getElementById('cadastrarCliente').addEventListener('click', openModal);
document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('salvar').addEventListener('click', saveClient);
document.getElementById('cancelar').addEventListener('click', closeModal);
document.querySelector('#tableClient>tbody').addEventListener('click', editDelete);
