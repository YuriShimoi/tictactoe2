var selected_piece = null;
var COLORS = ["red", "blue"];

function initializeHands() {
    bindCells();

    let hn1 = document.getElementById("hand1");
    let hn1_pieces = getPieces();
    for(let piece of hn1_pieces) {
        hn1.appendChild(piece);
    }

    let hn2 = document.getElementById("hand2");
    let hn2_pieces = getPieces();
    for(let piece of hn2_pieces) {
        hn2.appendChild(piece);
    }
}

function newPiece (p_class, onclick=pieceSelect) {
    let _piece = document.createElement("DIV");
        _piece.classList.add("piece", p_class);
        _piece.onclick = onclick;
        return _piece;
}

function getPieces(l_amount=2, m_amount=2, s_amount=2) {
    let _pieces = [];

    for(let l=0; l < l_amount; l++) _pieces.push(newPiece("piece-large"));
    for(let m=0; m < m_amount; m++) _pieces.push(newPiece("piece-medium"));
    for(let s=0; s < s_amount; s++) _pieces.push(newPiece("piece-small"));

    return _pieces;
}

function pieceSelect(e) {
    let piece = e.target;
    let hand = piece.parentElement;

    let unselect = piece.hasAttribute("selected");

    let all_pieces = hand.getElementsByClassName("piece");
    for(let pc of all_pieces) {
        pc.removeAttribute("selected");
    }
    
    if(!unselect) {
        piece.setAttribute("selected", true);
        selected_piece = piece;
    }
    else {
        selected_piece = null;
    }
}

function getPieceSize(piece) {
    if(piece.classList.contains("piece-small"))  return 0;
    if(piece.classList.contains("piece-medium")) return 1;
    if(piece.classList.contains("piece-large"))  return 2;
    return -1;
}

function bindCells() {
    let cells = document.getElementsByClassName("table-cell");

    for(let cell of cells) {
        cell.onclick = (e) => {
            if(selected_piece && e.target === cell) {
                let element = e.target;

                if(validateMove(element)) {
                    let piece_sizes = ["piece-small","piece-medium","piece-large"];
                    let new_piece = newPiece(piece_sizes[getPieceSize(selected_piece)], () => {});

                    let is_top = selected_piece.parentElement.id === "hand1";
                    new_piece.style.setProperty("--color", is_top? COLORS[0]: COLORS[1]);
                    new_piece.classList.add(is_top? "piece-1": "piece-2");

                    element.innerHTML = "";
                    element.appendChild(new_piece);
    
                    selected_piece.remove();
                    selected_piece = null;

                    checkWin();
                }
            }
        };
    }
}

function validateMove(cell) {
    let pieces = cell.getElementsByClassName("piece");
    if(pieces.length === 0) return true;
    
    return getPieceSize(pieces[0]) < getPieceSize(selected_piece);
}

function checkWin() {
    const checkValids = mapping => validWins.filter(vw => vw.split('').filter((c, i) => c === '1' && c === mapping[i]).length === 3);

    let validWins = [
        "100100100", "010010010", "001001001",
        "111000000", "000111000", "000000111",
        "100010001", "001010100"
    ];

    let pos1 = new Array(9).fill('0');
    let pos2 = new Array(9).fill('0');
    let cells = document.getElementById("table").getElementsByClassName("table-cell");
    for(let c=0; c < cells.length; c++) {
        let piece = cells[c].getElementsByClassName("piece");
        if(piece.length > 0) {
            if(piece[0].classList.contains("piece-1")) pos1[c] = '1';
            if(piece[0].classList.contains("piece-2")) pos2[c] = '1';
        }
    }

    if(checkValids(pos1.join('')).length > 0) {
        endGame(0);
    }
    else if(checkValids(pos2.join('')).length > 0) {
        endGame(1);
    }
}

function endGame(winner) { // top: 0, bottom: 1
    setTimeout(()=>{alert(['red', 'blue'][winner]);}, 1);
}

initializeHands();