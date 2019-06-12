let numVertexes = 0;
let numEdges = 0;
let adjacencyList = [];
let readerForm;
let alertsGroup;
const sleep = m => new Promise( r => setTimeout( r, m ) )

window.onload = function () {
    readerForm = document.getElementById( 'readerForm' );
    alertsGroup = document.body.querySelector( 'div.alerts' );
}

/**
 * Process the form data
 * @param {Object} e event
 */
async function processFormData( e ) {
    e.preventDefault();
    numVertexes = parseInt( document.getElementById( 'numVertexes' ).value );
    numEdges = parseInt( document.getElementById( 'numEdges' ).value );
    if ( numVertexes > 0 && numEdges > 0 && !readerForm.querySelector( '.edge-group' ) ) {
        if ( numEdges >= numVertexes ) {
            createAlert( 'Número de arestas deve ser menor de que vertices', 'danger', 'error-2' );
        } else {
            await createEdgeFields();
        }
    } else if ( !numVertexes > 0 || !numEdges > 0 ) {
        createAlert( 'Preencha o número de vertices e/ou arestas', 'danger', 'error-1' );
    } else if ( readerForm.querySelector( '.edge-group' ) ) {
        await populateAdjList();
        showVisualGraph();
        showAdjList();
    }
    return;
}

/**
 * Populate adjacent list
 */
async function populateAdjList() {
    for ( let j = 0; j < numVertexes; j++ ) {
        adjacencyList.push( [] );
    }
    let edgeInputGroup = document.querySelectorAll( '.edge-item' );
    for ( let i = 0; i < edgeInputGroup.length; i++ ) {
        let vertexFrom = parseInt( edgeInputGroup[ i ].querySelector( '.edge-field-from' ).value );
        let vertexTo = parseInt( edgeInputGroup[ i ].querySelector( '.edge-field-to' ).value );
        if ( !adjacencyList[ vertexFrom ].includes( vertexTo ) ) {
            adjacencyList[ vertexFrom ].push( vertexTo );
            adjacencyList[ vertexTo ].push( vertexFrom );
        }
    }
    console.dir( adjacencyList );
}

/**
 * Show visual graph
 */
async function showVisualGraph() {
    let nodes = [];
    let edges = [];
    for ( let i = 0; i < adjacencyList.length; i++ ) {
        let vertex = adjacencyList[ i ];
        nodes.push( {
            id: i,
            label: 'v' + i
        } );
        for ( let j = 0; j < vertex.length; j++ ) {
            edges.push( {
                from: i,
                to: vertex[ j ]
            } );
        }
    }
    console.log( 'nodes: ' + nodes );
    console.log( 'edges: ' + edges );
    let container = document.getElementById( 'visual-graph' );
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        autoResize: true,
        height: '100%',
        width: '100%'
    };
    let network = new vis.Network( container, data, options );
}

/**
 * Show adjacency list
 */
async function showAdjList() {
    let container = document.body.querySelector( '#adjacency-list' );
    let table = document.createElement( 'table' );
    table.className = 'table';
    container.innerHTML = '';
    let innerContent = '<thead><tr><th scope="col">Vértice</th><th scope="col">Adjacências</th></tr></thead><tbody>';
    for ( let i = 0; i < adjacencyList.length; i++ ) {
        let vertex = adjacencyList[ i ];
        innerContent += '<tr><td>' + i + '</td><td>';
        for ( let j = 0; j < vertex.length; j++ ) {
            if ( j == 0 ) {
                innerContent += vertex[ j ];
            } else {
                innerContent += ',' + vertex[ j ];
            }
        }
        innerContent += '</td></tr>';
    }
    innerContent += '</tbody>';
    table.innerHTML = innerContent;
    container.appendChild( table );
}

/**
 * Create edge fields
 */
async function createEdgeFields() {
    let fieldRow = document.createElement( 'div' );
    fieldRow.className = 'edge-group form-group px-lg-5';
    readerForm.insertBefore( fieldRow, readerForm.querySelector( 'button[type="submit"]' ) );

    for ( let i = 0; i < numEdges && i < 99; i++ ) {
        let group = document.createElement( 'div' );
        group.className = 'edge-item input-group input-group-sm mb-1';
        fieldRow.appendChild( group );

        let prepend = document.createElement( 'div' );
        prepend.className = 'input-group-prepend';
        prepend.innerHTML = '<div class="input-group-text">Aresta ' + i + '</div>';
        group.appendChild( prepend );

        let fromInput = document.createElement( 'input' );
        fromInput.type = 'text';
        fromInput.className = 'edge-field-from form-control';
        fromInput.name = 'edge-' + i + '-from';
        fromInput.setAttribute( 'placeholder', 'de' );
        group.appendChild( fromInput );

        let toInput = document.createElement( 'input' );
        toInput.type = 'text';
        toInput.className = 'edge-field-to form-control';
        toInput.name = 'edge-' + i + '-to';
        toInput.setAttribute( 'placeholder', 'para' );
        group.appendChild( toInput );
    }

    readerForm.querySelector( '#numVertexes' ).disabled = true;
    readerForm.querySelector( '#numEdges' ).disabled = true;
    removeAlerts( 'danger' );
    readerForm.querySelector( 'button[type="submit"]' ).innerHTML = 'Visualizar grafo';
}

/**
 * Create an alert
 * @param {string} message 
 * @param {string} alertClass 
 * @param {string} id 
 */
async function createAlert( message, alertClass = 'info', id ) {
    const alert = document.createElement( 'div' );
    if ( document.getElementById( id ) ) return;

    alert.setAttribute( 'id', id );
    alert.className = 'alert alert-' + alertClass + ' alert-dismissible fade';
    alert.setAttribute( 'role', 'alert' );
    alert.innerHTML =
        message +
        '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
        '<span aria-hidden="true">&times;</span>' +
        '</button>'
    alertsGroup.appendChild( alert );

    await sleep( 50 );
    alert.classList.add( 'show' );
}

/**
 * Remove alerts with given alert class
 * @param {string} alertClass 
 */
async function removeAlerts( alertClass = 'danger' ) {
    let alerts = document.querySelectorAll( '.alert-' + alertClass );
    for ( let i = 0; i < alerts.length; ++i ) {
        alerts[ i ].classList.remove( 'show' );
        removeAlert( alerts[ i ] );
    }
}

/**
 * 
 * @param {Object} alert 
 */
async function removeAlert( alert ) {
    alert.classList.remove( 'show' );
    await sleep( 200 );
    alert.remove();
}