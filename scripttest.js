document.addEventListener("DOMContentLoaded", function () {
    let data = [];
    const totalCount = document.getElementById("totalCount");
    const tableBody = document.getElementById("memberTable");
    const searchInput = document.getElementById("searchInput");
    const roleFilter = document.getElementById("roleFilter");

    const detailModal = document.getElementById("detailModal");
    const detailImage = document.getElementById("detailImage");
    const detailName = document.getElementById("detailName");
    const detailID = document.getElementById("detailID");
    const detailMajor = document.getElementById("detailMajor");
    const detailBirth = document.getElementById("detailBirth");
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
                    while (cells.length < 8) cells.push(""); // đảm bảo đủ 8 cột
                    return cells;
                });

            applyFilters();
        } catch (error) {
            console.error("🚨 Lỗi khi tải file CSV:", error);
        }
    }

    function renderTable(filteredData) {
        if (!tableBody) return;

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
                detailBirth.textContent = row[3] || "(chưa rõ)";
                detailHome.textContent = row[4] || "(chưa rõ)";
                detailLive.textContent = row[5] || "(chưa rõ)";
                detailStart.textContent = row[6] || "(chưa rõ)";

                // Thêm xử lý ảnh: nếu không có thì gán ảnh mặc định
                let imgPath = row[7] && row[7] !== "" ? row[7] : "images/default.jpg";
                if (!imgPath.startsWith("images/") && imgPath !== "default.jpg") {
                    imgPath = "images/" + imgPath;
                }
                detailImage.src = imgPath;

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
        if (totalCount) {
            totalCount.textContent = `Hiện có: ${count} sinh viên`;
        }
    }

    function applyFilters() {
        const keyword = searchInput?.value.toLowerCase().trim() || "";
        const selectedRole = roleFilter?.value || "";

        const filtered = data.filter(row => {
            const matchName = keyword === "" || row[0].toLowerCase().includes(keyword) || row[1].toLowerCase().includes(keyword);
            const matchRole = selectedRole === "" || row[2] === selectedRole;
            return matchName && matchRole;
        });

        renderTable(filtered);
    }

    searchInput?.addEventListener("input", applyFilters);
    roleFilter?.addEventListener("change", applyFilters);

    // Không reload khi nhấn Enter trong ô tìm kiếm
    searchInput?.addEventListener("keypress", function (e) {
        if (e.key === "Enter") e.preventDefault();
    });

    loadCSV();
});
