document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search");
  const filterSelect = document.getElementById("filter");
  const pingAllButton = document.getElementById("ping-all");
  const ipRows = document.querySelectorAll("#ip-table tr");

  // Copy IP to clipboard
  document.querySelectorAll(".copy-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const ip = btn.closest("tr").dataset.ip;
      navigator.clipboard.writeText(ip);
      btn.innerText = "Copied!";
      setTimeout(() => btn.innerText = "Copy", 1500);
    });
  });

  // Ping single IP
  function pingRow(row) {
    const ip = row.dataset.ip;
    const resultCell = row.querySelector(".ping-result");
    const ipText = row.querySelector(".ip-text");

    resultCell.innerText = "Pinging...";

    fetch(`/plugins/ip-pinger/ping/?ip=${ip}`)
      .then(res => res.json())
      .then(data => {
        resultCell.innerText = data.message;
        ipText.classList.remove("text-white", "text-success", "text-danger");

        if (data.status === "success") {
          ipText.classList.add("text-success");
          row.setAttribute("data-status", "responsive");
        } else {
          ipText.classList.add("text-danger");
          row.setAttribute("data-status", "nonresponsive");
        }
      })
      .catch(() => {
        resultCell.innerText = "Ping failed";
        ipText.classList.remove("text-white");
        ipText.classList.add("text-danger");
        row.setAttribute("data-status", "nonresponsive");
      });
  }

  // Add event to Ping buttons
  document.querySelectorAll(".ping-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      pingRow(row);
    });
  });

  // Search functionality
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    ipRows.forEach(row => {
      const ip = row.dataset.ip.toLowerCase();
      row.style.display = ip.includes(query) ? "" : "none";
    });
  });

  // Filter functionality
  filterSelect.addEventListener("change", () => {
    const filter = filterSelect.value;
    ipRows.forEach(row => {
      const status = row.getAttribute("data-status") || "notpinged";

      if (filter === "default" || filter === status) {
        row.style.display = "";
      } else {
        row.style.display = "none";
      }
    });
  });

  // Ping all IPs
  pingAllButton.addEventListener("click", async () => {
    for (const row of ipRows) {
      await pingRow(row);
    }
  });
});
