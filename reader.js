let numVertices = 0;
let numEdges = 0;
let adjacencyList = [];
let readerForm;
let alertsGroup;
const sleep = m => new Promise(r => setTimeout(r, m))

window.onload = function () {
    readerForm = document.getElementById('readerForm');
    alertsGroup = document.body.querySelector('div.alerts');
}

async function processFormData(e) {
    e.preventDefault();
    numVertices = document.getElementById('numVertices').value;
    numEdges = document.getElementById('numEdges').value;
    if (numVertices > 0 && numEdges > 0 && !readerForm.querySelector('.adjacency-group')) {
        await createAdjacencyFields();
    }
    else if (!numVertices > 0 || !numEdges > 0) {
        createAlert('Preencha o número de vertices e/ou arestas', 'danger', 'error-1');
    }
    else if (readerForm.querySelector('.adjacency-group')) {
        populateAdjList();
    }
    return;
}

async function populateAdjList() {
    let fields = document.querySelectorAll('.adjacency-field');
    for (let i = 0; i < fields.length; ++i) {
        let vertex = fields[i].value.split(',');
        let vertexAdjList = [];
        for (let j = 0; j < vertex.length; j++) {
            vertexAdjList.push( parseInt(vertex[j]) );
        }
        adjacencyList.push( vertexAdjList );
    }
    console.dir(adjacencyList);
    createAlert('Lista de adj no console log!', 'info');
}

async function createAdjacencyFields() {

    let fieldRow = document.createElement('div');
    fieldRow.className = 'adjacency-group form-group row';
    readerForm.insertBefore(fieldRow, readerForm.querySelector('button[type="submit"]'));

    for (let i = 0; i < numVertices && i < 99; i++) {
        let label = document.createElement('label');
        label.setAttribute('for', 'vertice' + i);
        label.className = 'col-3';
        label.innerText = 'Vertice ' + i;
        fieldRow.appendChild(label);

        let group = document.createElement('div');
        group.className = 'form-group col-9 mb-1';
        fieldRow.appendChild(group);

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'adjacency-field form-control form-control-sm';
        input.name = 'vertice' + i;
        group.appendChild(input);
    }

    readerForm.querySelector('#numVertices').disabled = true;
    readerForm.querySelector('#numEdges').disabled = true;
    removeAlerts('danger');
    readerForm.querySelector('button[type="submit"]').innerHTML = 'Visualizar grafo';
}

async function createAlert(message, alertClass = 'info', id) {
    const alert = document.createElement('div');
    if (document.getElementById(id)) return;

    alert.setAttribute('id', id);
    alert.className = 'alert alert-' + alertClass + ' alert-dismissible fade';
    alert.setAttribute('role', 'alert');
    alert.innerHTML =
        message +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>'
    alertsGroup.appendChild(alert);

    await sleep(50);
    alert.classList.add('show');
}

async function removeAlerts(alertClass = 'danger') {
    let alerts = document.querySelectorAll('.alert-' + alertClass);
    for (let i = 0; i < alerts.length; ++i) {
        alerts[i].classList.remove('show');
        removeAlert(alerts[i]);
    }
}

async function removeAlert(alert) {
    alert.classList.remove('show');
    await sleep(200);
    alert.remove();
}