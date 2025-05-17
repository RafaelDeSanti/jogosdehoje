const API_KEY = '4b6ee92fe9f84448909823f98864b12f';
const BASE_URL = 'https://app.sportdataapi.com/api/v1/soccer';
const ligas = [
  { id: 237, nome: 'Premier League' }, // Exemplo de ID de liga
  { id: 384, nome: 'La Liga' }         // Exemplo de ID de liga
];

function formatarData(d) {
  return d.toISOString().split('T')[0];
}

function renderizarJogo(jogo, container) {
  const div = document.createElement('div');
  div.className = 'jogo';

  const nomeLiga = jogo.competition_name;
  const nomeTime1 = jogo.home_team.name;
  const nomeTime2 = jogo.away_team.name;
  const dataHora = jogo.match_start;
  const placar = jogo.stats ? `${jogo.stats.home_score} x ${jogo.stats.away_score}` : 'vs';

  div.innerHTML = `
    <strong>${nomeTime1} ${placar} ${nomeTime2}</strong><br />
    <small>${nomeLiga} - ${dataHora}</small>
  `;

  container.appendChild(div);
}

async function buscarJogos(data, ligaId) {
  const url = `${BASE_URL}/matches?apikey=${API_KEY}&season_id=${ligaId}&date_from=${data}&date_to=${data}`;
  try {
    const resp = await fetch(url);
    const dados = await resp.json();
    return dados.data || [];
  } catch (e) {
    console.error('Erro ao buscar jogos:', e);
    return [];
  }
}

async function carregarJogos() {
  const hoje = new Date();
  const ultimosContainer = document.getElementById('ultimos-container');
  const proximosContainer = document.getElementById('proximos-container');

  for (let i = 7; i >= 1; i--) {
    const data = new Date(hoje);
    data.setDate(data.getDate() - i);
    const dataStr = formatarData(data);

    for (const liga of ligas) {
      const jogos = await buscarJogos(dataStr, liga.id);
      jogos.forEach(j => renderizarJogo(j, ultimosContainer));
    }
  }

  for (let i = 0; i < 7; i++) {
    const data = new Date(hoje);
    data.setDate(data.getDate() + i);
    const dataStr = formatarData(data);

    for (const liga of ligas) {
      const jogos = await buscarJogos(dataStr, liga.id);
      jogos.forEach(j => renderizarJogo(j, proximosContainer));
    }
  }
}

carregarJogos();
