/**
 * Graph reader
 * 
 * @author  Lucas Land <land.lucas@outlook.com>
 * @date    2019-06-14
 * @license MIT License (http://opensource.org/licenses/MIT)
 */

let numVertexes = 0;
let numEdges = 0;
let adjacencyList = [];
let readerForm;
let alertsGroup;
let visualGraph;
const sleep = m => new Promise(r => setTimeout(r, m))

window.onload = function () {
    readerForm = document.getElementById('readerForm');
    alertsGroup = document.body.querySelector('div.alerts');
}

/**
 * Process our form data
 * @param {Object} e event
 */
async function processFormData(e) {
    e.preventDefault();
    numVertexes = parseInt(document.getElementById('numVertexes').value);
    numEdges = parseInt(document.getElementById('numEdges').value);
    if (numVertexes > 0 && numEdges > 0 && !readerForm.querySelector('.edge-group')) {
        if (numEdges >= numVertexes) {
            createAlert('Número de arestas deve ser menor de que vertices.', 'danger', 'error-2');
            return;
        } else {
            await createEdgeFields();
        }
    } else if (!numVertexes > 0 || !numEdges > 0) {
        createAlert('Preencha o número de vertices e/ou arestas.', 'danger', 'error-1');
        return;
    } else if (readerForm.querySelector('.edge-group')) {
        await removeAlerts('danger');
        let edgeItems = document.querySelectorAll('.edge-item');
        for (let i = 0; i < edgeItems.length; i++) {
            if (edgeItems[i].querySelector('.edge-field-from').value.length == 0 || edgeItems[i].querySelector('.edge-field-to').value.length == 0) {
                createAlert('Defina os vértices de todas arestas.', 'danger', 'error-3');
                return;
            }
        }
        adjacencyList = await populateAdjList(edgeItems);
        if (!adjacencyList) return;
        if (typeof visualGraph === 'object') visualGraph.destroy();
        visualGraph = createVisualGraph();
        showAdjListTable(document.body.querySelector('#adjacency-list'), adjacencyList);
    }
    return;
}

/**
 * Populate our adjacent list from our form fields.
 * @param {Object} edgeInputGroup The edge input group with '.edge-field-from' and '.edge-field-to' as children
 * @returns {array|boolean} list
 */
async function populateAdjList(edgeInputGroup) {
    list = [];
    for (let j = 0; j < numVertexes; j++) {
        list.push([]);
    }
    for (let i = 0; i < edgeInputGroup.length; i++) {
        let vertexFrom = parseInt(edgeInputGroup[i].querySelector('.edge-field-from').value);
        let vertexTo = parseInt(edgeInputGroup[i].querySelector('.edge-field-to').value);
        if (vertexFrom === vertexTo) {
            createAlert('Arestas necessitam de dois vértices diferentes.', 'danger', 'error-4');
            return false;
        }
        if (vertexFrom > numVertexes || vertexTo > numVertexes) {
            createAlert('Informe números de vértices válidos.', 'danger', 'error-5');
            return false;
        }
        if (!list[vertexFrom].includes(vertexTo)) {
            list[vertexFrom].push(vertexTo);
            list[vertexTo].push(vertexFrom);
        }
    }
    return list;
}

/**
 * Creates a visual representation for our graph using vis.js
 * @see {@link https://visjs.org/docs/network/}
 * @returns {Object} vis network
 */
async function createVisualGraph() {
    let nodes = [];
    let edges = [];
    for (let i = 0; i < adjacencyList.length; i++) {
        let vertex = adjacencyList[i];
        nodes.push({
            id: i,
            label: 'v' + i
        });
        for (let j = 0; j < vertex.length; j++) {
            if (!searchVisualEdge(edges, i, vertex[j])) {
                edges.push({
                    from: i,
                    to: vertex[j]
                });
            }
        }
    }
    let container = document.getElementById('visual-graph');
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        autoResize: true,
        height: '100%',
        width: '100%',
        edges: {
            smooth: false,
        }
    };
    return new vis.Network(container, data, options);
}

/**
 * Search if edge already exists is visual graph edge list, to avoid duplicates
 * @param {array}   edges   The visual graph object list
 * @param {number}  from    The 'from' vertex index    
 * @param {number}  to      The 'to' vertex index
 * @returns {(Object|boolean)}
 */
function searchVisualEdge(edges, from, to) {
    for (var i = 0; i < edges.length; i++) {
        if (edges[i].from === to && edges[i].to === from || edges[i].from === from && edges[i].to === to) {
            return edges[i];
        }
    }
    return false;
}

/**
 * Shows an adjacency list table
 * @param {Object} container
 * @param {array} list
 */
async function showAdjListTable(container, list) {
    let table = document.createElement('table');
    table.className = 'table';
    container.innerHTML = '';
    let innerContent = '<thead><tr><th scope="col">Vértice</th><th scope="col">Adjacências</th></tr></thead><tbody>';
    for (let i = 0; i < list.length; i++) {
        let vertex = list[i];
        innerContent += '<tr><td>' + i + '</td><td>';
        for (let j = 0; j < vertex.length; j++) {
            if (j == 0) {
                innerContent += vertex[j];
            } else {
                innerContent += ',' + vertex[j];
            }
        }
        innerContent += '</td></tr>';
    }
    innerContent += '</tbody>';
    table.innerHTML = innerContent;
    container.appendChild(table);
    let regResult = document.createElement('div');
    regResult.className = 'text-center';
    if (isGraphRegular(list)) {
        regResult.innerHTML = 'Grafo é regular!';
    } else {
        regResult.innerHTML = 'Grafo não é regular!';
    }
    container.appendChild(regResult);
}

/**
 * Test if a graph is regular or not, given an adjacent list.
 * @param {array} adjList List of adjacent vertexes for each vertex
 * @returns {boolean}
 */
function isGraphRegular(adjList) {
    if (adjList.length > 1) {
        adjNumber = adjList[0].length;
        for (let i = 0; i < adjList.length; i++) {
            if (adjNumber != adjList[i].length) return false;
            console.log('adjList[' + i + '].length = ' + adjList[i].length);
        }
    }
    return true;
}

/**
 * Create edge fields
 */
async function createEdgeFields() {
    let fieldRow = document.createElement('div');
    fieldRow.className = 'edge-group form-group px-lg-5';
    readerForm.insertBefore(fieldRow, readerForm.querySelector('button[type="submit"]'));

    for (let i = 0; i < numEdges && i < 99; i++) {
        let group = document.createElement('div');
        group.className = 'edge-item input-group input-group-sm mb-1';
        fieldRow.appendChild(group);

        let prepend = document.createElement('div');
        prepend.className = 'input-group-prepend';
        prepend.innerHTML = '<div class="input-group-text">Aresta ' + i + '</div>';
        group.appendChild(prepend);

        let fromInput = document.createElement('input');
        fromInput.type = 'text';
        fromInput.className = 'edge-field-from form-control';
        fromInput.name = 'edge-' + i + '-from';
        fromInput.setAttribute('placeholder', 'de');
        group.appendChild(fromInput);

        let toInput = document.createElement('input');
        toInput.type = 'text';
        toInput.className = 'edge-field-to form-control';
        toInput.name = 'edge-' + i + '-to';
        toInput.setAttribute('placeholder', 'para');
        group.appendChild(toInput);
    }

    readerForm.querySelector('#numVertexes').disabled = true;
    readerForm.querySelector('#numEdges').disabled = true;
    removeAlerts('danger');
    readerForm.querySelector('button[type="submit"]').innerHTML = 'Visualizar grafo';
}

/**
 * Create an alert
 * @param {string} message 
 * @param {string} alertClass 
 * @param {string} id 
 */
async function createAlert(message, alertClass = 'info', id) {
    const alert = document.createElement('div');
    if (document.getElementById(id)) return;

    alert.setAttribute('id', id);
    alert.className = 'alert alert-' + alertClass + ' alert-dismissible my-3 fade';
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

/**
 * Remove alerts with given alert class
 * @param {string} alertClass 
 */
async function removeAlerts(alertClass = 'danger') {
    let alerts = document.querySelectorAll('.alert-' + alertClass);
    for (let i = 0; i < alerts.length; ++i) {
        alerts[i].classList.remove('show');
        removeAlert(alerts[i]);
    }
}

/**
 * Removes an alert
 * @param {Object} alert 
 */
async function removeAlert(alert) {
    alert.classList.remove('show');
    alert.remove();
}