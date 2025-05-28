const board = document.getElementById("board");
    const statusDiv = document.getElementById("status");
    const capturedDiv = document.getElementById("captured-pieces");
    let selectedCell = null;
    let currentTurn = 'w';

    const initialBoard = [
      ['br','bn','bb','bq','bk','bb','bn','br'],
      ['bp','bp','bp','bp','bp','bp','bp','bp'],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['','','','','','','',''],
      ['wp','wp','wp','wp','wp','wp','wp','wp'],
      ['wr','wn','wb','wq','wk','wb','wn','wr']
    ];

    function createBoard() {
      board.innerHTML = '';
      for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
          const cell = document.createElement("div");
          cell.className = "cell " + ((row + col) % 2 === 0 ? "white" : "black");
          cell.dataset.row = row;
          cell.dataset.col = col;

          const piece = initialBoard[row][col];
          if (piece) {
            const img = document.createElement("img");
            img.src = `./img/${piece}.png`;
            img.className = "piece";
            cell.appendChild(img);
          }

          cell.addEventListener("click", () => handleCellClick(cell));
          board.appendChild(cell);
        }
      }
    }

    function handleCellClick(cell) {
      const clickedPiece = cell.querySelector(".piece");

      if (selectedCell) {
        const fromRow = +selectedCell.dataset.row;
        const fromCol = +selectedCell.dataset.col;
        const toRow = +cell.dataset.row;
        const toCol = +cell.dataset.col;
        const piece = initialBoard[fromRow][fromCol];

        if (isValidMove(piece, fromRow, fromCol, toRow, toCol)) {
          movePiece(selectedCell, cell);
          currentTurn = currentTurn === 'w' ? 'b' : 'w';
          updateStatus();
        }

        selectedCell.classList.remove("highlight");
        selectedCell = null;
      } else if (clickedPiece && clickedPiece.src.includes(`/${currentTurn}`)) {
        selectedCell = cell;
        cell.classList.add("highlight");
      }
    }

    function movePiece(fromCell, toCell) {
      const piece = fromCell.querySelector(".piece");
      if (!piece) return;
      const toPiece = toCell.querySelector(".piece");
      if (toPiece) {
        const capturedImage = toPiece.cloneNode();
        capturedImage.classList.remove("piece");
        capturedDiv.appendChild(capturedImage);
        toPiece.remove();
      }
      fromCell.removeChild(piece);
      toCell.appendChild(piece);

      const fromRow = +fromCell.dataset.row;
      const fromCol = +fromCell.dataset.col;
      const toRow = +toCell.dataset.row;
      const toCol = +toCell.dataset.col;

      initialBoard[toRow][toCol] = initialBoard[fromRow][fromCol];
      initialBoard[fromRow][fromCol] = '';
    }

    function isValidMove(piece, fromRow, fromCol, toRow, toCol) {
      if (!piece) return false;
      const type = piece[1];
      const color = piece[0];
      if (color !== currentTurn) return false;
      const direction = color === 'w' ? -1 : 1;

      const dx = toCol - fromCol;
      const dy = toRow - fromRow;

      switch (type) {
        case 'p':
          if (dx === 0 && initialBoard[toRow][toCol] === '') {
            if (dy === direction) return true;
            if ((color === 'w' && fromRow === 6 || color === 'b' && fromRow === 1) && dy === 2 * direction && initialBoard[fromRow + direction][fromCol] === '') return true;
          }
          if (Math.abs(dx) === 1 && dy === direction && initialBoard[toRow][toCol] && initialBoard[toRow][toCol][0] !== color) {
            return true;
          }
          return false;
        case 'r':
          if (dx === 0 || dy === 0) return clearPath(fromRow, fromCol, toRow, toCol);
          return false;
        case 'n':
          return (Math.abs(dx) === 1 && Math.abs(dy) === 2) || (Math.abs(dx) === 2 && Math.abs(dy) === 1);
        case 'b':
          if (Math.abs(dx) === Math.abs(dy)) return clearPath(fromRow, fromCol, toRow, toCol);
          return false;
        case 'q':
          if (dx === 0 || dy === 0 || Math.abs(dx) === Math.abs(dy)) return clearPath(fromRow, fromCol, toRow, toCol);
          return false;
        case 'k':
          return Math.abs(dx) <= 1 && Math.abs(dy) <= 1;
        default:
          return false;
      }
    }

    function clearPath(fromRow, fromCol, toRow, toCol) {
      const dx = Math.sign(toCol - fromCol);
      const dy = Math.sign(toRow - fromRow);
      let r = fromRow + dy;
      let c = fromCol + dx;
      while (r !== toRow || c !== toCol) {
        if (initialBoard[r][c] !== '') return false;
        r += dy;
        c += dx;
      }
      return true;
    }

    function updateStatus() {
      statusDiv.textContent = currentTurn === 'w' ? "Vez das peças brancas" : "Vez das peças pretas";
    }

    

    createBoard();
    updateStatus();