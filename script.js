const API_BASE = "https://www.thesportsdb.com/api/v1/json/3";
const ligasFavoritas = JSON.parse(localStorage.getItem("ligasFavoritas") || "[]");

const exemploLigas = [
  "English Premier League",
  "Spanish La Liga",
  "Brasileirão Série A"
];

async function buscarJogos(tipo, data, liga) {
  const endpoint = tipo === "anterior"
    ? `${API_BASE}/eventsday.php?d=${data}&l=${encodeURIComponent(liga)}`
    : `${API_BASE}/eventsday.php?d=${data}&l=${encodeURIComponent(liga)}`;

  const resp = await fetch(endpoint);
  const dados = await resp.json();
  return dados.events || [];
}

function formatarData(d) {
  return d.toISOString().split("T")[0];
}

function renderizarJogo(jogo, container) {
  const div = document.createElement("div");
  div.className = "jogo";
  
  const nomeLiga = jogo.strLeague;
  const nomeTime1 = jogo.strHomeTeam;
  const nomeTime2 = jogo.strAwayTeam;
  const hora = jogo.strTime || "??:??";
  const placar = jogo.intHomeScore != null ? `${jogo.intHomeScore} x ${jogo.intAwayScore}` : "vs";

  if (ligasFavoritas.includes(nomeLiga)) {
    div.classList.add("favorito");
  }

  div.innerHTML = `
    <strong>${nomeTime1} ${placar} ${nomeTime2}</strong><br />
    <small>${nomeLiga} - ${hora}</small>
  `;

  container.appendChild(div);
}

async function carregarJogos() {
  const hoje = new Date();
  const ultimosContainer = document.getElementById("ultimos-container");
  const proximosContainer = document.getElementById("proximos-container");

  for (let i = 7; i >= 1; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const dataStr = formatarData(data);
    for (const liga of exemploLigas) {
      const jogos = await buscarJogos("anterior", dataStr, liga);
      jogos.forEach(j => renderizarJogo(j, ultimosContainer));
    }
  }

  for (let i = 0; i < 7; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);
    const dataStr = formatarData(data);
    for (const liga of exemploLigas) {
      const jogos = await buscarJogos("proximo", dataStr, liga);
      jogos.forEach(j => renderizarJogo(j, proximosContainer));
    }
  }
}

carregarJogos();
