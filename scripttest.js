document.addEventListener("DOMContentLoaded", function () {
    let data = [];
    const totalCount = document.getElementById("totalCount");
    const tableBody = document.getElementById("memberTable");
    const searchInput = document.getElementById("searchInput");
    const roleFilter = document.getElementById("roleFilter");

    const detailModal = document.getElementById("detailModal");
    const detailImage = document.getElementById("detailImage");
    const detailName = document.getElementById("detailName");
    const detailBirth = document.getElementById("detailBirth");
    const detailMajor = document.getElementById("detailMajor");
    const detailID = document.getElementById("detailID");
    const detailHome = document.getElementById("detailHome");
    const detailLive = document.getElementById("detailLive");
    const detailStart = document.getElementById("detailStart");

    document.querySelector(".close-detail").onclick = () => detailModal.style.display = "none";
    window.onclick = function (event) {
        if (event.target == detailModal) detailModal.style.display = "none";
    };

    async function loadCSV() {
        try {
            let response = await fetch('datatest.csv');
            let csvData = await response.text();

            if (!csvData) return;

            data = csvData
                .split(/\r?\n/)
                .filter(line => line.trim() !== "")
                .map(line => {
                    let cells = line.split(',').map(cell => cell.trim());
                    if (cells.length < 8) {
                        while (cells.length < 8) cells.push(""); // đảm bảo đủ 8 cột
                    }
                    if (!cells[7]) cells[7] = "default.jpg";
                    return cells;
                });

            renderTable(data);
        } catch (error) {
            console.error("🚨 Lỗi khi tải file CSV:", error);
        }
    }

    function renderTable(filteredData) {
        tableBody.innerHTML = "";

        filteredData.forEach(row => {
            const tr = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.textContent = row[0];
            nameCell.style.cursor = "pointer";
            nameCell.onclick = () => {
                detailName.textContent = row[0];
                detailID.textContent = row[1];
                detailMajor.textContent = row[2];
                detailImage.src = row[7] || "default.jpg";
                detailBirth.textContent = row[3] || "(chưa rõ)";
                detailHome.textContent = row[4] || "(chưa rõ)";
                detailLive.textContent = row[5] || "(chưa rõ)";
                detailStart.textContent = row[6] || "(chưa rõ)";
                detailModal.style.display = "block";
            };
            tr.appendChild(nameCell);

            const codeCell = document.createElement("td");
            codeCell.textContent = row[1];
            tr.appendChild(codeCell);

            const roleCell = document.createElement("td");
            roleCell.textContent = row[2];
            tr.appendChild(roleCell);

            tableBody.appendChild(tr);
        });

        updateTotalCount(filteredData.length);
    }

    function updateTotalCount(count) {
        totalCount.textContent = `Hiện có: ${count} sinh viên`;
    }

    function filterAndRender() {
        const keyword = searchInput.value.toLowerCase().trim();
        const selectedRole = roleFilter.value;

        const filtered = data.filter(row => {
            const matchKeyword = row.some(cell => cell.toLowerCase().includes(keyword));
            const matchRole = selectedRole === "" || row[2] === selectedRole;
            return matchKeyword && matchRole;
        });

        renderTable(filtered);
    }

    searchInput.addEventListener("input", filterAndRender);
    roleFilter.addEventListener("change", filterAndRender);

    loadCSV();
});