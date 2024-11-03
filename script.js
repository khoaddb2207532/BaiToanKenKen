let matrixSize = 0;
let cells = [];
/*--------------------GET DATA FROM PLAYER ------------------------*/
const matrixContainer = document.getElementById("matrixContainer");
const matrixSizeInput = document.getElementById("matrixSize");
const startButton = document.getElementById("startButton");
const inputContainer = document.getElementById("inputContainer");
const numberInput = document.getElementById("numberInput");
const operationInput = document.getElementById("operationInput");
const addButton = document.getElementById("addButton");

let selectedCells = [];
let currentIndex = 0;
startButton.addEventListener("click", () => {
    matrixSize = parseInt(matrixSizeInput.value);
    if (isNaN(matrixSize) || matrixSize < 1) {
        alert("Vui lòng nhập một số hợp lệ.");
        return;
    }
    matrixContainer.innerHTML = "";
    selectedCells = [];
    currentIndex = 0;
    
    // Tạo ma trận và thêm sự kiện click cho từng ô
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            const cell = document.createElement("div");
            cell.classList.add("matrix-cell");

            const index = i * matrixSize + j; 
            cell.dataset.index = index; // Lưu chỉ số  vào dataset của ô

            cell.addEventListener("click", () => handleCellClick(index, cell));
            matrixContainer.appendChild(cell);
        }
        matrixContainer.appendChild(document.createElement("br"));
    }
});

function handleCellClick(index, cell) {
    if (selectedCells.includes(index)) {
        // Nếu ô đã được chọn thì bỏ chọn
        selectedCells = selectedCells.filter(item => item !== index);
        cell.style.backgroundColor = "";
    } else {
        // Nếu ô chưa được chọn thì chọn ô
        selectedCells.push(index);
        cell.style.backgroundColor = "yellow"; // Chọn ô
    }
    // Hiện ô nhập liệu nếu có ô được chọn
    inputContainer.classList.remove("hidden");
}

addButton.addEventListener("click", () => {
    if (selectedCells.length === 0) {
        alert("Vui lòng chọn ít nhất một ô.");
        return;
    }

    const number = numberInput.value;
    const operation = operationInput.value;

    selectedCells.forEach(index => {
        cells[index] = { cage : parseInt(currentIndex) ,target: parseInt(number), operand: operation,value : 0 }; // Lưu dữ liệu cho ô
     
        const cell = matrixContainer.querySelector(`div[data-index='${index}']`);
        cell.textContent = `${number} ${operation}`; // Cập nhật hiển thị ô
        
    });
    currentIndex++;

    // Reset thông tin đầu vào
    numberInput.value = '';
    operationInput.value = '';

    // Bỏ chọn tất cả ô
    selectedCells.forEach(index => {
        const cell = matrixContainer.querySelector(`div[data-index='${index}']`);
        cell.style.backgroundColor = ""; // Đặt lại màu nền
    });
    selectedCells = []; // Xóa danh sách ô đã chọn
    inputContainer.classList.add("hidden");
});
/*----------------------------------------------------------------------------------------------------------------*/

function validateInputFormat(cells, matrixSize) {

    // Tạo một bản đồ chứa các ô của từng chuồng
    const cageMap = {};
    
    cells.forEach((cell, index) => {
        if (!cageMap[cell.cage]) {
            cageMap[cell.cage] = [];
        }
        cageMap[cell.cage].push(index);
    });

    // Kiểm tra từng chuồng trong `cageMap`
    for (const cage in cageMap) {
        const cageCells = cageMap[cage];
        console.log(cageCells);
        if (cageCells.length === 1) {
            continue;
        }
        
        // Kiểm tra từng ô trong chuồng để đảm bảo tất cả ô trong chuồng đều nằm kề nhau
        for (let i = 0; i < cageCells.length; i++) {
            const cellIndex = cageCells[i];
            const row = Math.floor(cellIndex / matrixSize);
            const col = cellIndex % matrixSize;

            // Kiểm tra có ô nào lân cận không
            let hasNeighbor = false;

            // Kiểm tra bốn ô xung quanh (trên, dưới, trái, phải)
            const neighbors = [
                cellIndex - 1,        // Trái
                cellIndex + 1,        // Phải
                cellIndex - matrixSize, // Trên
                cellIndex + matrixSize  // Dưới
            ];

            for (const neighbor of neighbors) {
                if (
                    cageCells.includes(neighbor) &&  // Kiểm tra có phải cùng chuồng không
                    Math.abs(Math.floor(neighbor / matrixSize) - row) <= 1 &&  // Kiểm tra trong cùng hàng hoặc hàng liền kề
                    Math.abs((neighbor % matrixSize) - col) <= 1 // Kiểm tra trong cùng cột hoặc cột liền kề
                ) {
                    hasNeighbor = true;
                    break;
                }
            }

            if (!hasNeighbor) {
                alert(`Lỗi: Các ô trong chuồng ${cage} không liền kề nhau.`);
                return false;
            }
        }
    }

    // Nếu tất cả các chuồng đều hợp lệ
    return true;
}



function displaySolution() {
    const tableHtml = generateTableHtml(true);
    document.getElementById("solutionTable").innerHTML = tableHtml;
}

function generateTableHtml(withSolution) {
    let html = "<table>";
    for (let i = 0; i < matrixSize; i++) {
        html += "<tr>";
        for (let j = 0; j < matrixSize; j++) {
            const index = i * matrixSize + j;
            const cell = cells[index];

            // Khởi tạo lớp viền cho các cạnh
            let borderClasses = "";

            // Kiểm tra các ô liền kề
            const topNeighbor = i > 0 ? cells[(i - 1) * matrixSize + j] : null;
            const bottomNeighbor = i < matrixSize - 1 ? cells[(i + 1) * matrixSize + j] : null;
            const leftNeighbor = j > 0 ? cells[i * matrixSize + (j - 1)] : null;
            const rightNeighbor = j < matrixSize - 1 ? cells[i * matrixSize + (j + 1)] : null;

            // Thêm viền nếu ô liền kề không thuộc cùng chuồng
            if (!topNeighbor || topNeighbor.cage !== cell.cage) borderClasses += " top-border";
            if (!bottomNeighbor || bottomNeighbor.cage !== cell.cage) borderClasses += " bottom-border";
            if (!leftNeighbor || leftNeighbor.cage !== cell.cage) borderClasses += " left-border";
            if (!rightNeighbor || rightNeighbor.cage !== cell.cage) borderClasses += " right-border";

            // Thêm lớp viền vào HTML của ô
            html += `<td class="cage-cell${borderClasses}" data-target="${cell.target}" data-operand="${cell.operand}">`;
            if (withSolution) {
                html += cell.value;
            }
            html += "</td>";
        }
        html += "</tr>";
    }
    html += "</table>";
    return html;
}


function solveKenKen() {

    if (!validateInputFormat(cells, matrixSize)) {
        // Ngừng tiến hành giải nếu định dạng không hợp lệ
        console.log("Định dạng không hợp lệ. Vui lòng nhập lại.");
        return;
    }    
    function backtrack(index) {
        if (index === matrixSize * matrixSize) {
            displaySolution();
            return true;
        }
    
        // Lựa chọn ô có ít giá trị hợp lệ nhất
        let cell = selectCellWithMinRemainingValues();
        let possibleValues = getPossibleValues(cell.index);
        
        for (let num of possibleValues) {
            if (isValid(cell.index, num)) {
                console.log(cell.index + "," + num);
                cells[cell.index].value = num;
                
                // Áp dụng Constraint Propagation
                let oldPossibleValues = constraintPropagation(cell.index, num);
                
                if (oldPossibleValues && backtrack(index + 1)) return true;

                // Khôi phục lại trạng thái khi quay lui
                cells[cell.index].value = 0;
                restorePossibleValues(oldPossibleValues);
            }
        }
        
        return false;
    }
    // Hàm Constraint Propagation
    function constraintPropagation(index, value) {
        let oldPossibleValues = {};

        cells[index].value = value;

        for (let i = 0; i < cells.length; i++) {
            if (cells[i].value === 0) {
                let possibleValues = getPossibleValues(i);
                
                // Lưu lại các giá trị hợp lệ hiện tại trước khi cập nhật
                oldPossibleValues[i] = cells[i].possibleValues || [];
                
                cells[i].possibleValues = possibleValues;

                // Nếu ô nào không còn giá trị hợp lệ, dừng lại
                if (possibleValues.length === 0) {
                    cells[index].value = 0;
                    restorePossibleValues(oldPossibleValues);
                    return null;
                }
            }
        }
        return oldPossibleValues;
    }

    // Hàm phục hồi các giá trị khả dĩ khi quay lui
    function restorePossibleValues(oldPossibleValues) {
        for (let index in oldPossibleValues) {
            cells[index].possibleValues = oldPossibleValues[index];
        }
    }
    // Hàm chọn ô có ít giá trị hợp lệ nhất (MRV - Minimum Remaining Values)
function selectCellWithMinRemainingValues() {
    let minOptions = matrixSize + 1;
    let selectedCell = null;

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].value === 0) { // Chỉ xét các ô chưa điền giá trị
            let possibleValues = getPossibleValues(i);
            if (possibleValues.length < minOptions) {
                minOptions = possibleValues.length;
                selectedCell = { index: i, possibleValues: possibleValues };
            }
        }
    }
    return selectedCell;
}

// Hàm lấy các giá trị hợp lệ cho một ô cụ thể
function getPossibleValues(index) {
    let possibleValues = [];
    for (let num = 1; num <= matrixSize; num++) {
        if (isValid(index, num)) {
            possibleValues.push(num);
        }
    }
    return possibleValues;
}

    function isValid(index, candidate) {
        return checkRow(index, candidate) && checkCol(index, candidate) && checkCage(index, candidate);
    }

    function checkRow(index, candidate) {
        const rowStart = Math.floor(index / matrixSize) * matrixSize;
        for (let i = rowStart; i < rowStart + matrixSize; i++) {
            if (cells[i].value === candidate) return false;
        }
        return true;
    }

    function checkCol(index, candidate) {
        const colStart = index % matrixSize;
        for (let i = colStart; i < cells.length; i += matrixSize) {
            if (cells[i].value === candidate) return false;
        }
        return true;
    }

    function checkCage(index, candidate) {
        
        
        const cage = cells[index].cage;
        const target = cells[index].target;
        const operand = String(cells[index].operand.trim());
    
        // Lấy tất cả các ô trong chuồng hiện tại
        let cageCells = cells.filter(cell => cell.cage === cage);
        let values = cageCells.map(cell => cell.value).filter(val => val > 0); // Lọc các ô đã được gán giá trị
        values.push(candidate);  // Thêm giá trị đang xét vào danh sách
        // Kiểm tra theo từng toán tử

        if (operand === '=') {
            // Nếu chỉ có một ô trong chuồng, giá trị phải bằng mục tiêu
            return values.length === cageCells.length ? values[0] === target : true;
        
        } else if (operand === '+') {
            // Tính tổng của các giá trị trong chuồng
            let sum = values.reduce((a, b) => a + b, 0);           
            // Chỉ kiểm tra khi đã đủ số ô
            return values.length === cageCells.length ? sum === target : true;
        
        } else if (operand === '-') {
            // Phép trừ chỉ áp dụng khi chuồng có đúng 2 ô
            if (values.length === 2) {
                return Math.abs(values[0] - values[1]) === target;
            }
            return values.length < cageCells.length; // Nếu chưa đủ số ô thì không so sánh
        
        } else if (operand === '*') {
            // Tính tích của các giá trị trong chuồng
            let product = values.reduce((a, b) => a * b, 1);
            // Chỉ kiểm tra khi đã đủ số ô
            return values.length === cageCells.length ? product === target : true;
        
        } else if (operand === '/') {
            // Phép chia chỉ áp dụng khi chuồng có đúng 2 ô
            if (values.length === 2) {
                let [maxVal, minVal] = [Math.max(...values), Math.min(...values)];
                // Kiểm tra thương số là số nguyên và bằng với mục tiêu
                return maxVal % minVal === 0 && (maxVal / minVal === target);
            }
            return values.length < cageCells.length; // Nếu chưa đủ số ô thì không so sánh
        }
        
        return true;
    }
    

    backtrack(0);
    if (!backtrack(0)) {
       alert("Không tìm thấy giải pháp cho bài toán KenKen.");
    }
}