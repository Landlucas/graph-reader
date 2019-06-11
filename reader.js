let numVertices = 0;
let numEdges = 0;
let readerForm = document.getElementById('readerForm');

async function processFormData(e) {
    e.preventDefault();
    numVertices = document.getElementById('numVertices');
    numEdges = document.getElementById('numEdges');
    if (numVertices.value > 0 && numEdges.value > 0) {
        await createAdjacencyFields();
    }
    return;
}

async function createAdjacencyFields() {

    let fieldRow = document.createElement('div');
    fieldRow.className = 'adjacency-group form-group row';
    readerForm.insertBefore(fieldRow, readerForm.querySelector('button[type="submit"]'));

    for (let i = 0; i < numVertices.value; i++) {
        let label = document.createElement('label');
        label.setAttribute( 'for', 'vertice' + i);
        label.className = 'col-2';
        label.innerText = 'Vertice ' + i;
        fieldRow.appendChild( label );

        let group = document.createElement('div');
        group.className = 'form-group col-10 mb-1';
        fieldRow.appendChild( group );

        let input = document.createElement('input');
        input.type = 'text';
        input.className = 'adjacency-field form-control form-control-sm';
        input.name = 'vertice' + i;
        group.appendChild( input );
    }
}