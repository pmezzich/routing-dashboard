let allRequests = [];
let currentPage = 1;
const perPage = 20;

function closePopup(id) {
  document.getElementById(id).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('[data-page="member-search"]').addEventListener('click', () => {
    document.getElementById('member-popup').style.display = 'block';
  });

  document.querySelector('[data-page="dashboard"]').addEventListener('click', () => {
    loadRequests();
  });

  document.getElementById('settings-button').addEventListener('click', () => {
    document.getElementById('settings-popup').style.display = 'block';
  });

  document.getElementById('search-input').addEventListener('input', e => {
    filterRequests(e.target.value);
  });

  document.getElementById('refresh-button').addEventListener('click', loadRequests);

  loadRequests();
});

function loadRequests() {
  fetch('requests.json')
    .then(res => res.json())
    .then(data => {
      allRequests = data;
      currentPage = 1;
      displayPage(currentPage);
    });
}

function displayPage(page) {
  const container = document.getElementById('requests-container');
  const pagination = document.getElementById('pagination');
  container.innerHTML = '';
  pagination.innerHTML = '';

  const start = (page - 1) * perPage;
  const end = start + perPage;
  const current = allRequests.slice(start, end);

  current.forEach(req => {
    const div = document.createElement('div');
    div.innerHTML = \`<strong>\${req.title}</strong><br><small>\${req.company} (\${req.status})</small>\`;
    div.style = "background:white;margin:10px;padding:10px;border-left:5px solid var(--primary)";
    container.appendChild(div);
  });

  const totalPages = Math.ceil(allRequests.length / perPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      displayPage(i);
    };
    if (i === page) btn.style.fontWeight = "bold";
    pagination.appendChild(btn);
  }
}

function filterRequests(term) {
  const filtered = allRequests.filter(r =>
    r.title.toLowerCase().includes(term.toLowerCase()) ||
    r.company.toLowerCase().includes(term.toLowerCase())
  );
  const container = document.getElementById('requests-container');
  container.innerHTML = '';
  filtered.slice(0, perPage).forEach(req => {
    const div = document.createElement('div');
    div.innerHTML = \`<strong>\${req.title}</strong><br><small>\${req.company} (\${req.status})</small>\`;
    div.style = "background:white;margin:10px;padding:10px;border-left:5px solid var(--primary)";
    container.appendChild(div);
  });
}

function searchByMember() {
  const input = document.getElementById('member-search-input').value.toLowerCase();
  const filtered = allRequests.filter(r => r.company.toLowerCase().includes(input));
  document.getElementById('member-popup').style.display = 'none';
  allRequests = filtered;
  displayPage(1);
}
